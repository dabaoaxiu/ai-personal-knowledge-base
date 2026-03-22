import OpenAI from "openai";

import { env, isOpenAIConfigured } from "@/lib/env";
import type { ChatAnswer, NoteAnalysis, NoteRecord } from "@/types";
import { createFallbackSummary, dedupeTags, deriveFallbackTags, extractTitle, truncate } from "@/lib/utils";

let openaiClient: OpenAI | null = null;

function getOpenAIClient() {
  if (!isOpenAIConfigured()) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: env.openAIApiKey
    });
  }

  return openaiClient;
}

function extractJsonObject(raw: string) {
  const fencedMatch = raw.match(/```json\s*([\s\S]*?)```/i) ?? raw.match(/```\s*([\s\S]*?)```/i);

  if (fencedMatch?.[1]) {
    return fencedMatch[1].trim();
  }

  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    return raw.slice(start, end + 1);
  }

  return raw.trim();
}

export async function analyzeNote(content: string): Promise<NoteAnalysis> {
  const fallback = {
    summary: createFallbackSummary(content),
    tags: deriveFallbackTags(content)
  };

  if (!isOpenAIConfigured()) {
    return fallback;
  }

  try {
    const client = getOpenAIClient();
    const response = await client.responses.create({
      model: env.openAIModel,
      temperature: 0.2,
      input: [
        {
          role: "system",
          content:
            "You turn raw knowledge snippets into a concise summary and a short tag list. Respond with strict JSON using this shape only: {\"summary\": string, \"tags\": string[]}. The summary should be under 80 words. Use 2 to 5 tags."
        },
        {
          role: "user",
          content
        }
      ]
    });

    const raw = extractJsonObject(response.output_text || "");
    const parsed = JSON.parse(raw) as Partial<NoteAnalysis>;

    return {
      summary: typeof parsed.summary === "string" && parsed.summary.trim() ? parsed.summary.trim() : fallback.summary,
      tags: Array.isArray(parsed.tags) ? dedupeTags(parsed.tags.map(String)) : fallback.tags
    };
  } catch {
    return fallback;
  }
}

export async function answerWithKnowledge(question: string, notes: NoteRecord[]): Promise<ChatAnswer> {
  if (!notes.length) {
    return {
      answer: "There is not enough knowledge saved yet. Add a few notes first and then ask again.",
      sources: []
    };
  }

  if (!isOpenAIConfigured()) {
    throw new Error("OPENAI_API_KEY is missing.");
  }

  const context = notes
    .map((note, index) => {
      const title = extractTitle(note.content);
      const summary = note.summary || createFallbackSummary(note.content);
      const tags = (note.tags ?? []).join(", ") || "none";
      const excerpt = truncate(note.content.replace(/\s+/g, " "), 400);

      return [
        `Source ${index + 1}`,
        `ID: ${note.id}`,
        `Title: ${title}`,
        `Created: ${note.created_at}`,
        `Tags: ${tags}`,
        `Summary: ${summary}`,
        `Excerpt: ${excerpt}`
      ].join("\n");
    })
    .join("\n\n---\n\n");

  const client = getOpenAIClient();
  const response = await client.responses.create({
    model: env.openAIModel,
    temperature: 0.3,
    input: [
      {
        role: "system",
        content:
          "You are an AI knowledge base assistant. Answer only from the provided knowledge sources. If the answer is not supported by the sources, say that the knowledge base does not contain enough information yet. Keep the answer clear and practical."
      },
      {
        role: "user",
        content: `Question:\n${question}\n\nKnowledge sources:\n${context}`
      }
    ]
  });

  return {
    answer: response.output_text?.trim() || "I could not prepare an answer just now. Please try another phrasing.",
    sources: notes.map((note) => ({
      id: note.id,
      title: extractTitle(note.content)
    }))
  };
}
