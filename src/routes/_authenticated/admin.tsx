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

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  completed: "bg-slate-100 text-slate-600 border-slate-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

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
    const by = (s: string) => all.filter((b) => b.status === s).length;
    return {
      total: all.length,
      pending: by("pending"),
      confirmed: by("confirmed"),
      completed: by("completed"),
    };
  }, [data]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-8">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-slate-400">AYORA</p>
            <h1 className="mt-1 text-lg font-semibold tracking-tight">Bookings dashboard</h1>
          </div>
          <Button
            variant="outline"
            onClick={signOut}
            className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
          >
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: "Total bookings", value: counts.total },
            { label: "Pending", value: counts.pending },
            { label: "Confirmed", value: counts.confirmed },
            { label: "Completed", value: counts.completed },
          ].map((card) => (
            <div key={card.label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{card.label}</p>
              <p className="mt-2 text-2xl font-semibold tabular-nums">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition ${
                statusFilter === s
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
          <Input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="ml-auto w-auto border-slate-300 bg-white text-slate-900"
          />
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="text-sm font-medium text-slate-500 hover:text-slate-900"
            >
              Clear date
            </button>
          )}
        </div>

        {isLoading && <p className="mt-10 text-sm text-slate-500">Loading bookings…</p>}
        {error && (
          <p className="mt-10 text-sm text-red-600">
            Bookings could not be loaded. Make sure this account has staff access.
          </p>
        )}
        {!isLoading && !error && bookings.length === 0 && (
          <div className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-500">
            No bookings match this view yet.
          </div>
        )}

        <div className="mt-6 space-y-4">
          {bookings.map((b) => (
            <article key={b.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  {b.booking_reference && (
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {b.booking_reference}
                    </p>
                  )}
                  <h2 className="mt-1 text-base font-semibold">{b.customer_name}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {b.service} · 60 min · {b.professional_preference}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {b.booking_date} · {b.time_slot}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{b.location}</p>
                  {b.email && <p className="mt-1 text-sm text-slate-500">{b.email}</p>}
                  {b.customer_message && (
                    <p className="mt-2 max-w-md rounded-lg bg-slate-50 p-3 text-sm italic text-slate-600">
                      “{b.customer_message}”
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${
                      STATUS_STYLES[b.status] ?? "border-slate-200 bg-slate-100 text-slate-600"
                    }`}
                  >
                    {b.status}
                  </span>
                  <a href={`tel:${b.phone}`} className="text-sm font-medium text-slate-700 hover:underline">
                    {b.phone}
                  </a>
                  <a
                    href={`https://wa.me/${b.phone.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-emerald-600 hover:underline"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    disabled={savingId === b.id || b.status === s}
                    onClick={() => patch(b.id, { status: s })}
                    className={`rounded-lg border px-3 py-1.5 text-sm font-medium capitalize transition disabled:opacity-40 ${
                      b.status === s
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
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
                  className="min-h-[70px] border-slate-300 bg-white text-sm text-slate-900"
                />
                <Button
                  size="sm"
                  disabled={savingId === b.id}
                  onClick={() => patch(b.id, { admin_note: notes[b.id] ?? b.admin_note ?? "" })}
                  className="mt-2 bg-slate-900 text-white hover:bg-slate-800"
                >
                  Save note
                </Button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
