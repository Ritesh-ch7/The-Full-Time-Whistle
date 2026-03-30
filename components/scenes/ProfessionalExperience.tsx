"use client";

import { motion } from "framer-motion";
import TacticCards from "@/components/scenes/TacticCards";

// ─── Section ──────────────────────────────────────────────────────────────────
export default function ProfessionalExperience() {
  return (
    <section
      id="kickoff"
      className="relative min-h-screen py-24 px-6 overflow-hidden"
    >
      {/* Pitch-flood background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(12,26,12,0.97) 0%, var(--color-pitch) 20%)",
        }}
      />
      {/* Floodlight burst */}
      <div
        className="absolute top-0 left-0 right-0 h-56 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 100% at 50% 0%, rgba(201,147,58,0.10) 0%, transparent 80%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Section header */}
        <motion.div
          className="mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <p className="font-[var(--font-display)] text-xs tracking-[0.4em] text-[var(--color-gold)] uppercase mb-4">
            Kickoff
          </p>
          <h2 className="font-[var(--font-display)] text-5xl sm:text-6xl font-bold text-[var(--color-chalk)] uppercase tracking-tight leading-none">
            The Work
          </h2>
          <p className="font-[var(--font-mono)] text-xs tracking-[0.25em] text-[var(--color-text-secondary)] uppercase mt-4">
            How I Play · Select a position for the full match report
          </p>
        </motion.div>

        {/* Gold rule */}
        <motion.div
          className="h-px bg-[var(--color-gold)] opacity-20 mb-12"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 0.2 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ originX: 0 }}
        />

        {/* Tactic Cards — full-width horizontal stack */}
        <TacticCards />

        {/* Bottom rule */}
        <div className="h-px bg-[var(--color-gold)] opacity-15 mt-14" />
      </div>
    </section>
  );
}
