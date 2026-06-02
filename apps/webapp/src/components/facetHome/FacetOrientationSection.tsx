"use client";

import { colors, spacing } from "@facet/ui";

import type { FacetHomeState } from "./useFacetHomeState";
import { panelStyle, pillStyle, sectionTitleStyle } from "./styles";

export function FacetOrientationSection({ home }: { home: FacetHomeState }) {
  const block = home.state.reframing.block;

  return (
    <aside style={{ display: "grid", gap: `${spacing.md}px` }}>
      <h2 style={sectionTitleStyle}>Orientation</h2>
      <section style={{ ...panelStyle, display: "grid", gap: `${spacing.md}px`, padding: `${spacing.lg}px` }}>
        {block.mode ? <div style={pillStyle}>{block.mode}</div> : null}
        <h3 style={{ fontSize: "1.1rem", margin: 0 }}>{block.heading}</h3>
        {block.line ? <p style={{ color: colors.muted, lineHeight: 1.7, margin: 0 }}>{block.line}</p> : null}

        <div style={{ display: "grid", gap: `${spacing.sm}px` }}>
          <div style={{ color: colors.muted, fontSize: "0.9rem" }}>Follow-up questions</div>
          <ul style={{ display: "grid", gap: `${spacing.sm}px`, margin: 0, paddingLeft: "1.2rem" }}>
            {block.followups.map((followup) => (
              <li key={followup.id} style={{ lineHeight: 1.6 }}>
                {followup.prompt}
              </li>
            ))}
          </ul>
        </div>

        {block.relatedConcepts?.length ? (
          <div style={{ display: "grid", gap: `${spacing.sm}px` }}>
            <div style={{ color: colors.muted, fontSize: "0.9rem" }}>Related paths</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: `${spacing.sm}px` }}>
              {block.relatedConcepts.map((concept) => (
                <button
                  key={concept.id}
                  onClick={() => home.submitQuery(concept.queryHint)}
                  style={{ ...pillStyle, backgroundColor: "transparent", cursor: "pointer" }}
                  type="button"
                >
                  {concept.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}
        <div style={{ display: "grid", gap: `${spacing.sm}px` }}>
          <div style={{ color: colors.muted, fontSize: "0.9rem" }}>Handoff</div>
          <span style={pillStyle}>{home.orientationPacket.schema}</span>
          <span style={pillStyle}>Next: {home.orientationPacket.handoff.recommendedNextApp}</span>
        </div>
      </section>
    </aside>
  );
}

