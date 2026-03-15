import type { ReframingResponse, SearchResponse } from "@facet/api-contracts";
import type { SearchQuery } from "@facet/domain";
import { orientWithMockLayer } from "@facet/reframing";
import { listMockSearchScenarios, searchMockResults } from "@facet/search-providers";
import { reframingResponseSchema, searchResponseSchema } from "@facet/validation";

export type MockScenarioSummary = ReturnType<typeof listMockSearchScenarios>[number];

export interface FacetMockState {
  search: SearchResponse;
  reframing: ReframingResponse;
}

export const mockScenarioSummaries = listMockSearchScenarios();
const initialMockQuery = mockScenarioSummaries[0]?.exampleQuery ?? "";

function buildSearchQuery(text: string): SearchQuery {
  const normalizedId =
    text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 40) || "query";

  return {
    id: `query_${normalizedId}`,
    text: text.trim(),
    submittedAt: new Date().toISOString(),
    locale: "en-US"
  };
}

export async function runMockFacetFlow(text: string): Promise<FacetMockState> {
  const query = buildSearchQuery(text);
  const results = await searchMockResults(query, { limit: 5 });
  const block = await orientWithMockLayer({ query });

  const search = searchResponseSchema.parse({
    query,
    results,
    safetyDisposition: "allow"
  }) as SearchResponse;

  const reframing = reframingResponseSchema.parse({
    query,
    block,
    safetyDisposition: "allow"
  }) as ReframingResponse;

  return { search, reframing };
}

export async function getInitialFacetMockState(): Promise<FacetMockState> {
  return runMockFacetFlow(initialMockQuery);
}
