/**
 * @file-id ER-FILE-ASSET-CATALOG-0001
 * @module-id ER-MOD-ASSETS-0001
 * @doc ../../../docs/source/AssetCatalog.ts.docs.md
 * @master-doc ../../../docs/MASTER_DOCUMENTATION.md
 * Purpose: preserve and catalog game image, sprite, music, and sound-effect assets.
 */
export type AssetKind="image"|"sprite"|"tileset"|"music"|"sound";
export interface AssetEntry {id:string;kind:AssetKind;src:string;alt?:string;loop?:boolean;volume?:number;licenseNote?:string;}
export class AssetCatalog {
 private readonly entries=new Map<string,AssetEntry>();
 register(entry:AssetEntry):void {if(!entry.id.trim()||!entry.src.trim())throw new Error("Asset id and source path are required");if(this.entries.has(entry.id))throw new Error(`Duplicate asset id: ${entry.id}`);this.entries.set(entry.id,{...entry});}
 get(id:string):AssetEntry|undefined {const e=this.entries.get(id);return e?{...e}:undefined;}
 byKind(kind:AssetKind):AssetEntry[]{return [...this.entries.values()].filter(e=>e.kind===kind).map(e=>({...e}));}
 all():AssetEntry[]{return [...this.entries.values()].map(e=>({...e}));}
}
export class AudioEngine {
 private current:HTMLAudioElement|null=null;
 play(asset:AssetEntry):void {if(asset.kind!=="music"&&asset.kind!=="sound")throw new Error("AudioEngine only plays music or sound assets");if(typeof Audio==="undefined")return;const audio=new Audio(asset.src);audio.loop=asset.loop??false;audio.volume=Math.min(1,Math.max(0,asset.volume??0.8));if(asset.kind==="music"){this.current?.pause();this.current=audio;}void audio.play().catch(()=>{/* Browser autoplay policies require a user gesture. */});}
 stopMusic():void {this.current?.pause();this.current=null;}
}
