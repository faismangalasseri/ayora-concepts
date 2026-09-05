import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/concept/editorial")({
  head: () => ({
    meta: [
      { title: "AYORA — Design Concept C" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConceptEditorial,
});

function ConceptEditorial() {
  return (
    <iframe
      src="/concept-editorial.html"
      title="AYORA design concept C — Editorial Linen"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}
