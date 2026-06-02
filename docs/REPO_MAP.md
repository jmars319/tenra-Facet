# Repo Map

## Apps

- `apps/desktopapp`: Primary Vite + React + Tauri product surface. It now provides a local multi-angle question and reframing workbench with saved local corpus documents, built-in scenario starters, orientation prompts, saved history, and Markdown export.
- `apps/webapp`: Secondary Next.js hosted/API companion surface. It currently has the built-in local preview vertical slice.
- `apps/mobileapp`: Third-surface Expo + React Native shell for future mobile support.

## Central packages

- `packages/shared-types`: Shared primitives such as ids, timestamps, URLs, and basic references.
- `packages/domain`: Core Facet by Tenra concepts like search queries, results, provenance, reframing prompts, and safety disposition.
- `packages/api-contracts`: Request and response shapes for future server routes.
- `packages/validation`: Zod schemas for selected shared and API objects.
- `packages/search-providers`: Search provider interfaces and normalized result contracts.
- `packages/reframing`: Orientation and follow-up contracts for helping users inspect a question from different angles.
- `packages/safety`: Reserved types for future policy, refusal, and redirection behavior.
- `packages/privacy`: Reserved privacy and data-handling contracts.
- `packages/config`: Shared product and platform constants.

## Support packages

- `packages/auth`: Reserved session and auth subject types.
- `packages/ui`: Small shared tokens only. This is not a component library.

## Optional packages

- `packages/optional-realtime`: Reserved for future real-time needs. Not active today.
- `packages/optional-geo`: Reserved for future location-aware work. Not active today.

## Operations

- `scripts/`: Root shell commands for bootstrap, environment checks, dev entry points, and verification.
- `docs/`: Working documentation for developers and future contributors.
- `docs/NEGATIVE_SPEC.md`: Guardrails for what Facet by Tenra should never turn into.
- `archive/`: Reserved for retired assets or notes that should stay in repo history without cluttering the active tree.
