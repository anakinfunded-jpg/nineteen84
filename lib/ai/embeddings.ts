import OpenAI from "openai";
import { createAdminClient } from "@/lib/supabase/admin";

const openai = new OpenAI();

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: "text-embedding-3-large",
    input: text,
    dimensions: 1536,
  });
  return response.data[0].embedding;
}

export function splitIntoChunks(text: string, maxTokens = 500): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";

  for (const sentence of sentences) {
    const combined = current ? `${current} ${sentence}` : sentence;
    // Rough token estimate: ~4 chars per token
    if (combined.length > maxTokens * 4 && current) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = combined;
    }
  }

  if (current.trim()) {
    chunks.push(current.trim());
  }

  return chunks;
}

export async function storeDocument(
  userId: string,
  title: string,
  content: string
): Promise<string> {
  const admin = createAdminClient();

  // Insert document
  const { data: doc, error: docError } = await admin
    .from("documents")
    .insert({ user_id: userId, title, content })
    .select("id")
    .single();

  if (docError || !doc) {
    throw new Error("Napaka pri shranjevanju dokumenta");
  }

  // Split into chunks and generate embeddings
  const chunks = splitIntoChunks(content);

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk);

    await admin.from("document_chunks").insert({
      document_id: doc.id,
      user_id: userId,
      content: chunk,
      embedding: JSON.stringify(embedding),
    });
  }

  return doc.id;
}

export async function queryDocuments(
  userId: string,
  query: string,
  matchCount = 5
): Promise<{ id: string; content: string; similarity: number }[]> {
  const admin = createAdminClient();
  const queryEmbedding = await generateEmbedding(query);

  const { data, error } = await admin.rpc("match_chunks", {
    query_embedding: JSON.stringify(queryEmbedding),
    match_user_id: userId,
    match_count: matchCount,
  });

  if (error) {
    throw new Error("Napaka pri iskanju v dokumentih");
  }

  return data || [];
}
