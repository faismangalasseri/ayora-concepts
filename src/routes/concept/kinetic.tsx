import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/concept/kinetic")({
  head: () => ({
    meta: [
      { title: "AYORA — Design Concept E" },
      { name: "description", content: "AYORA design concept E: a bold modern bento layout with kinetic motion for at-home Ayurvedic wellness." },
      { property: "og:title", content: "AYORA — Design Concept E" },
      { property: "og:description", content: "Bold modern bento design direction with kinetic motion for AYORA." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConceptKinetic,
});

function ConceptKinetic() {
  return (
    <iframe
      src="/concept-kinetic.html"
      title="AYORA design concept E — Kinetic Bento"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}
