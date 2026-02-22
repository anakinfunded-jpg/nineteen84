import Anthropic from "@anthropic-ai/sdk";

export type ModelTier = "free" | "premium";

const MODELS: Record<ModelTier, string> = {
  free: "claude-sonnet-4-5-20250929",
  premium: "claude-opus-4-6",
};

// Fast, cheap model for chat and lightweight tasks
export const CHAT_MODEL = "claude-haiku-4-5-20251001";

// Auto-routing: analyze prompt complexity to pick the right model for premium users
const COMPLEX_KEYWORDS = [
  "analiziraj", "analiza", "primerjaj", "primerjava",
  "razloži", "pojasni", "ovrednoti", "oceni",
  "napiši esej", "napiši članek", "napiši poročilo",
  "ustvari strategijo", "načrtuj", "predlagaj",
  "kreativno", "zgodba", "pesem", "scenarij",
  "prevedi", "povzemi dolgo", "podrobno",
];

export function autoRoute(input: string, tier: ModelTier): ModelTier {
  if (tier === "free") return "free";

  const wordCount = input.trim().split(/\s+/).length;
  const lower = input.toLowerCase();
  const hasComplexKeyword = COMPLEX_KEYWORDS.some((kw) => lower.includes(kw));
  const hasMultipleQuestions = (input.match(/\?/g) || []).length >= 2;
  const isLong = wordCount > 80;

  if (hasComplexKeyword || hasMultipleQuestions || isLong) {
    return "premium";
  }

  return "free";
}

// Lazy-init to avoid throwing at module load if key is missing
let _client: Anthropic | null = null;
function getClient() {
  if (!_client) _client = new Anthropic();
  return _client;
}

export async function generateStream(options: {
  systemPrompt: string;
  userPrompt: string;
  tier?: ModelTier;
  model?: string;
  maxTokens?: number;
  useAutoRoute?: boolean;
}) {
  const {
    systemPrompt,
    userPrompt,
    tier = "free",
    model,
    maxTokens = 2048,
    useAutoRoute = false,
  } = options;

  const effectiveTier = useAutoRoute
    ? autoRoute(userPrompt, tier)
    : tier;

  const client = getClient();

  return client.messages.create({
    model: model || MODELS[effectiveTier],
    max_tokens: maxTokens,
    system: [{ type: "text" as const, text: systemPrompt, cache_control: { type: "ephemeral" as const } }],
    messages: [{ role: "user", content: userPrompt }],
    stream: true,
  });
}

export async function generateText(options: {
  systemPrompt: string;
  userPrompt: string;
  tier?: ModelTier;
  model?: string;
  maxTokens?: number;
}): Promise<string> {
  const { systemPrompt, userPrompt, tier = "free", model, maxTokens = 2048 } = options;
  const client = getClient();

  const response = await client.messages.create({
    model: model || MODELS[tier],
    max_tokens: maxTokens,
    system: [{ type: "text" as const, text: systemPrompt, cache_control: { type: "ephemeral" as const } }],
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  return textBlock?.text ?? "";
}

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function chatStream(options: {
  systemPrompt: string;
  messages: ChatMessage[];
  tier?: ModelTier;
  model?: string;
  maxTokens?: number;
  useAutoRoute?: boolean;
}) {
  const {
    systemPrompt,
    messages,
    tier = "free",
    model,
    maxTokens = 4096,
    useAutoRoute = false,
  } = options;

  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
  const effectiveTier = useAutoRoute && lastUserMsg
    ? autoRoute(lastUserMsg.content, tier)
    : tier;

  const client = getClient();

  return client.messages.create({
    model: model || MODELS[effectiveTier],
    max_tokens: maxTokens,
    system: [{ type: "text" as const, text: systemPrompt, cache_control: { type: "ephemeral" as const } }],
    messages,
    stream: true,
  });
}
