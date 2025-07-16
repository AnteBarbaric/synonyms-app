'use client';

import { useState } from 'react';
import SearchBox from '@/components/SearchBox';
import SynonymsList from '@/components/SynonymsList';
import { SearchResult } from '@/lib/types';

export default function HomePage() {
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  const handleSearchResult = (result: SearchResult | null) => {
    setSearchResult(result);
  };

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col">
      {/* Header */}
      <header className="bg-blue-800 shadow-sm text-center w-full p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-100 mb-2 font-serif">
          Synonyms Search Tool
        </h1>
      </header>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-8 flex-1">
        <div className="space-y-8">
          {/* Search Section */}
          <SearchBox onSearchResult={handleSearchResult} />
          {/* Results Section */}
          <SynonymsList result={searchResult} />
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-blue-800 ">
        <div className="p-2 md:p-4 text-center text-blue-100">
          <p>
              Ante Barbarić
          </p>
        </div>
      </footer>
    </div>
  );
}