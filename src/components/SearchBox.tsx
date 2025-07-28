'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SearchResult, AddSynonymResponse } from '@/lib/types';

interface SearchBoxProps {
  onSearchResult: (result: SearchResult | null) => void;
}

export default function SearchBox({ onSearchResult }: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState(''); //trenutni unos
  const [isSearching, setIsSearching] = useState(false); //stanje učitavanja pretrage
  const [newWord, setNewWord] = useState(''); //polje za novu riječ u formi
  const [newSynonym, setNewSynonym] = useState(''); //polje za novi sinonim
  const [isAdding, setIsAdding] = useState(false); //stanje učitavanja za dodavanje
  const [message, setMessage] = useState(''); //poruke korisniku
  const debounceRef = useRef<NodeJS.Timeout | null>(null); //referenca na debounce timer

  // Search for synonyms
  const handleSearch = useCallback(async (word: string) => {
    if (!word.trim()) {
      onSearchResult(null);
      setMessage('');
      return;
    }

    setIsSearching(true);
    setMessage('');

    try {
      const response = await fetch(`/api/synonyms?word=${encodeURIComponent(word)}`);
      const data = await response.json();

      if (data.success) {
        onSearchResult(data.data);
        if (data.data.synonyms.length === 0) {
          setMessage(`No synonyms found for "${word}"`);
        }
      } else {
        setMessage(data.message || 'Search failed');
        onSearchResult(null);
      }
    } catch (error) {
      console.error('Error searching for synonyms:', error);
      setMessage('Error searching for synonyms');
      onSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  }, [onSearchResult]);

  const debouncedSearch = useCallback((searchValue: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (searchValue.trim() && searchValue.length <= 100) {
        handleSearch(searchValue);
      }
    }, 400);
  }, [handleSearch]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch(searchTerm);
    }
  };

  //handler unosa
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (!value.trim() || value.length > 100) {
      onSearchResult(null);
      setMessage('');
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    } else {
      debouncedSearch(value);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearchResult(null);
    setMessage('');
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  };

  const handleAddSynonym = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newWord.trim() || !newSynonym.trim()) {
      setMessage('Both word and synonym are required');
      return;
    }

    setIsAdding(true);
    setMessage('');

    try {
      const response = await fetch('/api/synonyms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: newWord.trim(),
          synonym: newSynonym.trim(),
        }),
      });

      const data: AddSynonymResponse = await response.json();

      if (data.success) {
        setMessage(data.message);
        setNewWord('');
        setNewSynonym('');
        if (searchTerm) {
          handleSearch(searchTerm);
        }
      } else {
        setMessage(data.message || 'Failed to add synonym');
      }
    } catch (error) {
      console.error('Error adding synonym:', error);
      setMessage('Error adding synonym');
    } finally {
      setIsAdding(false);
    }
  };

  return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Search Synonyms</h2>
        <div className="flex items-center space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Start typing to search synonyms..."
              className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-black focus:border-transparent outline-none transition-all"
            />
            {isSearching && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
              </div>
            )}
          </div>
          <button
            onClick={handleClear}
            className="bg-blue-400 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Clear
          </button>
        </div>
        {searchTerm && isSearching && (
          <p className="text-sm text-gray-500 mt-2">
            Searching for &quot;{searchTerm}&quot;...
          </p>
        )}
      </div>
      {/* Add Synonym Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Synonym Pair</h2>
        <form onSubmit={handleAddSynonym} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Word"
              className="px-4 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-black focus:border-transparent outline-none transition-all"
            />
            <input
              type="text"
              value={newSynonym}
              onChange={(e) => setNewSynonym(e.target.value)}
              placeholder="Synonym"
              className="px-4 py-3 border border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 text-black focus:border-transparent outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={isAdding}
            className="w-full bg-blue-600 hover:bg-blue-800 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isAdding ? 'Adding...' : 'Add Synonym Pair'}
          </button>
        </form>
      </div>
    {/* Message Display */}
    {message && (
      <div className={`p-4 rounded-lg ${
        message.includes('Successfully')
          ? 'bg-green-100 text-green-800 border border-green-200'
          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      }`}>
        {message}
      </div>
    )}
  </div>
  );
}