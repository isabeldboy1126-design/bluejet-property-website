import companyConfigRaw from "@/config/company.config.json";
import themeConfigRaw from "@/config/theme.config.json";
import strategyConfigRaw from "@/config/strategy.config.json";
import estatesDataRaw from "@/config/estates.data.json";

import { CompanyConfig, ThemeConfig, StrategyConfig, VisualDirection } from "@/types/config";
import { EstateItem } from "@/types/estate";

export function getCompanyConfig(): CompanyConfig {
  return companyConfigRaw as unknown as CompanyConfig;
}

export function getThemeConfig(): ThemeConfig {
  return themeConfigRaw as unknown as ThemeConfig;
}

export function getStrategyConfig(): StrategyConfig {
  return strategyConfigRaw as unknown as StrategyConfig;
}

export function getEstates(): EstateItem[] {
  return estatesDataRaw as unknown as EstateItem[];
}

export function getEstateBySlug(slug: string): EstateItem | undefined {
  const estates = getEstates();
  return estates.find((e) => e.slug === slug);
}

export type SiteMode = "single" | "multi";
export const siteMode: SiteMode = "single";

export function getSiteMode(): SiteMode {
  return siteMode;
}
