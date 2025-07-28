export interface SynonymPair {
  word: string;
  synonym: string;
} // odnos izmedu dvije rijeci

export interface SearchResult {
  word: string;
  synonyms: string[];
} // Standardizirani format za vraćanje rezultata pretrage

export interface ApiResponse {
  success: boolean;
  data?: SearchResult;
  message?: string;
} // Standardizirani format odgovora API-ja s podrškom za greške

export interface AddSynonymRequest {
  word: string;
  synonym: string;
} // Definira što se očekuje kao ulaz pri dodavanju sinonima

export interface AddSynonymResponse {
  success: boolean;
  message: string;
} // Potvrđuje je li dodavanje bilo uspješno