import { env } from "../env.js";
import { describeExerciseResults, ExerciseRow, searchExercises } from "./exercises.service.js";

export interface SimpleMessage {
  role: "user" | "assistant" | "tool" | "system";
  content: string;
  tool_call_id?: string;
  tool_name?: string;
  tool_calls?: OllamaToolCall[];
}

const SYSTEM_PROMPT = `You are the AI training coach for a fitness app. When the user
asks for an exercise or workout recommendation, call the "search_exercises"
tool once to ground your answer in the app's real exercise database -- never
invent exercise names, muscle targets, or instructions that the tool didn't
return. Do not call the tool for greetings or general questions that aren't
asking for a specific exercise. After you receive tool results, answer using
them directly -- do not call the tool again for the same request. Keep
responses concise and scannable (short paragraphs or a short list).`;

const searchExercisesTool = {
  type: "function",
  function: {
    name: "search_exercises",
    description:
      "Search the app's exercise database. Use this before recommending any exercise. " +
      "All parameters are optional filters; omit any you don't need.",
    parameters: {
      type: "object",
      properties: {
        muscle: { type: "string", description: "Target muscle, e.g. 'chest', 'quadriceps'." },
        level: { type: "string", enum: ["beginner", "intermediate", "expert"] },
        category: { type: "string", description: "e.g. 'strength', 'cardio', 'stretching'." },
        equipment: { type: "string", description: "e.g. 'body only', 'dumbbell', 'barbell'." },
        search: { type: "string", description: "Free-text match against the exercise name." },
      },
      required: [],
    },
  },
} as const;

interface OllamaToolCall {
  id?: string;
  function: { name: string; arguments: Record<string, string | undefined> };
}

interface OllamaChatChunk {
  message?: { role: string; content: string; tool_calls?: OllamaToolCall[] };
  done: boolean;
}

async function runToolCall(
  call: OllamaToolCall,
  onExercises: (exercises: ExerciseRow[]) => void,
): Promise<string> {
  if (call.function.name !== "search_exercises") {
    return `Unknown tool: ${call.function.name}`;
  }
  const args = call.function.arguments;
  const exercises = await searchExercises({
    muscle: args.muscle,
    level: args.level,
    category: args.category,
    equipment: args.equipment,
    search: args.search,
    limit: 15,
  });
  onExercises(exercises);
  return describeExerciseResults(exercises);
}

// Streams a reply from the local Ollama server, forwarding text chunks via
// `onText`, executing the search_exercises tool locally when the model asks
// for it, and looping until Ollama returns a plain text answer.
const MAX_TOOL_ITERATIONS = 4;

export async function streamOllamaChat(
  userMessages: SimpleMessage[],
  onText: (delta: string) => void,
  onExercises: (exercises: ExerciseRow[]) => void = () => {},
): Promise<void> {
  const messages: SimpleMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...userMessages,
  ];

  // Tracks which tool calls have already been made (name + args) so a small
  // model that keeps re-requesting the same tool doesn't loop forever.
  const seenToolCalls = new Set<string>();

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    const response = await fetch(`${env.ollamaHost}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: env.ollamaModel,
        stream: true,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          ...(m.tool_calls ? { tool_calls: m.tool_calls } : {}),
        })),
        // Stop offering the tool once we've already used it once, so the
        // model is forced to answer with what it already has.
        tools: iteration === 0 ? [searchExercisesTool] : undefined,
      }),
      signal: AbortSignal.timeout(60_000),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Ollama request failed: ${response.status} ${response.statusText}`);
    }

    let assistantText = "";
    let toolCalls: OllamaToolCall[] = [];

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.trim()) continue;
        const chunk = JSON.parse(line) as OllamaChatChunk;
        if (chunk.message?.content) {
          assistantText += chunk.message.content;
          onText(chunk.message.content);
        }
        if (chunk.message?.tool_calls?.length) {
          toolCalls = chunk.message.tool_calls;
        }
      }
    }

    messages.push({
      role: "assistant",
      content: assistantText,
      ...(toolCalls.length > 0 ? { tool_calls: toolCalls } : {}),
    });

    if (toolCalls.length === 0) {
      return; // model gave a final text answer
    }

    for (const call of toolCalls) {
      const key = `${call.function.name}:${JSON.stringify(call.function.arguments)}`;
      const result = seenToolCalls.has(key)
        ? "You already called this tool with these exact arguments. Use the earlier result to answer now."
        : await runToolCall(call, onExercises);
      seenToolCalls.add(key);
      messages.push({
        role: "tool",
        content: result,
        tool_call_id: call.id,
        tool_name: call.function.name,
      });
    }
    // loop again (tools are now disabled) so the model must answer with text
  }

  // Exhausted MAX_TOOL_ITERATIONS without a plain-text answer -- surface
  // something to the user instead of silently ending the stream.
  onText(
    "I found some matching exercises but couldn't put together a final answer in time. Please try rephrasing your question.",
  );
}

export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const res = await fetch(`${env.ollamaHost}/api/version`, {
      signal: AbortSignal.timeout(1500),
    });
    return res.ok;
  } catch {
    return false;
  }
}
