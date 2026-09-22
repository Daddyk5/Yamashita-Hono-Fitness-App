import express from "express";
import cors from "cors";
import { env } from "./env.js";
import { checkDatabaseConnection } from "./db.js";
import { exercisesRouter } from "./routes/exercises.routes.js";
import { chatRouter } from "./routes/chat.routes.js";
import { authRouter } from "./routes/auth.routes.js";
import { isOllamaAvailable } from "./services/ollama.service.js";
import { ensureAdminUser } from "./services/auth.service.js";
import { requireAuth, requirePaidOrAdmin } from "./middleware/auth.middleware.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // No Origin header (native app shells, curl, server-to-server) — allow.
      if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`Origin not allowed: ${origin}`));
    },
  }),
);
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  const [dbOk, ollamaOk] = await Promise.all([
    checkDatabaseConnection(),
    isOllamaAvailable(),
  ]);
  res.status(dbOk ? 200 : 503).json({
    status: dbOk ? "ok" : "degraded",
    database: dbOk ? "connected" : "unreachable",
    aiChat: {
      claude: env.anthropicApiKey ? "configured" : "missing ANTHROPIC_API_KEY",
      ollama: ollamaOk ? `available (${env.ollamaModel})` : `unreachable at ${env.ollamaHost}`,
      activeProvider: env.anthropicApiKey ? "claude" : "ollama",
    },
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRouter);
app.use("/api/exercises", exercisesRouter);
// AI chat costs real tokens/compute, so it's gated behind "paid or admin" --
// see backend/src/middleware/auth.middleware.ts.
app.use("/api/chat", requireAuth, requirePaidOrAdmin, chatRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

ensureAdminUser()
  .then(() => console.log(`Admin account ready: ${env.adminEmail}`))
  .catch((err) => console.error("Failed to bootstrap admin account", err));

app.listen(env.port, () => {
  console.log(`Backend listening on http://localhost:${env.port} (${env.nodeEnv})`);
});
