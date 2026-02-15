import Anthropic from "@anthropic-ai/sdk";

export type ModelTier = "free" | "premium";

const MODELS: Record<ModelTier, string> = {
  free: "claude-haiku-4-5-20251001",
  premium: "claude-sonnet-4-5-20250929",
};

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
  maxTokens?: number;
}) {
  const {
    systemPrompt,
    userPrompt,
    tier = "free",
    maxTokens = 2048,
  } = options;

  const client = getClient();

  return client.messages.create({
    model: MODELS[tier],
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
    stream: true,
  });
}

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function chatStream(options: {
  systemPrompt: string;
  messages: ChatMessage[];
  tier?: ModelTier;
  maxTokens?: number;
}) {
  const {
    systemPrompt,
    messages,
    tier = "free",
    maxTokens = 4096,
  } = options;

  const client = getClient();

  return client.messages.create({
    model: MODELS[tier],
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
    stream: true,
  });
}
