/**
 * @file-id ER-FILE-CLIENT-ENTRY-0001
 * @module-id ER-MOD-CLIENT-0001
 * Browser UI composition root. All game state and domain rules live in BrowserGameController/GameRuntime.
 */
import { BrowserGameController } from "./game/BrowserGameController";
import type { CharacterClass } from "./game/types";
import type { Direction } from "./game/world/CollisionSystem";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing #app root");

const controller = new BrowserGameController(window.localStorage);
const classes: CharacterClass[] = ["Fighter", "Wizard", "Cleric", "Rogue", "Ranger", "Paladin", "Bard", "Druid", "Barbarian"];
let selectedTab = "Character";
let log = "Welcome to the Old World Frontier.";
let zoom = 1;
let activeDialogue: { treeId: string; nodeId: string; speaker: string; text: string; choices: { id: string; text: string }[] } | undefined;
let battleMessage = "";
let gameStarted = false;

const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, char => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
})[char]!);
const tileGlyph: Record<string, string> = { grass: "·", forest: "♣", water: "≈", mountain: "▲", town: "⌂", wall: "▧", floor: "·", door: "▯" };
const tileClass: Record<string, string> = { grass: "grass", forest: "forest", water: "water", mountain: "mountain", town: "town", wall: "mountain", floor: "grass", door: "town" };

function titleScreen(): void {
  gameStarted = false;
  app!.innerHTML = `<div class="title-overlay"><div class="title-card">
    <div class="title-mark">✦</div><p class="eyebrow">BUILD ER-TS-MMORPG-0.1.0</p>
    <h1>EARTHBOUND<br>REALMS</h1><p class="subtitle">A retro fantasy adventure</p>
    <label for="hero-name">Character name</label><input id="hero-name" maxlength="24" value="Wayfarer" />
    <label for="hero-class">Class</label><select id="hero-class">${classes.map(name => `<option value="${name}">${name}</option>`).join("")}</select>
    <label for="world-seed">World seed (integer)</label><input id="world-seed" type="number" value="2026" />
    <button id="new-game">New Game</button><button id="continue-game" ${controller.hasSave("main") ? "" : "disabled"}>Continue Saved Game</button>
    <p class="title-note">Local prototype · Keyboard · Mouse · Gamepad-ready controls</p>
  </div></div>`;
  app!.querySelector<HTMLButtonElement>("#new-game")!.onclick = () => {
    const name = (app!.querySelector<HTMLInputElement>("#hero-name")!.value || "Wayfarer").trim().slice(0, 24) || "Wayfarer";
    const characterClass = app!.querySelector<HTMLSelectElement>("#hero-class")!.value as CharacterClass;
    const seed = Number(app!.querySelector<HTMLInputElement>("#world-seed")!.value);
    if (!Number.isSafeInteger(seed)) { alert("Enter a valid whole-number world seed."); return; }
    controller.startNew({ seed, characterName: name, characterClass });
    activeDialogue = undefined; battleMessage = ""; log = "Your journey begins."; selectedTab = "Character"; gameStarted = true; render();
  };
  app!.querySelector<HTMLButtonElement>("#continue-game")!.onclick = () => {
    try { controller.continueGame("main"); activeDialogue = undefined; battleMessage = ""; log = "Saved adventure restored."; gameStarted = true; render(); }
    catch (error) { alert(error instanceof Error ? error.message : "Could not load the save."); }
  };
}

