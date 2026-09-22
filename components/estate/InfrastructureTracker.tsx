import React from 'react';
import { InfrastructureProgress } from '@/types/estate';
import { 
  CheckCircle2, 
  Clock, 
  CircleDashed, 
  Construction, 
  ShieldAlert, 
  Zap, 
  Car, 
  Compass 
} from 'lucide-react';

interface InfrastructureTrackerProps {
  infrastructure?: InfrastructureProgress;
}

export function InfrastructureTracker({ infrastructure }: InfrastructureTrackerProps) {
  if (!infrastructure) return null;

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'PAVED':
      case 'CONNECTED':
      case 'CONCRETE_DRAINS_DONE':
      case 'ACTIVE':
        return {
          label: 'Completed / Active',
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />,
          colorClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'IN_PROGRESS':
      case 'GRADED':
      case 'EARTHWORK_IN_PROGRESS':
      case 'POLES_INSTALLED':
      case 'UNDERWAY':
      case 'STRUCTURE_BUILT':
        return {
          label: 'In Progress',
          icon: <Clock className="h-4 w-4 text-amber-600" />,
          colorClass: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'PLANNED':
      case 'SOLAR_HYBRID':
        return {
          label: 'Planned Phase',
          icon: <CircleDashed className="h-4 w-4 text-slate-500" />,
          colorClass: 'bg-slate-50 text-slate-700 border-slate-200',
        };
      default:
        return null;
    }
  };

  const items = [
    {
      title: 'Perimeter Fencing',
      status: infrastructure.perimeterFence,
      icon: <Compass className="h-5 w-5 text-[var(--theme-muted)]" />,
      detail: 'Estate boundary security wall demarcation',
    },
    {
      title: 'Access & Internal Roads',
      status: infrastructure.accessRoad,
      icon: <Car className="h-5 w-5 text-[var(--theme-muted)]" />,
      detail: 'Site arterial grade and road paving',
    },
    {
      title: 'Gatehouse & Access Control',
      status: infrastructure.gateHouse,
      icon: <Construction className="h-5 w-5 text-[var(--theme-muted)]" />,
      detail: 'Manned entry gate and visitor verification',
    },
    {
      title: 'Power & Electrification',
      status: infrastructure.electricitySupply,
      icon: <Zap className="h-5 w-5 text-[var(--theme-muted)]" />,
      detail: 'Grid connection or transmission network',
    },
    {
      title: 'Drainage & Water Runoff',
      status: infrastructure.drainageNetwork,
      icon: <Construction className="h-5 w-5 text-[var(--theme-muted)]" />,
      detail: 'Concrete stormwater drainage systems',
    },
    {
      title: 'Site Security Architecture',
      status: infrastructure.securityPost,
      icon: <ShieldAlert className="h-5 w-5 text-[var(--theme-muted)]" />,
      detail: 'Permanent security station and surveillance post',
    },
  ].filter((item) => item.status && item.status !== 'NOT_APPLICABLE');

  if (items.length === 0 && !infrastructure.notes) {
    return null;
  }

  return (
    <div className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 shadow-sm">
      <div className="border-b border-[var(--theme-border)] pb-4">
        <h3 className="text-base font-semibold text-[var(--theme-text)]">
          Physical Ground Reality & Civil Infrastructure
        </h3>
        <p className="mt-1 text-xs text-[var(--theme-muted)]">
          Documented progress on site. All milestones can be physically inspected prior to reservation.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, idx) => {
          const badge = getStatusBadge(item.status);
          return (
            <div
              key={idx}
              className="rounded-[var(--border-radius-base)] border border-[var(--theme-border)] bg-[var(--theme-bg)] p-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-[var(--border-radius-base)] bg-[var(--theme-surface)] border border-[var(--theme-border)]">
                    {item.icon}
                  </div>
                  {badge && (
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.colorClass}`}
                    >
                      {badge.icon}
                      <span>{badge.label}</span>
                    </span>
                  )}
                </div>
                <h4 className="mt-3 text-sm font-semibold text-[var(--theme-text)]">
                  {item.title}
                </h4>
                <p className="mt-1 text-xs text-[var(--theme-muted)]">
                  {item.detail}
                </p>
              </div>

              <div className="mt-3 border-t border-[var(--theme-border)] pt-2 text-[11px] font-mono text-[var(--theme-muted)]">
                Status: {item.status?.replace(/_/g, ' ')}
              </div>
            </div>
          );
        })}
      </div>

      {infrastructure.notes && (
        <div className="mt-4 rounded-[var(--border-radius-base)] bg-[var(--theme-bg)] p-4 border border-[var(--theme-border)] text-xs text-[var(--theme-muted)]">
          <span className="font-semibold text-[var(--theme-text)]">Site Engineer Note: </span>
          {infrastructure.notes}
        </div>
      )}
    </div>
  );
}
