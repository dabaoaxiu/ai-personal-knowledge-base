import { NextResponse } from "next/server";

import { isSupabaseConfigured } from "@/lib/env";
import { createNote, listNotes } from "@/lib/notes";
import { analyzeNote } from "@/lib/openai";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? "";
    const tag = searchParams.get("tag") ?? "";
    const notes = await listNotes({ query: q, tag, limit: 100 });

    return NextResponse.json({ notes });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch notes."
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      {
        error: "Supabase is not configured. Please set your environment variables first."
      },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as { content?: string };
    const content = body.content?.trim();

    if (!content) {
      return NextResponse.json({ error: "Content is required." }, { status: 400 });
    }

    const analysis = await analyzeNote(content);
    const note = await createNote({
      content,
      summary: analysis.summary,
      tags: analysis.tags
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to save note."
      },
      { status: 500 }
    );
  }
}
