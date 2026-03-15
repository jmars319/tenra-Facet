import type {
  FacetId,
  HostnameString,
  ISO8601Timestamp,
  URLString
} from "@facet/shared-types";

export type SafetyDisposition = "allow" | "review" | "redirect" | "refuse";
export type ResultCommonalityStatus = "unique" | "shared";

export interface SearchQuery {
  id: FacetId;
  text: string;
  submittedAt: ISO8601Timestamp;
  locale?: string;
}

export interface SearchProviderReference {
  key: string;
  label: string;
}

export interface ResultCommonality {
  status: ResultCommonalityStatus;
  providerCount: number;
}

export interface ResultProvenance {
  surfacedBy: SearchProviderReference[];
  commonality: ResultCommonality;
}

export interface SearchResult {
  id: FacetId;
  title: string;
  url: URLString;
  hostname: HostnameString;
  snippet?: string;
  provider: SearchProviderReference;
  publishedAt?: ISO8601Timestamp;
  provenance: ResultProvenance;
  labels?: string[];
}
