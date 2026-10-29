/**
 * @file-id ER-FILE-WORLD-COLLISION-0001
 * @module-id ER-MOD-WORLD-0001
 * @doc ../../../docs/source/CollisionSystem.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Purpose: determine whether a grid movement is legal.
 */
import { TileMap } from "./TileMap";
export type Direction="north"|"south"|"east"|"west";
export interface Position { x:number; y:number; }
const OFFSETS:Record<Direction,Position>={north:{x:0,y:-1},south:{x:0,y:1},east:{x:1,y:0},west:{x:-1,y:0}};
export class CollisionSystem {
 constructor(private readonly map:TileMap){}
 canEnter(position:Position):boolean {const tile=this.map.getTile(position.x,position.y);return !!tile&&!tile.blocked;}
 nextPosition(position:Position,direction:Direction):Position {const delta=OFFSETS[direction];return {x:position.x+delta.x,y:position.y+delta.y};}
 tryMove(position:Position,direction:Direction):Position|null {const target=this.nextPosition(position,direction);return this.canEnter(target)?target:null;}
}
