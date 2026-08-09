import { profile } from "@/lib/profile";

const p = profile.profile;

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-12 overflow-hidden">
      {/* Animated gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-3 text-sm text-zinc-500">
            <span className="font-display font-bold text-white">
              KS<span className="text-violet-400">.</span>
            </span>
            <span className="text-zinc-600">|</span>
            <p>
              © {new Date().getFullYear()} {p.name}. Built with{" "}
              <span className="text-gradient">CLARA</span>.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {p.links?.github && (
              <a
                href={p.links.github}
                target="_blank"
                rel="noreferrer"
                className="animated-underline text-sm text-zinc-500 hover:text-white transition-colors"
              >
                GitHub
              </a>
            )}
            {p.links?.linkedin && (
              <a
                href={p.links.linkedin}
                target="_blank"
                rel="noreferrer"
                className="animated-underline text-sm text-zinc-500 hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            )}
            {p.links?.instagram && (
              <a
                href={p.links.instagram}
                target="_blank"
                rel="noreferrer"
                className="animated-underline text-sm text-zinc-500 hover:text-white transition-colors"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
