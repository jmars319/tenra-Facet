"use client";

import type { FacetSearchResponse } from "@facet/api-contracts";
import type { MockSearchScenarioSummary } from "@facet/search-providers";
import { spacing } from "@facet/ui";

import { FacetHero } from "./facetHome/FacetHero";
import { FacetOrientationSection } from "./facetHome/FacetOrientationSection";
import { FacetQuerySection } from "./facetHome/FacetQuerySection";
import { FacetResultsSection } from "./facetHome/FacetResultsSection";
import { useFacetHomeState } from "./facetHome/useFacetHomeState";

export function FacetHome(props: {
  initialState: FacetSearchResponse;
  scenarios: MockSearchScenarioSummary[];
}) {
  const home = useFacetHomeState(props.initialState);

  return (
    <main
      style={{
        margin: "0 auto",
        maxWidth: "72rem",
        padding: `${spacing.xl * 2}px ${spacing.lg}px ${spacing.xl * 3}px`,
      }}
    >
      <FacetHero />
      <FacetQuerySection home={home} scenarios={props.scenarios} />
      <section
        style={{
          display: "grid",
          gap: `${spacing.lg}px`,
          gridTemplateColumns: "repeat(auto-fit, minmax(19rem, 1fr))",
        }}
      >
        <FacetResultsSection results={home.state.search.results} />
        <FacetOrientationSection home={home} />
      </section>
    </main>
  );
}
