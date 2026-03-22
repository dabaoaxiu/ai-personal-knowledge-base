import { EmptyState } from "@/components/empty-state";
import { LibraryControls } from "@/components/library-controls";
import { NoteCard } from "@/components/note-card";
import { getAllTags, listNotes } from "@/lib/notes";

export const dynamic = "force-dynamic";

function getSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

export default async function LibraryPage({
  searchParams
}: {
  searchParams: {
    q?: string | string[];
    tag?: string | string[];
  };
}) {
  const query = getSearchParam(searchParams.q);
  const tag = getSearchParam(searchParams.tag);

  const [notes, tags] = await Promise.all([listNotes({ query, tag, limit: 100 }), getAllTags()]);

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-stone-200 bg-white/85 p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Library</p>
        <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-serif text-4xl">Knowledge cards</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
              Explore every note in one place. Search by keyword, filter by tag, and quickly revisit what you saved before.
            </p>
          </div>
          <div className="rounded-[24px] bg-stone-50 px-5 py-4 text-sm text-stone-500">
            Results: <span className="font-semibold text-ink">{notes.length}</span>
          </div>
        </div>
      </section>

      <LibraryControls query={query} selectedTag={tag} tags={tags} />

      {notes.length ? (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No matching knowledge yet"
          description="Try a different keyword, remove the tag filter, or finish the database setup if this is a new project."
        />
      )}
    </div>
  );
}
