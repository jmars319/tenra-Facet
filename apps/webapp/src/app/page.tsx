import { FacetHome } from "../components/facet-home";
import { getInitialFacetMockState, mockScenarioSummaries } from "../lib/mock-facet-flow";

export default async function Page() {
  const initialState = await getInitialFacetMockState();

  return <FacetHome initialState={initialState} scenarios={mockScenarioSummaries} />;
}
