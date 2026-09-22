"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function AboutSection() {
  const trustEvidences = [
    "[VERIFIED COMPANY TRUST EVIDENCE 01]",
    "[VERIFIED COMPANY TRUST EVIDENCE 02]",
    "[VERIFIED COMPANY TRUST EVIDENCE 03]",
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const imgAInnerRef = useRef<HTMLDivElement>(null);
  const imgBInnerRef = useRef<HTMLDivElement>(null);
  const metricInnerRef = useRef<HTMLDivElement>(null);

  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Check reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    // Scroll-Triggered Reveal: trigger once section top reaches ~78% of viewport (desktop ~75%, mobile ~82%)
    const isMobile = window.innerWidth < 768;
    const rootMargin = isMobile
      ? "0px 0px -18% 0px"
      : "0px 0px -25% 0px";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.05 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  // Post-reveal scroll depth & restrained desktop pointer depth
  useEffect(() => {
    if (!isRevealed) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    let rafId: number;
    let isMounted = true;
    const isDesktop = window.innerWidth >= 1024;

    // Pointer state for desktop cluster
    const ptrState = {
      tgtX: 0,
      tgtY: 0,
      curX: 0,
      curY: 0,
    };

    // Scroll parallax state
    const scrollState = {
      tgtA: 0,
      tgtB: 0,
      tgtM: 0,
      curA: 0,
      curB: 0,
      curM: 0,
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDesktop || !clusterRef.current) return;
      const rect = clusterRef.current.getBoundingClientRect();
      const normX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const normY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      // Respond within proximity
      if (Math.abs(normX) <= 1.4 && Math.abs(normY) <= 1.4) {
        ptrState.tgtX = Math.max(-1, Math.min(1, normX));
        ptrState.tgtY = Math.max(-1, Math.min(1, normY));
      } else {
        ptrState.tgtX = 0;
        ptrState.tgtY = 0;
      }
    };

    const onPointerLeave = () => {
      ptrState.tgtX = 0;
      ptrState.tgtY = 0;
    };

    const updateScrollParallax = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Only update when section is in or near viewport
      if (rect.bottom < -100 || rect.top > vh + 100) return;

      const sectionCenter = rect.top + rect.height / 2;
      const viewCenter = vh / 2;
      const progress = Math.max(
        -1,
        Math.min(1, (viewCenter - sectionCenter) / (vh / 2 + rect.height / 2))
      );

      if (isDesktop) {
        /*
         * Desktop multi-plane depth:
         *
         * Image A = slower rear plane
         * Image B = stronger opposite foreground plane
         * Metric  = floating middle/foreground plane
         */
        scrollState.tgtA =
          progress * 18;

        scrollState.tgtB =
          progress * -30;

        scrollState.tgtM =
          progress * 22;
      } else {
        /*
         * Mobile retains genuine parallax,
         * but with reduced travel.
         */
        scrollState.tgtA =
          progress * 8;

        scrollState.tgtB =
          progress * -14;

        scrollState.tgtM =
          progress * 10;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", updateScrollParallax, { passive: true });
    updateScrollParallax();

    const clusterEl = clusterRef.current;
    if (clusterEl) {
      clusterEl.addEventListener("pointerleave", onPointerLeave);
    }

    const loop = () => {
      if (!isMounted) return;

      // Lerp pointer easing (~0.08 rate)
      ptrState.curX += (ptrState.tgtX - ptrState.curX) * 0.08;
      ptrState.curY += (ptrState.tgtY - ptrState.curY) * 0.08;

      // Lerp scroll parallax
      scrollState.curA += (scrollState.tgtA - scrollState.curA) * 0.08;
      scrollState.curB += (scrollState.tgtB - scrollState.curB) * 0.08;
      scrollState.curM += (scrollState.tgtM - scrollState.curM) * 0.08;

      // 1. Image A: max pointer ±4px X, ±3px Y, scale max 1.004 + scroll parallax
      if (imgAInnerRef.current) {
        const ax = ptrState.curX * 4;
        const ay = ptrState.curY * 3 + scrollState.curA;
        const aScale = 1 + Math.abs(ptrState.curX * ptrState.curY) * 0.004;
        imgAInnerRef.current.style.transform = `translate3d(${ax.toFixed(2)}px, ${ay.toFixed(2)}px, 0) scale(${aScale.toFixed(4)})`;
      }

      // 2. Image B: opposite/slower ±3px X, ±4px Y + scroll parallax
      if (imgBInnerRef.current) {
        const bx = -ptrState.curX * 3;
        const by = -ptrState.curY * 4 + scrollState.curB;
        imgBInnerRef.current.style.transform = `translate3d(${bx.toFixed(2)}px, ${by.toFixed(2)}px, 0)`;
      }

      // 3. Metric Tile: floating ±2px X, ±2px Y + scroll parallax
      if (metricInnerRef.current) {
        const mx = ptrState.curX * 2;
        const my = ptrState.curY * 2 + scrollState.curM;
        metricInnerRef.current.style.transform = `translate3d(${mx.toFixed(2)}px, ${my.toFixed(2)}px, 0)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      isMounted = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", updateScrollParallax);
      if (clusterEl) {
        clusterEl.removeEventListener("pointerleave", onPointerLeave);
      }
    };
  }, [isRevealed]);

  return (
    <section
      id="about"
      ref={sectionRef}
      data-motion-section="about"
      style={{ backgroundColor: "#F6F8F5" }}
      className={`w-full scroll-mt-24 ${
        isRevealed ? "about-is-revealed" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Transparent Editorial Section Container (Directly on Page Surface) */}
        <div className="about-outer-container w-full relative pt-16 pb-[68px] sm:py-20 lg:py-24">
        {/* Mobile Header: ABOUT US + Headline + Body (Visible on mobile only, matches specified mobile sequence) */}
        <div className="block lg:hidden space-y-4 mb-6">
          <div className="about-anim-eyebrow">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
              ABOUT US
            </span>
          </div>

          <h2 className="about-anim-headline text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
            [WHY THIS COMPANY IS WELL POSITIONED TO HELP THE BUYER ACHIEVE THE DESIRED OUTCOME]
          </h2>

          <p className="about-anim-body text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
            [SHORT COMPANY EXPLANATION THAT SAYS WHAT THEY DO, WHO THEY HELP AND HOW THEIR WAY OF OPERATING BENEFITS THE BUYER]
          </p>
        </div>

        {/* Main Composition Grid: Desktop ~46% visual column, ~48% content column, controlled gap */}
        <div className="grid grid-cols-1 lg:grid-cols-[46%_48%] gap-8 lg:gap-[6%] items-center">
          {/* ============================================================ */}
          {/* VISUAL COLUMN (Desktop Left): Two-Image Cluster + Metric     */}
          {/* ============================================================ */}
          <div className="w-full">
            <div
              ref={clusterRef}
              className="relative w-full h-[320px] sm:h-[390px] lg:h-[460px] xl:h-[480px] select-none"
            >
              {/* IMAGE A — PRIMARY IMAGE (Upper-Right, ~76% width) */}
              <div
                className="about-anim-img-a absolute top-0 right-0 w-[84%] lg:w-[76%] h-[74%] lg:h-[76%]"
                style={{ zIndex: 1 }}
              >
                <div
                  ref={imgAInnerRef}
                  style={{ willChange: "transform" }}
                  className="w-full h-full relative rounded-2xl overflow-hidden border border-slate-200/80 shadow-md transition-[box-shadow] duration-300 hover:shadow-lg"
                >
                  <Image
                    src="/images/about-office.jpg"
                    alt="Corporate operations and real estate consultancy office setting"
                    fill
                    sizes="(max-width: 1024px) 85vw, 42vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>

              {/* IMAGE B — SECONDARY IMAGE (Lower-Left Overlap, ~60% width) */}
              <div
                className="about-anim-img-b absolute bottom-0 left-0 w-[58%] lg:w-[60%] h-[56%] lg:h-[58%]"
                style={{ zIndex: 10 }}
              >
                <div
                  ref={imgBInnerRef}
                  style={{ willChange: "transform" }}
                  className="w-full h-full relative rounded-2xl overflow-hidden border-[3px] border-white shadow-2xl transition-[box-shadow] duration-300 hover:shadow-2xl"
                >
                  <Image
                    src="/images/about-estate.jpg"
                    alt="Modern residential estate development and architecture"
                    fill
                    sizes="(max-width: 1024px) 60vw, 30vw"
                    className="object-cover object-center"
                  />
                </div>
              </div>

              {/* METRIC TILE — Layered Overlap Area (Bottom-Right of Cluster) */}
              <div
                className="about-anim-metric absolute right-2 sm:right-4 lg:right-6 bottom-2 sm:bottom-4 lg:bottom-6"
                style={{ zIndex: 20 }}
              >
                <div
                  ref={metricInnerRef}
                  style={{ willChange: "transform" }}
                  className="w-[100px] h-[98px] sm:w-[116px] sm:h-[112px] lg:w-[124px] lg:h-[120px] rounded-2xl bg-[#0D8975] text-[#F7F4EC] p-3 flex flex-col items-center justify-center text-center shadow-xl shadow-teal-950/20 border border-white/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-teal-950/30 cursor-default"
                >
                  <span className="text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-white leading-none font-mono">
                    X+
                  </span>
                  <span className="text-[9px] sm:text-[10px] lg:text-[11px] font-semibold text-white/90 uppercase tracking-wider mt-2 leading-tight">
                    [ABOUT METRIC LABEL]
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* CONTENT COLUMN (Desktop Right): Copy, Trust Proof Rows, CTA   */}
          {/* ============================================================ */}
          <div className="w-full space-y-6">
            {/* Desktop Header: ABOUT US + Headline + Body (Visible on lg: and up) */}
            <div className="hidden lg:block space-y-4">
              <div className="about-anim-eyebrow">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  ABOUT US
                </span>
              </div>

              <h2 className="about-anim-headline text-2xl sm:text-3xl lg:text-[2.2rem] font-bold text-slate-900 tracking-tight leading-[1.2]">
                [WHY THIS COMPANY IS WELL POSITIONED TO HELP THE BUYER ACHIEVE THE DESIRED OUTCOME]
              </h2>

              <p className="about-anim-body text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                [SHORT COMPANY EXPLANATION THAT SAYS WHAT THEY DO, WHO THEY HELP AND HOW THEIR WAY OF OPERATING BENEFITS THE BUYER]
              </p>
            </div>

            {/* Refined Trust-Evidence Proof Rows (No large grey boxes, clean separators) */}
            <div className="about-anim-proof-group divide-y divide-slate-100 border-y border-slate-100/90 py-1">
              {trustEvidences.map((evidence, idx) => (
                <div
                  key={idx}
                  className={`about-proof-row about-proof-row-${idx} flex items-center gap-3.5 py-3.5 sm:py-4 px-2 -mx-2 rounded-md transition-colors hover:bg-slate-50/70 group`}
                >
                  <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-800 tracking-tight">
                    {evidence}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="about-anim-cta pt-1">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
