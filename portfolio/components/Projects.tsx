import { projects, profile } from "@/lib/profile";
import Reveal from "./Reveal";

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className="glass card-hover flex h-full flex-col rounded-2xl p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-xl font-semibold text-white">{project.name}</h3>
        {project.year && <span className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-400">{project.year}</span>}
      </div>
      {project.tagline && <p className="mt-1 text-sm text-violet-300/80">{project.tagline}</p>}
      <p className="mt-3 flex-1 leading-relaxed text-zinc-400">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech.map((t) => (
          <span key={t} className="rounded-md bg-white/5 px-2.5 py-1 text-xs text-zinc-400">{t}</span>
        ))}
      </div>
      <div className="mt-5 flex gap-4 text-sm">
        {project.links?.demo && (
          <a href={project.links.demo} target="_blank" rel="noreferrer" className="text-violet-300 transition-colors hover:text-white">
            Live demo ↗
          </a>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <p className="section-label">Projects</p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-4xl">Things I build</h2>
          {profile.profile.links?.github && (
            <a href={profile.profile.links.github} target="_blank" rel="noreferrer" className="text-sm text-zinc-400 underline-offset-4 hover:text-white hover:underline">
              See all on GitHub ↗
            </a>
          )}
        </div>
      </Reveal>

      <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={(i % 3) * 70}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}