function tabContent(): string {
  const game = controller.game;
  const session = game.session;
  if (selectedTab === "Inventory") {
    const stacks = session.inventory.list();
    return `<div class="item-list">${stacks.length ? stacks.map(stack => {
      const definition = session.inventory.list().find(item => item.itemId === stack.itemId);
      const usable = stack.itemId === "small-potion";
      return `<div class="item-row"><span><b>${escapeHtml(stack.itemId.replace(/-/g, " "))}</b><small>Quantity: ${stack.quantity}</small></span>${usable ? `<button data-use-item="${stack.itemId}">Use potion</button>` : ""}</div>`;
    }).join("") : "<p>Your inventory is empty.</p>"}</div>
    <p class="hint">Equipped: ${Object.entries(session.save().equipment).map(([slot, id]) => `${escapeHtml(slot)}: ${escapeHtml(id)}`).join(" · ") || "nothing"}</p>`;
  }
  if (selectedTab === "Quests") {
    const quests = [
      { id: "meadow-first-steps", title: "First Steps", objective: "Visit the meadow marker." },
      { id: "slime-trouble", title: "Slime Trouble", objective: "Defeat three slimes." },
      { id: "roadside-supplies", title: "Roadside Supplies", objective: "Gather five healing herbs." }
    ];
    return quests.map(q => {
      const progress = session.quests.getProgress(q.id);
      const count = Object.values(progress.counts).reduce((sum, value) => sum + value, 0);
      return `<div class="quest-row"><b>${escapeHtml(q.title)}</b><span class="status">${progress.status}</span><p>${escapeHtml(q.objective)} ${progress.status === "active" ? `(${count} progress)` : ""}</p>${q.id === "meadow-first-steps" && progress.status === "active" ? '<button id="visit-marker">Inspect meadow marker</button>' : ""}</div>`;
    }).join("");
  }
  if (selectedTab === "World Map") {
    return `<p>Seed: <code>${escapeHtml(session.map.data.id.replace("starter-region-", ""))}</code></p><p>Region size: ${session.map.width} × ${session.map.height} tiles.</p><p>The map is procedurally generated and deterministic for the same seed.</p>`;
  }
  if (selectedTab === "Codex") {
    return `<p>Known creatures: Meadow Slime, Grey Wolf, Roadside Skeleton.</p><p>Combat uses turn order, attack rolls, defense, damage types, XP, gold, and loot.</p>`;
  }
  const c = session.character;
  return `<p>Class: <b>${escapeHtml(c.characterClass)}</b></p><p>Level ${c.level} · XP ${c.xp}/${c.requiredXp()}</p><p>STR ${c.abilities.strength} · DEX ${c.abilities.dexterity} · CON ${c.abilities.constitution}</p><p>INT ${c.abilities.intelligence} · WIS ${c.abilities.wisdom} · CHA ${c.abilities.charisma}</p><p>Attack ${c.attackBonus + session.equipmentBonuses().attackBonus} · Defense ${c.defense + session.equipmentBonuses().defense}</p>`;
}

function battlePanel(): string {
  const state = controller.game.battles.currentBattle;
  if (!state || state.status === "escaped") return "";
  if (state.status === "victory") return `<div class="panel"><h3>BATTLE RESULT</h3><p>${escapeHtml(battleMessage || "Victory! Rewards have been granted.")}</p><button id="dismiss-battle">Continue exploring</button></div>`;
  if (state.status === "defeat") return `<div class="panel"><h3>DEFEAT</h3><p>You have fallen in battle. Start a new encounter after recovering.</p><button id="dismiss-battle">Close</button></div>`;
  const enemies = state.combatants.filter(c => !state.playerSideIds.includes(c.id) && c.hp > 0);
  return `<div class="panel"><h3>BATTLE · ROUND ${state.round}</h3><p>${escapeHtml(battleMessage || "Choose your action.")}</p>
    ${enemies.map(enemy => `<div class="enemy"><b>${escapeHtml(enemy.name)}</b> — HP ${enemy.hp}/${enemy.maxHp}<div class="bar"><i style="width:${Math.max(0, enemy.hp / enemy.maxHp * 100)}%"></i></div><button data-attack="${escapeHtml(enemy.id)}">Attack</button></div>`).join("")}
    <button id="flee">Flee battle</button></div>`;
}

function dialoguePanel(): string {
  if (!activeDialogue) return "";
  return `<div class="panel dialogue"><h3>${escapeHtml(activeDialogue.speaker)}</h3><p>${escapeHtml(activeDialogue.text)}</p>
    ${activeDialogue.choices.map(choice => `<button data-dialogue-choice="${escapeHtml(choice.id)}">${escapeHtml(choice.text)}</button>`).join("")}
    <button id="close-dialogue">Leave conversation</button></div>`;
}

