import Link from "next/link";

import { TagChip } from "@/components/tag-chip";
import { formatDate, truncate } from "@/lib/utils";
import type { NoteCardData } from "@/types";

interface NoteCardProps {
  note: NoteCardData;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link
      href={`/library/${note.id}`}
      className="group flex h-full flex-col rounded-[28px] border border-stone-200 bg-white/90 p-6 shadow-soft transition hover:-translate-y-1 hover:border-stone-300"
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.25em] text-stone-400">
        <span>Knowledge</span>
        <span>{formatDate(note.created_at)}</span>
      </div>

      <h3 className="mt-5 font-serif text-2xl leading-tight text-ink transition group-hover:text-teal-700">
        {note.title}
      </h3>

      <p className="mt-4 flex-1 text-sm leading-7 text-stone-600">
        {truncate(note.summary || note.content.replace(/\s+/g, " "), 160)}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {note.tags.length ? note.tags.map((tag) => <TagChip key={tag} label={tag} />) : <TagChip label="untagged" muted />}
      </div>
    </Link>
  );
}
