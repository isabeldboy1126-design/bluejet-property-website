import React from 'react';
import { FileSearch, Footprints, ShieldCheck, ArrowRight } from 'lucide-react';

interface StepItem {
  stepNumber: number;
  title: string;
  description: string;
}

interface VerificationProcessStepsProps {
  heading?: string;
  subheading?: string;
  steps?: StepItem[];
}

const defaultSteps: StepItem[] = [
  {
    stepNumber: 1,
    title: 'Documentary Review & Independent Search',
    description: 'We supply certified survey plan numbers, registered gazette / excision copies, and coordinate charts so your solicitor can independently search records at the Lands Bureau.',
  },
  {
    stepNumber: 2,
    title: 'Physical Ground Inspection & Beacon Check',
    description: 'Walk the actual land boundaries on our scheduled weekend site inspections. Verify access topography, perimeter beacons, and ongoing civil infrastructure with your surveyor.',
  },
  {
    stepNumber: 3,
    title: 'Contract Execution & Physical Allocation',
    description: 'Review the Contract of Sale and terms. Upon documentation completion, receive your Deed of Assignment, official survey lodging, and direct physical plot demarcation on site.',
  },
];

export function VerificationProcessSteps({
  heading = 'Documentary & Physical Verification Protocol',
  subheading = 'We provide the verifiable parameters your legal counsel and surveyor require before any financial commitment.',
  steps = defaultSteps,
}: VerificationProcessStepsProps) {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <FileSearch className="h-6 w-6 text-[var(--theme-accent)]" />;
      case 1:
        return <Footprints className="h-6 w-6 text-[var(--theme-accent)]" />;
      case 2:
        return <ShieldCheck className="h-6 w-6 text-[var(--theme-accent)]" />;
      default:
        return <ShieldCheck className="h-6 w-6 text-[var(--theme-accent)]" />;
    }
  };

  return (
    <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 sm:p-10 shadow-sm">
      <div className="max-w-2xl">
        <span className="inline-flex items-center rounded-full bg-[var(--theme-tag-bg)] px-2.5 py-0.5 text-xs font-semibold text-[var(--theme-tag-text)]">
          INSPECTION & TITLE INTEGRITY
        </span>
        <h3 className="mt-3 text-xl sm:text-2xl font-bold text-[var(--theme-text)]">
          {heading}
        </h3>
        <p className="mt-2 text-sm text-[var(--theme-muted)]">
          {subheading}
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {steps.map((step, idx) => (
          <div
            key={step.stepNumber || idx}
            className="relative flex flex-col justify-between rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-6 transition-all hover:border-[var(--theme-accent)]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--theme-surface)] border border-[var(--theme-border)] text-xs font-bold text-[var(--theme-text)]">
                  0{step.stepNumber || idx + 1}
                </span>
                <div className="p-2 rounded-[var(--border-radius-base)] bg-[var(--theme-surface)] border border-[var(--theme-border)]">
                  {getStepIcon(idx)}
                </div>
              </div>

              <h4 className="mt-4 text-base font-semibold text-[var(--theme-text)]">
                {step.title}
              </h4>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--theme-muted)]">
                {step.description}
              </p>
            </div>

            <div className="mt-6 border-t border-[var(--theme-border)] pt-3 text-[11px] font-medium text-[var(--theme-accent)] flex items-center gap-1">
              <span>Standard Statutory Diligence</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
