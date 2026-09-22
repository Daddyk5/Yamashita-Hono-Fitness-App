import { Router } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import {
  createUser,
  findUserByEmail,
  signToken,
  toPublicUser,
  verifyPassword,
} from "../services/auth.service.js";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { email, password, displayName } = req.body as {
    email?: string;
    password?: string;
    displayName?: string;
  };
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "password must be at least 8 characters" });
    return;
  }

  const existing = await findUserByEmail(email);
  if (existing) {
    res.status(409).json({ error: "An account with that email already exists" });
    return;
  }

  const user = await createUser(email, password, displayName);
  const token = signToken(user);
  res.status(201).json({ token, user: toPublicUser(user) });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const user = await findUserByEmail(email);
  if (!user || !user.password_hash || !(await verifyPassword(password, user.password_hash))) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signToken(user);
  res.json({ token, user: toPublicUser(user) });
});

authRouter.get("/me", requireAuth, (req, res) => {
  res.json({ user: toPublicUser(req.user!) });
});

// Mock purchase flow -- marks the current user as paid. No real payment
// processor is wired up; swap this out for a Stripe webhook handler (or
// similar) when going live.
authRouter.post("/purchase", requireAuth, async (req, res) => {
  const { rows } = await pool.query(
    "UPDATE users SET is_paid = true WHERE id = $1 RETURNING *",
    [req.user!.id],
  );
  const { password_hash: _password_hash, ...publicUser } = rows[0];
  res.json({ user: publicUser });
});
