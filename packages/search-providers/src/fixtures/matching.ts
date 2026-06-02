import type { MockSearchScenario } from "./types";

export function normalizeQueryText(input: string): string {
  return input.trim().toLowerCase();
}

export function matchesTerms(queryText: string, terms: string[]): boolean {
  return terms.every((term) => queryText.includes(term));
}

export function resolveMockSearchScenario(
  queryText: string,
  scenarios: MockSearchScenario[],
): MockSearchScenario | undefined {
  const normalizedQuery = normalizeQueryText(queryText);

  return scenarios.find((scenario) => scenario.matchers.some((matcher) => matchesTerms(normalizedQuery, matcher)));
}

