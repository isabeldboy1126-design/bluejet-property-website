"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { VisualDirection, ThemeConfig, ThemeVariantConfig } from "@/types/config";
import themeConfigJson from "@/config/theme.config.json";

interface ThemeContextType {
  visualDirection: VisualDirection;
  setVisualDirection: (direction: VisualDirection) => void;
  activeVariantConfig: ThemeVariantConfig;
  themeConfig: ThemeConfig;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const typedThemeConfig = themeConfigJson as unknown as ThemeConfig;
  const [visualDirection, setVisualDirectionState] = useState<VisualDirection>(
    typedThemeConfig.activeVisualDirection
  );

  // Synchronize with URL query parameter or localStorage for instant inspection
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const vParam = urlParams.get("v") || urlParams.get("variant");
      if (vParam) {
        const lower = vParam.toLowerCase();
        if (lower === "01a" || lower.includes("trust")) {
          setVisualDirectionState("01A_INSTITUTIONAL_TRUST");
        } else if (lower === "01b" || lower.includes("growth")) {
          setVisualDirectionState("01B_GROWTH_OPPORTUNITY");
        } else if (lower === "01c" || lower.includes("living")) {
          setVisualDirectionState("01C_MODERN_ESTATE_LIVING");
        }
      }
    }
  }, []);

  const setVisualDirection = (direction: VisualDirection) => {
    setVisualDirectionState(direction);
  };

  const activeVariantConfig = typedThemeConfig.variants[visualDirection];

  // Apply CSS variables dynamically to the document root
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;

      root.style.setProperty("--theme-bg", activeVariantConfig.themeBg);
      root.style.setProperty("--theme-surface", activeVariantConfig.themeSurface);
      root.style.setProperty("--theme-card", activeVariantConfig.themeCard);
      root.style.setProperty("--theme-text", activeVariantConfig.themeText);
      root.style.setProperty("--theme-muted", activeVariantConfig.themeMuted);
      root.style.setProperty("--theme-accent", activeVariantConfig.themeAccent);
      root.style.setProperty("--theme-accent-hover", activeVariantConfig.themeAccentHover);
      root.style.setProperty("--theme-border", activeVariantConfig.themeBorder);
      root.style.setProperty("--theme-tag-bg", activeVariantConfig.themeTagBg);
      root.style.setProperty("--theme-tag-text", activeVariantConfig.themeTagText);
      root.style.setProperty("--border-radius-base", activeVariantConfig.radius);

      // Set variant data attribute for conditional Tailwind / CSS styling
      const shortCode = visualDirection.startsWith("01A")
        ? "01A"
        : visualDirection.startsWith("01B")
        ? "01B"
        : "01C";
      root.setAttribute("data-variant", shortCode);
    }
  }, [visualDirection, activeVariantConfig]);

  return (
    <ThemeContext.Provider
      value={{
        visualDirection,
        setVisualDirection,
        activeVariantConfig,
        themeConfig: typedThemeConfig,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
