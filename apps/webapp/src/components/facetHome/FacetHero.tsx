import { APP_NAME } from "@facet/config";
import { colors, spacing } from "@facet/ui";

import { pillStyle } from "./styles";

export function FacetHero() {
  return (
    <section
      style={{
        display: "grid",
        gap: `${spacing.lg}px`,
        marginBottom: `${spacing.xl * 1.5}px`,
      }}
    >
      <span style={pillStyle}>
        <span>Web channel</span>
        <span>Local preview</span>
      </span>
      <div style={{ display: "grid", gap: `${spacing.md}px`, maxWidth: "48rem" }}>
        <h1 style={{ fontSize: "clamp(2.6rem, 8vw, 5.25rem)", lineHeight: 0.95, margin: 0 }}>
          {APP_NAME} shows results and perspective without deciding for the user.
        </h1>
        <p style={{ color: colors.muted, fontSize: "1.1rem", lineHeight: 1.7, margin: 0 }}>
          This preview shows normalized results, provider provenance, and a constrained orientation block before live search
          providers are connected.
        </p>
      </div>
    </section>
  );
}

