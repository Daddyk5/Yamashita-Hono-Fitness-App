import "dotenv/config";

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  database: {
    host: required("DB_HOST", "localhost"),
    port: Number(process.env.DB_PORT ?? 5432),
    user: required("DB_USER", "fitness_app"),
    password: required("DB_PASSWORD", "fitness_app_password"),
    name: required("DB_NAME", "fitness_app"),
  },
  // Comma-separated list of allowed origins. Defaults cover the Vite dev
  // server and Capacitor's WebView origins -- http://localhost (Android,
  // configured via androidScheme in capacitor.config.ts to avoid mixed-content
  // blocking against the plain-HTTP dev backend), https://localhost
  // (Capacitor's own default scheme), and capacitor://localhost (iOS).
  corsOrigins: (
    process.env.CORS_ORIGIN ??
    "http://localhost:8443,http://localhost,https://localhost,capacitor://localhost"
  )
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  chatModel: process.env.CHAT_MODEL ?? "claude-haiku-4-5",
  // http://localhost:11434 when running the backend directly on the host;
  // http://host.docker.internal:11434 when running via docker-compose
  // (set in docker-compose.yml) so the container can reach the host's
  // Ollama server.
  ollamaHost: process.env.OLLAMA_HOST ?? "http://localhost:11434",
  ollamaModel: process.env.OLLAMA_MODEL ?? "llama3.2:3b",
};
