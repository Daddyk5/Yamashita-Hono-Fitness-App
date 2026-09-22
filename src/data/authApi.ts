// Client for the backend's auth endpoints (register/login/me/purchase).
// Token is kept in localStorage -- fine for this prototype; swap for a
// httpOnly cookie if this ever needs real security hardening.

import { API_BASE_URL } from './chatApi'

const TOKEN_KEY = 'ironvein_auth_token'

export interface AuthUser {
  id: number
  email: string
  display_name: string | null
  is_admin: boolean
  is_paid: boolean
  total_workouts: number
  xp: number
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

function setToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {
    // localStorage unavailable (private mode, etc.) -- the session just
    // won't persist across reloads.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {
    // ignore
  }
}

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const body = (await res.json()) as { error?: string }
    return body.error ?? fallback
  } catch {
    return fallback
  }
}

export async function register(
  email: string,
  password: string,
  displayName?: string
): Promise<AuthUser> {
  const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, displayName }),
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, `Registration failed (${res.status})`))
  const data = (await res.json()) as { token: string; user: AuthUser }
  setToken(data.token)
  return data.user
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, `Login failed (${res.status})`))
  const data = (await res.json()) as { token: string; user: AuthUser }
  setToken(data.token)
  return data.user
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const token = getToken()
  if (!token) return null
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) {
    clearToken()
    return null
  }
  const data = (await res.json()) as { user: AuthUser }
  return data.user
}

/** Mock purchase -- marks the current user as paid. No real payment processor. */
export async function purchase(): Promise<AuthUser> {
  const token = getToken()
  if (!token) throw new Error('Not logged in')
  const res = await fetch(`${API_BASE_URL}/api/auth/purchase`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, `Purchase failed (${res.status})`))
  const data = (await res.json()) as { user: AuthUser }
  return data.user
}
