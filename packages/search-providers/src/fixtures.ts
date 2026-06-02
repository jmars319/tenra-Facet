import type { SearchQuery, SearchResult } from "@facet/domain";

import type { MockSearchScenarioSummary, SearchProviderOptions } from "./index";
import { mockProviderCatalog } from "./fixtures/catalog";
import { resolveMockSearchScenario } from "./fixtures/matching";
import { mockSearchScenarios } from "./fixtures/scenarioData";

export { mockProviderCatalog };

export function listMockSearchScenarios(): MockSearchScenarioSummary[] {
  return mockSearchScenarios.map(({ id, label, exampleQuery, note }) => ({
    id,
    label,
    exampleQuery,
    note,
  }));
}

export async function searchMockResults(
  query: SearchQuery,
  options: SearchProviderOptions = {},
): Promise<SearchResult[]> {
  const scenario = resolveMockSearchScenario(query.text, mockSearchScenarios);

  if (!scenario) {
    return [];
  }

  const providerKeys =
    options.providerKeys?.length && options.providerKeys[0]
      ? new Set(options.providerKeys)
      : undefined;

  const filteredResults = providerKeys
    ? scenario.results.filter(
        (result) =>
          providerKeys.has(result.provider.key) ||
          result.provenance.surfacedBy.some((provider) => providerKeys.has(provider.key)),
      )
    : scenario.results;

  return filteredResults.slice(0, options.limit ?? filteredResults.length);
}
