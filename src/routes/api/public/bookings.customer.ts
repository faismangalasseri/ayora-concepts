import { createFileRoute } from "@tanstack/react-router";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
  });

// Returning-customer lookup. The customer types the phone number they booked
// with; if we have a previous booking we return only the contact and address
// details they themselves entered, so the form can fill itself in.
// No booking history, no references, no notes are exposed.
export const Route = createFileRoute("/api/public/bookings/customer")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams;
        const digits = (params.get("phone") ?? "").replace(/\D/g, "");

        // Require a near-complete number so details can't be guessed.
        if (digits.length < 9) return json({ found: false });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const suffix = digits.slice(-9);

        const { data, error } = await supabaseAdmin
          .from("bookings")
          .select("customer_name, phone, email, location, created_at")
          .ilike("phone", "%" + suffix + "%")
          .order("created_at", { ascending: false })
          .limit(20);

        if (error) {
          console.error("customer lookup failed", error);
          return json({ found: false });
        }

        const row = (data ?? []).find((r) =>
          (r.phone ?? "").replace(/\D/g, "").endsWith(suffix),
        );
        if (!row) return json({ found: false });

        // location is stored as "Area, Emirate · Full address"
        const raw = row.location ?? "";
        const [place = "", address = ""] = raw.split("·").map((part) => part.trim());
        const placeParts = place.split(",").map((part) => part.trim());
        const emirate = placeParts.length > 1 ? (placeParts.pop() ?? "") : "";
        const area = placeParts.join(", ");

        return json({
          found: true,
          name: row.customer_name ?? "",
          email: row.email ?? "",
          emirate,
          area,
          address,
        });
      },
    },
  },
});
