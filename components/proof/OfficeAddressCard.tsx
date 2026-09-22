import React from 'react';
import { CompanyConfig } from '@/types/config';
import { Building2, Clock, Phone, MapPin, ExternalLink, ShieldCheck } from 'lucide-react';

interface OfficeAddressCardProps {
  company: CompanyConfig;
}

export function OfficeAddressCard({ company }: OfficeAddressCardProps) {
  const mapsQuery = encodeURIComponent(
    `${company.office.addressLine1}, ${company.office.city}, ${company.office.state}`
  );
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--theme-border)] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-[var(--theme-tag-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--theme-tag-text)]">
              PHYSICAL HEADQUARTERS
            </span>
            {company.rcNumber && (
              <span className="text-xs font-mono text-[var(--theme-muted)]">
                {company.rcNumber}
              </span>
            )}
          </div>
          <h3 className="mt-2 text-xl font-bold text-[var(--theme-text)]">
            Visit Our Operating Office
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[var(--theme-muted)]">
            Review original deeds, excision surveys, and coordinate files with our legal and surveyor teams in person.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3.5 py-2 text-xs font-medium text-[var(--theme-text)] hover:border-[var(--theme-accent)] transition-colors"
          >
            <MapPin className="h-4 w-4 text-[var(--theme-accent)]" />
            <span>Open in Google Maps</span>
            <ExternalLink className="h-3 w-3 text-[var(--theme-muted)]" />
          </a>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-[var(--border-radius-base)] bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[var(--theme-accent)]">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-muted)]">
              Physical Location
            </span>
            <p className="mt-1 text-sm font-medium text-[var(--theme-text)]">
              {company.office.addressLine1}
            </p>
            <p className="text-xs text-[var(--theme-muted)]">
              {company.office.city}, {company.office.state}
            </p>
            {company.office.directionsHint && (
              <p className="mt-1 text-xs italic text-[var(--theme-muted)]">
                {company.office.directionsHint}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-[var(--border-radius-base)] bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[var(--theme-accent)]">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-muted)]">
              Inspection Hours
            </span>
            <p className="mt-1 text-sm font-medium text-[var(--theme-text)]">
              {company.office.officeInspectionHours || 'Mon–Fri: 9am–5pm | Sat: 10am–4pm'}
            </p>
            <p className="text-xs text-[var(--theme-muted)]">
              Walk-ins welcome; appointment recommended for surveyor meetings.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-[var(--border-radius-base)] bg-[var(--theme-bg)] border border-[var(--theme-border)] text-[var(--theme-accent)]">
            <Phone className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-muted)]">
              Direct Office Lines
            </span>
            <p className="mt-1 text-sm font-medium text-[var(--theme-text)]">
              <a href={`tel:${company.contact.phonePrimary}`} className="hover:underline">
                {company.contact.phonePrimary}
              </a>
            </p>
            <p className="text-xs text-[var(--theme-muted)]">
              WhatsApp Desk: +{company.contact.whatsappNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-[var(--theme-border)] pt-4 flex items-center gap-2 text-xs text-[var(--theme-muted)]">
        <ShieldCheck className="h-4 w-4 text-[var(--theme-accent)] flex-shrink-0" />
        <span>
          {company.regulatoryDisclosures?.statutoryNotice ||
            'Original survey charts and beacon coordinates are open for legal review at our physical office before any financial commitment.'}
        </span>
      </div>
    </div>
  );
}
