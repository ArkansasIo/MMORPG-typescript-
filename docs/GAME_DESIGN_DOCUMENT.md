# Earthbound Realms — Game Design Document

## Project identity
- Build name: Earthbound Realms
- Build ID: ER-TS-MMORPG-0.1.0
- Version: 0.1.0 prototype
- Developer: Stephen Delaine Jr. — single-person development
- Genre: 2D retro fantasy RPG with MMORPG-oriented systems
- Client: TypeScript browser game; server plan: Node.js, MySQL, scheduled jobs

## Design pillars
1. Menu-driven exploration and turn-based battles inspired by classic console RPG pacing.
2. Character growth through classes, equipment, spells, quests, and tactical decisions.
3. Creature-inspired tactical combat with original monsters, abilities, elemental affinities, and status effects.
4. A D20 tabletop-inspired rules layer with ability checks, attack rolls, saving throws, conditions, and class features.
5. A large Earth-inspired geography layer, overlaid with original fantasy factions, dungeons, trials, raids, and towers.
6. Accessibility across mouse, keyboard, and browser-supported gamepads.

## Core gameplay loop
Explore region → discover settlement or encounter → battle or interact → earn XP, currency, and loot → improve character and party → complete quest → unlock new region.

## Nine planned classes
- Fighter: weapon mastery and defensive reactions.
- Wizard: prepared arcane spells and area control.
- Cleric: healing, protection, and radiant effects.
- Rogue: stealth, precision, and skill expertise.
- Ranger: tracking, ranged combat, and companion synergy.
- Paladin: defensive auras, healing, and smite-like burst abilities.
- Bard: support, inspiration, and control.
- Druid: nature magic, healing, and terrain control.
- Barbarian: high-risk melee damage and damage mitigation.

These are broad tabletop-inspired archetypes; implement original class feature text and balance. Do not reproduce non-open rulebook text.

## D20-inspired resolution
- Ability check: d20 + relevant ability modifier + proficiency bonus when proficient versus a difficulty class.
- Attack: d20 + attack modifier versus target defense; natural 20 and natural 1 rules should be configured by the game ruleset.
- Saving throw: d20 + save modifier versus a specified difficulty class.
- Turn economy: action, bonus action, reaction, movement, with class features controlling exceptions.
- Conditions: poisoned, burning, stunned, slowed, frightened, shielded, and exhausted; define duration and stacking explicitly.
- This is a tabletop-inspired implementation, not a claim of complete official D&D 5e rules compatibility.

## Creature-inspired turn-based combat
- Player selects an action from Attack, Skill, Spell, Item, Defend, Switch, or Flee when allowed.
- Each creature has level, HP, defense, speed, affinities, resistances, vulnerabilities, status immunities, and a move list.
- Turn order is determined by speed plus configurable randomness.
- Elemental affinity modifies damage using a data-driven multiplier table.
- Capture/collection is an optional future system; avoid using Pokémon names, creature designs, move names, or UI assets.
- Server-authoritative combat is required for online play.

## Planned world content
- Nine playable classes.
- 42 trial encounters.
- 18 raids designed for party coordination.
- 12 towers with floors 1–100 each, with modular floor themes and boss rules.
- Cities, towns, villages, roads, wilderness, dungeons, factions, guilds, crafting, gathering, vendors, and quest chains.
- Earth geography should be sourced from verified geographic datasets. Fantasy encounters and settlements are separate game layers.

## Audio and art
- Plan for 24 original 8-bit music tracks with region, battle, boss, town, dungeon, menu, and victory themes.
- Original 8-bit sound effects for UI, movement, attacks, magic, status effects, loot, and environmental feedback.
- Original pixel-art sprites for player classes, animals, monsters, NPCs, terrain, and effects.
- Store assets and music metadata in data files so content can be expanded without rewriting the engine.

## Main menu and modes
- Title screen: New Game, Continue, Offline Play, Online Play, Settings, Credits, Quit/Return.
- Character creation: name, one of nine classes, appearance palette, starting background, and confirmation.
- Loading screen: stage label, progress, selected seed, mode, and recoverable error message.
- Offline mode uses local saves and does not simulate other players.
- Online mode requires authentication, server connection, persistent account data, and server-authoritative simulation.

## Credits and build identity
- Game: Earthbound Realms.
- Build ID: ER-TS-MMORPG-0.1.0.
- Build name: Earthbound Realms TypeScript MMORPG Prototype.
- Developer: Stephen Delaine Jr. (solo developer).
- Team roles: design, programming, UI, gameplay systems, tools, and integration are handled by the solo developer; external libraries and asset contributors must be credited individually according to their licenses.

## Production milestones
1. Title screen, character creation, loading flow, local saves.
2. Combat data model, D20-inspired checks, class abilities, status effects, tests.
3. Inventory, equipment, quests, NPC dialogue, vendors, crafting.
4. Geographic data import, map projection, region streaming, settlement data.
5. WebSocket rooms, authentication, authoritative simulation, reconnects, chat, party state.
6. Dungeon/trial/raid/tower content tools, audio pipeline, asset atlas, localization.
7. Security review, automated tests, observability, deployment, backups, performance tests.

## Scope truth
The current repository contains a basic local browser prototype, starter API and MySQL schema, cron scaffolding, and input support. The full Earth map, all content counts, completed audio library, title/loading/character creation flow, and actual online multiplayer are not complete yet. This document is the implementation plan, not a claim that all listed features already exist.

