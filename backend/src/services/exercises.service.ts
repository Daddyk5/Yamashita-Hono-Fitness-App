import { pool } from "../db.js";

// Callers (LLM tool calls especially) say "legs" or "back", not the specific
// muscle names the source data uses. Expand a group name to its member
// muscles; an exact muscle name that isn't a group key passes through as-is.
const MUSCLE_GROUPS: Record<string, string[]> = {
  leg: ["quadriceps", "hamstrings", "glutes", "calves", "adductors", "abductors"],
  legs: ["quadriceps", "hamstrings", "glutes", "calves", "adductors", "abductors"],
  back: ["lats", "middle back", "lower back", "traps"],
  arms: ["biceps", "triceps", "forearms"],
  arm: ["biceps", "triceps", "forearms"],
  core: ["abdominals"],
  abs: ["abdominals"],
  ab: ["abdominals"],
  shoulders: ["shoulders"],
  shoulder: ["shoulders"],
  chest: ["chest"],
};

function expandMuscle(muscle: string): string[] {
  return MUSCLE_GROUPS[muscle.toLowerCase().trim()] ?? [muscle];
}

// LLM-supplied filter values are frequently a plausible-sounding guess
// ("leg" as equipment, "weightlifting" as category) rather than one of the
// data's real enum values. An exact-match filter on a hallucinated value
// silently zeroes out every row, so each of these normalizes known aliases
// and drops (rather than passes through) anything unrecognized -- an
// ignored filter returns too many results; a wrong one returns none.
const KNOWN_EQUIPMENT = [
  "body only",
  "barbell",
  "dumbbell",
  "cable",
  "machine",
  "kettlebells",
  "bands",
  "medicine ball",
  "exercise ball",
  "foam roll",
  "e-z curl bar",
  "other",
];
const EQUIPMENT_ALIASES: Record<string, string> = {
  bodyweight: "body only",
  "body weight": "body only",
  "no equipment": "body only",
  none: "body only",
  bands: "bands",
  resistance: "bands",
  "resistance bands": "bands",
  kettlebell: "kettlebells",
  "medicine-ball": "medicine ball",
};

function normalizeEquipment(value: string): string | undefined {
  const v = value.toLowerCase().trim();
  if (EQUIPMENT_ALIASES[v]) return EQUIPMENT_ALIASES[v];
  if (KNOWN_EQUIPMENT.includes(v)) return v;
  const match = KNOWN_EQUIPMENT.find((e) => v.includes(e) || e.includes(v));
  return match; // undefined -> filter is dropped, not applied as a false zero-match
}

const KNOWN_LEVELS = ["beginner", "intermediate", "expert"];
const LEVEL_ALIASES: Record<string, string> = {
  easy: "beginner",
  novice: "beginner",
  medium: "intermediate",
  moderate: "intermediate",
  hard: "expert",
  advanced: "expert",
  difficult: "expert",
};

function normalizeLevel(value: string): string | undefined {
  const v = value.toLowerCase().trim();
  if (LEVEL_ALIASES[v]) return LEVEL_ALIASES[v];
  return KNOWN_LEVELS.includes(v) ? v : undefined;
}

const KNOWN_CATEGORIES = [
  "strength",
  "cardio",
  "stretching",
  "plyometrics",
  "powerlifting",
  "strongman",
  "olympic weightlifting",
];
const CATEGORY_ALIASES: Record<string, string> = {
  weightlifting: "olympic weightlifting",
  olympic: "olympic weightlifting",
  flexibility: "stretching",
  mobility: "stretching",
  hiit: "plyometrics",
};

function normalizeCategory(value: string): string | undefined {
  const v = value.toLowerCase().trim();
  if (CATEGORY_ALIASES[v]) return CATEGORY_ALIASES[v];
  return KNOWN_CATEGORIES.includes(v) ? v : undefined;
}

export interface ExerciseSearchParams {
  muscle?: string;
  level?: string;
  category?: string;
  equipment?: string;
  search?: string;
  limit?: number;
}

export interface ExerciseRow {
  id: number;
  external_id: string | null;
  name: string;
  force: string | null;
  level: string | null;
  mechanic: string | null;
  equipment: string | null;
  primary_muscles: string[];
  secondary_muscles: string[];
  instructions: string[];
  category: string | null;
  images: string[];
}

export async function searchExercises(
  params: ExerciseSearchParams,
): Promise<ExerciseRow[]> {
  const { muscle, level, category, equipment, search, limit = 200 } = params;

  const conditions: string[] = [];
  const values: unknown[] = [];

  if (muscle) {
    values.push(expandMuscle(muscle));
    conditions.push(
      `(primary_muscles ?| $${values.length}::text[] OR secondary_muscles ?| $${values.length}::text[])`,
    );
  }
  const normalizedLevel = level ? normalizeLevel(level) : undefined;
  if (normalizedLevel) {
    values.push(normalizedLevel);
    conditions.push(`level = $${values.length}`);
  }
  const normalizedCategory = category ? normalizeCategory(category) : undefined;
  if (normalizedCategory) {
    values.push(normalizedCategory);
    conditions.push(`category = $${values.length}`);
  }
  const normalizedEquipment = equipment ? normalizeEquipment(equipment) : undefined;
  if (normalizedEquipment) {
    values.push(normalizedEquipment);
    conditions.push(`equipment = $${values.length}`);
  }
  if (search) {
    values.push(`%${search.toLowerCase()}%`);
    conditions.push(`LOWER(name) LIKE $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  values.push(Math.min(limit, 200));

  const result = await pool.query<ExerciseRow>(
    `SELECT id, external_id, name, force, level, mechanic, equipment,
            primary_muscles, secondary_muscles, instructions,
            category, images
     FROM exercises
     ${where}
     ORDER BY name ASC
     LIMIT $${values.length}`,
    values,
  );

  return result.rows;
}

/**
 * Serializes tool results for the chat model. Small local models tend to
 * fabricate an answer when handed a bare `[]`, so an empty result gets an
 * explicit instruction instead of silence.
 */
export function describeExerciseResults(exercises: ExerciseRow[]): string {
  if (exercises.length === 0) {
    return (
      "No exercises matched those filters. Do NOT invent an exercise. " +
      "Tell the user no exact match was found and suggest broadening the " +
      "search (e.g. drop the equipment or level filter)."
    );
  }
  return JSON.stringify(exercises);
}

export async function getExerciseById(id: string): Promise<ExerciseRow | null> {
  const result = await pool.query<ExerciseRow>(
    `SELECT id, external_id, name, force, level, mechanic, equipment,
            primary_muscles, secondary_muscles, instructions,
            category, images
     FROM exercises WHERE id = $1`,
    [id],
  );
  return result.rows[0] ?? null;
}
