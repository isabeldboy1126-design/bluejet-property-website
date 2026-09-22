"use client";

import { useEffect } from "react";

type MotionState = {
  progress: number;
  centered: number;
  focus: number;
  visible: boolean;
};

const clamp = (
  value: number,
  min = 0,
  max = 1
) => Math.min(max, Math.max(min, value));

function getMotionState(
  element: HTMLElement,
  viewportHeight: number
): MotionState {
  const rect = element.getBoundingClientRect();

  const totalTravel =
    viewportHeight + rect.height;

  const progress = clamp(
    (viewportHeight - rect.top) /
      Math.max(totalTravel, 1),
    0,
    1
  );

  /*
   * centered:
   *
   * -1 = entering from bottom
   *  0 = visual centre
   * +1 = exiting through top
   */
  const centered =
    progress * 2 - 1;

  /*
   * focus:
   *
   * 0 at the outer travel edges.
   * 1 around the visual centre.
   */
  const focus =
    1 - Math.min(1, Math.abs(centered));

  return {
    progress,
    centered,
    focus,
    visible:
      rect.bottom >
        -viewportHeight * 0.18 &&
      rect.top <
        viewportHeight * 1.18,
  };
}

function applyTransform(
  element: HTMLElement | null,
  transform: string,
  opacity?: number
) {
  if (!element) return;

  element.style.transform = transform;

  if (opacity !== undefined) {
    element.style.opacity =
      opacity.toFixed(3);
  }
}

