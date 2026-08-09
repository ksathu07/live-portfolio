import { profile } from "@/lib/profile";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-zinc-500 sm:flex-row">
        <p>
          © {new Date().getFullYear()} {profile.profile.name}. Built with CLARA.
        </p>
        <p className="flex gap-6">
          {profile.profile.links?.github && (
            <a href={profile.profile.links.github} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
              GitHub
            </a>
          )}
          {profile.profile.links?.linkedin && (
            <a href={profile.profile.links.linkedin} target="_blank" rel="noreferrer" className="transition-colors hover:text-white">
              LinkedIn
            </a>
          )}
        </p>
      </div>
    </footer>
  );
}