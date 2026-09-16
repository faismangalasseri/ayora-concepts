import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/concept/earth-noir")({
  head: () => ({
    meta: [
      { title: "AYORA Earth After Dark Design" },
      {
        name: "description",
        content: "AYORA design concept G: earthy, treatment-led Ayurvedic home wellness across the UAE.",
      },
      { property: "og:title", content: "AYORA Earth After Dark Design" },
      {
        property: "og:description",
        content: "A forest, ivory and terracotta direction for AYORA home wellness.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ConceptEarthNoir,
});

function ConceptEarthNoir() {
  return (
    <iframe
      src="/concept-earth-noir.html"
      title="AYORA design concept G — Earth After Dark"
      className="fixed inset-0 h-full w-full border-0"
    />
  );
}