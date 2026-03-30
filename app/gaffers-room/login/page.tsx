"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const inputBase =
  "w-full bg-transparent font-[var(--font-body)] text-[var(--color-text-primary)] text-sm placeholder:text-[var(--color-text-secondary)] outline-none py-2 border-b border-[rgba(201,147,58,0.30)] focus:border-[var(--color-gold)] transition-colors duration-200";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/gaffers-room";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Login failed.");
        return;
      }
      router.push(from);
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
          Sign In
        </h1>
        <p className="font-[var(--font-mono)] text-[11px] tracking-[0.18em] text-[var(--color-text-secondary)] uppercase text-center mb-10">
          Your board, your tactics
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        {/* Sign up prompt */}
        <p className="text-center mt-5 font-[var(--font-mono)] text-[11px] tracking-[0.12em] text-[var(--color-text-secondary)]">
          New here?{" "}
          <Link
            href="/gaffers-room/register"
            className="text-[var(--color-gold)] hover:underline underline-offset-4 transition-colors"
          >
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

