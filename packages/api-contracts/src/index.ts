import type { SearchQuery, SearchResult, SafetyDisposition } from "@facet/domain";
import type { OrientationBlock, ReframingMode } from "@facet/reframing";

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
  block: OrientationBlock;
  safetyDisposition: SafetyDisposition;
}

export interface FacetSearchResponse {
  search: SearchResponse;
  reframing: ReframingResponse;
}

export type FacetOrientationPacketConsumer =
  | "derive"
  | "assembly"
  | "sentinel"
  | "manual";

export interface FacetOrientationPacket {
  schema: "tenra-facet.orientation-packet.v1";
  exportedAt: string;
  sourceApp: "facet";
  query: SearchQuery;
  response: FacetSearchResponse;
  handoff: {
    recommendedNextApp: FacetOrientationPacketConsumer;
    prompt: string;
    notes: string[];
  };
}

export function buildFacetOrientationPacket(input: {
  response: FacetSearchResponse;
  exportedAt?: string | undefined;
  recommendedNextApp?: FacetOrientationPacketConsumer | undefined;
  notes?: string[] | undefined;
}): FacetOrientationPacket {
  const block = input.response.reframing.block;

  return {
    schema: "tenra-facet.orientation-packet.v1",
    exportedAt: input.exportedAt ?? new Date().toISOString(),
    sourceApp: "facet",
    query: input.response.search.query,
    response: input.response,
    handoff: {
      recommendedNextApp: input.recommendedNextApp ?? "derive",
      prompt: [
        block.heading,
        block.line,
        ...block.followups.map((followup) => followup.prompt)
      ]
        .filter(Boolean)
        .join("\n"),
      notes: input.notes ?? ["Preserve result provenance, commonality, and uncertainty."]
    }
  };
}
