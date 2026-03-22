import type { NoteCardData, NoteRecord } from "@/types";
import { isSupabaseConfigured } from "@/lib/env";
import { getSupabaseAdmin } from "@/lib/supabase";
import { dedupeTags, extractTitle, getQueryTerms, normalizeTag } from "@/lib/utils";

function toCard(note: NoteRecord): NoteCardData {
  return {
    ...note,
    title: extractTitle(note.content),
    tags: dedupeTags(note.tags ?? [])
  };
}

export async function listNotes(options?: {
  query?: string;
  tag?: string;
  limit?: number;
}): Promise<NoteCardData[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const client = getSupabaseAdmin();
  let queryBuilder = client.from("notes").select("*").order("created_at", { ascending: false });

  if (options?.tag) {
    queryBuilder = queryBuilder.contains("tags", [normalizeTag(options.tag)]);
  }

  if (options?.limit) {
    queryBuilder = queryBuilder.limit(options.limit);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    throw new Error(error.message);
  }

  const mapped = (data ?? []).map((note) => toCard(note as NoteRecord));
  const terms = getQueryTerms(options?.query ?? "");

  if (!terms.length) {
    return mapped;
  }

  return mapped.filter((note) => {
    const haystack = [note.title, note.summary ?? "", note.content, note.tags.join(" ")].join(" ").toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

export async function getAllTags() {
  const notes = await listNotes({ limit: 100 });
  return Array.from(new Set(notes.flatMap((note) => note.tags))).sort((a, b) => a.localeCompare(b));
}

export async function getNoteById(id: string) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const client = getSupabaseAdmin();
  const { data, error } = await client.from("notes").select("*").eq("id", id).single();

  if (error) {
    return null;
  }

  return toCard(data as NoteRecord);
}

export async function createNote(input: { content: string; summary: string; tags: string[] }) {
  const client = getSupabaseAdmin();
  const { data, error } = await client
    .from("notes")
    .insert({
      content: input.content,
      summary: input.summary,
      tags: dedupeTags(input.tags)
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return toCard(data as NoteRecord);
}

function scoreNote(note: NoteCardData, terms: string[]) {
  const title = note.title.toLowerCase();
  const summary = (note.summary ?? "").toLowerCase();
  const content = note.content.toLowerCase();
  const tagSet = new Set(note.tags.map((tag) => tag.toLowerCase()));

  return terms.reduce((score, term) => {
    let total = score;

    if (tagSet.has(term)) {
      total += 5;
    }

    if (title.includes(term)) {
      total += 4;
    }

    if (summary.includes(term)) {
      total += 3;
    }

    if (content.includes(term)) {
      total += 2;
    }

    return total;
  }, 0);
}

export async function getRelevantNotes(question: string, limit = 6): Promise<NoteRecord[]> {
  const notes = await listNotes({ limit: 80 });
  const terms = getQueryTerms(question);

  if (!terms.length) {
    return notes.slice(0, limit);
  }

  const ranked = notes
    .map((note) => ({
      note,
      score: scoreNote(note, terms)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => ({
      id: item.note.id,
      content: item.note.content,
      summary: item.note.summary,
      tags: item.note.tags,
      created_at: item.note.created_at
    }));

  return ranked.length ? ranked : notes.slice(0, limit);
}
