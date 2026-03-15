# Architecture Notes

## Intended seams

Facet is organized so the product can grow by activating seams instead of reshaping the whole repo.

- Multi-provider search aggregation: `packages/search-providers` is the future home for provider adapters and normalization.
- Deduplication and provenance: `packages/domain` and `packages/shared-types` already hold the basic result and provenance shapes that later aggregation work can enrich.
- Reframing and orientation: `packages/reframing` exists to help users inspect a question from different angles. It should never collapse into an answer engine that decides for the user.
- Safety and policy: `packages/safety` is the home for labels, assessments, refusal patterns, and redirect patterns once real policy behavior is introduced.
- Refusal and redirection behavior: server or application layers can depend on `packages/safety` contracts later without hard-coding policy behavior into app shells.
- Opt-in deeper exploration: future flows for broadening, comparing, challenging, or contextualizing a query should remain optional actions initiated by the user.

## Current server seam

- The web app now has a server-side Facet boundary at `apps/webapp/src/app/api/facet/search/route.ts`.
- The route delegates orchestration to `apps/webapp/src/lib/server/facet-search.ts`.
- That server-only module assembles the response from fixture-backed search-provider and reframing packages, validates the request and response, and returns one boring explicit payload.
- Providers are still mocked.
- Reframing is still mocked.
- The point of the seam is to make future live provider and live reframing integration land in one server boundary instead of inside UI components.

## Structural rules

- Apps stay thin and mostly orchestrate shared packages.
- Shared packages own reusable logic and contracts.
- Platform-specific code should not become the source of truth for search, reframing, privacy, or safety behavior.
- Optional packages should stay dormant until they are justified by actual product needs.

## What is intentionally absent

- No real search provider calls
- No deduplication engine
- No provenance scoring logic
- No LLM or reframing implementation
- No safety enforcement logic
- No refusal or redirect policies wired into runtime behavior yet

The scaffold exists so those layers can be added later without re-architecting the repo.
