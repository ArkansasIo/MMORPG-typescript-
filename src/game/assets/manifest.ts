/**
 * @file-id ER-FILE-ASSET-MANIFEST-0001
 * @module-id ER-MOD-ASSETS-0001
 * @doc ./ASSET_PIPELINE.md
 * @master-doc ../../../../docs/MASTER_DOCUMENTATION.md
 * Purpose: central asset manifest; paths are placeholders until media is added.
 */
import type { AssetEntry } from "./AssetCatalog";
export const ASSET_MANIFEST:AssetEntry[]=[
 // Replace placeholder paths with files that exist under public/assets.
 // Keep image and sound entries even when the engine code is refactored.
 {id:"ui-title-logo",kind:"image",src:"/assets/images/ui/title-logo.png",alt:"Earthbound Realms title logo",licenseNote:"Original project asset required"},
 {id:"overworld-tiles",kind:"tileset",src:"/assets/images/tilesets/overworld.png",alt:"Overworld tile set",licenseNote:"Original or properly licensed asset required"},
 {id:"music-overworld",kind:"music",src:"/assets/audio/music/overworld.ogg",loop:true,volume:0.65,licenseNote:"Original or properly licensed audio required"},
 {id:"sfx-confirm",kind:"sound",src:"/assets/audio/sfx/confirm.wav",volume:0.8,licenseNote:"Original or properly licensed audio required"}
];
