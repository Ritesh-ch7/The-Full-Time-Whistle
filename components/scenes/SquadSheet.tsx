"use client";

import { useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";

interface Player {
  number: number;
  position: string;
  role: string;
  trait: string;
}

type FormationKey = "4-3-3" | "4-2-3-1" | "3-5-2" | "4-4-2" | "3-4-3" | "5-3-2" | "4-1-4-1";

const formations: Record<FormationKey, Player[][]> = {
  "4-3-3": [
    [
      { number: 10, position: "LW", role: "Backend APIs", trait: "Delivery layer for reliable user-facing services" },
      { number: 9, position: "ST", role: "HuggingFace", trait: "Puts model capabilities into real-world workflows" },
      { number: 11, position: "RW", role: "MCP Tooling", trait: "Connects tools end to end so things ship" },
    ],
    [
      { number: 17, position: "LM", role: "Agentic Frameworks", trait: "Orchestrates agents and distributed flows" },
      { number: 8, position: "CM", role: "ML/AI", trait: "Builds intelligence that powers decision-making" },
      { number: 7, position: "RM", role: "LLMs", trait: "Generates reasoning and language at the core" },
    ],
    [
      { number: 3, position: "LB", role: "Cloud", trait: "Scalable infrastructure that holds the shape" },
      { number: 5, position: "CB", role: "DevOps", trait: "Automation and deployment discipline" },
      { number: 6, position: "CB", role: "DBs", trait: "Data integrity and performance under pressure" },
      { number: 2, position: "RB", role: "Speech", trait: "Voice interfaces anchored to the platform" },
    ],
    [
      { number: 1, position: "GK", role: "Core Languages", trait: "Python and Java are the foundation that holds everything together" },
    ],
  ],
  "4-2-3-1": [
    [
      { number: 9, position: "ST", role: "Backend APIs", trait: "Delivery layer for reliable user-facing services" },
    ],
    [
      { number: 10, position: "LAM", role: "HuggingFace", trait: "Puts model capabilities into real-world workflows" },
      { number: 11, position: "CAM", role: "MCP Tooling", trait: "Connects tools end to end so things ship" },
      { number: 7, position: "RAM", role: "LLMs", trait: "Generates reasoning and language at the core" },
    ],
    [
      { number: 17, position: "CDM", role: "Agentic Frameworks", trait: "Orchestrates agents and distributed flows" },
      { number: 8, position: "CDM", role: "ML/AI", trait: "Builds intelligence that powers decision-making" },
    ],
    [
      { number: 3, position: "LB", role: "Cloud", trait: "Scalable infrastructure that holds the shape" },
      { number: 5, position: "CB", role: "DevOps", trait: "Automation and deployment discipline" },
      { number: 6, position: "CB", role: "DBs", trait: "Data integrity and performance under pressure" },
      { number: 2, position: "RB", role: "Speech", trait: "Voice interfaces anchored to the platform" },
    ],
    [
      { number: 1, position: "GK", role: "Core Languages", trait: "Python and Java are the foundation that holds everything together" },
    ],
  ],
  "3-5-2": [
    [
      { number: 9, position: "ST", role: "Backend APIs", trait: "Delivery layer for reliable user-facing services" },
      { number: 10, position: "ST", role: "HuggingFace", trait: "Puts model capabilities into real-world workflows" },
    ],
    [
      { number: 11, position: "LWB", role: "MCP Tooling", trait: "Connects tools end to end so things ship" },
      { number: 17, position: "LCM", role: "Agentic Frameworks", trait: "Orchestrates agents and distributed flows" },
      { number: 8, position: "CM", role: "ML/AI", trait: "Builds intelligence that powers decision-making" },
      { number: 7, position: "RCM", role: "LLMs", trait: "Generates reasoning and language at the core" },
      { number: 2, position: "RWB", role: "Speech", trait: "Voice interfaces anchored to the platform" },
    ],
    [
      { number: 3, position: "LCB", role: "Cloud", trait: "Scalable infrastructure that holds the shape" },
      { number: 5, position: "CB", role: "DevOps", trait: "Automation and deployment discipline" },
      { number: 6, position: "RCB", role: "DBs", trait: "Data integrity and performance under pressure" },
    ],
    [
      { number: 1, position: "GK", role: "Core Languages", trait: "Python and Java are the foundation that holds everything together" },
    ],
  ],
  "4-4-2": [
    [
      { number: 9, position: "ST", role: "Backend APIs", trait: "Delivery layer for reliable user-facing services" },
      { number: 10, position: "ST", role: "HuggingFace", trait: "Puts model capabilities into real-world workflows" },
    ],
    [
      { number: 11, position: "LM", role: "MCP Tooling", trait: "Connects tools end to end so things ship" },
      { number: 17, position: "LCM", role: "Agentic Frameworks", trait: "Orchestrates agents and distributed flows" },
      { number: 8, position: "RCM", role: "ML/AI", trait: "Builds intelligence that powers decision-making" },
      { number: 7, position: "RM", role: "LLMs", trait: "Generates reasoning and language at the core" },
    ],
    [
      { number: 3, position: "LB", role: "Cloud", trait: "Scalable infrastructure that holds the shape" },
      { number: 5, position: "CB", role: "DevOps", trait: "Automation and deployment discipline" },
      { number: 6, position: "CB", role: "DBs", trait: "Data integrity and performance under pressure" },
      { number: 2, position: "RB", role: "Speech", trait: "Voice interfaces anchored to the platform" },
    ],
    [
      { number: 1, position: "GK", role: "Core Languages", trait: "Python and Java are the foundation that holds everything together" },
    ],
  ],
  "3-4-3": [
    [
      { number: 10, position: "LW", role: "Backend APIs", trait: "Delivery layer for reliable user-facing services" },
      { number: 9, position: "ST", role: "HuggingFace", trait: "Puts model capabilities into real-world workflows" },
      { number: 11, position: "RW", role: "MCP Tooling", trait: "Connects tools end to end so things ship" },
    ],
    [
      { number: 3, position: "LM", role: "Cloud", trait: "Scalable infrastructure that holds the shape" },
      { number: 17, position: "LCM", role: "Agentic Frameworks", trait: "Orchestrates agents and distributed flows" },
      { number: 8, position: "RCM", role: "ML/AI", trait: "Builds intelligence that powers decision-making" },
      { number: 2, position: "RM", role: "Speech", trait: "Voice interfaces anchored to the platform" },
    ],
    [
      { number: 5, position: "LCB", role: "DevOps", trait: "Automation and deployment discipline" },
      { number: 6, position: "CB", role: "DBs", trait: "Data integrity and performance under pressure" },
      { number: 7, position: "RCB", role: "LLMs", trait: "Generates reasoning and language at the core" },
    ],
    [
      { number: 1, position: "GK", role: "Core Languages", trait: "Python and Java are the foundation that holds everything together" },
    ],
  ],
  "5-3-2": [
    [
      { number: 9, position: "ST", role: "Backend APIs", trait: "Delivery layer for reliable user-facing services" },
      { number: 10, position: "ST", role: "HuggingFace", trait: "Puts model capabilities into real-world workflows" },
    ],
    [
      { number: 17, position: "LCM", role: "Agentic Frameworks", trait: "Orchestrates agents and distributed flows" },
      { number: 8, position: "CM", role: "ML/AI", trait: "Builds intelligence that powers decision-making" },
      { number: 7, position: "RCM", role: "LLMs", trait: "Generates reasoning and language at the core" },
    ],
    [
      { number: 3, position: "LWB", role: "Cloud", trait: "Scalable infrastructure that holds the shape" },
      { number: 5, position: "LCB", role: "DevOps", trait: "Automation and deployment discipline" },
      { number: 6, position: "CB", role: "DBs", trait: "Data integrity and performance under pressure" },
      { number: 2, position: "RCB", role: "Speech", trait: "Voice interfaces anchored to the platform" },
      { number: 11, position: "RWB", role: "MCP Tooling", trait: "Connects tools end to end so things ship" },
    ],
    [
      { number: 1, position: "GK", role: "Core Languages", trait: "Python and Java are the foundation that holds everything together" },
    ],
  ],
  "4-1-4-1": [
    [
      { number: 9, position: "ST", role: "Backend APIs", trait: "Delivery layer for reliable user-facing services" },
    ],
    [
      { number: 10, position: "LM", role: "HuggingFace", trait: "Puts model capabilities into real-world workflows" },
      { number: 17, position: "LCM", role: "Agentic Frameworks", trait: "Orchestrates agents and distributed flows" },
      { number: 8, position: "RCM", role: "ML/AI", trait: "Builds intelligence that powers decision-making" },
      { number: 11, position: "RM", role: "MCP Tooling", trait: "Connects tools end to end so things ship" },
    ],
    [
      { number: 7, position: "CDM", role: "LLMs", trait: "Generates reasoning and language at the core" },
    ],
    [
      { number: 3, position: "LB", role: "Cloud", trait: "Scalable infrastructure that holds the shape" },
      { number: 5, position: "CB", role: "DevOps", trait: "Automation and deployment discipline" },
      { number: 6, position: "CB", role: "DBs", trait: "Data integrity and performance under pressure" },
      { number: 2, position: "RB", role: "Speech", trait: "Voice interfaces anchored to the platform" },
    ],
    [
      { number: 1, position: "GK", role: "Core Languages", trait: "Python and Java are the foundation that holds everything together" },
    ],
  ],
};

const formationOptions: FormationKey[] = ["4-3-3", "4-2-3-1", "3-5-2", "4-4-2", "3-4-3", "5-3-2", "4-1-4-1"];

const techStackByRole: Record<string, string[]> = {
  "Core Languages": ["Python API Development", "Python OOP", "Java OOP", "Java Multithreading", "Exception Handling"],
  Cloud: ["AWS Bedrock", "AWS Lambda", "AWS EC2", "Azure OpenAI", "Azure AI Search"],
  DevOps: ["Git", "JIRA", "Docker", "CI/CD"],
  DBs: ["MySQL", "Oracle DB", "Pinecone", "ChromaDB"],
  Speech: ["Azure AI Speech Services", "PipeCat", "FastMCP"],
  "Agentic Frameworks": ["CrewAI", "LangChain", "LangGraph", "FastMCP", "MCP Server Building"],
  "ML/AI": ["Scikit-learn", "BERT", "Prompt Engineering", "MLOps", "MLFlow"],
  LLMs: ["OpenAI", "Anthropic", "Gemini", "Llama", "Fine-tuning"],
  "Backend APIs": ["Python API Development", "Java Collections", "Java Multithreading", "FastMCP"],
  HuggingFace: ["Hugging Face", "BERT", "Fine-tuning", "Prompt Engineering"],
  "MCP Tooling": ["MCP Server Building", "FastMCP", "PipeCat", "Prompt Engineering"],
};

function PlayerCard({ player }: { player: Player }) {
  const [hovered, setHovered] = useState(false);
  const stack = techStackByRole[player.role] ?? [];

  return (
    <motion.div
      layout
      className="relative flex flex-col items-center cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      transition={{ layout: { type: "spring", stiffness: 420, damping: 34 } }}
    >
      {/* Card */}
      <motion.div
        layout
        layoutId={`player-${player.role}`}
        className="w-16 h-20 sm:w-20 sm:h-24 border border-[var(--color-gold)] border-opacity-40 flex flex-col items-center justify-center gap-1 bg-[var(--color-pitch)] bg-opacity-80 backdrop-blur-sm"
        animate={{ scale: hovered ? 1.1 : 1, y: hovered ? -2 : 0 }}
        transition={{ duration: 0.2, layout: { type: "spring", stiffness: 420, damping: 34 } }}
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
            className="absolute bottom-full mb-2 z-20 bg-[var(--color-concrete)] border border-[var(--color-gold)] border-opacity-40 p-4 min-w-[260px] sm:min-w-[300px] text-center pointer-events-none"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-[var(--font-display)] text-xs font-bold text-[var(--color-gold)] uppercase tracking-wide mb-1">
              {player.role}
            </p>
            <p className="font-[var(--font-mono)] text-[12px] text-[var(--color-text-secondary)]">
              &ldquo;{player.trait}&rdquo;
            </p>
            <div className="mt-2.5 flex flex-wrap justify-center gap-2">
              {stack.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 border border-[var(--color-gold)] border-opacity-40 text-[8px] sm:text-[9px] leading-none tracking-[0.08em] uppercase text-[var(--color-chalk)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function SquadSheet() {
  const [selectedFormation, setSelectedFormation] = useState<FormationKey>("4-3-3");

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

        <div className="mt-5 w-full max-w-xs mx-auto">
          <label
            htmlFor="formation-select"
            className="block text-[10px] sm:text-xs tracking-[0.25em] uppercase text-[var(--color-gold)] mb-2"
          >
            Formation
          </label>
          <select
            id="formation-select"
            value={selectedFormation}
            onChange={(event) => setSelectedFormation(event.target.value as FormationKey)}
            className="w-full px-4 py-2 bg-[var(--color-concrete)] text-[var(--color-gold)] border border-[var(--color-gold)] border-opacity-40 font-[var(--font-mono)] text-xs tracking-[0.2em] uppercase focus:outline-none focus:border-[var(--color-gold)]"
          >
            {formationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <p className="font-[var(--font-mono)] text-xs text-[var(--color-text-secondary)] mt-2 tracking-widest">
          {selectedFormation.replace(/-/g, " — ")} &nbsp;·&nbsp; Hover to expand
        </p>
      </motion.div>

      {/* Formation grid */}
      <LayoutGroup>
        <motion.div
          layout
          className="relative z-10 flex flex-col gap-12 sm:gap-16 items-center w-full max-w-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, layout: { type: "spring", stiffness: 360, damping: 32 } }}
        >
          {formations[selectedFormation].map((row, rowIdx) => (
            <motion.div
              key={rowIdx}
              layout
              className="flex gap-8 sm:gap-14 justify-center flex-wrap"
              transition={{ layout: { type: "spring", stiffness: 360, damping: 32 } }}
            >
              {row.map((player) => (
                <PlayerCard key={player.role} player={player} />
              ))}
            </motion.div>
          ))}
        </motion.div>
      </LayoutGroup>
    </section>
  );
}

