"use client";

import { useLayoutEffect, useRef, useState } from "react";

const wait = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export function PageIntro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [finished, setFinished] = useState(false);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const body = document.body;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let cancelled = false;

    const logoTargets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-brand-logo]")
    );

    const logoTarget =
      logoTargets.find((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 1 && rect.height > 1;
      }) ?? null;

    const previousOverflow = body.style.overflow;

    body.classList.remove("site-intro-complete");
    body.classList.add("site-intro-running");
    body.style.overflow = "hidden";

    if (reducedMotion || !logoTarget) {
      body.classList.remove("site-intro-running");
      body.classList.add("site-intro-complete");
      body.style.overflow = previousOverflow;
      setFinished(true);
      return;
    }

    const previousLogoOpacity = logoTarget.style.opacity;
    const previousLogoTransition = logoTarget.style.transition;

    logoTarget.style.opacity = "0";
    logoTarget.style.transition = "none";

    const rect = logoTarget.getBoundingClientRect();

    const visualLogo = logoTarget.cloneNode(true) as HTMLElement;

    visualLogo.removeAttribute("id");
    visualLogo.removeAttribute("data-brand-logo");

    visualLogo.querySelectorAll("[id]").forEach((element) => {
      element.removeAttribute("id");
    });

    Object.assign(visualLogo.style, {
      position: "fixed",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
      margin: "0",
      pointerEvents: "none",
      transformOrigin: "center center",
      willChange: "transform, opacity",
      zIndex: "2",
    });

    overlay.appendChild(visualLogo);

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const targetCenterX = rect.left + rect.width / 2;
    const targetCenterY = rect.top + rect.height / 2;

    const dx = viewportWidth / 2 - targetCenterX;
    const dy = viewportHeight / 2 - targetCenterY;

    const desiredOpeningWidth =
      viewportWidth < 768
        ? viewportWidth * 0.68
        : Math.min(viewportWidth * 0.44, 560);

    const startScale = clamp(
      desiredOpeningWidth / Math.max(rect.width, 1),
      viewportWidth < 768 ? 2.2 : 2.6,
      viewportWidth < 768 ? 4.2 : 5.2
    );

    const startTransform =
      `translate3d(${dx}px, ${dy}px, 0) scale(${startScale})`;

    const runIntro = async () => {
      try {
        const establish = visualLogo.animate(
          [
            {
              opacity: 0,
              transform:
                `translate3d(${dx}px, ${dy + 10}px, 0) ` +
                `scale(${startScale * 0.9})`,
            },
            {
              opacity: 1,
              transform: startTransform,
            },
          ],
          {
            duration: 420,
            easing: "cubic-bezier(0.16, 1, 0.3, 1)",
            fill: "forwards",
          }
        );

        await establish.finished;

        if (cancelled) return;

        await wait(240);

        if (cancelled) return;

        const midScale =
          1 + (startScale - 1) * 0.36;

        const flight = visualLogo.animate(
          [
            {
              offset: 0,
              opacity: 1,
              transform: startTransform,
            },
            {
              offset: 0.64,
              opacity: 1,
              transform:
                `translate3d(${dx * 0.31}px, ${dy * 0.34}px, 0) ` +
                `scale(${midScale})`,
            },
            {
              offset: 1,
              opacity: 1,
              transform: "translate3d(0, 0, 0) scale(1)",
            },
          ],
          {
            duration: 930,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          }
        );

        await flight.finished;

        if (cancelled) return;

        /*
         * The logo has now reached its real navbar position.
         *
         * THIS is the moment the rest of the page is allowed to reveal.
         */
        logoTarget.style.opacity =
          previousLogoOpacity || "1";

        logoTarget.style.transition =
          previousLogoTransition;

        body.classList.remove("site-intro-running");
        body.classList.add("site-intro-complete");

        const cloneFade = visualLogo.animate(
          [
            { opacity: 1 },
            { opacity: 0 },
          ],
          {
            duration: 130,
            easing: "ease-out",
            fill: "forwards",
          }
        );

        const overlayFade = overlay.animate(
          [
            { opacity: 1 },
            { opacity: 0 },
          ],
          {
            duration: 500,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
          }
        );

        await Promise.allSettled([
          cloneFade.finished,
          overlayFade.finished,
        ]);

        if (cancelled) return;

        body.style.overflow = previousOverflow;

        setFinished(true);
      } catch {
        if (cancelled) return;

        logoTarget.style.opacity =
          previousLogoOpacity || "1";

        logoTarget.style.transition =
          previousLogoTransition;

        body.classList.remove("site-intro-running");
        body.classList.add("site-intro-complete");

        body.style.overflow = previousOverflow;

        setFinished(true);
      }
    };

    runIntro();

    return () => {
      cancelled = true;

      logoTarget.style.opacity =
        previousLogoOpacity;

      logoTarget.style.transition =
        previousLogoTransition;

      body.classList.remove("site-intro-running");
      body.style.overflow = previousOverflow;
    };
  }, []);

  if (finished) return null;

  return (
    <div
      ref={overlayRef}
      className="site-intro-overlay"
      aria-hidden="true"
    >
      <div className="site-intro-vignette" />
    </div>
  );
}