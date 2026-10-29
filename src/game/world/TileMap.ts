/**
 * @file-id ER-FILE-WORLD-TILEMAP-0001
 * @module-id ER-MOD-WORLD-0001
 * @doc ../../../docs/source/TileMap.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Purpose: typed, validated tile-map data model for classic JRPG exploration.
 */
export type TileKind = "grass" | "forest" | "water" | "mountain" | "town" | "wall" | "floor" | "door";
export interface Tile { kind:TileKind; blocked:boolean; encounterTableId?:string; }
export interface MapExit { id:string; x:number; y:number; targetMapId:string; targetX:number; targetY:number; }
export interface MapNpcSpawn { id:string; name:string; x:number; y:number; dialogueId:string; }
export interface TileMapData { schemaVersion:1; id:string; name:string; width:number; height:number; tiles:Tile[]; exits:MapExit[]; npcs:MapNpcSpawn[]; }
export class TileMap {
 readonly data:TileMapData;
 constructor(data:TileMapData){
  if(data.schemaVersion!==1)throw new Error("Unsupported tile map schema version");
  if(!data.id.trim()||!data.name.trim())throw new Error("Map id and name are required");
  if(!Number.isInteger(data.width)||!Number.isInteger(data.height)||data.width<1||data.height<1)throw new Error("Map dimensions must be positive integers");
  if(data.tiles.length!==data.width*data.height)throw new Error("Tile count must equal width × height");
  for(const exit of data.exits)if(!this.inBounds(exit.x,exit.y)||!exit.targetMapId.trim())throw new Error(`Invalid map exit: ${exit.id}`);
  for(const npc of data.npcs)if(!this.inBounds(npc.x,npc.y)||!npc.id.trim()||!npc.dialogueId.trim())throw new Error(`Invalid NPC spawn: ${npc.id}`);
  this.data=structuredClone(data);
 }
 get width():number{return this.data.width;}
 get height():number{return this.data.height;}
 inBounds(x:number,y:number):boolean{return Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&y>=0&&x<this.width&&y<this.height;}
 getTile(x:number,y:number):Tile|undefined{return this.inBounds(x,y)?this.data.tiles[y*this.width+x]:undefined;}
 getExitAt(x:number,y:number):MapExit|undefined{return this.data.exits.find(exit=>exit.x===x&&exit.y===y);}
 getNpcsAt(x:number,y:number):MapNpcSpawn[]{return this.data.npcs.filter(npc=>npc.x===x&&npc.y===y);}
}
