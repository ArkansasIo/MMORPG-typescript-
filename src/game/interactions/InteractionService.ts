import { DialogueEngine, type DialogueReply, type DialogueTree } from "../dialogue/DialogueEngine";
import type { GameSession } from "../GameSession";

export interface InteractionResult {
  dialogue?: DialogueReply;
  questAccepted?: string;
  message: string;
}
export class InteractionService {
  readonly dialogue = new DialogueEngine();
  constructor(private readonly session: GameSession, trees: DialogueTree[] = []) {
    for (const tree of trees) this.dialogue.register(tree);
  }
  beginDialogue(treeId: string): DialogueReply | undefined {
    return this.dialogue.get(treeId);
  }
  chooseDialogue(treeId: string, nodeId: string, choiceId: string): InteractionResult {
    const current = this.dialogue.get(treeId, nodeId);
    if (!current) return { message: "That conversation is unavailable." };
    const choice = current.choices.find(entry => entry.id === choiceId);
    if (!choice) return { message: "That response is not available." };
    let questAccepted: string | undefined;
    if (choice.questId) {
      if (this.session.acceptQuest(choice.questId)) questAccepted = choice.questId;
      else return { message: "The quest is locked, already active, or unavailable." };
    }
    const dialogue = this.dialogue.choose(treeId, nodeId, choiceId);
    return {
      dialogue,
      questAccepted,
      message: questAccepted ? `Quest accepted: ${questAccepted}` : dialogue?.node.text ?? "The conversation ends."
    };
  }
}
