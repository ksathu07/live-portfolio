"use client";

import { profile } from "@/lib/profile";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent } from "react";

const p = profile.profile;

function AnimatedCounter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  );
}

export default function About() {
  const bullets = p.about ?? [];

  const stats = [
    { value: profile.projects?.length ?? 0, label: "Projects shipped", suffix: "+" },
    { value: profile.achievements?.length ?? 0, label: "Awards earned", suffix: "" },
    { value: profile.skills?.reduce((a, c) => a + c.items.length, 0) ?? 0, label: "Skills mastered", suffix: "+" },
    { value: profile.experience?.length ?? 0, label: "Leadership & roles", suffix: "" },
  ];

  // 3D tilt + spotlight (ported from the cinematic reference)
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const spotlightX = useMotionValue(200);
  const spotlightY = useMotionValue(200);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { damping: 18, stiffness: 220 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { damping: 18, stiffness: 220 });

  const spotlightBg = useTransform(
    [spotlightX, spotlightY],
    ([x, y]) =>
      `radial-gradient(circle 260px at ${x}px ${y}px, rgba(212,175,55,0.22), rgba(247,231,196,0.1), transparent 80%)`
  );

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    spotlightX.set(e.clientX - rect.left);
    spotlightY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section id="about" className="relative mx-auto max-w-6xl px-6 py-28">
      {/* Background accent */}
      <div className="pointer-events-none absolute right-0 top-1/2 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-gold-600/10 blur-[100px]" />

      <div className="relative">
        <p className="section-label">About</p>
        <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Curiosity, creativity, <span className="text-gradient">code</span>
        </h2>

        <div className="mt-10 grid gap-12 lg:grid-cols-5">
          {/* Bio text */}
          <div className="space-y-5 leading-relaxed text-zinc-400 lg:col-span-3">
            {bullets.map((b, i) => (
              <p
                key={i}
                className="transition-all duration-500 hover:text-zinc-300 hover:translate-x-1"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {b}
              </p>
            ))}
            <div className="flex flex-wrap gap-3 pt-4">
              {p.links?.github && (
                <a href={p.links.github} target="_blank" rel="noreferrer" className="status-pill group">
                  GitHub
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
                </a>
              )}
              {p.links?.linkedin && (
                <a href={p.links.linkedin} target="_blank" rel="noreferrer" className="status-pill group">
                  LinkedIn
                  <span className="transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
                </a>
              )}
            </div>
          </div>

          {/* Animated stats grid — 3D tilt card with cursor spotlight */}
          <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative lg:col-span-2"
            style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 800 }}
          >
            <motion.div
              className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{ background: spotlightBg }}
            />
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="glass group rounded-2xl p-5 transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/30 hover:bg-white/[0.06]"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <p className="font-display text-3xl font-bold text-white group-hover:text-gradient transition-all duration-300">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1.5 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
