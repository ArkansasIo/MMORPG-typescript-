# Classic 8-bit RPG Visual Style

## Direction

Use an original early-console fantasy RPG presentation. The project may take broad visual inspiration from Dragon Warrior-era games, but must use original names, maps, sprites, music, and interface artwork rather than copied game assets.

## Interface system

- Palette: deep navy and royal blue for panels, pale blue for borders, warm gold for highlights, cream for text.
- Typography: monospaced fallback for the current prototype; replace with a properly licensed pixel font when an asset is selected.
- Geometry: square corners, thick borders, hard shadows, no glass effects or modern gradients inside game panels.
- Menus: compact command labels, clear selected states, keyboard-friendly buttons.
- Dialogue: blue framed text panels with high-contrast readable copy.
- Status: show character name, class, level, HP, XP, gold, and equipment.
- Exploration: top-down tile grid with a clear player marker and readable terrain symbols.
- Combat: enemy portrait area, enemy HP, action prompt, and explicit attack/flee controls.
- Responsive behavior: retain touch-sized controls and scrollable maps on narrow screens.

## Asset roadmap

1. Create original 8×8 and 16×16 terrain tiles for grass, forest, water, mountains, roads, doors, walls, and town structures.
2. Create original 16×16 player and NPC sprites with directional animation frames.
3. Create original monster sprite sheets for slime, wolf, skeleton, and later creature families.
4. Add a sprite-atlas manifest with frame dimensions, animation names, and license/provenance metadata.
5. Replace temporary glyph portraits with atlas-rendered sprites without changing combat rules.
6. Add original chiptune-style music and sound effects with explicit licensing/provenance.

## Preservation requirements

The visual layer must not duplicate or replace the game domain logic. Continue to route movement, combat, inventory, quests, crafting, and save operations through the existing runtime/controller. Keep local play functional when the API server is offline.
