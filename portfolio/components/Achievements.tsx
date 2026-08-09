import { profile } from "@/lib/profile";
import Reveal from "./Reveal";

const medals = ["🥇", "🥈", "🥉"];

export default function Achievements() {
  const achievements = profile.achievements ?? [];
  return (
    <section id="achievements" className="relative mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <p className="section-label">Achievements</p>
        <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-4xl">
          Highlights &amp; recognition
        </h2>
      </Reveal>

      <div className="mt-10 space-y-4">
        {achievements.map((ach, i) => (
          <Reveal key={i} delay={i * 50}>
            <div className="glass flex flex-col gap-2 rounded-2xl p-5 sm:flex-row sm:items-center sm:gap-6">
              <span className="text-2xl">{medals[i] ?? "⭐"}</span>
              <div className="flex-1">
                <h3 className="font-medium text-white">{ach.title}</h3>
                {ach.details && <p className="mt-1 text-sm leading-relaxed text-zinc-400">{ach.details}</p>}
              </div>
              {ach.date && (
                <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">{ach.date}</span>
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}