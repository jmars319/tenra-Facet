import assert from "node:assert/strict";
import test from "node:test";

import { buildFacetSearchRequest } from "../facet-search-request";
import { defaultFacetMockQuery, runFacetSearch } from "./facet-search";
import { facetOrientationPacketSchema } from "@facet/validation";

test("runFacetSearch returns normalized results and one orientation block", async () => {
  const response = await runFacetSearch(buildFacetSearchRequest(defaultFacetMockQuery));

  assert.ok(response.search.results.length > 0);
  assert.ok(response.search.results[0]?.provenance.surfacedBy.length);
  assert.ok(response.reframing.block.followups.length > 0);
});

test("runFacetSearch falls back cleanly for an unknown preview query", async () => {
  const response = await runFacetSearch(buildFacetSearchRequest("unknown local preview query"));

  assert.equal(response.search.results.length, 0);
  assert.equal(response.reframing.block.heading, "Choose one of the built-in scenarios");
});

test("Facet orientation packets validate for Derive handoff", async () => {
  const request = buildFacetSearchRequest(defaultFacetMockQuery);
  const response = await runFacetSearch(request);

  const packet = facetOrientationPacketSchema.parse({
    schema: "tenra-facet.orientation-packet.v1",
    exportedAt: "2026-05-06T17:30:00.000Z",
    sourceApp: "facet",
    query: request.query,
    response,
    handoff: {
      recommendedNextApp: "derive",
      prompt: "Use this orientation packet to produce a structured answer.",
      notes: ["Preserve result provenance and uncertainty."],
    },
  });

  assert.equal(packet.handoff.recommendedNextApp, "derive");
});
