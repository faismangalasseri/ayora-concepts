import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { registerStaff } from "@/lib/admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Staff Login — AYORA Bookings" },
      { name: "description", content: "AYORA staff sign-in for managing home wellness bookings." },
      { property: "og:title", content: "Staff Login — AYORA Bookings" },
      { property: "og:description", content: "Private staff area for AYORA booking management." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const createStaff = useServerFn(registerStaff);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      if (mode === "signup") {
        await createStaff({ data: { email, password, accessCode } });
        setNotice("Account created. You can sign in now.");
        setMode("signin");
        setAccessCode("");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw new Error("Wrong email or password.");
        navigate({ to: "/admin", replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0D0C] px-6 py-16 text-[#E8E6E1]">
      <div className="w-full max-w-sm">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#C7A867]">AYORA</p>
        <h1 className="mt-3 text-2xl font-semibold">Staff area</h1>
        <p className="mt-2 text-sm text-[#E8E6E1]/50">
          {mode === "signin" ? "Sign in to manage bookings." : "Create a staff account with your access code."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-xs uppercase tracking-[0.2em] text-[#E8E6E1]/60">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-white/10 bg-white/5 text-[#E8E6E1]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-xs uppercase tracking-[0.2em] text-[#E8E6E1]/60">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-white/10 bg-white/5 text-[#E8E6E1]"
            />
          </div>

          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="code" className="text-xs uppercase tracking-[0.2em] text-[#E8E6E1]/60">Staff access code</Label>
              <Input
                id="code"
                required
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="border-white/10 bg-white/5 text-[#E8E6E1]"
              />
            </div>
          )}

          {error && <p className="text-sm text-[#E4795B]">{error}</p>}
          {notice && <p className="text-sm text-[#C7A867]">{notice}</p>}

          <Button type="submit" disabled={busy} className="w-full bg-[#C7A867] text-[#0B0D0C] hover:bg-[#d8bb7c]">
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === "signin" ? "signup" : "signin");
            setError(null);
            setNotice(null);
          }}
          className="mt-6 text-xs uppercase tracking-[0.2em] text-[#E8E6E1]/45 underline-offset-4 hover:underline"
        >
          {mode === "signin" ? "Add a staff account" : "Back to sign in"}
        </button>
      </div>
    </main>
  );
}
