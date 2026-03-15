import type { SafetyDisposition } from "@facet/domain";
import type { FacetId } from "@facet/shared-types";

/**
 * Future seam for policy and harm-minimizing behavior.
 * This scaffold only defines labels and contracts.
 */
export type SafetyLabel =
  | "general"
  | "sensitive"
  | "medical"
  | "legal"
  | "self-harm"
  | "crisis"
  | "unknown";

export interface RefusalPattern {
  id: FacetId;
  label: SafetyLabel;
  reason: string;
  userMessage: string;
}

export interface RedirectPattern {
  id: FacetId;
  label: SafetyLabel;
  destinationLabel: string;
  userMessage: string;
}

export interface SafetyAssessment {
  disposition: SafetyDisposition;
  labels: SafetyLabel[];
  rationale?: string;
  refusalPattern?: RefusalPattern;
  redirectPattern?: RedirectPattern;
}
