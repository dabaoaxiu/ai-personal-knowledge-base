import { ChatPanel } from "@/components/chat-panel";
import { isOpenAIConfigured, isSupabaseConfigured } from "@/lib/env";
import { listNotes } from "@/lib/notes";

export const dynamic = "force-dynamic";

export default async function AssistantPage() {
  const notes = await listNotes({ limit: 12 });
  const canChat = isSupabaseConfigured() && isOpenAIConfigured();

  return (
    <div className="space-y-8">
      <section className="rounded-[32px] border border-stone-200 bg-white/85 p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Assistant</p>
        <div className="mt-2 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <div>
            <h2 className="font-serif text-4xl">Ask AI about your saved knowledge</h2>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-stone-600">
              The assistant is grounded in your notes instead of answering in the abstract. It works well for recall, synthesis, and project context.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-[24px] bg-stone-50 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Context Pool</p>
              <p className="mt-3 font-serif text-4xl">{notes.length}</p>
              <p className="mt-2 text-sm text-stone-500">Chat pulls from the most recent and most relevant notes first.</p>
            </div>
            <div className="rounded-[24px] bg-stone-50 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-stone-400">Mode</p>
              <p className="mt-3 text-lg font-semibold">{canChat ? "Knowledge-grounded Q&A" : "Needs setup"}</p>
              <p className="mt-2 text-sm text-stone-500">
                If your notes do not contain the answer, the assistant says so clearly.
              </p>
            </div>
          </div>
        </div>
      </section>

      <ChatPanel canChat={canChat} />
    </div>
  );
}
