export interface DialogueChoice { id: string; text: string; nextNodeId?: string; questId?: string; }
export interface DialogueNode { id: string; speaker: string; text: string; choices?: DialogueChoice[]; }
export interface DialogueTree { id: string; startNodeId: string; nodes: DialogueNode[]; }
export interface DialogueReply { treeId: string; node: DialogueNode; choices: DialogueChoice[]; }
export class DialogueEngine {
  private readonly trees = new Map<string, DialogueTree>();
  register(tree: DialogueTree): void {
    if (!tree.id.trim() || !tree.startNodeId.trim() || !tree.nodes.length) throw new Error("Dialogue tree requires an id, start node, and nodes");
    const ids = new Set<string>();
    for (const node of tree.nodes) {
      if (!node.id.trim() || !node.speaker.trim() || !node.text.trim() || ids.has(node.id)) throw new Error("Dialogue nodes require unique IDs, speakers, and text");
      ids.add(node.id);
      for (const choice of node.choices ?? []) if (!choice.id.trim() || !choice.text.trim()) throw new Error("Dialogue choices require IDs and text");
    }
    if (!ids.has(tree.startNodeId)) throw new Error("Dialogue start node does not exist");
    for (const node of tree.nodes) for (const choice of node.choices ?? []) {
      if (choice.nextNodeId && !ids.has(choice.nextNodeId)) throw new Error(`Dialogue choice points to missing node: ${choice.nextNodeId}`);
    }
    this.trees.set(tree.id, structuredClone(tree));
  }
  get(treeId: string, nodeId?: string): DialogueReply | undefined {
    const tree = this.trees.get(treeId);
    if (!tree) return undefined;
    const node = tree.nodes.find(entry => entry.id === (nodeId ?? tree.startNodeId));
    return node ? { treeId, node: structuredClone(node), choices: structuredClone(node.choices ?? []) } : undefined;
  }
  choose(treeId: string, nodeId: string, choiceId: string): DialogueReply | undefined {
    const current = this.get(treeId, nodeId);
    if (!current) return undefined;
    const choice = current.choices.find(entry => entry.id === choiceId);
    if (!choice) return undefined;
    if (!choice.nextNodeId) return { treeId, node: { id: "end", speaker: current.node.speaker, text: "The conversation ends here." }, choices: [] };
    return this.get(treeId, choice.nextNodeId);
  }
  list(): string[] { return [...this.trees.keys()]; }
}
