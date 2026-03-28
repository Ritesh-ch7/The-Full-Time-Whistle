"use client";

import { motion } from "framer-motion";
import { Project } from "@/data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  const statusIcon = project.status === "Shipped" ? "✓" : project.status === "In Progress" ? "⚙" : "—";
  const statusColour =
    project.status === "Shipped"
      ? "text-[var(--color-gold)]"
      : project.status === "In Progress"
      ? "text-[var(--color-amber)]"
      : "text-[var(--color-text-secondary)]";

  return (
    <motion.div
      className="border border-[var(--color-gold)] border-opacity-25 p-6 sm:p-8 hover:border-opacity-60 transition-all duration-300 group relative overflow-hidden"
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(201,147,58,0.05) 0%, transparent 70%)" }}
      />

      {/* Project number */}
      <p className="font-[var(--font-mono)] text-[10px] tracking-[0.3em] text-[var(--color-text-secondary)] mb-4 uppercase">
        Project {project.id}
      </p>

      {/* Name vs Problem */}
      <div className="flex items-baseline gap-3 flex-wrap mb-4">
        <h3 className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[var(--color-chalk)] uppercase tracking-tight">
          {project.name}
        </h3>
        <span className="font-[var(--font-display)] text-sm tracking-[0.3em] text-[var(--color-gold)] uppercase">
          vs
        </span>
        <h4 className="font-[var(--font-display)] text-xl sm:text-2xl font-bold text-[var(--color-text-secondary)] uppercase tracking-tight">
          {project.problem}
        </h4>
      </div>

      {/* Description */}
      <p className="font-[var(--font-body)] text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6">
        {project.description}
      </p>

      {/* Stack + status row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="font-[var(--font-mono)] text-[10px] tracking-wider text-[var(--color-text-secondary)] border border-[var(--color-gold)] border-opacity-20 px-2 py-0.5 uppercase"
            >
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <span className={`font-[var(--font-mono)] text-xs tracking-wider ${statusColour} uppercase`}>
            {project.status} {statusIcon}
          </span>

          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[var(--font-mono)] text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-gold)] transition-colors tracking-wider uppercase"
            >
              GitHub →
            </a>
          )}

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-[var(--font-mono)] text-[10px] text-[var(--color-text-secondary)] hover:text-[var(--color-gold)] transition-colors tracking-wider uppercase"
            >
              Live →
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

