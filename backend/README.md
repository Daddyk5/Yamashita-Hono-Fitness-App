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
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`,
  `POST /api/auth/purchase` — see below.
- `POST /api/chat/stream` — AI workout chat, Server-Sent Events, **requires
  a bearer token from a paid or admin account**. See below.

### Auth (`/api/auth/*`)

| Route | Body | Notes |
| --- | --- | --- |
| `POST /register` | `{ email, password, displayName? }` | Creates an account. Starts `is_paid: false`. Returns `{ token, user }`. |
| `POST /login` | `{ email, password }` | Returns `{ token, user }`. |
| `GET /me` | — (bearer token) | Returns the current user. |
| `POST /purchase` | — (bearer token) | **Mock purchase** — flips `is_paid` to `true`. No real payment processor is wired up; swap this for a Stripe webhook (or similar) before going live. |

Tokens are JWTs (`JWT_SECRET`, 7-day expiry) sent as `Authorization: Bearer <token>`.

**Admin account**: on every backend startup, `ensureAdminUser()`
(`src/services/auth.service.ts`) upserts a single admin account from
`ADMIN_EMAIL`/`ADMIN_PASSWORD` (defaults: `admin@ironvein.io` / `changeme`
— change both before deploying anywhere real). Admins have `is_admin: true`
and always bypass the purchase gate.

**Purchase gate**: `POST /api/chat/stream` is wrapped with
`requireAuth` + `requirePaidOrAdmin` (`src/middleware/auth.middleware.ts`).
An unpaid, non-admin user gets `402 Purchase required`; the frontend's
`ChatScreen` catches that and shows a purchase prompt that calls
`POST /api/auth/purchase`.

### AI chat (`POST /api/chat/stream`)

Body: `{ "messages": [{ "role": "user", "content": "..." }], "provider"?: "claude" | "ollama" }`.
Requires `Authorization: Bearer <token>` from a paid or admin account.

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

Example (log in first to get a token — the admin account bypasses the
purchase gate):

```bash
TOKEN=$(curl -s -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ironvein.io","password":"changeme"}' | jq -r .token)

curl -N -X POST http://localhost:4000/api/chat/stream \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"messages":[{"role":"user","content":"Give me one beginner bodyweight chest exercise."}]}'
```

## Schema

See `migrations/001_init.sql`, `002_add_external_id.sql`, and
`003_add_auth.sql` — all auto-applied the first time the `postgres`
container initializes an **empty** data volume.

If you already had the stack running before `003_add_auth.sql` was added,
Postgres won't re-run it automatically (init scripts only run once, on a
fresh volume). Apply it by hand:

```bash
docker compose exec -T postgres psql -U fitness_app -d fitness_app < backend/migrations/003_add_auth.sql
docker compose up -d --build backend   # picks up the new auth code + deps
```

- `exercises` — seeded from the repo's `exercises.json`.
- `users` — email/password auth, `is_admin`, `is_paid`, `total_workouts`,
  `xp`. A `trg_users_updated_at` trigger keeps `updated_at` current; a
  `trg_workout_logs_xp` trigger on `workout_logs` awards xp and bumps
  `total_workouts` on the owning user whenever a session is logged
  (`apply_workout_xp()` in `003_add_auth.sql`).
- `workout_logs` — scaffolded; not yet wired to a route (nothing writes to
  it yet, so the xp trigger has no live caller — it's ready for whenever
  workout logging ships).
