"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  type MotionValue,
} from "framer-motion";
import Image from "next/image";

const slides = [
      { src: `/CarouselImages/1.png`,   label: '' },
      { src: `/CarouselImages/2.jpeg`,  label: '' },
      { src: `/CarouselImages/3.jpeg`,  label: '' },
      { src: `/CarouselImages/4.jpeg`,  label: '' },
      { src: `/CarouselImages/5.jpg`,   label: '' },
      { src: `/CarouselImages/6.jpg`,   label: '' },
      { src: `/CarouselImages/7.jpg`,   label: '' },
      { src: `/CarouselImages/8.jpg`,   label: '' },
      { src: `/CarouselImages/9.jpg`,   label: '' },
      { src: `/CarouselImages/10.jpg`,  label: '' },
      { src: `/CarouselImages/11.jpg`,  label: '' },
      { src: `/CarouselImages/12.jpg`,  label: '' },
      { src: `/CarouselImages/13.jpg`,  label: '' },
      { src: `/CarouselImages/14.jpg`,  label: '' },
      { src: `/CarouselImages/15.jpg`,  label: '' },
      { src: `/CarouselImages/16.jpeg`, label: '' },
];

/* ── constants ── */
const CARD_WIDTH_CSS = "clamp(160px, 18vw, 260px)";
const GAP = 28;                       // desired px gap between cards

/**
 * Compute a radius that guarantees no overlap.
 *
 *   chord between adjacent centres = 2 · R · sin(π / N)
 *   We need chord ≥ cardWidth + gap
 *   →  R = (cardWidth + gap) / (2 · sin(π / N))
 *
 * Because CSS clamp is viewport-dependent we estimate the card width at
 * runtime; the fallback hard-codes the clamp midpoint (~230 px).
 */
function autoRadius(count: number, estimatedCardWidth = 230) {
  return Math.ceil(
    (estimatedCardWidth + GAP) / (2 * Math.sin(Math.PI / count))
  );
}

/* ── helper: per-card inline style ── */
function cardStyle(i: number, count: number, radius: number) {
  const theta = (360 / count) * i;
  return {
    position: "absolute" as const,
    width: CARD_WIDTH_CSS,
    aspectRatio: "3 / 4",
    transform: `rotateY(${theta}deg) translateZ(${radius}px)`,
    backfaceVisibility: "hidden" as const,
  };
}

/* ── Card (pure presentation) ── */
function Card({ src, label }: { src: string; label: string }) {
  return (
    <div className="w-full h-full rounded-2xl overflow-hidden shadow-[0_10px_50px_rgba(0,0,0,0.35)]">
      <Image
        src={src}
        alt={label}
        className="w-full h-full object-cover select-none pointer-events-none"
        draggable={false}
        width={600}
        height={800}
      />
    </div>
  );
}

/* ── Main carousel ── */
export default function ConcaveCarousel() {
  const count = slides.length;
  const containerRef = useRef<HTMLDivElement>(null);

  /* Compute radius once on mount (and on resize) so it adapts to viewport */
  const [radius, setRadius] = useState(() => autoRadius(count));

  useEffect(() => {
    function measure() {
      if (!containerRef.current) return;
      // Read the actual rendered card width from the first card element
      const card = containerRef.current.querySelector<HTMLElement>("[data-card]");
      const w = card ? card.offsetWidth : 230;
      setRadius(autoRadius(count, w));
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [count]);

  /* framer-motion values */
  const rawAngle = useMotionValue(0);
  const angle: MotionValue<number> = useSpring(rawAngle, {
    stiffness: 60,
    damping: 20,
    mass: 0.8,
  });

  /* refs for drag mechanics */
  const dragging = useRef(false);
  const lastX = useRef(0);
  const velocityX = useRef(0);
  const rafId = useRef(0);

  /* ── auto-rotate ── */
  useEffect(() => {
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = now - prev;
      prev = now;
      if (!dragging.current) {
        // ~18°/sec at 60 fps
        rawAngle.set(rawAngle.get() + 0.018 * dt);
      }
      rafId.current = requestAnimationFrame(tick);
    };
    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, [rawAngle]);

  /* ── pointer handlers ── */
  const onDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true;
      lastX.current = e.clientX;
      velocityX.current = 0;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [],
  );

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - lastX.current;
      lastX.current = e.clientX;
      velocityX.current = dx;
      rawAngle.set(rawAngle.get() + dx * 0.2);
    },
    [rawAngle],
  );

  const onUp = useCallback(() => {
    if (!dragging.current) return;
    dragging.current = false;
    /* momentum flick */
    rawAngle.set(rawAngle.get() + velocityX.current * 3);
    velocityX.current = 0;
  }, [rawAngle]);

  return (
    <div
      ref={containerRef}
      className="relative w-full cursor-grab active:cursor-grabbing select-none"
      style={{
        height: "clamp(360px, 50vw, 620px)",
        perspective: `${Math.max(1400, radius * 3)}px`,
        perspectiveOrigin: "center 42%",
      }}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transformStyle: "preserve-3d",
          rotateY: angle,
        }}
      >
        {slides.map((s, i) => (
          <div key={i} data-card style={cardStyle(i, count, radius)}>
            <Card src={s.src} label={s.label} />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
