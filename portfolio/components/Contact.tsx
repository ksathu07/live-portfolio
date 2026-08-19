"use client";

import { profile } from "@/lib/profile";

const p = profile.profile;

export default function Contact() {
  const rows: { label: string; value: string; href: string; icon: string }[] = [];
  if (p.email) rows.push({ label: "Email", value: p.email, href: `mailto:${p.email}`, icon: "✉" });
  if (p.phone) rows.push({ label: "Phone", value: p.phone, href: `tel:${p.phone.replace(/\s/g, "")}`, icon: "📱" });
  if (p.links?.github) rows.push({ label: "GitHub", value: "ksathu07", href: p.links.github, icon: "⟡" });
  if (p.links?.linkedin) rows.push({ label: "LinkedIn", value: "sathursan-kamalanathan", href: p.links.linkedin, icon: "◈" });
  if (p.links?.instagram) rows.push({ label: "Instagram", value: "@sk_sathursan_07", href: p.links.instagram, icon: "◎" });

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold-600/15 blur-[120px]" />

      <div className="relative">
        <div className="glass relative overflow-hidden rounded-3xl p-10 sm:p-14">
          {/* Animated gradient orbs */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold-600/25 blur-3xl animate-pulse-glow" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-60 w-60 rounded-full bg-gold-400/20 blur-3xl animate-float-slow" />
          <div className="pointer-events-none absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-gold-600/15 blur-3xl animate-pulse-slow" />

          <div className="relative">
            <p className="section-label">Contact</p>
            <h2 className="font-display mt-4 max-w-xl text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Let&apos;s build something{" "}
              <span className="text-shimmer">real</span>
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-zinc-400">
              I answer every message. Reach out and let&apos;s create something amazing together.
            </p>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {rows.map((r, i) => (
                <a
                  key={r.label}
                  href={r.href}
                  target={r.href.startsWith("http") ? "_blank" : undefined}
                  rel={r.href.startsWith("http") ? "noreferrer" : undefined}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-500 hover:-translate-y-1 hover:border-gold-400/40 hover:bg-white/[0.08] hover:shadow-[0_20px_60px_-15px_rgba(212,175,55,0.3)]"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  {/* Hover glow */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold-500/5 to-gold-300/5" />

                  <div className="relative flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/20 text-gold-300 group-hover:bg-gold-500/30 group-hover:scale-110 transition-all duration-300">
                      {r.icon}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-zinc-500 group-hover:text-zinc-400 transition-colors">
                        {r.label}
                      </p>
                      <p className="mt-0.5 truncate text-sm text-zinc-200 group-hover:text-white transition-colors">
                        {r.value}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Decorative element */}
            <div className="mt-10 flex items-center gap-3 text-zinc-500">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="text-xs tracking-widest uppercase">Available for opportunities</span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
