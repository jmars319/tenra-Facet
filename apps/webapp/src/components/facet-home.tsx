"use client";

import type { CSSProperties, FormEvent } from "react";
import { useState, useTransition } from "react";
import type { FacetSearchResponse } from "@facet/api-contracts";
import { APP_NAME } from "@facet/config";
import type { SearchResult } from "@facet/domain";
import type { MockSearchScenarioSummary } from "@facet/search-providers";
import { colors, radii, spacing } from "@facet/ui";

import { fetchFacetSearch } from "../lib/facet-search-client";

const panelStyle: CSSProperties = {
  backgroundColor: colors.panel,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.lg
};

const pillStyle: CSSProperties = {
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  color: colors.muted,
  display: "inline-flex",
  fontSize: "0.85rem",
  gap: "0.4rem",
  padding: "0.35rem 0.65rem"
};

const sectionTitleStyle: CSSProperties = {
  fontSize: "1rem",
  letterSpacing: "0.06em",
  margin: 0,
  textTransform: "uppercase"
};

function formatPublishedDate(publishedAt?: string): string | null {
  if (!publishedAt) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(publishedAt));
}

function formatCommonality(result: SearchResult): string {
  const { commonality } = result.provenance;

  if (commonality.status === "shared") {
    return `Shared across ${commonality.providerCount} providers`;
  }

  return `Unique to ${result.provider.label}`;
}

function surfacedByLine(result: SearchResult): string {
  return result.provenance.surfacedBy.map((provider) => provider.label).join(", ");
}

