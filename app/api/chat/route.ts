import { NextResponse } from "next/server";

import { isOpenAIConfigured, isSupabaseConfigured } from "@/lib/env";
import { getRelevantNotes } from "@/lib/notes";
import { answerWithKnowledge } from "@/lib/openai";

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

  if (!isOpenAIConfigured()) {
    return NextResponse.json(
      {
        error: "OpenAI is not configured."
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
