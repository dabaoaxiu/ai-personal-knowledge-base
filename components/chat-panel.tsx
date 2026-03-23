"use client";

import { useState, type FormEvent } from "react";

import type { ChatMessage, ChatSource } from "@/types";

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content: "Ask me anything about your saved knowledge. I will answer from your notes first and say clearly when the knowledge base is missing context."
  }
];

export function ChatPanel({ canChat }: { canChat: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!question.trim()) {
      return;
    }

    const nextQuestion = question.trim();
    setQuestion("");
    setError(null);
    setIsSubmitting(true);
    setMessages((current) => [...current, { role: "user", content: nextQuestion }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: nextQuestion })
      });

      const payload = (await response.json()) as { answer?: string; sources?: ChatSource[]; error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "Gemini response failed. Please try again.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: payload.answer ?? "I could not prepare an answer just now.",
          sources: payload.sources ?? []
        }
      ]);
    } catch (submissionError) {
      setError(submissionError instanceof Error ? submissionError.message : "Gemini response failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-[32px] border border-stone-200 bg-white/90 p-6 shadow-soft">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-400">Grounded Chat</p>
          <h2 className="mt-2 font-serif text-3xl">Ask against your knowledge base</h2>
        </div>
        {!canChat && <p className="text-sm text-rose-600">Configure both Supabase and Gemini to enable chat.</p>}
      </div>

      <div className="mt-6 space-y-4 rounded-[28px] bg-stone-50 p-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={message.role === "user" ? "ml-auto max-w-2xl" : "mr-auto max-w-3xl"}
          >
            <div
              className={
                message.role === "user"
                  ? "rounded-[24px] rounded-br-md bg-ink px-4 py-3 text-sm leading-7 text-white"
                  : "rounded-[24px] rounded-bl-md border border-stone-200 bg-white px-4 py-3 text-sm leading-7 text-stone-700"
              }
            >
              {message.content}
            </div>

            {message.sources?.length ? (
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-stone-500">
                {message.sources.map((source) => (
                  <span key={source.id} className="rounded-full border border-stone-200 bg-white px-3 py-1">
                    Source: {source.title}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {isSubmitting && <p className="text-sm text-stone-500">Gemini is preparing an answer...</p>}
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3 md:flex-row">
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Example: What have I recently captured about positioning, interviews, and growth experiments?"
          disabled={!canChat || isSubmitting}
          className="min-h-[96px] flex-1 rounded-[24px] border border-stone-200 bg-stone-50 px-4 py-3 text-sm leading-7 text-ink outline-none transition focus:border-teal-500 focus:bg-white disabled:cursor-not-allowed disabled:bg-stone-100"
        />

        <button
          type="submit"
          disabled={!canChat || isSubmitting}
          className="h-12 rounded-2xl bg-ink px-6 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {isSubmitting ? "Thinking..." : "Ask"}
        </button>
      </form>

      {error && <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
    </div>
  );
}
