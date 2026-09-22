-- Runs automatically once, the first time the "postgres" container
-- initializes an empty data volume (see docker-compose.yml, which mounts
-- this file into /docker-entrypoint-initdb.d/).

CREATE TABLE IF NOT EXISTS exercises (
  id                SERIAL PRIMARY KEY,
  slug              TEXT UNIQUE NOT NULL,
  name              TEXT NOT NULL,
  force             TEXT,
  level             TEXT,
  mechanic          TEXT,
  equipment         TEXT,
  primary_muscles   JSONB NOT NULL DEFAULT '[]',
  secondary_muscles JSONB NOT NULL DEFAULT '[]',
  instructions      JSONB NOT NULL DEFAULT '[]',
  category          TEXT,
  images            JSONB NOT NULL DEFAULT '[]',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exercises_level ON exercises (level);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises (category);
CREATE INDEX IF NOT EXISTS idx_exercises_primary_muscles ON exercises USING GIN (primary_muscles);

CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  email         TEXT UNIQUE NOT NULL,
  display_name  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workout_logs (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER REFERENCES users (id) ON DELETE CASCADE,
  exercise_id  INTEGER REFERENCES exercises (id) ON DELETE SET NULL,
  sets         INTEGER,
  reps         INTEGER,
  weight_kg    NUMERIC(6, 2),
  logged_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
