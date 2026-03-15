import type { SearchRequest } from "@facet/api-contracts";

export function buildFacetSearchRequest(text: string): SearchRequest {
  const normalizedId =
    text
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 40) || "query";

  return {
    query: {
      id: `query_${normalizedId}`,
      text: text.trim(),
      submittedAt: new Date().toISOString(),
      locale: "en-US"
    },
    limit: 5
  };
}
