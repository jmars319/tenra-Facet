import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import {
  buildFacetOrientationPacket,
  type FacetOrientationPacket,
  type FacetOrientationPacketConsumer,
  type FacetSearchResponse,
} from "@facet/api-contracts";
import { APP_NAME } from "@facet/config";
import type { SearchQuery, SearchResult } from "@facet/domain";
import { orientWithMockLayer } from "@facet/reframing";
import { listMockSearchScenarios, searchMockResults } from "@facet/search-providers";
import { parseFacetOrientationPacket } from "@facet/validation";
import { readDesktopStore, readLegacyLocalStorage, writeDesktopStore } from "./lib/desktopStore";

type LocalCorpusDocument = {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

type SavedRun = {
  id: string;
  queryText: string;
  locale: string;
  result: FacetSearchResponse;
};

type FacetDesktopExport = {
  exportedAt: string;
  localCorpus: LocalCorpusDocument[];
  savedRuns: SavedRun[];
  schema: "tenra-facet-desktop-workspace:v1";
};

const runStorageKey = "tenra-facet-desktop-runs:v1";
const corpusStorageKey = "tenra-facet-local-corpus:v1";
const scenarios = listMockSearchScenarios();
const localCorpusProvider = { key: "local-corpus", label: "Local Corpus" };
const stopWords = new Set([
  "about",
  "after",
  "before",
  "from",
  "have",
  "into",
  "that",
  "the",
  "this",
  "what",
  "when",
  "where",
  "which",
  "with",
  "would",
  "your",
]);

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `facet-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const nowIso = () => new Date().toISOString();

const todayForFilename = () => new Date().toISOString().slice(0, 10);

const downloadJsonFile = (value: unknown, filename: string) => {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: "application/json;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const createSearchQuery = (text: string, locale: string): SearchQuery => ({
  id: createId(),
  text: text.trim(),
  submittedAt: nowIso(),
  ...(locale.trim() ? { locale: locale.trim() } : {}),
});

const tokenize = (input: string): string[] =>
  input
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

const sourceHostname = (sourceUrl: string): string => {
  if (!sourceUrl.trim()) return "local corpus";

  try {
    return new URL(sourceUrl.trim()).hostname;
  } catch {
    return "local corpus";
  }
};

const sourceUrlForDocument = (document: LocalCorpusDocument): SearchResult["url"] =>
  (document.sourceUrl.trim() || `facet-local://document/${document.id}`) as SearchResult["url"];

const snippetForDocument = (body: string, words: string[]): string => {
  const normalizedBody = body.toLowerCase();
  const firstHit = words
    .map((word) => normalizedBody.indexOf(word))
    .filter((index) => index >= 0)
    .sort((first, second) => first - second)[0];
  const start = Math.max(0, (firstHit ?? 0) - 70);
  const snippet = body.slice(start, start + 220).trim();

  return start > 0 ? `...${snippet}` : snippet;
};

const searchLocalCorpus = (query: SearchQuery, documents: LocalCorpusDocument[]): SearchResult[] => {
  const words = tokenize(query.text);
  if (words.length === 0 || documents.length === 0) return [];

  return documents
    .map((document) => {
      const title = document.title.toLowerCase();
      const body = document.body.toLowerCase();
      const tagText = document.tags.join(" ").toLowerCase();
      const score = words.reduce((total, word) => {
        const titleScore = title.includes(word) ? 4 : 0;
        const tagScore = tagText.includes(word) ? 3 : 0;
        const bodyScore = body.includes(word) ? 1 : 0;

        return total + titleScore + tagScore + bodyScore;
      }, 0);

      return { document, score };
    })
    .filter(({ score }) => score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, 8)
    .map(({ document, score }) => ({
      id: `local-corpus-${document.id}`,
      title: document.title,
      url: sourceUrlForDocument(document),
      hostname: sourceHostname(document.sourceUrl),
      snippet: snippetForDocument(document.body, words),
      provider: localCorpusProvider,
      publishedAt: document.updatedAt,
      provenance: {
        surfacedBy: [localCorpusProvider],
        commonality: {
          status: "unique",
          providerCount: 1,
        },
      },
      labels: [...document.tags, `${score} local match points`].filter(Boolean),
    }));
};

const runLocalFacetSearch = async (
  text: string,
  locale: string,
  localCorpus: LocalCorpusDocument[],
): Promise<FacetSearchResponse> => {
  const query = createSearchQuery(text, locale);
  const [results, block] = await Promise.all([
    searchMockResults(query, { limit: 8, locale }),
    orientWithMockLayer({ query }),
  ]);
  const localResults = searchLocalCorpus(query, localCorpus);

  return {
    search: {
      query,
      results: [...localResults, ...results].slice(0, 8),
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
  return [];
};

const isSavedRun = (value: unknown): value is SavedRun => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SavedRun>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.queryText === "string" &&
    typeof candidate.locale === "string" &&
    Boolean(candidate.result)
  );
};

const isLocalCorpusDocument = (value: unknown): value is LocalCorpusDocument => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<LocalCorpusDocument>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.source === "string" &&
    typeof candidate.sourceUrl === "string" &&
    typeof candidate.body === "string" &&
    Array.isArray(candidate.tags) &&
    typeof candidate.createdAt === "string" &&
    typeof candidate.updatedAt === "string"
  );
};

