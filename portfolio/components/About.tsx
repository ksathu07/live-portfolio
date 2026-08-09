import { profile } from "@/lib/profile";

const p = profile.profile;

export default function About() {
  const bullets = p.about ?? [];
  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-24">
      <p className="section-label">About</p>
      <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-4xl">Curiosity, creativity, code</h2>
      <div className="mt-8 grid gap-10 lg:grid-cols-5">
        <div className="space-y-5 leading-relaxed text-zinc-400 lg:col-span-3">
          {bullets.map((b, i) => (
            <p key={i}>{b}</p>
          ))}
          <div className="flex flex-wrap gap-3 pt-3">
            {p.links?.github && <a href={p.links.github} target="_blank" rel="noreferrer" className="status-pill">GitHub&nbsp;↗</a>}
            {p.links?.linkedin && <a href={p.links.linkedin} target="_blank" rel="noreferrer" className="status-pill">LinkedIn&nbsp;↗</a>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-2">
          <div className="glass rounded-2xl p-5">
            <p className="font-display text-3xl font-bold text-white">{p.facts?.[0]?.value ?? "AI & ML"}</p>
            <p className="mt-1 text-sm text-zinc-400">{p.facts?.[0]?.label ?? "B.Tech CSE specialization"}</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="font-display text-3xl font-bold text-white">{p.facts?.[1]?.value ?? "Learner"}</p>
            <p className="mt-1 text-sm text-zinc-400">{p.facts?.[1]?.label ?? "Self-driving & research"}</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="font-display text-3xl font-bold text-white">{p.facts?.[2]?.value ?? "Creator"}</p>
            <p className="mt-1 text-sm text-zinc-400">{p.facts?.[2]?.label ?? "Design, media, video"}</p>
          </div>
          <div className="glass rounded-2xl p-5">
            <p className="font-display text-3xl font-bold text-white">{p.facts?.[3]?.value ?? "Leader"}</p>
            <p className="mt-1 text-sm text-zinc-400">{p.facts?.[3]?.label ?? "Captains, prefects"}</p>
          </div>
        </div>
      </div>
    </section>
  );
}