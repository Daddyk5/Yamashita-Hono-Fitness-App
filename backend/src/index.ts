import express from "express";
import cors from "cors";
import { env } from "./env.js";
import { checkDatabaseConnection } from "./db.js";
import { exercisesRouter } from "./routes/exercises.routes.js";
import { chatRouter } from "./routes/chat.routes.js";
import { isOllamaAvailable } from "./services/ollama.service.js";

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

app.use("/api/exercises", exercisesRouter);
app.use("/api/chat", chatRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(env.port, () => {
  console.log(`Backend listening on http://localhost:${env.port} (${env.nodeEnv})`);
});
