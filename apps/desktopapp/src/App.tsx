import { useEffect, useMemo, useState } from "react";
import type { FacetSearchResponse } from "@facet/api-contracts";
import { APP_NAME } from "@facet/config";
import type { SearchQuery } from "@facet/domain";
import { orientWithMockLayer } from "@facet/reframing";
import { listMockSearchScenarios, searchMockResults } from "@facet/search-providers";

type SavedRun = {
  id: string;
  queryText: string;
  locale: string;
  result: FacetSearchResponse;
};

const storageKey = "tenra-facet-desktop-runs:v1";
const scenarios = listMockSearchScenarios();

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `facet-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const nowIso = () => new Date().toISOString();

const createSearchQuery = (text: string, locale: string): SearchQuery => ({
  id: createId(),
  text: text.trim(),
  submittedAt: nowIso(),
  ...(locale.trim() ? { locale: locale.trim() } : {}),
});

const runLocalFacetSearch = async (text: string, locale: string): Promise<FacetSearchResponse> => {
  const query = createSearchQuery(text, locale);
  const [results, block] = await Promise.all([
    searchMockResults(query, { limit: 8, locale }),
    orientWithMockLayer({ query }),
  ]);

  return {
    search: {
      query,
      results,
      safetyDisposition: "allow",
    },
    reframing: {
      query,
      block,
      safetyDisposition: "allow",
    },
  };
};

const loadSavedRuns = () => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedRun[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const formatTime = (iso: string) =>
  new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));

const toMarkdown = (run: SavedRun) => {
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

export default function App() {
  const [queryText, setQueryText] = useState(scenarios[0]?.exampleQuery ?? "");
  const [locale, setLocale] = useState("en-US");
  const [savedRuns, setSavedRuns] = useState<SavedRun[]>(loadSavedRuns);
  const [activeId, setActiveId] = useState(savedRuns[0]?.id ?? "");
  const [notice, setNotice] = useState("Local Facet workbench ready.");
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(savedRuns));
  }, [savedRuns]);

  const activeRun = savedRuns.find((run) => run.id === activeId) ?? savedRuns[0] ?? null;
  const markdown = useMemo(() => (activeRun ? toMarkdown(activeRun) : ""), [activeRun]);

  const runSearch = async () => {
    if (!queryText.trim()) {
      setNotice("Enter a question before running Facet.");
      return;
    }

    setIsRunning(true);
    setNotice("Preparing local orientation...");

    try {
      const result = await runLocalFacetSearch(queryText, locale);
      const saved: SavedRun = {
        id: createId(),
        queryText: queryText.trim(),
        locale,
        result,
      };
      setSavedRuns((current) => [saved, ...current]);
      setActiveId(saved.id);
      setNotice("Facet review saved.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Facet review failed.");
    } finally {
      setIsRunning(false);
    }
  };

  const applyScenario = (exampleQuery: string) => {
    setQueryText(exampleQuery);
    setNotice("Scenario loaded.");
  };

  const copyMarkdown = async () => {
    if (!activeRun) return;
    try {
      await navigator.clipboard.writeText(markdown);
      setNotice("Markdown copied.");
    } catch {
      setNotice("Clipboard copy failed. Export still works.");
    }
  };

  const exportMarkdown = () => {
    if (!activeRun) return;
    const slug = activeRun.queryText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 80);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slug || "facet-review"}.md`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Markdown export created.");
  };

  return (
    <main className="facet-shell">
      <aside className="facet-sidebar">
        <header className="brand-block">
          <span>Desktop workbench</span>
          <h1>{APP_NAME}</h1>
          <p>Inspect questions from several angles without forcing one final answer.</p>
        </header>

        <section className="query-panel" aria-label="Facet query">
          <label>
            Question
            <textarea value={queryText} onChange={(event) => setQueryText(event.target.value)} />
          </label>

          <label>
            Locale
            <input value={locale} onChange={(event) => setLocale(event.target.value)} />
          </label>

          <button disabled={isRunning} type="button" onClick={runSearch}>
            {isRunning ? "Running..." : "Run Facet"}
          </button>

          <p className="notice" role="status">
            {notice}
          </p>
        </section>

        <section className="scenario-panel" aria-label="Example scenarios">
          <span className="eyebrow">Scenarios</span>
          <div className="scenario-list">
            {scenarios.map((scenario) => (
              <button key={scenario.id} type="button" onClick={() => applyScenario(scenario.exampleQuery)}>
                <strong>{scenario.label}</strong>
                <small>{scenario.exampleQuery}</small>
              </button>
            ))}
          </div>
        </section>

        <nav className="history-list" aria-label="Facet history">
          {savedRuns.map((run) => (
            <button
              className={run.id === activeRun?.id ? "history-item history-item-active" : "history-item"}
              key={run.id}
              onClick={() => setActiveId(run.id)}
              type="button"
            >
              <span>{run.queryText}</span>
              <small>
                {run.result.search.results.length} results / {formatTime(run.result.search.query.submittedAt)}
              </small>
            </button>
          ))}
        </nav>
      </aside>

      <section className="facet-results" aria-label="Facet review">
        {activeRun ? (
          <>
            <header className="review-header">
              <div>
                <span className="eyebrow">Orientation</span>
                <h2>{activeRun.result.reframing.block.heading}</h2>
                <p>{activeRun.result.reframing.block.line}</p>
              </div>
              <div className="count-card">
                <strong>{activeRun.result.search.results.length}</strong>
                <span>Results</span>
              </div>
            </header>

            <div className="review-grid">
              <section className="panel-card">
                <header className="panel-header">
                  <span>Follow-Ups</span>
                  <strong>{activeRun.result.reframing.block.followups.length}</strong>
                </header>
                <ul>
                  {activeRun.result.reframing.block.followups.map((followup) => (
                    <li key={followup.id}>{followup.prompt}</li>
                  ))}
                </ul>
              </section>

              <section className="panel-card">
                <header className="panel-header">
                  <span>Related Concepts</span>
                  <strong>{activeRun.result.reframing.block.relatedConcepts?.length ?? 0}</strong>
                </header>
                <ul>
                  {(activeRun.result.reframing.block.relatedConcepts ?? []).map((concept) => (
                    <li key={concept.id}>
                      <strong>{concept.label}</strong>
                      <span>{concept.queryHint}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="panel-card result-card">
                <header className="panel-header">
                  <span>Results</span>
                  <strong>{activeRun.result.search.safetyDisposition}</strong>
                </header>
                <div className="result-list">
                  {activeRun.result.search.results.length > 0 ? (
                    activeRun.result.search.results.map((item) => (
                      <article key={item.id}>
                        <strong>{item.title}</strong>
                        <span>{item.hostname}</span>
                        <p>{item.snippet}</p>
                        <small>
                          {item.provenance.commonality.status} across {item.provenance.commonality.providerCount} provider(s)
                        </small>
                      </article>
                    ))
                  ) : (
                    <p>No fixture-backed results matched this query yet.</p>
                  )}
                </div>
              </section>

              <section className="panel-card export-card">
                <header className="panel-header">
                  <span>Export</span>
                  <strong>{activeRun.locale}</strong>
                </header>
                <div className="action-row">
                  <button type="button" onClick={copyMarkdown}>
                    Copy Markdown
                  </button>
                  <button type="button" onClick={exportMarkdown}>
                    Export
                  </button>
                </div>
                <pre>{markdown}</pre>
              </section>
            </div>
          </>
        ) : (
          <section className="empty-state">
            <span className="eyebrow">No review selected</span>
            <h2>Run Facet to create a local multi-angle review.</h2>
          </section>
        )}
      </section>
    </main>
  );
}
