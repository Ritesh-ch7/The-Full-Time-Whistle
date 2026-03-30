"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, type Variants } from "framer-motion";

// ─── Seeded particle config (generated once on mount, avoids hydration mismatch)
interface ParticleConfig {
  size: number;
  x: number;
  duration: number;
  delay: number;
}

function generateParticles(count: number): ParticleConfig[] {
  // Simple deterministic-enough pseudo-random using index as seed
  return Array.from({ length: count }, (_, i) => ({
    size: ((i * 7 + 3) % 3) + 1,
    x: (i * 37) % 100,
    duration: ((i * 13) % 8) + 6,
    delay: (i * 0.17) % 5,
  }));
}

// ─── Floating particle ────────────────────────────────────────────────────────
function Particle({ cfg }: { cfg: ParticleConfig }) {
  return (
    <motion.div
      className="absolute rounded-full bg-[var(--color-gold)] pointer-events-none"
      style={{
        width: cfg.size,
        height: cfg.size,
        left: `${cfg.x}%`,
        bottom: "-4px",
        opacity: 0,
      }}
      animate={{ y: [0, -1100], opacity: [0, 0.7, 0] }}
      transition={{
        duration: cfg.duration,
        delay: cfg.delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

// ─── Live date ────────────────────────────────────────────────────────────────
function LiveDate() {
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const formatted = new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    setDateStr(formatted.toUpperCase());
  }, []);

  return (
    <span className="font-[var(--font-mono)] text-xs tracking-[0.25em] text-[var(--color-text-secondary)]">
      MATCHDAY  •  {dateStr}
    </span>
  );
}

// ─── Typed fade-up variant ────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: "easeOut" as const },
  }),
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function MatchdayCard() {
  const PARTICLES = generateParticles(30);
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);   // direct DOM ref — no re-renders

  // Bypass React state entirely: mutate the glow element's style directly
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!sectionRef.current || !glowRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.left = `${x - 350}px`;
    glowRef.current.style.top  = `${y - 350}px`;
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <section
      id="matchday-card"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--color-pitch)]"
    >
      {/* ── Full-section background video — blurred, darkened, cinematic ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <video
          className="w-full h-full object-cover object-center"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/image copy.png"
          style={{ opacity: 0.88, filter: "blur(2px)", transform: "scale(1.05)" }}
          aria-hidden="true"
        >
          <source src="/stadium.mp4" type="video/mp4" />
        </video>
      </div>

      {/* ── Gradient overlay — dark at top & bottom, slightly lifted in centre ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(10,10,10,0.92) 0%,
            rgba(10,10,10,0.60) 40%,
            rgba(10,10,10,0.60) 60%,
            rgba(10,10,10,0.92) 100%
          )`,
        }}
      />

      {/* ── Static floodlight glow from top ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% -5%, rgba(201,147,58,0.16) 0%, transparent 70%)",
        }}
      />

      {/* ── Cursor floodlight glow — ref-driven, zero React re-renders ── */}
      <div
        ref={glowRef}
        className="absolute pointer-events-none z-0"
        style={{
          width: 700,
          height: 700,
          borderRadius: "50%",
          left: -350,
          top: -350,
          background:
            "radial-gradient(circle, rgba(201,147,58,0.22) 0%, rgba(232,160,32,0.10) 35%, transparent 68%)",
        }}
      />

      {/* ── Floating particles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((cfg, i) => (
          <Particle key={i} cfg={cfg} />
        ))}
      </div>

      {/* ── Programme card ── */}
      <motion.div
        className="relative z-10 w-full max-w-3xl mx-4 my-8 min-h-[75vh] flex flex-col"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        {/* Single frame */}
        <div
          className="border border-[var(--color-gold)] border-opacity-70 flex flex-col flex-1"
          style={{ background: "rgba(10,10,10,0.60)", backdropFilter: "blur(8px)" }}
        >

            {/* ── Top header strip ── */}
            <motion.div
              className="flex items-center justify-between px-6 py-3 border-b border-[var(--color-gold)] border-opacity-40"
              variants={fadeUp}
              custom={0}
            >
              <span className="font-[var(--font-mono)] text-[11px] tracking-[0.28em] text-[var(--color-gold)] uppercase">
                Issue 001 · Volume 1 · Official Programme
              </span>
              <span className="font-[var(--font-mono)] text-[11px] tracking-[0.2em] text-[var(--color-text-secondary)] uppercase">
                2025/26
              </span>
            </motion.div>

            {/* ── Live date ── */}
            <motion.div
              className="flex items-center justify-center border-b border-[var(--color-gold)] border-opacity-40 py-3"
              variants={fadeUp}
              custom={0.18}
            >
              <LiveDate />
            </motion.div>

            {/* ── Main card body ── */}
            <div className="px-8 sm:px-10 py-8 flex-1 flex flex-col justify-center">

              {/* Name vs Internet */}
              <motion.div className="text-center mb-7" variants={fadeUp} custom={0.26}>
                <h1 className="font-[var(--font-display)] text-5xl sm:text-6xl font-bold leading-none tracking-tight text-[var(--color-chalk)] uppercase">
                  Ritesh Chintakindi
                </h1>
                <p className="font-[var(--font-display)] text-base tracking-[0.5em] text-[var(--color-gold)] my-3 uppercase">
                  — vs —
                </p>
                <h2 className="font-[var(--font-display)] text-3xl sm:text-4xl font-bold leading-none tracking-tight text-[var(--color-text-secondary)] uppercase">
                  Unsolved Problems
                </h2>
              </motion.div>

              {/* Thin rule */}
              <motion.div className="h-px bg-[var(--color-gold)] opacity-40 mb-6" variants={fadeUp} custom={0.33} />

              {/* Venue · Kick Off · Role strip */}
              <motion.div
                className="grid grid-cols-3 gap-2 mb-6 text-center"
                variants={fadeUp}
                custom={0.38}
              >
                {[
                  { label: "Venue", value: "India" },
                  { label: "Kick Off", value: "Always" },
                  { label: "Season", value: "2025/26" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="font-[var(--font-mono)] text-[9px] tracking-[0.2em] text-[var(--color-text-secondary)] uppercase mb-1">
                      {label}
                    </p>
                    <p className="font-[var(--font-body)] text-[var(--color-chalk)] text-sm">
                      {value}
                    </p>
                  </div>
                ))}
              </motion.div>

              {/* Thin rule */}
              <motion.div className="h-px bg-[var(--color-gold)] opacity-40 mb-5" variants={fadeUp} custom={0.43} />

              {/* Professional stack — stays on the card */}
              <motion.p
                className="font-[var(--font-mono)] text-[10px] tracking-[0.18em] text-[var(--color-text-secondary)] text-center uppercase mb-8"
                variants={fadeUp}
                custom={0.46}
              >
                Software Engineer · Machine Learning
              </motion.p>

              {/* Scroll prompt — more prominent CTA */}
              <motion.div className="flex justify-center" variants={fadeUp} custom={0.52}>
                <motion.button
                  onClick={() =>
                    document.getElementById("squad-sheet")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="group cursor-pointer flex flex-col items-center gap-2"
                  animate={{ y: [0, 7, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="font-[var(--font-display)] text-xl tracking-[0.4em] text-[var(--color-gold)] uppercase group-hover:text-[var(--color-amber)] transition-colors">
                    Kick Off
                  </span>
                  <span
                    className="text-[var(--color-gold)] group-hover:text-[var(--color-amber)] transition-colors"
                    style={{ fontSize: "1.6rem", lineHeight: 1 }}
                  >
                    ↓
                  </span>
                </motion.button>
              </motion.div>
            </div>

            {/* ── Bottom footer strip ── */}
            <motion.div
              className="flex items-center justify-center border-t border-[var(--color-gold)] border-opacity-40 px-6 py-3"
              variants={fadeUp}
              custom={0.58}
            >
              <span className="font-[var(--font-mono)] text-[9px] tracking-[0.25em] text-[var(--color-text-secondary)] uppercase">
                Est. 2026 · Built in Public · Matchday Edition
              </span>
            </motion.div>

        </div>

        {/* Personality context — below the card, outside the frame */}
        <motion.p
          className="text-center mt-5 font-[var(--font-mono)] text-[10px] tracking-[0.28em] text-[var(--color-text-secondary)] uppercase"
          variants={fadeUp}
          custom={0.65}
        >
          Fueled by Football & Formula 1
        </motion.p>
      </motion.div>
    </section>
  );
}


