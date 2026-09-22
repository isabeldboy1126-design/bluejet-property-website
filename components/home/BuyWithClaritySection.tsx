"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Calendar, MessageCircle, CheckCircle2 } from "lucide-react";
import { OpenModalButton } from "@/components/conversion/OpenModalButton";

export function BuyWithClaritySection() {
  const clarityItems = [
    "[PHYSICAL INSPECTION / SITE EVIDENCE IF AVAILABLE]",
    "[TITLE / DOCUMENT INFORMATION IF AVAILABLE]",
    "[SURVEY / PLAN / PROJECT INFORMATION IF AVAILABLE]",
    "[INDEPENDENT DILIGENCE PATH IF AVAILABLE]",
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
      ref={sectionRef}
      data-motion-section="clarity"
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 ${
        isRevealed ? "clarity-revealed" : ""
      }`}
    >
      <div className="clarity-outer-card rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 lg:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: Verification Benefits */}
          <div className="lg:col-span-7 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                BUY WITH GREATER CLARITY
              </span>
              <h2 className="mt-2 text-section-heading font-bold text-slate-900 tracking-tight">
                [VERIFICATION / INSPECTION BENEFIT HEADLINE]
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              [SHORT EXPLANATION OF HOW THE BUYER CAN BETTER UNDERSTAND OR EVALUATE THE PROPERTY BEFORE PROGRESSING]
            </p>

            {/* 4 Clarity Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              {clarityItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 rounded-lg bg-slate-50 p-3.5 border border-slate-200/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-medium text-slate-900 leading-relaxed">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <OpenModalButton variant="primary">
                <Calendar className="w-4 h-4 mr-2" />
                <span>Book an Inspection</span>
              </OpenModalButton>

              <a
                href="#inspection"
                className="inline-flex items-center justify-center font-bold text-xs rounded-lg px-4 py-3 border border-slate-300 bg-white text-slate-900 hover:bg-slate-50 transition-colors touch-target shadow-sm"
              >
                <MessageCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
                <span>Request Property Information</span>
              </a>
            </div>

            {/* Friction Reducer */}
            <div className="text-xs text-slate-500 font-medium pt-0.5">
              [VERIFIED REASSURANCE ABOUT THE ACTION]
            </div>
          </div>

          {/* Right: Real Visual Assets with Verification Document & Site Inspection Evidence */}
          <div className="lg:col-span-5 relative">
            <div className="clarity-media-window relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 shadow-md">
              <div className="clarity-media-inner absolute inset-[-6%]">
                <Image
                  src="/images/verification-docs.jpg"
                  alt="Cadastral survey layout and property documentation verification"
                  fill
                  className="object-cover clarity-media-img"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="absolute bottom-3 left-3 z-10 bg-slate-900/85 backdrop-blur-sm px-2.5 py-1 rounded text-[11px] font-semibold text-white">
                Document & Survey Diligence
              </div>
            </div>

            {/* Secondary Inset Card: Physical Site Inspection (Desktop & Tablet) */}
            <div className="absolute -bottom-5 -right-3 sm:-right-4 w-44 sm:w-52 aspect-[4/3] rounded-lg overflow-hidden border-2 border-white shadow-xl hidden sm:block z-20 bg-slate-900">
              <div className="relative w-full h-full">
                <Image
                  src="/images/verification-site.jpg"
                  alt="Physical site survey and ground inspection"
                  fill
                  className="object-cover"
                  sizes="210px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 left-2 right-2 text-[10px] font-semibold text-white leading-tight">
                  Physical Site Verification
                </div>
              </div>
            </div>

            {/* Secondary Asset on Mobile */}
            <div className="mt-3 sm:hidden flex items-center gap-3 p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <div className="relative w-16 h-12 rounded overflow-hidden shrink-0 bg-slate-200">
                <Image
                  src="/images/verification-site.jpg"
                  alt="Physical site survey and ground inspection"
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-900">Physical Site Verification</div>
                <div className="text-[11px] text-slate-500">On-ground coordinates & beacon check</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
