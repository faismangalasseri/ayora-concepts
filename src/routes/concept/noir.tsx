import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/concept/noir")({
  head: () => ({
    meta: [
      { title: "AYORA — Design Concept D" },
      { name: "description", content: "AYORA design concept D: a dark, animated midnight look for at-home Ayurvedic wellness in the UAE." },
      { property: "og:title", content: "AYORA — Design Concept D" },
      { property: "og:description", content: "Dark, animated midnight design direction for AYORA home wellness." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConceptNoir,
});

function ConceptNoir() {
  return (
    <iframe
      src="/concept-noir.html"
      title="AYORA design concept D — Midnight Noir"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}
