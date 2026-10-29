import { describe, expect, it } from "vitest";
import { DialogueEngine } from "../dialogue/DialogueEngine";
import { STARTER_DIALOGUE } from "../data/Dialogue";

describe("DialogueEngine", () => {
  it("loads starter dialogue and follows a selected branch", () => {
    const engine = new DialogueEngine();
    STARTER_DIALOGUE.forEach(tree => engine.register(tree));
    const greeting = engine.get("meadow-elder");
    expect(greeting?.node.id).toBe("greeting");
    const warning = engine.choose("meadow-elder", "greeting", "ask-road");
    expect(warning?.node.id).toBe("road-warning");
    expect(warning?.node.text).toContain("Slimes");
  });
  it("rejects missing branch destinations", () => {
    const engine = new DialogueEngine();
    expect(() => engine.register({ id: "broken", startNodeId: "start", nodes: [
      { id: "start", speaker: "NPC", text: "Hello", choices: [{ id: "go", text: "Go", nextNodeId: "missing" }] }
    ] })).toThrow(/missing node/);
  });
  it("returns undefined for unknown trees and choices", () => {
    const engine = new DialogueEngine();
    engine.register(STARTER_DIALOGUE[0]);
    expect(engine.get("missing")).toBeUndefined();
    expect(engine.choose("meadow-elder", "greeting", "missing")).toBeUndefined();
  });
});