function render(): void {
  if (!gameStarted) return;
  const game = controller.game;
  const session = game.session;
  const map = session.map;
  const position = session.position;
  const character = session.character;
  const equipment = session.equipmentBonuses();
  const cells = map.data.tiles.map((tile, index) => {
    const x = index % map.width, y = Math.floor(index / map.width);
    const isPlayer = x === position.x && y === position.y;
    const glyph = isPlayer ? "♟" : tileGlyph[tile.kind] ?? "·";
    return `<button class="cell ${tileClass[tile.kind] ?? "grass"} ${isPlayer ? "you" : ""}" data-x="${x}" data-y="${y}" title="${tile.kind}" aria-label="${tile.kind} at ${x},${y}">${glyph}</button>`;
  }).join("");
  const status = game.battles.currentBattle?.status;
  app!.innerHTML = `<header><div class="brand"><span>✦</span><div><b>EARTHBOUND REALMS</b><small>TYPE SCRIPT RPG · PLAYABLE PROTOTYPE</small></div></div><div class="topbuttons"><span>Seeded world</span><button id="save-game">Save</button><button id="main-menu">Main menu</button></div></header>
  <nav>${["Character", "Inventory", "Quests", "World Map", "Codex"].map(tab => `<button data-tab="${tab}" class="${selectedTab === tab ? "active" : ""}">${tab}</button>`).join("")}</nav>
  <main><aside class="panel"><h3>ADVENTURER</h3><div class="avatar">⚔</div><h2>${escapeHtml(character.name)}</h2><p>${escapeHtml(character.characterClass)} · Level ${character.level}</p><label>Health ${character.hp}/${character.maxHp}</label><div class="bar"><i style="width:${Math.max(0, character.hp / character.maxHp * 100)}%"></i></div><p>Gold ◈ ${character.gold} · XP ${character.xp}</p><hr><h3>QUICK ACTIONS</h3><button class="wide" id="rest">Rest (heal)</button><button class="wide" id="search">Find creature</button><button class="wide" id="talk-elder">Talk to Village Elder</button><p class="hint">Move with WASD, arrow keys, click an adjacent tile, or use the on-screen D-pad.</p></aside>
  <section><div class="panel maphead"><div><h3>WORLD EXPLORER</h3><h1>The Old World Frontier</h1><small>Region: ${escapeHtml(map.data.id)} · ${map.width}×${map.height}</small></div><div><button id="zoom-out">−</button> ${Math.round(zoom * 100)}% <button id="zoom-in">+</button></div></div>
  <div class="mapwrap"><div class="map" style="--scale:${zoom};grid-template-columns:repeat(${map.width},24px);grid-template-rows:repeat(${map.height},24px);">${cells}</div></div>
  <div class="legend">≈ Water · ♣ Forest · ▲ Mountains · ⌂ Town · ♟ You</div>
  <div class="panel"><h3>${status === "active" ? "COMBAT / ADVENTURE LOG" : "ADVENTURE LOG"}</h3><p>${escapeHtml(log)}</p><div class="dpad"><span>Move:</span><button data-move="north">↑</button><button data-move="west">←</button><button data-move="south">↓</button><button data-move="east">→</button></div></div>
  ${battlePanel()}${dialoguePanel()}<div class="panel"><h3>${escapeHtml(selectedTab.toUpperCase())}</h3><div id="tab-content">${tabContent()}</div></div></section>
  <aside class="panel"><h3>WORLD STATUS</h3><p><small>REGION</small><br><b>Old World Frontier</b></p><p><small>COORDINATES</small><br><b>${position.x}, ${position.y}</b></p><p><small>WORLD SEED</small><br><code>${escapeHtml(map.data.id.replace("starter-region-", ""))}</code></p><hr><h3>DISCOVERIES</h3><p>Explore the region, accept quests, defeat creatures, collect rewards, and save your progress.</p><hr><h3>PROGRESSION</h3><p>Equipment bonus: +${equipment.attackBonus} attack, +${equipment.defense} defense.</p><p class="hint">Online multiplayer is not enabled in this prototype.</p></aside></main><footer>Earthbound Realms · Local save slots · Prototype build ER-TS-MMORPG-0.1.0</footer>`;

  app!.querySelectorAll<HTMLButtonElement>("[data-tab]").forEach(button => button.onclick = () => { selectedTab = button.dataset.tab!; render(); });
  app!.querySelectorAll<HTMLButtonElement>("[data-move]").forEach(button => button.onclick = () => move(button.dataset.move as Direction));
  app!.querySelectorAll<HTMLButtonElement>(".cell").forEach(button => button.onclick = () => {
    const x = Number(button.dataset.x), y = Number(button.dataset.y);
    const current = controller.game.session.position;
    if (Math.abs(x - current.x) + Math.abs(y - current.y) === 1) move(x < current.x ? "west" : x > current.x ? "east" : y < current.y ? "north" : "south");
    else { log = "Click an adjacent tile to move one step."; render(); }
  });
  app!.querySelector<HTMLButtonElement>("#save-game")!.onclick = () => { try { controller.saveGame("main"); log = "Game saved to this browser."; render(); } catch (error) { log = error instanceof Error ? error.message : "Save failed."; render(); } };
  app!.querySelector<HTMLButtonElement>("#main-menu")!.onclick = titleScreen;
  app!.querySelector<HTMLButtonElement>("#rest")!.onclick = () => { character.heal(character.maxHp); log = "You rest and recover your health."; render(); };
  app!.querySelector<HTMLButtonElement>("#search")!.onclick = () => startEncounter();
  app!.querySelector<HTMLButtonElement>("#talk-elder")!.onclick = () => {
    try {
      const reply = controller.beginDialogue("meadow-elder");
      if (!reply) { log = "The elder is not available."; render(); return; }
      activeDialogue = { treeId: "meadow-elder", nodeId: reply.node.id, speaker: reply.node.speaker, text: reply.node.text, choices: reply.node.choices };
      render();
    } catch (error) { log = error instanceof Error ? error.message : "Dialogue failed."; render(); }
  };
  app!.querySelector<HTMLButtonElement>("#zoom-out")!.onclick = () => { zoom = Math.max(.7, zoom - .1); render(); };
  app!.querySelector<HTMLButtonElement>("#zoom-in")!.onclick = () => { zoom = Math.min(1.4, zoom + .1); render(); };
  app!.querySelectorAll<HTMLButtonElement>("[data-use-item]").forEach(button => button.onclick = () => {
    const result = controller.useItem(button.dataset.useItem!); log = result.message; render();
  });
  app!.querySelector<HTMLButtonElement>("#visit-marker")?.addEventListener("click", () => {
    const result = session.recordObjective("visit", "meadow-marker");
    log = result.completedQuestIds.length ? "Quest completed: First Steps! Rewards granted." : "You inspect the meadow marker.";
    render();
  });
  app!.querySelectorAll<HTMLButtonElement>("[data-attack]").forEach(button => button.onclick = () => {
    try {
      const result = game.act({ kind: "attack", targetId: button.dataset.attack! });
      battleMessage = result.state.events.at(-1)?.message ?? "";
      log = result.state.status === "victory" ? `Victory! Gained ${result.xpAwarded} XP and ${result.goldAwarded} gold.` : battleMessage;
      render();
    } catch (error) { battleMessage = error instanceof Error ? error.message : "Attack failed."; render(); }
  });
  app!.querySelector<HTMLButtonElement>("#flee")?.addEventListener("click", () => {
    try { const result = game.act({ kind: "flee" }); log = result.state.status === "escaped" ? "You escaped the encounter." : "You could not escape."; battleMessage = log; render(); }
    catch (error) { log = error instanceof Error ? error.message : "Could not flee."; render(); }
  });
  app!.querySelector<HTMLButtonElement>("#dismiss-battle")?.addEventListener("click", () => { battleMessage = ""; log = "You continue exploring."; render(); });
  app!.querySelector<HTMLButtonElement>("#close-dialogue")?.addEventListener("click", () => { activeDialogue = undefined; render(); });
  app!.querySelectorAll<HTMLButtonElement>("[data-dialogue-choice]").forEach(button => button.onclick = () => {
    if (!activeDialogue) return;
    const reply = controller.chooseDialogue(activeDialogue.treeId, activeDialogue.nodeId, button.dataset.dialogueChoice!);
    log = reply.message;
    if (reply.dialogue) activeDialogue = { treeId: activeDialogue.treeId, nodeId: reply.dialogue.node.id, speaker: reply.dialogue.node.speaker, text: reply.dialogue.node.text, choices: reply.dialogue.node.choices };
    else activeDialogue = undefined;
    render();
  });
}

