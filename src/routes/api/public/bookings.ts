import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bookingSchema = z.object({
  service: z.string().trim().min(2).max(120),
  professional_preference: z.enum(["Female", "Male", "No Preference"]),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time_slot: z.string().trim().min(3).max(60),
  location: z.string().trim().min(2).max(300),
  customer_name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(25),
  email: z.string().trim().email().max(160).optional().or(z.literal("")),
  customer_message: z.string().trim().max(500).optional().or(z.literal("")),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

// Dubai is UTC+4 — "today" for the customer, not the server.
function todayInDubai(): string {
  const now = new Date(Date.now() + 4 * 60 * 60 * 1000);
  return now.toISOString().slice(0, 10);
}

export const Route = createFileRoute("/api/public/bookings")({
  server: {
    handlers: {
      // Which slots are already taken on a given date (used to lock them in the form)
      GET: async ({ request }) => {
        const date = new URL(request.url).searchParams.get("date") ?? "";
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ error: "Invalid date" }, 400);

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("bookings")
          .select("time_slot, status")
          .eq("booking_date", date)
          .neq("status", "cancelled");

        if (error) {
          console.error("slot lookup failed", error);
          return json({ taken: [] });
        }

        return json({ taken: (data ?? []).map((row) => row.time_slot) });
      },

      POST: async ({ request }) => {
        let payload: unknown;
        try {
          payload = await request.json();
        } catch {
          return json({ error: "Invalid request" }, 400);
        }

        const parsed = bookingSchema.safeParse(payload);
        if (!parsed.success) {
          return json({ error: "Please check the booking details and try again." }, 400);
        }

        if (parsed.data.booking_date < todayInDubai()) {
          return json({ error: "Please choose today or a later date." }, 400);
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("bookings")
          .insert({
            ...parsed.data,
            email: parsed.data.email || null,
            customer_message: parsed.data.customer_message || null,
            booking_source: "website",
          })
          .select("id, booking_reference")
          .single();

        if (error) {
          // Unique index on (booking_date, time_slot): someone took the slot first.
          if (error.code === "23505") {
            return json(
              {
                error: "That time slot has just been taken. Please choose another slot.",
                code: "slot_taken",
              },
              409,
            );
          }
          console.error("booking insert failed", error);
          return json({ error: "Could not save the booking right now." }, 500);
        }

        return json({ ok: true, id: data.id, reference: data.booking_reference });
      },
    },
  },
});
