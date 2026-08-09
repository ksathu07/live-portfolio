"use client";

import { profile } from "@/lib/profile";
import { useEffect, useRef, useState } from "react";

const LEVEL_WIDTH: Record<string, number> = {
  beginner: 30,
  learning: 45,
  intermediate: 65,
  advanced: 85,
};

const LEVEL_COLOR: Record<string, string> = {
  beginner: "from-zinc-500 to-zinc-400",
  learning: "from-cyan-400 to-cyan-300",
  intermediate: "from-violet-500 to-violet-400",
  advanced: "from-fuchsia-500 to-fuchsia-400",
};

function SkillBar({ name, level, delay }: { name: string; level?: string | null; delay: number }) {
  const width = level ? LEVEL_WIDTH[level] ?? 50 : 50;
  const color = level ? LEVEL_COLOR[level] ?? "from-violet-500 to-violet-400" : "from-violet-500 to-violet-400";
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), delay);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className="group">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{name}</span>
        {level && (
          <span className="text-xs text-zinc-500 capitalize opacity-0 group-hover:opacity-100 transition-opacity">
            {level}
          </span>
        )}
      </div>
      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000 ease-out`}
          style={{ width: animated ? `${width}%` : "0%" }}
        />
      </div>
    </div>
  );
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

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <div
              key={cat.category}
              className="glass rounded-2xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-violet-400/30 hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,0.25)]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="h-2 w-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 animate-pulse" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-300">
                  {cat.category}
                </h3>
              </div>
              <div className="space-y-3.5">
                {cat.items.map((item, j) => (
                  <SkillBar
                    key={item.name}
                    name={item.name}
                    level={item.level}
                    delay={i * 100 + j * 60}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
