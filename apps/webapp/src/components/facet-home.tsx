import type { CSSProperties } from "react";
import { APP_NAME } from "@facet/config";
import { colors, radii, spacing } from "@facet/ui";

import {
  placeholderOrientations,
  placeholderQuery,
  placeholderResults
} from "../lib/placeholders";

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
  padding: "0.35rem 0.65rem"
};

const sectionTitleStyle: CSSProperties = {
  fontSize: "1rem",
  letterSpacing: "0.06em",
  margin: 0,
  textTransform: "uppercase"
};

export function FacetHome() {
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
        <span style={pillStyle}>Active shell: web</span>
        <div style={{ display: "grid", gap: `${spacing.md}px`, maxWidth: "46rem" }}>
          <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5.25rem)", lineHeight: 0.95, margin: 0 }}>
            {APP_NAME} helps people inspect a question from more than one angle.
          </h1>
          <p style={{ color: colors.muted, fontSize: "1.1rem", lineHeight: 1.7, margin: 0 }}>
            This shell is intentionally thin. It shows the shape of query entry, result review,
            and reframing without implementing live search, answer generation, or policy logic yet.
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
        <h2 style={sectionTitleStyle}>Query</h2>
        <form action="#" style={{ display: "grid", gap: `${spacing.sm}px` }}>
          <label htmlFor="query" style={{ color: colors.muted, fontSize: "0.95rem" }}>
            Search prompt
          </label>
          <input
            defaultValue={placeholderQuery.text}
            id="query"
            name="query"
            placeholder="Ask a question to explore"
            style={{
              backgroundColor: "#fffef8",
              border: `1px solid ${colors.border}`,
              borderRadius: radii.md,
              color: colors.ink,
              minHeight: "3.25rem",
              padding: `${spacing.md}px`
            }}
          />
        </form>
      </section>

      <section
        style={{
          display: "grid",
          gap: `${spacing.lg}px`,
          gridTemplateColumns: "minmax(0, 1.6fr) minmax(18rem, 1fr)"
        }}
      >
        <div style={{ display: "grid", gap: `${spacing.md}px` }}>
          <h2 style={sectionTitleStyle}>Placeholder results</h2>
          {placeholderResults.map((result) => (
            <article
              key={result.id}
              style={{
                ...panelStyle,
                display: "grid",
                gap: `${spacing.sm}px`,
                padding: `${spacing.lg}px`
              }}
            >
              <div style={{ color: colors.muted, fontSize: "0.85rem" }}>
                {result.provenance.providerKey} · {result.provenance.publisher ?? "Unknown source"}
              </div>
              <h3 style={{ fontSize: "1.15rem", margin: 0 }}>{result.title}</h3>
              <p style={{ color: colors.muted, lineHeight: 1.7, margin: 0 }}>
                {result.snippet ?? "Placeholder result excerpt."}
              </p>
              <div style={{ fontSize: "0.9rem" }}>{result.url}</div>
            </article>
          ))}
        </div>

        <aside style={{ display: "grid", gap: `${spacing.md}px` }}>
          <h2 style={sectionTitleStyle}>Placeholder reframing</h2>
          {placeholderOrientations.map((block) => (
            <section
              key={block.id}
              style={{
                ...panelStyle,
                display: "grid",
                gap: `${spacing.sm}px`,
                padding: `${spacing.lg}px`
              }}
            >
              <div style={pillStyle}>{block.mode}</div>
              <h3 style={{ fontSize: "1.05rem", margin: 0 }}>{block.title}</h3>
              <p style={{ color: colors.muted, lineHeight: 1.65, margin: 0 }}>{block.prompt}</p>
            </section>
          ))}
        </aside>
      </section>
    </main>
  );
}