export function FacetHome(props: {
  initialState: FacetSearchResponse;
  scenarios: MockSearchScenarioSummary[];
}) {
  const [input, setInput] = useState(props.initialState.search.query.text);
  const [state, setState] = useState(props.initialState);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submitQuery(nextQuery: string) {
    const trimmedQuery = nextQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    setInput(trimmedQuery);
    setError(null);

    startTransition(async () => {
      try {
        const nextState = await fetchFacetSearch(trimmedQuery);
        setState(nextState);
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "The mocked tenra Facet flow could not be loaded."
        );
      }
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submitQuery(input);
  }

  const resultCountLabel =
    state.search.results.length > 0
      ? `${state.search.results.length} mocked results`
      : "No mock scenario matched";

  return (
    <main
      style={{
        margin: "0 auto",
        maxWidth: "72rem",
        padding: `${spacing.xl * 2}px ${spacing.lg}px ${spacing.xl * 3}px`
      }}
    >
      <section
        style={{
          display: "grid",
          gap: `${spacing.lg}px`,
          marginBottom: `${spacing.xl * 1.5}px`
        }}
      >
        <span style={pillStyle}>
          <span>Active shell: web</span>
          <span>Mock vertical slice</span>
        </span>
        <div style={{ display: "grid", gap: `${spacing.md}px`, maxWidth: "48rem" }}>
          <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5.25rem)", lineHeight: 0.95, margin: 0 }}>
            {APP_NAME} shows results and perspective without deciding for the user.
          </h1>
          <p style={{ color: colors.muted, fontSize: "1.1rem", lineHeight: 1.7, margin: 0 }}>
            This slice is fixture-backed only. It demonstrates a canonical normalized result model,
            explicit provider provenance, and one constrained orientation block without live search
            or live LLM behavior.
          </p>
        </div>
      </section>

      <section
        style={{
          ...panelStyle,
          display: "grid",
          gap: `${spacing.md}px`,
          marginBottom: `${spacing.lg}px`,
          padding: `${spacing.lg}px`
        }}
      >
        <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: `${spacing.sm}px` }}>
          <h2 style={sectionTitleStyle}>Query</h2>
          <span style={pillStyle}>{resultCountLabel}</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: `${spacing.sm}px` }}>
          <label htmlFor="query" style={{ color: colors.muted, fontSize: "0.95rem" }}>
            Search prompt
          </label>
          <div
            style={{
              display: "grid",
              gap: `${spacing.sm}px`,
              gridTemplateColumns: "minmax(0, 1fr) auto"
            }}
          >
            <input
              id="query"
              name="query"
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a question to inspect"
              style={{
                backgroundColor: "#fffef8",
                border: `1px solid ${colors.border}`,
                borderRadius: radii.md,
                color: colors.ink,
                minHeight: "3.25rem",
                padding: `${spacing.md}px`
              }}
              value={input}
            />
            <button
              disabled={isPending}
              style={{
                backgroundColor: colors.accent,
                border: "none",
                borderRadius: radii.md,
                color: "#fffef8",
                cursor: isPending ? "progress" : "pointer",
                minHeight: "3.25rem",
                padding: `0 ${spacing.lg}px`
              }}
              type="submit"
            >
              {isPending ? "Inspecting..." : "Inspect"}
            </button>
          </div>
        </form>

        <div style={{ display: "grid", gap: `${spacing.sm}px` }}>
          <div style={{ color: colors.muted, fontSize: "0.95rem" }}>Representative mock scenarios</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing.sm}px` }}>
            {props.scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => submitQuery(scenario.exampleQuery)}
                style={{
                  ...pillStyle,
                  backgroundColor:
                    state.search.query.text === scenario.exampleQuery ? "#edf5f2" : "transparent",
                  cursor: "pointer"
                }}
                type="button"
              >
                {scenario.label}
              </button>
            ))}
          </div>
          <div style={{ color: colors.muted, fontSize: "0.92rem", lineHeight: 1.6 }}>
            {props.scenarios.find((scenario) => scenario.exampleQuery === state.search.query.text)?.note ??
              "Try one of the scenario buttons to run the mocked slice end to end."}
          </div>
        </div>

        {error ? (
          <div
            style={{
              backgroundColor: "#fbf0eb",
              border: `1px solid ${colors.border}`,
              borderRadius: radii.md,
              color: colors.ink,
              padding: `${spacing.md}px`
            }}
          >
            {error}
          </div>
        ) : null}
      </section>

      <section
        style={{
          display: "grid",
          gap: `${spacing.lg}px`,
          gridTemplateColumns: "repeat(auto-fit, minmax(19rem, 1fr))"
        }}
      >
        <div style={{ display: "grid", gap: `${spacing.md}px` }}>
          <h2 style={sectionTitleStyle}>Results</h2>

          {state.search.results.length > 0 ? (
            state.search.results.map((result) => (
              <article
                key={result.id}
                style={{
                  ...panelStyle,
                  display: "grid",
                  gap: `${spacing.sm}px`,
                  padding: `${spacing.lg}px`
                }}
              >
                <div style={{ alignItems: "center", display: "flex", flexWrap: "wrap", gap: `${spacing.sm}px` }}>
                  <span style={pillStyle}>From {result.provider.label}</span>
                  <span style={pillStyle}>{formatCommonality(result)}</span>
                </div>
                <div style={{ color: colors.muted, fontSize: "0.85rem", lineHeight: 1.5 }}>
                  Surfaced by {surfacedByLine(result)}
                </div>
                <h3 style={{ fontSize: "1.15rem", margin: 0 }}>{result.title}</h3>
                <p style={{ color: colors.muted, lineHeight: 1.7, margin: 0 }}>
                  {result.snippet ?? "No snippet available in this mock fixture."}
                </p>
                <div style={{ color: colors.ink, fontSize: "0.92rem" }}>{result.hostname}</div>
                <div style={{ color: colors.muted, fontSize: "0.85rem", wordBreak: "break-all" }}>
                  {result.url}
                </div>
                {result.labels?.length ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing.sm}px` }}>
                    {result.labels.map((label) => (
                      <span key={label} style={pillStyle}>
                        {label}
                      </span>
                    ))}
                  </div>
                ) : null}
                {formatPublishedDate(result.publishedAt) ? (
                  <div style={{ color: colors.muted, fontSize: "0.85rem" }}>
                    Published {formatPublishedDate(result.publishedAt) ?? ""}
                  </div>
                ) : null}
              </article>
            ))
          ) : (
            <div style={{ ...panelStyle, color: colors.muted, lineHeight: 1.7, padding: `${spacing.lg}px` }}>
              No mock result set matches this query yet. Use one of the representative scenarios above
              to inspect the full slice.
            </div>
          )}
        </div>

        <aside style={{ display: "grid", gap: `${spacing.md}px` }}>
          <h2 style={sectionTitleStyle}>Orientation</h2>
          <section
            style={{
              ...panelStyle,
              display: "grid",
              gap: `${spacing.md}px`,
              padding: `${spacing.lg}px`
            }}
          >
            {state.reframing.block.mode ? <div style={pillStyle}>{state.reframing.block.mode}</div> : null}
            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>{state.reframing.block.heading}</h3>
            {state.reframing.block.line ? (
              <p style={{ color: colors.muted, lineHeight: 1.7, margin: 0 }}>
                {state.reframing.block.line}
              </p>
            ) : null}

            <div style={{ display: "grid", gap: `${spacing.sm}px` }}>
              <div style={{ color: colors.muted, fontSize: "0.9rem" }}>Follow-up questions</div>
              <ul style={{ display: "grid", gap: `${spacing.sm}px`, margin: 0, paddingLeft: "1.2rem" }}>
                {state.reframing.block.followups.map((followup) => (
                  <li key={followup.id} style={{ lineHeight: 1.6 }}>
                    {followup.prompt}
                  </li>
                ))}
              </ul>
            </div>

            {state.reframing.block.relatedConcepts?.length ? (
              <div style={{ display: "grid", gap: `${spacing.sm}px` }}>
                <div style={{ color: colors.muted, fontSize: "0.9rem" }}>Related paths</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing.sm}px` }}>
                  {state.reframing.block.relatedConcepts.map((concept) => (
                    <button
                      key={concept.id}
                      onClick={() => submitQuery(concept.queryHint)}
                      style={{
                        ...pillStyle,
                        backgroundColor: "transparent",
                        cursor: "pointer"
                      }}
                      type="button"
                    >
                      {concept.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </aside>
      </section>
    </main>
  );
}
