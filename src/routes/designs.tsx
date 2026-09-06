import { createFileRoute, Link } from "@tanstack/react-router";

import heroImg from "@/assets/hero.jpg";

const concepts = [
  {
    name: "Concept A",
    title: "Linen Editorial",
    text: "Warm cream, muted gold and refined editorial typography — the main AYORA direction.",
    to: "/",
    tag: "Recommended",
  },
  {
    name: "Concept B",
    title: "Serif Editorial",
    text: "Classic serif-led luxury with soft linen tones and generous spacing.",
    to: "/concept/serif",
  },
  {
    name: "Concept C",
    title: "Editorial Linen",
    text: "A lighter editorial layout with large imagery and calm, spacious sections.",
    to: "/concept/editorial",
  },
  {
    name: "Concept D",
    title: "Midnight Noir",
    text: "Dark, moody and animated — glowing gold accents on deep charcoal.",
    to: "/concept/noir",
  },
  {
    name: "Concept E",
    title: "Kinetic Bento",
    text: "Bold modern bento grid with playful motion and kinetic animations.",
    to: "/concept/kinetic",
  },
];

export const Route = createFileRoute("/designs")({
  head: () => ({
    meta: [
      { title: "AYORA — Design Concepts" },
      { name: "description", content: "Explore the AYORA design concepts: five website directions for at-home Ayurvedic wellness." },
      { property: "og:title", content: "AYORA — Design Concepts" },
      { property: "og:description", content: "Five website design directions for AYORA home wellness." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Designs,
});

function Designs() {
  return (
    <div className="min-h-screen bg-ivory font-body text-ink antialiased">
      <header className="border-b border-ink/5 px-6 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1fr_320px]">
          <div>
            <span className="mb-6 block text-xs font-medium uppercase tracking-[0.3em] text-gold">
              AYORA — Design Review
            </span>
            <h1 className="font-display text-4xl font-medium uppercase leading-none tracking-tight md:text-6xl">
              Five directions. One brand.
            </h1>
            <p className="mt-6 max-w-[52ch] text-pretty text-sm leading-relaxed text-ink/60">
              Explore each design concept below and let us know which direction feels right for
              AYORA. Every concept opens in a new page so you can compare them easily.
            </p>
          </div>
          <img
            src={heroImg}
            alt="Ayurvedic oil bottle on folded linen"
            width={640}
            height={800}
            className="hidden aspect-[4/5] w-full rounded-xl object-cover outline-1 -outline-offset-1 outline-ink/5 md:block"
          />
        </div>
      </header>

      <main className="px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {concepts.map((c) => (
            <Link
              key={c.to}
              to={c.to}
              className="group flex flex-col justify-between border border-ink/10 p-8 transition-colors hover:border-gold/50 hover:bg-linen"
            >
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-ink/40">
                    {c.name}
                  </span>
                  {c.tag && (
                    <span className="border border-gold/30 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.2em] text-gold">
                      {c.tag}
                    </span>
                  )}
                </div>
                <h2 className="mb-3 font-display text-2xl font-medium uppercase tracking-wide">
                  {c.title}
                </h2>
                <p className="text-sm leading-relaxed text-ink/60">{c.text}</p>
              </div>
              <span className="mt-10 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-gold">
                View design
                <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-ink/5 px-6 py-10 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-ink/40">
          AYORA Wellness UAE — Concepts for client review
        </p>
      </footer>
    </div>
  );
}
