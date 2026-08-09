"use client";

import { projects, profile } from "@/lib/profile";
import { useRef, useState, type MouseEvent } from "react";

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (y - 0.5) * -8,
      y: (x - 0.5) * 8,
    });
    setGlowPos({ x: x * 100, y: y * 100 });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
    setGlowPos({ x: 50, y: 50 });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative h-full rounded-2xl transition-all duration-300 ease-out"
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out, box-shadow 0.3s ease-out",
      }}
    >
      {/* Glow effect following cursor */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(400px circle at ${glowPos.x}% ${glowPos.y}%, rgba(139,92,246,0.15), transparent 60%)`,
        }}
      />

      <div className="relative glass h-full flex flex-col rounded-2xl p-6 transition-all duration-300 group-hover:border-violet-400/30 group-hover:bg-white/[0.06] group-hover:shadow-[0_25px_60px_-15px_rgba(139,92,246,0.3)]">
        {/* Year badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-500/20 text-xs font-bold text-violet-300">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-lg font-semibold text-white group-hover:text-gradient transition-all duration-300">
              {project.name}
            </h3>
          </div>
          {project.year && (
            <span className="shrink-0 rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-zinc-400 group-hover:border-violet-400/30 group-hover:text-violet-300 transition-colors">
              {project.year}
            </span>
          )}
        </div>

        {project.tagline && (
          <p className="mt-2 text-sm text-violet-300/80 group-hover:text-violet-300 transition-colors">
            {project.tagline}
          </p>
        )}

        <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400 group-hover:text-zinc-300 transition-colors">
          {project.description}
        </p>

        {/* Tech stack */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 5).map((t) => (
            <span
              key={t}
              className="rounded-md bg-white/5 px-2 py-0.5 text-xs text-zinc-400 group-hover:bg-violet-500/10 group-hover:text-violet-300 transition-all duration-300"
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

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
