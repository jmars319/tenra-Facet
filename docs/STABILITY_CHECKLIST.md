# Stability Checklist

Use this checklist when making scaffold changes or activating new product layers.

- Run `pnpm check:env`.
- Run `pnpm check:packages`.
- Run `pnpm lint`.
- Run `pnpm typecheck`.
- Run `pnpm verify:web`.
- Run `pnpm verify:desktop` when desktop files or shared packages used by desktop change.
- Run `pnpm verify:mobile` when mobile files or shared packages used by mobile change.
- Keep apps thin. If logic starts to spread across app folders, move it into a package.
- Extend `domain`, `api-contracts`, and `validation` together when adding new shared objects.
- Keep search-provider integrations behind `packages/search-providers`.
- Keep reframing behavior behind `packages/reframing`.
- Keep policy labels, refusal patterns, and redirection behavior behind `packages/safety`.
- Update docs when a scaffolded platform becomes active or when optional packages become required.
