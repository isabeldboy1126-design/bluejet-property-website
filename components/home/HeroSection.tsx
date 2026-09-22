"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, ShieldCheck, Users, Layers, MapPin, BarChart3, MessageCircle } from "lucide-react";
import { OpenModalButton } from "@/components/conversion/OpenModalButton";
import { getCompanyConfig } from "@/lib/config";

export function HeroSection() {
  const company = getCompanyConfig();
  const whatsappNumber = company?.contact?.whatsappNumber || "2348020001122";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello, I would like to speak with an advisor about your properties."
  )}`;

  const heroRef = useRef<HTMLDivElement>(null);
  const desktopImageRef = useRef<HTMLDivElement>(null);
  const primaryBtnRef = useRef<HTMLDivElement>(null);
  const secondaryBtnRef = useRef<HTMLDivElement>(null);
  const arcsRef = useRef<HTMLDivElement>(null);
  const jiggleStartRef = useRef<number | null>(null);

  const handleImagePointerEnter = () => {
    // Single micro-jiggle per pointer enter (Section 14)
    jiggleStartRef.current = performance.now();
  };

  const handleImagePointerLeave = () => {
    jiggleStartRef.current = null;
  };

  // Desktop fine-pointer proximity & cursor interactions (Transform only)
  useEffect(() => {
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hasFinePointer || reducedMotion) return;

    let rafId: number;
    const imgState = {
      curX: 0,
      curY: 0,
      curRotX: 0,
      curRotY: 0,
      curScale: 1,
      tgtX: 0,
      tgtY: 0,
      tgtRotX: 0,
      tgtRotY: 0,
      tgtScale: 1,
    };
    const pBtnState = { curX: 0, curY: 0, tgtX: 0, tgtY: 0 };
    const sBtnState = { curX: 0, curY: 0, tgtX: 0, tgtY: 0 };
    const arcState = { curX: 0, curY: 0, tgtX: 0, tgtY: 0 };

    let imageBounds: DOMRect | null = null;
    let pBtnBounds: DOMRect | null = null;
    let sBtnBounds: DOMRect | null = null;

    const updateBounds = () => {
      if (desktopImageRef.current) imageBounds = desktopImageRef.current.getBoundingClientRect();
      if (primaryBtnRef.current) pBtnBounds = primaryBtnRef.current.getBoundingClientRect();
      if (secondaryBtnRef.current) sBtnBounds = secondaryBtnRef.current.getBoundingClientRect();
    };

    updateBounds();
    window.addEventListener("resize", updateBounds);

    const onPointerMove = (e: PointerEvent) => {
      const { clientX, clientY } = e;

      // 1. Hero Image Cursor Floating Response: floats smoothly and tilts on approach/hover
      if (imageBounds) {
        const imgCenterX = imageBounds.left + imageBounds.width / 2;
        const imgCenterY = imageBounds.top + imageBounds.height / 2;
        const distToImage = Math.hypot(clientX - imgCenterX, clientY - imgCenterY);
        const maxDist = Math.max(imageBounds.width, imageBounds.height) / 2 + 140;

        if (distToImage < maxDist) {
          const normX = Math.max(-1, Math.min(1, (clientX - imgCenterX) / (imageBounds.width / 2)));
          const normY = Math.max(-1, Math.min(1, (clientY - imgCenterY) / (imageBounds.height / 2)));
          imgState.tgtX = normX * 8;
          imgState.tgtY = normY * 6 - 6; // Floats upwards by ~6px
          imgState.tgtRotX = -normY * 1.2;
          imgState.tgtRotY = normX * 1.5;
          imgState.tgtScale = 1.018;
        } else {
          imgState.tgtX = 0;
          imgState.tgtY = 0;
          imgState.tgtRotX = 0;
          imgState.tgtRotY = 0;
          imgState.tgtScale = 1;
        }
      }

      // 2. Primary CTA Proximity (Within ~85px)
      if (pBtnBounds) {
        const btnCenterX = pBtnBounds.left + pBtnBounds.width / 2;
        const btnCenterY = pBtnBounds.top + pBtnBounds.height / 2;
        const dist = Math.hypot(clientX - btnCenterX, clientY - btnCenterY);
        if (dist < 85) {
          pBtnState.tgtX = Math.max(-4, Math.min(4, (clientX - btnCenterX) * 0.1));
          pBtnState.tgtY = Math.max(-3, Math.min(3, (clientY - btnCenterY) * 0.1));
        } else {
          pBtnState.tgtX = 0;
          pBtnState.tgtY = 0;
        }
      }

      // 3. Secondary CTA Proximity (Within ~85px)
      if (sBtnBounds) {
        const btnCenterX = sBtnBounds.left + sBtnBounds.width / 2;
        const btnCenterY = sBtnBounds.top + sBtnBounds.height / 2;
        const dist = Math.hypot(clientX - btnCenterX, clientY - btnCenterY);
        if (dist < 85) {
          sBtnState.tgtX = Math.max(-4, Math.min(4, (clientX - btnCenterX) * 0.1));
          sBtnState.tgtY = Math.max(-3, Math.min(3, (clientY - btnCenterY) * 0.1));
        } else {
          sBtnState.tgtX = 0;
          sBtnState.tgtY = 0;
        }
      }

      // 4. Background Arcs Parallax (Section 19: max 1-2px)
      if (heroRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        const normHeroX = (clientX - heroRect.left) / heroRect.width - 0.5;
        const normHeroY = (clientY - heroRect.top) / heroRect.height - 0.5;
        arcState.tgtX = normHeroX * 1.5;
        arcState.tgtY = normHeroY * 1.5;
      }
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const animateLoop = () => {
      // Smooth interpolation (~0.55s ease, power3.out settling rate)
      imgState.curX += (imgState.tgtX - imgState.curX) * 0.08;
      imgState.curY += (imgState.tgtY - imgState.curY) * 0.08;
      imgState.curRotX += (imgState.tgtRotX - imgState.curRotX) * 0.08;
      imgState.curRotY += (imgState.tgtRotY - imgState.curRotY) * 0.08;
      imgState.curScale += (imgState.tgtScale - imgState.curScale) * 0.08;

      // Restrained micro-jiggle on pointerenter (0 -> 2px -> -1px -> 0 and 0 -> 0.12deg -> -0.08deg -> 0 over 280ms)
      let jiggleX = 0;
      let jiggleRot = 0;
      if (jiggleStartRef.current !== null) {
        const elapsed = performance.now() - jiggleStartRef.current;
        if (elapsed < 280) {
          const t = elapsed / 280;
          if (t < 0.35) {
            const phase = t / 0.35;
            jiggleX = Math.sin(phase * Math.PI) * 2;
            jiggleRot = Math.sin(phase * Math.PI) * 0.12;
          } else if (t < 0.70) {
            const phase = (t - 0.35) / 0.35;
            jiggleX = -Math.sin(phase * Math.PI) * 1;
            jiggleRot = -Math.sin(phase * Math.PI) * 0.08;
          }
        } else {
          jiggleStartRef.current = null;
        }
      }

      pBtnState.curX += (pBtnState.tgtX - pBtnState.curX) * 0.14;
      pBtnState.curY += (pBtnState.tgtY - pBtnState.curY) * 0.14;

      sBtnState.curX += (sBtnState.tgtX - sBtnState.curX) * 0.14;
      sBtnState.curY += (sBtnState.tgtY - sBtnState.curY) * 0.14;

      arcState.curX += (arcState.tgtX - arcState.curX) * 0.06;
      arcState.curY += (arcState.tgtY - arcState.curY) * 0.06;

      if (desktopImageRef.current) {
        const totalX = imgState.curX + jiggleX;
        const totalRotY = imgState.curRotY + jiggleRot;
        desktopImageRef.current.style.transform = `translate3d(${totalX.toFixed(2)}px, ${imgState.curY.toFixed(2)}px, 0) rotateX(${imgState.curRotX.toFixed(2)}deg) rotateY(${totalRotY.toFixed(2)}deg) scale(${imgState.curScale.toFixed(4)})`;
      }
      if (primaryBtnRef.current) {
        primaryBtnRef.current.style.transform = `translate3d(${pBtnState.curX.toFixed(2)}px, ${pBtnState.curY.toFixed(2)}px, 0)`;
      }
      if (secondaryBtnRef.current) {
        secondaryBtnRef.current.style.transform = `translate3d(${sBtnState.curX.toFixed(2)}px, ${sBtnState.curY.toFixed(2)}px, 0)`;
      }
      if (arcsRef.current) {
        arcsRef.current.style.transform = `translate3d(${arcState.curX.toFixed(2)}px, ${arcState.curY.toFixed(2)}px, 0)`;
      }

      rafId = requestAnimationFrame(animateLoop);
    };

    rafId = requestAnimationFrame(animateLoop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", updateBounds);
    };
  }, []);

  return (
    <section
      id="hero-section"
      ref={heroRef}
      style={{
        background:
          "radial-gradient(circle at 22% 18%, rgba(2, 92, 222, 0.18), transparent 45%), linear-gradient(135deg, #071139 0%, #0A1B44 50%, #060E2A 100%)",
      }}
      className="relative overflow-hidden border-b border-blue-950/40 text-[#F7F4EC] md:min-h-[calc(100vh-82px)] md:min-h-[calc(100svh-82px)] md:flex md:flex-col md:justify-between"
    >
        {/* ============================================================== */}
        {/* Subtle Architectural Curved Linework (Pointer-events: none)    */}
        {/* ============================================================== */}
        <div ref={arcsRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {/* Desktop Geometric Arcs with Subtle Travelling Light Highlights */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 820"
            preserveAspectRatio="none"
          >
            {/* Arc 01: Upper Right Arc */}
            <circle
              cx="1280"
              cy="160"
              r="490"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="1"
            />
            <circle
              cx="1280"
              cy="160"
              r="490"
              fill="none"
              stroke="rgba(255, 255, 255, 0.28)"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeDasharray="90 1400"
              className="arc-highlight-1"
            />

            {/* Arc 02: Bottom Center/Left Arc */}
            <circle
              cx="580"
              cy="760"
              r="540"
              fill="none"
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth="1"
            />
            <circle
              cx="580"
              cy="760"
              r="540"
              fill="none"
              stroke="rgba(255, 255, 255, 0.26)"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeDasharray="100 1550"
              className="arc-highlight-2"
            />

            {/* Arc 03: Concentric Upper Outer Arc */}
            <circle
              cx="1280"
              cy="160"
              r="630"
              fill="none"
              stroke="rgba(255, 255, 255, 0.055)"
              strokeWidth="1"
            />
            <circle
              cx="1280"
              cy="160"
              r="630"
              fill="none"
              stroke="rgba(255, 255, 255, 0.22)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="80 1850"
              className="arc-highlight-3"
            />
          </svg>

          {/* Mobile Geometric Arcs with Subtle Travelling Light Highlights */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none block md:hidden"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 430 900"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {/* upper-right base arc */}
            <circle
              cx="405"
              cy="105"
              r="235"
              fill="none"
              stroke="rgba(255,255,255,0.065)"
              strokeWidth="0.9"
            />

            {/* upper-right travelling highlight */}
            <circle
              cx="405"
              cy="105"
              r="235"
              fill="none"
              stroke="rgba(255,255,255,0.22)"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeDasharray="45 1430"
              className="arc-highlight-mobile-1"
            />

            {/* lower-left base arc */}
            <circle
              cx="65"
              cy="825"
              r="305"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.9"
            />

            {/* lower-left travelling highlight */}
            <circle
              cx="65"
              cy="825"
              r="305"
              fill="none"
              stroke="rgba(255,255,255,0.18)"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeDasharray="55 1860"
              className="arc-highlight-mobile-2"
            />

            {/* subtle secondary upper arc */}
            <circle
              cx="405"
              cy="105"
              r="290"
              fill="none"
              stroke="rgba(255,255,255,0.038)"
              strokeWidth="0.8"
            />

            <circle
              cx="405"
              cy="105"
              r="290"
              fill="none"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeDasharray="38 1780"
              className="arc-highlight-mobile-3"
            />
          </svg>
        </div>

        {/* ============================================================== */}
        {/* DESKTOP HERO VIEW (md and up: 2-column + anchored metric band) */}
        {/* ============================================================== */}
        <div
          id="desktop-hero-content"
          className="hidden md:flex md:flex-col md:flex-1 max-w-7xl w-full mx-auto px-10 xl:px-11 pt-9 pb-7 relative z-10"
        >
          {/* Main Hero Content Composition: 1.08fr 0.92fr grid, gap-16 xl:gap-[72px], align-items: start */}
          <div className="grid grid-cols-[1.08fr_0.92fr] gap-16 xl:gap-[72px] items-start">
            {/* Left Column: Copy, CTAs, Friction Reducer */}
            <div className="flex flex-col pt-1">
              {/* Trust Eyebrow (18-22px space after) */}
              <div className="hero-anim-eyebrow inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] px-3.5 py-1 text-xs font-semibold text-white/90 w-fit backdrop-blur-sm shadow-sm mb-5">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>[VERIFIED SOCIAL PROOF / TRUST SIGNAL]</span>
              </div>

              {/* Headline (36px space after) */}
              <h1 className="hero-anim-headline text-2xl sm:text-3xl lg:text-[2.2rem] xl:text-[2.45rem] leading-[1.15] font-bold tracking-tight text-[#F7F4EC] mb-9">
                [DESIRED OUTCOME / MAIN BUYER BENEFIT + EMOTIONAL OUTCOME]
              </h1>

              {/* Subheadline (mb-0: space transferred to CTA mt-10) */}
              <p className="hero-anim-subheadline text-xs sm:text-sm lg:text-[0.95rem] leading-[1.5] text-white/80 max-w-xl font-normal mb-0">
                [WHAT THE COMPANY SELLS + HOW IT HELPS THE BUYER ACHIEVE THE DESIRED OUTCOME]
              </p>

              {/* Side-by-Side CTAs (mt-10 = 40px space after subheadline; mb-[18px] = 18px space before friction reducer) */}
              <div className="hero-anim-ctas flex flex-row items-center gap-3 mt-10 mb-[18px]">
                <div ref={primaryBtnRef} style={{ willChange: "transform" }}>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center h-11 md:h-12 px-6 rounded-lg bg-[#025CDE] hover:bg-[#0047BA] text-xs font-bold text-white shadow-md transition-transform active:scale-95 touch-target"
                  >
                    <MessageCircle className="w-4 h-4 mr-2 shrink-0 text-white fill-current/20" />
                    <span>Talk to an Advisor</span>
                  </a>
                </div>

                <div ref={secondaryBtnRef} style={{ willChange: "transform" }}>
                  <Link
                    href="#properties"
                    className="inline-flex items-center justify-center h-11 md:h-12 px-6 rounded-lg border border-white/40 bg-white/[0.04] text-xs font-bold text-white hover:bg-white/10 hover:border-white/60 transition-all duration-200 active:scale-95 shadow-sm touch-target group"
                  >
                    <span>View Properties</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-2 shrink-0 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              {/* Friction Reducer */}
              <div className="hero-anim-friction text-xs text-white/65 font-medium">
                [CTA FRICTION REDUCER — ONLY IF VERIFIED]
              </div>
            </div>

            {/* Right Column: Hero Image (Enlarged / Rebalanced to clamp(375px, 49vh, 420px)) */}
            <div
              style={{ perspective: "1100px" }}
              className="w-full flex justify-end"
            >
              <div
                ref={desktopImageRef}
                onPointerEnter={handleImagePointerEnter}
                onPointerLeave={handleImagePointerLeave}
                style={{
                  height: "clamp(375px, 49vh, 420px)",
                  transformOrigin: "center",
                  willChange: "transform",
                }}
                className="hero-anim-image relative w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl transition-[box-shadow] duration-300"
              >
                <Image
                  src="/images/hero-landscape.jpg"
                  alt="Real estate land development and serviced plots demo imagery"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(min-width: 1024px) 45vw, 50vw"
                />
              </div>
            </div>
          </div>

          {/* Desktop Metric Authority Band — Anchored naturally to bottom of viewport */}
          <div className="mt-auto pt-6 flex-shrink-0">
            {/* Long Horizontal Divider spanning inner width */}
            <div className="hero-anim-divider w-full border-t border-white/24 mb-4" />

            {/* 4 Metric Groups in Single Row (Evenly distributed across 4 columns) */}
            <div className="grid grid-cols-4 items-center">
              {/* Metric 01 */}
              <div className="hero-anim-metric-1 flex items-center gap-3.5 pr-4 border-r border-white/18">
                <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-blue-300" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl font-bold tracking-tight text-[#F7F4EC] font-mono leading-none">
                    X
                  </div>
                  <div className="text-xs font-semibold text-white/65 uppercase tracking-wider">
                    [METRIC 01 LABEL]
                  </div>
                </div>
              </div>

              {/* Metric 02 */}
              <div className="hero-anim-metric-2 flex items-center gap-3.5 px-4 border-r border-white/18">
                <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4 text-blue-300" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl font-bold tracking-tight text-[#F7F4EC] font-mono leading-none">
                    X
                  </div>
                  <div className="text-xs font-semibold text-white/65 uppercase tracking-wider">
                    [METRIC 02 LABEL]
                  </div>
                </div>
              </div>

              {/* Metric 03 */}
              <div className="hero-anim-metric-3 flex items-center gap-3.5 px-4 border-r border-white/18">
                <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-blue-300" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl font-bold tracking-tight text-[#F7F4EC] font-mono leading-none">
                    X
                  </div>
                  <div className="text-xs font-semibold text-white/65 uppercase tracking-wider">
                    [METRIC 03 LABEL]
                  </div>
                </div>
              </div>

              {/* Metric 04 */}
              <div className="hero-anim-metric-4 flex items-center gap-3.5 pl-4">
                <div className="w-8 h-8 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-4 h-4 text-blue-300" />
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl font-bold tracking-tight text-[#F7F4EC] font-mono leading-none">
                    X
                  </div>
                  <div className="text-xs font-semibold text-white/65 uppercase tracking-wider">
                    [METRIC 04 LABEL]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* MOBILE HERO VIEW (Below md: Locked Order & Vertical Rhythm)    */}
        {/* ============================================================== */}
        <div id="mobile-hero-content" className="block md:hidden px-5 sm:px-6 relative z-10">
          {/* 1. Breathing room after nav (34-38px, preferred 36px) */}
          <div className="pt-9 sm:pt-10">
            {/* 2. Trust Signal Pill (11px, 6px gap, 12px x 5px padding, 14px icon) */}
            <div className="hero-anim-eyebrow inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.08] px-3 py-[5px] text-[11px] leading-[1.25] font-semibold text-white/90">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>[VERIFIED SOCIAL PROOF / TRUST SIGNAL]</span>
            </div>
          </div>

          {/* 3. Space (22px) + 4. Headline (34px, leading-[1.055]) */}
          <h1 className="hero-anim-headline mt-[22px] text-[34px] min-[420px]:text-[35px] sm:text-[36px] leading-[1.055] font-bold tracking-tight text-[#F7F4EC]">
            [DESIRED OUTCOME / MAIN BUYER BENEFIT + EMOTIONAL OUTCOME]
          </h1>

          {/* 5. Space (25px) + 6. Subheadline */}
          <p className="hero-anim-subheadline mt-[25px] text-[15px] sm:text-[16px] leading-[1.46] text-white/80 font-normal">
            [WHAT THE COMPANY SELLS + HOW IT HELPS THE BUYER ACHIEVE THE DESIRED OUTCOME]
          </p>

          {/* 7. Space (29px) + 8. Vertically Stacked CTAs (12px gap) */}
          <div className="hero-anim-ctas mt-[29px] flex flex-col gap-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-[50px] inline-flex items-center justify-center text-sm font-bold rounded-lg bg-[#025CDE] hover:bg-[#0047BA] text-white shadow-md active:scale-[0.985] touch-target"
            >
              <MessageCircle className="w-4 h-4 mr-2 shrink-0 text-white fill-current/20" />
              <span>Talk to an Advisor</span>
            </a>

            <Link
              href="#properties"
              className="w-full h-[50px] inline-flex items-center justify-center rounded-lg border border-white/40 bg-white/[0.04] text-sm font-bold text-white hover:bg-white/10 active:scale-[0.985] shadow-sm touch-target"
            >
              <span>View Properties</span>
              <ArrowRight className="w-4 h-4 ml-2 shrink-0" />
            </Link>
          </div>

          {/* 9. Space (17px) + 10. Friction Reducer */}
          <div className="hero-anim-friction mt-[17px] text-center text-xs text-white/65 font-medium">
            [CTA FRICTION REDUCER — ONLY IF VERIFIED]
          </div>

          {/* 11. Large breathing room (32px) + 12. Long Divider */}
          <div className="hero-anim-divider mt-8 w-full border-t border-white/24" />

          {/* 13. EXACTLY THREE METRICS ON MOBILE */}
          <div className="grid grid-cols-3 pt-5 pb-6">
            <div className="hero-anim-metric-1 text-center px-1 border-r border-white/18 space-y-1">
              <div className="text-2xl font-bold tracking-tight text-[#F7F4EC] font-mono leading-none">
                X
              </div>
              <div className="text-[11px] font-semibold text-white/65 uppercase tracking-wider leading-tight">
                [METRIC 01 LABEL]
              </div>
            </div>

            <div className="hero-anim-metric-2 text-center px-1 border-r border-white/18 space-y-1">
              <div className="text-2xl font-bold tracking-tight text-[#F7F4EC] font-mono leading-none">
                X
              </div>
              <div className="text-[11px] font-semibold text-white/65 uppercase tracking-wider leading-tight">
                [METRIC 02 LABEL]
              </div>
            </div>

            <div className="hero-anim-metric-3 text-center px-1 space-y-1">
              <div className="text-2xl font-bold tracking-tight text-[#F7F4EC] font-mono leading-none">
                X
              </div>
              <div className="text-[11px] font-semibold text-white/65 uppercase tracking-wider leading-tight">
                [METRIC 03 LABEL]
              </div>
            </div>
          </div>

          {/* 14. Space before image + 15. Hero Image (After metrics in mobile flow) */}
          <div className="pt-2 pb-12">
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10 shadow-2xl">
              <Image
                src="/images/hero-landscape.jpg"
                alt="Real estate land development and serviced plots demo imagery"
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      </section>
  );
}
