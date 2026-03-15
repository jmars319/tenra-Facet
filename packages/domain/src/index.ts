import type { FacetId, ISO8601Timestamp, URLString } from "@facet/shared-types";

export type SafetyDisposition = "allow" | "review" | "redirect" | "refuse";

export interface SearchQuery {
  id: FacetId;
  text: string;
  submittedAt: ISO8601Timestamp;
  locale?: string;
}

export interface SourceProvenance {
  sourceId: FacetId;
  providerKey: string;
  url: URLString;
  publisher?: string;
  retrievedAt: ISO8601Timestamp;
}

export interface SearchResult {
  id: FacetId;
  title: string;
  snippet?: string;
  url: URLString;
  provenance: SourceProvenance;
}

export interface ReframingPrompt {
  id: FacetId;
  mode: "broaden" | "compare" | "challenge" | "contextualize";
  title: string;
  prompt: string;
}
