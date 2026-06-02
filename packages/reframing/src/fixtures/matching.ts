import type { MockOrientationScenario } from "./types";

export function normalizeQueryText(input: string): string {
  return input.trim().toLowerCase();
}

export function matchesTerms(queryText: string, terms: string[]): boolean {
  return terms.every((term) => queryText.includes(term));
}

export function resolveMockOrientationScenario(
  queryText: string,
  scenarios: MockOrientationScenario[],
): MockOrientationScenario | undefined {
  const normalizedQuery = normalizeQueryText(queryText);

  return scenarios.find((scenario) => scenario.matchers.some((matcher) => matchesTerms(normalizedQuery, matcher)));
}

