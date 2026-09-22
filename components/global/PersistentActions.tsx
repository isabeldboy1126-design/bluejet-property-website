"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { MessageCircle, Phone, Layers } from "lucide-react";
import { CompanyConfig } from "@/types/config";

interface MagneticFloatingButtonProps {
  children: React.ReactNode;
  href: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  className?: string;
}

function MagneticFloatingButton({
  children,
  href,
  target,
  rel,
  ariaLabel,
  className = "",
}: MagneticFloatingButtonProps) {
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setCanHover(finePointer && !reducedMotion);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!canHover) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Subtle magnetic response: Max x: ±4px, y: ±3px, scale: 1.015
    const dx = Math.max(-4, Math.min(4, (e.clientX - centerX) * 0.12));
    const dy = Math.max(-3, Math.min(3, (e.clientY - centerY) * 0.12));
    setTransform({ x: dx, y: dy, scale: 1.015 });
  };

  const handlePointerDown = () => {
    if (!canHover) return;
    setTransform((prev) => ({ ...prev, scale: 0.98 }));
  };

  const handlePointerLeave = () => {
    if (!canHover) return;
    setTransform({ x: 0, y: 0, scale: 1 });
  };

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: canHover
          ? `translate3d(${transform.x.toFixed(2)}px, ${transform.y.toFixed(2)}px, 0) scale(${transform.scale})`
          : undefined,
        transition: canHover ? "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1)" : undefined,
        willChange: canHover ? "transform" : undefined,
      }}
      className={className}
    >
      {children}
    </a>
  );
}

interface PersistentActionsProps {
  company: CompanyConfig;
}

export function PersistentActions({ company }: PersistentActionsProps) {
  const whatsappNumber = company?.contact?.whatsappNumber || "2348020001122";
  const phonePrimary = company?.contact?.phonePrimary || "+234 802 000 1122";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello, I am enquiring about your estate plots and would like more information."
  )}`;

  return (
    <>
      {/* ============================================================ */}
      {/* DESKTOP PERSISTENT CONTROL (Vertical Stacked Bottom-Right)   */}
      {/* ============================================================ */}
      <aside
        aria-label="Floating Utility Controls"
        style={{
          position: "fixed",
          zIndex: 50,
        }}
        className="fixed right-4 bottom-4 md:right-5 md:bottom-0 z-50 flex flex-col items-end gap-2.5"
      >
        {/* 1. Properties Floating Button */}
        <MagneticFloatingButton
          href="#properties"
          ariaLabel="Properties"
          className="inline-flex h-10 md:h-11 items-center gap-2 rounded-full border border-white/20 bg-[#083F39]/95 px-4 md:px-[18px] text-xs font-semibold text-white shadow-lg backdrop-blur-md hover:bg-[#0A4B43] hover:border-white/30 hover:-translate-y-0.5 active:scale-[0.98] transition-all"
        >
          <Layers className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          <span>Properties</span>
        </MagneticFloatingButton>

        {/* 2. WhatsApp Floating Button (Directly below Properties) */}
        <MagneticFloatingButton
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          ariaLabel="Chat on WhatsApp with Estate Advisor"
          className="inline-flex h-11 md:h-12 items-center gap-2 rounded-full bg-[#14B889] px-4 md:px-5 text-xs font-bold text-white shadow-lg hover:bg-[#18C493] active:scale-[0.98] transition-all"
        >
          <MessageCircle className="w-4 h-4 shrink-0 text-white fill-current/20" />
          <span>WhatsApp</span>
        </MagneticFloatingButton>
      </aside>
    </>
  );
}
