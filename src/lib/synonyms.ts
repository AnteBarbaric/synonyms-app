import { SynonymPair, SearchResult } from './types';

// In-memory storage using Map for O(1) lookups
class SynonymsStore {
  private synonyms: Map<string, Set<string>> = new Map();

  constructor() {
    // Initialize with some sample data
    this.addSynonymPair('happy', 'joyful');
    this.addSynonymPair('happy', 'glad');
    this.addSynonymPair('sad', 'unhappy');
    this.addSynonymPair('big', 'large');
    this.addSynonymPair('small', 'tiny');
    this.addSynonymPair('fast', 'quick');
    this.addSynonymPair('clean', 'wash');
  }

  // Add a synonym pair (bidirectional)
  addSynonymPair(word: string, synonym: string): void {
    const normalizedWord = word.toLowerCase().trim();
    const normalizedSynonym = synonym.toLowerCase().trim();

    if (!normalizedWord || !normalizedSynonym) {
      throw new Error('Word and synonym cannot be empty');
    }

    if (normalizedWord === normalizedSynonym) {
      throw new Error('Word and synonym cannot be the same');
    }

    // Add bidirectional relationship
    this.addToMap(normalizedWord, normalizedSynonym);
    this.addToMap(normalizedSynonym, normalizedWord);

    // Apply transitive rules (bonus feature)
    this.applyTransitiveRules(normalizedWord, normalizedSynonym);
  }

  // Search for synonyms of a word
  searchSynonyms(word: string): SearchResult {
    const normalizedWord = word.toLowerCase().trim();
    const synonyms = this.synonyms.get(normalizedWord) || new Set();
    
    return {
      word: normalizedWord,
      synonyms: Array.from(synonyms).sort()
    };
  }

  // Get all words in the system
  getAllWords(): string[] {
    return Array.from(this.synonyms.keys()).sort();
  }

  // Private helper methods
  private addToMap(word: string, synonym: string): void {
    if (!this.synonyms.has(word)) {
      this.synonyms.set(word, new Set());
    }
    this.synonyms.get(word)!.add(synonym);
  }

  // Bonus: Transitive rules - if A->B and B->C, then A->C
  private applyTransitiveRules(word1: string, word2: string): void {
    const word1Synonyms = this.synonyms.get(word1) || new Set();
    const word2Synonyms = this.synonyms.get(word2) || new Set();

    // Add all of word2's synonyms to word1
    word2Synonyms.forEach(synonym => {
      if (synonym !== word1) {
        this.addToMap(word1, synonym);
        this.addToMap(synonym, word1);
      }
    });

    // Add all of word1's synonyms to word2
    word1Synonyms.forEach(synonym => {
      if (synonym !== word2) {
        this.addToMap(word2, synonym);
        this.addToMap(synonym, word2);
      }
    });

    // Update all existing synonyms with the new connections
    const allRelatedWords = new Set([word1, word2, ...word1Synonyms, ...word2Synonyms]);
    
    allRelatedWords.forEach(wordA => {
      allRelatedWords.forEach(wordB => {
        if (wordA !== wordB) {
          this.addToMap(wordA, wordB);
        }
      });
    });
  }
}

// Create singleton instance
const synonymsStore = new SynonymsStore();

// Export functions for use in API routes
export const addSynonym = (word: string, synonym: string): void => {
  synonymsStore.addSynonymPair(word, synonym);
};

export const searchSynonyms = (word: string): SearchResult => {
  return synonymsStore.searchSynonyms(word);
};

export const getAllWords = (): string[] => {
  return synonymsStore.getAllWords();
};