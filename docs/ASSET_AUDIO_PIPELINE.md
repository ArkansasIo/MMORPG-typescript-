# Pixel Art and 8-bit Audio Pipeline

## Original visual assets
Use original assets and clearly tracked licenses. Do not use sprites, creature designs, logos, music, or UI art extracted from Dragon Warrior/Dragon Quest, Final Fantasy, Pokémon, World of Warcraft, or Dungeons & Dragons products.

Suggested atlas folders:
- `public/assets/tiles/` — grass, dirt, water, roads, forests, mountains, desert, snow, lava, space terrain.
- `public/assets/characters/` — nine class silhouettes, NPCs, portraits, animation strips.
- `public/assets/creatures/` — animals, monsters, bosses, elemental variants.
- `public/assets/ui/` — frames, icons, buttons, status effects, cursor.
- `public/assets/effects/` — hit sparks, magic, healing, status animations.
- `public/assets/audio/music/` — 24 original loopable tracks.
- `public/assets/audio/sfx/` — movement, UI, attack, magic, loot, quest, ambient effects.

## Sprite conventions
- Use a consistent pixel grid and palette per biome.
- Store source files separately from optimized runtime PNG/WebP exports.
- Maintain a manifest with asset ID, dimensions, animation frames, origin, license, and attribution.
- Add visual regression screenshots for the title, map, combat, inventory, and character creation screens.

## Music plan (24 original tracks)
1 Title theme; 2 character creation; 3 overworld day; 4 overworld night; 5 town; 6 village; 7 forest; 8 mountain; 9 desert; 10 snow realm; 11 astral realm; 12 dungeon; 13 trial; 14 standard battle; 15 elite battle; 16 boss battle; 17 raid boss; 18 victory; 19 defeat/retreat; 20 inn/rest; 21 crafting; 22 mystery/story reveal; 23 final boss; 24 credits/ending.

## Sound effect categories
UI focus/confirm/cancel, footsteps by terrain, sword hit/miss, spell cast, healing, buff/debuff, enemy telegraph, loot pickup, quest accepted/completed, door/portal, level up, and ambient biome loops.

## Status
This is a production plan and asset manifest outline. Audio tracks and the full sprite library must be created, imported, licensed, and tested before being described as complete.