// Client for the backend's streaming AI workout chat (POST /api/chat/stream).
// Uses fetch + a manually parsed Server-Sent Events body rather than
// EventSource, since EventSource cannot send a POST body.

import { getToken } from './authApi'

export const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000'

/** Thrown when the backend returns 402 -- the signed-in user hasn't purchased access. */
export class PurchaseRequiredError extends Error {
  constructor() {
    super('Purchase required to use the AI coach')
    this.name = 'PurchaseRequiredError'
  }
}

export type ChatRole = 'user' | 'assistant'

export interface ChatMessage {
  role: ChatRole
  content: string
}

/** A single exercise as returned by the backend's search_exercises tool. */
export interface ChatExercise {
  id: number
  external_id: string | null
  name: string
  level: string | null
  equipment: string | null
  category: string | null
  primary_muscles: string[]
  secondary_muscles: string[]
  instructions: string[]
  images: string[]
}

export type ChatStreamEvent =
  | { type: 'provider'; provider: 'claude' | 'ollama' }
  | { type: 'text'; delta: string }
  | { type: 'exercises'; exercises: ChatExercise[] }
  | { type: 'tool_use'; name: string; input: unknown }
  | { type: 'error'; message: string }
  | { type: 'done' }

/**
 * Streams a chat reply. Calls `onEvent` for every SSE event as it arrives.
 * Resolves when the stream ends (whether via "done" or a network close);
 * rejects only on a request-level failure (bad status, network error).
 */
export async function streamChat(
  messages: ChatMessage[],
  onEvent: (event: ChatStreamEvent) => void,
  signal?: AbortSignal
): Promise<void> {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/api/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ messages }),
    signal,
  })

  if (res.status === 402) {
    throw new PurchaseRequiredError()
  }

  if (!res.ok || !res.body) {
    let message = `Chat request failed (${res.status})`
    try {
      const body = (await res.json()) as { error?: string }
      if (body.error) message = body.error
    } catch {
      // response wasn't JSON; keep the generic message
    }
    throw new Error(message)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    // SSE frames are separated by a blank line.
    let sep
    while ((sep = buffer.indexOf('\n\n')) !== -1) {
      const frame = buffer.slice(0, sep)
      buffer = buffer.slice(sep + 2)
      parseSseFrame(frame, onEvent)
    }
  }
}

function parseSseFrame(frame: string, onEvent: (event: ChatStreamEvent) => void) {
  let eventName = 'message'
  let dataLine = ''
  for (const line of frame.split('\n')) {
    if (line.startsWith('event:')) eventName = line.slice(6).trim()
    else if (line.startsWith('data:')) dataLine += line.slice(5).trim()
  }
  if (!dataLine) return

  try {
    const data = JSON.parse(dataLine)
    switch (eventName) {
      case 'provider':
        onEvent({ type: 'provider', provider: data.provider })
        break
      case 'text':
        onEvent({ type: 'text', delta: data.delta })
        break
      case 'exercises':
        onEvent({ type: 'exercises', exercises: data.exercises })
        break
      case 'tool_use':
        onEvent({ type: 'tool_use', name: data.name, input: data.input })
        break
      case 'error':
        onEvent({ type: 'error', message: data.message })
        break
      case 'done':
        onEvent({ type: 'done' })
        break
    }
  } catch {
    // Malformed frame — skip rather than crash the whole stream.
  }
}
