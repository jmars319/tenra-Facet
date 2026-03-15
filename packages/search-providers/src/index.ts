import type { SearchQuery, SearchResult } from "@facet/domain";
import type { ISO8601Timestamp, URLString } from "@facet/shared-types";

export interface SearchProviderOptions {
  limit?: number;
  locale?: string;
  providerKeys?: string[];
}

export interface ProviderSearchResult {
  externalId?: string;
  title: string;
  url: URLString;
  snippet?: string;
  publishedAt?: ISO8601Timestamp;
  labels?: string[];
}

export interface SearchProvider {
  readonly key: string;
  readonly displayName: string;
  search(query: SearchQuery, options?: SearchProviderOptions): Promise<SearchResult[]>;
}

export interface MockSearchScenarioSummary {
  id: string;
  label: string;
  exampleQuery: string;
  note: string;
}

export { listMockSearchScenarios, mockProviderCatalog, searchMockResults } from "./fixtures";
