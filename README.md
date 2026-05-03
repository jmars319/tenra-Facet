# tenra Facet

tenra Facet is a search tool that helps people see questions from multiple angles without answering for them.

This repository is a production-minded pnpm monorepo scaffold. The web app is the active early surface. Desktop and mobile are present as thin shells so future platform work does not require a repo reshape later.

## Current status

- Active now: `apps/webapp`
- Scaffolded and intentionally minimal: `apps/desktopapp`, `apps/mobileapp`
- Central packages: `shared-types`, `domain`, `api-contracts`, `validation`, `search-providers`, `reframing`, `safety`, `privacy`, `config`
- Support packages: `auth`, `ui`
- Optional placeholders: `optional-realtime`, `optional-geo`

## Getting started

```bash
pnpm bootstrap
pnpm dev:web
```

Useful commands:

- `pnpm check:env`
- `pnpm check:packages`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm verify:web`
- `pnpm verify:desktop`
- `pnpm verify:mobile`
- `pnpm verify:all`
- `pnpm doctor`

## Why it is structured this way

- Apps stay thin and mostly compose shared packages.
- Shared packages own contracts and reusable logic seams.
- Search providers, reframing, privacy, and safety are isolated so they can grow without forcing platform-specific branching.
- Desktop and mobile are scaffolded now, but kept inactive until the product needs them.

## Next steps

What exists today is scaffolding only. Real search aggregation, deduplication, provenance enrichment, reframing behavior, and safety enforcement are intentionally not implemented yet.

The web shell now includes a fixture-backed vertical slice for a few representative scenarios, but it still does not perform live search or live LLM behavior.

See `docs/DEVELOPER_GUIDE.md`, `docs/REPO_MAP.md`, `docs/ARCHITECTURE_NOTES.md`, and `docs/NEGATIVE_SPEC.md` for the working conventions and extension points.
