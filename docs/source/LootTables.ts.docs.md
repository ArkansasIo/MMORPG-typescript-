# LootTables.ts — Creature Item Drops

**Source:** `src/game/data/LootTables.ts`  
**Consumer:** `src/game/combat/BattleService.ts`

Loot tables define item IDs, independent drop chances, and inclusive quantity ranges per creature. `rollLoot` accepts an injectable random source for deterministic tests. BattleService rolls loot for defeated creatures after player-side victory and attempts to add drops through registered item definitions.

If an item definition is missing or the inventory cannot fit a drop, the battle result reports it under `unresolvedItemDrops` rather than pretending it was awarded. Add the matching item definition to the starter catalog or another content registry to make the drop collectible.

This is prototype loot logic; production reward rolls must run on the authoritative server.
