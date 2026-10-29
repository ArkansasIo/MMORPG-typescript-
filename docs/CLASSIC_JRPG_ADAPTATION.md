# Classic JRPG Adaptation Plan — Earthbound Realms

- **Document ID:** ER-DOC-JRPG-ADAPT-0001
- **Parent:** ER-DOC-MASTER-0001
- **Status:** Reference reviewed; integration plan committed; no upstream source code copied.

## Reference project found
- **Repository:** [bobbylight/DragonWarriorJS](https://github.com/bobbylight/DragonWarriorJS)
- **README:** describes a browser recreation of Dragon Warrior with map movement/loading, collision, NPC conversations, shops, doors/keys, basic attack-only battles, and sound.
- **Map pipeline:** the README describes Tiled JSON maps with layers for tiles, collision, warps, NPCs, and enemy territory.
- **Toolchain:** its current package configuration includes TypeScript, Vite, ESLint, and Vitest, although the repository metadata still describes it as a JavaScript clone.
- **License caution:** no LICENSE file was found at the repository root during this review. Do not copy or redistribute its code/assets until the owner clarifies the applicable license. This project will implement its own code and use the repository as a design reference only.

## What to adapt conceptually
1. Tile-based overworld movement and collision.
2. Data-driven maps, doors, transitions, and interiors.
3. NPC dialogue and interaction events.
4. Shops, currency, keys, treasure, and inventory.
5. Random encounter zones and turn-based battles.
6. Sound/music interface that can be replaced with original audio.
7. Map editor workflow based on documented data formats.

## Earthbound Realms TypeScript architecture
Use typed modules with clean boundaries:
- `src/game/world/`: `TileMap`, `CollisionSystem`, `MapTransitionSystem`, seeded world generation.
- `src/game/interaction/`: `InteractionSystem`, `DialogueService`, NPC behavior and event triggers.
- `src/game/combat/`: `CombatEngine`, initiative, action economy, attack rolls, saves, damage, buffs/debuffs, conditions, encounter rewards.
- `src/game/character/`: character model, six ability scores, classes, derived statistics, progression.
- `src/game/inventory/`: items, equipment, currency, shops, keys and loot.
- `src/game/quests/`: objectives, prerequisites, completion and rewards.
- `src/game/audio/`: audio interface and original asset manifest.
- `src/platform/`: keyboard, mouse, controller and save adapters.
- `src/ui/`: rendering and menus only; UI must not own authoritative game rules.
- `server/src/`: authoritative online simulation, API, sessions and persistence when implemented.

## D20 / D&D 5e-inspired rules
Earthbound Realms may use familiar tabletop concepts—six ability scores, proficiency, d20 checks, saving throws, advantage/disadvantage, initiative, actions, bonus actions, reactions, conditions, concentration, and short/long rests—but must document which rules are implemented and where the game intentionally diverges. Do not describe the project as a complete official D&D 5e implementation. Use original names, lore, maps, dialogue, sprites, sounds, and item descriptions rather than copying protected game assets or text.

## Data contracts
Map data should be validated before use and versioned. A tile map should define dimensions, tile layers, collision flags, exits/warps, NPC spawns, encounter zones, and a schema version. Content data should be separate from runtime code so designers can add regions without editing engine logic.

## Recommended implementation order
1. Add unit tests and typed combat rules.
2. Extract map generation and movement from the existing browser entry point.
3. Add collision and transitions as pure/testable modules.
4. Add NPC interactions and dialogue data.
5. Add inventory, shops, keys, and loot.
6. Add enemy encounter tables and complete turn-based combat.
7. Add original pixel art/audio and a Tiled-compatible import path.
8. Connect the same rules to an authoritative server for multiplayer.

## Verification checklist
- [ ] `npm run build` passes.
- [ ] Deterministic map generation gives the same result for the same seed.
- [ ] Walls block movement and warps transition to valid destinations.
- [ ] NPC conversations and shops are data-driven.
- [ ] Combat hit/damage/reward outcomes have automated tests.
- [ ] No third-party game assets or unlicensed source code are bundled.
- [ ] Documentation registry and per-file sidecars are updated with every new module.
