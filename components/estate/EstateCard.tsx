"use client";

import React from "react";
import Link from "next/link";
import { MapPin, ArrowRight, Layers, CheckCircle2 } from "lucide-react";
import { EstateItem } from "@/types/estate";
import { HeroMediaRegion } from "./HeroMediaRegion";
import { TitleBadge } from "./TitleBadge";

interface EstateCardProps {
  estate: EstateItem;
}

export function EstateCard({ estate }: EstateCardProps) {

  const statusLabels: Record<string, { label: string; bg: string; text: string }> = {
    AVAILABLE: { label: "Plots Available", bg: "bg-emerald-50 text-emerald-800 border-emerald-200", text: "text-emerald-800" },
    NEW_LAUNCH: { label: "New Phase Launch", bg: "bg-blue-50 text-blue-800 border-blue-200", text: "text-blue-800" },
    PHASE_1_ALLOCATED: { label: "Phase 1 Allocated • Phase 2 Open", bg: "bg-amber-50 text-amber-900 border-amber-200", text: "text-amber-900" },
    INFRASTRUCTURE_UNDERWAY: { label: "Civil Works Underway", bg: "bg-purple-50 text-purple-800 border-purple-200", text: "text-purple-800" },
    SOLD_OUT: { label: "Fully Allocated", bg: "bg-slate-100 text-slate-600 border-slate-200", text: "text-slate-600" },
  };

  const statusInfo = statusLabels[estate.operationalStatus] || {
    label: "Active Development",
    bg: "bg-slate-100 text-slate-800 border-slate-200",
    text: "text-slate-800",
  };

  return (
    <article
      className="flex flex-col bg-[var(--theme-card)] border border-[var(--theme-border)] rounded overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group"
    >
      {/* Media Region */}
      <div className="relative">
        <HeroMediaRegion
          media={estate.heroMedia}
          estateName={estate.name}
          locationLabel={`${estate.location.city}, ${estate.location.state}`}
          aspectRatioClass="aspect-[16/10]"
        />

        {/* Factual Operational Status Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded text-[10px] font-semibold border ${statusInfo.bg} shadow-sm`}
          >
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between gap-5">
        <div className="space-y-3">
          {/* Location Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs text-[var(--theme-muted)] font-medium">
            <MapPin className="w-3.5 h-3.5 text-[var(--theme-accent)] shrink-0" />
            <span className="truncate">
              {estate.location.corridor} • {estate.location.city}, {estate.location.state}
            </span>
          </div>

          {/* Estate Name */}
          <h3 className="font-bold text-lg sm:text-xl tracking-tight text-[var(--theme-text)] group-hover:text-[var(--theme-accent)] transition-colors">
            <Link href={`/estates/${estate.slug}`}>{estate.name}</Link>
          </h3>

          {/* Title Documentation Badge */}
          <div>
            <TitleBadge title={estate.title} />
          </div>

          {/* Plot Sizes & Specs */}
          {estate.plots && estate.plots.length > 0 && (
            <div className="pt-2 flex items-center gap-2 text-xs text-[var(--theme-muted)]">
              <Layers className="w-3.5 h-3.5 text-[var(--theme-muted)] shrink-0" />
              <span>Plot Sizes:</span>
              <span className="font-semibold text-[var(--theme-text)]">
                {estate.plots.map((p) => p.size).join(" • ")}
              </span>
            </div>
          )}
        </div>

        {/* Card Footer: Pricing & Action */}
        <div className="pt-4 border-t border-[var(--theme-border)] flex items-end justify-between gap-4">
          <div>
            {estate.entryPriceDisplay ? (
              <div>
                <span className="block text-[10px] font-medium uppercase tracking-wider text-[var(--theme-muted)]">
                  Starting Price
                </span>
                <span className="text-base sm:text-lg font-bold text-[var(--theme-text)] tabular-nums">
                  {estate.entryPriceDisplay}
                </span>
                {estate.entryDepositDisplay && (
                  <span className="block text-[10px] text-[var(--theme-muted)]">
                    {estate.entryDepositDisplay}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-xs font-semibold text-[var(--theme-muted)]">
                Price On Application
              </span>
            )}
          </div>

          <Link
            href={`/estates/${estate.slug}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded bg-[var(--theme-tag-bg)] hover:bg-[var(--theme-accent)] hover:text-white text-xs font-bold text-[var(--theme-tag-text)] transition-colors touch-target"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
