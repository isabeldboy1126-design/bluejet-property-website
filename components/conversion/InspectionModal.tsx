"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, Video, MapPin, CheckCircle, ShieldCheck } from "lucide-react";
import { CompanyConfig } from "@/types/config";
import { EstateItem } from "@/types/estate";

interface InspectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyConfig;
  estates: EstateItem[];
  preselectedEstateSlug?: string;
}

export function InspectionModal({
  isOpen,
  onClose,
  company,
  estates,
  preselectedEstateSlug,
}: InspectionModalProps) {
  const [inspectionType, setInspectionType] = useState<"PHYSICAL" | "REMOTE_VIDEO">("PHYSICAL");
  const [selectedEstateSlug, setSelectedEstateSlug] = useState<string>(
    preselectedEstateSlug || (estates[0]?.slug ?? "")
  );
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedEstateSlug) {
      setSelectedEstateSlug(preselectedEstateSlug);
    }
  }, [preselectedEstateSlug]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const selectedEstate = estates.find((e) => e.slug === selectedEstateSlug);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="inspection-modal-title"
    >
      <div className="bg-[var(--theme-surface)] w-full max-w-lg rounded-lg border border-[var(--theme-border)] shadow-2xl overflow-hidden transition-all">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--theme-border)] bg-[var(--theme-bg)]">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[var(--theme-accent)]" />
            <h2 id="inspection-modal-title" className="text-base font-bold text-[var(--theme-text)]">
              Schedule Estate Inspection
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-[var(--theme-muted)] hover:text-[var(--theme-text)] transition-colors touch-target"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-[var(--theme-text)]">
                Inspection Request Received
              </h3>
              <p className="text-xs text-[var(--theme-muted)] max-w-sm mx-auto leading-relaxed">
                Thank you, {fullName}. Our field operations team has logged your appointment for{" "}
                <span className="font-semibold text-[var(--theme-text)]">{selectedEstate?.name}</span>. We will confirm coordinates and arrival instructions via WhatsApp at{" "}
                <span className="font-semibold text-[var(--theme-text)]">{phone}</span>.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded bg-[var(--theme-accent)] text-white text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Inspection Type Toggle */}
              <div>
                <label className="block text-xs font-bold text-[var(--theme-text)] mb-1.5 uppercase tracking-wide">
                  Inspection Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectionType("PHYSICAL")}
                    className={`p-3 rounded border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      inspectionType === "PHYSICAL"
                        ? "border-[var(--theme-accent)] bg-[var(--theme-tag-bg)] text-[var(--theme-accent)] shadow-sm"
                        : "border-[var(--theme-border)] text-[var(--theme-muted)] hover:bg-slate-50"
                    }`}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Physical On-Site Visit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectionType("REMOTE_VIDEO")}
                    className={`p-3 rounded border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      inspectionType === "REMOTE_VIDEO"
                        ? "border-[var(--theme-accent)] bg-[var(--theme-tag-bg)] text-[var(--theme-accent)] shadow-sm"
                        : "border-[var(--theme-border)] text-[var(--theme-muted)] hover:bg-slate-50"
                    }`}
                  >
                    <Video className="w-4 h-4" />
                    <span>Live Video Walkthrough</span>
                  </button>
                </div>
              </div>

              {/* Estate Selection */}
              <div>
                <label htmlFor="estate-select" className="block text-xs font-bold text-[var(--theme-text)] mb-1">
                  Select Estate to Inspect
                </label>
                <select
                  id="estate-select"
                  value={selectedEstateSlug}
                  onChange={(e) => setSelectedEstateSlug(e.target.value)}
                  className="w-full px-3 py-2.5 rounded border border-[var(--theme-border)] bg-[var(--theme-surface)] text-xs text-[var(--theme-text)] focus:ring-1 focus:ring-[var(--theme-accent)]"
                  required
                >
                  {estates.map((e) => (
                    <option key={e.id} value={e.slug}>
                      {e.name} — {e.location.city}, {e.location.state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="full-name" className="block text-xs font-bold text-[var(--theme-text)] mb-1">
                    Your Full Name
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tunde Adeyemi"
                    className="w-full px-3 py-2.5 rounded border border-[var(--theme-border)] bg-[var(--theme-surface)] text-xs text-[var(--theme-text)]"
                  />
                </div>

                <div>
                  <label htmlFor="phone-number" className="block text-xs font-bold text-[var(--theme-text)] mb-1">
                    Phone / WhatsApp Number
                  </label>
                  <input
                    id="phone-number"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                    className="w-full px-3 py-2.5 rounded border border-[var(--theme-border)] bg-[var(--theme-surface)] text-xs text-[var(--theme-text)]"
                  />
                </div>
              </div>

              {/* Preferred Date */}
              <div>
                <label htmlFor="preferred-date" className="block text-xs font-bold text-[var(--theme-text)] mb-1">
                  Preferred Date (Saturdays or Weekdays)
                </label>
                <input
                  id="preferred-date"
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded border border-[var(--theme-border)] bg-[var(--theme-surface)] text-xs text-[var(--theme-text)]"
                />
              </div>

              {/* Friction Reducer Note */}
              <div className="flex items-start gap-2 p-2.5 rounded bg-[var(--theme-tag-bg)] border border-[var(--theme-border)] text-[11px] text-[var(--theme-muted)]">
                <ShieldCheck className="w-4 h-4 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                <span>
                  No booking deposit or advance commitment is required. You are inspecting the physical ground reality before legal contract review.
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white text-xs font-bold tracking-wide uppercase shadow-sm transition-all touch-target mt-2"
              >
                Confirm Inspection Appointment
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
