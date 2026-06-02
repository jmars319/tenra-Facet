"use client";

import type { FormEvent } from "react";
import type { MockSearchScenarioSummary } from "@facet/search-providers";
import { colors, radii, spacing } from "@facet/ui";

import type { FacetHomeState } from "./useFacetHomeState";
import { panelStyle, pillStyle, sectionTitleStyle } from "./styles";

type FacetQuerySectionProps = {
  home: FacetHomeState;
  scenarios: MockSearchScenarioSummary[];
};

export function FacetQuerySection({ home, scenarios }: FacetQuerySectionProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    home.submitQuery(home.input);
  }

  return (
    <section
      style={{
        ...panelStyle,
        display: "grid",
        gap: `${spacing.md}px`,
        marginBottom: `${spacing.lg}px`,
        padding: `${spacing.lg}px`,
      }}
    >
      <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: `${spacing.sm}px` }}>
        <h2 style={sectionTitleStyle}>Query</h2>
        <span style={pillStyle}>{home.resultCountLabel}</span>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: `${spacing.sm}px` }}>
        <label htmlFor="query" style={{ color: colors.muted, fontSize: "0.95rem" }}>
          Search prompt
        </label>
        <div style={{ display: "grid", gap: `${spacing.sm}px`, gridTemplateColumns: "minmax(0, 1fr) auto" }}>
          <input
            id="query"
            name="query"
            onChange={(event) => home.setInput(event.target.value)}
            placeholder="Ask a question to review"
            style={{
              backgroundColor: "#fffef8",
              border: `1px solid ${colors.border}`,
              borderRadius: radii.md,
              color: colors.ink,
              minHeight: "3.25rem",
              padding: `${spacing.md}px`,
            }}
            value={home.input}
          />
          <button
            disabled={home.isPending}
            style={{
              backgroundColor: colors.accent,
              border: "none",
              borderRadius: radii.md,
              color: "#fffef8",
              cursor: home.isPending ? "progress" : "pointer",
              minHeight: "3.25rem",
              padding: `0 ${spacing.lg}px`,
            }}
            type="submit"
          >
            {home.isPending ? "Inspecting..." : "Inspect"}
          </button>
        </div>
      </form>

      <div style={{ display: "grid", gap: `${spacing.sm}px` }}>
        <div style={{ color: colors.muted, fontSize: "0.95rem" }}>Representative scenarios</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing.sm}px` }}>
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => home.submitQuery(scenario.exampleQuery)}
              style={{
                ...pillStyle,
                backgroundColor: home.state.search.query.text === scenario.exampleQuery ? "#edf5f2" : "transparent",
                cursor: "pointer",
              }}
              type="button"
            >
              {scenario.label}
            </button>
          ))}
        </div>
        <div style={{ color: colors.muted, fontSize: "0.92rem", lineHeight: 1.6 }}>
          {scenarios.find((scenario) => scenario.exampleQuery === home.state.search.query.text)?.note ??
            "Choose a scenario to review the full result flow."}
        </div>
      </div>

      {home.error ? (
        <div
          style={{
            backgroundColor: "#fbf0eb",
            border: `1px solid ${colors.border}`,
            borderRadius: radii.md,
            color: colors.ink,
            padding: `${spacing.md}px`,
          }}
        >
          {home.error}
        </div>
      ) : null}
    </section>
  );
}

