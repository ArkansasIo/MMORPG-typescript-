# Save Repository

`SaveRepository` wraps the versioned save codec with a small storage interface. It supports named save slots, namespace isolation, delete/has/load/save operations, and a configurable serialized byte limit.

## Storage adapters
The interface intentionally matches the common `getItem`, `setItem`, and `removeItem` shape, allowing a browser adapter to wrap localStorage or a test adapter to use an in-memory map. The repository itself does not access browser globals.

## Validation and security
Every write is validated by `encodeSave`; every read is validated by `decodeSave`. Slot names are restricted to letters, numbers, underscores, and hyphens. A size limit prevents unexpectedly large stored blobs.

## Limitations
This layer serializes and validates snapshots; it does not reconstruct a live `GameSession` or verify ownership. Browser storage is user-editable and must not be trusted as authoritative multiplayer state. A server implementation needs authenticated identity, authorization, schema migrations, rate limits, and atomic persistence.
