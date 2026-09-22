import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Locate exercises.json: at the repo root when running locally
// (backend/src/seed.ts -> ../../exercises.json), or copied next to the
// backend image at /app/data/exercises.json when running inside Docker.
const candidates = [
  path.resolve(__dirname, "../../exercises.json"),
  path.resolve(__dirname, "../data/exercises.json"),
];
const sourcePath = candidates.find((p) => fs.existsSync(p));

if (!sourcePath) {
  console.error(
    `exercises.json not found. Looked in:\n${candidates.map((p) => ` - ${p}`).join("\n")}`,
  );
  process.exit(1);
}

interface RawExercise {
  id: string;
  name: string;
  force: string | null;
  level: string | null;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string | null;
  images: string[];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function seed() {
  const raw = fs.readFileSync(sourcePath!, "utf-8");
  const exercises: RawExercise[] = JSON.parse(raw);

  console.log(`Seeding ${exercises.length} exercises from ${sourcePath}...`);

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const ex of exercises) {
      await client.query(
        `INSERT INTO exercises
           (slug, external_id, name, force, level, mechanic, equipment,
            primary_muscles, secondary_muscles, instructions, category, images)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         ON CONFLICT (slug) DO UPDATE SET
           external_id = EXCLUDED.external_id,
           name = EXCLUDED.name,
           force = EXCLUDED.force,
           level = EXCLUDED.level,
           mechanic = EXCLUDED.mechanic,
           equipment = EXCLUDED.equipment,
           primary_muscles = EXCLUDED.primary_muscles,
           secondary_muscles = EXCLUDED.secondary_muscles,
           instructions = EXCLUDED.instructions,
           category = EXCLUDED.category,
           images = EXCLUDED.images`,
        [
          slugify(ex.name),
          ex.id,
          ex.name,
          ex.force,
          ex.level,
          ex.mechanic,
          ex.equipment,
          JSON.stringify(ex.primaryMuscles ?? []),
          JSON.stringify(ex.secondaryMuscles ?? []),
          JSON.stringify(ex.instructions ?? []),
          ex.category,
          JSON.stringify(ex.images ?? []),
        ],
      );
    }
    await client.query("COMMIT");
    console.log("Seed complete.");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
