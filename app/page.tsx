import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { LocationCardsGrid } from "@/components/home/LocationCardsGrid";
import { FeaturedEstatesCarousel } from "@/components/home/FeaturedEstatesCarousel";
import { BuyerStoriesSection } from "@/components/home/BuyerStoriesSection";
import { WhyBuyWithUsSection } from "@/components/home/WhyBuyWithUsSection";
import { BuyWithClaritySection } from "@/components/home/BuyWithClaritySection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { InspectionEnquirySection } from "@/components/home/InspectionEnquirySection";
import { PageIntro } from "@/components/motion/PageIntro";
import { GlobalScrollMotion } from "@/components/motion/GlobalScrollMotion";

export default function HomePage() {
  return (
    <div>
      {/* Branded Opening Intro */}
      <PageIntro />

      {/* Global Scroll & Parallax Coordinator */}
      <GlobalScrollMotion />

      {/* 1. HERO (Flush with header, no unwanted top margin) */}
      <HeroSection />

      {/* Subsequent Sections with Controlled Spacing */}
      <div className="space-y-16 sm:space-y-24 mt-16 sm:mt-24">
        {/* 2. ABOUT US / TRUST BRIDGE */}
        <AboutSection />

        {/* 3. OUR LOCATIONS */}
        <section id="locations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
          {/* Header: Strict rule: Eyebrow + Headline. STOP THERE. No intro paragraph! */}
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#025CDE]">
              OUR LOCATIONS
            </span>
            <h2 className="mt-2 text-section-heading font-bold text-slate-900 tracking-tight">
              Explore Where You Can Own
            </h2>
          </div>
          <LocationCardsGrid />
        </section>

        {/* 4. FEATURED PROPERTIES (Manual Carousel) */}
        <section id="properties" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24 relative">
          <span id="estates" className="scroll-mt-24 block -mt-24 pt-24 pointer-events-none absolute" aria-hidden="true" />
          {/* Header: Strict rule: Eyebrow + Headline. STOP THERE. No intro paragraph! */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#025CDE]">
                FEATURED PROPERTIES
              </span>
              <h2 className="mt-2 text-section-heading font-bold text-slate-900 tracking-tight">
                Explore Featured Properties
              </h2>
            </div>
            <Link
              href="/estates"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#025CDE] hover:text-[#0047BA]"
            >
              <span>View All Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <FeaturedEstatesCarousel />
        </section>

        {/* 5. BUYER STORIES */}
        <BuyerStoriesSection />

        {/* 6. WHY BUY WITH US */}
        <WhyBuyWithUsSection />

        {/* 7. BUY WITH GREATER CLARITY */}
        <BuyWithClaritySection />

        {/* 8. HOW IT WORKS */}
        <HowItWorksSection />

        {/* 9. INSPECTION / ENQUIRY */}
        <InspectionEnquirySection />
      </div>
    </div>
  );
}
