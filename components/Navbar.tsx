"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isGaffersRoom = pathname.startsWith("/gaffers-room");

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3"
      style={{
        background: "rgba(10,10,10,0.72)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(201,147,58,0.18)",
      }}
    >
      {/* Left — Home link */}
      <Link
        href="/"
        className="font-[var(--font-display)] text-sm tracking-[0.35em] uppercase text-[var(--color-text-secondary)] hover:text-[var(--color-gold)] transition-colors duration-200"
      >
        Matchday
      </Link>

      {/* Right — Gaffer's Room */}
      <Link
        href="/gaffers-room"
        className={`group flex items-center gap-2 font-[var(--font-mono)] text-[11px] tracking-[0.22em] uppercase transition-colors duration-200 ${
          isGaffersRoom
            ? "text-[var(--color-gold)]"
            : "text-[var(--color-text-secondary)] hover:text-[var(--color-gold)]"
        }`}
      >
        {/* Tactical board icon */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          className="opacity-70 group-hover:opacity-100 transition-opacity"
        >
          <rect x="1" y="1" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <line x1="7" y1="1" x2="7" y2="13" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.5" />
          <line x1="1" y1="7" x2="13" y2="7" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.5" />
        </svg>
        Gaffer&apos;s Room
      </Link>
    </nav>
  );
}

