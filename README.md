# tenra Facet

tenra Facet is a search tool that helps people see questions from multiple angles without answering for them.

This repository is a production-minded pnpm monorepo scaffold. The platform order is desktop first, web second, and mobile third. The web app currently has the earliest fixture-backed vertical slice, but new product depth should land in the desktop workflow first.

## Current status

- Primary target: `apps/desktopapp`
- Secondary target: `apps/webapp`
- Third target: `apps/mobileapp`
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
- Desktop should become the main product surface before the web and mobile surfaces grow further.

## Next steps

The desktop app now provides a local multi-angle question and reframing workbench using the existing fixture-backed search and orientation packages. Real live search aggregation, deduplication, provenance enrichment, live LLM behavior, and safety enforcement are still future work.

The web shell now includes a fixture-backed vertical slice for a few representative scenarios, but it still does not perform live search or live LLM behavior.

See `docs/DEVELOPER_GUIDE.md`, `docs/REPO_MAP.md`, `docs/ARCHITECTURE_NOTES.md`, and `docs/NEGATIVE_SPEC.md` for the working conventions and extension points.
