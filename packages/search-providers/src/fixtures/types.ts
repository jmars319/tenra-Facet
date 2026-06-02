import type { SearchResult } from "@facet/domain";

import type { MockSearchScenarioSummary } from "../index";

export interface MockSearchScenario extends MockSearchScenarioSummary {
  matchers: string[][];
  results: SearchResult[];
}

