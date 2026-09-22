"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, ArrowRight } from "lucide-react";

export function InspectionForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [enquiryIntent, setEnquiryIntent] = useState("advisor");
  const [preferredLocation, setPreferredLocation] = useState("[LOCATION 01]");
  const [estateInterest, setEstateInterest] = useState("[ESTATE 01]");
  const [lookingFor, setLookingFor] = useState("[PROPERTY TYPE 01]");
  const [inspectionDate, setInspectionDate] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-teal-200 bg-teal-50/70 p-8 sm:p-10 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">
          Enquiry Received
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you. Your enquiry has been recorded. An estate advisor will follow up with scheduling details and documentation.
        </p>
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="text-xs font-semibold text-teal-700 hover:underline"
          >
            Submit another enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 lg:p-10 shadow-xl text-slate-900">
      <div className="border-b border-slate-200 pb-5 mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Tell Us What You Are Looking For
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contextual Enquiry Purpose Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Enquiry Purpose
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              { id: "advisor", label: "Speak with an Advisor" },
              { id: "inspection", label: "Schedule Inspection" },
              { id: "property", label: "Property Information" },
            ].map((intent) => (
              <button
                key={intent.id}
                type="button"
                onClick={() => setEnquiryIntent(intent.id)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                  enquiryIntent === intent.id
                    ? "border-teal-700 bg-teal-50 text-teal-900 ring-1 ring-teal-700 shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {intent.label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label htmlFor="full-name" className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <input
              id="full-name"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            />
          </div>

          {/* Phone / WhatsApp Number */}
          <div>
            <label htmlFor="phone-number" className="block text-xs font-semibold text-slate-700 mb-1">
              Phone / WhatsApp Number *
            </label>
            <input
              id="phone-number"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone / WhatsApp Number"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Email Address (optional) */}
        <div>
          <label htmlFor="email-address" className="block text-xs font-semibold text-slate-700 mb-1">
            Email Address <span className="text-slate-400 font-normal">(optional)</span>
          </label>
          <input
            id="email-address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Preferred Location */}
          <div>
            <label htmlFor="preferred-location" className="block text-xs font-semibold text-slate-700 mb-1">
              Preferred Location
            </label>
            <select
              id="preferred-location"
              value={preferredLocation}
              onChange={(e) => setPreferredLocation(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            >
              <option value="[LOCATION 01]">[LOCATION 01]</option>
              <option value="[LOCATION 02]">[LOCATION 02]</option>
              <option value="[LOCATION 03]">[LOCATION 03]</option>
            </select>
          </div>

          {/* Property / Estate of Interest */}
          <div>
            <label htmlFor="estate-interest" className="block text-xs font-semibold text-slate-700 mb-1">
              Property / Estate of Interest
            </label>
            <select
              id="estate-interest"
              value={estateInterest}
              onChange={(e) => setEstateInterest(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            >
              <option value="[ESTATE 01]">[ESTATE 01]</option>
              <option value="[ESTATE 02]">[ESTATE 02]</option>
              <option value="[ESTATE 03]">[ESTATE 03]</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* What Are You Looking For? */}
          <div>
            <label htmlFor="looking-for" className="block text-xs font-semibold text-slate-700 mb-1">
              What Are You Looking For?
            </label>
            <select
              id="looking-for"
              value={lookingFor}
              onChange={(e) => setLookingFor(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            >
              <option value="[PROPERTY TYPE 01]">[PROPERTY TYPE 01]</option>
              <option value="[PROPERTY TYPE 02]">[PROPERTY TYPE 02]</option>
              <option value="[PROPERTY TYPE 03]">[PROPERTY TYPE 03]</option>
            </select>
          </div>

          {/* Preferred Inspection Date */}
          <div>
            <label htmlFor="inspection-date" className="block text-xs font-semibold text-slate-700 mb-1">
              Preferred Inspection Date
            </label>
            <input
              id="inspection-date"
              type="date"
              value={inspectionDate}
              onChange={(e) => setInspectionDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-slate-900 bg-white focus:border-teal-600 focus:ring-1 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 shadow-md transition-transform active:scale-98 touch-target"
          >
            <span>Talk to an Advisor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Form Microcopy */}
        <div className="pt-2 text-xs text-slate-500 font-medium text-center">
          [VERIFIED RESPONSE / PRIVACY / NEXT-STEP REASSURANCE]
        </div>
      </form>
    </div>
  );
}
