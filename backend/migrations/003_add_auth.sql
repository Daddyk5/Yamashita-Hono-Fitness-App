-- Auth + progression fields on users, plus triggers to keep them consistent.
-- Runs automatically alongside 001/002 the first time the postgres data
-- volume is initialized (see docker-compose.yml).

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_hash  TEXT,
  ADD COLUMN IF NOT EXISTS is_admin       BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS is_paid        BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS total_workouts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS xp             INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ NOT NULL DEFAULT now();

-- Keeps users.updated_at current on every UPDATE, so callers never have to
-- remember to set it themselves.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- Awards xp and bumps the workout count on the owning user whenever a
-- session is logged, so progression stats never drift out of sync with the
-- underlying log rows.
CREATE OR REPLACE FUNCTION apply_workout_xp()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    UPDATE users
    SET total_workouts = total_workouts + 1,
        xp = xp + GREATEST(COALESCE(NEW.sets, 1) * COALESCE(NEW.reps, 1), 10)
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_workout_logs_xp ON workout_logs;
CREATE TRIGGER trg_workout_logs_xp
  AFTER INSERT ON workout_logs
  FOR EACH ROW
  EXECUTE FUNCTION apply_workout_xp();
