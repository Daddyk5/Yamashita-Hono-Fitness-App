# Backend (Node.js/Express + PostgreSQL)

Containerized API for the fitness app. Runs alongside a PostgreSQL 16
container via Docker Compose, defined at the repo root in
`../docker-compose.yml`.

## Services

| Service    | Purpose                          | Port                     |
| ---------- | --------------------------------- | ------------------------ |
| `postgres` | PostgreSQL 16, data in a named volume | `5432`               |
| `backend`  | Express API (`src/index.ts`)      | `4000`                   |
| `adminer`  | Web DB browser (login with the `postgres` server, `fitness_app` user) | `8081` |

## First-time setup

```bash
# from the repo root
cp .env.example .env          # adjust credentials if you want
docker compose up -d --build
docker compose exec backend npm run seed   # loads exercises.json into Postgres
```

Verify:

```bash
curl http://localhost:4000/api/health
curl http://localhost:4000/api/exercises?search=squat
```

## Day-to-day

- `docker compose up -d` — start everything.
- `docker compose logs -f backend` — tail backend logs.
- Source in `backend/src` is bind-mounted into the container and watched
  by `tsx` in polling mode (`CHOKIDAR_USEPOLLING`, needed for reliable
  change detection on a Windows bind mount), so edits reload automatically.
  If a change is ever missed, `docker compose restart backend` forces it.
- `docker compose down` — stop containers (data persists in the
  `postgres_data` volume).
- `docker compose down -v` — stop and wipe the database volume.

## Running the backend outside Docker

```bash
cd backend
cp .env.example .env   # DB_HOST=localhost, assumes `docker compose up postgres` is running
pnpm install            # or npm install
pnpm dev
```

## API

- `GET /api/health` — reports API, database, and both AI chat providers'
  status.
- `GET /api/exercises` — list exercises. Query params: `muscle`,
  `level`, `category`, `equipment`, `search` (matched against name).
- `GET /api/exercises/:id` — single exercise by numeric id.
- `POST /api/chat/stream` — AI workout chat, Server-Sent Events. See below.

### AI chat (`POST /api/chat/stream`)

Body: `{ "messages": [{ "role": "user", "content": "..." }], "provider"?: "claude" | "ollama" }`

Every recommendation is grounded by a `search_exercises` tool call against
the `exercises` table (876 rows seeded from `exercises.json`) — the model
never invents an exercise.

**Provider selection:** omit `provider` and it auto-selects — `claude` when
`ANTHROPIC_API_KEY` is set, otherwise the local `ollama` model. Pass
`provider` explicitly to override.

- **Claude** (`backend/src/routes/chat.routes.ts`) — cloud, via
  `@anthropic-ai/sdk`. Model: `CHAT_MODEL` (default `claude-haiku-4-5`).
  Requires `ANTHROPIC_API_KEY`.
- **Ollama** (`backend/src/services/ollama.service.ts`) — fully local, no
  API key, no per-request cost. Requires Ollama running on the host
  (`ollama serve`, or the desktop app) with a model pulled:
  ```bash
  ollama pull llama3.2:3b
  ```
  Model: `OLLAMA_MODEL` (default `llama3.2:3b`). Host reachability:
  `OLLAMA_HOST` — `http://host.docker.internal:11434` under Docker Compose
  (set automatically), `http://localhost:11434` when running the backend
  directly on the host.

SSE event types: `provider` (which one is answering), `text` (token
deltas), `tool_use` (Claude only — visibility into tool calls), `done`,
`error`.

Example:

```bash
curl -N -X POST http://localhost:4000/api/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Give me one beginner bodyweight chest exercise."}]}'
```

## Schema

See `migrations/001_init.sql`, auto-applied the first time the
`postgres` container initializes its data volume:

- `exercises` — seeded from the repo's `exercises.json`.
- `users`, `workout_logs` — scaffolded for future workout-tracking
  features; not yet wired to any route.
