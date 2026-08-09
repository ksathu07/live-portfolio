import { profile } from "@/lib/profile";
import Reveal from "./Reveal";

export default function Skills() {
  const categories = profile.skills ?? [];
  return (
    <section id="skills" className="relative mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <p className="section-label">Skills</p>
        <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-4xl">Tools of the trade</h2>
      </Reveal>

      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, i) => (
          <Reveal key={cat.category} delay={i * 60}>
            <div className="glass h-full rounded-2xl p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-violet-300">{cat.category}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {cat.items.map((item) => (
                  <span
                    key={item.name}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-zinc-300"
                    title={item.level ?? undefined}
                  >
                    {item.name}
                    {item.level && <span className="ml-1.5 text-xs text-zinc-500">· {item.level}</span>}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}