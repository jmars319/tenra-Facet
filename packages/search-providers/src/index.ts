import type { SearchQuery, SearchResult } from "@facet/domain";
import type { ISO8601Timestamp, URLString } from "@facet/shared-types";

/**
 * Future seam for multi-provider search aggregation. Provider-specific
 * integration should stay here so Facet can normalize, deduplicate,
 * and preserve provenance in one place later.
 */
export interface SearchProviderOptions {
  limit?: number;
  locale?: string;
}

export interface ProviderSearchResult {
  externalId?: string;
  title: string;
  url: URLString;
  snippet?: string;
  publisher?: string;
  rank?: number;
  retrievedAt: ISO8601Timestamp;
}

export interface NormalizedSearchResult extends SearchResult {
  providerKey: string;
  rawResultId?: string;
}

export interface SearchProvider {
  readonly key: string;
  readonly displayName: string;
  search(query: SearchQuery, options?: SearchProviderOptions): Promise<ProviderSearchResult[]>;
  normalize(result: ProviderSearchResult, query: SearchQuery): NormalizedSearchResult;
}
