import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Booking = {
  id: string;
  created_at: string;
  service: string;
  professional_preference: string;
  booking_date: string;
  time_slot: string;
  location: string;
  customer_name: string;
  phone: string;
  status: string;
  admin_note: string | null;
  booking_reference: string | null;
  email: string | null;
  customer_message: string | null;
  booking_source: string | null;
};

export const listBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("bookings")
      .select(
        "id, created_at, service, professional_preference, booking_date, time_slot, location, customer_name, phone, status, admin_note",
      )
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) throw new Error(error.message);
    return { bookings: (data ?? []) as Booking[] };
  });

export const updateBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
        admin_note: z.string().max(1000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const patch: { status?: string; admin_note?: string | null } = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.admin_note !== undefined) patch.admin_note = data.admin_note;
    const { error } = await context.supabase.from("bookings").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const registerStaff = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        email: z.string().email(),
        password: z.string().min(8).max(72),
        accessCode: z.string().min(1).max(100),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const expected = process.env["STAFF_ACCESS_CODE"];
    if (!expected || data.accessCode.trim() !== expected) {
      throw new Error("That staff access code is not valid.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });

    if (error || !created.user) {
      throw new Error(error?.message ?? "Could not create this staff account.");
    }

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: created.user.id, role: "admin" });

    if (roleError) throw new Error(roleError.message);
    return { ok: true };
  });
