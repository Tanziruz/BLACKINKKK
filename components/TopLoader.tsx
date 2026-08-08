"use client";

import { useEffect, useRef, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function TopLoaderContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const loaderRef = useRef<{ start: () => void; finish: () => void } | null>(null);

  useEffect(() => {
    import("../public/top-loader.js").then(() => {
      const TopProgressBar = (window as any).TopProgressBar;
      if (TopProgressBar && !loaderRef.current) {
        loaderRef.current = new TopProgressBar({
          color: "#000000",
          gradientColor: "#666666",
          height: "3px",
        });
      }
    });
  }, []);

  useEffect(() => {
    if (loaderRef.current) {
      loaderRef.current.start();
      const timer = setTimeout(() => {
        loaderRef.current?.finish();
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function TopLoader() {
  return (
    <Suspense fallback={null}>
      <TopLoaderContent />
    </Suspense>
  );
}
