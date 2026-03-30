"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Data ─────────────────────────────────────────────────────────────────────
const tactics = [
  {
    number: "01",
    title: "Agentic & Generative AI",
    description:
      "Agents that understand intent, speak languages, and act autonomously across systems.",
    tags: ["CrewAI", "Pipecat", "MCP", "Langfuse", "Twilio"],
    bullets: [
      "CrewAI-based enterprise agents with organisational data access",
      "Multilingual avatar chatbots with real-time STT/TTS (Arabic & English)",
      "Real-time voice agents for customer support via Twilio & Pipecat",
      "MCP servers for modular, reusable AI tooling across solutions",
      "Agent traceability & LLM cost monitoring via Langfuse",
    ],
  },
  {
    number: "02",
    title: "Predictive Modelling",
    description:
      "Credit risk, payment default — turning behavioural and historical data into real decisions.",
    tags: ["Scikit-learn", "XGBoost", "Feature Eng.", "Risk Models"],
    bullets: [
      "Classification & regression for payment default prediction",
      "Financial risk assessment from historical & behavioural data",
      "Data cleaning, outlier treatment, log transforms, feature encoding",
      "Proactive credit risk management, reduced manual intervention",
    ],
  },
  {
    number: "03",
    title: "NLP & Automation",
    description:
      "Ticket routing, workflow optimisation — rule-ML hybrids that cut manual intervention.",
    tags: ["NLP", "Classification", "Automation", "NOC"],
    bullets: [
      "NLP-based classification for automated ticket routing",
      "Hybrid rule-ML systems for NOC workflow optimisation",
      "Significantly reduced manual intervention and resolution time",
    ],
  },
  {
    number: "04",
    title: "Backend & APIs",
    description:
      "Scalable FastAPI services and pipelines — the engineering layer that makes AI production-ready.",
    tags: ["FastAPI", "REST", "Docker", "Auth"],
    bullets: [
      "Scalable RESTful APIs for AI workflows, data retrieval & automation",
      "Secure access controls, business logic & workflow automation",
      "Modular FastAPI design interfacing models, DBs & frontends",
    ],
  },
];

// ─── Number panel ─────────────────────────────────────────────────────────────
function NumberPanel({ number, hovered }: { number: string; hovered: boolean }) {
  return (
    <div
      style={{
        width: 96,
        flexShrink: 0,
        background: "#060D06",
        borderRight: `1px solid ${hovered ? "rgba(201,147,58,0.3)" : "#1E3A1E"}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        transition: "border-color 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle radial glow behind number */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: hovered
            ? "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,147,58,0.08) 0%, transparent 70%)"
            : "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(139,26,26,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      {/* Large numeral */}
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 56,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          backgroundImage: hovered
            ? "linear-gradient(160deg, #C9933A 0%, #e8c47a 50%, #C9933A 100%)"
            : "linear-gradient(160deg, #3a2010 0%, #6b4020 50%, #3a2010 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          userSelect: "none",
          position: "relative",
        }}
        aria-hidden
      >
        {number}
      </span>
      {/* Thin gold rule below number */}
      <div
        style={{
          width: 24,
          height: 1,
          background: hovered ? "#C9933A" : "#2a1a0a",
          transition: "background 0.35s ease",
          position: "relative",
        }}
      />
    </div>
  );
}

// ─── Individual tactic card ───────────────────────────────────────────────────
function TacticCard({
  tactic,
  index,
  isOpen,
  onToggle,
}: {
  tactic: (typeof tactics)[number];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        background: "#0C1A0C",
        border: `1px solid ${hovered ? "#C9933A" : "#1E3A1E"}`,
        borderRadius: 10,
        overflow: "hidden",
        transform: hovered ? "translateX(3px)" : "translateX(0)",
        transition: "border-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease",
        boxShadow: hovered ? "0 4px 24px rgba(201,147,58,0.10)" : "none",
      }}
    >
      {/* ── Accent bar ── */}
      <div
        style={{
          width: 4,
          flexShrink: 0,
          background: hovered ? "#C9933A" : "#8B1A1A",
          transition: "background 0.3s ease",
        }}
      />

      {/* ── Number panel ── */}
      <NumberPanel number={tactic.number} hovered={hovered} />

      {/* ── Card body ── */}
      <div style={{ flex: 1, padding: "14px 18px" }}>

        {/* Label row */}
        <div style={{ marginBottom: 8 }}>
          <span
            style={{
              fontSize: 11,
              color: hovered ? "#C9933A" : "#5a4030",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "var(--font-mono)",
              transition: "color 0.3s ease",
            }}
          >
            Tactic {tactic.number}
          </span>
        </div>

        {/* Title */}
        <h3
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#F0EDE6",
            margin: "0 0 8px",
            fontFamily: "var(--font-display)",
            letterSpacing: "0.01em",
            textTransform: "uppercase",
          }}
        >
          {tactic.title}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: 14,
            color: "#A89880",
            lineHeight: 1.6,
            margin: "0 0 13px",
            fontFamily: "var(--font-body)",
          }}
        >
          {tactic.description}
        </p>

        {/* Tech tags */}
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 13 }}
        >
          {tactic.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 3,
                background: "#1a3a1a",
                color: "#C9933A",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.08em",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Expand toggle */}
        <button
          onClick={onToggle}
          style={{
            fontSize: 12,
            color: isOpen ? "#C9933A" : "#8B1A1A",
            background: "none",
            border: "none",
            cursor: "pointer",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            padding: 0,
            fontFamily: "var(--font-mono)",
            transition: "color 0.25s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#C9933A")}
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = isOpen ? "#C9933A" : "#8B1A1A")
          }
          aria-expanded={isOpen}
        >
          {isOpen ? "Hide the stats ↑" : "See the stats →"}
        </button>

        {/* ── Expandable detail drawer ── */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="detail"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              style={{ overflow: "hidden" }}
            >
              <ul
                style={{
                  borderTop: "1px solid #1E3A1E",
                  marginTop: 13,
                  paddingTop: 12,
                  paddingLeft: 0,
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {tactic.bullets.map((bullet, bi) => (
                  <li
                    key={bi}
                    style={{ display: "flex", gap: 9, alignItems: "flex-start" }}
                  >
                    <span
                      style={{
                        color: "#C9933A",
                        fontSize: 13,
                        marginTop: 1,
                        flexShrink: 0,
                        lineHeight: 1.6,
                      }}
                      aria-hidden
                    >
                      —
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#7a8a7a",
                        lineHeight: 1.6,
                        fontFamily: "var(--font-body)",
                      }}
                    >
                      {bullet}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function TacticCards() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {tactics.map((tactic, i) => (
        <TacticCard
          key={tactic.number}
          tactic={tactic}
          index={i}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex(openIndex === i ? null : i)}
        />
      ))}
    </div>
  );
}


