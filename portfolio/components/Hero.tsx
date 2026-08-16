"use client";

import { profile, proof } from "@/lib/profile";
import { useEffect, useState } from "react";

const p = profile.profile;

// First image-kind proof record (e.g. a profile photo) — fully data-driven.
const avatarProof = Object.values(proof).find((r) => r.kind === "image" && r.path);

function Particle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  return (
    <div
      className="absolute rounded-full bg-violet-400/30 animate-particle-float"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${delay}s`,
      }}
    />
  );
}

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Facts come from the SSOT (profile.facts); fall back to computed ones if empty.
  const ssotFacts = p.facts ?? [];
  const facts = ssotFacts.length
    ? ssotFacts.map((f) => `${f.label}: ${f.value}`)
    : [
        p.location ?? "",
        profile.education?.[0]?.institution ?? "Student",
        `${profile.projects?.length ?? 0} projects shipped`,
      ].filter(Boolean);

  const particles = [
    { delay: 0, x: 15, y: 20, size: 4 },
    { delay: 1.5, x: 80, y: 15, size: 3 },
    { delay: 0.8, x: 70, y: 70, size: 5 },
    { delay: 2, x: 25, y: 80, size: 3 },
    { delay: 0.5, x: 50, y: 30, size: 4 },
    { delay: 1.2, x: 90, y: 50, size: 3 },
    { delay: 2.5, x: 10, y: 60, size: 4 },
    { delay: 0.3, x: 60, y: 85, size: 3 },
    { delay: 1.8, x: 35, y: 45, size: 5 },
    { delay: 0.7, x: 85, y: 35, size: 4 },
  ];

  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-24">
      {/* Animated gradient orbs */}
      <div className="pointer-events-none absolute -left-32 top-10 h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-[100px] animate-pulse-glow" />
      <div className="pointer-events-none absolute right-0 top-40 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[100px] animate-float-slow [animation-delay:2s]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[60rem] -translate-x-1/2 rounded-full bg-fuchsia-600/10 blur-[100px] animate-pulse-slow" />
      <div className="pointer-events-none absolute left-1/3 top-1/4 h-[200px] w-[200px] rounded-full bg-cyan-400/10 blur-[80px] animate-float-reverse" />

      {/* Floating particles */}
      {particles.map((pt, i) => (
        <Particle key={i} {...pt} />
      ))}

      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.3) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center">
          {/* Avatar photo (from proof map, if any) */}
          {avatarProof && (
            <div
              className={`shrink-0 transition-all duration-1000 delay-100 ${mounted ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyan-400 via-violet-500 to-fuchsia-500 opacity-70 blur-md animate-pulse-glow" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/proof/${avatarProof.path}`}
                  alt={avatarProof.label ?? "Profile photo"}
                  className="relative h-40 w-40 rounded-full border-2 border-white/20 object-cover sm:h-48 sm:w-48 lg:h-56 lg:w-56"
                />
              </div>
            </div>
          )}

        <div className="max-w-3xl">
          {/* Status badge */}
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-wide text-zinc-300 backdrop-blur-sm transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </span>
            {p.headline}
          </div>

          {/* Main heading with staggered animation */}
          <h1
            className={`font-display text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl transition-all duration-1000 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="inline-block animate-fade-in-left">{p.name.split(" ")[0]}</span>{" "}
            <span className="inline-block text-gradient animate-fade-in-right [animation-delay:0.3s]">
              {p.name.split(" ").slice(1).join(" ")}
            </span>
          </h1>

          {/* Tagline with typewriter-like reveal */}
          <p
            className={`mt-6 max-w-2xl text-xl leading-relaxed text-zinc-400 transition-all duration-1000 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            {p.tagline}
          </p>

          {/* CTA buttons */}
          <div
            className={`mt-8 flex flex-wrap gap-3 transition-all duration-1000 delay-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            {p.links?.github && (
              <a
                href={p.links.github}
                target="_blank"
                rel="noreferrer"
                className="status-pill group"
              >
                <span>GitHub</span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
              </a>
            )}
            {p.links?.linkedin && (
              <a
                href={p.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="status-pill group"
              >
                <span>LinkedIn</span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
              </a>
            )}
            {p.email && (
              <a
                href={`mailto:${p.email}`}
                className="status-pill group"
              >
                <span>Email me</span>
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
              </a>
            )}
          </div>

          {/* Facts row */}
          <div
            className={`mt-10 flex flex-wrap gap-8 text-sm text-zinc-400 transition-all duration-1000 delay-[900ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            {facts.map((f, i) => (
              <span
                key={f}
                className="flex items-center gap-2.5 group"
                style={{ animationDelay: `${1 + i * 0.15}s` }}
              >
                <span className="relative h-2 w-2">
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 animate-pulse" />
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 blur-sm opacity-60" />
                </span>
                <span className="transition-colors duration-300 group-hover:text-zinc-200">{f}</span>
              </span>
            ))}
          </div>
        </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block">
        <div className="flex flex-col items-center gap-2 text-zinc-500">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="relative h-8 w-5 rounded-full border border-zinc-600 p-1">
            <div className="h-1.5 w-1 rounded-full bg-violet-400 animate-bounce mx-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}
