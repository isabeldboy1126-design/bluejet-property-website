"use client";

import React, { createContext, useContext, useState } from "react";

interface ModalContextType {
  isOpen: boolean;
  preselectedSlug?: string;
  openInspectionModal: (slug?: string) => void;
  closeInspectionModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedSlug, setPreselectedSlug] = useState<string | undefined>(undefined);

  const openInspectionModal = (slug?: string) => {
    setPreselectedSlug(slug);
    setIsOpen(true);
  };

  const closeInspectionModal = () => {
    setIsOpen(false);
    setPreselectedSlug(undefined);
  };

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        preselectedSlug,
        openInspectionModal,
        closeInspectionModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useInspectionModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useInspectionModal must be used within a ModalProvider");
  }
  return context;
}
