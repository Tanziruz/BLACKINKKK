"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function TopLoaderBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip initial page load trigger if desired, or animate on route change
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsVisible(true);
    setProgress(0.15);

    const timer1 = setTimeout(() => setProgress(0.4), 300);
    const timer2 = setTimeout(() => setProgress(0.75), 700);
    const timer3 = setTimeout(() => setProgress(0.92), 1100);
    const timer4 = setTimeout(() => setProgress(1), 1500);

    const timerHide = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => setProgress(0), 500);
    }, 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timerHide);
    };
  }, [pathname, searchParams]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="top-loader-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed top-0 left-0 right-0 h-[3px] z-[999999] pointer-events-none overflow-hidden"
          suppressHydrationWarning
        >
          {/* Track fill animating scaleX left to right */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress }}
            transition={{
              duration: progress === 1 ? 0.45 : 0.75,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="w-full h-full bg-gradient-to-r from-black via-gray-800 to-black origin-left relative shadow-[0_0_10px_rgba(0,0,0,0.5)]"
          >
            {/* Leading glowing edge (Peg) */}
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/80 to-white shadow-[0_0_12px_#ffffff] translate-x-1/2"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function TopLoader() {
  return (
    <Suspense fallback={null}>
      <TopLoaderBar />
    </Suspense>
  );
}
