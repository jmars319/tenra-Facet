import type { FacetDesktopExport, FacetEndpointConfig, LocalCorpusDocument, SavedRun } from "./facetTypes";

export const runStorageKey = "tenra-facet-desktop-runs:v1";
export const corpusStorageKey = "tenra-facet-local-corpus:v1";
export const endpointStorageKey = "tenra-facet-suite-endpoints:v1";
export const sendRetryQueueStorageKey = "tenra-facet-suite-send-retry-queue:v1";

export const defaultEndpointConfig: FacetEndpointConfig = {
  derive: "",
  sentinel: "",
  assembly: "",
};

export const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `facet-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const nowIso = () => new Date().toISOString();

export const todayForFilename = () => new Date().toISOString().slice(0, 10);

export const downloadJsonFile = (value: unknown, filename: string) => {
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

export const isSavedRun = (value: unknown): value is SavedRun => {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<SavedRun>;

  return (
    typeof candidate.id === "string" &&
    typeof candidate.queryText === "string" &&
    typeof candidate.locale === "string" &&
    Boolean(candidate.result)
  );
};

export const isLocalCorpusDocument = (value: unknown): value is LocalCorpusDocument => {
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

export const parseWorkspaceImport = (input: unknown): FacetDesktopExport => {
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

