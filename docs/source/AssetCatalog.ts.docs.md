# AssetCatalog.ts — Source Documentation
- Document ID: ER-DOC-FILE-ASSET-CATALOG-0001
- Source ID: ER-FILE-ASSET-CATALOG-0001
- Source backlink: [../../src/game/assets/AssetCatalog.ts](../../src/game/assets/AssetCatalog.ts)
- Master: [../MASTER_DOCUMENTATION.md](../MASTER_DOCUMENTATION.md)

Catalogs image/sprite/tileset and audio paths without embedding binary media in TypeScript. AudioEngine supports basic music looping, sound playback, volume clamping, stopping music, and gracefully handles browser autoplay rejection. It does not delete or replace any assets. Add only files present in the project, track licenses, and initiate playback after a user gesture when required.
