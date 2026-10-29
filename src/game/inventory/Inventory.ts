/**
 * @file-id ER-FILE-INVENTORY-ENGINE-0001
 * @module-id ER-MOD-INVENTORY-0001
 * @doc ../../../docs/source/Inventory.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Purpose: item stacks, equipment slots, currency, and shop transactions.
 */
export type ItemKind="consumable"|"weapon"|"armor"|"quest"|"material";
export interface ItemDefinition {id:string;name:string;kind:ItemKind;stackable:boolean;maxStack:number;price:number;description:string;slot?:"weapon"|"head"|"body"|"accessory";statBonus?:number;}
export interface ItemStack {itemId:string;quantity:number;}
export class Inventory {
 private stacks:ItemStack[]=[];private equipped=new Map<string,string>();
 constructor(readonly capacity=30){if(!Number.isInteger(capacity)||capacity<1)throw new Error("Capacity must be positive");}
 list():ItemStack[]{return this.stacks.map(s=>({...s}));}
 quantity(itemId:string):number{return this.stacks.filter(s=>s.itemId===itemId).reduce((n,s)=>n+s.quantity,0);}
 add(item:ItemDefinition,quantity=1):boolean {if(!Number.isInteger(quantity)||quantity<1)throw new Error("Quantity must be a positive integer");if(!item.id.trim()||!Number.isInteger(item.maxStack)||item.maxStack<1||!Number.isFinite(item.price)||item.price<0)throw new Error("Item definition is invalid");const next=this.stacks.map(s=>({...s}));let left=quantity;
  if(item.stackable){const stack=next.find(s=>s.itemId===item.id&&s.quantity<item.maxStack);if(stack){const n=Math.min(left,item.maxStack-stack.quantity);stack.quantity+=n;left-=n;}}
  while(left>0){if(next.length>=this.capacity)return false;const n=item.stackable?Math.min(left,item.maxStack):1;next.push({itemId:item.id,quantity:n});left-=n;}this.stacks=next;return true;
 }
 remove(itemId:string,quantity=1):boolean {if(!Number.isInteger(quantity)||quantity<1||this.quantity(itemId)<quantity)return false;let left=quantity;this.stacks=this.stacks.flatMap(s=>{if(s.itemId!==itemId)return[s];const n=Math.min(left,s.quantity);left-=n;const remain=s.quantity-n;return remain?[{itemId,quantity:remain}]:[];});for(const [slot,id] of this.equipped)if(id===itemId&&this.quantity(id)===0)this.equipped.delete(slot);return true;}
 equip(item:ItemDefinition):boolean {if(!item.slot||this.quantity(item.id)<1)return false;this.equipped.set(item.slot,item.id);return true;}
 restoreSnapshot(stacks: ItemStack[], equipment: Record<string, string>, definitions: ItemDefinition[]): void {
  if (!Array.isArray(stacks) || !equipment || typeof equipment !== "object" || Array.isArray(equipment)) throw new Error("Inventory snapshot is invalid");
  const catalog = new Map(definitions.map(item => [item.id, item]));
  const next = new Inventory(this.capacity);
  for (const stack of stacks) {
    const item = catalog.get(stack.itemId);
    if (!item || !Number.isInteger(stack.quantity) || stack.quantity < 1 || !next.add(item, stack.quantity)) throw new Error("Inventory snapshot contains an invalid item stack");
  }
  for (const [slot, itemId] of Object.entries(equipment)) {
    const item = catalog.get(itemId);
    if (!item || item.slot !== slot || !next.equip(item)) throw new Error("Inventory snapshot contains invalid equipment");
  }
  this.stacks = next.stacks.map(stack => ({ ...stack }));
  this.equipped = new Map(next.equipped);
 }
 equippedItems():Record<string,string>{return Object.fromEntries(this.equipped);}
}
export class ShopService {
 buy(inventory:Inventory,item:ItemDefinition,quantity:number,wallet:{gold:number}):boolean {if(!Number.isInteger(quantity)||quantity<1||!Number.isSafeInteger(wallet.gold)||wallet.gold<0)return false;const cost=item.price*quantity;if(!Number.isSafeInteger(cost)||cost<0||wallet.gold<cost)return false;try{if(!inventory.add(item,quantity))return false;}catch{return false;}wallet.gold-=cost;return true;}
 sell(inventory:Inventory,item:ItemDefinition,quantity:number,wallet:{gold:number},rate=.5):boolean {if(!Number.isInteger(quantity)||quantity<1||!Number.isSafeInteger(wallet.gold)||wallet.gold<0||!Number.isFinite(rate)||rate<0||rate>1)return false;const proceeds=Math.floor(item.price*quantity*rate);if(!Number.isSafeInteger(proceeds)||!Number.isSafeInteger(wallet.gold+proceeds))return false;if(!inventory.remove(item.id,quantity))return false;wallet.gold+=proceeds;return true;}
}
