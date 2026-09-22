import type { NextFunction, Request, Response } from "express";
import { findUserById, verifyToken, type UserRow } from "../services/auth.service.js";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: UserRow;
    }
  }
}

function extractToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = extractToken(req);
  if (!token) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }
  try {
    const payload = verifyToken(token);
    const user = await findUserById(payload.sub);
    if (!user) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Gates a route behind "paid or admin" -- admins always pass, everyone else
// needs is_paid=true. Must run after requireAuth.
export function requirePaidOrAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(401).json({ error: "Missing bearer token" });
    return;
  }
  if (req.user.is_admin || req.user.is_paid) {
    next();
    return;
  }
  res.status(402).json({ error: "Purchase required to use the AI coach" });
}
