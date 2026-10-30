# Tiled JSON world adapter

This project contains an original TypeScript Tiled JSON adapter at `src/game/world/TiledMapLoader.ts`. It converts the supported Tiled layer convention into the existing `TileMap` model.

## Supported layers

- `tileLayer`: required tile GIDs, exactly width × height.
- `tileLayer2`: optional second visual layer, retained as raw GIDs for interior/roof rendering.
- `collisionLayer`: optional collision GIDs; non-zero cells block movement.
- `warpLayer`: object entries of type `warp` with `map`, `col`, `row`, and optional `dir`.
- `npcLayer`: `npc`, `door`, and `talkAcross` object types.
- `enemyTerritoryLayer`: optional per-cell encounter group GIDs.

## Tileset properties

Tile definitions can declare `kind` or `terrain` (one of the project's TileKind values), `blocked` (boolean), and `encounterTableId`. Unrecognized tile kinds default to grass; water, mountains, and walls are blocked by default.

## Coordinate convention

Tiled object pixel coordinates are converted to tile coordinates using floor(x / tilewidth) and floor(y / tileheight). Warp destination `col` maps to target X and `row` maps to target Y.

## Use

```ts
import { loadTiledMap } from "./world/TiledMapLoader";
const result = loadTiledMap(tiledJson, { id: "starter-village", name: "Starter Village" });
const map = result.map;
```

The result retains the visual GID layers and typed warps, NPC metadata, doors, talk-across markers, and map properties so the renderer and interaction systems can consume them without coupling Tiled parsing to game rules.

## Runtime integration

Use `GameRuntime.createFromTiledMap` to create a playable domain session directly from an authored map. It validates the Tiled document, constructs the existing `GameSession` against the imported `TileMap`, and exposes a `TiledMapRuntime` as `game.tiledWorld` for warp, NPC, encounter-region, talk-across, door, and visual-GID lookups.

```ts
const game = GameRuntime.createFromTiledMap({
  seed: 2026,
  characterName: "Wayfarer",
  characterClass: "Fighter",
  mapId: "starter-village",
  mapName: "Starter Village",
  document: tiledJson,
  spawn: { x: 2, y: 2 }
});
game.move("north");
const nearbyNpc = game.tiledWorld?.npcAt(game.session.position);
```

The framework-independent browser facade exposes `startTiledMap(options)`. The title screen now accepts a Tiled JSON file upload, validates it, selects the first walkable tile as the player spawn, and starts a session using the existing map renderer. Terrain types and collision are therefore visible/playable immediately. The renderer still does not draw actual Tiled tileset image atlases or the optional second visual layer, and warp transitions, NPC proximity interactions, and keyed-door UI actions are not yet wired into the screen. Tiled map saves are not yet restorable through the current procedural-only save restoration path; do not treat this as completed persistence.


## Included sample map

An original metadata-based sample is available at [public/maps/starter-village.json](../public/maps/starter-village.json). It includes a walkable grassland, blocked water/forest terrain, a collision boundary, a village elder, a keyed storehouse door, a talk-across marker, and a warp object. Use the title-screen **Or load a Tiled JSON map** file picker to import it. The sample intentionally contains tile metadata but no copyrighted or third-party image atlas; the game renders its terrain using the existing pixel-style glyph renderer.
