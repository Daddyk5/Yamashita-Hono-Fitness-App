import { Pool } from "pg";
import { env } from "./env.js";

// Single shared connection pool for the whole backend process.
// Connects to the PostgreSQL instance running in the "postgres" Docker
// container (see docker-compose.yml). Inside Docker the host is the
// service name "postgres"; outside Docker (e.g. running `pnpm dev`
// against a container whose port is published) it falls back to
// localhost via DB_HOST.
export const pool = new Pool({
  host: env.database.host,
  port: env.database.port,
  user: env.database.user,
  password: env.database.password,
  database: env.database.name,
  max: 10,
  idleTimeoutMillis: 30_000,
});

pool.on("error", (err) => {
  // Idle client errors (e.g. connection dropped) should not crash the process.
  console.error("Unexpected PostgreSQL client error", err);
});

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await pool.query("SELECT 1");
    return true;
  } catch (err) {
    console.error("Database connection check failed", err);
    return false;
  }
}
