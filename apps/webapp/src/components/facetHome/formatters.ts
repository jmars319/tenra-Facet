import type { SearchResult } from "@facet/domain";

export function formatPublishedDate(publishedAt?: string): string | null {
  if (!publishedAt) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(publishedAt));
}

export function formatCommonality(result: SearchResult): string {
  const { commonality } = result.provenance;

  if (commonality.status === "shared") {
    return `Shared across ${commonality.providerCount} providers`;
  }

  return `Unique to ${result.provider.label}`;
}

export function surfacedByLine(result: SearchResult): string {
  return result.provenance.surfacedBy.map((provider) => provider.label).join(", ");
}

