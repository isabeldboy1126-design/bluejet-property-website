import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getEstates, getEstateBySlug, getCompanyConfig, getStrategyConfig } from '@/lib/config';
import { HeroMediaRegion } from '@/components/estate/HeroMediaRegion';
import { TitleBadge } from '@/components/estate/TitleBadge';
import { PricingTable } from '@/components/estate/PricingTable';
import { InfrastructureTracker } from '@/components/estate/InfrastructureTracker';
import { OpenModalButton } from '@/components/conversion/OpenModalButton';
import { 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  CheckCircle, 
  ArrowLeft, 
  ExternalLink, 
  FileText, 
  Compass, 
  MessageCircle,
  Clock,
  Layers
} from 'lucide-react';

interface EstatePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const estates = getEstates();
  return estates.map((estate) => ({
    slug: estate.slug,
  }));
}

export async function generateMetadata({ params }: EstatePageProps) {
  const { slug } = await params;
  const estate = getEstateBySlug(slug);
  if (!estate) return { title: 'Estate Not Found' };

  return {
    title: `${estate.name} | Serviced Plots in ${estate.location.city}, ${estate.location.state}`,
    description: `${estate.tagline || ''} Statutory Title: ${estate.title.statutoryType}. Entry Price: ${estate.entryPriceDisplay || 'POA'}.`,
  };
}

