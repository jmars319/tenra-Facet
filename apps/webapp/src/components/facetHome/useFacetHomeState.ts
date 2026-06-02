"use client";

import { useState, useTransition } from "react";
import { buildFacetOrientationPacket, type FacetSearchResponse } from "@facet/api-contracts";

import { fetchFacetSearch } from "../../lib/facet-search-client";

export function useFacetHomeState(initialState: FacetSearchResponse) {
  const [input, setInput] = useState(initialState.search.query.text);
  const [state, setState] = useState(initialState);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submitQuery(nextQuery: string) {
    const trimmedQuery = nextQuery.trim();
    if (!trimmedQuery) return;

    setInput(trimmedQuery);
    setError(null);

    startTransition(async () => {
      try {
        setState(await fetchFacetSearch(trimmedQuery));
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "The local Facet preview could not be loaded.");
      }
    });
  }

  const resultCountLabel =
    state.search.results.length > 0
      ? `${state.search.results.length} local preview results`
      : "No built-in scenario matched";
  const orientationPacket = buildFacetOrientationPacket({ response: state });

  return {
    error,
    input,
    isPending,
    orientationPacket,
    resultCountLabel,
    setInput,
    state,
    submitQuery,
  };
}

export type FacetHomeState = ReturnType<typeof useFacetHomeState>;