function move(direction: Direction): void {
  if (controller.game.battles.currentBattle?.status === "active") { log = "Finish or flee the battle before moving."; render(); return; }
  const moved = controller.move(direction);
  log = moved ? "You travel along the frontier." : "Blocked terrain prevents movement.";
  render();
}

function startEncounter(): void {
  try {
    const result = controller.game.startRandomEncounter("meadow");
    battleMessage = result.state.events.at(-1)?.message ?? "A creature appears!";
    log = "A creature approaches. Choose an attack.";
  } catch (error) { log = error instanceof Error ? error.message : "Could not start an encounter."; }
  render();
}

document.addEventListener("keydown", event => {
  if (!gameStarted || event.altKey || event.ctrlKey || event.metaKey) return;
  const directions: Record<string, Direction> = { ArrowUp: "north", w: "north", W: "north", ArrowDown: "south", s: "south", S: "south", ArrowLeft: "west", a: "west", A: "west", ArrowRight: "east", d: "east", D: "east" };
  const direction = directions[event.key];
  if (direction) { event.preventDefault(); move(direction); }
  else if (event.key === "Escape" && activeDialogue) { activeDialogue = undefined; render(); }
});
window.addEventListener("gamepadconnected", () => { log = "Gamepad connected. Use the D-pad or keyboard controls."; if (gameStarted) render(); });
titleScreen();
