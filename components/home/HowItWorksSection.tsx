"use client";

import React, { useEffect, useRef, useState } from "react";

export function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "[STEP 01 TITLE]",
      desc: "[SHORT STEP 01 EXPLANATION]",
    },
    {
      num: "02",
      title: "[STEP 02 TITLE]",
      desc: "[SHORT STEP 02 EXPLANATION]",
    },
    {
      num: "03",
      title: "[STEP 03 TITLE]",
      desc: "[SHORT STEP 03 EXPLANATION]",
    },
  ];

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
      { rootMargin: "0px 0px -15% 0px", threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      data-motion-section="how-it-works"
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 ${
        isRevealed ? "how-it-works-revealed" : ""
      }`}
    >
      {/* Centered Header: Strict rule: Eyebrow + Headline. STOP THERE. No intro paragraph! */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-[#025CDE] block">
          HOW IT WORKS
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl lg:text-[2.2rem] font-bold text-slate-900 tracking-tight leading-[1.25]">
          A Clearer Path From Interest to Ownership
        </h2>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP LAYOUT (lg+): Horizontal Line + 3 Connected Nodes     */}
      {/* ============================================================ */}
      <div className="hidden lg:block max-w-5xl mx-auto">
        {/* Horizontal Track with Connected Nodes */}
        <div className="relative mb-8">
          {/* Connecting Line running through node centers (16.67% to 83.33%) */}
          <div className="absolute top-[22px] left-[16.67%] right-[16.67%] h-[2px] bg-slate-200/90 z-0">
            <div
              id="how-it-works-line-desktop"
              className="h-full bg-[#025CDE] scale-x-0"
              style={{ width: "100%", transformOrigin: "left center" }}
            />
          </div>

          {/* 3 Connected Circular Nodes */}
          <div className="grid grid-cols-3 gap-8 relative z-10">
            {steps.map((step) => (
              <div key={step.num} className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-full border-2 border-[#025CDE] bg-white font-mono font-bold text-sm text-[#071139] flex items-center justify-center shadow-sm">
                  {step.num}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Cards Grid Below Nodes */}
        <div className="grid grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`how-step-card how-step-card-${idx} rounded-xl border border-slate-200 bg-white p-7 shadow-sm flex flex-col justify-between transition-shadow duration-300 hover:shadow-md`}
            >
              <div>
                <span className="text-[11px] font-mono font-bold text-[#025CDE] block mb-2 uppercase tracking-wider">
                  Phase {step.num}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE / TABLET LAYOUT (< lg): Vertical Connected Journey   */}
      {/* ============================================================ */}
      <div className="block lg:hidden relative pl-4 sm:pl-6 max-w-xl mx-auto">
        {/* Vertical Track connecting the steps */}
        <div className="absolute left-[29px] sm:left-[37px] top-6 bottom-8 w-[2px] bg-slate-200 overflow-hidden">
          <div
            id="how-it-works-line-mobile"
            className="w-full h-full bg-[#025CDE] scale-y-0"
            style={{ transformOrigin: "center top" }}
          />
        </div>

        <div className="space-y-6 sm:space-y-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative flex items-start gap-4 sm:gap-6">
              {/* Circular Numbered Node */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#025CDE] bg-white font-mono font-bold text-xs sm:text-sm text-[#071139] flex items-center justify-center shadow-sm relative z-10 shrink-0">
                {step.num}
              </div>

              {/* Step Content Card */}
              <div
                className={`how-step-card how-step-card-${idx} flex-1 rounded-xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-shadow duration-300 hover:shadow-md`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono font-bold text-[#025CDE] block uppercase tracking-wider">
                      Phase {step.num}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {step.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

