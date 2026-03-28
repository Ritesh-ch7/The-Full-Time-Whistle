"use client";

import { useRef, useEffect, RefObject, useState } from "react";
import { AnimatePresence, motion, MotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import careerData from "@/data/career.json";

/* ─── Types ──────────────────────────────────────────────────────────── */
interface Entry {
  id: string;
  type: "education" | "experience";
  institution: string;
  role: string;
  period: string;
  season: string;
  badge: string;
  description: string;
}

/* ─── Scroll → video.currentTime ─────────────────────────────────────
 * The smoothness trick:
 *  1. A passive scroll listener writes only to a targetTime ref (no DOM touch).
 *  2. A requestAnimationFrame loop reads targetTime and seeks the video.
 *  3. We skip a seek if the delta is < half a frame (1/48 s) to avoid
 *     flooding the decoder with near-identical seek requests.
 * ─────────────────────────────────────────────────────────────────── */
function useTunnelVideo(sectionRef: RefObject<HTMLElement | null>) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    // Keep the video paused — we drive it manually
    video.pause();

    const target = { time: 0 };
    const FPS = 24; // Source clip is authored at 24fps
    const FRAME = 1 / FPS;
    const HALF_FRAME = FRAME / 2;
    let raf: number;

    // RAF loop: apply the latest target time to the video element
    const tick = () => {
      if (video.readyState >= 2) {
        const delta = target.time - video.currentTime;
        if (Math.abs(delta) > HALF_FRAME) {
          video.currentTime = target.time;
        }
      }
      raf = requestAnimationFrame(tick);
    };

    // Scroll listener: pure maths, no DOM writes → stays off the main thread
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      const duration = video.duration || 8;
      const rawTime = progress * duration;
      const snappedTime = Math.round(rawTime / FRAME) * FRAME;
      target.time = Math.min(duration, snappedTime);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [sectionRef]);

  return videoRef;
}

/* ─── No full-screen overlay — the video speaks for itself.
 * Only a bottom gradient so card text stays legible. ─────────────── */

/* ─── Section header — centred, fades before first card ─────────────── */
function TunnelHeader() {
  return (
    <motion.div
      className="absolute top-8 left-4 sm:left-18 z-20 pointer-events-none max-w-xl"
    >
      <p className="text-[11px] tracking-[0.45em] text-[#C9933A] uppercase font-bold mb-2">
        Career Tunnel Walk
      </p>
      <h2 className="font-[var(--font-display)] text-4xl sm:text-5xl font-bold text-white uppercase tracking-tight text-left">
        My Career Journey
      </h2>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-px w-12 bg-[#C9933A] opacity-45" />
        <p className="text-[10px] tracking-[0.22em] text-[#E5C487] opacity-85 uppercase">
          Scroll through each phase
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Career card — rises at the bottom like a pitchside hoarding ───── */
function CareerCard({
  entry,
}: {
  entry: Entry;
}) {
  return (
    <motion.div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-md"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <p className="inline-flex items-center justify-center mx-auto px-4 py-1.5 mb-3 text-center text-[12px] tracking-[0.18em] text-[#F6DEB0] font-bold uppercase bg-[rgba(0,0,0,0.6)] border border-[rgba(201,147,58,0.55)] rounded-sm shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
        {entry.badge}
      </p>
      <div
        className="px-6 py-6 text-center"
        style={{
          background: "rgba(4, 8, 6, 0.70)",
          border: "1px solid rgba(201, 147, 58, 0.28)",
          backdropFilter: "blur(20px)",
          borderRadius: "2px",
        }}
      >
        <p className="inline-flex items-center justify-center mx-auto px-3 py-1 mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F4D9A4] bg-[rgba(4,8,6,0.82)] border border-[rgba(201,147,58,0.45)] rounded-sm shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
          {entry.season}
        </p>
        <h3 className="text-xl font-bold text-white uppercase tracking-wide mb-2">
          {entry.institution}
        </h3>
        <p className="text-base text-[#C9933A] mb-3">{entry.role}</p>
        <p className="text-sm text-gray-300 leading-6">{entry.description}</p>
        <p className="text-xs text-gray-400 mt-4 tracking-[0.12em]">{entry.period}</p>
      </div>
    </motion.div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────── */
export default function WalkingToGround() {
  const sectionRef = useRef<HTMLElement>(null);
  const entries = careerData as Entry[];
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);

  // Framer Motion scroll progress — used for card & overlay animations
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const slots = entries.length + 2;
    const firstCardStart = 1 / slots;
    const lastCardEnd = (entries.length + 1) / slots;

    if (latest < firstCardStart || latest > lastCardEnd) {
      setActiveCardIndex(null);
      return;
    }

    const nextIndex = Math.floor(latest * slots) - 1;
    const clamped = Math.max(0, Math.min(entries.length - 1, nextIndex));
    setActiveCardIndex(clamped);
  });

  // Raw video scrubbing — independent of Framer Motion
  const videoRef = useTunnelVideo(sectionRef);

  // Taller section = slower, more cinematic walk-out feeling
  const sectionHeight = `${(entries.length + 3) * 100}vh`;

  return (
    <section id="walking-to-ground" ref={sectionRef} style={{ height: sectionHeight }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-black">

        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain object-center"
          src="/footenter.mp4"
          preload="auto"
          muted
          playsInline
          disablePictureInPicture
        />

        {/* Bottom gradient — only behind the card area so text is readable */}
        <div
          className="absolute bottom-0 left-0 right-0 h-64 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 100%)" }}
        />

        <TunnelHeader />

        <AnimatePresence mode="wait">
          {activeCardIndex !== null ? (
            <CareerCard
              key={entries[activeCardIndex].id}
              entry={entries[activeCardIndex]}
            />
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  );
}

