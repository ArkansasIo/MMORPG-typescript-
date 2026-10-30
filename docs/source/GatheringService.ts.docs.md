# GatheringService — Source Documentation

- **Document ID:** ER-DOC-FILE-GATHERING-SERVICE-0001
- **Source ID:** ER-FILE-GATHERING-SERVICE-0001
- **Module ID:** ER-MOD-GATHERING-0001
- **Source backlink:** [../../src/game/inventory/GatheringService.ts](../../src/game/inventory/GatheringService.ts)
- **Master:** [../MASTER_DOCUMENTATION.md](../MASTER_DOCUMENTATION.md)
- **Status:** Implemented local resource gathering

## API
- `registerNode(node)` validates and registers a finite resource node.
- `listNodes()` returns cloned node state.
- `gather(nodeId, inventory, hasTool?)` adds the configured yield only if inventory capacity permits; a required tool can gate access.
- `restock(nodeId, quantity)` replenishes a node.

## Invariants
A failed gather never consumes node reserves. A successful gather reduces reserves by the amount actually added to inventory.

## Limitations
Node reserves are held in memory and are not included in the save schema yet. Tool ownership is passed as a boolean by the caller; equipment-aware tool validation and multiplayer server authority remain future work.
