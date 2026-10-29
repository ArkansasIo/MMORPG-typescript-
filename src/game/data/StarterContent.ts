import type { ItemDefinition } from "../inventory/Inventory";
import type { QuestDefinition } from "../quests/QuestEngine";

export const STARTER_ITEMS: ItemDefinition[] = [
  { id: "small-potion", name: "Small Potion", kind: "consumable", stackable: true, maxStack: 10, price: 12, description: "Restores a small amount of health." },
  { id: "iron-sword", name: "Iron Sword", kind: "weapon", stackable: false, maxStack: 1, price: 45, description: "A dependable starter weapon.", slot: "weapon", statBonus: 2 },
  { id: "travel-cloak", name: "Travel Cloak", kind: "armor", stackable: false, maxStack: 1, price: 30, description: "A weathered travel cloak.", slot: "body", statBonus: 1 },
  { id: "healing-herb", name: "Healing Herb", kind: "material", stackable: true, maxStack: 20, price: 4, description: "A common herb used in simple remedies." }
];

export const STARTER_QUESTS: QuestDefinition[] = [
  {
    id: "meadow-first-steps",
    title: "First Steps",
    description: "Explore the meadow and learn the basics of travel.",
    prerequisites: [],
    objectives: [{ id: "visit-marker", kind: "visit", targetId: "meadow-marker", required: 1 }],
    reward: { xp: 25, gold: 10, itemIds: ["small-potion"] }
  },
  {
    id: "slime-trouble",
    title: "Slime Trouble",
    description: "Defeat the slimes threatening the road.",
    prerequisites: ["meadow-first-steps"],
    objectives: [{ id: "slimes-defeated", kind: "kill", targetId: "slime", required: 3 }],
    reward: { xp: 75, gold: 35, itemIds: ["small-potion"] }
  },
  {
    id: "roadside-supplies",
    title: "Roadside Supplies",
    description: "Gather herbs for the local healer.",
    prerequisites: [],
    objectives: [{ id: "herbs-collected", kind: "collect", targetId: "healing-herb", required: 5 }],
    reward: { xp: 40, gold: 20, itemIds: ["travel-cloak"] }
  }
];
