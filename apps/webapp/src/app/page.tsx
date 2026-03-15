import { FacetHome } from "../components/facet-home";
import { buildFacetSearchRequest } from "../lib/facet-search-request";
import {
  defaultFacetMockQuery,
  facetMockScenarioSummaries,
  runFacetSearch
} from "../lib/server/facet-search";

export default async function Page() {
  const initialState = await runFacetSearch(buildFacetSearchRequest(defaultFacetMockQuery));

  return <FacetHome initialState={initialState} scenarios={facetMockScenarioSummaries} />;
}
