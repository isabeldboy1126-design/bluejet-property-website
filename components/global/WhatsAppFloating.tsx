"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import { CompanyConfig } from "@/types/config";

interface WhatsAppFloatingProps {
  company: CompanyConfig;
}

export function WhatsAppFloating({ company }: WhatsAppFloatingProps) {
  return (
    <aside aria-label="WhatsApp Concierge" className="hidden md:block fixed bottom-6 right-6 z-40">
      <a
        href={`https://wa.me/${company.contact.whatsappNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-label="Direct WhatsApp Contact with Estate Advisor"
      >
        <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
        <span className="text-xs font-semibold tracking-wide">WhatsApp Enquiries</span>
      </a>
    </aside>
  );
}
