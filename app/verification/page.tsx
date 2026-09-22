import React from 'react';
import Link from 'next/link';
import { getCompanyConfig } from '@/lib/config';
import { VerificationProcessSteps } from '@/components/proof/VerificationProcessSteps';
import { OpenModalButton } from '@/components/conversion/OpenModalButton';
import { 
  ShieldCheck, 
  FileSearch, 
  MapPin, 
  Scale, 
  CheckCircle, 
  HelpCircle, 
  ExternalLink,
  Calendar
} from 'lucide-react';

export const metadata = {
  title: 'Land Verification & Diligence Guide | How to Verify Land in Nigeria',
  description: 'A comprehensive guide for buyers and solicitors on how to verify land titles, survey coordinates, and physical beacons at state land registries.',
};

export default function VerificationPage() {
  const company = getCompanyConfig();

  const registries = [
    {
      state: 'Lagos State Lands Bureau',
      location: 'Block 13 & 14, Secretariat Complex, Alausa, Ikeja, Lagos',
      coverage: 'Epe, Ibeju-Lekki, Ikorodu, Badagry, and Lagos Metropolis',
      procedure: 'Submit registered survey plan number and excision/gazette reference to the Land Registry for official charting and file search.',
    },
    {
      state: 'Ogun State Bureau of Lands & Survey',
      location: 'Governor’s Office Complex, Oke-Mosan, Abeokuta, Ogun State',
      coverage: 'Sagamu, Mowe-Ofada, Shimawa, Ibafo, and Ogun Industrial Belt',
      procedure: 'Conduct composite charting against the Ogun State Master Plan to confirm the land falls outside government acquisition zones.',
    },
    {
      state: 'Abuja Geographic Information Systems (AGIS)',
      location: 'Peace House, 4 Peace Drive, Area 11, Garki, Abuja FCT',
      coverage: 'Guzape, Maitama, Asokoro, Jabi, Katampe, and Federal Capital Territory',
      procedure: 'Apply for legal search using FCDA file number and plot allocation code to verify statutory Right of Occupancy (R of O).',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Header */}
      <div className="border-b border-[var(--theme-border)] pb-8 max-w-3xl">
        <span className="inline-flex items-center rounded-full bg-[var(--theme-tag-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--theme-tag-text)]">
          INDEPENDENT DILIGENCE MANUAL
        </span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--theme-text)]">
          How to Independently Verify Land Title
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[var(--theme-muted)] leading-relaxed">
          We believe an informed buyer is our best client. Here is the exact documentary and physical verification workflow your surveyor and lawyer should execute before you commit funds.
        </p>
      </div>

      {/* 3-Step Verification Component */}
      <section>
        <VerificationProcessSteps
          heading="The 3-Step Diligence Standard"
          subheading="Follow this systematic verification protocol for any estate property in our portfolio or elsewhere in Nigeria."
        />
      </section>

      {/* State Land Registries Information */}
      <section className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 sm:p-10 shadow-sm space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-muted)]">
            Statutory Search Venues
          </span>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold text-[var(--theme-text)]">
            Where to Conduct Title Searches by State
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[var(--theme-muted)]">
            Take our provided survey plans and gazette numbers to these official government registries.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {registries.map((reg, idx) => (
            <div
              key={idx}
              className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-6 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-[var(--theme-accent)] block mb-1">
                  REGISTRY {idx + 1}
                </span>
                <h3 className="text-base font-bold text-[var(--theme-text)]">
                  {reg.state}
                </h3>
                <p className="mt-2 text-xs text-[var(--theme-muted)] leading-relaxed flex items-start gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                  <span>{reg.location}</span>
                </p>
                <div className="mt-4 pt-3 border-t border-[var(--theme-border)] text-xs text-[var(--theme-text)]">
                  <span className="font-semibold block mb-1">Search Procedure:</span>
                  <span className="text-[var(--theme-muted)] leading-relaxed">{reg.procedure}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[var(--theme-border)] text-[11px] text-[var(--theme-muted)]">
                <span className="font-medium text-[var(--theme-text)]">Regional Coverage: </span>
                {reg.coverage}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Physical Inspection Checklist */}
      <section className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-6 sm:p-10 space-y-6">
        <h2 className="text-xl font-bold text-[var(--theme-text)]">
          On-Site Physical Inspection Checklist
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-start gap-3 text-xs sm:text-sm text-[var(--theme-muted)] bg-[var(--theme-surface)] p-4 rounded-[var(--border-radius-base)] border border-[var(--theme-border)]">
            <CheckCircle className="h-5 w-5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[var(--theme-text)] block mb-0.5">Check Beacon Numbers</strong>
              Ensure the concrete pillar beacon numbers on site match exactly with the survey plan coordinates.
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs sm:text-sm text-[var(--theme-muted)] bg-[var(--theme-surface)] p-4 rounded-[var(--border-radius-base)] border border-[var(--theme-border)]">
            <CheckCircle className="h-5 w-5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[var(--theme-text)] block mb-0.5">Topography & Soil Condition</strong>
              Inspect elevation and drainage naturally to understand foundation requirements before building.
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs sm:text-sm text-[var(--theme-muted)] bg-[var(--theme-surface)] p-4 rounded-[var(--border-radius-base)] border border-[var(--theme-border)]">
            <CheckCircle className="h-5 w-5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[var(--theme-text)] block mb-0.5">Road Access & Right of Way</strong>
              Verify registered arterial access road widths match master-plan community covenants.
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs sm:text-sm text-[var(--theme-muted)] bg-[var(--theme-surface)] p-4 rounded-[var(--border-radius-base)] border border-[var(--theme-border)]">
            <CheckCircle className="h-5 w-5 text-[var(--theme-accent)] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[var(--theme-text)] block mb-0.5">Neighbouring Boundaries</strong>
              Confirm no encroachment or overlapping claims with adjacent village family boundaries.
            </div>
          </div>
        </div>
      </section>

      {/* Action Footer */}
      <div className="rounded-[var(--border-radius-base)] bg-[var(--theme-surface)] border border-[var(--theme-border)] p-8 text-center max-w-2xl mx-auto space-y-4">
        <h3 className="text-lg font-bold text-[var(--theme-text)]">
          Request Document Bundle for Your Solicitor
        </h3>
        <p className="text-xs sm:text-sm text-[var(--theme-muted)]">
          We will provide survey coordinates, excision numbers, and layout plans for any of our estates directly to your lawyer.
        </p>
        <div className="pt-2 flex items-center justify-center gap-4">
          <OpenModalButton variant="primary">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Schedule Site Inspection</span>
          </OpenModalButton>
          <a
            href={`https://wa.me/${company.contact.whatsappNumber}?text=${encodeURIComponent('Hello, please send survey documentation for independent legal search.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-[var(--border-radius-base)] border border-[var(--theme-border)] text-xs font-bold text-[var(--theme-text)] hover:bg-[var(--theme-bg)] transition-colors"
          >
            Request Docs via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
