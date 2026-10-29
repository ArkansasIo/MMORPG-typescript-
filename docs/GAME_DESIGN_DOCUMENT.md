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