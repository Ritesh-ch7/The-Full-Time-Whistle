"use client";

import { motion, type Variants } from "framer-motion";

const links = [
  { icon: "📧", label: "your@email.com", href: "mailto:your@email.com" },
  { icon: "🐙", label: "github.com/yourhandle", href: "https://github.com/yourhandle" },
  { icon: "💼", label: "linkedin.com/in/yourhandle", href: "https://linkedin.com/in/yourhandle" },
  { icon: "🐦", label: "@yourhandle", href: "https://twitter.com/yourhandle" },
];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export default function FinalWhistle() {
  return (
    <section
      id="post-match"
      className="relative min-h-screen flex flex-col items-center justify-center bg-[var(--color-pitch)] px-6 py-24 overflow-hidden"
    >
      {/* Floodlight glow from top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 35% at 50% -5%, rgba(201,147,58,0.14) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-3xl text-center">
        {/* Full time badge */}
        <motion.p
          className="font-[var(--font-display)] text-xs tracking-[0.4em] text-[var(--color-gold)] uppercase mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
        >
          FULLTIME
        </motion.p>

        {/* Scoreboard */}
        <motion.div
          className="mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={1}
        >
          <div className="font-[var(--font-display)] text-4xl sm:text-6xl lg:text-7xl font-bold text-[var(--color-gold)] tracking-tight leading-none flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
            <span className="text-[var(--color-text-secondary)]">YOU</span>
            <span className="text-[var(--color-chalk)]">0 — 1</span>
            <span className="text-[var(--color-chalk)]">Your Name</span>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="h-px bg-[var(--color-gold)] opacity-30 mb-10 max-w-md mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={2}
        />

        {/* Tagline */}
        <motion.p
          className="font-[var(--font-body)] text-[var(--color-text-secondary)] text-base sm:text-lg max-w-md mx-auto mb-12 leading-relaxed"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={3}
        >
          Always up for a good conversation about ML, football, F1 — or ideally
          all three at once.
        </motion.p>

        {/* Contact links */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {links.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              target={link.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-[var(--font-mono)] text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-gold)] transition-colors duration-200 group"
              variants={fadeUp}
              custom={0}
              whileHover={{ scale: 1.02 }}
            >
              <span>{link.icon}</span>
              <span className="group-hover:underline underline-offset-4">
                {link.label}
              </span>
            </motion.a>
          ))}
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-[var(--color-gold)] opacity-20 mb-8 max-w-md mx-auto" />

        {/* Footer */}
        <motion.p
          className="font-[var(--font-mono)] text-[10px] tracking-[0.2em] text-[var(--color-text-secondary)] opacity-50 uppercase"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={8}
        >
          © Your Name · Built with Next.js · Deployed on Vercel
        </motion.p>
      </div>
    </section>
  );
}

