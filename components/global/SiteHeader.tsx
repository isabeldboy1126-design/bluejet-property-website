"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Menu, X } from "lucide-react";

interface SiteHeaderProps {
  onOpenInspectionModal: () => void;
}

export function SiteHeader({ onOpenInspectionModal }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/#estates", label: "Properties" },
    { href: "/#locations", label: "Locations" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="w-full bg-[#08584D] border-b border-white/10 md:bg-white/95 md:border-slate-200 md:backdrop-blur-md sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[68px] md:h-[82px] flex items-center justify-between gap-3 sm:gap-4">
        {/* Company Logo Placeholder — Single line locked */}
        <Link href="/" data-brand-logo className="flex items-center gap-2.5 group shrink-0">
          <div
            id="nav-logo-target"
            className="h-9 px-3.5 rounded-md bg-slate-900 text-white flex items-center justify-center font-bold text-xs tracking-wider transition-transform group-hover:scale-105 whitespace-nowrap shadow-sm border border-white/15"
          >
            [COMPANY LOGO]
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="nav-anim-links hidden md:flex items-center gap-7 lg:gap-8"
          aria-label="Main Navigation"
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-semibold tracking-wide transition-colors duration-200 hover:text-[#0D8975] ${
                  isActive ? "text-[#0D8975]" : "text-slate-600"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Header Right Action */}
        <div className="nav-anim-links hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenInspectionModal}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#0D8975] hover:bg-[#109580] shadow-sm transition-all duration-200 active:scale-95 touch-target"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Talk to an Advisor</span>
          </button>
        </div>

        {/* Mobile Middle Action + Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenInspectionModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-[#F7F4EC] bg-[#0D8975] hover:bg-[#109580] border border-white/10 shadow-sm active:scale-95 touch-target"
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">Talk to an Advisor</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-white hover:bg-white/10 touch-target"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#055046] px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold text-white/90 hover:bg-white/10 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenInspectionModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-xs font-bold text-[#F7F4EC] bg-[#0D8975] hover:bg-[#109580] shadow-sm touch-target"
            >
              <Calendar className="w-4 h-4" />
              <span>Talk to an Advisor</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