const parseWorkspaceImport = (input: unknown): FacetDesktopExport => {
  if (!input || typeof input !== "object") {
    throw new Error("Facet workspace JSON must be an object.");
  }

  const candidate = input as Partial<FacetDesktopExport>;
  const savedRuns = Array.isArray(candidate.savedRuns) ? candidate.savedRuns : [];
  const localCorpus = Array.isArray(candidate.localCorpus) ? candidate.localCorpus : [];

  if (!savedRuns.every(isSavedRun) || !localCorpus.every(isLocalCorpusDocument)) {
    throw new Error("Facet workspace JSON contains unsupported records.");
  }

  return {
    exportedAt: typeof candidate.exportedAt === "string" ? candidate.exportedAt : nowIso(),
    localCorpus,
    savedRuns,
    schema: "tenra-facet-desktop-workspace:v1",
  };
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

const toDerivePromptMarkdown = (run: SavedRun) => {
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

export default function App() {
  const importInputRef = useRef<HTMLInputElement>(null);
  const [queryText, setQueryText] = useState(scenarios[0]?.exampleQuery ?? "");
  const [locale, setLocale] = useState("en-US");
  const [savedRuns, setSavedRuns] = useState<SavedRun[]>(loadSavedRuns);
  const [localCorpus, setLocalCorpus] = useState<LocalCorpusDocument[]>([]);
  const [documentTitle, setDocumentTitle] = useState("");
  const [documentSource, setDocumentSource] = useState("");
  const [documentSourceUrl, setDocumentSourceUrl] = useState("");
  const [documentBody, setDocumentBody] = useState("");
  const [documentTags, setDocumentTags] = useState("");
  const [handoffJson, setHandoffJson] = useState("");
  const [importedHandoff, setImportedHandoff] = useState<FacetOrientationPacket | null>(null);
  const [activeId, setActiveId] = useState(savedRuns[0]?.id ?? "");
  const [notice, setNotice] = useState("Local Facet workbench ready.");
  const [isRunning, setIsRunning] = useState(false);
  const [isStoreReady, setIsStoreReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      readDesktopStore<SavedRun[]>(runStorageKey),
      readDesktopStore<LocalCorpusDocument[]>(corpusStorageKey),
    ])
      .then(([storedRuns, storedCorpus]) => {
        if (cancelled) return;

        const legacyRuns = readLegacyLocalStorage<SavedRun[]>(runStorageKey);
        const legacyCorpus = readLegacyLocalStorage<LocalCorpusDocument[]>(corpusStorageKey);
        const nextRuns =
          Array.isArray(storedRuns) && storedRuns.length > 0
            ? storedRuns
            : Array.isArray(legacyRuns) && legacyRuns.length > 0
              ? legacyRuns
              : null;

        if (nextRuns) {
          setSavedRuns(nextRuns);
          setActiveId(nextRuns[0]?.id ?? "");
        }

        const nextCorpus =
          Array.isArray(storedCorpus) && storedCorpus.length > 0
            ? storedCorpus
            : Array.isArray(legacyCorpus) && legacyCorpus.length > 0
              ? legacyCorpus
              : [];
        setLocalCorpus(nextCorpus);
        setNotice(
          nextRuns || nextCorpus.length
            ? "Desktop store loaded."
            : "Local Facet workbench ready.",
        );

        setIsStoreReady(true);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setNotice(error instanceof Error ? error.message : "Desktop store unavailable.");
        setIsStoreReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!isStoreReady) return;

    void writeDesktopStore(runStorageKey, savedRuns).catch((error: unknown) => {
      setNotice(error instanceof Error ? error.message : "Desktop store write failed.");
    });
  }, [isStoreReady, savedRuns]);

  useEffect(() => {
    if (!isStoreReady) return;

    void writeDesktopStore(corpusStorageKey, localCorpus).catch((error: unknown) => {
      setNotice(error instanceof Error ? error.message : "Local corpus write failed.");
    });
  }, [isStoreReady, localCorpus]);

  const activeRun = savedRuns.find((run) => run.id === activeId) ?? savedRuns[0] ?? null;
  const markdown = useMemo(() => (activeRun ? toMarkdown(activeRun) : ""), [activeRun]);
  const derivePromptMarkdown = useMemo(
    () => (activeRun ? toDerivePromptMarkdown(activeRun) : ""),
    [activeRun],
  );
  const orientationPacket = useMemo(
    () =>
      activeRun
        ? buildFacetOrientationPacket({
            response: activeRun.result,
            recommendedNextApp: "derive",
          })
        : null,
    [activeRun],
  );

  const runSearch = async () => {
    if (!queryText.trim()) {
      setNotice("Enter a question before running Facet.");
      return;
    }

    setIsRunning(true);
    setNotice("Preparing local orientation...");

    try {
      const result = await runLocalFacetSearch(queryText, locale, localCorpus);
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

  const saveCorpusDocument = () => {
    const title = documentTitle.trim();
    const body = documentBody.trim();

    if (!title || !body) {
      setNotice("Add a title and document text before saving.");
      return;
    }

    const timestamp = nowIso();
    const document: LocalCorpusDocument = {
      id: createId(),
      title,
      source: documentSource.trim(),
      sourceUrl: documentSourceUrl.trim(),
      body,
      tags: documentTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setLocalCorpus((current) => [document, ...current]);
    setDocumentTitle("");
    setDocumentSource("");
    setDocumentSourceUrl("");
    setDocumentBody("");
    setDocumentTags("");
    setNotice("Local document saved.");
  };

  const removeCorpusDocument = (documentId: string) => {
    setLocalCorpus((current) => current.filter((document) => document.id !== documentId));
    setNotice("Local document removed.");
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

  const copyDerivePrompt = async () => {
    if (!activeRun) return;
    try {
      await navigator.clipboard.writeText(derivePromptMarkdown);
      setNotice("Derive prompt copied.");
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

  const exportOrientationPacket = (recommendedNextApp: FacetOrientationPacketConsumer = "derive") => {
    if (!activeRun) return;
    const packet = buildFacetOrientationPacket({
      response: activeRun.result,
      recommendedNextApp,
    });
    downloadJsonFile(packet, `facet-orientation-${todayForFilename()}.json`);
    setNotice(`Orientation packet exported for ${recommendedNextApp}.`);
  };

  const copyOrientationPacket = async (recommendedNextApp: FacetOrientationPacketConsumer = "derive") => {
    if (!activeRun) return;
    const packet = buildFacetOrientationPacket({
      response: activeRun.result,
      recommendedNextApp,
    });
    try {
      await navigator.clipboard.writeText(JSON.stringify(packet, null, 2));
      setNotice(`Orientation packet copied for ${recommendedNextApp}.`);
    } catch {
      setNotice("Clipboard copy failed. Export still works.");
    }
  };

  const exportWorkspace = () => {
    const payload: FacetDesktopExport = {
      exportedAt: nowIso(),
      localCorpus,
      savedRuns,
      schema: "tenra-facet-desktop-workspace:v1",
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `tenra-facet-workspace-${todayForFilename()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Facet workspace export created.");
  };

  const importWorkspace = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    try {
      const workspace = parseWorkspaceImport(JSON.parse(await file.text()));
      setSavedRuns(workspace.savedRuns);
      setLocalCorpus(workspace.localCorpus);
      setActiveId(workspace.savedRuns[0]?.id ?? "");
      setNotice(
        `Imported ${workspace.savedRuns.length} review(s) and ${workspace.localCorpus.length} local document(s).`,
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Facet workspace import failed.");
    }
  };

  const importOrientationPacket = () => {
    if (!handoffJson.trim()) {
      setNotice("Paste a Facet orientation packet before importing.");
      return;
    }

    try {
      const packet = parseFacetOrientationPacket(JSON.parse(handoffJson));
      const nextLocale = packet.query.locale ?? locale;
      const saved: SavedRun = {
        id: createId(),
        locale: nextLocale,
        queryText: packet.query.text,
        result: packet.response,
      };

      setSavedRuns((current) => [saved, ...current]);
      setActiveId(saved.id);
      setQueryText(packet.query.text);
      setLocale(nextLocale);
      setImportedHandoff(packet);
      setNotice(`Imported ${packet.schema} for ${packet.handoff.recommendedNextApp}.`);
    } catch (error) {
      setImportedHandoff(null);
      setNotice(error instanceof Error ? error.message : "Facet handoff import failed.");
    }
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
          <div className="workspace-actions">
            <button type="button" onClick={exportWorkspace}>
              Export Workspace
            </button>
            <button type="button" onClick={() => importInputRef.current?.click()}>
              Import Workspace
            </button>
          </div>
          <input
            ref={importInputRef}
            className="hidden-file-input"
            type="file"
            accept="application/json"
            onChange={importWorkspace}
          />

          <p className="notice" role="status">
            {notice}
          </p>
        </section>

        <section className="query-panel" aria-label="Facet handoff inbox">
          <span className="eyebrow">Handoff Inbox</span>
          <label>
            Orientation packet JSON
            <textarea value={handoffJson} onChange={(event) => setHandoffJson(event.target.value)} />
          </label>
          <button type="button" onClick={importOrientationPacket}>
            Import Orientation
          </button>
          {importedHandoff ? (
            <p className="notice">
              {importedHandoff.sourceApp} / {importedHandoff.handoff.recommendedNextApp} /{" "}
              {importedHandoff.response.search.results.length} result(s)
            </p>
          ) : null}
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

        <section className="corpus-panel" aria-label="Local corpus">
          <span className="eyebrow">Local Corpus</span>
          <label>
            Document title
            <input value={documentTitle} onChange={(event) => setDocumentTitle(event.target.value)} />
          </label>
          <label>
            Source
            <input
              placeholder="File, customer note, meeting, or URL label"
              value={documentSource}
              onChange={(event) => setDocumentSource(event.target.value)}
            />
          </label>
          <label>
            Source URL
            <input
              placeholder="Optional"
              value={documentSourceUrl}
              onChange={(event) => setDocumentSourceUrl(event.target.value)}
            />
          </label>
          <label>
            Text
            <textarea value={documentBody} onChange={(event) => setDocumentBody(event.target.value)} />
          </label>
          <label>
            Tags
            <input
              placeholder="Optional comma-separated tags"
              value={documentTags}
              onChange={(event) => setDocumentTags(event.target.value)}
            />
          </label>
          <button type="button" onClick={saveCorpusDocument}>
            Save Document
          </button>
          <div className="corpus-list" aria-label="Saved local documents">
            {localCorpus.length > 0 ? (
              localCorpus.slice(0, 8).map((document) => (
                <article key={document.id}>
                  <div>
                    <strong>{document.title}</strong>
                    <small>{document.source || "Local document"}</small>
                  </div>
                  <button type="button" onClick={() => removeCorpusDocument(document.id)}>
                    Remove
                  </button>
                </article>
              ))
            ) : (
              <p>No local documents saved yet.</p>
            )}
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
                <span>{localCorpus.length} local docs</span>
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
                    <p>No local or built-in results matched this query yet.</p>
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
                  <button type="button" onClick={copyDerivePrompt}>
                    Copy Derive Prompt
                  </button>
                  <button type="button" onClick={exportMarkdown}>
                    Export
                  </button>
                  <button type="button" onClick={() => exportOrientationPacket("derive")}>
                    Export Orientation
                  </button>
                  <button type="button" onClick={() => void copyOrientationPacket("assembly")}>
                    Send Assembly
                  </button>
                </div>
                <pre>{orientationPacket ? JSON.stringify(orientationPacket, null, 2) : markdown}</pre>
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
