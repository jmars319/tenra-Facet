import type { CSSProperties } from "react";
import { colors, radii } from "@facet/ui";

export const panelStyle: CSSProperties = {
  backgroundColor: colors.panel,
  border: `1px solid ${colors.border}`,
  borderRadius: radii.lg,
};

export const pillStyle: CSSProperties = {
  border: `1px solid ${colors.border}`,
  borderRadius: radii.md,
  color: colors.muted,
  display: "inline-flex",
  fontSize: "0.85rem",
  gap: "0.4rem",
  padding: "0.35rem 0.65rem",
};

export const sectionTitleStyle: CSSProperties = {
  fontSize: "1rem",
  letterSpacing: "0.06em",
  margin: 0,
  textTransform: "uppercase",
};

