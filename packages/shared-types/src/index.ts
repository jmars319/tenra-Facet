export type FacetId = string;
export type ISO8601Timestamp = string;
export type URLString = string;

export interface SourceReference {
  id: FacetId;
  title: string;
  url: URLString;
  publisher?: string;
  retrievedAt: ISO8601Timestamp;
  snippet?: string;
}

export interface ResultReference {
  id: FacetId;
  title: string;
  url: URLString;
  snippet?: string;
}

export interface ReframingReference {
  id: FacetId;
  label: string;
  prompt: string;
}
