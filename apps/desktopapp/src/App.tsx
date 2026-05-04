import { APP_NAME } from "@facet/config";
import { colors, radii, spacing } from "@facet/ui";

export default function App() {
  return (
    <main
      style={{
        display: "grid",
        minHeight: "100vh",
        padding: `${spacing.xl * 2}px ${spacing.lg}px`,
        placeItems: "center"
      }}
    >
      <section
        style={{
          background: colors.panel,
          border: `1px solid ${colors.border}`,
          borderRadius: radii.lg,
          maxWidth: "48rem",
          padding: `${spacing.xl}px`,
          width: "100%"
        }}
      >
        <p className="eyebrow">Desktop channel</p>
        <h1>{APP_NAME} desktop</h1>
        <p>
          Desktop is reserved for search aggregation, reframing, safety review, and offline workflows.
        </p>
      </section>
    </main>
  );
}
