import { VideoPortfolio } from "@/lib/profile";

interface VideoPortfolioProps {
  data: VideoPortfolio;
}

function resolveEmbed(url?: string | null): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") || u.hostname.includes("youtu.be")) {
      const id = u.hostname.includes("youtu.be")
        ? u.pathname.slice(1)
        : u.searchParams.get("v") ?? u.pathname.split("/").pop();
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").pop();
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function VideoPortfolioSection({ data }: VideoPortfolioProps) {
  if (!data || !data.items?.length) return null;

  return (
    <section id="video-portfolio" className="px-6 py-20 max-w-6xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-ink">{data.headline ?? "Video Portfolio"}</h2>
        {data.summary && (
          <p className="text-ink/70 mt-3 max-w-2xl">{data.summary}</p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, idx) => {
          const embedUrl = resolveEmbed(item.links?.embed ?? item.links?.watch ?? item.links?.youtube ?? item.links?.vimeo);
          return (
            <div
              key={`${item.title}-${idx}`}
              className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden hover:border-accent/50 transition-colors"
            >
              <div className="aspect-video bg-black/40 flex items-center justify-center relative overflow-hidden">
                {embedUrl ? (
                  <iframe
                    src={embedUrl}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={item.title}
                  />
                ) : (
                  <div className="text-ink/40 text-sm text-center px-6">
                    {item.proof?.path ? (
                      <span>Video: {item.proof.path}</span>
                    ) : (
                      <span>Video preview unavailable</span>
                    )}
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-ink">{item.title}</h3>
                {item.role && (
                  <p className="text-xs text-accent mt-1 uppercase tracking-wide">{item.role}</p>
                )}
                {item.description && (
                  <p className="text-ink/70 text-sm mt-2">{item.description}</p>
                )}
                {item.tools && item.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {item.tools.map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[11px] font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
                {item.links?.watch && !embedUrl && (
                  <a
                    href={item.links.watch}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-3 text-xs text-accent hover:underline"
                  >
                    Watch →
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
