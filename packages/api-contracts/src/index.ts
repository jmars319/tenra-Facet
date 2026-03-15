import type {
  ReframingPrompt,
  SearchQuery,
  SearchResult,
  SafetyDisposition
} from "@facet/domain";
import type {
  FollowupPrompt,
  OrientationBlock,
  ReframingMode
} from "@facet/reframing";

export interface SearchRequest {
  query: SearchQuery;
  limit?: number;
  providerKeys?: string[];
}

export interface SearchResponse {
  query: SearchQuery;
  results: SearchResult[];
  nextCursor?: string;
  safetyDisposition: SafetyDisposition;
}

export interface ReframingRequest {
  query: SearchQuery;
  modes?: ReframingMode[];
}

export interface ReframingResponse {
  query: SearchQuery;
  blocks: OrientationBlock[];
  followups: FollowupPrompt[];
  prompts?: ReframingPrompt[];
  safetyDisposition: SafetyDisposition;
}
