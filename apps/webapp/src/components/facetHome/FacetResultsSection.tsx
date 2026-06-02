import type { SearchResult } from "@facet/domain";
import { colors, spacing } from "@facet/ui";

import { formatCommonality, formatPublishedDate, surfacedByLine } from "./formatters";
import { panelStyle, pillStyle, sectionTitleStyle } from "./styles";

export function FacetResultsSection({ results }: { results: SearchResult[] }) {
  return (
    <div style={{ display: "grid", gap: `${spacing.md}px` }}>
      <h2 style={sectionTitleStyle}>Results</h2>

      {results.length > 0 ? (
        results.map((result) => <FacetResultCard key={result.id} result={result} />)
      ) : (
        <div style={{ ...panelStyle, color: colors.muted, lineHeight: 1.7, padding: `${spacing.lg}px` }}>
          No result set matches this query yet. Choose one of the representative scenarios above to review the full result
          flow.
        </div>
      )}
    </div>
  );
}

function FacetResultCard({ result }: { result: SearchResult }) {
  const publishedDate = formatPublishedDate(result.publishedAt);

  return (
    <article
      style={{
        ...panelStyle,
        display: "grid",
        gap: `${spacing.sm}px`,
        padding: `${spacing.lg}px`,
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
      <p style={{ color: colors.muted, lineHeight: 1.7, margin: 0 }}>{result.snippet ?? "No snippet available for this result."}</p>
      <div style={{ color: colors.ink, fontSize: "0.92rem" }}>{result.hostname}</div>
      <div style={{ color: colors.muted, fontSize: "0.85rem", wordBreak: "break-all" }}>{result.url}</div>
      {result.labels?.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing.sm}px` }}>
          {result.labels.map((label) => (
            <span key={label} style={pillStyle}>
              {label}
            </span>
          ))}
        </div>
      ) : null}
      {publishedDate ? <div style={{ color: colors.muted, fontSize: "0.85rem" }}>Published {publishedDate}</div> : null}
    </article>
  );
}

