import { createFileRoute } from "@tanstack/react-router";

import heroImg from "@/assets/hero.jpg";
import abhyangaImg from "@/assets/service-abhyanga.jpg";
import headImg from "@/assets/service-head.jpg";
import relaxImg from "@/assets/service-relax.jpg";

const WHATSAPP_URL =
  "https://wa.me/971500000000?text=" +
  encodeURIComponent("Hello AYORA, I'd like to book a home wellness session.");

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AYORA — Ayurvedic Wellness at Your Doorstep" },
      {
        name: "description",
        content:
          "Personalised Ayurvedic massage and wellness therapies delivered to your doorstep across the UAE. Book your home session today.",
      },
      { property: "og:title", content: "AYORA — Ayurvedic Wellness at Your Doorstep" },
      {
        property: "og:description",
        content:
          "Traditional Ayurvedic care. Professional wellness. In the comfort of your home.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const whyItems = [
  {
    title: "Authentic Care",
    text: "Inspired by traditional Ayurvedic wellness practices and adapted for modern lifestyles.",
  },
  {
    title: "At-Home Ease",
    text: "No travelling, no waiting rooms. Our wellness professionals come to your home at a time that suits you.",
  },
  {
    title: "Tailored Touch",
    text: "Every session is tailored to your comfort, wellness goals and preferred massage style.",
  },
  {
    title: "Discrete Luxury",
    text: "We focus on hygiene, professionalism, comfort and a respectful client experience.",
  },
];

const services = [
  {
    title: "Abhyanga-Inspired Massage",
    text: "A traditional oil-based Ayurvedic wellness massage using flowing techniques and warm oils.",
    duration: "90 Minutes",
    img: abhyangaImg,
    alt: "Warm Ayurvedic oil being poured into a ceramic bowl beside fresh herbs",
  },
  {
    title: "Head & Shoulder Wellness",
    text: "A focused session for everyday tension from work, travel and prolonged screen time.",
    duration: "60 Minutes",
    img: headImg,
    alt: "Rolled linen towel with a brass bowl of herbal oil on a wooden tray",
  },
  {
    title: "Stress & Relaxation",
    text: "A gentle wellness experience designed to help you relax and disconnect from everyday stress.",
    duration: "75 Minutes",
    img: relaxImg,
    alt: "A guest relaxing on a linen-covered massage table in a sunlit room",
  },
];

const steps = [
  { n: "01", title: "Selection", text: "Choose the wellness massage that suits you." },
  { n: "02", title: "Scheduling", text: "Book a convenient date and time online." },
  { n: "03", title: "Preparation", text: "Our wellness professional arrives at your chosen location." },
  { n: "04", title: "Restoration", text: "Enjoy your personalised session from the comfort of your home." },
];

const faqs = [
  {
    q: "Is AYORA a home service?",
    a: "Yes. Our wellness professionals travel to your selected location across the UAE.",
  },
  {
    q: "What should I prepare before the session?",
    a: "A clean, comfortable and private space is generally sufficient. Specific preparation instructions are provided when booking.",
  },
  {
    q: "Can I request a specific massage?",
    a: "Yes. You can select your preferred wellness service when making your booking.",
  },
  {
    q: "Do you provide services for men and women?",
    a: "Services are offered according to the applicable UAE licensing requirements and AYORA's service policies.",
  },
  {
    q: "Can I book for someone else?",
    a: "Yes. You can book an AYORA wellness session as a gift or for a family member.",
  },
];

