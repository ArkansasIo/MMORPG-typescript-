/**
 * @file-id ER-FILE-GAME-ENGINE-0001
 * @module-id ER-MOD-GAME-0001
 * @doc ../../../docs/source/GameEngine.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Purpose: compose core game systems behind a small engine facade.
 */
import { CombatEngine } from "./combat/CombatEngine";
import { EffectSystem } from "./effects/EffectSystem";
import { QuestEngine } from "./quests/QuestEngine";
export interface EngineConfig {seed:number;random?:()=>number;}
export class GameEngine {
 readonly combat:CombatEngine;readonly effects=new EffectSystem();readonly quests=new QuestEngine();readonly seed:number;
 constructor(config:EngineConfig){if(!Number.isInteger(config.seed))throw new Error("Seed must be an integer");this.seed=config.seed;this.combat=new CombatEngine(config.random);}
 createRandom(stream=0):()=>number {let n=(this.seed^Math.imul(stream+1,0x45d9f3b))|0;return()=>{n|=0;n=(n+0x6D2B79F5)|0;let t=Math.imul(n^(n>>>15),1|n);t^=t+Math.imul(t^(t>>>7),61|t);return((t^(t>>>14))>>>0)/4294967296;};}
}
