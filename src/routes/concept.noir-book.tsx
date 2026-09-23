import { createFileRoute } from "@tanstack/react-router";

type BookSearch = { service?: string | undefined };

export const Route = createFileRoute("/concept/noir-book")({
  validateSearch: (search: Record<string, unknown>): BookSearch => ({
    service: typeof search['service'] === "string" ? search['service'].slice(0, 120) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Book an At-Home Wellness Session — AYORA" },
      { name: "description", content: "Request an AYORA Ayurvedic home wellness session across the UAE." },
      { property: "og:title", content: "Book an At-Home Wellness Session — AYORA" },
      { property: "og:description", content: "Choose your AYORA service, preferred time and location in a few simple steps." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: NoirBooking,
});

function NoirBooking() {
  const { service } = Route.useSearch();
  const src = service
    ? `/concept-noir-book.html?service=${encodeURIComponent(service)}`
    : "/concept-noir-book.html";
  return <iframe src={src} title="Book an AYORA home wellness session" className="fixed inset-0 h-full w-full border-0" />;
}