## Story Campaign Expansion — Nine Realms

### Premise
A shattered celestial road once connected nine Norse-inspired realms. The World-Tree's star-forged roots are losing their light, and fragments of an ancient sky-forge have fallen across the realms. The player begins as a newly sworn Wayfarer and assembles allies, uncovers rival claims to the fragments, and decides how the realms will rebuild their shared path. This is original fantasy inspired by Norse cosmology; it is not a retelling of a specific game or saga.

### Campaign scale
- 12 acts, 50 chapters total.
- Main-story quests: target 150 (3 per chapter on average).
- Side quests: target 300 (regional stories, companion arcs, crafting, exploration, faction reputation).
- Daily/weekly activities: optional rotating bounties, gathering requests, realm events, and challenge resets.
- Instance targets: 42 trials, 18 raids, and 12 towers with 100 floors each. These are content targets, not all authored or implemented yet.
- Every chapter should have an objective chain, named location, NPC/quest giver, encounter or puzzle, reward table, and a journal entry.

### Twelve acts / fifty chapters
1. **The Fallen Star** — Chapters 1–4: village tutorial, first rift, first companion, the damaged star-road.
2. **Whispers in the Greenwood** — Chapters 5–8: living forests, missing scouts, beast clans, a trial gate.
3. **The Frostbound March** — Chapters 9–12: frozen passes, survival hazards, a besieged hold, first realm guardian.
4. **The Drowned Archive** — Chapters 13–16: coastal ruins, sunken lore, puzzle vaults, the first sky-forge fragment.
5. **The Ember Mountains** — Chapters 17–20: dwarven foundries, volcanic routes, crafting mastery, a faction dispute.
6. **The Realm of Storms** — Chapters 21–24: floating crags, thunder spirits, airship routes, a storm trial.
7. **The Veil Beyond Stars** — Chapters 25–28: observatories, celestial navigation, alien wilderness, first outer-space zone.
8. **The Hollow Moon** — Chapters 29–32: lunar ruins, low-gravity hazards, a lost expedition, moon-boss instance.
9. **The War of Crowns** — Chapters 33–36: rival realm alliances, diplomacy, faction choices, large-scale battlefield instance.
10. **The Root Below Time** — Chapters 37–40: ancient rootways, time anomalies, companion resolutions, a multi-wing dungeon.
11. **The Black Constellation** — Chapters 41–45: corrupted star-road, coordinated realm objectives, raid preparation, guardian gauntlet.
12. **The Ninefold Dawn** — Chapters 46–50: final realm convergence, multi-stage raid, choice-driven resolution, post-game unlocks.

### Nine realms
1. **Midgard Reach** — starting human lands, farms, roads, keeps, and towns.
2. **Alfheim Glades** — luminous forests, fae courts, ancient groves.
3. **Svartdeep Holds** — underground halls, forges, crystal mines.
4. **Jotunheim Crown** — ice giants, glaciers, high mountain passes.
5. **Muspelbrand** — volcanic wilderness, fire spirits, obsidian fortresses.
6. **Vanaheim Wilds** — nature magic, wetlands, druidic settlements.
7. **Niflheim Veil** — frozen mists, spectral ruins, dangerous visibility.
8. **Hel's Threshold** — spirit roads and ancestral halls; keep the tone adventurous rather than graphic.
9. **Astral Expanse** — star-temples, moon outposts, floating islands, celestial routes, and outer-space dungeons.

### Quest-system design
Quest categories: Main Story, Side Story, Companion, Realm, Faction, Daily, Weekly, Bounty, Crafting, Exploration, Dungeon, Trial, Raid, Tower, and Event.
Each quest data record should contain: id, title, category, giverNpcId, realmId, prerequisites, objectives, objective counters, level range, party size, repeat policy, reset schedule, reward table, acceptance text, completion text, and failure/recovery behavior.
Objectives should support: talk-to, defeat, collect, gather, craft, escort, investigate, discover-area, activate-object, survive-wave, complete-instance, and defeat-boss.
Quest tracking must be event-driven and idempotent; repeated enemy-kill events must not duplicate rewards.

### Instances and group content
- A dungeon instance is a private party copy with entrance validation, checkpoint state, encounter seed, loot table, and completion record.
- Trials are short mechanics-focused encounters with tiered difficulty and score/reward grades.
- Raids use party roles, boss phases, telegraphs, enrage timers, revive rules, loot lockouts, and completion records.
- Towers use floor templates, difficulty scaling, checkpoints, optional modifiers, floor bosses, and seasonal leaderboards.
- The server, not the browser, validates instance membership, combat results, drops, and lockouts.

### Seed and schedule rules
- World seed determines reproducible procedural terrain and encounter variants, but authored story beats remain stable.
- Instance seed is generated from a server-held key plus instance ID and content version; never trust a client-supplied seed for loot.
- Scheduled resets should use UTC in production and store each reset result so retries are idempotent.
- A multi-server deployment needs a distributed lock or one designated scheduler to prevent duplicate daily/weekly resets.

### Current implementation boundary
This is the design roadmap only. The existing repository does not yet contain all 50 chapters, 450+ authored quests, nine complete realms, or production-ready instances. These should be implemented as data-driven content in small, testable milestones.
