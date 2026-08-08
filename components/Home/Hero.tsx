"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(2);

  // Auto-advance every 5 seconds; remove activeIndex from deps so the
  // interval is created once and not recreated on every slide change.
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % thumbnails.length);
    }, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = thumbnails[activeIndex];

  return (
    <section className="relative h-dvh w-full overflow-hidden flex flex-col justify-center items-center pb-32 pt-10">
      <div className="absolute inset-0 -z-10 ">
        <Image
          key={active.src + activeIndex}
          src={active.src}
          alt="Hero Image"
          fill
          priority
          className="object-cover object-center transition-opacity duration-700"
          suppressHydrationWarning
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 backdrop-blur-3xl mask-[linear-gradient(to_bottom,transparent,black)]" />
      </div>

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

      {/* Thumbnail strip */}
      <div className="absolute bottom-4 left-0 right-0 flex items-end justify-center gap-0.5 px-4 overflow-x-auto">
        {thumbnails.map((thumb, i) => {
          const isActive = i === activeIndex;
          return (
            <div
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`shrink-0 flex flex-col items-center gap-1 cursor-pointer transition-opacity ${
                isActive ? "opacity-100" : "opacity-50 hover:opacity-75"
              }`}
            >
              <div
                className={`relative  overflow-hidden border-2 transition-all duration-300 ${
                  isActive
                    ? "border-white w-20 h-25 md:w-22.5 md:h-28"
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
