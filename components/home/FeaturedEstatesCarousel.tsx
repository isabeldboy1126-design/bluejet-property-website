"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";
import { siteMode } from "@/lib/config";

interface EstateSlide {
  id: string;
  name: string;
  location: string;
  primaryBenefit: string;
  fact01: string;
  fact02: string;
  fact03: string;
  price: string;
  imageUrl: string;
}

const estateSlides: EstateSlide[] = [
  {
    id: "estate-01",
    name: "[ESTATE NAME 01]",
    location: "[ESTATE LOCATION]",
    primaryBenefit: "[PRIMARY BUYER BENEFIT / DESIRED OUTCOME THIS PROPERTY SUPPORTS]",
    fact01: "[PROPERTY DECISION FACT 01]",
    fact02: "[PROPERTY DECISION FACT 02]",
    fact03: "[PROPERTY DECISION FACT 03]",
    price: "[VERIFIED PRICE / PRICE RANGE]",
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "estate-02",
    name: "[ESTATE NAME 02]",
    location: "[ESTATE LOCATION]",
    primaryBenefit: "[PRIMARY BUYER BENEFIT / DESIRED OUTCOME THIS PROPERTY SUPPORTS]",
    fact01: "[PROPERTY DECISION FACT 01]",
    fact02: "[PROPERTY DECISION FACT 02]",
    fact03: "[PROPERTY DECISION FACT 03]",
    price: "[VERIFIED PRICE / PRICE RANGE]",
    imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "estate-03",
    name: "[ESTATE NAME 03]",
    location: "[ESTATE LOCATION]",
    primaryBenefit: "[PRIMARY BUYER BENEFIT / DESIRED OUTCOME THIS PROPERTY SUPPORTS]",
    fact01: "[PROPERTY DECISION FACT 01]",
    fact02: "[PROPERTY DECISION FACT 02]",
    fact03: "[PROPERTY DECISION FACT 03]",
    price: "[VERIFIED PRICE / PRICE RANGE]",
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  },
];

