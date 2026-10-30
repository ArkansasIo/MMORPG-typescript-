# SaveCodec.ts — Versioned Save Serialization

- **Source:** `src/game/persistence/SaveCodec.ts`
- **Tests:** `src/game/__tests__/save-codec.test.ts`
- **Current schema:** version 1

## Contract

`encodeSave` validates a `SessionSave` snapshot before JSON serialization. `decodeSave` parses serialized JSON, rejects invalid syntax or unsupported schema versions, validates the character/world/inventory/quest structures, and returns a detached copy.

## Important limitations

Validation is a structural integrity check, not authentication or anti-cheat protection. A client can alter its own save before submitting it. Production online play must validate authoritative player state on the server and use a migration strategy when save schemas change. Version 1 snapshots can optionally include an authored Tiled world catalog: map IDs/names, source Tiled documents, and opened-door IDs. The decoder structurally validates this optional catalog; `GameRuntime.restore` then reparses maps and validates active map and door references. Procedural saves remain compact and do not embed generated map data.


## Resource node persistence
The save codec accepts an optional `resourceNodes` array containing unique node IDs and non-negative integer remaining reserves. The GatheringService validates the IDs and authored reserve ceilings when the controller restores the saved node state. Legacy saves without this optional field remain valid.
