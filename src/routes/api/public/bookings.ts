import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const bookingSchema = z.object({
  service: z.string().trim().min(2).max(120),
  professional_preference: z.enum(["Female", "Male"]),
  booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time_slot: z.string().trim().min(3).max(60),
  location: z.string().trim().min(2).max(160),
  customer_name: z.string().trim().min(2).max(80),
  phone: z.string().trim().min(7).max(25),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

export const Route = createFileRoute("/api/public/bookings")({
  server: {
    handlers: {
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

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data, error } = await supabaseAdmin
          .from("bookings")
          .insert(parsed.data)
          .select("id")
          .single();

        if (error) {
          console.error("booking insert failed", error);
          return json({ error: "Could not save the booking right now." }, 500);
        }

        return json({ ok: true, id: data.id });
      },
    },
  },
});
