# tenra Facet

tenra Facet is a search and reframing workbench for turning open-ended questions into inspectable research paths. It emphasizes framing, source boundaries, and answer review rather than presenting search results or AI output as final truth.

Facet is early-stage product infrastructure for research workflows inside the tenra ecosystem.

## Operational Purpose

- Help operators reframe a question into more useful research angles.
- Keep search providers, reframing logic, and validation separated.
- Support answer review with explicit assumptions and source boundaries.
- Provide a shared vocabulary for research-oriented handoffs.

## Design Posture

- Framing before answering.
- Search provider boundaries over ad hoc scraping.
- Optional geo/realtime packages kept separate until needed.
- Desktop and web surfaces stay thin around shared domain logic.
- AI assistance should improve review clarity, not replace review.

## Architecture

```text
apps/
  webapp/       Next.js research and reframing surface
  desktopapp/   Tauri + React/Vite local workbench
  mobileapp/    Reserved Expo surface for later lightweight review

packages/
  domain/           Question, source, and research-path models
  reframing/        Reframing helpers and answer-shape vocabulary
  search-providers/ Provider interfaces and local preview adapters
  safety/           Review and boundary helpers
  validation/       Runtime schemas
  api-contracts/    Request and response contracts
  ui/               Shared interface primitives
  config/           Product identity and environment helpers
```

## Current State

- The repo is active product infrastructure for the Facet direction.
- Web and desktop surfaces are present for research workflow development.
- Shared packages define the early product vocabulary.
- Provider behavior is intentionally bounded and still evolving.
- Mobile is reserved for later review use.

## Deployment Posture

Facet is not production research infrastructure yet. Deployment should wait until provider behavior, source handling, safety boundaries, and persistence expectations are clearer.

## Working Locally

```bash
pnpm run bootstrap
pnpm run dev:web
pnpm run dev:desktop
pnpm run typecheck
pnpm run verify:all
pnpm run doctor
```

## Direction

- Improve source-boundary and assumption review.
- Clarify which research workflows belong in Facet versus Derive or Sentinel.
- Keep provider adapters replaceable and explicit.
- Build toward structured research handoffs instead of generic answer generation.

## Related Documentation

- [Architecture Notes](docs/ARCHITECTURE_NOTES.md)
- [Negative Spec](docs/NEGATIVE_SPEC.md)
- [Developer Guide](docs/DEVELOPER_GUIDE.md)
- [Repo Map](docs/REPO_MAP.md)
