import type { DialogueTree } from "../dialogue/DialogueEngine";

export const STARTER_DIALOGUE: DialogueTree[] = [
  {
    id: "meadow-elder",
    startNodeId: "greeting",
    nodes: [
      { id: "greeting", speaker: "Village Elder", text: "Welcome, traveler. The meadow road has become dangerous.", choices: [
        { id: "ask-road", text: "What happened on the road?", nextNodeId: "road-warning" },
        { id: "offer-help", text: "I can help.", nextNodeId: "help-offer", questId: "slime-trouble" },
        { id: "leave", text: "I must be going." }
      ]},
      { id: "road-warning", speaker: "Village Elder", text: "Slimes gather beyond the eastern fields. Keep your guard up.", choices: [
        { id: "offer-help", text: "I will deal with them.", nextNodeId: "help-offer", questId: "slime-trouble" },
        { id: "goodbye", text: "Thank you for the warning." }
      ]},
      { id: "help-offer", speaker: "Village Elder", text: "Defeat the slimes and return safely. The village will remember your courage.", choices: [
        { id: "accept", text: "I will return.", nextNodeId: "farewell" }
      ]},
      { id: "farewell", speaker: "Village Elder", text: "May the old roads guide you home." }
    ]
  }
];
