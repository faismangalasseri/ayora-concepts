import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { listBookings, updateBooking, type Booking } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"] as const;

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Bookings Dashboard — AYORA" },
      { name: "description", content: "Manage AYORA home wellness booking requests." },
      { property: "og:title", content: "Bookings Dashboard — AYORA" },
      { property: "og:description", content: "Private AYORA dashboard for booking requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminBookings,
});

function AdminBookings() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchBookings = useServerFn(listBookings);
  const saveBooking = useServerFn(updateBooking);

  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["bookings"],
    queryFn: () => fetchBookings(),
  });

  const bookings = useMemo(() => {
    const all: Booking[] = data?.bookings ?? [];
    return all.filter(
      (b) =>
        (statusFilter === "all" || b.status === statusFilter) &&
        (!dateFilter || b.booking_date === dateFilter),
    );
  }, [data, statusFilter, dateFilter]);

  async function patch(id: string, patchData: { status?: string; admin_note?: string }) {
    setSavingId(id);
    try {
      await saveBooking({ data: { id, ...patchData } as never });
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
    } finally {
      setSavingId(null);
    }
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  const counts = useMemo(() => {
    const all: Booking[] = data?.bookings ?? [];
    return {
      total: all.length,
      pending: all.filter((b) => b.status === "pending").length,
    };
  }, [data]);

  return (
    <main className="min-h-screen bg-[#0B0D0C] px-4 py-10 text-[#E8E6E1] sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#C7A867]">AYORA</p>
            <h1 className="mt-2 text-2xl font-semibold">Bookings</h1>
            <p className="mt-1 text-sm text-[#E8E6E1]/50">
              {counts.total} total · {counts.pending} waiting for a reply
            </p>
          </div>
          <Button variant="outline" onClick={signOut} className="border-white/15 bg-transparent text-[#E8E6E1] hover:bg-white/10">
            Sign out
          </Button>
        </header>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.15em] transition ${
                statusFilter === s
                  ? "border-[#C7A867] bg-[#C7A867] text-[#0B0D0C]"
                  : "border-white/12 text-[#E8E6E1]/60 hover:text-[#E8E6E1]"
              }`}
            >
              {s}
            </button>
          ))}
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="ml-auto w-auto border-white/10 bg-white/5 text-[#E8E6E1]"
          />
          {dateFilter && (
            <button onClick={() => setDateFilter("")} className="text-xs uppercase tracking-[0.15em] text-[#E8E6E1]/50 hover:text-[#E8E6E1]">
              Clear date
            </button>
          )}
        </div>

        {isLoading && <p className="mt-10 text-sm text-[#E8E6E1]/50">Loading bookings…</p>}
        {error && (
          <p className="mt-10 text-sm text-[#E4795B]">
            Bookings could not be loaded. Make sure this account has staff access.
          </p>
        )}
        {!isLoading && !error && bookings.length === 0 && (
          <p className="mt-10 text-sm text-[#E8E6E1]/50">No bookings match this view yet.</p>
        )}

        <div className="mt-8 space-y-4">
          {bookings.map((b) => (
            <article key={b.id} className="border border-white/10 bg-white/[0.03] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">{b.customer_name}</h2>
                  <p className="mt-1 text-sm text-[#E8E6E1]/60">
                    {b.service} · {b.professional_preference} professional
                  </p>
                  <p className="mt-1 text-sm text-[#E8E6E1]/60">
                    {b.booking_date} · {b.time_slot}
                  </p>
                  <p className="mt-1 text-sm text-[#E8E6E1]/60">{b.location}</p>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                  <span className="rounded-full border border-[#C7A867]/40 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#C7A867]">
                    {b.status}
                  </span>
                  <a href={`tel:${b.phone}`} className="text-sm text-[#E8E6E1]/80 underline-offset-4 hover:underline">
                    {b.phone}
                  </a>
                  <a
                    href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs uppercase tracking-[0.15em] text-[#C7A867] underline-offset-4 hover:underline"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    disabled={savingId === b.id || b.status === s}
                    onClick={() => patch(b.id, { status: s })}
                    className={`rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.18em] transition disabled:opacity-40 ${
                      b.status === s ? "border-[#C7A867] text-[#C7A867]" : "border-white/12 text-[#E8E6E1]/60 hover:text-[#E8E6E1]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <Textarea
                  placeholder="Private note (e.g. therapist assigned)"
                  value={notes[b.id] ?? b.admin_note ?? ""}
                  onChange={(e) => setNotes({ ...notes, [b.id]: e.target.value })}
                  className="min-h-[70px] border-white/10 bg-white/5 text-sm text-[#E8E6E1]"
                />
                <Button
                  size="sm"
                  disabled={savingId === b.id}
                  onClick={() => patch(b.id, { admin_note: notes[b.id] ?? b.admin_note ?? "" })}
                  className="mt-2 bg-[#C7A867] text-[#0B0D0C] hover:bg-[#d8bb7c]"
                >
                  Save note
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
