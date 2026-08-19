"use client";

import { projects, profile } from "@/lib/profile";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { useEffect, useState, useRef, type MouseEvent } from "react";

// Only the first N projects form the cinematic stack; the rest render in a
// compact grid. Keeps the stack within the viewport so it never overlaps the
// next section.
const FEATURED_COUNT = 5;

// Importance ranking — purely data-driven (status weight + tech count + year).
// Nothing hardcoded: complete > in-development > prototype, more tech = bigger.
const STATUS_WEIGHT: Record<string, number> = { complete: 3, "in-development": 2, prototype: 1 };

function importance(p: (typeof projects)[number]): number {
  const status = STATUS_WEIGHT[p.status ?? "prototype"] ?? 1;
  const tech = p.tech?.length ?? 0;
  const year = parseInt(p.year ?? "0", 10) || 0;
  return status * 1000 + tech * 10 + year;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

// Large cinematic card used in the featured stack.
function FeaturedCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  const statusLabel = project.status ? project.status.replace("-", " ") : null;

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setGlowPos({ x: 50, y: 50 })}
      className="group relative overflow-hidden rounded-2xl"
    >
      {/* Glow following cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(500px circle at ${glowPos.x}% ${glowPos.y}%, rgba(212,175,55,0.15), transparent 60%)`,
        }}
      />

      {/* Watermark number (cinematic) */}
      <span className="pointer-events-none absolute -top-8 right-2 select-none font-display text-[9rem] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-gold-200/10 to-transparent transition-all duration-500 group-hover:from-gold-400/25">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Corner brackets */}
      <span className="pointer-events-none absolute left-3 top-3 h-5 w-5 rounded-tl-lg border-l-2 border-t-2 border-gold-400/30 transition-colors duration-300 group-hover:border-gold-400/80" />
      <span className="pointer-events-none absolute right-3 top-3 h-5 w-5 rounded-tr-lg border-r-2 border-t-2 border-gold-400/30 transition-colors duration-300 group-hover:border-gold-400/80" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 rounded-bl-lg border-b-2 border-l-2 border-gold-400/30 transition-colors duration-300 group-hover:border-gold-400/80" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 rounded-br-lg border-b-2 border-r-2 border-gold-400/30 transition-colors duration-300 group-hover:border-gold-400/80" />

      <div className="relative glass flex flex-col gap-8 rounded-2xl p-8 transition-all duration-300 group-hover:border-gold-400/30 group-hover:bg-white/[0.06] md:flex-row md:items-center md:p-10">
        {/* Main content */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold-500/20 text-xs font-bold text-gold-300">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-2xl font-bold uppercase tracking-wide text-white group-hover:text-gradient transition-all duration-300">
              {project.name}
            </h3>
            {project.year && (
              <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-zinc-400 group-hover:border-gold-400/30 group-hover:text-gold-300 transition-colors">
                {project.year}
              </span>
            )}
          </div>

          {project.tagline && (
            <p className="mt-2 text-sm text-gold-300/80 group-hover:text-gold-300 transition-colors">
              {project.tagline}
            </p>
          )}

          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.slice(0, 6).map((t) => (
              <span
                key={t}
                className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-zinc-400 group-hover:bg-gold-500/10 group-hover:text-gold-300 transition-all duration-300"
              >
                {t}
              </span>
            ))}
            {project.tech.length > 6 && (
              <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-zinc-500">
                +{project.tech.length - 6}
              </span>
            )}
          </div>

          {/* Links */}
          <div className="mt-5 flex gap-4 text-sm">
            {project.links?.repo && (
              <a
                href={project.links.repo}
                target="_blank"
                rel="noreferrer"
                className="animated-underline text-gold-300 hover:text-white transition-colors"
              >
                Code ↗
              </a>
            )}
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className="animated-underline text-gold-200 hover:text-white transition-colors"
              >
                Live demo ↗
              </a>
            )}
          </div>
        </div>

        {/* Metrics (all derived from profile.json — nothing invented) */}
        <div className="grid shrink-0 grid-cols-3 gap-6 border-t border-white/10 pt-5 text-center md:flex md:flex-col md:border-l md:border-t-0 md:pl-8 md:pt-0 md:text-left">
          <div>
            <p className="font-display text-3xl font-bold text-gold-300">{project.tech.length}</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Tools</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-gold-300">{project.year ?? "—"}</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Year</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold uppercase text-gold-300">{statusLabel ?? "—"}</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Status</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact card for the "more projects" grid (and the whole list on mobile).
function CompactCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  return (
    <div className="group relative h-full overflow-hidden rounded-2xl">
      {/* Watermark number */}
      <span className="pointer-events-none absolute -top-4 right-3 select-none font-display text-7xl font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-gold-200/10 to-transparent">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative glass flex h-full flex-col rounded-2xl p-6 transition-all duration-300 group-hover:border-gold-400/30 group-hover:bg-white/[0.06] group-hover:shadow-[0_20px_60px_-15px_rgba(212,175,55,0.25)]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gold-500/20 text-xs font-bold text-gold-300">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white group-hover:text-gradient transition-all duration-300">
              {project.name}
            </h3>
          </div>
          {project.year && (
            <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-zinc-400 group-hover:border-gold-400/30 group-hover:text-gold-300 transition-colors">
              {project.year}
            </span>
          )}
        </div>

        {project.tagline && (
          <p className="mt-2 text-sm text-gold-300/80 group-hover:text-gold-300 transition-colors">
            {project.tagline}
          </p>
        )}

        <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
          {project.description}
        </p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 5).map((t) => (
            <span
              key={t}
              className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-zinc-400 group-hover:bg-gold-500/10 group-hover:text-gold-300 transition-all duration-300"
            >
              {t}
            </span>
          ))}
          {project.tech.length > 5 && (
            <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-zinc-500">
              +{project.tech.length - 5}
            </span>
          )}
        </div>

        <div className="mt-5 flex gap-4 text-sm">
          {project.links?.repo && (
            <a
              href={project.links.repo}
              target="_blank"
              rel="noreferrer"
              className="animated-underline text-gold-300 hover:text-white transition-colors"
            >
              Code ↗
            </a>
          )}
          {project.links?.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noreferrer"
              className="animated-underline text-gold-200 hover:text-white transition-colors"
            >
              Live demo ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const isMobile = useIsMobile();
  const ranked = [...projects].sort((a, b) => importance(b) - importance(a));
  // Explicitly featured projects (SSOT order) ARE the stack — the owner curates
  // it directly. Only when nothing is flagged do we fall back to ranking.
  const flagged = projects.filter((p) => p.featured);
  const featured = flagged.length > 0 ? flagged.slice(0, FEATURED_COUNT) : ranked.slice(0, FEATURED_COUNT);
  const rest = ranked.filter((p) => !featured.includes(p));

  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="pointer-events-none absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-gold-600/10 blur-[100px]" />

      <div className="relative">
        <p className="section-label">Projects</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display mt-4 text-3xl font-bold uppercase tracking-wide text-white sm:text-4xl lg:text-5xl">
            Things I <span className="text-gradient">build</span>
          </h2>
          {profile.profile.links?.github && (
            <a
              href={profile.profile.links.github}
              target="_blank"
              rel="noreferrer"
              className="animated-underline text-sm text-zinc-400 hover:text-white transition-colors"
            >
              See all on GitHub ↗
            </a>
          )}
        </div>

        {isMobile ? (
          /* Mobile: no stack — cards are too tall to pile within a half viewport */
          <div className="mt-12 grid gap-5">
            {ranked.map((p, i) => (
              <CompactCard key={p.id} project={p} index={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="mt-12">
              <ScrollStack
                itemDistance={110}
                itemScale={0.025}
                itemStackDistance={72}
                stackPosition={76}
                scaleEndPosition={48}
                blurAmount={1.5}
              >
                {featured.map((p, i) => (
                  <ScrollStackItem key={p.id}>
                    <FeaturedCard project={p} index={i} />
                  </ScrollStackItem>
                ))}
              </ScrollStack>
            </div>

            {rest.length > 0 && (
              <div id="more-projects" className="mt-16">
                <p className="mb-6 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">
                  More projects
                </p>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p, i) => (
                    <CompactCard key={p.id} project={p} index={FEATURED_COUNT + i} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
