/**
 * @file-id ER-FILE-QUEST-ENGINE-0001
 * @module-id ER-MOD-QUESTS-0001
 * @doc ../../../../docs/source/QuestEngine.ts.docs.md
 * @master-doc ../../../../docs/MASTER_DOCUMENTATION.md
 * Purpose: quest prerequisites, objective progress, and rewards.
 */
export type ObjectiveKind="kill"|"collect"|"talk"|"visit";
export interface QuestObjective {id:string;kind:ObjectiveKind;targetId:string;required:number;}
export interface QuestDefinition {id:string;title:string;description:string;prerequisites:string[];objectives:QuestObjective[];reward:{xp:number;gold:number;itemIds?:string[]};}
export interface QuestProgress {questId:string;status:"locked"|"active"|"completed";counts:Record<string,number>;}
export class QuestEngine {
 private definitions=new Map<string,QuestDefinition>();private progress=new Map<string,QuestProgress>();
 register(quest:QuestDefinition):void {if(this.definitions.has(quest.id))throw new Error(`Duplicate quest: ${quest.id}`);if(!quest.objectives.length||quest.objectives.some(o=>o.required<1))throw new Error("Quest objectives need positive requirements");this.definitions.set(quest.id,structuredClone(quest));this.progress.set(quest.id,{questId:quest.id,status:quest.prerequisites.length?"locked":"active",counts:{}});}
 accept(questId:string):boolean {const q=this.require(questId),p=this.progress.get(questId)!;if(p.status!=="locked"||!q.prerequisites.every(id=>this.progress.get(id)?.status==="completed"))return false;p.status="active";return true;}
 record(kind:ObjectiveKind,targetId:string,amount=1):QuestDefinition[] {if(!Number.isInteger(amount)||amount<1)throw new Error("Progress amount must be positive");const completed:QuestDefinition[]=[];for(const q of this.definitions.values()){const p=this.progress.get(q.id)!;if(p.status!=="active")continue;for(const o of q.objectives)if(o.kind===kind&&o.targetId===targetId)p.counts[o.id]=Math.min(o.required,(p.counts[o.id]??0)+amount);if(q.objectives.every(o=>(p.counts[o.id]??0)>=o.required)){p.status="completed";completed.push(structuredClone(q));}}return completed;}
 getProgress(questId:string):QuestProgress{return structuredClone(this.progress.get(questId)??{questId,status:"locked",counts:{}});}
 private require(id:string):QuestDefinition {const q=this.definitions.get(id);if(!q)throw new Error(`Unknown quest: ${id}`);return q;}
}
