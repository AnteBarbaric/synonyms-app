export interface SynonymPair {
  word: string;
  synonym: string;
}

export interface SearchResult {
  word: string;
  synonyms: string[];
}

export interface ApiResponse {
  success: boolean;
  data?: SearchResult;
  message?: string;
}

export interface AddSynonymRequest {
  word: string;
  synonym: string;
}

export interface AddSynonymResponse {
  success: boolean;
  message: string;
}