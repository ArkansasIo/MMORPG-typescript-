import { describe, expect, it } from "vitest";
import { Character } from "../character/Character";
import { GameSession } from "../GameSession";
import { STARTER_QUESTS } from "../data/StarterContent";
import { STARTER_DIALOGUE } from "../data/Dialogue";
import { InteractionService } from "../interactions/InteractionService";
import { TileMap } from "../world/TileMap";

function makeSession() {
  const map = new TileMap({ schemaVersion: 1, id: "starter", name: "Starter", width: 1, height: 1, tiles: [{ kind: "grass", blocked: false }], exits: [], npcs: [] });
  const session = new GameSession(new Character("Hero", "Fighter", { id: "hero" }), map, { x: 0, y: 0 });
  STARTER_QUESTS.forEach(quest => session.registerQuest(quest));
  return session;
}
describe("InteractionService", () => {
  it("accepts an available quest from a dialogue choice", () => {
    const session = makeSession();
    const interactions = new InteractionService(session, STARTER_DIALOGUE);
    const result = interactions.chooseDialogue("meadow-elder", "greeting", "offer-help");
    expect(result.questAccepted).toBe("slime-trouble");
    expect(session.quests.getProgress("slime-trouble").status).toBe("active");
  });
  it("does not accept a quest whose prerequisite is incomplete", () => {
    const session = makeSession();
    const interactions = new InteractionService(session, STARTER_DIALOGUE);
    const result = interactions.chooseDialogue("meadow-elder", "greeting", "offer-help");
    expect(result.questAccepted).toBeUndefined();
    expect(result.message).toContain("locked");
  });
});
