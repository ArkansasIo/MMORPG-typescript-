/**
 * @file-id ER-FILE-GAME-TYPES-0001
 * @module-id ER-MOD-GAME-0001
 * @doc ../../docs/source/types.ts.docs.md
 * @master-doc ../../docs/MASTER_DOCUMENTATION.md
 * @purpose Shared compile-time domain contracts for game entities and combat.
 */
export type DamageType = "physical" | "fire" | "ice" | "lightning" | "arcane" | "poison";
export type StatusEffect = "burning" | "poisoned" | "stunned" | "slowed" | "shielded" | "frightened";
export type CharacterClass = "Fighter" | "Wizard" | "Cleric" | "Rogue" | "Ranger" | "Paladin" | "Bard" | "Druid" | "Barbarian";
export interface AbilityScores { strength:number; dexterity:number; constitution:number; intelligence:number; wisdom:number; charisma:number; }
export interface Combatant { id:string; name:string; level:number; hp:number; maxHp:number; defense:number; speed:number; abilities:AbilityScores; proficiencyBonus:number; attackBonus:number; damage:number; damageType:DamageType; resistances?:DamageType[]; vulnerabilities?:DamageType[]; conditions?:StatusEffect[]; }
export interface CombatLogEntry { round:number; actor:string; action:string; result:string; }
