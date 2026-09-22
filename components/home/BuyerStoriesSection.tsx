"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { OpenModalButton } from "@/components/conversion/OpenModalButton";

export interface BuyerStory {
  id: string;
  quote: string;
  rating: number;
  ratingLabel: string;
  buyerImage: string;
  buyerName: string;
  buyerRole: string;
  reviewSource: string;
}

const defaultBuyerStories: BuyerStory[] = [
  {
    id: "story-01",
    quote:
      '"[RELEVANT BUYER OR INVESTOR EXPERIENCE SHOWING CONFIDENCE, ALLOCATION, HANDOVER OR DELIVERY]"',
    rating: 5,
    ratingLabel: "[VERIFIED REVIEW RATING]",
    buyerImage: "/images/buyer-avatar-1.jpg",
    buyerName: "[BUYER NAME]",
    buyerRole: "[BUYER / INVESTOR]",
    reviewSource: "[VERIFIED REVIEW SOURCE]",
  },
  {
    id: "story-02",
    quote:
      '"[RELEVANT BUYER OR INVESTOR EXPERIENCE SHOWING CONFIDENCE, ALLOCATION, HANDOVER OR DELIVERY]"',
    rating: 5,
    ratingLabel: "[VERIFIED REVIEW RATING]",
    buyerImage: "/images/buyer-avatar-2.jpg",
    buyerName: "[BUYER NAME]",
    buyerRole: "[BUYER / INVESTOR]",
    reviewSource: "[VERIFIED REVIEW SOURCE]",
  },
  {
    id: "story-03",
    quote:
      '"[RELEVANT BUYER OR INVESTOR EXPERIENCE SHOWING CONFIDENCE, ALLOCATION, HANDOVER OR DELIVERY]"',
    rating: 5,
    ratingLabel: "[VERIFIED REVIEW RATING]",
    buyerImage: "/images/buyer-avatar-3.jpg",
    buyerName: "[BUYER NAME]",
    buyerRole: "[BUYER / INVESTOR]",
    reviewSource: "[VERIFIED REVIEW SOURCE]",
  },
];

interface BuyerStoriesSectionProps {
  stories?: BuyerStory[];
}

export function BuyerStoriesSection({
  stories = defaultBuyerStories,
}: BuyerStoriesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  // Entrance trigger observer (once: true)
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
      { rootMargin: "0px 0px -20% 0px", threshold: 0.05 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Track active index on mobile swipe
  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, clientWidth } = carouselRef.current;
    const cardWidth = clientWidth * 0.86;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveMobileIndex(Math.max(0, Math.min(stories.length - 1, index)));
  };

  return (
    <section
      id="buyer-stories"
      ref={sectionRef}
      data-motion-section="buyer-stories"
      style={{ backgroundColor: "#F7F8F6" }}
      className={`w-full py-20 lg:py-24 scroll-mt-24 ${
        isRevealed ? "buyer-stories-revealed" : ""
      }`}
    >
      <div data-motion-inner="buyer-stories" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header: Centered Eyebrow + Headline */}
        <div className="text-center max-w-4xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
            BUYER STORIES
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-bold text-slate-900 tracking-tight leading-[1.2]">
            [JOIN X AMOUNT OF PEOPLE WHO STOPPED GETTING PAIN POINT AND STARTED GETTING DREAM OUTCOME]
          </h2>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP VIEW: Exactly 3 Editorial Testimonial Cards          */}
        {/* ============================================================ */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {stories.map((story, idx) => (
            <div
              key={story.id}
              data-motion-buyer-card={idx + 1}
              className={`buyer-story-card buyer-story-card-${
                idx + 1
              } rounded-xl border border-[#E5EBE7] bg-white p-7 sm:p-8 lg:p-9 shadow-sm flex flex-col justify-between transition-shadow duration-300 hover:shadow-md`}
            >
              <div className="buyer-story-parallax-inner h-full flex flex-col justify-between">
                {/* 1. Testimonial Quote */}
                <p className="text-sm sm:text-[0.95rem] text-slate-700 leading-relaxed font-normal italic mb-6">
                  {story.quote}
                </p>

                <div className="space-y-5 pt-2 mt-auto">
                  {/* 2. Visible Star-Rating Row (Data-driven position) */}
                  <div
                    className="flex items-center gap-1 text-amber-500"
                    aria-label={`${story.rating} out of 5 stars`}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < story.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-100 text-slate-300"
                        }`}
                      />
                    ))}
                    <span className="sr-only">{story.ratingLabel}</span>
                  </div>

                  {/* 3. Customer Identity Row */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-11 h-11 rounded-full overflow-hidden border border-slate-200/80 shrink-0 bg-slate-100">
                        <Image
                          src={story.buyerImage}
                          alt={story.buyerName}
                          fill
                          className="object-cover"
                          sizes="44px"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-sm text-slate-900 truncate">
                          {story.buyerName}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                          {story.buyerRole}
                        </div>
                      </div>
                    </div>

                    {/* Review Source Placement */}
                    <div className="text-xs font-semibold text-slate-400 shrink-0">
                      {story.reviewSource}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ============================================================ */}
        {/* MOBILE VIEW: Manual Horizontal Swipe Carousel                */}
        {/* ============================================================ */}
        <div className="block md:hidden">
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="buyer-stories-mobile-carousel flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-4 -mx-4 px-4"
            style={{
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {stories.map((story, idx) => (
              <div
                key={story.id}
                className={`buyer-story-mobile-card ${
                  idx === 0 ? "buyer-story-mobile-first" : ""
                } w-[86%] shrink-0 snap-center rounded-xl border border-[#E5EBE7] bg-white p-6 shadow-sm flex flex-col justify-between`}
              >
                {/* 1. Quote */}
                <p className="text-sm text-slate-700 leading-relaxed font-normal italic mb-6">
                  {story.quote}
                </p>

                <div className="space-y-4 pt-2 mt-auto">
                  {/* 2. Star Rating */}
                  <div
                    className="flex items-center gap-1 text-amber-500"
                    aria-label={`${story.rating} out of 5 stars`}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < story.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-slate-100 text-slate-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* 3. Identity */}
                  <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200/80 shrink-0 bg-slate-100">
                        <Image
                          src={story.buyerImage}
                          alt={story.buyerName}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                          {story.buyerName}
                        </div>
                        <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider truncate">
                          {story.buyerRole}
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-400 shrink-0">
                      {story.reviewSource}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Restrained Carousel Indicator (01 / 03) */}
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-mono font-semibold text-slate-500">
            <span>{String(activeMobileIndex + 1).padStart(2, "0")}</span>
            <span className="text-slate-300">/</span>
            <span>{String(stories.length).padStart(2, "0")}</span>
          </div>
        </div>

        {/* Centered CTA: Get Similar Results */}
        <div className="mt-12 sm:mt-14 text-center">
          <OpenModalButton
            variant="primary"
            className="inline-flex items-center justify-center font-bold text-xs rounded-lg px-7 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm hover:shadow transition-all active:scale-95"
          >
            <span>Get Similar Results</span>
          </OpenModalButton>
        </div>
      </div>
    </section>
  );
}