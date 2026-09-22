import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";
import { env } from "../env.js";

export interface UserRow {
  id: number;
  email: string;
  display_name: string | null;
  password_hash: string | null;
  is_admin: boolean;
  is_paid: boolean;
  total_workouts: number;
  xp: number;
  created_at: string;
}

export type PublicUser = Omit<UserRow, "password_hash">;

export function toPublicUser(user: UserRow): PublicUser {
  const { password_hash: _password_hash, ...publicUser } = user;
  return publicUser;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signToken(user: Pick<UserRow, "id" | "email">): string {
  return jwt.sign({ sub: user.id, email: user.email }, env.jwtSecret, { expiresIn: "7d" });
}

export interface TokenPayload {
  sub: number;
  email: string;
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, env.jwtSecret) as unknown as TokenPayload;
}

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const { rows } = await pool.query<UserRow>("SELECT * FROM users WHERE email = $1", [email]);
  return rows[0] ?? null;
}

export async function findUserById(id: number): Promise<UserRow | null> {
  const { rows } = await pool.query<UserRow>("SELECT * FROM users WHERE id = $1", [id]);
  return rows[0] ?? null;
}

export async function createUser(
  email: string,
  password: string,
  displayName?: string,
): Promise<UserRow> {
  const passwordHash = await hashPassword(password);
  const { rows } = await pool.query<UserRow>(
    `INSERT INTO users (email, display_name, password_hash)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [email, displayName ?? null, passwordHash],
  );
  return rows[0];
}

// Ensures a single admin account exists, matching ADMIN_EMAIL/ADMIN_PASSWORD.
// Safe to call on every backend startup -- creates the account once, then
// re-syncs its password hash on later startups if the env vars changed.
export async function ensureAdminUser(): Promise<void> {
  const passwordHash = await hashPassword(env.adminPassword);
  await pool.query(
    `INSERT INTO users (email, display_name, password_hash, is_admin, is_paid)
     VALUES ($1, 'Admin', $2, true, true)
     ON CONFLICT (email) DO UPDATE
       SET password_hash = EXCLUDED.password_hash,
           is_admin = true,
           is_paid = true`,
    [env.adminEmail, passwordHash],
  );
}
