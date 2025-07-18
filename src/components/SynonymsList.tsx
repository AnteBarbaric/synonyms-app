'use client';

import { SearchResult } from '@/lib/types';

interface SynonymsListProps {
  result: SearchResult | null;
}

export default function SynonymsList({ result }: SynonymsListProps) {
  if (!result) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">Type a word in the search box above to find its synonyms</p>
        </div>
      </div>
    );
  }

  if (result.synonyms.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600 mb-4">
            Try adding some synonyms using the form above, or search for a different word.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Synonyms for &quot;{result.word}&quot;
          </h3>
          <p className="text-sm text-gray-600">
            Found {result.synonyms.length} synonym{result.synonyms.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {result.synonyms.map((synonym, index) => (
            <div
              key={index}
              className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-3 transition-colors"
              onClick={() => navigator.clipboard.writeText(synonym)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-blue-800">{synonym}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}