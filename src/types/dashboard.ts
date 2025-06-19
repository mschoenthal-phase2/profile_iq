export interface ProviderProfile {
  personalInfo: {
    fullName: string;
    email: string;
    jobTitle: string;
    organization?: string;
  };
  npiData: {
    number: string;
    firstName?: string;
    lastName?: string;
    credential?: string;
    gender?: string;
    department?: string;
    specialty?: string;
    addresses?: Array<{
      address_1: string;
      address_2?: string;
      city: string;
      state: string;
      postal_code: string;
      telephone_number?: string;
    }>;
  };
  preferences: {
    pronouns?: string;
    languages?: string[];
  };
  stats: {
    profileViews: number;
    sectionsNeedingUpdates: number;
  };
}

export interface ProfileSection {
  id: string;
  title: string;
  icon: string;
  lastUpdated: Date;
  status: "complete" | "needs_update" | "missing";
  description?: string;
  priority: "high" | "medium" | "low";
  isVisible: boolean;
  isRequired: boolean;
  hospitalSpecific?: boolean;
}

export interface ProfileSectionConfig {
  hospitalId?: string;
  visibleSections: string[];
  requiredSections: string[];
  customSections?: ProfileSection[];
}

export type ProfileSectionType =
  | "credentials"
  | "professional_identity"
  | "practice_essentials"
  | "insurance_plans"
  | "medical_expertise"
  | "publications"
  | "clinical_trials"
  | "locations"
  | "education_training"
  | "biography"
  | "media_press";

export const DEFAULT_PROFILE_SECTIONS: ProfileSection[] = [
  {
    id: "professional_identity",
    title: "Professional Identity",
    icon: "user",
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    status: "needs_update",
    description: "Please update your specialties and add new certifications",
    priority: "high",
    isVisible: true,
    isRequired: true,
  },
  {
    id: "education_training",
    title: "Education & Training",
    icon: "graduation-cap",
    lastUpdated: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 3 months ago
    status: "complete",
    priority: "medium",
    isVisible: true,
    isRequired: true,
  },
  {
    id: "practice_essentials",
    title: "Practice Essentials",
    icon: "briefcase",
    lastUpdated: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 3 weeks ago
    status: "complete",
    priority: "medium",
    isVisible: true,
    isRequired: true,
  },
  {
    id: "locations",
    title: "Locations",
    icon: "map-pin",
    lastUpdated: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    status: "complete",
    priority: "medium",
    isVisible: true,
    isRequired: false,
  },
  {
    id: "biography",
    title: "Biography",
    icon: "user-circle",
    lastUpdated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
    status: "complete",
    priority: "medium",
    isVisible: true,
    isRequired: false,
  },
  {
    id: "publications",
    title: "Publications",
    icon: "book-open",
    lastUpdated: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    status: "complete",
    priority: "low",
    isVisible: true,
    isRequired: false,
  },
  {
    id: "clinical_trials",
    title: "Clinical Trials",
    icon: "flask",
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    status: "complete",
    priority: "low",
    isVisible: true,
    isRequired: false,
  },
  {
    id: "media_press",
    title: "Media & Press",
    icon: "camera",
    lastUpdated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 2 months ago
    status: "complete",
    priority: "low",
    isVisible: true,
    isRequired: false,
  },
  {
    id: "medical_expertise",
    title: "Medical Expertise",
    icon: "stethoscope",
    lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    status: "complete",
    priority: "medium",
    isVisible: true,
    isRequired: false,
  },
];
