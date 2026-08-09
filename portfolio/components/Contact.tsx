import { profile } from "@/lib/profile";
import Reveal from "./Reveal";

export default function Contact() {
  const p = profile.profile;
  const rows: { label: string; value: string; href: string }[] = [];
  if (p.email) rows.push({ label: "Email", value: p.email, href: `mailto:${p.email}` });
  if (p.phone) rows.push({ label: "Phone", value: p.phone, href: `tel:${p.phone.replace(/\s/g, "")}` });
  for (const key of ["github", "linkedin", "instagram", "website"] as const) {
    const href = p.links?.[key];
    if (href) rows.push({ label: key[0].toUpperCase() + key.slice(1), value: href, href });
  }

  return (
    <section id="contact" className="relative mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <div className="glass relative overflow-hidden rounded-3xl p-10 sm:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-600/25 blur-3xl" />
          <p className="section-label">Contact</p>
          <h2 className="font-display mt-4 max-w-xl text-3xl font-bold text-white sm:text-4xl">
            Let&apos;s build something <span className="text-gradient">real</span>
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-zinc-400">
            {p.tagline && `Reach out — `}I answer every message.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {rows.map((r) => (
              <a
                key={r.label}
                href={r.href}
                target={r.href.startsWith("http") ? "_blank" : undefined}
                rel={r.href.startsWith("http") ? "noreferrer" : undefined}
                className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition-colors hover:border-violet-400/40"
              >
                <p className="text-xs uppercase tracking-wider text-zinc-500">{r.label}</p>
                <p className="mt-1 truncate text-sm text-zinc-200 group-hover:text-white">{r.value}</p>
              </a>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}