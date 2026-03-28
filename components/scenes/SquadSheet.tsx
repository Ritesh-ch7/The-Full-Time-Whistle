"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Player {
  number: number;
  position: string;
  role: string;
  trait: string;
}

// 4-3-3 formation — rows: GK, DEF, MID, FWD
const formation: Player[][] = [
  // Forwards (top)
  [
    { number: 10, position: "LW", role: "Open Source", trait: "Always contributing" },
    { number: 9, position: "ST", role: "Builder at Heart", trait: "Ships things" },
    { number: 11, position: "RW", role: "Night Owl", trait: "Best commits at 1am" },
  ],
  // Midfield
  [
    { number: 11, position: "LM", role: "Football Brain", trait: "Reads the game" },
    { number: 8, position: "CM", role: "ML Engineer", trait: "The engine room" },
    { number: 7, position: "RM", role: "F1 Obsessive", trait: "Loves the data" },
  ],
  // Defence
  [
    { number: 3, position: "LB", role: "The Learner", trait: "Always overlapping" },
    { number: 5, position: "CB", role: "The Builder", trait: "Solid base" },
    { number: 6, position: "CB", role: "The Analyst", trait: "Data over noise" },
    { number: 2, position: "RB", role: "The Thinker", trait: "Full pitch view" },
  ],
  // Goalkeeper
  [
    { number: 1, position: "GK", role: "The Problem Solver", trait: "Never panics" },
  ],
];

function PlayerCard({ player }: { player: Player }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card */}
      <motion.div
        className="w-16 h-20 sm:w-20 sm:h-24 border border-[var(--color-gold)] border-opacity-40 flex flex-col items-center justify-center gap-1 bg-[var(--color-pitch)] bg-opacity-80 backdrop-blur-sm"
        animate={{ scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <span className="font-[var(--font-mono)] text-[10px] text-[var(--color-gold)]">
          #{player.number}
        </span>
        <span className="font-[var(--font-display)] text-xs font-bold text-[var(--color-chalk)] uppercase tracking-wide text-center leading-tight px-1">
          {player.position}
        </span>
      </motion.div>

      {/* Tooltip on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            className="absolute bottom-full mb-2 z-20 bg-[var(--color-concrete)] border border-[var(--color-gold)] border-opacity-40 p-3 min-w-[140px] text-center pointer-events-none"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-[var(--font-display)] text-xs font-bold text-[var(--color-gold)] uppercase tracking-wide mb-1">
              {player.role}
            </p>
            <p className="font-[var(--font-mono)] text-[10px] text-[var(--color-text-secondary)]">
              &ldquo;{player.trait}&rdquo;
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function SquadSheet() {
  return (
    <section
      id="squad-sheet"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-20 px-6"
      style={{ background: "var(--color-pitch)" }}
    >
      {/* Pitch SVG markings */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        
        {/* Outer pitch border */}
        <rect x="40" y="30" width="720" height="540" fill="none" stroke="#C9933A" strokeWidth="2" />
        {/* Centre line */}
        <line x1="40" y1="300" x2="760" y2="300" stroke="#C9933A" strokeWidth="1.5" />
        {/* Centre circle */}
        <circle cx="400" cy="300" r="70" fill="none" stroke="#C9933A" strokeWidth="1.5" />
        <circle cx="400" cy="300" r="3" fill="#C9933A" />
        {/* Top penalty area */}
        <rect x="230" y="30" width="340" height="120" fill="none" stroke="#C9933A" strokeWidth="1.5" />
        {/* Bottom penalty area */}
        <rect x="230" y="450" width="340" height="120" fill="none" stroke="#C9933A" strokeWidth="1.5" />
        {/* Cannon watermark in centre circle — faint */}
        <text x="400" y="310" textAnchor="middle" fill="#C9933A" fontSize="40" opacity="0.15" fontWeight="bold">⚙</text>
      </svg>

      {/* Section header */}
      <motion.div
        className="text-center mb-12 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p className="font-[var(--font-display)] text-xs tracking-[0.4em] text-[var(--color-gold)] uppercase mb-3">
          The Squad Sheet
        </p>
        <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-[var(--color-chalk)] uppercase tracking-tight">
          Starting XI
        </h2>
        <p className="font-[var(--font-mono)] text-xs text-[var(--color-text-secondary)] mt-2 tracking-widest">
          4 — 3 — 3 &nbsp;·&nbsp; Hover to expand
        </p>
      </motion.div>

      {/* Formation grid */}
      <motion.div
        className="relative z-10 flex flex-col gap-12 sm:gap-16 items-center w-full max-w-2xl"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {formation.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-8 sm:gap-14 justify-center flex-wrap">
            {row.map((player, pIdx) => (
              <PlayerCard key={pIdx} player={player} />
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  );
}

