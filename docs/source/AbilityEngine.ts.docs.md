# Ability Engine

## Purpose
`src/game/abilities/AbilityEngine.ts` provides a data-driven, turn-based resolution layer for skills and spells. It is deliberately independent of browser rendering so the UI and server can share the same deterministic rules.

## Ability definition
Each definition specifies a stable ID, display name, description, target category, effect type, power, mana cost, and optional minimum level. Registration validates required identifiers and numeric constraints.

## Resolution
`use(id, caster, target)` validates that the ability exists, the caster meets its level requirement, enough mana is available, and the effect/target combination is supported. Failed validation does not spend mana. Successful use spends mana and clamps damage, healing, or mana restoration to the target's current resources and maximums.

## Starter content
- Spark: 8 damage for 3 mana.
- Heavy Strike: 12 damage for 2 mana.
- Mend: restore up to 10 health for 4 mana.
- Second Wind: restore up to 6 mana; available at level 2 and targets the caster.

## Integration status and limitations
The engine and starter definitions are implemented as reusable modules. They are not yet the sole combat path in the browser UI. The current `Character` model does not yet include mana, so callers must provide an `AbilityUser` adapter with HP and mana fields. Enemy/ally team membership, cooldowns, status effects, spell scaling, class restrictions, and authoritative server validation remain future work. This is a rules module, not evidence that online multiplayer is implemented.
