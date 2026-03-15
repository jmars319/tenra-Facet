export type DataHandlingMode = "ephemeral" | "session" | "retained";
export type RetentionCategory = "queries" | "result-clicks" | "telemetry";

export interface PrivacyPreference {
  mode: DataHandlingMode;
  allowTelemetry: boolean;
  retainSearchHistory: boolean;
}

export function summarizePrivacyPreference(preference: PrivacyPreference): string {
  const telemetry = preference.allowTelemetry ? "telemetry enabled" : "telemetry disabled";
  const history = preference.retainSearchHistory ? "history retained" : "history not retained";

  return `${preference.mode} handling, ${telemetry}, ${history}`;
}
