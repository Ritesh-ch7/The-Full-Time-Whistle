import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { getTasksForUser } from "@/lib/tactics-store";
import TacticsBoard from "@/components/gaffers/TacticsBoard";
import LogoutButton from "@/components/gaffers/LogoutButton";

export const dynamic = "force-dynamic";

export default async function GaffersRoom() {
  // Server-side auth check (belt-and-braces alongside middleware)
  const cookieStore = await cookies();
  const token = cookieStore.get("gaffer_session")?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session) redirect("/gaffers-room/login");

  const initialTasks = getTasksForUser(session.username);

  return (
    <section className="relative min-h-screen bg-[var(--color-pitch)] pt-20 pb-16 px-4 sm:px-8">
      {/* Floodlight glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 35% at 50% -5%, rgba(201,147,58,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Page header */}
        <div className="flex items-start justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="font-[var(--font-mono)] text-[10px] tracking-[0.35em] text-[var(--color-gold)] uppercase mb-1">
              Gaffer&apos;s Room · {session.username}
            </p>
            <h1 className="font-[var(--font-display)] text-5xl sm:text-6xl font-bold uppercase text-[var(--color-chalk)] tracking-tight leading-none">
              The Tactics Board
            </h1>
            <p className="font-[var(--font-mono)] text-[11px] tracking-[0.18em] text-[var(--color-text-secondary)] uppercase mt-2">
              Eisenhower Matrix · Personal Priorities
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Axis labels */}
        <div className="mb-4 hidden sm:grid grid-cols-2 gap-4">
          <p className="font-[var(--font-mono)] text-[9px] tracking-[0.25em] text-[var(--color-text-secondary)] uppercase text-center">
            ← Urgent →
          </p>
          <p className="font-[var(--font-mono)] text-[9px] tracking-[0.25em] text-[var(--color-text-secondary)] uppercase text-center">
            ← Not Urgent →
          </p>
        </div>

        {/* The board */}
        <TacticsBoard initialTasks={initialTasks} />

        {/* Legend */}
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 justify-center">
          {[
            { label: "First Team", sub: "Do Now", color: "#B22222" },
            { label: "Training Ground", sub: "Schedule", color: "#C9933A" },
            { label: "The Bench", sub: "Delegate", color: "#4A7C6F" },
            { label: "Released", sub: "Drop It", color: "#5A5A6A" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: item.color }}
              />
              <span className="font-[var(--font-mono)] text-[9px] tracking-[0.15em] uppercase text-[var(--color-text-secondary)]">
                {item.label} · {item.sub}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

