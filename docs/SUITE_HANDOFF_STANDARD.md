# Suite Handoff Standard

Generated from `tenra Registry/contracts/handoff-catalog.json` by `tenra Registry/scripts/generate-suite-contract-docs.mjs`.

## App Role

research orientation and packet source

keep unique; Derive, Assembly, and Sentinel should consume orientation packets as modular inputs.

## Accepted Inputs

- No accepted suite contract is registered yet.

## Emitted Outputs

- `tenra-facet.orientation-packet.v1` to tenra Derive, tenra Assembly, tenra Sentinel

## Standard Controls

- schema badge
- endpoint health
- retry failed
- payload inspection
- history

## Status Vocabulary

- `draft`: Payload or route exists locally but has not been previewed.
- `previewed`: Payload was built and inspected without delivery.
- `queued`: Delivery is waiting for an endpoint, retry, or operator action.
- `sent`: Producer posted or exported the payload successfully.
- `accepted`: Consumer parsed and retained the payload.
- `rejected`: Consumer refused the payload for schema, routing, safety, or policy reasons.
- `failed`: Delivery failed before acceptance or rejection was known.
- `replayed`: Registry or a producer regenerated a prior payload for another delivery attempt.
- `received`: Consumer acknowledged receipt back to the source app.
- `dismissed`: Operator intentionally removed an item from an inbox, queue, or retry list.

## Local Storage

Prefix: `tenra.facet`

- `tenra.facet.orientationHistory.v1`
- `tenra.facet.retryQueue.v1`
- `tenra.facet.endpointHealth.v1`

## Endpoints

- No suite HTTP endpoint is documented for this app yet.
