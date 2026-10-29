# Consumable Service

The consumable service resolves registered item effects against a character and inventory. The starter content defines Small Potion as restoring up to 15 HP.

## Transaction behavior
The service verifies that the effect is registered and the item is in inventory. It does not consume an item when health is already full. It applies the effect, removes exactly one item, and rolls back the HP change if inventory removal unexpectedly fails.

## Limitations
Only HP healing is currently supported. Mana potions, status cleansing, temporary buffs, cooldowns, combat-only restrictions, and UI notifications require additional definitions and integration. Item IDs must be registered by the caller; a catalog entry alone does not automatically make an item usable.
