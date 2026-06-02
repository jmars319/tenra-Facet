import type { FacetOrientationPacket, FacetOrientationPacketConsumer, FacetSearchResponse } from "@facet/api-contracts";

export type LocalCorpusDocument = {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  body: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type SavedRun = {
  id: string;
  queryText: string;
  locale: string;
  result: FacetSearchResponse;
};

export type FacetDesktopExport = {
  exportedAt: string;
  localCorpus: LocalCorpusDocument[];
  savedRuns: SavedRun[];
  schema: "tenra-facet-desktop-workspace:v1";
};

export type FacetEndpointTarget = Exclude<FacetOrientationPacketConsumer, "manual">;

export type FacetEndpointConfig = Record<FacetEndpointTarget, string>;

export type FacetSendRetry = {
  id: string;
  target: FacetEndpointTarget;
  endpoint: string;
  packet: FacetOrientationPacket;
  failedAt: string;
  message: string;
};

export type FacetNoticeSetter = (message: string) => void;

