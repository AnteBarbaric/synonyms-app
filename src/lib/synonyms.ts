import { SynonymPair, SearchResult } from './types';

class SynonymsStore {
  private synonyms: Map<string, Set<string>> = new Map();

  constructor() {
    this.addSynonymPair('happy', 'joyful');
    this.addSynonymPair('happy', 'glad');
    this.addSynonymPair('sad', 'unhappy');
    this.addSynonymPair('big', 'large');
    this.addSynonymPair('small', 'tiny');
    this.addSynonymPair('fast', 'quick');
    this.addSynonymPair('clean', 'wash');
  }

  addSynonymPair(word: string, synonym: string): void {
    const normalizedWord = word.toLowerCase().trim();
    const normalizedSynonym = synonym.toLowerCase().trim();

    if (!normalizedWord || !normalizedSynonym) {
      throw new Error('Word and synonym cannot be empty');
    }

    if (normalizedWord === normalizedSynonym) {
      throw new Error('Word and synonym cannot be the same');
    }

    this.addToMap(normalizedWord, normalizedSynonym);
    this.addToMap(normalizedSynonym, normalizedWord);

    this.applyTransitiveRules(normalizedWord, normalizedSynonym);
  }

  searchSynonyms(word: string): SearchResult {
    const normalizedWord = word.toLowerCase().trim();
    const synonyms = this.synonyms.get(normalizedWord) || new Set();
    
    return {
      word: normalizedWord,
      synonyms: Array.from(synonyms).sort()
    };
  }

  getAllWords(): string[] {
    return Array.from(this.synonyms.keys()).sort();
  }

  private addToMap(word: string, synonym: string): void {
    if (!this.synonyms.has(word)) {
      this.synonyms.set(word, new Set());
    }
    this.synonyms.get(word)!.add(synonym);
  }

  private applyTransitiveRules(word1: string, word2: string): void {
    const word1Synonyms = this.synonyms.get(word1) || new Set();
    const word2Synonyms = this.synonyms.get(word2) || new Set();

    word2Synonyms.forEach(synonym => {
      if (synonym !== word1) {
        this.addToMap(word1, synonym);
        this.addToMap(synonym, word1);
      }
    });

    word1Synonyms.forEach(synonym => {
      if (synonym !== word2) {
        this.addToMap(word2, synonym);
        this.addToMap(synonym, word2);
      }
    });
  }
}

const synonymsStore = new SynonymsStore();

export const addSynonym = (word: string, synonym: string): void => {
  synonymsStore.addSynonymPair(word, synonym);
};

export const searchSynonyms = (word: string): SearchResult => {
  return synonymsStore.searchSynonyms(word);
};

export const getAllWords = (): string[] => {
  return synonymsStore.getAllWords();
};