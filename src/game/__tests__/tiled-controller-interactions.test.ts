import { describe, expect, it, vi } from "vitest";
import { BrowserGameController } from "../BrowserGameController";
import type { SaveStorage } from "../persistence/SaveRepository";

class MemoryStorage implements SaveStorage {
  getItem(): string | null { return null; }
  setItem(): void {}
  removeItem(): void {}
}

describe("BrowserGameController Tiled interactions", () => {
  it("resolves the facing NPC and opens a facing door through the controller", () => {
    const controller = new BrowserGameController(new MemoryStorage());
    controller.startTiledMap({
      seed: 7,
      characterName: "Mira",
      characterClass: "Fighter",
      mapId: "interaction-fixture",
      mapName: "Interaction Fixture",
      spawn: { x: 0, y: 0 },
      document: {
        type: "map",
        width: 2,
        height: 2,
        tilewidth: 16,
        tileheight: 16,
        layers: [
          { name: "tileLayer", type: "tilelayer", data: [1, 1, 1, 1] },
          { name: "collisionLayer", type: "tilelayer", data: [0, 0, 0, 0] },
          { name: "npcLayer", type: "objectgroup", objects: [
            { id: 10, type: "npc", name: "Village Elder", x: 16, y: 0 },
            { id: 11, type: "door", x: 0, y: 16, properties: [
              { name: "replacementTileIndex", value: 2 }
            ] }
          ] }
        ]
      }
    });

    expect(controller.getFacingNpc("east")?.name).toBe("Village Elder");
    expect(controller.getFacingNpc("north")).toBeUndefined();
    expect(controller.beginFacingNpcDialogue("east")?.dialogue?.node.speaker).toBe("Village Elder");
    const consumeKey = vi.fn(() => true);
    expect(controller.openFacingDoor("south", consumeKey)).toBe(true);
    expect(consumeKey).toHaveBeenCalledOnce();
    expect(controller.game.tiledWorld?.tileGidAt({ x: 0, y: 1 })).toBe(2);
    expect(controller.game.session.map.getTile(0, 1)).toMatchObject({ kind: "floor", blocked: false });
  });
});
