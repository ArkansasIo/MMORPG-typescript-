/**
 * @file-id ER-FILE-COMBAT-ENGINE-0001
 * @module-id ER-MOD-COMBAT-0001
 * @doc ../../../../docs/source/CombatEngine.ts.docs.md
 * @master-doc ../../../../docs/MASTER_DOCUMENTATION.md
 * Purpose: deterministic-friendly turn based combat and combat log.
 */
import type { AbilityScores, Combatant, DamageType, StatusEffect } from "../types";
export type CombatAction = {kind:"attack";targetId:string;damageType?:DamageType}|{kind:"heal";targetId:string;amount:number}|{kind:"flee"};
export interface CombatEvent {round:number;actorId:string;kind:string;message:string;timestamp:number;}
export interface CombatState {round:number;turnIndex:number;order:string[];combatants:Combatant[];events:CombatEvent[];status:"active"|"victory"|"defeat"|"escaped";}
export const abilityMod=(score:number)=>Math.floor((score-10)/2);
export class CombatEngine {
 constructor(private readonly random:()=>number=Math.random){}
 start(combatants:Combatant[]):CombatState {
  if(combatants.length<2)throw new Error("Combat requires at least two combatants");
  const ids=new Set(combatants.map(c=>c.id));if(ids.size!==combatants.length)throw new Error("Combatant IDs must be unique");
  const order=[...combatants].sort((a,b)=>(b.speed+this.roll())-(a.speed+this.roll())).map(c=>c.id);
  return {round:1,turnIndex:0,order,combatants:combatants.map(c=>({...c,abilities:{...c.abilities},conditions:[...(c.conditions??[])]})),events:[],status:"active"};
 }
 current(state:CombatState):Combatant|undefined {return state.combatants.find(c=>c.id===state.order[state.turnIndex]);}
 act(state:CombatState,action:CombatAction):CombatState {
  if(state.status!=="active")throw new Error("Combat is already finished");
  const actor=this.current(state);if(!actor||actor.hp<=0)throw new Error("Current combatant is not able to act");
  const stunned=actor.conditions?.includes("stunned");
  if(stunned){this.event(state,actor.id,"skip",`${actor.name} is stunned and loses the turn.`);this.advance(state);return this.checkEnd(state);}
  if(action.kind==="flee"){state.status="escaped";this.event(state,actor.id,"flee",`${actor.name} escaped combat.`);return state;}
  const target=state.combatants.find(c=>c.id===action.targetId);
  if(!target||target.hp<=0)throw new Error("Target does not exist or is defeated");
  if(action.kind==="attack"){
   const roll=this.roll();const total=roll+actor.attackBonus;const critical=roll===20;const hit=critical||(roll!==1&&total>=target.defense);
   if(hit){let damage=Math.max(1,actor.damage+(critical?actor.damage:0));const type=action.damageType??actor.damageType;if(target.resistances?.includes(type))damage=Math.floor(damage/2);if(target.vulnerabilities?.includes(type))damage*=2;if(target.conditions?.includes("shielded"))damage=Math.max(0,damage-3);target.hp=Math.max(0,target.hp-damage);this.event(state,actor.id,"attack",`${actor.name} ${critical?"critically ":""}hits ${target.name} for ${damage} ${type} damage (d20 ${roll}).`);}
   else this.event(state,actor.id,"miss",`${actor.name} misses ${target.name} (d20 ${roll}, total ${total}, defense ${target.defense}).`);
  }else{const amount=Math.max(0,Math.floor(action.amount));target.hp=Math.min(target.maxHp,target.hp+amount);this.event(state,actor.id,"heal",`${actor.name} heals ${target.name} for ${target.hp} HP total.`);}
  this.tickConditions(state);this.advance(state);return this.checkEnd(state);
 }
 addCondition(state:CombatState,targetId:string,effect:StatusEffect):void {const target=state.combatants.find(c=>c.id===targetId);if(!target)throw new Error("Unknown target");target.conditions??=[];if(!target.conditions.includes(effect))target.conditions.push(effect);this.event(state,targetId,"condition",`${target.name} gains ${effect}.`);}
 private roll():number{return 1+Math.floor(this.random()*20);}
 private event(s:CombatState,actorId:string,kind:string,message:string){s.events.push({round:s.round,actorId,kind,message,timestamp:Date.now()});}
 private tickConditions(s:CombatState){for(const c of s.combatants){if(c.hp<=0)continue;if(c.conditions?.includes("burning"))c.hp=Math.max(0,c.hp-2);if(c.conditions?.includes("poisoned"))c.hp=Math.max(0,c.hp-1);}}
 private advance(s:CombatState){let attempts=0;do{s.turnIndex++;if(s.turnIndex>=s.order.length){s.turnIndex=0;s.round++;}attempts++;}while(attempts<=s.order.length&&((s.combatants.find(c=>c.id===s.order[s.turnIndex])?.hp??0)<=0));}
 private checkEnd(s:CombatState):CombatState {const alive=s.combatants.filter(c=>c.hp>0);if(alive.length<=1)s.status=alive.length===0?"defeat":(alive[0].id===s.order[0]?"victory":"victory");return s;}
}
