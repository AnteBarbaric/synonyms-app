import { SearchResult } from './types';

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

    // Get all existing synonyms for both words before adding the new connection
    const word1Group = this.getAllSynonymsInGroup(normalizedWord);
    const word2Group = this.getAllSynonymsInGroup(normalizedSynonym);

    // Combine both groups + the original words
    const allWords = new Set([
      normalizedWord,
      normalizedSynonym,
      ...word1Group,
      ...word2Group
    ]);

    // Connect every word to every other word in the combined group
    this.connectAllWords(allWords);
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

  private getAllSynonymsInGroup(word: string): Set<string> {
    const visited = new Set<string>();
    const toVisit = [word];
    
    while (toVisit.length > 0) {
      const currentWord = toVisit.pop()!;
      
      if (visited.has(currentWord)) {
        continue;
      }
      
      visited.add(currentWord);
      
      // Get direct synonyms of current word
      const directSynonyms = this.synonyms.get(currentWord) || new Set();
      
      // Add unvisited synonyms to the queue
      directSynonyms.forEach(synonym => {
        if (!visited.has(synonym)) {
          toVisit.push(synonym);
        }
      });
    }
    
    // Remove the original word from the result
    visited.delete(word);
    return visited;
  }

  private connectAllWords(words: Set<string>): void {
    const wordArray = Array.from(words);
    
    // For each word, connect it to all other words
    for (let i = 0; i < wordArray.length; i++) {
      for (let j = 0; j < wordArray.length; j++) {
        if (i !== j) {
          this.addToMap(wordArray[i], wordArray[j]);
        }
      }
    }
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