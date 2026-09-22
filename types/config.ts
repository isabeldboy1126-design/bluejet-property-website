import { VerificationStatus } from "./estate";

export type VisualDirection = 
  | "01A_INSTITUTIONAL_TRUST"
  | "01B_GROWTH_OPPORTUNITY"
  | "01C_MODERN_ESTATE_LIVING";

export type HeroFocusMode = 
  | "TRUST"
  | "DESIRED_OUTCOME"
  | "OPPORTUNITY"
  | "PROBLEM"
  | "CATEGORY_CLARITY"
  | "PROJECT_INTRODUCTION"
  | "OFFER"
  | "DIFFERENTIATION"
  | "PROOF"
  | "IDENTITY_STATUS"
  | "OTHER_APPROVED_JOB";

export interface CompanyConfig {
  companyName: string;
  legalEntityName: string;
  rcNumber?: string; // Corporate Affairs Commission registration
  tagline?: string;
  foundedYear?: number;
  contact: {
    phonePrimary: string;
    phoneSecondary?: string;
    whatsappNumber: string; // international format without spaces, e.g. "2348012345678"
    emailGeneral: string;
  };
  office: {
    addressLine1: string;
    city: string;
    state: string;
    postalArea?: string;
    directionsHint?: string;
    mapEmbedUrl?: string;
    officeInspectionHours?: string;
  };
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    linkedin?: string;
    tiktok?: string;
  };
  regulatoryDisclosures?: {
    lasreraNumber?: string;
    statutoryNotice?: string;
  };
}

export interface ThemeVariantConfig {
  key: VisualDirection;
  displayName: string;
  perception: string;
  fontSans: string;
  fontDisplay: string;
  fontSerif: string;
  themeBg: string;
  themeSurface: string;
  themeCard: string;
  themeText: string;
  themeMuted: string;
  themeAccent: string;
  themeAccentHover: string;
  themeBorder: string;
  themeTagBg: string;
  themeTagText: string;
  radius: string;
  containerClass: string;
  spacingScale: string;
}

export interface ThemeConfig {
  activeVisualDirection: VisualDirection;
  supportedDirections: VisualDirection[];
  variants: Record<VisualDirection, ThemeVariantConfig>;
}

export interface StrategyConfig {
  hero: {
    focusMode: HeroFocusMode;
    headline: string;
    subheadline: string;
    primaryCta: {
      label: string;
      action: "OPEN_INSPECTION_MODAL" | "NAVIGATE_TO_ESTATES" | "WHATSAPP_CONTACT";
      reassurance?: string;
    };
    proofAnchor?: {
      text: string;
    };
  };
  earlyCredibility?: {
    badge: string;
    heading: string;
    summary: string;
    anchors: {
      label: string;
      value: string;
      detail: string;
    }[];
  };
  homepageRationale: {
    heading: string;
    subheading: string;
    rationalePoints: {
      title: string;
      description: string;
      badgeText?: string;
    }[];
  };
  verificationProcess?: {
    heading: string;
    subheading: string;
    steps: {
      stepNumber: number;
      title: string;
      description: string;
    }[];
  };
  allocationProcess?: {
    heading: string;
    subheading: string;
    steps: {
      stepNumber: number;
      title: string;
      description: string;
    }[];
  };
  companyProof?: {
    heading: string;
    subheading: string;
    officeAddress: string;
    cacRegistration: string;
    operatingPledge: string;
  };
  toggles: {
    showVerificationPage: boolean; // Optional route /verification
    showPricing: boolean;
    showPaymentPlan: boolean;
    showInfrastructureTracker: boolean;
    showHomes: boolean; // Hybrid plots + houses
    showInteractiveMap: boolean;
    showRemoteVideoInspection: boolean;
  };
}
