"use client";

import { certifications, proof } from "@/lib/profile";
import { useEffect, useRef, useState } from "react";

function CertCard({ cert, index }: { cert: (typeof certifications)[number]; index: number }) {
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

  const proofRec = cert.proof?.id ? proof[cert.proof.id] : null;
  const proofHref = proofRec?.path ? `/proof/${proofRec.path}` : null;
  const meta = [cert.issuer, cert.date ?? cert.year].filter(Boolean).join(" · ");

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl transition-all duration-700 ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-2xl border border-transparent bg-gradient-to-r from-gold-500/30 via-gold-400/30 to-gold-600/30" />
      </div>

      <div className="relative glass flex items-center gap-5 rounded-2xl p-5 transition-all duration-300 group-hover:bg-white/[0.06] group-hover:translate-x-1">
        <div className="relative shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-gold-400 to-gold-200 text-lg shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
            🎓
          </div>
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold-400 to-gold-200 opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-300" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white group-hover:text-gradient transition-all duration-300">
            {cert.title}
          </h3>
          {meta && (
            <p className="mt-1 text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
              {meta}
            </p>
          )}
        </div>

        {proofHref && (
          <a
            href={proofHref}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400 group-hover:border-gold-400/30 group-hover:text-gold-300 transition-all"
          >
            View certificate ↗
          </a>
        )}
      </div>
    </div>
  );
}

export default function Certifications() {
  const certs = certifications;

  if (certs.length === 0) return null;

  return (
    <section id="certifications" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="pointer-events-none absolute right-1/4 top-0 h-[250px] w-[250px] rounded-full bg-gold-500/10 blur-[100px]" />

      <div className="relative">
        <p className="section-label">Certifications</p>
        <h2 className="font-display mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
          Courses &amp; <span className="text-gradient">credentials</span>
        </h2>

        <div className="mt-12 space-y-4">
          {certifications.map((cert, i) => (
            <CertCard key={i} cert={cert} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}