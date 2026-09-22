"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Calendar, MessageCircle, ArrowRight } from "lucide-react";
import { OpenModalButton } from "@/components/conversion/OpenModalButton";
import { InspectionForm } from "./InspectionForm";

export function InspectionEnquirySection() {
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
      id="inspection"
      ref={sectionRef}
      data-motion-section="inspection"
      style={{
        background:
          "linear-gradient(135deg, #071139 0%, #0A1B44 55%, #050D24 100%)",
      }}
      className={`w-full relative overflow-hidden py-[72px] lg:py-[96px] text-[#F7F4EC] scroll-mt-24 ${
        isRevealed ? "enquiry-revealed" : ""
      }`}
    >
      {/* Restrained Architectural Arc Detail */}
      <div
        data-motion-enquiry-bg
        className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-40"
      >
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 600"
          preserveAspectRatio="none"
        >
          <circle
            cx="1380"
            cy="150"
            r="440"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="1"
          />
          <circle
            cx="80"
            cy="520"
            r="480"
            fill="none"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          data-motion-inner="inspection"
          className={`enquiry-converge ${
            isRevealed ? "enquiry-converge-active" : ""
          } grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start`}
        >
          {/* Left: Next Action Prompt */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300 block">
                TAKE THE NEXT STEP
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl lg:text-[2.2rem] font-bold text-[#F7F4EC] tracking-tight leading-[1.25]">
                [FINAL ACTION HEADLINE CONNECTED TO THE BUYER&apos;S DESIRED OUTCOME]
              </h2>
            </div>

            {/* Body: Two short lines maximum explaining the next action */}
            <p className="text-sm text-white/80 leading-relaxed font-normal">
              [TWO SHORT LINES MAXIMUM EXPLAINING THE NEXT ACTION]
            </p>

            {/* Side-by-side action buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href="#properties"
                className="inline-flex items-center justify-center font-bold text-xs rounded-lg px-5 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 shadow-sm transition-all active:scale-95 touch-target gap-2"
              >
                <span>View Properties</span>
                <ArrowRight className="w-4 h-4 text-blue-300" />
              </Link>

              <a
                href="https://wa.me/?text=Hello%20I%20am%20enquiring%20about%20your%20properties"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center font-bold text-xs rounded-lg px-5 py-3 bg-[#025CDE] hover:bg-[#0047BA] text-white shadow-sm transition-transform active:scale-95 touch-target"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                <span>Talk to an Advisor</span>
              </a>
            </div>

            {/* Friction Reducer */}
            <div className="text-xs text-white/60 font-medium pt-1">
              [VERIFIED FINAL CTA REASSURANCE]
            </div>
          </div>

          {/* Right: Functional Enquiry & Inspection Form */}
          <div className="lg:col-span-7">
            <InspectionForm />
          </div>
        </div>
      </div>
    </section>
  );
}
