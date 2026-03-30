import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { getTasksForUser } from "@/lib/tactics-store";
import { getWorkspaceForUser } from "@/lib/dugout-store";
import GaffersRoomTabs from "@/components/gaffers/GaffersRoomTabs";
import LogoutButton from "@/components/gaffers/LogoutButton";

export const dynamic = "force-dynamic";

export default async function GaffersRoom() {
  // Server-side auth check (belt-and-braces alongside middleware)
  const cookieStore = await cookies();
  const token = cookieStore.get("gaffer_session")?.value;
  const session = token ? await verifyToken(token) : null;
  if (!session) redirect("/gaffers-room/login");

  const initialTasks = getTasksForUser(session.username);
  const dugoutWorkspace = getWorkspaceForUser(session.username);

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
              The Gaffer&apos;s Room
            </h1>
            <p className="font-[var(--font-mono)] text-[11px] tracking-[0.18em] text-[var(--color-text-secondary)] uppercase mt-2">
              Tactics Board · The Dugout
            </p>
          </div>
          <LogoutButton />
        </div>

        {/* Tab switcher + panels */}
        <GaffersRoomTabs
          initialTasks={initialTasks}
          initialDugoutPages={dugoutWorkspace.pages}
          initialDugoutActivePageId={dugoutWorkspace.activePageId}
        />
      </div>
    </section>
  );
}

