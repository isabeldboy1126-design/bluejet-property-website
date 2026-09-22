"use client";

import React, { useState, useMemo } from "react";
import { EstateItem } from "@/types/estate";
import { EstateCard } from "./EstateCard";
import { MessageSquare, RefreshCw } from "lucide-react";
import { CompanyConfig } from "@/types/config";

interface EstateGridProps {
  estates: EstateItem[];
  company?: CompanyConfig;
  showFiltersHeuristic?: boolean;
}

export function EstateGrid({ estates, company, showFiltersHeuristic = true }: EstateGridProps) {
  const [selectedState, setSelectedState] = useState<string>("ALL");

  // Extract unique states across estates
  const availableStates = useMemo(() => {
    const states = Array.from(new Set(estates.map((e) => e.location.state)));
    return states;
  }, [estates]);

  // Conditional heuristic: Only display filter pills if inventory > 3 and spans multiple states
  const shouldRenderFilters = showFiltersHeuristic && estates.length > 3 && availableStates.length > 1;

  const filteredEstates = useMemo(() => {
    if (selectedState === "ALL") return estates;
    return estates.filter((e) => e.location.state === selectedState);
  }, [estates, selectedState]);

  return (
    <div className="space-y-8">
      {/* Conditional Heuristic Filter Bar */}
      {shouldRenderFilters && (
        <div className="flex flex-wrap items-center justify-center gap-2 pb-2">
          <button
            type="button"
            onClick={() => setSelectedState("ALL")}
            className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all touch-target ${
              selectedState === "ALL"
                ? "bg-[var(--theme-accent)] text-white shadow-sm"
                : "bg-[var(--theme-surface)] text-[var(--theme-muted)] border border-[var(--theme-border)] hover:bg-slate-50"
            }`}
          >
            All Locations ({estates.length})
          </button>

          {availableStates.map((state) => {
            const count = estates.filter((e) => e.location.state === state).length;
            const isSelected = selectedState === state;
            return (
              <button
                key={state}
                type="button"
                onClick={() => setSelectedState(state)}
                className={`px-3.5 py-1.5 rounded text-xs font-semibold transition-all touch-target ${
                  isSelected
                    ? "bg-[var(--theme-accent)] text-white shadow-sm"
                    : "bg-[var(--theme-surface)] text-[var(--theme-muted)] border border-[var(--theme-border)] hover:bg-slate-50"
                }`}
              >
                {state} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Estates Cards Grid */}
      {filteredEstates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredEstates.map((estate) => (
            <EstateCard key={estate.id} estate={estate} />
          ))}
        </div>
      ) : (
        /* Zero-Results Recovery State */
        <div className="p-8 sm:p-12 text-center rounded border border-[var(--theme-border)] bg-[var(--theme-surface)] max-w-lg mx-auto space-y-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-[var(--theme-muted)] flex items-center justify-center mx-auto">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-[var(--theme-text)]">
            No Estates in this Specific Selection
          </h4>
          <p className="text-xs text-[var(--theme-muted)] leading-relaxed">
            We do not currently have active plots matching this filter combination. View our active developments across Nigeria or speak directly with an estate advisor regarding upcoming allocations.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedState("ALL")}
              className="px-4 py-2 rounded bg-[var(--theme-accent)] text-white text-xs font-semibold w-full sm:w-auto"
            >
              Reset Location Filter
            </button>
            {company && (
              <a
                href={`https://wa.me/${company.contact.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded border border-[var(--theme-border)] text-xs font-semibold text-[var(--theme-text)] flex items-center justify-center gap-1.5 w-full sm:w-auto hover:bg-slate-50"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Ask on WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
