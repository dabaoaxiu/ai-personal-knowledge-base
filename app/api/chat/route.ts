import { NextResponse } from "next/server";

import { isGeminiConfigured, isSupabaseConfigured } from "@/lib/env";
import { answerWithKnowledge } from "@/lib/gemini";
import { getRelevantNotes } from "@/lib/notes";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error: "Supabase is not configured."
      },
      { status: 500 }
    );
  }

  if (!isGeminiConfigured()) {
    return NextResponse.json(
      {
        error: "Gemini is not configured."
      },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as { question?: string };
    const question = body.question?.trim();

    if (!question) {
      return NextResponse.json({ error: "Question is required." }, { status: 400 });
    }

    const notes = await getRelevantNotes(question, 6);
    const result = await answerWithKnowledge(question, notes);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to answer question."
      },
      { status: 500 }
    );
  }
}
