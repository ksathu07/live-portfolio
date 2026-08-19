"use client";

import { profile } from "@/lib/profile";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function dateLabel(e: { startYear?: string | null; endYear?: string | null; startDate?: string | null; endDate?: string | null; present?: boolean }) {
  const end = e.present ? "Present" : (e.endYear ?? e.endDate ?? "");
  return `${e.startYear ?? e.startDate ?? ""}${end ? " — " + end : ""}`;
}

function TimelineItem({ item, index, side }: { item: (typeof profile.experience)[number]; index: number; side: "left" | "right" }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const isLeft = side === "left";

  return (
    <div
      ref={ref}
      className={`relative transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : isLeft ? "opacity-0 -translate-x-8" : "opacity-0 translate-x-8"}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="group relative">
        {/* Animated dot */}
        <div className="absolute -left-[31px] top-1.5 h-3 w-3">
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 animate-pulse" />
          <span className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
          <span className="absolute inset-[-4px] rounded-full border border-violet-400/0 group-hover:border-violet-400/50 scale-50 group-hover:scale-100 transition-all duration-500" />
        </div>

        <h3 className="font-display font-semibold text-white group-hover:text-gradient transition-all duration-300">
          {item.role}
        </h3>
        <p className="text-sm font-medium text-violet-300 group-hover:text-violet-200 transition-colors">
          {item.organization}
        </p>
        <p className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">{dateLabel(item)}</p>
        {((item.bullets ?? []).length > 0) && (
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-zinc-400">
            {(item.bullets ?? []).map((b, j) => (
              <li key={j} className="flex gap-2 group-hover:translate-x-0.5 transition-transform duration-300" style={{ transitionDelay: `${j * 50}ms` }}>
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-violet-400/60 group-hover:bg-violet-400 transition-colors" />
                <span className="group-hover:text-zinc-300 transition-colors">{b}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function EducationCard({ item, index }: { item: (typeof profile.education)[number]; index: number }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      <div className="glass rounded-2xl p-6 transition-all duration-500 group-hover:-translate-y-1 group-hover:border-violet-400/30 group-hover:bg-white/[0.06] group-hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,0.25)]">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display font-semibold text-white group-hover:text-gradient transition-all duration-300">
            {item.institution}
          </h3>
          {item.startYear && (
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-xs text-zinc-400 group-hover:border-cyan-400/30 group-hover:text-cyan-300 transition-all">
              {dateLabel(item)}
            </span>
          )}
        </div>
        <p className="mt-1.5 text-sm font-medium text-violet-300 group-hover:text-violet-200 transition-colors">
          {item.degree}
          {item.field ? ` — ${item.field}` : ""}
        </p>
        {item.grade && <p className="mt-2 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">{item.grade}</p>}
        {(item.details ?? []).length > 0 && (
          <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-zinc-400">
            {(item.details ?? []).map((d, j) => (
              <li key={j} className="flex gap-2 group-hover:translate-x-0.5 transition-transform duration-300">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-400/60 group-hover:bg-cyan-400 transition-colors" />
                <span className="group-hover:text-zinc-300 transition-colors">{d}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function Experience() {
  const experience = profile.experience ?? [];
  const education = profile.education ?? [];

  // Scroll-linked timeline: the line draws itself as you scroll (cinematic).
  const lineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: lineRef,
    offset: ["start 80%", "end 85%"],
  });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="pointer-events-none absolute right-0 bottom-0 h-[300px] w-[300px] rounded-full bg-violet-600/10 blur-[100px]" />

      <div className="relative">
        <p className="section-label">Timeline</p>
        <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Experience &amp; <span className="text-gradient">education</span>
        </h2>

        <div className="mt-12 grid gap-12 lg:grid-cols-2">
          {/* Experience timeline */}
          <div className="relative">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-6">Experience</h3>
            <div className="relative space-y-8 border-l-2 border-white/10 pl-7">
              {/* Scroll-linked line fill */}
              <div ref={lineRef} className="absolute left-[-2px] top-0 h-full w-0.5 bg-white/10">
                <motion.div
                  style={{ height: lineHeight }}
                  className="w-full bg-gradient-to-b from-violet-500 via-cyan-500 to-fuchsia-500 shadow-[0_0_12px_rgba(139,92,246,0.6)]"
                />
              </div>
              {experience.map((x, i) => (
                <TimelineItem key={i} item={x} index={i} side="left" />
              ))}
            </div>
          </div>

          {/* Education cards */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-6">Education</h3>
            <div className="space-y-5">
              {education.map((e, i) => (
                <EducationCard key={i} item={e} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
