# GameSession.ts — Integration Layer

- **File ID:** ER-FILE-GAME-SESSION-0001
- **Module ID:** ER-MOD-SESSION-0001
- **Source:** `src/game/GameSession.ts`
- **Master documentation:** [Master Documentation](../MASTER_DOCUMENTATION.md)

## Responsibility

`GameSession` is the browser prototype's orchestration boundary. It composes a character, a validated tile map, movement collision, inventory, and quest progress into one session object.

## Current behavior

- Validates that the initial spawn is inside a walkable tile.
- Moves one tile at a time and rejects blocked or out-of-bounds movement.
- `transitionTo(map, spawn)` atomically swaps the active map, collision model, and validated arrival position while preserving character, inventory, and quest state.
- Records visit objectives for visited coordinates, map exits, and NPC locations.
- Registers and accepts quests using `QuestEngine`.
- Grants completed quest XP and gold to the character and reports item reward IDs for a future item-definition resolver.
- Exposes a detached session save snapshot containing character data, map ID, position, inventory stacks, and quest progress.

## Boundaries and next work

This class does not yet persist directly to MySQL, restore a session from a save, resolve quest item rewards into item definitions, or coordinate server-authoritative multiplayer. The save snapshot is data transfer only. Use `SaveCodec` to validate and serialize it before storage.
