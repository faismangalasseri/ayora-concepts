import { createFileRoute } from "@tanstack/react-router";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

// Public, login-free booking lookup. A customer enters their booking
// reference (AYR-1029) or the phone number they booked with, and we return
// only that booking's status — never the full database.
export const Route = createFileRoute("/api/public/bookings/track")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams;
        const ref = (params.get("ref") ?? "").trim().toUpperCase();
        const phoneDigits = (params.get("phone") ?? "").replace(/\D/g, "");

        if (!ref && phoneDigits.length < 7) {
          return json({ error: "Enter your booking reference or phone number." }, 400);
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        let query = supabaseAdmin
          .from("bookings")
          .select(
            "booking_reference, service, professional_preference, booking_date, time_slot, location, customer_name, phone, status, created_at",
          )
          .order("created_at", { ascending: false })
          .limit(300);

        // Reference lookup: exact. Phone lookup: last 8 digits match, so
        // +971 50 123 4567 and 0501234567 both find the booking.
        if (ref) {
          query = query.eq("booking_reference", ref);
        } else {
          const suffix = phoneDigits.slice(-8);
          query = query.ilike("phone", "%" + suffix + "%");
        }

        const { data, error } = await query;
        if (error) {
          console.error("track lookup failed", error);
          return json({ error: "Could not look that up right now." }, 500);
        }

        let rows = data ?? [];
        if (!ref && rows.length > 1) {
          // Keep only bookings whose phone digits genuinely end with the suffix.
          rows = rows.filter((row) => (row.phone ?? "").replace(/\D/g, "").endsWith(phoneDigits.slice(-8)));
        }
        if (!ref && phoneDigits.length >= 8) {
          rows = rows.filter((row) => (row.phone ?? "").replace(/\D/g, "").endsWith(phoneDigits.slice(-8)));
        }

        return json({
          bookings: rows.map((row) => ({
            reference: row.booking_reference,
            service: row.service,
            professional: row.professional_preference,
            date: row.booking_date,
            time_slot: row.time_slot,
            location: row.location,
            name: row.customer_name,
            status: row.status,
          })),
        });
      },
    },
  },
});
