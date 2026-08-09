import { profile } from "@/lib/profile";
import Reveal from "./Reveal";

function dateLabel(e: { startYear?: string | null; endYear?: string | null; startDate?: string | null; endDate?: string | null; present?: boolean }) {
  const end = e.present ? "Present" : (e.endYear ?? e.endDate ?? "");
  return `${e.startYear ?? e.startDate ?? ""}${end ? " — " + end : ""}`;
}

export default function Experience() {
  const experience = profile.experience ?? [];
  const education = profile.education ?? [];
  return (
    <section id="experience" className="relative mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <p className="section-label">Timeline</p>
        <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-4xl">
          Experience &amp; education
        </h2>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="relative space-y-6 border-l border-white/10 pl-6">
          {experience.map((x, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="relative">
                <span className="absolute -left-[31px] top-1 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" />
                <h3 className="font-display font-semibold text-white">{x.role}</h3>
                <p className="text-sm font-medium text-violet-300">{x.organization}</p>
                <p className="text-xs text-zinc-500">{dateLabel(x)}</p>
                {((x.bullets ?? []).length > 0) && (
                  <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-zinc-400">
                    {(x.bullets ?? []).map((b, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-400/60" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="space-y-6">
          {education.map((e, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display font-semibold text-white">{e.institution}</h3>
                <p className="mt-1 text-sm font-medium text-violet-300">
                  {e.degree}
                  {e.field ? ` — ${e.field}` : ""}
                </p>
                <p className="mt-1 text-xs text-zinc-500">{dateLabel(e)}</p>
                {e.grade && <p className="mt-2 text-sm text-zinc-400">{e.grade}</p>}
                {(e.details ?? []).length > 0 && (
                  <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-zinc-400">
                    {(e.details ?? []).map((d, j) => (
                      <li key={j} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/60" />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}