import React from 'react';
import Link from 'next/link';
import { getCompanyConfig, getStrategyConfig } from '@/lib/config';
import { OfficeAddressCard } from '@/components/proof/OfficeAddressCard';
import { TrackRecordBlock } from '@/components/proof/TrackRecordBlock';
import { OpenModalButton } from '@/components/conversion/OpenModalButton';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Users, 
  Scale, 
  Compass 
} from 'lucide-react';

export const metadata = {
  title: 'About Us | Institutional Land Development & Operating Principles',
  description: 'BLUEJET PROPERTIES develops verified master-planned estate communities across Nigeria with statutory title records and physical beacon allocation.',
};

export default function AboutPage() {
  const company = getCompanyConfig();
  const strategy = getStrategyConfig();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Page Header */}
      <div className="border-b border-[var(--theme-border)] pb-8 max-w-3xl">
        <span className="inline-flex items-center rounded-full bg-[var(--theme-tag-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--theme-tag-text)]">
          CORPORATE PROFILE & OPERATING STANDARDS
        </span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--theme-text)]">
          Accountable Land Development
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[var(--theme-muted)] leading-relaxed">
          {company.companyName} was established to solve the systemic trust deficit in Nigerian land transactions through documentary rigor, physical boundary demarcation, and verifiable government title records.
        </p>
      </div>

      {/* Philosophy & Principles Grid */}
      <section className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 sm:p-10 shadow-sm space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-muted)]">
            Our Foundation
          </span>
          <h2 className="mt-2 text-2xl font-bold text-[var(--theme-text)]">
            The Three Principles of Our Operating Standard
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-6">
            <div className="p-2 rounded-[var(--border-radius-base)] bg-[var(--theme-surface)] border border-[var(--theme-border)] w-fit text-[var(--theme-accent)] mb-4">
              <Scale className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--theme-text)]">
              1. Title Verifiability Before Marketing
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[var(--theme-muted)] leading-relaxed">
              We do not market or sell speculative land. Every parcel in our portfolio possesses an identifiable government gazette, registered excision, or statutory Certificate of Occupancy open for legal search.
            </p>
          </div>

          <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-6">
            <div className="p-2 rounded-[var(--border-radius-base)] bg-[var(--theme-surface)] border border-[var(--theme-border)] w-fit text-[var(--theme-accent)] mb-4">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--theme-text)]">
              2. Physical Boundary Reality
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[var(--theme-muted)] leading-relaxed">
              Paper documentation must match ground reality. All active estates are demarcated with concrete perimeter fences and survey beacons lodged with the state surveyor-general.
            </p>
          </div>

          <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-6">
            <div className="p-2 rounded-[var(--border-radius-base)] bg-[var(--theme-surface)] border border-[var(--theme-border)] w-fit text-[var(--theme-accent)] mb-4">
              <Building2 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--theme-text)]">
              3. Predictable Conveyance Timeline
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[var(--theme-muted)] leading-relaxed">
              Plot allocation dates are contractual milestones, not vague promises. Buyers receive executed Deeds of Assignment and on-site beacon handover immediately upon schedule completion.
            </p>
          </div>
        </div>
      </section>

      {/* Developer Track Record & Presence */}
      <section className="space-y-8">
        <TrackRecordBlock company={company} />
        <OfficeAddressCard company={company} />
      </section>

      {/* Inspection CTA Banner */}
      <section className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-8 text-center max-w-3xl mx-auto space-y-4">
        <h3 className="text-xl font-bold text-[var(--theme-text)]">
          Meet Our Surveyor and Legal Teams
        </h3>
        <p className="text-xs sm:text-sm text-[var(--theme-muted)] max-w-xl mx-auto">
          We welcome clients and their retained legal counsel to visit our Victoria Island office to examine original survey charts, coordinate files, and title gazettes before site inspection.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <OpenModalButton variant="primary">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Schedule Office or Site Visit</span>
          </OpenModalButton>
          <Link
            href="/contact"
            className="px-5 py-3 rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] text-xs font-bold text-[var(--theme-text)] hover:bg-[var(--theme-bg)] transition-colors"
          >
            Get Office Directions
          </Link>
        </div>
      </section>
    </div>
  );
}
