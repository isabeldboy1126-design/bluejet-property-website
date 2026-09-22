import React from 'react';
import { CompanyConfig } from '@/types/config';
import { ShieldCheck, CalendarCheck, MapPin, Scale, Check } from 'lucide-react';

interface TrackRecordBlockProps {
  company: CompanyConfig;
  heading?: string;
  subheading?: string;
}

export function TrackRecordBlock({
  company,
  heading = 'Developer Track Record & Accountability',
  subheading = 'We operate as an accountable corporate developer with registered titles, verifiable headquarters, and transparent site allocations.',
}: TrackRecordBlockProps) {
  const yearsActive = company.foundedYear ? new Date().getFullYear() - company.foundedYear : null;

  return (
    <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 sm:p-10 shadow-sm">
      <div className="max-w-2xl">
        <span className="inline-flex items-center rounded-full bg-[var(--theme-tag-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--theme-tag-text)]">
          VERIFIED COMPANY INTEGRITY
        </span>
        <h3 className="mt-3 text-xl sm:text-2xl font-bold text-[var(--theme-text)]">
          {heading}
        </h3>
        <p className="mt-2 text-sm text-[var(--theme-muted)]">
          {subheading}
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-muted)]">
              Entity Registration
            </span>
            <Scale className="h-4 w-4 text-[var(--theme-accent)]" />
          </div>
          <div className="mt-3 text-lg font-bold text-[var(--theme-text)] font-mono">
            {company.rcNumber || 'Incorporated'}
          </div>
          <p className="mt-1 text-xs text-[var(--theme-muted)]">
            Registered with Corporate Affairs Commission (CAC)
          </p>
        </div>

        <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-muted)]">
              Operational History
            </span>
            <CalendarCheck className="h-4 w-4 text-[var(--theme-accent)]" />
          </div>
          <div className="mt-3 text-lg font-bold text-[var(--theme-text)] tabular-nums">
            {company.foundedYear ? `Established ${company.foundedYear}` : 'Established Developer'}
          </div>
          <p className="mt-1 text-xs text-[var(--theme-muted)]">
            {yearsActive ? `${yearsActive}+ years developing serviced estate acreage` : 'Active corridor development'}
          </p>
        </div>

        <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-muted)]">
              Physical Location
            </span>
            <MapPin className="h-4 w-4 text-[var(--theme-accent)]" />
          </div>
          <div className="mt-3 text-lg font-bold text-[var(--theme-text)]">
            {company.office.city} Office
          </div>
          <p className="mt-1 text-xs text-[var(--theme-muted)]">
            {company.office.addressLine1}
          </p>
        </div>

        <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-muted)]">
              Diligence Policy
            </span>
            <ShieldCheck className="h-4 w-4 text-[var(--theme-accent)]" />
          </div>
          <div className="mt-3 text-lg font-bold text-[var(--theme-text)]">
            100% Search Open
          </div>
          <p className="mt-1 text-xs text-[var(--theme-muted)]">
            All survey coordinates provided for independent verification
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-[var(--border-radius-base)] bg-[var(--theme-bg)] p-5 border border-[var(--theme-border)]">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-text)]">
          Our Operational Standard
        </h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="flex items-start gap-2 text-xs text-[var(--theme-muted)]">
            <Check className="h-4 w-4 text-[var(--theme-accent)] flex-shrink-0 mt-0.5" />
            <span>We do not market land without registered survey plans and verifiable statutory records.</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-[var(--theme-muted)]">
            <Check className="h-4 w-4 text-[var(--theme-accent)] flex-shrink-0 mt-0.5" />
            <span>Every plot allocation includes physical beacon identification on the actual parcel.</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-[var(--theme-muted)]">
            <Check className="h-4 w-4 text-[var(--theme-accent)] flex-shrink-0 mt-0.5" />
            <span>Clients and their retained solicitors are encouraged to inspect title files before payment.</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-[var(--theme-muted)]">
            <Check className="h-4 w-4 text-[var(--theme-accent)] flex-shrink-0 mt-0.5" />
            <span>Written development covenants safeguard residential zoning and community road networks.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
