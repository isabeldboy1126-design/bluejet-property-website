"use client";

import React, { useEffect, useRef, useState } from "react";

export function LogoFlightCoordinator() {
  const [shouldRender, setShouldRender] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Never show on mobile or when reduced motion is preferred
    const isMobile = window.innerWidth < 768;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const navLogo = document.getElementById("nav-logo-target");
    if (navLogo) {
      navLogo.style.visibility = "visible";
      navLogo.style.opacity = "1";
    }

    if (isMobile || reducedMotion) {
      return;
    }

    // Enable rendering for intro sequence
    setShouldRender(true);
  }, []);

  useEffect(() => {
    if (!shouldRender) return;

    const cloneEl = cloneRef.current;
    const containerEl = containerRef.current;
    const navLogo = document.getElementById("nav-logo-target");

    if (!cloneEl || !containerEl || !navLogo) {
      if (navLogo) {
        navLogo.style.visibility = "visible";
        navLogo.style.opacity = "1";
      }
      if (containerEl) {
        containerEl.style.display = "none";
        containerEl.style.pointerEvents = "none";
      }
      setShouldRender(false);
      return;
    }

    // Hide target navbar logo during intro flight
    navLogo.style.opacity = "0";
    navLogo.style.transition = "opacity 0.2s ease";

    // Clean handoff cleanup helper: hides immediately and lets React safely unmount
    const finalizeHandoff = () => {
      if (navLogo) {
        navLogo.style.visibility = "visible";
        navLogo.style.opacity = "1";
      }
      if (containerEl) {
        containerEl.style.display = "none";
        containerEl.style.pointerEvents = "none";
      }
      setShouldRender(false);
    };

    // Step 1: Center reveal (0.00s - 0.35s)
    let flightAnim: Animation | null = null;
    cloneEl.animate(
      [
        { opacity: 0, transform: "scale(0.92)" },
        { opacity: 1, transform: "scale(1)" },
      ],
      {
        duration: 350,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards",
      }
    );

    // Step 2: Flight to navbar logo (0.45s - 1.33s)
    const flightTimer = setTimeout(() => {
      try {
        const targetRect = navLogo.getBoundingClientRect();
        const cloneRect = cloneEl.getBoundingClientRect();

        const deltaX =
          targetRect.left + targetRect.width / 2 - (cloneRect.left + cloneRect.width / 2);
        const deltaY =
          targetRect.top + targetRect.height / 2 - (cloneRect.top + cloneRect.height / 2);
        const scaleX = targetRect.width / cloneRect.width;
        const scaleY = targetRect.height / cloneRect.height;

        flightAnim = cloneEl.animate(
          [
            { transform: "translate3d(0, 0, 0) scale(1)", opacity: 1 },
            {
              transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`,
              opacity: 1,
            },
          ],
          {
            duration: 880,
            easing: "cubic-bezier(0.65, 0, 0.35, 1)",
            fill: "forwards",
          }
        );

        flightAnim.onfinish = finalizeHandoff;
      } catch {
        finalizeHandoff();
      }
    }, 450);

    // Step 3: Hard failsafe timer to guarantee DOM removal
    const safetyTimer = setTimeout(() => {
      finalizeHandoff();
    }, 1500);

    return () => {
      clearTimeout(flightTimer);
      clearTimeout(safetyTimer);
      finalizeHandoff();
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <div
      id="hero-intro-logo-container"
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
    >
      <div
        ref={cloneRef}
        style={{ willChange: "transform, opacity" }}
        className="h-9 px-3.5 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wider border border-white/20 shadow-2xl"
      >
        [COMPANY LOGO]
      </div>
    </div>
  );
}
