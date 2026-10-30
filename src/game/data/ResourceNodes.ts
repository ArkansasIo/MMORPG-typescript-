/**
 * @file-id ER-FILE-RESOURCE-NODES-0001
 * @module-id ER-MOD-GATHERING-0001
 * @doc ../../../docs/source/ResourceNodes.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Purpose: starter-region resource node catalog.
 */
import type { ResourceNode } from "../inventory/GatheringService";

export const STARTER_RESOURCE_NODES: ResourceNode[] = [
  { id: "meadow-herb-patch", name: "Meadow Herb Patch", itemId: "healing-herb", yield: 2, remaining: 8 },
  { id: "old-road-herb-patch", name: "Old Road Herb Patch", itemId: "healing-herb", yield: 1, remaining: 5 },
  { id: "ruin-iron-vein", name: "Ruined Iron Vein", itemId: "iron-key", yield: 1, remaining: 2, requiredTool: "Mining Pick" }
];
