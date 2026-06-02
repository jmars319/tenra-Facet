import { listMockSearchScenarios } from "@facet/search-providers";

import { FacetResults } from "./components/FacetResults";
import { FacetSidebar } from "./components/FacetSidebar";
import { useFacetWorkbench } from "./hooks/useFacetWorkbench";

const scenarios = listMockSearchScenarios();

export default function AppRoot() {
  const state = useFacetWorkbench(scenarios[0]?.exampleQuery ?? "");

  return (
    <main className="facet-shell">
      <FacetSidebar scenarios={scenarios} state={state} />
      <FacetResults state={state} />
    </main>
  );
}

