import { Router } from "express";
import { getExerciseById, searchExercises } from "../services/exercises.service.js";

export const exercisesRouter = Router();

// GET /api/exercises?muscle=chest&level=beginner&search=push
exercisesRouter.get("/", async (req, res) => {
  const { muscle, level, category, equipment, search } = req.query;
  try {
    const exercises = await searchExercises({
      muscle: typeof muscle === "string" ? muscle : undefined,
      level: typeof level === "string" ? level : undefined,
      category: typeof category === "string" ? category : undefined,
      equipment: typeof equipment === "string" ? equipment : undefined,
      search: typeof search === "string" ? search : undefined,
    });
    res.json({ count: exercises.length, exercises });
  } catch (err) {
    console.error("Failed to fetch exercises", err);
    res.status(500).json({ error: "Failed to fetch exercises" });
  }
});

exercisesRouter.get("/:id", async (req, res) => {
  try {
    const exercise = await getExerciseById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }
    res.json(exercise);
  } catch (err) {
    console.error("Failed to fetch exercise", err);
    res.status(500).json({ error: "Failed to fetch exercise" });
  }
});
