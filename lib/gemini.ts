import { GoogleGenAI, Type } from "@google/genai";

import { env, isGeminiConfigured } from "@/lib/env";
import type { ChatAnswer, NoteAnalysis, NoteRecord } from "@/types";
import { createFallbackSummary, dedupeTags, deriveFallbackTags, extractTitle, truncate } from "@/lib/utils";

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!isGeminiConfigured()) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: env.geminiApiKey
    });
  }

  return geminiClient;
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

  if (!isGeminiConfigured()) {
    return fallback;
  }

  try {
    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: env.geminiModel,
      contents: content,
      config: {
        temperature: 0.2,
        systemInstruction:
          "You turn raw knowledge snippets into a concise summary and a short tag list. Return strict JSON only with this shape: {\"summary\": string, \"tags\": string[]}. The summary should be under 80 words. Use 2 to 5 tags.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING
            },
            tags: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING
              }
            }
          },
          required: ["summary", "tags"]
        }
      }
    });

    const raw = extractJsonObject(response.text || "");
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

  if (!isGeminiConfigured()) {
    throw new Error("GEMINI_API_KEY is missing.");
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

  const client = getGeminiClient();
  const response = await client.models.generateContent({
    model: env.geminiModel,
    contents: `Question:\n${question}\n\nKnowledge sources:\n${context}`,
    config: {
      temperature: 0.3,
      systemInstruction:
        "You are an AI knowledge base assistant. Answer only from the provided knowledge sources. If the answer is not supported by the sources, say that the knowledge base does not contain enough information yet. Keep the answer clear and practical."
    }
  });

  return {
    answer: response.text?.trim() || "I could not prepare an answer just now. Please try another phrasing.",
    sources: notes.map((note) => ({
      id: note.id,
      title: extractTitle(note.content)
    }))
  };
}