export default async function EstateDetailPage({ params }: EstatePageProps) {
  const { slug } = await params;
  const estate = getEstateBySlug(slug);
  const company = getCompanyConfig();
  const strategy = getStrategyConfig();

  if (!estate) {
    notFound();
  }

  const statusLabels: Record<string, { label: string; bg: string }> = {
    AVAILABLE: { label: 'Plots Available', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    NEW_LAUNCH: { label: 'New Phase Launch', bg: 'bg-blue-50 text-blue-800 border-blue-200' },
    PHASE_1_ALLOCATED: { label: 'Phase 1 Allocated • Phase 2 Open', bg: 'bg-amber-50 text-amber-900 border-amber-200' },
    INFRASTRUCTURE_UNDERWAY: { label: 'Civil Infrastructure Underway', bg: 'bg-purple-50 text-purple-800 border-purple-200' },
    SOLD_OUT: { label: 'Fully Allocated', bg: 'bg-slate-100 text-slate-600 border-slate-200' },
  };

  const statusInfo = statusLabels[estate.operationalStatus] || {
    label: 'Active Estate',
    bg: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[var(--theme-muted)]" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-[var(--theme-text)] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/estates" className="hover:text-[var(--theme-text)] transition-colors">
          Estates
        </Link>
        <span>/</span>
        <span className="font-semibold text-[var(--theme-text)] truncate">
          {estate.name}
        </span>
      </nav>

      {/* ============================================================ */}
      {/* TIER 1: CORE TIER (Identity, Title, Media, Quick Specs)     */}
      {/* ============================================================ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery & Visual Proof */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-card)] p-2 shadow-sm overflow-hidden">
            <HeroMediaRegion
              media={estate.heroMedia}
              estateName={estate.name}
              locationLabel={`${estate.location.city}, ${estate.location.state}`}
              aspectRatioClass="aspect-[16/10]"
            />
          </div>

          {/* Secondary Gallery (if present) */}
          {estate.galleryMedia && estate.galleryMedia.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {estate.galleryMedia.map((media, idx) => (
                <div
                  key={idx}
                  className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-card)] p-1 overflow-hidden"
                >
                  <HeroMediaRegion
                    media={media}
                    estateName={`${estate.name} - Photo ${idx + 1}`}
                    aspectRatioClass="aspect-[4/3]"
                  />
                  <span className="block text-[10px] text-[var(--theme-muted)] px-1 py-0.5 truncate">
                    {media.caption || media.type.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Project Title, Diligence & Primary Conversion */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold border ${statusInfo.bg}`}>
                {statusInfo.label}
              </span>
              <span className="text-xs font-medium text-[var(--theme-muted)] flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                {estate.location.city}, {estate.location.state}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--theme-text)]">
              {estate.name}
            </h1>

            {estate.tagline && (
              <p className="text-sm text-[var(--theme-muted)] leading-relaxed">
                {estate.tagline}
              </p>
            )}

            {/* Official Title Documentation Box */}
            <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-muted)]">
                  Statutory Title Documentation
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  VERIFIED RECORD
                </span>
              </div>

              <div>
                <div className="text-base font-bold text-[var(--theme-text)]">
                  {estate.title.statutoryType}
                </div>
                {estate.title.documentReference && (
                  <div className="text-xs font-mono text-[var(--theme-muted)] mt-0.5">
                    Reference: {estate.title.documentReference}
                  </div>
                )}
                {estate.title.surveyPlanNumber && (
                  <div className="text-xs font-mono text-[var(--theme-muted)] mt-0.5">
                    Registered Survey: {estate.title.surveyPlanNumber}
                  </div>
                )}
              </div>

              <div className="border-t border-[var(--theme-border)] pt-2.5 text-xs text-[var(--theme-muted)] leading-relaxed">
                <span className="font-semibold text-[var(--theme-text)]">Independent Search: </span>
                {estate.title.diligenceNotice}
              </div>
            </div>

            {/* Pricing Snapshot */}
            <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--theme-muted)] block">
                  Entry Price
                </span>
                <span className="text-xl font-bold text-[var(--theme-text)] tabular-nums">
                  {estate.entryPriceDisplay || 'Price On Request'}
                </span>
                {estate.entryDepositDisplay && (
                  <span className="text-xs text-[var(--theme-accent)] block font-medium mt-0.5">
                    {estate.entryDepositDisplay}
                  </span>
                )}
              </div>

              <div className="text-right text-xs text-[var(--theme-muted)]">
                <div>Available Sizes:</div>
                <div className="font-semibold text-[var(--theme-text)]">
                  {estate.plots.map((p) => p.size).join(', ')}
                </div>
              </div>
            </div>
          </div>

          {/* Action Box */}
          <div className="space-y-3 pt-4 border-t border-[var(--theme-border)]">
            <OpenModalButton
              estateSlug={estate.slug}
              variant="primary"
              className="w-full py-3.5 text-sm"
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span>Schedule Site Inspection for {estate.name}</span>
            </OpenModalButton>

            <a
              href={`https://wa.me/${company.contact.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center font-bold text-xs rounded-[var(--border-radius-base)] py-2.5 px-4 border border-[var(--theme-border)] bg-[var(--theme-surface)] hover:bg-[var(--theme-bg)] text-[var(--theme-text)] transition-colors"
            >
              <MessageCircle className="w-4 h-4 mr-1.5 text-emerald-600" />
              <span>Enquire with Legal / Surveyor Team on WhatsApp</span>
            </a>

            <p className="text-[11px] text-[var(--theme-muted)] text-center">
              Inspections held every Saturday • Shuttles depart VI office at 9:00 AM.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* TIER 2: HIGH-VALUE TIER (Plots, Pricing, Payment Plans)     */}
      {/* ============================================================ */}
      <section className="space-y-6 pt-6 border-t border-[var(--theme-border)]">
        <div>
          <span className="inline-flex items-center rounded-full bg-[var(--theme-tag-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--theme-tag-text)]">
            PLOT SIZES & PRICING
          </span>
          <h2 className="mt-2 text-xl sm:text-2xl font-bold text-[var(--theme-text)]">
            Plot Options & Payment Schedules
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[var(--theme-muted)]">
            Select your preferred plot dimension and review available installment spread durations.
          </p>
        </div>

        <PricingTable
          plots={estate.plots}
          paymentPlans={estate.paymentPlans}
          showPaymentPlan={strategy.toggles.showPaymentPlan}
        />
      </section>

      {/* ============================================================ */}
      {/* TIER 3: CONDITIONAL TIER (Infrastructure, Location, Timeline)*/}
      {/* ============================================================ */}
      <section className="space-y-8 pt-6 border-t border-[var(--theme-border)]">
        {/* Infrastructure Progress (collapses cleanly if absent) */}
        {strategy.toggles.showInfrastructureTracker && estate.infrastructure && (
          <InfrastructureTracker infrastructure={estate.infrastructure} />
        )}

        {/* Location Rationale & Corridor Context */}
        {estate.locationRationale && (
          <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--theme-border)] pb-4">
              <div>
                <h3 className="text-base font-bold text-[var(--theme-text)]">
                  {estate.locationRationale.title}
                </h3>
                <p className="mt-1 text-xs text-[var(--theme-muted)]">
                  {estate.location.corridor}
                </p>
              </div>

              {estate.location.coordinates?.googleMapsUrl && (
                <a
                  href={estate.location.coordinates.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-1.5 text-xs font-medium text-[var(--theme-text)] hover:border-[var(--theme-accent)] transition-colors"
                >
                  <Compass className="h-3.5 w-3.5 text-[var(--theme-accent)]" />
                  <span>View Satellite Coordinates</span>
                  <ExternalLink className="h-3 w-3 text-[var(--theme-muted)]" />
                </a>
              )}
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {estate.locationRationale.points.map((point, idx) => (
                <div
                  key={idx}
                  className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-4 flex items-start gap-3"
                >
                  <CheckCircle className="h-4 w-4 text-[var(--theme-accent)] shrink-0 mt-0.5" />
                  <span className="text-xs text-[var(--theme-text)] leading-relaxed">{point}</span>
                </div>
              ))}
            </div>

            {estate.location.landmarks && estate.location.landmarks.length > 0 && (
              <div className="mt-6 pt-4 border-t border-[var(--theme-border)]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-muted)] block mb-2">
                  Key Corridors & Landmarks
                </span>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 text-xs text-[var(--theme-muted)]">
                  {estate.location.landmarks.map((landmark, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-[var(--theme-accent)] shrink-0" />
                      <span>{landmark}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Allocation Timeline */}
        {estate.allocationTimeline && estate.allocationTimeline.length > 0 && (
          <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 sm:p-8 shadow-sm">
            <div className="border-b border-[var(--theme-border)] pb-4">
              <h3 className="text-base font-bold text-[var(--theme-text)]">
                Allocation Handover Sequence
              </h3>
              <p className="mt-1 text-xs text-[var(--theme-muted)]">
                From initial search confirmation to physical beacon demarcation.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {estate.allocationTimeline.map((step, idx) => (
                <div
                  key={idx}
                  className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-4"
                >
                  <span className="text-xs font-bold text-[var(--theme-accent)] block mb-1">
                    PHASE 0{idx + 1}
                  </span>
                  <p className="text-xs text-[var(--theme-text)] font-medium leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Back to estates navigation */}
      <div className="pt-6 border-t border-[var(--theme-border)] flex items-center justify-between">
        <Link
          href="/estates"
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--theme-accent)] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Estates</span>
        </Link>

        <OpenModalButton estateSlug={estate.slug} variant="primary" className="text-xs py-2 px-4">
          <span>Book Inspection</span>
        </OpenModalButton>
      </div>
    </div>
  );
}
