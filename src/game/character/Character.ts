/**
 * @file-id ER-FILE-CHARACTER-CORE-0001
 * @module-id ER-MOD-CHARACTER-0001
 * @doc ../../../docs/source/Character.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Purpose: object-oriented player and creature stat model.
 */
import type { AbilityScores, CharacterClass, Combatant, DamageType, StatusEffect } from "../types";
const CLASS_BASE:Record<CharacterClass,{hp:number;damage:number;primary:keyof AbilityScores}> = {
 Fighter:{hp:32,damage:7,primary:"strength"},Wizard:{hp:20,damage:8,primary:"intelligence"},Cleric:{hp:27,damage:6,primary:"wisdom"},
 Rogue:{hp:23,damage:7,primary:"dexterity"},Ranger:{hp:27,damage:7,primary:"dexterity"},Paladin:{hp:30,damage:7,primary:"charisma"},
 Bard:{hp:24,damage:5,primary:"charisma"},Druid:{hp:25,damage:6,primary:"wisdom"},Barbarian:{hp:34,damage:9,primary:"constitution"}
};
export class Character implements Combatant {
 readonly id:string; level=1; xp=0; gold=0; hp:number; maxHp:number; defense=10; speed=2; proficiencyBonus=2; attackBonus:number; damage:number; damageType:DamageType="physical"; conditions:StatusEffect[]=[]; abilities:AbilityScores;
 constructor(public name:string,public characterClass:CharacterClass,options:{id?:string;abilities?:Partial<AbilityScores>}={}){
  this.id=options.id??globalThis.crypto?.randomUUID?.()??`hero-${Date.now()}`;this.name=name.trim()||"Wayfarer";
  this.abilities={strength:10,dexterity:10,constitution:10,intelligence:10,wisdom:10,charisma:10,...options.abilities};
  const cfg=CLASS_BASE[characterClass];this.maxHp=cfg.hp+Math.max(0,this.modifier("constitution"))*2;this.hp=this.maxHp;this.damage=cfg.damage+Math.max(0,this.modifier(cfg.primary));this.attackBonus=2+this.modifier(cfg.primary);
 }
 modifier(ability:keyof AbilityScores):number{return Math.floor((this.abilities[ability]-10)/2);}
 requiredXp():number{return Math.floor(100*this.level**1.6);}
 gainXp(amount:number):number {if(!Number.isFinite(amount)||amount<0)throw new RangeError("XP must be a non-negative finite number");this.xp+=amount;let levels=0;while(this.xp>=this.requiredXp()){this.xp-=this.requiredXp();this.level++;this.proficiencyBonus=2+Math.floor((this.level-1)/4);this.maxHp+=5;this.hp=this.maxHp;levels++;}return levels;}
 heal(amount:number):void {if(!Number.isFinite(amount)||amount<0)throw new RangeError("Heal amount must be non-negative");this.hp=Math.min(this.maxHp,this.hp+amount);}
 takeDamage(amount:number):number {const before=this.hp;this.hp=Math.max(0,this.hp-Math.max(0,Math.floor(amount)));return before-this.hp;}
 toSaveData(){return {id:this.id,name:this.name,characterClass:this.characterClass,level:this.level,xp:this.xp,hp:this.hp,maxHp:this.maxHp,gold:this.gold,abilities:{...this.abilities}};}
}
