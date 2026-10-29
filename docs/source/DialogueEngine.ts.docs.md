# Dialogue Engine

The dialogue engine stores data-driven NPC conversation trees independently from the UI. A tree has a stable ID, a start node, and nodes containing speaker text and optional choices. Choices can point to another node and can carry a quest ID for the caller to process.

## Validation
Registration rejects blank IDs/text, duplicate node IDs, a missing start node, blank choices, and links to nonexistent nodes. The engine returns copies of registered data to prevent consumers from mutating the canonical tree accidentally.

## Starter content
`src/game/data/Dialogue.ts` contains a village elder conversation about dangerous slimes near the meadow road.

## Integration boundary
The current module returns a choice's optional `questId`; it does not itself accept quests, persist dialogue flags, or render a dialogue window. The game UI must explicitly connect dialogue choices to `GameSession.acceptQuest` and decide how to handle repeated conversations. Branch conditions, localization, voice, and dialogue history are not yet implemented.