export function FeaturedEstatesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const featuredCarouselRef = useRef<HTMLDivElement>(null);

  const dragState = useRef({
    active: false,
    startX: 0,
    startScrollLeft: 0,
    pointerId: -1,
    hasDragged: false,
  });

  /* Entrance observer (once) */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

  /* Calculate depth, scale, opacity, translateY, and image drag shift */
  const updateFeaturedSlideDepth = (carousel: HTMLElement) => {
    const carouselRect = carousel.getBoundingClientRect();
    const carouselCenter = carouselRect.left + carouselRect.width / 2;
    const slides = carousel.querySelectorAll<HTMLElement>("[data-featured-slide]");
    const isMobile = window.innerWidth < 768;

    slides.forEach((slide) => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const distance = Math.abs(slideCenter - carouselCenter);
      const maxDistance = carouselRect.width * (isMobile ? 0.88 : 0.72);
      const normalized = Math.min(1, distance / Math.max(maxDistance, 1));
      const focus = 1 - normalized;

      const baseScale = isMobile ? 0.97 : 0.90;
      const scale = baseScale + focus * (1 - baseScale);
      const baseOpacity = isMobile ? 0.85 : 0.68;
      const opacity = baseOpacity + focus * (1 - baseOpacity);
      const y = normalized * (isMobile ? 6 : 18);

      slide.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      slide.style.opacity = opacity.toFixed(3);
      slide.style.zIndex = String(Math.round(10 + focus * 10));

      /* Optional horizontal image parallax during carousel drag (Section 17) */
      const imgInner = slide.querySelector<HTMLElement>(".featured-property-image-inner");
      if (imgInner) {
        const offsetDirection = (carouselCenter - slideCenter) / Math.max(maxDistance, 1);
        const imgX = Math.max(-14, Math.min(14, offsetDirection * (isMobile ? 6 : 12)));
        imgInner.dataset.dragX = imgX.toFixed(2);
        const scrollY = imgInner.dataset.scrollY || "0";
        imgInner.style.transform = `translate3d(${imgX.toFixed(2)}px, ${scrollY}px, 0)`;
      }
    });
  };

  /* Get slide index closest to center */
  const getClosestFeaturedIndex = (carousel: HTMLElement) => {
    const carouselRect = carousel.getBoundingClientRect();
    const center = carouselRect.left + carouselRect.width / 2;
    const slides = Array.from(carousel.querySelectorAll<HTMLElement>("[data-featured-slide]"));

    let closestIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    slides.forEach((slide, index) => {
      const rect = slide.getBoundingClientRect();
      const slideCenter = rect.left + rect.width / 2;
      const distance = Math.abs(slideCenter - center);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  /* Smooth scroll to target slide */
  const scrollToSlide = (index: number) => {
    const carousel = featuredCarouselRef.current;
    if (!carousel) return;
    const slides = carousel.querySelectorAll<HTMLElement>("[data-featured-slide]");
    const slide = slides[index];
    if (!slide) return;

    const carouselRect = carousel.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const currentScrollLeft = carousel.scrollLeft;
    const slideCenterRelativeToCarousel = (slideRect.left - carouselRect.left) + slideRect.width / 2;
    const targetScrollLeft = currentScrollLeft + (slideCenterRelativeToCarousel - carouselRect.width / 2);

    carousel.scrollTo({
      left: targetScrollLeft,
      behavior: "smooth",
    });
  };

  const handlePrev = () => {
    const carousel = featuredCarouselRef.current;
    if (!carousel) return;
    const current = getClosestFeaturedIndex(carousel);
    const prevIdx = current === 0 ? estateSlides.length - 1 : current - 1;
    scrollToSlide(prevIdx);
  };

  const handleNext = () => {
    const carousel = featuredCarouselRef.current;
    if (!carousel) return;
    const current = getClosestFeaturedIndex(carousel);
    const nextIdx = current === estateSlides.length - 1 ? 0 : current + 1;
    scrollToSlide(nextIdx);
  };

  /* Desktop pointer drag handlers */
  const onFeaturedPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    if (event.button !== 0) return;

    const target = event.target as HTMLElement | null;
    if (target?.closest("a, button, [role='button']")) {
      return;
    }

    const carousel = featuredCarouselRef.current;
    if (!carousel) return;

    dragState.current = {
      active: true,
      startX: event.clientX,
      startScrollLeft: carousel.scrollLeft,
      pointerId: event.pointerId,
      hasDragged: false,
    };

    carousel.setPointerCapture(event.pointerId);
    carousel.classList.add("is-dragging");
  };

  const onFeaturedPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = featuredCarouselRef.current;
    if (!carousel || !dragState.current.active) return;

    const delta = event.clientX - dragState.current.startX;
    if (Math.abs(delta) > 5) {
      dragState.current.hasDragged = true;
    }

    carousel.scrollLeft = dragState.current.startScrollLeft - delta;
  };

  const endFeaturedDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const carousel = featuredCarouselRef.current;
    if (!carousel || !dragState.current.active) return;

    dragState.current.active = false;
    carousel.classList.remove("is-dragging");

    if (carousel.hasPointerCapture(event.pointerId)) {
      carousel.releasePointerCapture(event.pointerId);
    }

    if (dragState.current.hasDragged) {
      const closestIdx = getClosestFeaturedIndex(carousel);
      scrollToSlide(closestIdx);
    }
  };

  const handleSlideClickCapture = (e: React.MouseEvent) => {
    if (dragState.current.hasDragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  /* Continuous depth update via RAF */
  useEffect(() => {
    const carousel = featuredCarouselRef.current;
    if (!carousel) return;

    let raf: number | null = null;
    let lastIndex = -1;

    const update = () => {
      raf = null;
      updateFeaturedSlideDepth(carousel);
      const closest = getClosestFeaturedIndex(carousel);
      if (closest !== lastIndex) {
        lastIndex = closest;
        setCurrentIndex(closest);
      }
    };

    const requestUpdate = () => {
      if (raf !== null) return;
      raf = requestAnimationFrame(update);
    };

    carousel.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    update();
    const timer = setTimeout(update, 50);

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      clearTimeout(timer);
      carousel.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      data-motion-section="estates"
      className={`space-y-6 ${isRevealed ? "estates-revealed" : ""}`}
    >
      <div data-motion-inner="featured-properties" className="space-y-6">
        {/* Real Horizontal Track Container */}
        <div className="featured-properties-viewport-wrap">
          <div
            ref={featuredCarouselRef}
            data-featured-carousel
            className="featured-properties-track"
            onPointerDown={onFeaturedPointerDown}
            onPointerMove={onFeaturedPointerMove}
            onPointerUp={endFeaturedDrag}
            onPointerCancel={endFeaturedDrag}
          >
            {estateSlides.map((slide, index) => (
              <article
                key={slide.id}
                data-featured-slide
                data-featured-index={index}
                className="featured-property-slide shrink-0 snap-center"
                onClickCapture={handleSlideClickCapture}
              >
                <div className="featured-property-scroll-parallax">
                  <div className="overflow-hidden rounded-2xl border border-blue-600/20 bg-white shadow-[0_0_35px_-5px_rgba(2,92,222,0.15)] transition-all">
                    <div className="grid grid-cols-1 lg:grid-cols-12">
                      {/* Large Estate Image with Differential Parallax Window */}
                      <div className="lg:col-span-7 relative min-h-[280px] sm:min-h-[380px] lg:min-h-[480px] bg-slate-100 overflow-hidden estates-media-window">
                        <div className="featured-property-image-inner">
                          <Image
                            src={slide.imageUrl}
                            alt={slide.name}
                            fill
                            priority={index === 0}
                            className="object-cover estates-media-img"
                            sizes="(max-width: 1024px) 100vw, 58vw"
                          />
                        </div>
                      </div>

                      {/* Information Section */}
                      <div className="lg:col-span-5 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                        <div className="space-y-4">
                          {/* Location */}
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <MapPin className="w-3.5 h-3.5 text-[#025CDE] shrink-0" />
                            <span>{slide.location}</span>
                          </div>

                          {/* Estate Name */}
                          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                            {slide.name}
                          </h3>

                          {/* Primary Buyer Benefit */}
                          <p className="text-sm text-slate-600 leading-relaxed font-normal">
                            {slide.primaryBenefit}
                          </p>

                          {/* Three Decision Facts */}
                          <div className="pt-2 space-y-2.5">
                            {[slide.fact01, slide.fact02, slide.fact03].map((fact, i) => (
                              <div
                                key={i}
                                className="flex items-start gap-2.5 rounded-lg bg-slate-50 border border-slate-200/80 p-3 text-xs"
                              >
                                <CheckCircle2 className="w-4 h-4 text-[#025CDE] shrink-0 mt-0.5" />
                                <span className="text-slate-900 font-medium">{fact}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Price & CTA Row */}
                        <div className="pt-5 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 block">
                              Price
                            </span>
                            <span className="text-xl sm:text-2xl font-bold text-slate-900 tabular-nums">
                              {slide.price}
                            </span>
                          </div>

                          <Link
                            href={siteMode === "single" ? "#inspection" : "/estates"}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-sm transition-transform active:scale-95 touch-target"
                          >
                            <span>View Properties</span>
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Navigation Bar (Counter, Dots, Arrows) */}
        <div className="flex items-center justify-between px-1">
          {/* Counter */}
          <div className="text-xs font-mono font-semibold text-slate-500">
            <span className="text-slate-900 font-bold">
              0{currentIndex + 1}
            </span>{" "}
            / 0{estateSlides.length}
          </div>

          {/* Pagination Dots (● ○ ○) */}
          <div
            className="flex items-center gap-2"
            role="tablist"
            aria-label="Slide navigation"
          >
            {estateSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => scrollToSlide(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? "w-6 h-2 bg-[#025CDE]"
                    : "w-2 h-2 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
                aria-selected={idx === currentIndex}
              />
            ))}
          </div>

          {/* Circular Arrow Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors touch-target shadow-sm"
              aria-label="Previous property"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition-colors touch-target shadow-sm"
              aria-label="Next property"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}