"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ui/ProjectCard";

const ALL_TYPES = ["All", "ML", "Web", "Python", "TypeScript"];

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: "easeOut" },
  }),
};

export default function Kickoff() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.type.includes(activeFilter));

  return (
    <section
      id="kickoff"
      className="relative min-h-screen py-24 px-6 overflow-hidden"
    >
      {/* Dramatic light-flood entrance from tunnel darkness */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(12,26,12,0.95) 0%, var(--color-pitch) 15%)",
        }}
      />
      {/* Top floodlight burst */}
      <div
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 0%, rgba(201,147,58,0.12) 0%, transparent 80%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
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
            The Projects
          </h2>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          className="flex flex-wrap gap-2 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {ALL_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setActiveFilter(type)}
              className={`font-[var(--font-mono)] text-xs tracking-[0.2em] uppercase px-4 py-2 border transition-all duration-200 ${
                activeFilter === type
                  ? "border-[var(--color-gold)] text-[var(--color-gold)] bg-[var(--color-gold)] bg-opacity-10"
                  : "border-[var(--color-gold)] border-opacity-25 text-[var(--color-text-secondary)] hover:border-opacity-60 hover:text-[var(--color-chalk)]"
              }`}
            >
              {type}
            </button>
          ))}
        </motion.div>

        {/* Project cards */}
        <div className="flex flex-col gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={i}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <p className="font-[var(--font-mono)] text-[var(--color-text-secondary)] text-sm tracking-wider">
              No projects in this category yet.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

