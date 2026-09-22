# Kengan Ashura Fitness

A fitness-tracking app for anime fans — gym sessions framed as fight-arc
progression, with an AI workout coach grounded against a real 876-exercise
database. React + Vite web app, Express/PostgreSQL backend, and a native
Android build via Capacitor.

<p align="center">
  <img src="docs/screenshots/welcome.png" width="220" alt="Welcome screen" />
  <img src="docs/screenshots/onboarding.png" width="220" alt="Onboarding" />
  <img src="docs/screenshots/registration.png" width="220" alt="Fighter registration — weight class and fitness level" />
  <img src="docs/screenshots/loading.png" width="220" alt="Loading screen" />
</p>

*Screenshots captured from a real build running on an Android emulator via
Capacitor — see [MOBILE.md](MOBILE.md).*

## What's here

- **32 screens** covering onboarding, training, progression, account, and
  system flows, styled as an underground-fighting-arena take on a workout
  app.
- **AI Coach chat** (`src/screens/ChatScreen.tsx`) — ask for a workout and
  get real exercise recommendations, streamed token-by-token, grounded
  against the actual exercise database so the model can't invent exercises
  that don't exist.
- **Exercise Library** with live form-demo images for 876 real exercises.
- **Dual AI provider**: Claude (cloud, needs an API key) or Ollama
  (`llama3.2:3b`, fully local, no key or cost) — auto-selects based on
  whether a key is configured.
- **Native Android app** via Capacitor — same React code, no rewrite.
- Code-split screens with a themed loading transition for faster first load.

## Stack

| Layer | Tech |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Express + TypeScript, PostgreSQL 16 |
| AI | Claude (`@anthropic-ai/sdk`) or Ollama, tool-use grounded against the exercise DB |
| Mobile | Capacitor (Android; iOS possible but not set up — needs a Mac) |
| Infra | Docker Compose (postgres, backend, adminer) |

## Quick start

```bash
pnpm install
cp .env.example .env              # DB creds, CORS, AI provider config
docker compose up -d --build
docker compose exec backend npm run seed   # loads exercises.json into Postgres
pnpm dev                          # starts the Vite dev server
```

Then open the printed local URL. Full backend details (API routes, schema,
running outside Docker) are in [backend/README.md](backend/README.md).

To run it as an installed Android app instead of in a browser, see
[MOBILE.md](MOBILE.md).

## AI chat setup

Works out of the box with no API key, using a local Ollama model:

```bash
ollama pull llama3.2:3b
ollama serve
```

To use Claude instead, set `ANTHROPIC_API_KEY` in `.env` — see
[backend/README.md](backend/README.md#ai-chat-post-apichatstream) for
provider selection details.
