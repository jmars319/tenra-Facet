import type { SearchQuery } from "@facet/domain";
import type { FacetId } from "@facet/shared-types";

/**
 * Facet organizes perspective so people can inspect a question from
 * multiple angles without the system deciding for them.
 */
export type ReframingMode = "broaden" | "compare" | "challenge" | "contextualize";

export interface OrientationBlock {
  id: FacetId;
  mode: ReframingMode;
  title: string;
  prompt: string;
}

export interface FollowupPrompt {
  id: FacetId;
  label: string;
  prompt: string;
}

export interface ReframingRequestContext {
  query: SearchQuery;
  modes?: ReframingMode[];
}

export interface ReframingEngine {
  orient(
    context: ReframingRequestContext
  ): Promise<{ blocks: OrientationBlock[]; followups: FollowupPrompt[] }>;
}
