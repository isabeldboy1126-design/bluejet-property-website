"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { siteMode } from "@/lib/config";

interface LocationItem {
  id: string;
  name: string;
  imageUrl: string;
  benefit: string;
  href: string;
}

const locations: LocationItem[] = [
  {
    id: "loc-01",
    name: "[LOCATION 01 NAME]",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
    benefit: "[ONE MEANINGFUL BUYER BENEFIT OF THAT LOCATION]",
    href: "/#estates",
  },
  {
    id: "loc-02",
    name: "[LOCATION 02 NAME]",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80",
    benefit: "[ONE MEANINGFUL BUYER BENEFIT OF THAT LOCATION]",
    href: "/#estates",
  },
  {
    id: "loc-03",
    name: "[LOCATION 03 NAME]",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    benefit: "[ONE MEANINGFUL BUYER BENEFIT OF THAT LOCATION]",
    href: "/#estates",
  },
];

export function LocationCardsGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      data-motion-gallery="locations"
      className={`grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 ${
        isRevealed ? "locations-revealed" : ""
      }`}
    >
      {locations.map((loc, idx) => (
        <div
          key={loc.id}
          data-motion-card={`loc-${idx + 1}`}
          className={`location-card-motion location-card-${
            idx + 1
          } group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-900 shadow-md min-h-[380px] sm:min-h-[420px] flex flex-col justify-end p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
        >
          {/* Inner Parallax Image Wrapper with extended bleed */}
          <div className="absolute inset-[-8%] z-0 location-inner-media pointer-events-none">
            <Image
              src={loc.imageUrl}
              alt={loc.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            {/* Subtle controlled dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/55 to-slate-950/25" />
          </div>

          {/* Content */}
          <div className="relative z-10 space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {loc.name}
            </h3>

            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed line-clamp-3">
              {loc.benefit}
            </p>

            <div className="pt-2">
              <Link
                href={siteMode === "single" ? "#inspection" : loc.href}
                className="inline-flex items-center gap-2 text-xs font-bold text-teal-300 group-hover:text-white transition-colors"
              >
                <span>
                  {siteMode === "single"
                    ? "Explore Location"
                    : "Explore Properties"}
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
