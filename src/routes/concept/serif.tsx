import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/concept/serif")({
  head: () => ({
    meta: [
      { title: "AYORA — Design Concept B" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConceptSerif,
});

function ConceptSerif() {
  return (
    <iframe
      src="/concept-serif.html"
      title="AYORA design concept B — Serif Editorial"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}
