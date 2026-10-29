# Controls

## Keyboard
- Move: W, A, S, D or arrow keys.
- Confirm/interact: Enter or Space where supported.
- Escape: planned back/cancel behavior for menus and dialogs.

## Mouse
- Click a neighboring tile to move one step.
- Use menus, inventory, quest log, and map zoom with standard pointer controls.

## PlayStation 5 DualSense / gamepad
The browser Gamepad API can expose a connected DualSense controller, depending on browser, OS, USB/Bluetooth connection, permissions, and whether the page has focus. This is browser gamepad support, not a native PlayStation build.

Proposed default mapping:
- Left stick / D-pad: move or navigate.
- Cross (button 0 in common mappings): confirm / basic attack.
- Circle (button 1): cancel / back.
- Square (button 2): interact / item.
- Triangle (button 3): character/menu.
- L1/R1: cycle targets or party members.
- Options: pause/settings.

Controller layouts differ by browser and platform; expose remapping in Settings before production. Avoid assuming the same button mapping for every device.