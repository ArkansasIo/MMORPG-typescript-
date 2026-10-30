import type { SessionSave } from "../GameSession";

export const CURRENT_SAVE_VERSION = 1;

export function encodeSave(save: SessionSave): string {
  validateSave(save);
  return JSON.stringify(save);
}

export function decodeSave(serialized: string): SessionSave {
  let value: unknown;
  try {
    value = JSON.parse(serialized);
  } catch {
    throw new Error("Save data is not valid JSON");
  }
  validateSave(value);
  return structuredClone(value);
}

function validateSave(value: unknown): asserts value is SessionSave {
  if (!value || typeof value !== "object") throw new Error("Save data must be an object");
  const save = value as Partial<SessionSave>;
  if (save.schemaVersion !== CURRENT_SAVE_VERSION) throw new Error("Unsupported save version");
  if (!save.character || typeof save.character !== "object" ||
      typeof save.character.id !== "string" || typeof save.character.name !== "string" ||
      typeof save.character.level !== "number" || !Number.isFinite(save.character.level) ||
      typeof save.character.xp !== "number" || !Number.isFinite(save.character.xp) ||
      typeof save.character.gold !== "number" || !Number.isFinite(save.character.gold)) {
    throw new Error("Save character data is invalid");
  }
  if (typeof save.mapId !== "string" || !save.mapId ||
      !save.position || !Number.isInteger(save.position.x) || !Number.isInteger(save.position.y) ||
      !Array.isArray(save.inventory) || !Array.isArray(save.quests) ||
      !save.equipment || typeof save.equipment !== "object" || Array.isArray(save.equipment)) {
    throw new Error("Save world or progression data is invalid");
  }
  if (save.resourceNodes !== undefined) {
    if (!Array.isArray(save.resourceNodes)) throw new Error("Save resource node state is invalid");
    const seenNodes = new Set<string>();
    for (const node of save.resourceNodes) {
      if (!node || typeof node.id !== "string" || !node.id.trim() || seenNodes.has(node.id) || !Number.isInteger(node.remaining) || node.remaining < 0) {
        throw new Error("Save resource node state is invalid");
      }
      seenNodes.add(node.id);
    }
  }
  if (save.tiledWorld !== undefined) {
    const world = save.tiledWorld;
    if (!world || typeof world !== "object" || !Array.isArray(world.maps) || world.maps.length < 1 || world.maps.length > 100) {
      throw new Error("Save Tiled world catalog is invalid");
    }
    const mapIds = new Set<string>();
    for (const map of world.maps) {
      if (!map || typeof map.mapId !== "string" || !map.mapId.trim() ||
          typeof map.mapName !== "string" || !map.mapName.trim() ||
          !map.document || typeof map.document !== "object" || !Array.isArray(map.openedDoorIds) ||
          map.openedDoorIds.some(id => typeof id !== "string" || !id)) {
        throw new Error("Save Tiled world map entry is invalid");
      }
      if (mapIds.has(map.mapId)) throw new Error("Save Tiled world contains duplicate map IDs");
      mapIds.add(map.mapId);
    }
    if (!mapIds.has(save.mapId)) throw new Error("Save active map is missing from the Tiled world catalog");
  }

  for (const stack of save.inventory) {
    if (!stack || typeof stack.itemId !== "string" || !stack.itemId ||
        !Number.isInteger(stack.quantity) || stack.quantity < 1) {
      throw new Error("Save inventory data is invalid");
    }
  }
  for (const [slot, itemId] of Object.entries(save.equipment)) {
    if (!["weapon", "head", "body", "accessory"].includes(slot) || typeof itemId !== "string" || !itemId) {
      throw new Error("Save equipment data is invalid");
    }
  }
  for (const quest of save.quests) {
    if (!quest || typeof quest.questId !== "string" ||
        !["locked", "active", "completed"].includes(quest.status) ||
        !quest.counts || typeof quest.counts !== "object") {
      throw new Error("Save quest data is invalid");
    }
  }
}
