import assert from "node:assert/strict";
import test from "node:test";

import { buildFacetSearchRequest } from "../facet-search-request";
import { defaultFacetMockQuery, runFacetSearch } from "./facet-search";

test("runFacetSearch returns normalized results and one orientation block", async () => {
  const response = await runFacetSearch(buildFacetSearchRequest(defaultFacetMockQuery));

  assert.ok(response.search.results.length > 0);
  assert.ok(response.search.results[0]?.provenance.surfacedBy.length);
  assert.ok(response.reframing.block.followups.length > 0);
});

test("runFacetSearch falls back cleanly for an unknown fixture query", async () => {
  const response = await runFacetSearch(buildFacetSearchRequest("unknown mock fixture query"));

  assert.equal(response.search.results.length, 0);
  assert.equal(response.reframing.block.heading, "Choose one of the mock scenarios");
});
