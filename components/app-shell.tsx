import type { ReactNode } from "react";

import { NavLink } from "@/components/nav-link";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-paper text-ink">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(205,215,197,0.8),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(232,220,200,0.8),_transparent_30%),linear-gradient(180deg,_rgba(255,255,255,0.95),_rgba(248,245,239,0.92))]" />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-14 pt-6 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-20 mb-10 rounded-[28px] border border-white/60 bg-white/75 px-5 py-4 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-stone-400">AI Personal Knowledge Base</p>
              <h1 className="mt-2 font-serif text-3xl">Turn scattered notes into a searchable second brain.</h1>
            </div>

            <nav className="flex flex-wrap gap-2">
              <NavLink href="/" label="Dashboard" />
              <NavLink href="/library" label="Library" />
              <NavLink href="/assistant" label="AI Assistant" />
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