function Index() {
  return (
    <div className="bg-ivory font-body text-ink antialiased">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-ink/5 bg-ivory/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded-full border border-gold/40">
              <div className="size-2 rounded-full bg-gold"></div>
            </div>
            <span className="font-display text-xl font-medium tracking-widest">AYORA</span>
          </div>
          <div className="hidden gap-8 text-sm uppercase tracking-wide md:flex">
            <a href="#services" className="transition-colors hover:text-gold">Services</a>
            <a href="#journey" className="transition-colors hover:text-gold">Method</a>
            <a href="#book" className="transition-colors hover:text-gold">Locations</a>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-sm bg-gold px-4 py-2 text-sm font-medium text-ivory ring-1 ring-gold/20 transition-colors hover:bg-gold/90"
          >
            Book Now
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pb-20 pt-32 md:pb-32 md:pt-48">
        <div className="mx-auto grid max-w-7xl items-center gap-16 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <span className="mb-6 block text-xs font-medium uppercase tracking-[0.3em] text-gold">
              Wellness at Your Doorstep
            </span>
            <h1 className="mb-8 text-balance font-display text-4xl font-medium uppercase leading-none tracking-tight md:text-7xl">
              Traditional Ayurvedic care. Delivered to your sanctuary.
            </h1>
            <div className="flex flex-wrap gap-4">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 rounded-sm bg-gold py-3 pl-3 pr-4 text-ivory shadow-sm ring-1 ring-gold transition-transform hover:-translate-y-px"
              >
                <div className="flex size-4 items-center justify-center rounded-full bg-ivory/20">
                  <div className="size-1.5 rounded-full bg-ivory"></div>
                </div>
                <span className="text-sm font-medium">Book Your Session</span>
              </a>
              <a
                href="#services"
                className="rounded-sm px-6 py-3 text-sm font-medium text-ink ring-1 ring-ink/10 transition-colors hover:bg-ink/5"
              >
                Explore Our Services
              </a>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImg}
              alt="Amber glass Ayurvedic oil bottle resting on a folded white linen towel in soft morning light"
              width={800}
              height={1000}
              className="aspect-[4/5] w-full rounded-xl object-cover outline-1 -outline-offset-1 outline-ink/5"
            />
            <div className="absolute -bottom-6 -left-6 hidden border border-ink/5 bg-ivory p-6 md:block">
              <p className="font-display text-2xl italic">
                &ldquo;The restorative power of ancient wisdom, in your own space.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose AYORA */}
      <section className="bg-linen px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 divide-y divide-ink/5 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {whyItems.map((item, i) => (
              <div key={item.title} className={i === 0 ? "pt-8 sm:pt-0" : "pt-8 sm:pt-0 lg:pl-12"}>
                <div className="mb-6 flex size-8 items-center justify-center border border-gold/20">
                  <div className="size-1 bg-gold"></div>
                </div>
                <h3 className="mb-4 font-display text-2xl font-medium uppercase tracking-wide">
                  {item.title}
                </h3>
                <p className="max-w-[56ch] text-pretty text-sm leading-relaxed text-ink/70">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <h2 className="mb-4 font-display text-3xl font-medium uppercase leading-tight tracking-tight md:text-5xl">
              Therapeutic Rituals
            </h2>
            <p className="max-w-[48ch] text-pretty text-ink/60">
              Select a practice that resonates with your current state of being.
            </p>
          </div>
          <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <a key={s.title} href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="group block">
                <img
                  src={s.img}
                  alt={s.alt}
                  loading="lazy"
                  width={768}
                  height={512}
                  className="mb-6 aspect-[3/2] w-full rounded-xl object-cover outline-1 -outline-offset-1 outline-ink/5 transition-opacity group-hover:opacity-90"
                />
                <h4 className="mb-2 font-display text-xl font-medium uppercase tracking-wide">
                  {s.title}
                </h4>
                <p className="mb-4 text-sm leading-relaxed text-ink/60">{s.text}</p>
                <span className="border-b border-gold/20 pb-1 text-xs font-medium uppercase tracking-[0.2em] text-gold">
                  {s.duration}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="journey" className="bg-ink px-6 py-24 text-ivory">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-16 text-center font-display text-3xl font-medium uppercase leading-tight tracking-tight md:text-5xl">
            The Journey
          </h2>
          <div className="grid gap-12 md:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n} className="text-center">
                <span className="mb-6 block font-display text-5xl italic text-gold/40">{s.n}</span>
                <h5 className="mb-4 text-sm font-medium uppercase tracking-widest">{s.title}</h5>
                <p className="text-sm leading-relaxed text-ivory/60">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-linen px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-12 text-center font-display text-3xl font-medium uppercase tracking-tight md:text-5xl">
            Questions, Answered
          </h2>
          <div className="space-y-2">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-ink/10 py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-lg font-medium">
                  {f.q}
                  <span className="text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[56ch] text-sm leading-relaxed text-ink/60">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section id="book" className="bg-ivory px-6 py-24">
        <div className="mx-auto max-w-3xl border-b border-t border-ink/5 py-16 text-center">
          <h2 className="mb-8 font-display text-3xl font-medium uppercase leading-tight tracking-tight md:text-5xl">
            Ready to begin?
          </h2>
          <p className="mx-auto mb-10 max-w-[48ch] text-pretty text-ink/60">
            Experience Ayurvedic-inspired wellness without leaving your home. Available across
            Dubai, Abu Dhabi, Sharjah, Ajman and the other Emirates.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center gap-4 rounded-sm bg-gold py-4 pl-4 pr-6 text-ivory shadow-lg shadow-gold/10 transition-colors hover:bg-gold/90 sm:w-auto"
            >
              <div className="flex size-5 items-center justify-center rounded-full bg-ivory/10">
                <div className="size-1.5 rounded-full bg-ivory"></div>
              </div>
              <span className="text-sm font-medium">Connect on WhatsApp</span>
            </a>
            <span className="px-4 text-xs uppercase tracking-widest text-ink/40">or</span>
            <a
              href="mailto:hello@ayora.ae"
              className="border-b border-ink/10 pb-1 text-sm font-medium transition-colors hover:border-gold"
            >
              hello@ayora.ae
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink/5 px-6 py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 md:flex-row">
          <span className="font-display text-2xl font-medium tracking-widest">AYORA</span>
          <p className="text-[10px] uppercase tracking-[0.2em] text-ink/40">
            Natural. Personal. Convenient.
          </p>
          <p className="text-[10px] uppercase tracking-[0.1em] text-ink/40">
            &copy; 2026 AYORA Wellness UAE
          </p>
        </div>
      </footer>
    </div>
  );
}
