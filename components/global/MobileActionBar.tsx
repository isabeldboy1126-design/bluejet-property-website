"use client";

import React from "react";
import { MessageCircle, Calendar } from "lucide-react";
import { CompanyConfig } from "@/types/config";

interface MobileActionBarProps {
  company: CompanyConfig;
  onOpenInspectionModal: () => void;
}

export function MobileActionBar({ company, onOpenInspectionModal }: MobileActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--theme-surface)]/95 backdrop-blur-md border-t border-[var(--theme-border)] px-4 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-lg">
      <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
        <a
          href={`https://wa.me/${company.contact.whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 px-3 rounded text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm touch-target transition-transform active:scale-95"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>WhatsApp Chat</span>
        </a>

        <button
          type="button"
          onClick={onOpenInspectionModal}
          className="flex items-center justify-center gap-2 py-3 px-3 rounded text-xs font-bold bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white shadow-sm touch-target transition-transform active:scale-95"
        >
          <Calendar className="w-4 h-4 shrink-0" />
          <span>Book Inspection</span>
        </button>
      </div>
    </div>
  );
}
