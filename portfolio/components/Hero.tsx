import { profile } from "@/lib/profile";

const p = profile.profile;

export default function Hero() {
  const facts = [
    p.location ?? "",
    profile.education?.[0]?.institution ?? "Student",
    `${profile.projects?.length ?? 0} projects shipped`,
  ].filter(Boolean);

  return (
    <section id="top" className="relative flex min-h-[92vh] items-center overflow-hidden pt-24">
      <div className="pointer-events-none absolute -left-24 top-10 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl animate-float [animation-delay:2s]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-fuchsia-600/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <div className="max-w-3xl animate-fade-in">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs tracking-wide text-zinc-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {p.headline}
          </p>
          <h1 className="font-display text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            {p.name.split(" ")[0]}{" "}
            <span className="text-gradient">{p.name.split(" ").slice(1).join(" ")}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-relaxed text-zinc-400">{p.tagline}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {p.links?.github && (
              <a href={p.links.github} target="_blank" rel="noreferrer" className="status-pill">
                GitHub ↗
              </a>
            )}
            {p.links?.linkedin && (
              <a href={p.links.linkedin} target="_blank" rel="noreferrer" className="status-pill">
                LinkedIn ↗
              </a>
            )}
            {p.email && (
              <a href={`mailto:${p.email}`} className="status-pill">
                Email me
              </a>
            )}
          </div>

          <div className="mt-10 flex flex-wrap gap-8 text-sm text-zinc-400">
            {facts.map((f) => (
              <span key={f} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" />
                {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-bounce text-zinc-600 md:block">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}