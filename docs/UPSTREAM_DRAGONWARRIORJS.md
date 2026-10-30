# Upstream project research and reuse boundary

Research reference: [bobbylight/DragonWarriorJS](https://github.com/bobbylight/DragonWarriorJS).

The upstream README describes a TypeScript NES-era fantasy RPG prototype with Tiled JSON maps, layered tile rendering, collision, map warps, NPC conversations, doors, enemy territory encounter regions, shops, combat, and sound.

## Licensing and source handling

The upstream repository root inspected for this integration did not expose a `LICENSE` file or a license grant in its README. A public GitHub repository is not automatically licensed for copying, modification, or redistribution. Accordingly, this repository does **not** copy or vendor upstream source files, map files, artwork, audio, or dialogue.

The Tiled map adapter and runtime helpers added here are original TypeScript implementations based on the publicly documented map concepts and the existing Earthbound Realms domain model. Before incorporating upstream code or assets verbatim, obtain permission or confirm a license from the upstream maintainer and preserve any required notices.

## Adapted feature concepts

- Tiled JSON map ingestion and layered visual data.
- Collision and terrain metadata.
- Map-to-map warp objects.
- NPC metadata and dialogue lookup IDs.
- Keyed doors and replacement tile indexes.
- Talk-across interaction markers.
- Enemy territory / encounter group metadata.

These integrations are deliberately independent of the upstream implementation and retain Earthbound Realms' existing `TileMap`, `GameSession`, `DialogueEngine`, and combat abstractions.
