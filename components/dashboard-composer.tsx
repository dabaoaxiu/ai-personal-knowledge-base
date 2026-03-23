"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function DashboardComposer({ canSave, aiEnabled }: { canSave: boolean; aiEnabled: boolean }) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!content.trim()) {
      setError("Please enter some knowledge before saving.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content })
      });

      const payload = (await response.json()) as { note?: { title: string }; error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Saving failed. Please try again.");
      }

      setContent("");
      setMessage(`Saved: ${payload.note?.title ?? "New note"}`);
      router.refresh();
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Saving failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[32px] border border-stone-200 bg-white/90 p-6 shadow-soft">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Capture</p>
          <h2 className="mt-2 font-serif text-3xl">Save a new knowledge snippet</h2>
        </div>

        <button
          type="submit"
          disabled={!canSave || isSaving}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-ink px-5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Paste meeting notes, reading highlights, ideas, docs, or any piece of knowledge you want to keep."
        className="mt-5 min-h-[220px] w-full rounded-[28px] border border-stone-200 bg-stone-50 px-5 py-4 text-sm leading-7 text-ink outline-none transition focus:border-teal-500 focus:bg-white"
      />

      <div className="mt-4 flex flex-col gap-2 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
        <p>{aiEnabled ? "Gemini summary and tags will be generated on save." : "Gemini is not configured, so fallback summary and tags will be used."}</p>
        {!canSave && <p className="text-rose-600">Configure Supabase before saving notes.</p>}
      </div>

      {message && <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
    </form>
  );
}
