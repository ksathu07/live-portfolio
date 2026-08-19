"use client";

import { projects, profile } from "@/lib/profile";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { useRef, useState, type MouseEvent } from "react";

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
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
          background: `radial-gradient(500px circle at ${glowPos.x}% ${glowPos.y}%, rgba(139,92,246,0.18), transparent 60%)`,
        }}
      />

      {/* Watermark number (cinematic) */}
      <span className="pointer-events-none absolute -top-8 right-2 select-none font-display text-[9rem] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-white/[0.08] to-transparent transition-all duration-500 group-hover:from-violet-400/20">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Corner brackets */}
      <span className="pointer-events-none absolute left-3 top-3 h-5 w-5 rounded-tl-lg border-l-2 border-t-2 border-violet-400/30 transition-colors duration-300 group-hover:border-violet-400/80" />
      <span className="pointer-events-none absolute right-3 top-3 h-5 w-5 rounded-tr-lg border-r-2 border-t-2 border-violet-400/30 transition-colors duration-300 group-hover:border-violet-400/80" />
      <span className="pointer-events-none absolute bottom-3 left-3 h-5 w-5 rounded-bl-lg border-b-2 border-l-2 border-violet-400/30 transition-colors duration-300 group-hover:border-violet-400/80" />
      <span className="pointer-events-none absolute bottom-3 right-3 h-5 w-5 rounded-br-lg border-b-2 border-r-2 border-violet-400/30 transition-colors duration-300 group-hover:border-violet-400/80" />

      <div className="relative glass flex flex-col gap-8 rounded-2xl p-8 transition-all duration-300 group-hover:border-violet-400/30 group-hover:bg-white/[0.06] md:flex-row md:items-center md:p-10">
        {/* Main content */}
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-bold text-violet-300">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-xl font-semibold text-white group-hover:text-gradient transition-all duration-300 md:text-2xl">
              {project.name}
            </h3>
            {project.year && (
              <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-zinc-400 group-hover:border-violet-400/30 group-hover:text-violet-300 transition-colors">
                {project.year}
              </span>
            )}
          </div>

          {project.tagline && (
            <p className="mt-2 text-sm text-violet-300/80 group-hover:text-violet-300 transition-colors">
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
                className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-zinc-400 group-hover:bg-violet-500/10 group-hover:text-violet-300 transition-all duration-300"
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
                className="animated-underline text-violet-300 hover:text-white transition-colors"
              >
                Code ↗
              </a>
            )}
            {project.links?.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noreferrer"
                className="animated-underline text-cyan-300 hover:text-white transition-colors"
              >
                Live demo ↗
              </a>
            )}
          </div>
        </div>

        {/* Metrics (all derived from profile.json — nothing invented) */}
        <div className="grid shrink-0 grid-cols-3 gap-6 border-t border-white/10 pt-5 text-center md:flex md:flex-col md:border-l md:border-t-0 md:pl-8 md:pt-0 md:text-left">
          <div>
            <p className="font-display text-2xl font-bold text-white">{project.tech.length}</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Tools</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-white">{project.year ?? "—"}</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Year</p>
          </div>
          <div>
            <p className="font-display text-2xl font-bold capitalize text-white">{statusLabel ?? "—"}</p>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500">Status</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="pointer-events-none absolute right-0 top-0 h-[300px] w-[300px] rounded-full bg-fuchsia-600/10 blur-[100px]" />

      <div className="relative">
        <p className="section-label">Projects</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
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

        <div className="mt-12">
          <ScrollStack
            itemDistance={110}
            itemScale={0.035}
            itemStackDistance={26}
            stackPosition="10%"
            scaleEndPosition="5%"
            blurAmount={1.5}
          >
            {projects.map((project, i) => (
              <ScrollStackItem key={project.id}>
                <ProjectCard project={project} index={i} />
              </ScrollStackItem>
            ))}
          </ScrollStack>
        </div>
      </div>
    </section>
  );
}
