import type { FacetSearchResponse, SearchRequest } from "@facet/api-contracts";
import { orientWithMockLayer } from "@facet/reframing";
import type { SearchProviderOptions } from "@facet/search-providers";
import { listMockSearchScenarios, searchMockResults } from "@facet/search-providers";
import { facetSearchResponseSchema, searchRequestSchema } from "@facet/validation";

export const facetMockScenarioSummaries = listMockSearchScenarios();
export const defaultFacetMockQuery = facetMockScenarioSummaries[0]?.exampleQuery ?? "";

export async function runFacetSearch(rawRequest: unknown): Promise<FacetSearchResponse> {
  const request = searchRequestSchema.parse(rawRequest) as SearchRequest;
  const searchOptions: SearchProviderOptions = {};

  if (request.limit !== undefined) {
    searchOptions.limit = request.limit;
  }

  if (request.query.locale) {
    searchOptions.locale = request.query.locale;
  }

  if (request.providerKeys?.length) {
    searchOptions.providerKeys = request.providerKeys;
  }

  const results = await searchMockResults(request.query, searchOptions);
  const block = await orientWithMockLayer({ query: request.query });

  return facetSearchResponseSchema.parse({
    search: {
      query: request.query,
      results,
      safetyDisposition: "allow"
    },
    reframing: {
      query: request.query,
      block,
      safetyDisposition: "allow"
    }
  }) as FacetSearchResponse;
}
