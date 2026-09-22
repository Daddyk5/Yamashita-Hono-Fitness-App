import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { env } from "../env.js";
import { describeExerciseResults, searchExercises } from "../services/exercises.service.js";
import { streamOllamaChat } from "../services/ollama.service.js";

export const chatRouter = Router();

// Lazily constructed: throws a clear error at request time (not at import
// time) if ANTHROPIC_API_KEY is missing, instead of crashing the process.
let client: Anthropic | null = null;
function getClient(): Anthropic {
  if (!client) {
    if (!env.anthropicApiKey) {
      throw new Error(
        "ANTHROPIC_API_KEY is not set. Add it to backend/.env (or the root .env used by docker-compose).",
      );
    }
    client = new Anthropic({ apiKey: env.anthropicApiKey });
  }
  return client;
}

const SYSTEM_PROMPT = `You are the AI training coach for a fitness app. You recommend
specific, safe workouts using the "search_exercises" tool to ground every
recommendation in the app's real exercise database -- never invent exercise
names, muscle targets, or instructions that the tool didn't return. Ask a
brief clarifying question only when the user's goal, equipment, or
experience level is genuinely ambiguous; otherwise make a reasonable
assumption and say what you assumed. Keep responses concise and scannable
(short paragraphs or a short list), and always ground exercise selection in
the user's stated equipment and experience level when given.`;

const searchExercisesTool: Anthropic.Tool = {
  name: "search_exercises",
  description:
    "Search the app's exercise database. Use this before recommending any exercise. " +
    "All parameters are optional filters; omit any you don't need.",
  input_schema: {
    type: "object",
    properties: {
      muscle: {
        type: "string",
        description: "Target muscle, e.g. 'chest', 'quadriceps', 'lats'.",
      },
      level: {
        type: "string",
        enum: ["beginner", "intermediate", "expert"],
      },
      category: {
        type: "string",
        description: "e.g. 'strength', 'cardio', 'stretching', 'plyometrics'.",
      },
      equipment: {
        type: "string",
        description: "e.g. 'body only', 'dumbbell', 'barbell', 'cable', 'machine'.",
      },
      search: {
        type: "string",
        description: "Free-text match against the exercise name.",
      },
    },
    required: [],
  },
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

type ChatProvider = "claude" | "ollama";

function toSse(res: import("express").Response, event: string, data: unknown) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

async function handleClaudeStream(
  res: import("express").Response,
  body: { messages: ChatMessage[] },
  isClosed: () => boolean,
) {
  const anthropic = getClient();

  const messages: Anthropic.MessageParam[] = body.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // Tool-use loop: stream text as it arrives; if Claude calls a tool,
  // execute it, feed the result back, and continue streaming.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (isClosed()) return;

    const stream = anthropic.messages.stream({
      model: env.chatModel,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: [searchExercisesTool],
      messages,
    });

    stream.on("text", (delta) => {
      if (!isClosed()) toSse(res, "text", { delta });
    });

    const finalMessage = await stream.finalMessage();
    messages.push({ role: "assistant", content: finalMessage.content });

    if (finalMessage.stop_reason !== "tool_use") {
      if (finalMessage.stop_reason === "refusal") {
        toSse(res, "error", { message: "The assistant declined to respond." });
      }
      break;
    }

    const toolUseBlocks = finalMessage.content.filter(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use",
    );

    const toolResults: Anthropic.ToolResultBlockParam[] = [];
    for (const block of toolUseBlocks) {
      toSse(res, "tool_use", { name: block.name, input: block.input });
      try {
        if (block.name === "search_exercises") {
          const input = block.input as Record<string, string | undefined>;
          const exercises = await searchExercises({
            muscle: input.muscle,
            level: input.level,
            category: input.category,
            equipment: input.equipment,
            search: input.search,
            limit: 15,
          });
          toSse(res, "exercises", { exercises });
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: describeExerciseResults(exercises),
          });
        } else {
          toolResults.push({
            type: "tool_result",
            tool_use_id: block.id,
            content: `Unknown tool: ${block.name}`,
            is_error: true,
          });
        }
      } catch (err) {
        console.error("Tool execution failed", err);
        toolResults.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: "Tool execution failed.",
          is_error: true,
        });
      }
    }

    messages.push({ role: "user", content: toolResults });
    // loop continues: send the tool results back to Claude for a final reply
  }
}

async function handleOllamaStream(
  res: import("express").Response,
  body: { messages: ChatMessage[] },
  isClosed: () => boolean,
) {
  await streamOllamaChat(
    body.messages,
    (delta) => {
      if (!isClosed()) toSse(res, "text", { delta });
    },
    (exercises) => {
      if (!isClosed()) toSse(res, "exercises", { exercises });
    },
  );
}

// POST /api/chat/stream
// Body: { messages: [{ role: "user" | "assistant", content: string }], provider?: "claude" | "ollama" }
// Server-Sent Events stream of the assistant's reply. Grounds recommendations
// via the search_exercises tool against the Postgres exercises table.
// Provider selection: explicit `provider` in the body wins; otherwise falls
// back to the local Ollama model automatically when ANTHROPIC_API_KEY isn't
// configured, so the AI chat still works with zero cloud setup.
chatRouter.post("/stream", async (req, res) => {
  const body = req.body as { messages?: ChatMessage[]; provider?: ChatProvider };
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return res.status(400).json({ error: "messages[] is required" });
  }

  const provider: ChatProvider = body.provider ?? (env.anthropicApiKey ? "claude" : "ollama");

  if (provider === "claude") {
    try {
      getClient();
    } catch (err) {
      return res.status(503).json({ error: (err as Error).message });
    }
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();
  toSse(res, "provider", { provider });

  // Listen on the *response*, not the request: req's "close" can fire as
  // soon as the request body is fully read (well before the response is
  // done), which would silently suppress every later SSE write.
  let clientClosed = false;
  res.on("close", () => {
    clientClosed = true;
  });

  try {
    const validated = { messages: body.messages };
    const isClosed = () => clientClosed;
    if (provider === "claude") {
      await handleClaudeStream(res, validated, isClosed);
    } else {
      await handleOllamaStream(res, validated, isClosed);
    }

    if (!clientClosed) {
      toSse(res, "done", {});
      res.end();
    }
  } catch (err) {
    console.error(`Chat stream failed (provider: ${provider})`, err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Chat stream failed" });
    } else {
      toSse(res, "error", { message: "Chat stream failed" });
      res.end();
    }
  }
});
