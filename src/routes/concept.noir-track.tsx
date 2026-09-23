import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/concept/noir-track")({
  head: () => ({
    meta: [
      { title: "Track Your Booking — AYORA" },
      { name: "description", content: "Check the status of your AYORA home wellness booking with your reference or phone number." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Track Your Booking — AYORA" },
      { property: "og:description", content: "Check the status of your AYORA home wellness booking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <div
      class="h-screen w-full border-0"
      src="/concept-noir-track.html"
      title="Track your AYORA booking"
    />
  ),
});
