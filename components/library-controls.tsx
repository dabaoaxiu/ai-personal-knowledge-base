import Link from "next/link";

interface LibraryControlsProps {
  query: string;
  selectedTag: string;
  tags: string[];
}

export function LibraryControls({ query, selectedTag, tags }: LibraryControlsProps) {
  return (
    <form action="/library" className="rounded-[28px] border border-stone-200 bg-white/90 p-5 shadow-soft">
      <div className="grid gap-4 md:grid-cols-[1.8fr,1fr,auto]">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search title, summary, or note content"
          className="h-12 rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm text-ink outline-none transition focus:border-teal-500 focus:bg-white"
        />

        <select
          name="tag"
          defaultValue={selectedTag}
          className="h-12 rounded-2xl border border-stone-200 bg-stone-50 px-4 text-sm text-ink outline-none transition focus:border-teal-500 focus:bg-white"
        >
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <div className="flex gap-3">
          <button
            type="submit"
            className="h-12 rounded-2xl bg-ink px-5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Filter
          </button>

          <Link
            href="/library"
            className="inline-flex h-12 items-center rounded-2xl border border-stone-200 px-5 text-sm font-medium text-stone-600 transition hover:border-stone-300 hover:text-ink"
          >
            Reset
          </Link>
        </div>
      </div>
    </form>
  );
}
