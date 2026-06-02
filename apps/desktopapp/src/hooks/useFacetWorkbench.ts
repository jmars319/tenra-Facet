import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { buildFacetOrientationPacket, type FacetOrientationPacket, type FacetOrientationPacketConsumer } from "@facet/api-contracts";
import { parseFacetOrientationPacket } from "@facet/validation";

import { readDesktopStore, readLegacyLocalStorage, writeDesktopStore } from "../lib/desktopStore";
import { toDerivePromptMarkdown, toMarkdown } from "../lib/facetExports";
import {
  corpusStorageKey,
  createId,
  defaultEndpointConfig,
  downloadJsonFile,
  endpointStorageKey,
  nowIso,
  parseWorkspaceImport,
  runStorageKey,
  sendRetryQueueStorageKey,
  todayForFilename,
} from "../lib/facetStorage";
import type { FacetDesktopExport, FacetEndpointConfig, FacetEndpointTarget, FacetSendRetry, LocalCorpusDocument, SavedRun } from "../lib/facetTypes";
import { runLocalFacetSearch } from "../lib/localCorpusSearch";

type DocumentDraft = {
  title: string;
  source: string;
  sourceUrl: string;
  body: string;
  tags: string;
};

const emptyDocumentDraft: DocumentDraft = {
  title: "",
  source: "",
  sourceUrl: "",
  body: "",
  tags: "",
};

const loadSavedRuns = () => [];

