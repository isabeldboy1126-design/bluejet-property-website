import React from 'react';
import { getCompanyConfig, getEstates } from '@/lib/config';
import { EstateGrid } from '@/components/estate/EstateGrid';
import { OpenModalButton } from '@/components/conversion/OpenModalButton';
import { ShieldCheck, Calendar, MapPin, CheckCircle } from 'lucide-react';

export const metadata = {
  title: 'Estates & Plots for Sale | Master-Planned Land Portfolio',
  description: 'Verified residential and commercial estate plots across Lagos, Ogun, and Abuja FCT with statutory titles and clear allocation timelines.',
};

export default function EstatesPage() {
  const company = getCompanyConfig();
  const estates = getEstates();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Page Header */}
      <div className="border-b border-[var(--theme-border)] pb-8 max-w-3xl">
        <span className="inline-flex items-center rounded-full bg-[var(--theme-tag-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--theme-tag-text)]">
          DIRECT DEVELOPER INVENTORY
        </span>
        <h1 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-[var(--theme-text)]">
          Active Estates & Serviced Plots
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[var(--theme-muted)] leading-relaxed">
          All properties listed are fully acquired, demarcated with registered survey beacons, and supported by statutory title records ready for your solicitor's independent search.
        </p>
      </div>

      {/* Diligence Protocol Banner */}
      <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-[var(--border-radius-base)] bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[var(--theme-accent)] shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--theme-text)]">
              Statutory Search Guarantee
            </h2>
            <p className="text-xs text-[var(--theme-muted)] mt-0.5">
              We provide survey plan numbers and beacon coordinates to prospective buyers prior to payment.
            </p>
          </div>
        </div>

        <OpenModalButton variant="secondary" className="text-xs py-2 px-3.5 whitespace-nowrap">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          <span>Book Site Inspection</span>
        </OpenModalButton>
      </div>

      {/* Filterable Estate Grid with heuristic state pill filters */}
      <div>
        <EstateGrid estates={estates} company={company} showFiltersHeuristic={true} />
      </div>

      {/* Inspection Notice */}
      <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-6 text-center max-w-2xl mx-auto space-y-3">
        <h3 className="text-base font-bold text-[var(--theme-text)]">
          Need Assistance Selecting a Corridor?
        </h3>
        <p className="text-xs text-[var(--theme-muted)]">
          Our land development consultants are available at our Victoria Island office to review your budget, timeline, and title requirements.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <a
            href={`tel:${company.contact.phonePrimary}`}
            className="text-xs font-bold text-[var(--theme-accent)] hover:underline"
          >
            Call {company.contact.phonePrimary}
          </a>
          <span className="text-[var(--theme-muted)]">•</span>
          <a
            href={`https://wa.me/${company.contact.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-emerald-600 hover:underline"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
