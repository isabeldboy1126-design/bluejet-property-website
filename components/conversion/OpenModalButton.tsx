"use client";

import React from 'react';
import { useInspectionModal } from '@/lib/modal-context';

interface OpenModalButtonProps {
  children: React.ReactNode;
  estateSlug?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'hero' | 'none';
}

export function OpenModalButton({
  children,
  estateSlug,
  className = '',
  variant = 'primary',
}: OpenModalButtonProps) {
  const { openInspectionModal } = useInspectionModal();

  const baseStyles = 'inline-flex items-center justify-center font-bold text-sm rounded-[var(--border-radius-base)] transition-all touch-target px-5 py-3 shadow-sm';
  const variantStyles: Record<string, string> = {
    primary: 'bg-[var(--theme-accent)] hover:bg-[var(--theme-accent-hover)] text-white active:scale-95',
    secondary: 'bg-[var(--theme-surface)] hover:bg-[var(--theme-bg)] text-[var(--theme-text)] border border-[var(--theme-border)] active:scale-95',
    outline: 'bg-transparent border border-white text-white hover:bg-white/10 active:scale-95',
    hero: 'bg-[#0D8975] hover:bg-[#109580] text-[#F7F4EC] active:scale-95 shadow-sm',
    none: '',
  };

  return (
    <button
      type="button"
      onClick={() => openInspectionModal(estateSlug)}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
