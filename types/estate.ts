export type VerificationStatus = 
  | "FINAL_SAFE"
  | "PLACEHOLDER_DIRECTION"
  | "NEEDS_CLIENT_INPUT"
  | "NEEDS_RESEARCH"
  | "NEEDS_PROOF"
  | "UNKNOWN";

export type ProjectOperationalStatus = 
  | "AVAILABLE"
  | "NEW_LAUNCH"
  | "PHASE_1_ALLOCATED"
  | "INFRASTRUCTURE_UNDERWAY"
  | "SOLD_OUT";

export interface PlotSpecification {
  size: string; // e.g., "300 sqm", "500 sqm"
  dimension?: string; // e.g., "15m x 20m"
  use?: string; // e.g., "Residential Bungalow", "Detached Duplex"
  priceDisplay?: string; // e.g., "₦4,500,000"
  numericPrice?: number;
}

export interface PaymentPlanOption {
  duration: string; // e.g., "Outright", "3 Months", "6 Months"
  priceDisplay: string;
  depositRequired?: string;
  monthlyInstallment?: string;
}

export interface InfrastructureProgress {
  perimeterFence?: "COMPLETED" | "IN_PROGRESS" | "PLANNED" | "NOT_APPLICABLE";
  accessRoad?: "PAVED" | "GRADED" | "EARTHWORK_IN_PROGRESS" | "UNPAVED";
  gateHouse?: "COMPLETED" | "IN_PROGRESS" | "PLANNED";
  electricitySupply?: "CONNECTED" | "POLES_INSTALLED" | "PLANNED" | "SOLAR_HYBRID";
  drainageNetwork?: "CONCRETE_DRAINS_DONE" | "UNDERWAY" | "PLANNED";
  securityPost?: "ACTIVE" | "STRUCTURE_BUILT" | "PLANNED";
  notes?: string;
}

export interface EstateLocation {
  corridor: string; // e.g., "Alaro City / Ketu Corridor" or "Airport Road Expansion"
  city: string; // e.g., "Epe", "Ibeju-Lekki", "Sagamu", "Guzape", "Bauchi"
  state: string; // e.g., "Lagos", "Ogun", "Abuja FCT", "Bauchi"
  landmarks?: string[]; // e.g., ["8 mins from Epe T-Junction", "Adjacent to State Highway"]
  coordinates?: {
    latitude: number;
    longitude: number;
    googleMapsUrl?: string;
  };
}

export interface TitleDocumentation {
  statutoryType: string; // e.g., "Certificate of Occupancy (C of O)", "Registered Gazette", "Governor's Consent", "Excision File Number in Process"
  documentReference?: string; // e.g., "Lagos State Gazette Vol. 54, No. 12"
  issuingAuthority?: string; // e.g., "Lagos State Lands Bureau", "FCDA AGIS"
  verificationStatus: VerificationStatus;
  diligenceNotice: string; // e.g., "Available for independent search at Lagos State Lands Bureau"
  surveyPlanNumber?: string;
}

export interface HeroMediaAsset {
  type: "AUTHENTIC_PHOTO" | "CLIENT_SUPPLIED_PHOTO" | "LABELLED_RENDER" | "MASTER_PLAN" | "VERIFIED_AERIAL" | "LOCATION_MAP";
  url: string;
  caption?: string;
  altText: string;
}

export interface EstateItem {
  id: string;
  name: string;
  slug: string;
  tagline?: string;
  operationalStatus: ProjectOperationalStatus;
  isSyntheticFixture: boolean; // Must be true for mock development data
  heroMedia: HeroMediaAsset;
  galleryMedia?: HeroMediaAsset[];
  location: EstateLocation;
  title: TitleDocumentation;
  
  // High-Value Data (if verified/available)
  entryPriceDisplay?: string; // e.g., "From ₦4,500,000"
  entryDepositDisplay?: string; // e.g., "₦500,000 Initial Deposit"
  plots: PlotSpecification[];
  paymentPlans?: PaymentPlanOption[];
  allocationTimeline?: string[]; // e.g., ["Site Inspection", "Documentation & Survey Lodgement", "Physical Beaconing Handover"]

  // Conditional Data (modules cleanly collapse if absent)
  infrastructure?: InfrastructureProgress;
  locationRationale?: {
    title: string;
    points: string[];
  };
  residentialOptions?: {
    hasBuiltHomes: boolean;
    homeTypes?: string[];
  };
  masterPlanUrl?: string;
  videoTourUrl?: string;
}
