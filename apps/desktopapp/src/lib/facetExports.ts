import type { SavedRun } from "./facetTypes";

export const formatTime = (iso: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));

export const toMarkdown = (run: SavedRun) => {
  const { result } = run;
  const block = result.reframing.block;

  return [
    `# Facet Review: ${run.queryText}`,
    "",
    `Submitted: ${result.search.query.submittedAt}`,
    `Locale: ${run.locale || "n/a"}`,
    `Safety: ${result.search.safetyDisposition}`,
    "",
    "## Orientation",
    "",
    `### ${block.heading}`,
    block.line ?? "",
    "",
    "## Follow-Ups",
    "",
    ...block.followups.map((followup) => `- ${followup.prompt}`),
    "",
    "## Related Concepts",
    "",
    ...(block.relatedConcepts ?? []).map((concept) => `- ${concept.label}: ${concept.queryHint}`),
    "",
    "## Results",
    "",
    ...result.search.results.map(
      (item) =>
        `- ${item.title} (${item.hostname})\n  ${item.snippet ?? ""}\n  surfaced by ${item.provenance.surfacedBy.map((provider) => provider.label).join(", ")}`,
    ),
  ].join("\n");
};

export const toDerivePromptMarkdown = (run: SavedRun) => {
  const block = run.result.reframing.block;

  return [
    "# Derive Prompt From Facet",
    "",
    `Question: ${run.queryText}`,
    `Locale: ${run.locale || "n/a"}`,
    `Submitted: ${run.result.search.query.submittedAt}`,
    "",
    "## Orientation",
    "",
    `${block.heading}`,
    block.line ?? "",
    "",
    "## Questions To Resolve",
    "",
    ...block.followups.map((followup) => `- ${followup.prompt}`),
    "",
    "## Available Context",
    "",
    ...run.result.search.results.map((item) => `- ${item.title} (${item.hostname}): ${item.snippet ?? ""}`),
  ].join("\n");
};

