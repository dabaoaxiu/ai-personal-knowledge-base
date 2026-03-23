import { DashboardComposer } from "@/components/dashboard-composer";
import { EmptyState } from "@/components/empty-state";
import { NoteCard } from "@/components/note-card";
import { isGeminiConfigured, isSupabaseConfigured } from "@/lib/env";
import { listNotes } from "@/lib/notes";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const recentNotes = await listNotes({ limit: 6 });
  const supabaseReady = isSupabaseConfigured();
  const geminiReady = isGeminiConfigured();

  return (
    <div className="space-y-8">
      <section className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr]">
        <DashboardComposer canSave={supabaseReady} aiEnabled={geminiReady} />

        <div className="rounded-[32px] border border-stone-200 bg-white/90 p-6 shadow-soft">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Overview</p>
          <h2 className="mt-2 font-serif text-3xl">Knowledge base status</h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-stone-50 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Notes</p>
              <p className="mt-3 font-serif text-4xl">{recentNotes.length}</p>
              <p className="mt-2 text-sm text-stone-500">The dashboard shows your 6 most recent notes for quick recall.</p>
            </div>

            <div className="rounded-[24px] bg-stone-50 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Gemini Status</p>
              <p className="mt-3 text-lg font-semibold">{geminiReady ? "Connected" : "Needs setup"}</p>
              <p className="mt-2 text-sm text-stone-500">
                {geminiReady ? "New notes get Gemini summaries and tags automatically." : "Saving still works, but AI summaries and chat require Gemini."}
              </p>
            </div>
          </div>

          {!supabaseReady && (
            <div className="mt-6 rounded-[24px] border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-800">
              Supabase is not configured yet. Copy `.env.example` to `.env.local`, fill in the values, and run the SQL setup first.
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Recent</p>
            <h2 className="mt-2 font-serif text-3xl">Recently added knowledge</h2>
          </div>
        </div>

        {recentNotes.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {recentNotes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        ) : (
          <EmptyState title="Your knowledge base is empty" description="Paste your first note above and save it. Recent knowledge cards will appear here." />
        )}
      </section>
    </div>
  );
}
