import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/concept/botanical")({
  head: () => ({
    meta: [
      { title: "AYORA Botanical Pavilion Design" },
      { name: "description", content: "An original botanical editorial website concept for AYORA home wellness in the UAE." },
      { property: "og:title", content: "AYORA Botanical Pavilion Design" },
      { property: "og:description", content: "Explore AYORA's botanical editorial direction for Ayurvedic home wellness." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConceptBotanical,
});

function ConceptBotanical() {
  return (
    <iframe
      src="/concept-botanical.html"
      title="AYORA design concept F — Botanical Pavilion"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}