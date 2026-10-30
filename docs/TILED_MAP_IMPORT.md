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

The framework-independent browser facade also exposes `startTiledMap(options)`. The current browser renderer still renders the procedural map path; this integration makes the imported map available to the domain runtime and tests but does not yet provide Tiled tileset image rendering or map-transition orchestration. Tiled map saves are not yet restorable through the current procedural-only save restoration path; do not treat this as completed persistence.
