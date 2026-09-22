import React from "react";
import { FileText, Shield } from "lucide-react";
import { TitleDocumentation } from "@/types/estate";

interface TitleBadgeProps {
  title: TitleDocumentation;
  showDiligenceNotice?: boolean;
}

export function TitleBadge({ title, showDiligenceNotice = false }: TitleBadgeProps) {
  return (
    <div className="inline-flex flex-col gap-1">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--theme-tag-bg)] border border-[var(--theme-border)] text-xs font-medium text-[var(--theme-tag-text)]">
        <FileText className="w-3.5 h-3.5 text-[var(--theme-accent)] shrink-0" />
        <span className="font-semibold">{title.statutoryType}</span>
        {title.documentReference && (
          <span className="text-[11px] opacity-75 hidden sm:inline">({title.documentReference})</span>
        )}
      </div>

      {showDiligenceNotice && title.diligenceNotice && (
        <p className="text-[11px] text-[var(--theme-muted)] leading-relaxed flex items-start gap-1 mt-1">
          <Shield className="w-3.5 h-3.5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
          <span>{title.diligenceNotice}</span>
        </p>
      )}
    </div>
  );
}
