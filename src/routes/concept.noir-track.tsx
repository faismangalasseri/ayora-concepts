import { createFileRoute } from "@tanstack/react-router";

type TrackSearch = { ref?: string | undefined };

export const Route = createFileRoute("/concept/noir-track")({
  validateSearch: (search: Record<string, unknown>): TrackSearch => ({
    ref: typeof search['ref'] === "string" ? search['ref'].slice(0, 25) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Track Your Booking — AYORA" },
      {
        name: "description",
        content: "Check the status of your AYORA home wellness booking with your reference or phone number.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Track Your Booking — AYORA" },
      { property: "og:description", content: "Check the status of your AYORA home wellness booking." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NoirTrack,
});

function NoirTrack() {
  const { ref } = Route.useSearch();
  const src = ref
    ? `/concept-noir-track.html?ref=${encodeURIComponent(ref)}`
    : "/concept-noir-track.html";
  return <iframe src={src} title="Track your AYORA booking" className="fixed inset-0 h-full w-full border-0" />;
}
