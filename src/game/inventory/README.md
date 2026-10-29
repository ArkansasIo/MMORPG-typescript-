# Inventory Module
- Folder ID: ER-DIR-INVENTORY-0001
- Module ID: ER-MOD-INVENTORY-0001
- Parent ID: ER-MOD-GAME-0001
- Purpose: stack management, equipment, wallet transactions, and shops.
- Source: Inventory.ts (ER-FILE-INVENTORY-ENGINE-0001)
- Docs: [Master](../../../../docs/MASTER_DOCUMENTATION.md), [Inventory docs](../../../../docs/source/Inventory.ts.docs.md)
- Status: Partial; persistence and validated item catalog remain future work.

## Crafting extension
- [CraftingService.ts](./CraftingService.ts) — validates recipes and crafts from inventory materials.
- [Recipes.ts](../data/Recipes.ts) — starter recipes.
- [CraftingService docs](../../../docs/source/CraftingService.ts.docs.md) — public API and boundaries.

## Shop transactions
The [Inventory.ts](./Inventory.ts) module also provides ShopService for atomic buy/sell checks. Browser-facing operations are exposed by BrowserGameController and surfaced in the Shop tab.
