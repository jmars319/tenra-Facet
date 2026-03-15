# Developer Guide

## Product posture

Facet is a search tool that helps people see questions from multiple angles without answering for them. The repo is structured to support that posture without overcommitting to implementation details too early.

## Daily flow

1. Run `pnpm bootstrap` on a fresh checkout.
2. Use `pnpm dev:web` for day-to-day product work.
3. Use `pnpm dev:desktop` or `pnpm dev:mobile` only when touching those shells.
4. Run `pnpm lint`, `pnpm typecheck`, and the relevant `pnpm verify:*` command before wrapping up a change.

## Environment expectations

- Node `>= 22`
- pnpm `>= 10`
- Rust and Cargo only when using the desktop shell

The root scripts check these assumptions directly and fail clearly when something required is missing.

## Extension rules

- Add reusable types to `packages/shared-types` or `packages/domain`, not directly inside an app.
- Define route shapes in `packages/api-contracts` before wiring handlers.
- Add runtime schemas in `packages/validation` for any shared payload that crosses a trust boundary.
- Put provider-specific adapters in `packages/search-providers`.
- Put orientation and follow-up generation contracts in `packages/reframing`.
- Put policy labels, refusal patterns, redirection patterns, and review outcomes in `packages/safety`.
- Keep privacy-sensitive helpers or data-handling configuration in `packages/privacy`.

## Platform status

- Web is active first and should remain the simplest path for product iteration.
- Desktop is scaffolded for future operator or power-user workflows.
- Mobile is scaffolded for future support, but should stay inactive until there is a clear mobile-specific need.
