# BattleService.ts — Combat and Reward Integration

**Source:** `src/game/combat/BattleService.ts`  
**Engine:** `src/game/combat/CombatEngine.ts`  
**Tests:** `src/game/__tests__/battle-service.test.ts`

## Responsibilities

- Creates a combat encounter from creature IDs in the data catalog.
- Places the player character on the player side and generated enemies on the opposing side.
- Runs enemy turns automatically until the player can act again or combat ends.
- Synchronizes combat HP back to the persistent in-session Character.
- Awards each defeated creature's XP and randomized gold once when the player side wins.
- Records kill objectives through GameSession so quest progression can react to defeated creatures.

## Usage

Create a `BattleService` with a `GameSession`, then call `start(["slime"])`. When it is the player's turn, call `playerAction({ kind: "attack", targetId: enemyId })`. The returned result contains the combat state and encounter rewards.

## Current limits

This is a local prototype service, not server-authoritative combat. It does not yet implement equipment modifiers, spell costs, enemy-specific AI, multi-stage boss logic, durable battle history, or timed status-effect durations. A production online game must validate actions and award rewards on the server.
