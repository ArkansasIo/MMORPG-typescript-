# EffectSystem.ts — Source Documentation
- **Document ID:** ER-DOC-FILE-EFFECT-SYSTEM-0001
- **Source backlink:** [../../src/game/effects/EffectSystem.ts](../../src/game/effects/EffectSystem.ts)
- **Master:** [../MASTER_DOCUMENTATION.md](../MASTER_DOCUMENTATION.md)

Stores timed buff/debuff/condition instances, computes summed stat modifiers, checks conditions, advances per-target turn durations, and removes effects. Stacking policies are refresh, stack, and replace. Integrate condition effects with combat and persistence deliberately; current storage is in memory.
