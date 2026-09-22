"use client";

import React from "react";
import { useTheme } from "@/lib/theme-context";
import { VisualDirection } from "@/types/config";

export function VariantSwitchBar() {
  const { visualDirection, setVisualDirection, activeVariantConfig } = useTheme();

  const variants: { key: VisualDirection; label: string; tag: string }[] = [
    {
      key: "01A_INSTITUTIONAL_TRUST",
      label: "01A: Institutional Trust",
      tag: "Documentary Clarity",
    },
    {
      key: "01B_GROWTH_OPPORTUNITY",
      label: "01B: Growth Corridor",
      tag: "Opportunity Clarity",
    },
    {
      key: "01C_MODERN_ESTATE_LIVING",
      label: "01C: Modern Living",
      tag: "Estate Living",
    },
  ];

  return (
    <div className="w-full bg-slate-900 text-white text-xs border-b border-slate-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wider text-slate-400 uppercase text-[10px]">
            Mockup 01 Base:
          </span>
          <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[11px] font-mono">
            {activeVariantConfig.displayName}
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-slate-400 text-[11px] mr-1 hidden sm:inline">
            Switch Art Direction:
          </span>
          {variants.map((v) => {
            const isActive = visualDirection === v.key;
            return (
              <button
                key={v.key}
                type="button"
                onClick={() => setVisualDirection(v.key)}
                className={`px-2.5 py-1 rounded transition-all text-[11px] font-medium touch-target min-h-[32px] flex items-center gap-1 ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm font-semibold"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
                aria-pressed={isActive}
              >
                <span>{v.label}</span>
                <span className="opacity-60 hidden md:inline text-[10px]">({v.tag})</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
