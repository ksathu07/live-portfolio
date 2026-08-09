"use client";

import { profile } from "@/lib/profile";
import { useEffect, useRef, useState } from "react";

const BADGE_COLORS = [
  "from-amber-400 to-yellow-300",
  "from-zinc-300 to-zinc-100",
  "from-orange-400 to-amber-300",
  "from-violet-400 to-fuchsia-300",
  "from-cyan-400 to-blue-300",
];

function AchievementCard({ ach, index }: { ach: (typeof profile.achievements)[number]; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Animated gradient border on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-violet-500/30 via-cyan-500/30 to-fuchsia-500/30" />
      </div>

      <div className="relative glass flex items-center gap-5 rounded-2xl p-5 transition-all duration-300 group-hover:bg-white/[0.06] group-hover:translate-x-1">
        {/* Animated badge */}
        <div className="relative shrink-0">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${BADGE_COLORS[index % BADGE_COLORS.length]} text-lg shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
            {index < 3 ? ["🥇", "🥈", "🥉"][index] : "⭐"}
          </div>
          <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${BADGE_COLORS[index % BADGE_COLORS.length]} opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300`} />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white group-hover:text-gradient transition-all duration-300">
            {ach.title}
          </h3>
          {ach.details && (
            <p className="mt-1 text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors line-clamp-2">
              {ach.details}
            </p>
          )}
        </div>

        {ach.date && (
          <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400 group-hover:border-violet-400/30 group-hover:text-violet-300 transition-all">
            {ach.date}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Achievements() {
  const achievements = profile.achievements ?? [];

  return (
    <section id="achievements" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="pointer-events-none absolute left-1/4 top-0 h-[250px] w-[250px] rounded-full bg-amber-500/10 blur-[100px]" />

      <div className="relative">
        <p className="section-label">Achievements</p>
        <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Highlights &amp; <span className="text-gradient">recognition</span>
        </h2>

        <div className="mt-12 space-y-4">
          {achievements.map((ach, i) => (
            <AchievementCard key={i} ach={ach} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
