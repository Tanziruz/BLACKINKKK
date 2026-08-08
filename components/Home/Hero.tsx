"use client";

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../Buttons_And_Links/Button";
import { EntryStagger, EntryItem } from "../Animate";

const thumbnails = [
  { src: "/Img1.avif", label: "Sage Green" },
  { src: "/Img2.avif", label: "Red" },
  { src: "/Img3.avif", label: "Navy Blue" },
  { src: "/Img4.avif", label: "Off White" },
  { src: "/Img5.avif", label: "Black" },
  { src: "/Img6.avif", label: "Maroon" },
];

const SLIDE_DURATION = 5; // seconds

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "5%" : "-5%",
    opacity: 0,
    scale: 1.06,
  }),
  center: {
    x: "0%",
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? "5%" : "-5%",
    opacity: 0,
    scale: 0.96,
  }),
};

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(2);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % thumbnails.length);
    setProgressKey((k) => k + 1);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + thumbnails.length) % thumbnails.length);
    setProgressKey((k) => k + 1);
  }, []);

  const handleSelect = (index: number) => {
    if (index === activeIndex) return;
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setProgressKey((k) => k + 1);
  };

  const active = thumbnails[activeIndex];

  return (
    <section
      className="relative h-dvh w-full overflow-hidden flex flex-col justify-center items-center pb-32 pt-10 group/hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image Slider */}
      <div className="absolute inset-0 -z-10 bg-black">
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={active.src + activeIndex}
            custom={direction}
            variants={slideVariants}
            initial={isMounted ? "enter" : false}
            animate="center"
            exit="exit"
            transition={{ duration: 0.75, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-0 w-full h-full"
            suppressHydrationWarning
          >
            <Image
              src={active.src}
              alt="Hero Image"
              fill
              priority
              className="object-cover object-center"
              suppressHydrationWarning
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 backdrop-blur-3xl mask-[linear-gradient(to_bottom,transparent,black)]" />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover/hero:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover/hero:opacity-100 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <ChevronRight size={22} />
      </button>

      {/* Hero content */}
      <EntryStagger className="flex flex-col items-center gap-3 w-full max-w-155 px-5 text-center" delayChildren={0.2} stagger={0.11}>
        <EntryItem distance={30}>
          <h1 className="text-center text-5xl lg:text-6xl">Comfort wear <br/> for modern living</h1>
        </EntryItem>

        <EntryItem>
          <p className="t18 text-white-80! text-center leading-[1.5em] mb-3">
            Discover our new range of unisex oversized T-shirts made for your daily look and
            your best days.
          </p>
        </EntryItem>

        <EntryItem>
          <div className="flex items-center justify-center gap-2.5 pt-1">
            <Button variant="btn1" title="See all collections" href="/products" />
            <Button variant="btn3" title="Contact us" href="/contact" />
          </div>
        </EntryItem>
      </EntryStagger>

      {/* Thumbnail strip with loading progress bar */}
      <div className="absolute bottom-4 left-0 right-0 flex items-end justify-center gap-1.5 px-4 overflow-x-auto">
        {thumbnails.map((thumb, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={i}
              onClick={() => handleSelect(i)}
              className={`shrink-0 flex flex-col items-center gap-1 cursor-pointer transition-opacity ${
                isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
              }`}
            >
              <div
                className={`relative overflow-hidden border-2 transition-all duration-300 rounded-lg ${
                  isActive
                    ? "border-white w-20 h-25 md:w-22.5 md:h-28 shadow-lg"
                    : "border-transparent w-16.25 h-21 md:w-18.75 md:h-24"
                }`}
              >
                <Image
                  src={thumb.src}
                  alt={thumb.label}
                  fill
                  className="object-cover object-center"
                  suppressHydrationWarning
                />

                {/* Loading Progress Bar */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 overflow-hidden">
                    <motion.div
                      key={progressKey}
                      className="h-full bg-white"
                      initial={{ width: "0%" }}
                      animate={{ width: isPaused ? "0%" : "100%" }}
                      transition={{
                        duration: isPaused ? 0 : SLIDE_DURATION,
                        ease: "linear",
                      }}
                      onAnimationComplete={() => {
                        if (!isPaused) nextSlide();
                      }}
                    />
                  </div>
                )}
              </div>
              {isActive && (
                <span className="text-white text-[11px] font-medium tracking-wide">
                  {thumb.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

