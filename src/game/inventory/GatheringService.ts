/**
 * @file-id ER-FILE-GATHERING-SERVICE-0001
 * @module-id ER-MOD-GATHERING-0001
 * @doc ../../../docs/source/GatheringService.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Purpose: collect finite resource-node yields into the player's inventory.
 */
import { Inventory, type ItemDefinition } from "./Inventory";

export interface ResourceNode {
  id: string;
  name: string;
  itemId: string;
  yield: number;
  remaining: number;
  requiredTool?: string;
}

export type GatherResult =
  | { success: true; nodeId: string; itemId: string; quantity: number; remaining: number; message: string }
  | { success: false; nodeId: string; message: string };

export class GatheringService {
  private readonly nodes = new Map<string, ResourceNode>();
  private readonly items = new Map<string, ItemDefinition>();

  constructor(items: ItemDefinition[] = []) {
    for (const item of items) this.items.set(item.id, { ...item });
  }

  registerNode(node: ResourceNode): void {
    if (!node.id.trim() || !node.name.trim() || !this.items.has(node.itemId) ||
        !Number.isInteger(node.yield) || node.yield < 1 ||
        !Number.isInteger(node.remaining) || node.remaining < 0) {
      throw new Error("Resource node definition is invalid");
    }
    if (this.nodes.has(node.id)) throw new Error(`Duplicate resource node: ${node.id}`);
    this.nodes.set(node.id, { ...node });
  }

  listNodes(): ResourceNode[] {
    return [...this.nodes.values()].map(node => ({ ...node }));
  }

  gather(nodeId: string, inventory: Inventory, hasTool = true): GatherResult {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Unknown resource node: ${nodeId}`);
    if (node.remaining < 1) return { success: false, nodeId, message: `${node.name} has been depleted.` };
    if (node.requiredTool && !hasTool) return { success: false, nodeId, message: `You need a ${node.requiredTool} to gather here.` };
    const quantity = Math.min(node.yield, node.remaining);
    const item = this.items.get(node.itemId)!;
    if (!inventory.add(item, quantity)) {
      return { success: false, nodeId, message: "Inventory is full. Make room before gathering." };
    }
    node.remaining -= quantity;
    return {
      success: true,
      nodeId,
      itemId: node.itemId,
      quantity,
      remaining: node.remaining,
      message: `Gathered ${quantity} × ${item.name}.`
    };
  }

  restock(nodeId: string, quantity: number): void {
    const node = this.nodes.get(nodeId);
    if (!node) throw new Error(`Unknown resource node: ${nodeId}`);
    if (!Number.isInteger(quantity) || quantity < 1 || !Number.isSafeInteger(node.remaining + quantity)) {
      throw new Error("Restock quantity must be a positive safe integer");
    }
    node.remaining += quantity;
  }
}
