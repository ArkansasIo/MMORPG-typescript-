# Image, Sprite, and Audio Asset Pipeline
- Document ID: ER-DOC-ASSET-PIPELINE-0001
- Parent: ER-MOD-ASSETS-0001

## Preserve media
This project must retain image/sprite and sound/music support. Do not delete media files as part of source refactoring. The current repository tree did not show a dedicated image/audio asset folder, so this document establishes a convention rather than claiming assets have been imported.

## Recommended layout
```text
src/game/assets/
├── AssetCatalog.ts
├── ASSET_PIPELINE.md
└── manifest.ts
public/assets/
├── images/
│   ├── characters/
│   ├── creatures/
│   ├── tilesets/
│   └── ui/
└── audio/
    ├── music/
    └── sfx/
```
Keep large media under `public/assets` so Vite serves it as static files. Register paths in the manifest and note origin/license. Use original or properly licensed assets; do not extract assets from commercial games without permission.
