# Module Manifest

Generated from `tenra Hub/contracts/handoff-catalog.json` by `tenra Hub/scripts/generate-suite-contract-docs.mjs`.

## Standalone Mode

Runs as a complete research orientation app with local queries, responses, orientation packets, endpoint checks, and retry queues.

## Repository Path

`capabilities/reasoning/Facet by Tenra`

## Required Suite Dependencies

- None

## Optional Suite Dependencies

- tenra Derive: Optional reasoning expansion of orientation packets.
- tenra Assembly: Optional content drafting from orientation packets.
- tenra Sentinel: Optional risk lookup from orientation packets.

## Provides

- orientation packet
- endpoint health
- send retry queue

## Consumes

- None

## Contracts

Emits:

- `tenra-facet.orientation-packet.v1`

Accepts:

- None

## Rules

- Each app must remain complete and usable without another tenra app running.
- Suite integrations are optional module links, not required runtime dependencies.
- Shared functions should be exposed through explicit local APIs, exports, imports, or schemas.
- No app may read another app's private filesystem, database, or localStorage state.
- Registry can index and audit the module graph, but it must not become a hidden runtime bus.
