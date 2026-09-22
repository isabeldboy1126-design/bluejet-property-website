"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ShieldCheck, FileCheck, CalendarCheck, ArrowRight } from "lucide-react";

export function WhyBuyWithUsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
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
      { rootMargin: "0px 0px -18% 0px", threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-300" />,
      title: "[BUYER BENEFIT 01]",
      text: "[SHORT EXPLANATION OF THE COMPANY CAPABILITY / EVIDENCE THAT CREATES THIS BENEFIT]",
    },
    {
      icon: <FileCheck className="w-5 h-5 text-blue-300" />,
      title: "[BUYER BENEFIT 02]",
      text: "[SHORT EXPLANATION OF THE COMPANY CAPABILITY / EVIDENCE THAT CREATES THIS BENEFIT]",
    },
    {
      icon: <CalendarCheck className="w-5 h-5 text-blue-300" />,
      title: "[BUYER BENEFIT 03]",
      text: "[SHORT EXPLANATION OF THE COMPANY CAPABILITY / EVIDENCE THAT CREATES THIS BENEFIT]",
    },
  ];

  return (
    <section
      id="why-buy"
      ref={sectionRef}
      data-motion-section="why-buy"
      style={{
        background:
          "linear-gradient(135deg, #071139 0%, #0A1B44 55%, #050D24 100%)",
      }}
      className={`w-full relative overflow-hidden py-[72px] lg:py-[96px] text-[#F7F4EC] scroll-mt-24 ${
        isRevealed ? "why-buy-revealed" : ""
      }`}
    >
      {/* Restrained Architectural Arc Detail (Subtle Brand System Continuity) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40">
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
        >
          <circle
            cx="1360"
            cy="280"
            r="460"
            fill="none"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1"
          />
          <circle
            cx="120"
            cy="580"
            r="490"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div data-motion-inner="why-buy" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header: Strict rule: Eyebrow + Headline. STOP THERE. No intro paragraph! */}
        <div className="mb-10 max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-300/90 block">
            WHY BUY WITH US
          </span>
          <h2 className="mt-2 text-2xl sm:text-3xl lg:text-[2.2rem] font-bold text-[#F7F4EC] tracking-tight leading-[1.25]">
            [PRIMARY COMPANY ADVANTAGE EXPRESSED AS A BUYER BENEFIT]
          </h2>
        </div>

        {/* 3 Benefit Blocks — Restrained Transparent Surfaces on Deep Green */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {benefits.map((b, idx) => (
            <div
              key={idx}
              data-motion-benefit={idx + 1}
              className={`why-buy-card why-buy-card-${
                idx + 1
              } rounded-xl border border-white/[0.12] bg-white/[0.04] p-6 sm:p-8 shadow-sm flex flex-col justify-between backdrop-blur-[2px] transition-all duration-300 hover:bg-white/[0.07] hover:border-white/[0.2]`}
            >
              <div className="why-buy-parallax-inner h-full flex flex-col justify-between">
                <div>
                  <div className="why-buy-icon w-11 h-11 rounded-lg bg-blue-950/60 border border-blue-400/25 flex items-center justify-center mb-5 transition-transform duration-300">
                    {b.icon}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#F7F4EC] tracking-tight">
                    {b.title}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm text-white/75 leading-relaxed font-normal">
                    {b.text}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-white/10">
                  <Link
                    href="#inspection"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 hover:text-white transition-colors group/cta"
                  >
                    <span>Get Benefit</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/cta:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
