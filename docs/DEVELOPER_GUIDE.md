# Developer Guide

## Product posture

tenra Facet is a search tool that helps people see questions from multiple angles without answering for them. The repo is structured to support that posture without overcommitting to implementation details too early.

## Daily flow

1. Run `pnpm bootstrap` on a fresh checkout.
2. Use `pnpm dev:desktop` for product-surface work.
3. Use `pnpm dev:web` for the secondary hosted/API companion surface.
4. Use `pnpm dev:mobile` only when there is a mobile-specific reason.
5. Run `pnpm lint`, `pnpm typecheck`, and the relevant `pnpm verify:*` command before wrapping up a change.

## Environment expectations

- Node `>= 22`
- pnpm `>= 10`
- Rust and Cargo for the primary desktop surface

The root scripts check these assumptions directly and fail clearly when something required is missing.

## Local Tooling

The shared local machine baseline supports Facet's search, safety, and desktop workflows:

- Use `cargo audit`, `cargo deny`, and `sccache` around Tauri/Rust work in `apps/desktopapp/src-tauri`.
- Use `actionlint` before changing GitHub Actions workflows.
- Use `shellcheck` and `shfmt` when editing repo scripts.
- Use `osv-scanner` for dependency advisory checks across package manifests.
- Use `pa11y` and `lighthouse` against the running web or desktop-served UI when search-result screens change.

## Extension rules

- Add reusable types to `packages/shared-types` or `packages/domain`, not directly inside an app.
- Define route shapes in `packages/api-contracts` before wiring handlers.
- Add runtime schemas in `packages/validation` for any shared payload that crosses a trust boundary.
- Put provider-specific adapters in `packages/search-providers`.
- Put orientation and follow-up generation contracts in `packages/reframing`.
- Put policy labels, refusal patterns, redirection patterns, and review outcomes in `packages/safety`.
- Keep privacy-sensitive helpers or data-handling configuration in `packages/privacy`.

## Web seam

- The web shell now calls a server route instead of assembling the tenra Facet response inside the client component.
- The route lives at `apps/webapp/src/app/api/facet/search/route.ts`.
- The server orchestration lives at `apps/webapp/src/lib/server/facet-search.ts`.
- Search and reframing data are still fixture-backed. The seam exists so future live integrations have one place to land.

## Platform status

- Desktop is first and should become the main product workflow.
- Web is second and should stay useful for hosted/API companion work.
- Mobile is third and should stay inactive until there is a clear mobile-specific need.
