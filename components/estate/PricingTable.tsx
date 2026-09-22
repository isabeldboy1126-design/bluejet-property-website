import React from 'react';
import { PlotSpecification, PaymentPlanOption } from '@/types/estate';
import { CheckCircle, Calendar, ShieldCheck } from 'lucide-react';

interface PricingTableProps {
  plots: PlotSpecification[];
  paymentPlans?: PaymentPlanOption[];
  showPaymentPlan?: boolean;
}

export function PricingTable({
  plots,
  paymentPlans,
  showPaymentPlan = true,
}: PricingTableProps) {
  return (
    <div className="space-y-8">
      {/* Plot Breakdown Table */}
      <div className="overflow-hidden rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] shadow-sm">
        <div className="border-b border-[var(--theme-border)] bg-[var(--theme-bg)] px-6 py-4">
          <h3 className="text-base font-semibold text-[var(--theme-text)]">
            Plot Dimensions & Price Structure
          </h3>
          <p className="mt-1 text-xs text-[var(--theme-muted)]">
            All prices reflect statutory plot sizes demarcated by registered survey beacons.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[var(--theme-text)]">
            <thead className="border-b border-[var(--theme-border)] bg-[var(--theme-bg)] text-xs uppercase tracking-wider text-[var(--theme-muted)]">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold">Plot Size</th>
                <th scope="col" className="px-6 py-3 font-semibold">Dimensions</th>
                <th scope="col" className="px-6 py-3 font-semibold">Approved Use</th>
                <th scope="col" className="px-6 py-3 font-semibold text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--theme-border)] font-normal">
              {plots.map((plot, idx) => (
                <tr key={idx} className="transition-colors hover:bg-[var(--theme-bg)]/50">
                  <td className="px-6 py-4 font-semibold text-[var(--theme-text)]">
                    {plot.size}
                  </td>
                  <td className="px-6 py-4 text-[var(--theme-muted)] tabular-nums">
                    {plot.dimension || 'Survey Demarcated'}
                  </td>
                  <td className="px-6 py-4 text-[var(--theme-muted)]">
                    {plot.use || 'Residential Master Plan'}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-[var(--theme-accent)] tabular-nums">
                    {plot.priceDisplay || 'Enquire for Price'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Spread Options (if enabled and available) */}
      {showPaymentPlan && paymentPlans && paymentPlans.length > 0 && (
        <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h4 className="text-base font-semibold text-[var(--theme-text)]">
                Flexible Payment Structures
              </h4>
              <p className="mt-1 text-xs text-[var(--theme-muted)]">
                Structured deposit and spread options. Deeds are lodged upon completion of scheduled terms.
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--theme-accent)] font-medium">
              <ShieldCheck className="h-4 w-4" />
              <span>Contractual Escrow Terms</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paymentPlans.map((plan, index) => (
              <div
                key={index}
                className="flex flex-col justify-between rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-5"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[var(--theme-muted)]">
                      {plan.duration}
                    </span>
                    <Calendar className="h-4 w-4 text-[var(--theme-muted)]" />
                  </div>
                  <div className="mt-3 text-xl font-bold text-[var(--theme-text)] tabular-nums">
                    {plan.priceDisplay}
                  </div>
                  {plan.depositRequired && (
                    <div className="mt-2 text-xs font-medium text-[var(--theme-accent)]">
                      Initial Deposit: {plan.depositRequired}
                    </div>
                  )}
                </div>

                {plan.monthlyInstallment && (
                  <div className="mt-4 border-t border-[var(--theme-border)] pt-3 text-xs text-[var(--theme-muted)]">
                    {plan.monthlyInstallment}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-[var(--theme-muted)]">
            <CheckCircle className="h-3.5 w-3.5 text-[var(--theme-accent)] flex-shrink-0" />
            <span>Formal documentation receipts and contractual allocation guarantees issued with every instalment.</span>
          </div>
        </div>
      )}
    </div>
  );
}
