"use client";

import { profile } from "@/lib/profile";

const LEVEL_DOT: Record<string, string> = {
  beginner: "bg-zinc-400",
  learning: "bg-cyan-400",
  intermediate: "bg-violet-400",
  advanced: "bg-fuchsia-400",
};

// Asymmetric bento spans (7/5 rhythm like the cinematic reference).
const SPANS = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"];

// Badge derived purely from the data — no invented claims.
function deriveBadge(items: { level?: string | null }[]): string {
  const levels = items.map((i) => i.level).filter(Boolean) as string[];
  if (!levels.length) return "SKILLS";
  if (levels.every((l) => l === "advanced")) return "ADVANCED";
  if (levels.some((l) => l === "advanced")) return "MIXED";
  return "FOUNDATION";
}

export default function Skills() {
  const categories = profile.skills ?? [];

  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="pointer-events-none absolute left-0 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />

      <div className="relative">
        <p className="section-label">Skills</p>
        <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Tools of the <span className="text-gradient">trade</span>
        </h2>

        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          {categories.map((cat, i) => (
            <div
              key={cat.category}
              className={`glass rounded-2xl p-7 transition-all duration-500 hover:-translate-y-2 hover:border-violet-400/30 hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,0.25)] ${SPANS[i % SPANS.length]}`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 animate-pulse" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-300">
                    {cat.category}
                  </h3>
                </div>
                <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-0.5 text-[10px] tracking-widest text-zinc-400">
                  {deriveBadge(cat.items)}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item.name}
                    className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-zinc-300 transition-all duration-300 hover:bg-violet-500/10 hover:text-white"
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${LEVEL_DOT[item.level ?? ""] ?? "bg-violet-400"}`}
                    />
                    {item.name}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-4">
                <span className="font-display text-2xl font-bold text-white">{cat.items.length}</span>
                <span className="text-[10px] uppercase tracking-widest text-zinc-500">tools</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
