export interface ClinicalTrial {
  id: string;
  nctId: string;
  title: string;
  status: ClinicalTrialStatus;
  phase: string[];
  studyType: string;
  conditions: string[];
  interventions: string[];
  primaryPurpose: string;
  allocation: string;
  masking: string;
  enrollmentCount: number;
  startDate?: Date;
  completionDate?: Date;
  primaryCompletionDate?: Date;
  sponsor: string;
  collaborators: string[];
  locations: ClinicalTrialLocation[];
  eligibilityCriteria: string;
  primaryOutcomes: ClinicalTrialOutcome[];
  secondaryOutcomes: ClinicalTrialOutcome[];
  briefSummary: string;
  detailedDescription?: string;
  keywords: string[];
  studyDesign: string;
  userRole: UserTrialRole;
  isVisible: boolean;
  isSelected: boolean;
  userStatus: UserTrialStatus;
  addedAt: Date;
  lastModified: Date;
}

export type ClinicalTrialStatus =
  | "not_yet_recruiting"
  | "recruiting"
  | "enrolling_by_invitation"
  | "active_not_recruiting"
  | "suspended"
  | "terminated"
  | "completed"
  | "withdrawn"
  | "unknown";

export type UserTrialRole =
  | "principal_investigator"
  | "sub_investigator"
  | "study_coordinator"
  | "sponsor"
  | "collaborator"
  | "consultant"
  | "other";

export type UserTrialStatus =
  | "pending" // Newly discovered, awaiting user review
  | "approved" // User has approved for profile
  | "rejected" // User has rejected
  | "manual" // Manually added by user
  | "hidden"; // Approved but hidden from public view

export interface ClinicalTrialLocation {
  facility: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  status?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface ClinicalTrialOutcome {
  measure: string;
  timeFrame: string;
  description?: string;
}

export interface ClinicalTrialsGovStudy {
  nctId: string;
  title: string;
  status: string;
  phase: string[];
  studyType: string;
  conditions: string[];
  interventions: string[];
  primaryPurpose: string;
  allocation: string;
  masking: string;
  enrollmentCount: number;
  startDate?: string;
  completionDate?: string;
  primaryCompletionDate?: string;
  sponsor: string;
  collaborators: string[];
  locations: ClinicalTrialLocation[];
  eligibilityCriteria: string;
  primaryOutcomes: ClinicalTrialOutcome[];
  secondaryOutcomes: ClinicalTrialOutcome[];
  briefSummary: string;
  detailedDescription?: string;
  keywords: string[];
  studyDesign: string;
}

export interface ClinicalTrialsSearchResult {
  studies: ClinicalTrialsGovStudy[];
  totalCount: number;
  searchTerms: string[];
}

export interface ClinicalTrialDiscoveryResult {
  searchQuery: string;
  searchDate: Date;
  totalFound: number;
  trials: ClinicalTrial[];
  suggestedKeywords: string[];
}

export interface ClinicalTrialFilters {
  status?: ClinicalTrialStatus[];
  phase?: string[];
  studyType?: string[];
  userRole?: UserTrialRole[];
  userStatus?: UserTrialStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  conditions?: string[];
}

export interface ClinicalTrialManagementState {
  trials: ClinicalTrial[];
  discoveryResults: ClinicalTrialDiscoveryResult | null;
  isSearching: boolean;
  searchError: string | null;
  isLoading: boolean;
  filters: ClinicalTrialFilters;
  manualNCTInput: string;
  isLookingUpNCT: boolean;
  nctLookupError: string | null;
}

export const CLINICAL_TRIAL_PHASES = [
  "Early Phase 1",
  "Phase 1",
  "Phase 1/Phase 2",
  "Phase 2",
  "Phase 2/Phase 3",
  "Phase 3",
  "Phase 4",
  "Not Applicable",
];

export const STUDY_TYPES = [
  "Interventional",
  "Observational",
  "Expanded Access",
];

export const USER_ROLES = [
  { value: "principal_investigator", label: "Principal Investigator" },
  { value: "sub_investigator", label: "Sub-Investigator" },
  { value: "study_coordinator", label: "Study Coordinator" },
  { value: "sponsor", label: "Sponsor" },
  { value: "collaborator", label: "Collaborator" },
  { value: "consultant", label: "Consultant" },
  { value: "other", label: "Other" },
];

export const TRIAL_STATUS_LABELS = {
  not_yet_recruiting: "Not Yet Recruiting",
  recruiting: "Recruiting",
  enrolling_by_invitation: "Enrolling by Invitation",
  active_not_recruiting: "Active, Not Recruiting",
  suspended: "Suspended",
  terminated: "Terminated",
  completed: "Completed",
  withdrawn: "Withdrawn",
  unknown: "Unknown Status",
};
