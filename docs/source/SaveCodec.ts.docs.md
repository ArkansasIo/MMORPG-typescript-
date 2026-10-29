# SaveCodec.ts — Versioned Save Serialization

- **Source:** `src/game/persistence/SaveCodec.ts`
- **Tests:** `src/game/__tests__/save-codec.test.ts`
- **Current schema:** version 1

## Contract

`encodeSave` validates a `SessionSave` snapshot before JSON serialization. `decodeSave` parses serialized JSON, rejects invalid syntax or unsupported schema versions, validates the character/world/inventory/quest structures, and returns a detached copy.

## Important limitations

Validation is a structural integrity check, not authentication or anti-cheat protection. A client can alter its own save before submitting it. Production online play must validate authoritative player state on the server and use a migration strategy when save schemas change. Version 1 snapshots do not yet contain item definitions or the full world-map data; they store inventory item IDs and the active map ID.
