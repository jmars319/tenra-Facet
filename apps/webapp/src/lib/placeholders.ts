import type { SearchQuery, SearchResult } from "@facet/domain";
import type { OrientationBlock } from "@facet/reframing";

export const placeholderQuery: SearchQuery = {
  id: "query_placeholder_01",
  text: "How should a person compare sources when exploring a public claim?",
  submittedAt: "2026-03-15T00:00:00.000Z",
  locale: "en-US"
};

export const placeholderResults: SearchResult[] = [
  {
    id: "result_placeholder_01",
    title: "Placeholder source card",
    snippet: "Future search providers will normalize results into this shared shape for review.",
    url: "https://example.com/source-a",
    provenance: {
      sourceId: "source_placeholder_01",
      providerKey: "provider:placeholder",
      publisher: "Example Publisher",
      retrievedAt: "2026-03-15T00:00:00.000Z",
      url: "https://example.com/source-a"
    }
  },
  {
    id: "result_placeholder_02",
    title: "Second source with different framing",
    snippet: "Future provenance and deduplication logic will sit above provider-specific integrations.",
    url: "https://example.com/source-b",
    provenance: {
      sourceId: "source_placeholder_02",
      providerKey: "provider:placeholder",
      publisher: "Reference Journal",
      retrievedAt: "2026-03-15T00:00:00.000Z",
      url: "https://example.com/source-b"
    }
  }
];

export const placeholderOrientations: OrientationBlock[] = [
  {
    id: "orientation_placeholder_01",
    mode: "broaden",
    title: "Broaden the frame",
    prompt: "What adjacent questions should be examined before treating the claim as settled?"
  },
  {
    id: "orientation_placeholder_02",
    mode: "challenge",
    title: "Challenge the frame",
    prompt: "What evidence would complicate the strongest quick conclusion a user might jump to?"
  }
];
