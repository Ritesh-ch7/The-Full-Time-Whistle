"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="self-start font-[var(--font-mono)] text-[10px] tracking-[0.22em] uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-gold)] transition-colors duration-200 disabled:opacity-50 mt-2"
    >
      {loading ? "Leaving…" : "↩ Leave Room"}
    </button>
  );
}

