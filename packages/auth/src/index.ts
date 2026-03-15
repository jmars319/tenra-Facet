import type { FacetId, ISO8601Timestamp } from "@facet/shared-types";

export type SessionStatus = "anonymous" | "active" | "expired";

export interface AuthSubject {
  userId: FacetId;
  email?: string;
}

export interface FacetSession {
  sessionId: FacetId;
  status: SessionStatus;
  createdAt: ISO8601Timestamp;
  expiresAt?: ISO8601Timestamp;
  subject?: AuthSubject;
}
