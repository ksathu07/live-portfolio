"use client";

import { useEffect, useState } from "react";
import { videoPortfolio } from "@/lib/profile";

const baseLinks = [
  ["About", "#about"],
  ["Skills", "#skills"],
  ["Projects", "#projects"],
  ["Achievements", "#achievements"],
  ["Timeline", "#experience"],
  ["Contact", "#contact"],
] as const;

const links = videoPortfolio && videoPortfolio.items?.length > 0
  ? [
      ["About", "#about"],
      ["Skills", "#skills"],
      ["Projects", "#projects"],
      ["Video", "#video-portfolio"],
      ["Achievements", "#achievements"],
      ["Timeline", "#experience"],
      ["Contact", "#contact"],
    ] as const
  : baseLinks;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-white/10 bg-ink-950/80 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="font-display text-lg font-bold tracking-tight text-white">
          KS<span className="text-gold-400">.</span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="text-sm text-zinc-400 transition-colors hover:text-white"
            >
              {label}
            </a>
          ))}
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          className="rounded-md border border-white/10 p-2 text-zinc-300 md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-ink-950/95 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="text-sm text-zinc-300">
                {label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}