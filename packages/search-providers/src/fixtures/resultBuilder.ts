import type { SearchResult } from "@facet/domain";
import type { ISO8601Timestamp, URLString } from "@facet/shared-types";

import { requireProvider } from "./catalog";

export function buildResult(input: {
  id: string;
  title: string;
  url: URLString;
  snippet?: string;
  providerKey: string;
  surfacedBy: string[];
  publishedAt?: ISO8601Timestamp;
  labels?: string[];
}): SearchResult {
  const provider = requireProvider(input.providerKey);
  const surfacedBy = input.surfacedBy.map(requireProvider);
  const result: SearchResult = {
    id: input.id,
    title: input.title,
    url: input.url,
    hostname: new URL(input.url).hostname,
    provider,
    provenance: {
      surfacedBy,
      commonality: {
        status: surfacedBy.length > 1 ? "shared" : "unique",
        providerCount: surfacedBy.length,
      },
    },
  };

  if (input.snippet) result.snippet = input.snippet;
  if (input.publishedAt) result.publishedAt = input.publishedAt;
  if (input.labels?.length) result.labels = input.labels;

  return result;
}