export const useFacetWorkbench = (initialQuery: string) => {
  const importInputRef = useRef<HTMLInputElement>(null);
  const [queryText, setQueryText] = useState(initialQuery);
  const [locale, setLocale] = useState("en-US");
  const [savedRuns, setSavedRuns] = useState<SavedRun[]>(loadSavedRuns);
  const [localCorpus, setLocalCorpus] = useState<LocalCorpusDocument[]>([]);
  const [documentDraft, setDocumentDraft] = useState<DocumentDraft>(emptyDocumentDraft);
  const [handoffJson, setHandoffJson] = useState("");
  const [importedHandoff, setImportedHandoff] = useState<FacetOrientationPacket | null>(null);
  const [endpointConfig, setEndpointConfig] = useState<FacetEndpointConfig>(defaultEndpointConfig);
  const [sendRetryQueue, setSendRetryQueue] = useState<FacetSendRetry[]>([]);
  const [sendValidationErrors, setSendValidationErrors] = useState<Record<string, string>>({});
  const [lastSendStatus, setLastSendStatus] = useState("");
  const [endpointHealth, setEndpointHealth] = useState<Record<string, string>>({});
  const [selectedRetryPayload, setSelectedRetryPayload] = useState<FacetSendRetry | null>(null);
  const [activeId, setActiveId] = useState(savedRuns[0]?.id ?? "");
  const [notice, setNotice] = useState("Local Facet workbench ready.");
  const [isRunning, setIsRunning] = useState(false);
  const [isStoreReady, setIsStoreReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      readDesktopStore<SavedRun[]>(runStorageKey),
      readDesktopStore<LocalCorpusDocument[]>(corpusStorageKey),
      readDesktopStore<FacetEndpointConfig>(endpointStorageKey),
      readDesktopStore<FacetSendRetry[]>(sendRetryQueueStorageKey),
    ])
      .then(([storedRuns, storedCorpus, storedEndpoints, storedRetryQueue]) => {
        if (cancelled) return;

        const legacyRuns = readLegacyLocalStorage<SavedRun[]>(runStorageKey);
        const legacyCorpus = readLegacyLocalStorage<LocalCorpusDocument[]>(corpusStorageKey);
        const legacyEndpoints = readLegacyLocalStorage<FacetEndpointConfig>(endpointStorageKey);
        const legacyRetryQueue = readLegacyLocalStorage<FacetSendRetry[]>(sendRetryQueueStorageKey);
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
        setEndpointConfig({ ...defaultEndpointConfig, ...(storedEndpoints ?? legacyEndpoints ?? {}) });
        setSendRetryQueue(Array.isArray(storedRetryQueue) ? storedRetryQueue : Array.isArray(legacyRetryQueue) ? legacyRetryQueue : []);
        setNotice(
          nextRuns || nextCorpus.length || storedEndpoints || legacyEndpoints
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

  useEffect(() => {
    if (!isStoreReady) return;
    void writeDesktopStore(endpointStorageKey, endpointConfig).catch((error: unknown) => {
      setNotice(error instanceof Error ? error.message : "Endpoint store write failed.");
    });
  }, [endpointConfig, isStoreReady]);

  useEffect(() => {
    if (!isStoreReady) return;
    void writeDesktopStore(sendRetryQueueStorageKey, sendRetryQueue).catch((error: unknown) => {
      setNotice(error instanceof Error ? error.message : "Retry queue write failed.");
    });
  }, [isStoreReady, sendRetryQueue]);

  const activeRun = savedRuns.find((run) => run.id === activeId) ?? savedRuns[0] ?? null;
  const markdown = useMemo(() => (activeRun ? toMarkdown(activeRun) : ""), [activeRun]);
  const derivePromptMarkdown = useMemo(() => (activeRun ? toDerivePromptMarkdown(activeRun) : ""), [activeRun]);
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
      const saved: SavedRun = { id: createId(), queryText: queryText.trim(), locale, result };
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

  const updateDocumentDraft = (field: keyof DocumentDraft, value: string) => {
    setDocumentDraft((current) => ({ ...current, [field]: value }));
  };

  const saveCorpusDocument = () => {
    const title = documentDraft.title.trim();
    const body = documentDraft.body.trim();

    if (!title || !body) {
      setNotice("Add a title and document text before saving.");
      return;
    }

    const timestamp = nowIso();
    const document: LocalCorpusDocument = {
      id: createId(),
      title,
      source: documentDraft.source.trim(),
      sourceUrl: documentDraft.sourceUrl.trim(),
      body,
      tags: documentDraft.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setLocalCorpus((current) => [document, ...current]);
    setDocumentDraft(emptyDocumentDraft);
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
    const slug = activeRun.queryText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
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
    const packet = buildFacetOrientationPacket({ response: activeRun.result, recommendedNextApp });
    downloadJsonFile(packet, `facet-orientation-${todayForFilename()}.json`);
    setNotice(`Orientation packet exported for ${recommendedNextApp}.`);
  };

  const updateEndpoint = (target: FacetEndpointTarget, value: string) => {
    setEndpointConfig((current) => ({ ...current, [target]: value }));
  };

  const sendPacketToEndpoint = async (
    recommendedNextApp: FacetEndpointTarget,
    packet: FacetOrientationPacket,
    endpoint: string,
    retryId?: string,
  ) => {
    try {
      parseFacetOrientationPacket(packet);
      setSendValidationErrors((current) => {
        const next = { ...current };
        delete next[recommendedNextApp];
        return next;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Facet orientation packet is malformed.";
      setSendValidationErrors((current) => ({ ...current, [recommendedNextApp]: message }));
      setNotice(message);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(packet),
      });
      if (!response.ok) throw new Error(await response.text());
      setLastSendStatus(`${recommendedNextApp}: ${response.status} ${response.statusText || "OK"} at ${nowIso()}`);
      setNotice(`Orientation packet sent to ${recommendedNextApp}.`);
      if (retryId) setSendRetryQueue((current) => current.filter((item) => item.id !== retryId));
    } catch (error) {
      const message = error instanceof Error ? error.message : `Could not send to ${recommendedNextApp}.`;
      setLastSendStatus(`${recommendedNextApp}: failed at ${nowIso()}`);
      setNotice(message);
      setSendRetryQueue((current) => [
        { id: retryId ?? createId(), target: recommendedNextApp, endpoint, packet, failedAt: nowIso(), message },
        ...current.filter((item) => item.id !== retryId),
      ].slice(0, 20));
    }
  };

  const sendOrientationPacket = async (recommendedNextApp: FacetEndpointTarget) => {
    if (!activeRun) return;
    const packet = buildFacetOrientationPacket({ response: activeRun.result, recommendedNextApp });
    const endpoint = endpointConfig[recommendedNextApp].trim();

    if (!endpoint) {
      await navigator.clipboard.writeText(JSON.stringify(packet, null, 2));
      setLastSendStatus(`${recommendedNextApp}: fallback copied at ${nowIso()}`);
      setNotice(`${recommendedNextApp} endpoint not configured. Orientation JSON copied.`);
      return;
    }

    await sendPacketToEndpoint(recommendedNextApp, packet, endpoint);
  };

  const checkSendEndpoints = async () => {
    const results: Record<string, string> = {};
    await Promise.all(
      (["derive", "sentinel", "assembly"] as const).map(async (target) => {
        const endpoint = endpointConfig[target].trim();
        if (!endpoint) {
          results[target] = "not configured";
          return;
        }
        try {
          const response = await fetch(endpoint, { method: "OPTIONS" });
          results[target] = response.ok || response.status === 405 ? `reachable (${response.status})` : `degraded (${response.status})`;
        } catch (error) {
          results[target] = error instanceof Error ? error.message : "unreachable";
        }
      }),
    );
    setEndpointHealth(results);
    setNotice("Suite send endpoints checked.");
  };

  const retryAllSends = async () => {
    for (const item of sendRetryQueue) await sendPacketToEndpoint(item.target, item.packet, item.endpoint, item.id);
  };

  const dismissRetry = (id: string) => {
    setSendRetryQueue((current) => current.filter((item) => item.id !== id));
    if (selectedRetryPayload?.id === id) setSelectedRetryPayload(null);
  };

  const exportWorkspace = () => {
    const payload: FacetDesktopExport = {
      exportedAt: nowIso(),
      localCorpus,
      savedRuns,
      schema: "tenra-facet-desktop-workspace:v1",
    };
    downloadJsonFile(payload, `tenra-facet-workspace-${todayForFilename()}.json`);
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
      setNotice(`Imported ${workspace.savedRuns.length} review(s) and ${workspace.localCorpus.length} local document(s).`);
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
      const saved: SavedRun = { id: createId(), locale: nextLocale, queryText: packet.query.text, result: packet.response };

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

  return {
    activeRun,
    corpus: { documentDraft, localCorpus, removeCorpusDocument, saveCorpusDocument, updateDocumentDraft },
    endpoint: {
      checkSendEndpoints,
      dismissRetry,
      endpointConfig,
      endpointHealth,
      lastSendStatus,
      retryAllSends,
      selectedRetryPayload,
      sendPacketToEndpoint,
      sendRetryQueue,
      sendValidationErrors,
      setSelectedRetryPayload,
      updateEndpoint,
    },
    handoff: { handoffJson, importedHandoff, importOrientationPacket, setHandoffJson },
    history: { activeId, savedRuns, setActiveId },
    importInputRef,
    isRunning,
    notice,
    orientationPacket,
    query: { applyScenario, locale, queryText, runSearch, setLocale, setQueryText },
    results: { copyDerivePrompt, copyMarkdown, exportMarkdown, exportOrientationPacket, sendOrientationPacket },
    workspace: { exportWorkspace, importWorkspace },
  };
};

export type FacetWorkbenchState = ReturnType<typeof useFacetWorkbench>;

