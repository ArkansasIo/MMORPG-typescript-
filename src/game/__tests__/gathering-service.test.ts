import { describe, expect, it } from "vitest";
import { GatheringService } from "../inventory/GatheringService";
import { Inventory, type ItemDefinition } from "../inventory/Inventory";

const herb: ItemDefinition = { id: "herb", name: "Healing Herb", kind: "material", stackable: true, maxStack: 20, price: 4, description: "A medicinal herb." };
const setup = () => {
  const service = new GatheringService([herb]);
  service.registerNode({ id: "patch", name: "Herb Patch", itemId: "herb", yield: 2, remaining: 3 });
  return service;
};

describe("GatheringService", () => {
  it("collects the configured yield and reduces node reserves", () => {
    const service = setup();
    const inventory = new Inventory();
    const result = service.gather("patch", inventory);
    expect(result.success).toBe(true);
    expect(inventory.quantity("herb")).toBe(2);
    expect(service.listNodes()[0].remaining).toBe(1);
  });
  it("does not deplete a node if the inventory is full", () => {
    const service = setup();
    const inventory = new Inventory(1);
    inventory.add({ ...herb, id: "occupied" });
    const result = service.gather("patch", inventory);
    expect(result.success).toBe(false);
    expect(service.listNodes()[0].remaining).toBe(3);
  });
  it("enforces tool requirements and depleted nodes", () => {
    const service = new GatheringService([herb]);
    service.registerNode({ id: "vein", name: "Iron Vein", itemId: "herb", yield: 1, remaining: 1, requiredTool: "Mining Pick" });
    const inventory = new Inventory();
    expect(service.gather("vein", inventory, false).success).toBe(false);
    expect(service.gather("vein", inventory, true).success).toBe(true);
    expect(service.gather("vein", inventory, true).success).toBe(false);
  });
  it("validates node definitions and restocking", () => {
    const service = setup();
    expect(() => service.registerNode({ id: "bad", name: "Bad", itemId: "missing", yield: 1, remaining: 1 })).toThrow(/invalid/);
    service.restock("patch", 4);
    expect(service.listNodes()[0].remaining).toBe(7);
  });
});

  it('snapshots and restores reserves while rejecting malformed state', () => {
    const service = setup();
    const inventory = new Inventory();
    service.gather('patch', inventory);
    const snapshot = service.snapshot();
    const restored = setup();
    restored.restore(snapshot);
    expect(restored.listNodes()[0].remaining).toBe(1);
    expect(() => restored.restore([{ id: 'unknown', remaining: 0 }])).toThrow();
    expect(() => restored.restore([{ id: 'patch', remaining: 4 }])).toThrow(/invalid reserves/);
  });
