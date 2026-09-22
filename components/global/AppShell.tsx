"use client";

import React from "react";
import { ModalProvider, useInspectionModal } from "@/lib/modal-context";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { PersistentActions } from "./PersistentActions";
import { InspectionModal } from "../conversion/InspectionModal";
import { LogoFlightCoordinator } from "../home/LogoFlightCoordinator";
import { CompanyConfig, StrategyConfig } from "@/types/config";
import { EstateItem } from "@/types/estate";

interface AppShellProps {
  company: CompanyConfig;
  strategy: StrategyConfig;
  estates: EstateItem[];
  children: React.ReactNode;
}

function ShellInner({ company, strategy, estates, children }: AppShellProps) {
  const { isOpen, preselectedSlug, openInspectionModal, closeInspectionModal } = useInspectionModal();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--theme-bg)] text-[var(--theme-text)]">
      <LogoFlightCoordinator />
      <SiteHeader
        onOpenInspectionModal={() => openInspectionModal()}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <PersistentActions company={company} />
      <InspectionModal
        isOpen={isOpen}
        onClose={closeInspectionModal}
        company={company}
        estates={estates}
        preselectedEstateSlug={preselectedSlug}
      />
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return (
    <ModalProvider>
      <ShellInner {...props} />
    </ModalProvider>
  );
}