export function GlobalScrollMotion() {
  useEffect(() => {
    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (reducedMotion) return;

    let rafId: number | null = null;
    let ticking = false;

    /* ================================================================
       DOM TARGETS
       ================================================================ */

    const hero =
      document.getElementById(
        "hero-section"
      );

    const locationsGallery =
      document.querySelector<HTMLElement>(
        '[data-motion-gallery="locations"]'
      );

    const locationMedia =
      document.querySelectorAll<HTMLElement>(
        ".location-inner-media"
      );

    const featuredProperties =
      document.querySelector<HTMLElement>(
        '[data-motion-section="estates"]'
      );

    const featuredPropertiesInner =
      document.querySelector<HTMLElement>(
        '[data-motion-inner="featured-properties"]'
      );

    const featuredImageInners =
      document.querySelectorAll<HTMLElement>(
        ".featured-property-image-inner"
      );

    const buyerStoriesSection =
      document.getElementById(
        "buyer-stories"
      );

    const buyerStoriesInner =
      document.querySelector<HTMLElement>(
        '[data-motion-inner="buyer-stories"]'
      );

    const buyerStoryLayers =
      document.querySelectorAll<HTMLElement>(
        ".buyer-story-parallax-inner"
      );

    const whyBuySection =
      document.querySelector<HTMLElement>(
        '[data-motion-section="why-buy"]'
      );

    const whyBuyInner =
      document.querySelector<HTMLElement>(
        '[data-motion-inner="why-buy"]'
      );

    const whyBuyLayers =
      document.querySelectorAll<HTMLElement>(
        ".why-buy-parallax-inner"
      );

    const claritySection =
      document.querySelector<HTMLElement>(
        '[data-motion-section="clarity"]'
      );

    const clarityMedia =
      document.querySelector<HTMLElement>(
        ".clarity-media-inner"
      );

    const howItWorksSection =
      document.querySelector<HTMLElement>(
        '[data-motion-section="how-it-works"]'
      );

    const howDesktopLine =
      document.getElementById(
        "how-it-works-line-desktop"
      );

    const howMobileLine =
      document.getElementById(
        "how-it-works-line-mobile"
      );

    const inspectionSection =
      document.querySelector<HTMLElement>(
        '[data-motion-section="inspection"]'
      );

    const inspectionInner =
      document.querySelector<HTMLElement>(
        '[data-motion-inner="inspection"]'
      );

    const inspectionBackground =
      document.querySelector<HTMLElement>(
        "[data-motion-enquiry-bg]"
      );

    /* ================================================================
       UPDATE
       ================================================================ */

    const updateMotion = () => {
      ticking = false;

      const vh =
        window.innerHeight;

      const mobile =
        window.innerWidth < 768;

      /* ==============================================================
         1. HERO — DEPTH RECESSION
         ============================================================== */

      if (hero) {
        const rect =
          hero.getBoundingClientRect();

        const height =
          hero.offsetHeight || vh;

        const progress = clamp(
          -rect.top /
            Math.max(
              height * 0.88,
              1
            ),
          0,
          1
        );

        const scale =
          1 -
          progress *
            (mobile
              ? 0.012
              : 0.028);

        const y =
          -progress *
          (mobile
            ? 13
            : 30);

        const opacity =
          1 -
          progress *
            (mobile
              ? 0.14
              : 0.25);

        applyTransform(
          hero,
          `translate3d(
            0,
            ${y.toFixed(2)}px,
            0
          ) scale(${scale.toFixed(4)})`,
          opacity
        );

        hero.style.transformOrigin =
          "center top";
      }

      /* ==============================================================
         2. LOCATIONS — GALLERY GROWTH
         ============================================================== */

      if (locationsGallery) {
        const state =
          getMotionState(
            locationsGallery,
            vh
          );

        if (state.visible) {
          const edgeScale =
            mobile
              ? 0.965
              : 0.915;

          const scale =
            edgeScale +
            state.focus *
              (1 - edgeScale);

          const y =
            -state.centered *
            (mobile
              ? 17
              : 42);

          const opacity =
            (mobile
              ? 0.80
              : 0.70) +
            state.focus *
              (mobile
                ? 0.20
                : 0.30);

          applyTransform(
            locationsGallery,
            `translate3d(
              0,
              ${y.toFixed(2)}px,
              0
            ) scale(${scale.toFixed(4)})`,
            opacity
          );

          locationsGallery.style.transformOrigin =
            "center center";
        }
      }

      /*
       * True inner-image parallax.
       *
       * Card frame and photograph move at different speeds.
       */
      locationMedia.forEach(
        (media) => {
          const card =
            media.parentElement;

          if (!card) return;

          const state =
            getMotionState(
              card,
              vh
            );

          if (!state.visible) return;

          const y =
            state.centered *
            (mobile
              ? 13
              : 29);

          media.style.transform =
            `translate3d(
              0,
              ${y.toFixed(2)}px,
              0
            ) scale(1.055)`;
        }
      );

      /* ==============================================================
         3. FEATURED PROPERTIES — SECTION LEVEL + IMAGE IN-FRAME DEPTH
         ============================================================== */

      if (
        featuredProperties &&
        featuredPropertiesInner
      ) {
        const state =
          getMotionState(
            featuredProperties,
            vh
          );

        if (state.visible) {
          const edgeScale =
            mobile
              ? 0.992
              : 0.982;

          const scale =
            edgeScale +
            state.focus *
              (1 - edgeScale);

          const y =
            -state.centered *
            (mobile
              ? 8
              : 18);

          const opacity =
            (mobile
              ? 0.90
              : 0.86) +
            state.focus *
              (mobile
                ? 0.10
                : 0.14);

          applyTransform(
            featuredPropertiesInner,
            `translate3d(
              0,
              ${y.toFixed(2)}px,
              0
            ) scale(${scale.toFixed(4)})`,
            opacity
          );

          /* Page-scroll vertical image parallax inside frame (Section 16) */
          const imgY = state.centered * (mobile ? 7 : 16);
          featuredImageInners.forEach((img) => {
            const dragX = img.dataset.dragX || "0";
            img.dataset.scrollY = imgY.toFixed(2);
            img.style.transform = `translate3d(${dragX}px, ${imgY.toFixed(2)}px, 0)`;
          });
        }
      }

      /* ==============================================================
         4. BUYER STORIES — PROOF-SHEET DEPTH
         ============================================================== */

      if (
        buyerStoriesSection &&
        buyerStoriesInner
      ) {
        const state =
          getMotionState(
            buyerStoriesSection,
            vh
          );

        if (state.visible) {
          const edgeScale =
            mobile
              ? 0.992
              : 0.978;

          const scale =
            edgeScale +
            state.focus *
              (1 - edgeScale);

          const y =
            -state.centered *
            (mobile
              ? 11
              : 26);

          const opacity =
            (mobile
              ? 0.88
              : 0.80) +
            state.focus *
              (mobile
                ? 0.12
                : 0.20);

          applyTransform(
            buyerStoriesInner,
            `translate3d(
              0,
              ${y.toFixed(2)}px,
              0
            ) scale(${scale.toFixed(4)})`,
            opacity
          );

          buyerStoryLayers.forEach(
            (
              layer,
              index
            ) => {
              const side =
                index === 0
                  ? -1
                  : index === 2
                  ? 1
                  : 0;

              const x =
                side *
                state.centered *
                (mobile
                  ? 0
                  : 6);

              const layerY =
                state.centered *
                (mobile
                  ? 3
                  : index === 1
                  ? 9
                  : 6);

              const rotation =
                side *
                state.centered *
                (mobile
                  ? 0
                  : 0.28);

              layer.style.transform =
                `translate3d(
                  ${x.toFixed(2)}px,
                  ${layerY.toFixed(2)}px,
                  0
                )
                rotate(
                  ${rotation.toFixed(3)}deg
                )`;
            }
          );
        }
      }

      /* ==============================================================
         5. WHY BUY WITH US — DIFFERENTIAL BENEFIT DEPTH
         ============================================================== */

      if (
        whyBuySection &&
        whyBuyInner
      ) {
        const state =
          getMotionState(
            whyBuySection,
            vh
          );

        if (state.visible) {
          const edgeScale =
            mobile
              ? 0.994
              : 0.985;

          const scale =
            edgeScale +
            state.focus *
              (1 - edgeScale);

          const y =
            -state.centered *
            (mobile
              ? 9
              : 21);

          applyTransform(
            whyBuyInner,
            `translate3d(
              0,
              ${y.toFixed(2)}px,
              0
            ) scale(${scale.toFixed(4)})`
          );

          whyBuyLayers.forEach(
            (
              layer,
              index
            ) => {
              const side =
                index === 0
                  ? -1
                  : index === 2
                  ? 1
                  : 0;

              const x =
                side *
                state.centered *
                (mobile
                  ? 0
                  : 5);

              const layerY =
                state.centered *
                (mobile
                  ? 3
                  : index === 1
                  ? 9
                  : 6);

              layer.style.transform =
                `translate3d(
                  ${x.toFixed(2)}px,
                  ${layerY.toFixed(2)}px,
                  0
                )`;
            }
          );
        }
      }

      /* ==============================================================
         6. VERIFICATION / CLARITY — EVIDENCE PARALLAX
         ============================================================== */

      if (claritySection) {
        const state =
          getMotionState(
            claritySection,
            vh
          );

        if (state.visible) {
          const edgeScale =
            mobile
              ? 0.994
              : 0.986;

          const scale =
            edgeScale +
            state.focus *
              (1 - edgeScale);

          const sectionY =
            -state.centered *
            (mobile
              ? 8
              : 17);

          claritySection.style.transform =
            `translate3d(
              0,
              ${sectionY.toFixed(2)}px,
              0
            )
            scale(
              ${scale.toFixed(4)}
            )`;

          if (clarityMedia) {
            const mediaY =
              state.centered *
              (mobile
                ? 11
                : 27);

            clarityMedia.style.transform =
              `translate3d(
                0,
                ${mediaY.toFixed(2)}px,
                0
              ) scale(1.035)`;
          }
        }
      }

      /* ==============================================================
         7. HOW IT WORKS — SCROLL-CONTROLLED LINE DRAW ONLY
         ============================================================== */

      if (howItWorksSection) {
        const state =
          getMotionState(
            howItWorksSection,
            vh
          );

        if (state.visible) {
          const lineProgress =
            clamp(
              (state.progress -
                0.03) /
                0.94,
              0,
              1
            );

          if (howDesktopLine) {
            howDesktopLine.style.transform =
              `scaleX(${lineProgress.toFixed(4)})`;
          }

          if (howMobileLine) {
            howMobileLine.style.transform =
              `scaleY(${lineProgress.toFixed(4)})`;
          }
        }
      }

      /* ==============================================================
         8. FINAL ENQUIRY — RESTRAINED CONVERGENCE
         
         Conversion usability takes priority here.
         ============================================================== */

      if (
        inspectionSection &&
        inspectionInner
      ) {
        const state =
          getMotionState(
            inspectionSection,
            vh
          );

        if (state.visible) {
          const edgeScale =
            mobile
              ? 0.996
              : 0.990;

          const scale =
            edgeScale +
            state.focus *
              (1 - edgeScale);

          const y =
            -state.centered *
            (mobile
              ? 6
              : 12);

          const opacity =
            (mobile
              ? 0.94
              : 0.90) +
            state.focus *
              (mobile
                ? 0.06
                : 0.10);

          applyTransform(
            inspectionInner,
            `translate3d(
              0,
              ${y.toFixed(2)}px,
              0
            )
            scale(
              ${scale.toFixed(4)}
            )`,
            opacity
          );

          if (
            inspectionBackground
          ) {
            const bgY =
              state.centered *
              (mobile
                ? 9
                : 24);

            inspectionBackground.style.transform =
              `translate3d(
                0,
                ${bgY.toFixed(2)}px,
                0
              ) scale(1.04)`;
          }
        }
      }
    };

    const requestTick = () => {
      if (ticking) return;

      ticking = true;

      rafId =
        requestAnimationFrame(
          updateMotion
        );
    };

    window.addEventListener(
      "scroll",
      requestTick,
      {
        passive: true,
      }
    );

    window.addEventListener(
      "resize",
      requestTick,
      {
        passive: true,
      }
    );

    updateMotion();

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(
          rafId
        );
      }

      window.removeEventListener(
        "scroll",
        requestTick
      );

      window.removeEventListener(
        "resize",
        requestTick
      );
    };
  }, []);

  return null;
}