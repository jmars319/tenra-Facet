import type { FacetSearchResponse } from "@facet/api-contracts";
import { facetSearchResponseSchema } from "@facet/validation";

import { buildFacetSearchRequest } from "./facet-search-request";

export async function fetchFacetSearch(text: string): Promise<FacetSearchResponse> {
  const response = await fetch("/api/facet/search", {
    body: JSON.stringify(buildFacetSearchRequest(text)),
    headers: {
      "content-type": "application/json"
    },
    method: "POST"
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      typeof payload?.error === "string" ? payload.error : "tenra Facet search could not be completed."
    );
  }

  return facetSearchResponseSchema.parse(payload) as FacetSearchResponse;
}
