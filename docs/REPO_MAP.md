# Repo Map

## Apps

- `apps/desktopapp`: Primary Vite + React + Tauri product surface. It now provides a local multi-angle question and reframing workbench with saved local corpus documents, built-in scenario starters, orientation prompts, saved history, and Markdown export.
- `apps/webapp`: Secondary Next.js hosted/API companion surface. It currently has the fixture-backed vertical slice.
- `apps/mobileapp`: Third-surface Expo + React Native shell for future mobile support.

## Central packages

- `packages/shared-types`: Shared primitives such as ids, timestamps, URLs, and basic references.
- `packages/domain`: Core tenra Facet concepts like search queries, results, provenance, reframing prompts, and safety disposition.
- `packages/api-contracts`: Request and response shapes for future server routes.
- `packages/validation`: Zod schemas for selected shared and API objects.
- `packages/search-providers`: Search provider interfaces and normalized result contracts.
- `packages/reframing`: Orientation and follow-up contracts for helping users inspect a question from different angles.
- `packages/safety`: Placeholder types for future policy, refusal, and redirection behavior.
- `packages/privacy`: Privacy and data-handling placeholders.
- `packages/config`: Shared product and platform constants.

## Support packages

- `packages/auth`: Placeholder session and auth subject types.
- `packages/ui`: Small shared tokens only. This is not a component library.

## Optional packages

- `packages/optional-realtime`: Reserved for future real-time needs. Not active today.
- `packages/optional-geo`: Reserved for future location-aware work. Not active today.

## Operations

- `scripts/`: Root shell commands for bootstrap, environment checks, dev entry points, and verification.
- `docs/`: Working documentation for developers and future contributors.
- `docs/NEGATIVE_SPEC.md`: Guardrails for what tenra Facet should never turn into.
- `archive/`: Reserved for retired assets or notes that should stay in repo history without cluttering the active tree.
