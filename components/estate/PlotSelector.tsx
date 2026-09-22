"use client";

import React, { useState } from "react";
import { PlotSpecification } from "@/types/estate";
import { Check, Maximize2, Home } from "lucide-react";

interface PlotSelectorProps {
  plots: PlotSpecification[];
  onSelectPlot?: (plot: PlotSpecification) => void;
}

export function PlotSelector({ plots, onSelectPlot }: PlotSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!plots || plots.length === 0) return null;

  const activePlot = plots[selectedIndex] || plots[0];

  const handleSelect = (idx: number) => {
    setSelectedIndex(idx);
    if (onSelectPlot) {
      onSelectPlot(plots[idx]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--theme-text)]">
          Available Plot Sizes & Zoning
        </h3>
        <span className="text-[11px] text-[var(--theme-muted)]">
          {plots.length} {plots.length === 1 ? "Option" : "Options"} Available
        </span>
      </div>

      {/* Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {plots.map((plot, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={plot.size}
              type="button"
              onClick={() => handleSelect(idx)}
              className={`p-3.5 rounded border text-left transition-all touch-target ${
                isSelected
                  ? "border-[var(--theme-accent)] bg-[var(--theme-tag-bg)] shadow-sm"
                  : "border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--theme-text)]">{plot.size}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-[var(--theme-accent)]" />}
              </div>
              {plot.dimension && (
                <span className="block text-[11px] text-[var(--theme-muted)] mt-0.5">
                  {plot.dimension}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Plot Detail Plate */}
      {activePlot && (
        <div className="p-4 rounded border border-[var(--theme-border)] bg-[var(--theme-surface)] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[var(--theme-muted)]">Selected Dimension:</span>
            <span className="text-xs font-bold text-[var(--theme-text)]">
              {activePlot.size} {activePlot.dimension ? `(${activePlot.dimension})` : ""}
            </span>
          </div>

          {activePlot.use && (
            <div className="flex items-start gap-2 pt-2 border-t border-[var(--theme-border)] text-xs text-[var(--theme-muted)]">
              <Home className="w-4 h-4 text-[var(--theme-accent)] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[var(--theme-text)]">Permitted Zoning:</strong> {activePlot.use}
              </span>
            </div>
          )}

          {activePlot.priceDisplay && (
            <div className="flex items-center justify-between pt-2 border-t border-[var(--theme-border)]">
              <span className="text-xs text-[var(--theme-muted)]">Entry Price:</span>
              <span className="text-base font-bold text-[var(--theme-text)] tabular-nums">
                {activePlot.priceDisplay}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
