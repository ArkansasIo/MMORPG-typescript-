# Architecture and UML

## System context

```mermaid
flowchart LR
  Player[Player: keyboard / mouse / gamepad] --> Client[TypeScript browser client]
  Client --> LocalSave[Browser local save]
  Client -. future online mode .-> API[Express API]
  API --> DB[(MySQL database)]
  Scheduler[node-cron jobs] --> DB
  Geo[Verified geographic data] -. planned .-> Client
  WS[WebSocket authoritative multiplayer] -. planned .-> Client
  WS -. planned .-> DB
```

## Client module diagram

```mermaid
classDiagram
  class GameApp { +start() +render() }
  class WorldGenerator { +generate(seed) +getTile(x,y) }
  class InputManager { +keyboard() +mouse() +gamepad() }
  class PlayerState { +position +level +hp +xp +gold }
  class CombatSystem { +startEncounter() +resolveTurn() }
  class MenuSystem { +titleScreen() +characterCreation() +settings() }
  class SaveService { +saveLocal() +loadLocal() }
  GameApp --> WorldGenerator
  GameApp --> InputManager
  GameApp --> PlayerState
  GameApp --> CombatSystem
  GameApp --> MenuSystem
  SaveService --> PlayerState
```

This is a target logical design; the current client is a compact prototype and does not yet implement every class as a separate module.

## Server sequence: future online join

```mermaid
sequenceDiagram
  actor Player
  participant Client
  participant API
  participant DB as MySQL
  Player->>Client: Choose Play Online
  Client->>API: Health / authentication request
  API->>DB: Validate account and load character
  DB-->>API: Character and save state
  API-->>Client: Session data
  Note over Client,API: WebSocket room synchronization is planned, not implemented
```

## ER model

```mermaid
erDiagram
  PLAYERS ||--o{ PLAYER_QUESTS : has
  WORLD_SEEDS ||--o{ WORLD_REGIONS : generates
  PLAYERS { bigint id PK string username UK int level bigint xp int hp bigint gold }
  PLAYER_QUESTS { bigint id PK bigint player_id FK string quest_key string status json progress }
  WORLD_SEEDS { bigint id PK string seed datetime created_at }
  WORLD_REGIONS { bigint id PK bigint seed_id FK string region_key int width int height string generator_version }
  JOB_RUNS { bigint id PK string job_name string status json details datetime ran_at }
```

## Deployment notes
- Keep MySQL credentials in environment variables; never commit `.env`.
- Use TLS, authentication, authorization, input validation, rate limits, and server-side state validation before exposing online services.
- In multi-instance production, use a distributed scheduler lock so cron jobs do not run multiple times.
- Version world-generation algorithms and content schemas to preserve seeded-world compatibility.