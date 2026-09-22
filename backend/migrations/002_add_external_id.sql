-- The source exercises.json ships its own free-exercise-db id (e.g.
-- "Barbell_Full_Squat") alongside its image paths. The original 001 seed
-- dropped it in favor of a derived slug, which breaks any frontend code
-- that resolves an exercise by that upstream id. Store it too.
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS external_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_exercises_external_id ON exercises (external_id);
