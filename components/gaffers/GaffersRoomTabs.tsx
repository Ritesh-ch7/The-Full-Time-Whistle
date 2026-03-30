"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import TacticsBoard from "@/components/gaffers/TacticsBoard";
import DugoutEditor from "@/components/gaffers/DugoutEditor";
import type { Task } from "@/lib/tactics-store";
import type { DugoutPage } from "@/lib/dugout-store";

type Tab = "tactics" | "dugout";

const TABS: { id: Tab; label: string }[] = [
  { id: "tactics", label: "Tactics Board" },
  { id: "dugout",  label: "The Dugout"    },
];

export default function GaffersRoomTabs({
  initialTasks,
  initialDugoutPages,
  initialDugoutActivePageId,
}: {
  initialTasks: Task[];
  initialDugoutPages: DugoutPage[];
  initialDugoutActivePageId: string;
}) {
  const [active, setActive] = useState<Tab>("tactics");

  return (
    <div className="w-full">
      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div
        className="flex items-end gap-8 mb-8"
        style={{ borderBottom: "1px solid rgba(201,147,58,0.15)" }}
      >
        {TABS.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className="relative pb-3 font-[var(--font-display)] text-sm tracking-[0.22em] uppercase transition-colors duration-200 focus:outline-none"
              style={{
                color: isActive ? "#F0EDE6" : "#A89880",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "#F0EDE6";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "#A89880";
              }}
            >
              {tab.label}
              {isActive && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full"
                  style={{ background: "#C9933A" }}
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab panels ───────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: active === "tactics" ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          className={active === "tactics" ? "block" : "hidden"}
        >
          {/* Axis labels */}
          <div className="mb-4 hidden sm:grid grid-cols-2 gap-4">
            <p className="font-[var(--font-mono)] text-[9px] tracking-[0.25em] text-[var(--color-text-secondary)] uppercase text-center">
              ← Urgent →
            </p>
            <p className="font-[var(--font-mono)] text-[9px] tracking-[0.25em] text-[var(--color-text-secondary)] uppercase text-center">
              ← Not Urgent →
            </p>
          </div>

          <TacticsBoard initialTasks={initialTasks} />

          {/* Legend */}
          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 justify-center">
            {[
              { label: "First Team",      sub: "Do Now",   color: "#B22222" },
              { label: "Training Ground", sub: "Schedule", color: "#C9933A" },
              { label: "The Bench",       sub: "Delegate", color: "#4A7C6F" },
              { label: "Released",        sub: "Drop It",  color: "#5A5A6A" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: item.color }} />
                <span className="font-[var(--font-mono)] text-[9px] tracking-[0.15em] uppercase text-[var(--color-text-secondary)]">
                  {item.label} · {item.sub}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: active === "dugout" ? 1 : 0 }}
          transition={{ duration: 0.18 }}
          className={active === "dugout" ? "block" : "hidden"}
        >
          <DugoutEditor
            initialPages={initialDugoutPages}
            initialActivePageId={initialDugoutActivePageId}
          />
        </motion.div>
    </div>
  );
}

