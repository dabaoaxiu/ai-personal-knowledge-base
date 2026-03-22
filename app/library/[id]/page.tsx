import { notFound } from "next/navigation";

import { TagChip } from "@/components/tag-chip";
import { getNoteById } from "@/lib/notes";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function NoteDetailPage({ params }: { params: { id: string } }) {
  const note = await getNoteById(params.id);

  if (!note) {
    notFound();
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.3fr,0.7fr]">
      <section className="rounded-[32px] border border-stone-200 bg-white/90 p-7 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Detail</p>
        <h2 className="mt-2 font-serif text-4xl leading-tight">{note.title}</h2>
        <p className="mt-4 text-sm text-stone-500">Created {formatDate(note.created_at)}</p>

        <div className="mt-8 whitespace-pre-wrap rounded-[28px] bg-stone-50 p-6 text-sm leading-8 text-stone-700">
          {note.content}
        </div>
      </section>

      <aside className="space-y-6">
        <div className="rounded-[32px] border border-stone-200 bg-white/90 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">AI Summary</p>
          <p className="mt-4 text-sm leading-8 text-stone-700">{note.summary || "No summary yet."}</p>
        </div>

        <div className="rounded-[32px] border border-stone-200 bg-white/90 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Tags</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {note.tags.length ? note.tags.map((tag) => <TagChip key={tag} label={tag} />) : <TagChip label="untagged" muted />}
          </div>
        </div>
      </aside>
    </div>
  );
}
