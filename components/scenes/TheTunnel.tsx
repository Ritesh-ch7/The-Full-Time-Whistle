"use client";

import { motion, type Variants } from "framer-motion";

const paragraphs = [
  "I build things that learn.",
  "I'm a software engineer working in machine learning — the kind of work where you spend three days debugging a pipeline, and the moment it finally works feels like a last-minute winner.",
  "I watch football the way most people watch films. Tactical, emotional, occasionally shouting at the screen. I play it too — badly enough to stay humble, good enough to keep coming back.",
  "F1 is my other obsession. Not just the racing — the data, the strategy, the margins. There's a reason I ended up in ML.",
  "This site is my corner of the internet. Projects I've built, thoughts I've had, and the occasional post that's half technical write-up, half match analysis.",
];

const quote = "The best players make the people around them better.";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, delay: i * 0.12, ease: "easeOut" as const },
  }),
};

export default function TheTunnel() {
  return (
    <section
      id="dressing-room"
      className="relative min-h-screen flex items-center justify-center bg-[var(--color-tunnel)] overflow-hidden py-24 px-6"
    >
      {/* Tunnel vignette — left and right walls */}
      <div
        className="absolute inset-0 pointer-events-none vignette"
        style={{
          boxShadow:
            "inset 120px 0 160px rgba(0,0,0,0.85), inset -120px 0 160px rgba(0,0,0,0.85)",
        }}
      />

      {/* Warm light bleed at the bottom — the pitch ahead */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(201,147,58,0.08) 0%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[600px]">
        {/* Section label */}
        <motion.p
          className="font-[var(--font-display)] text-base sm:text-xl font-bold tracking-[0.4em] text-[var(--color-gold)] uppercase mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          custom={0}
        >
          The Dressing Room
        </motion.p>

        {/* Prose paragraphs */}
        <div className="space-y-6">
          {paragraphs.map((p, i) => (
            <motion.p
              key={i}
              className={`font-[var(--font-body)] leading-relaxed text-[var(--color-chalk)] ${
                i === 0
                  ? "text-2xl sm:text-3xl font-medium"
                  : "text-base sm:text-lg opacity-90"
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              custom={i + 1}
            >
              {p}
            </motion.p>
          ))}
        </div>

        {/* Divider */}
        <motion.div
          className="my-10 flex items-center gap-4"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          custom={paragraphs.length + 1}
        >
          <div className="h-px flex-1 bg-[var(--color-gold)] opacity-30" />
          <span className="font-[var(--font-mono)] text-[10px] tracking-[0.3em] text-[var(--color-text-secondary)] uppercase">
            ———
          </span>
          <div className="h-px flex-1 bg-[var(--color-gold)] opacity-30" />
        </motion.div>

        {/* Quote */}
        <motion.blockquote
          className="font-[var(--font-display)] text-2xl sm:text-3xl font-bold text-[var(--color-gold)] leading-snug tracking-wide"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={fadeUp}
          custom={paragraphs.length + 2}
        >
          &ldquo;{quote}&rdquo;
        </motion.blockquote>
      </div>
    </section>
  );
}

