"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const inputBase =
  "w-full bg-transparent font-[var(--font-body)] text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-secondary)] outline-none py-2 border-b border-[rgba(201,147,58,0.30)] focus:border-[var(--color-gold)] transition-colors duration-200";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Registration failed.");
        return;
      }
      router.push("/gaffers-room");
      router.refresh();
    } catch {
      setError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-[var(--color-pitch)] px-6 pt-16">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 50% -5%, rgba(201,147,58,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        {/* Header */}
        <p className="font-[var(--font-mono)] text-[10px] tracking-[0.35em] text-[var(--color-gold)] uppercase mb-2 text-center">
          Gaffer&apos;s Room
        </p>
        <h1 className="font-[var(--font-display)] text-4xl font-bold uppercase text-center text-[var(--color-chalk)] mb-1 tracking-tight">
          Create Account
        </h1>
        <p className="font-[var(--font-mono)] text-[11px] tracking-[0.18em] text-[var(--color-text-secondary)] uppercase text-center mb-10">
          Your board awaits
        </p>

        {/* Card */}
        <div
          className="px-8 py-8 rounded"
          style={{
            background: "rgba(10,10,10,0.65)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(201,147,58,0.22)",
          }}
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <label className="font-[var(--font-mono)] text-[9px] tracking-[0.25em] text-[var(--color-text-secondary)] uppercase block mb-2">
                Username
              </label>
              <input
                className={inputBase}
                type="text"
                autoComplete="username"
                placeholder="3–20 chars, letters / numbers / _ -"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="font-[var(--font-mono)] text-[9px] tracking-[0.25em] text-[var(--color-text-secondary)] uppercase block mb-2">
                Password
              </label>
              <input
                className={inputBase}
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="font-[var(--font-mono)] text-[9px] tracking-[0.25em] text-[var(--color-text-secondary)] uppercase block mb-2">
                Confirm Password
              </label>
              <input
                className={inputBase}
                type="password"
                autoComplete="new-password"
                placeholder="Repeat password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="font-[var(--font-mono)] text-[11px] text-[#B22222] text-center -mt-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-[var(--font-display)] text-sm tracking-[0.4em] uppercase py-3 rounded transition-all duration-200 disabled:opacity-50"
              style={{
                background: "rgba(201,147,58,0.15)",
                border: "1px solid rgba(201,147,58,0.45)",
                color: "var(--color-gold)",
              }}
            >
              {loading ? "Creating…" : "Join the Room"}
            </button>
          </form>
        </div>

        {/* Sign in prompt */}
        <p className="text-center mt-5 font-[var(--font-mono)] text-[11px] tracking-[0.12em] text-[var(--color-text-secondary)]">
          Already have an account?{" "}
          <Link
            href="/gaffers-room/login"
            className="text-[var(--color-gold)] hover:underline underline-offset-4 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}

