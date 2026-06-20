import type { SearchQuery } from "@facet/domain";
import type { FacetId } from "@facet/shared-types";

/**
 * Keep reframing focused on orientation so people can compare angles without the system choosing for them.
 */
export type ReframingMode = "broaden" | "compare" | "distinguish" | "contextualize";

export interface OrientationFollowup {
  id: FacetId;
  prompt: string;
}

export interface RelatedConceptLink {
  id: FacetId;
  label: string;
  queryHint: string;
}

export interface OrientationBlock {
  id: FacetId;
  mode?: ReframingMode;
  heading: string;
  line?: string;
  followups: OrientationFollowup[];
  relatedConcepts?: RelatedConceptLink[];
}

export interface ReframingRequestContext {
  query: SearchQuery;
  modes?: ReframingMode[];
}

export interface ReframingEngine {
  orient(context: ReframingRequestContext): Promise<OrientationBlock>;
}

export { orientWithMockLayer } from "./fixtures";
