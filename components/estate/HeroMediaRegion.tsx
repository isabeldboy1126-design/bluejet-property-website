import React from "react";
import Image from "next/image";
import { HeroMediaAsset } from "@/types/estate";
import { MapPin, Image as ImageIcon } from "lucide-react";

interface HeroMediaRegionProps {
  media?: HeroMediaAsset;
  estateName: string;
  locationLabel?: string;
  className?: string;
  aspectRatioClass?: string; // e.g., "aspect-[16/10]" or "aspect-[16/9]"
}

export function HeroMediaRegion({
  media,
  estateName,
  locationLabel,
  className = "",
  aspectRatioClass = "aspect-[16/10]",
}: HeroMediaRegionProps) {
  // If no media asset is supplied, degrade cleanly to a structured architectural frame
  if (!media || !media.url) {
    return (
      <div
        className={`w-full ${aspectRatioClass} bg-slate-100 dark:bg-slate-800 rounded border border-[var(--theme-border)] flex flex-col items-center justify-center p-6 text-center text-[var(--theme-muted)] ${className}`}
      >
        <ImageIcon className="w-8 h-8 opacity-40 mb-2 text-[var(--theme-accent)]" />
        <span className="text-xs font-semibold text-[var(--theme-text)]">{estateName}</span>
        {locationLabel && (
          <span className="text-[11px] opacity-75 flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />
            <span>{locationLabel}</span>
          </span>
        )}
        <span className="text-[10px] mt-2 text-slate-400">Documentation & Site Survey Layout</span>
      </div>
    );
  }

  const badgeLabels: Record<HeroMediaAsset["type"], string> = {
    AUTHENTIC_PHOTO: "Authentic Site View",
    CLIENT_SUPPLIED_PHOTO: "Site Progress Photo",
    LABELLED_RENDER: "Architectural Concept Render",
    MASTER_PLAN: "Approved Master Plan",
    VERIFIED_AERIAL: "Aerial Topography",
    LOCATION_MAP: "Corridor Map",
  };

  return (
    <div className={`relative w-full ${aspectRatioClass} overflow-hidden rounded bg-slate-900 group ${className}`}>
      {/* Background Image */}
      <img
        src={media.url}
        alt={media.altText || estateName}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />

      {/* Subtle Asset Type Badge */}
      <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] font-medium tracking-wide flex items-center gap-1">
        <span>{badgeLabels[media.type] || "Project Asset"}</span>
      </div>

      {/* Caption strip if available */}
      {media.caption && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 pt-6 text-white text-[11px] leading-snug">
          <span>{media.caption}</span>
        </div>
      )}
    </div>
  );
}
