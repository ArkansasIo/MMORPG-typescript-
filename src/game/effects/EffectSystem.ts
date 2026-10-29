/**
 * @file-id ER-FILE-EFFECT-SYSTEM-0001
 * @module-id ER-MOD-EFFECTS-0001
 * @doc ../../../docs/source/EffectSystem.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Purpose: timed buffs, debuffs, and status effect lifecycle.
 */
import type { StatusEffect } from "../types";
export type StatKey="strength"|"dexterity"|"constitution"|"intelligence"|"wisdom"|"charisma"|"attack"|"defense"|"speed";
export interface EffectInstance {id:string;name:string;targetId:string;kind:"buff"|"debuff"|"condition";stat?:StatKey;amount?:number;condition?:StatusEffect;remainingTurns:number;sourceId?:string;stacking:"refresh"|"stack"|"replace";}
export class EffectSystem {
 private effects:EffectInstance[]=[];
 apply(effect:EffectInstance):void {
  if(!effect.id||!effect.targetId||!Number.isInteger(effect.remainingTurns)||effect.remainingTurns<1)throw new Error("Effect requires IDs and positive integer duration");
  const existing=this.effects.findIndex(e=>e.id===effect.id&&e.targetId===effect.targetId);
  if(existing>=0&&effect.stacking==="refresh"){this.effects[existing]={...effect};return;}
  if(existing>=0&&effect.stacking==="replace")this.effects.splice(existing,1);
  this.effects.push({...effect});
 }
 forTarget(targetId:string):EffectInstance[]{return this.effects.filter(e=>e.targetId===targetId).map(e=>({...e}));}
 statBonus(targetId:string,stat:StatKey):number{return this.effects.filter(e=>e.targetId===targetId&&e.stat===stat).reduce((sum,e)=>sum+(e.amount??0),0);}
 hasCondition(targetId:string,condition:StatusEffect):boolean{return this.effects.some(e=>e.targetId===targetId&&e.condition===condition);}
 advanceTurn(targetId:string):EffectInstance[]{const expired:EffectInstance[]=[];this.effects=this.effects.flatMap(e=>{if(e.targetId!==targetId)return[e];const next={...e,remainingTurns:e.remainingTurns-1};if(next.remainingTurns<=0){expired.push(e);return [];}return[next];});return expired;}
 remove(targetId:string,effectId?:string):number{const before=this.effects.length;this.effects=this.effects.filter(e=>e.targetId!==targetId||(effectId!==undefined&&e.id!==effectId));return before-this.effects.length;}
}
