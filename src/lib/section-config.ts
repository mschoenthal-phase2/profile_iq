import {
  ProfileSection,
  ProfileSectionConfig,
  DEFAULT_PROFILE_SECTIONS,
} from "@/types/dashboard";

/**
 * Hospital-specific section configurations
 */
const HOSPITAL_CONFIGS: Record= {
  general: {
    visibleSections: [
      "professional_identity",
      "education_training",
      "practice_essentials",
      "locations",
      "biography",
      "insurance_plans",
      "medical_expertise",
      "publications",
      "clinical_trials",
      "media_press",
    ],
    requiredSections: [
      "professional_identity",
      "education_training",
      "practice_essentials",
    ],
  },
  academic_medical_center: {
    visibleSections: [
      "professional_identity",
      "education_training",
      "practice_essentials",
      "locations",
      "biography",
      "medical_expertise",
      "publications",
      "clinical_trials",
    ],
    requiredSections: [
      "professional_identity",
      "education_training",
      "practice_essentials",
      "publications",
    ],
  },
  community_hospital: {
    visibleSections: [
      "professional_identity",
      "education_training",
      "practice_essentials",
      "locations",
      "biography",
      "insurance_plans",
      "medical_expertise",
    ],
    requiredSections: [
      "professional_identity",
      "education_training",
      "practice_essentials",
      "insurance_plans",
    ],
  },
};

/**
 * Gets the section configuration for a specific hospital
 */
export function getHospitalSectionConfig(
  hospitalId?: string,
): ProfileSectionConfig {
  return (
    HOSPITAL_CONFIGS[hospitalId || "general"] || HOSPITAL_CONFIGS["general"]
  );
}

/**
 * Applies hospital-specific configuration to sections
 */
export function applySectionConfig(
  sections: ProfileSection[],
  config: ProfileSectionConfig,
): ProfileSection[] {
  return sections.map((section) => ({
    ...section,
    isVisible: config.visibleSections.includes(section.id),
    isRequired: config.requiredSections.includes(section.id),
    hospitalSpecific: config.hospitalId !== undefined,
  }));
}

/**
 * Calculates profile completion percentage based on required sections
 */
export function calculateProfileCompletion(
  sections: ProfileSection[],
  config?: ProfileSectionConfig,
): number {
  const appliedConfig = config || getHospitalSectionConfig();
  const requiredSections = sections.filter((section) =>
    appliedConfig.requiredSections.includes(section.id),
  );

  if (requiredSections.length === 0) return 100;

  const completedSections = requiredSections.filter(
    (section) => section.status === "complete",
  );

  return Math.round((completedSections.length / requiredSections.length) * 100);
}

/**
 * Gets sections filtered by status
 */
export function getSectionsByStatus(
  sections: ProfileSection[],
  status: ProfileSection["status"],
): ProfileSection[] {
  return sections.filter((section) => section.status === status);
}

/**
 * Gets sections that need updates (high priority first)
 */
export function getSectionsNeedingUpdates(
  sections: ProfileSection[],
): ProfileSection[] {
  return sections
    .filter(
      (section) =>
        section.status === "needs_update" || section.status === "missing",
    )
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
}

/**
 * Gets the most critical section that needs attention
 */
export function getMostCriticalSection(
  sections: ProfileSection[],
): ProfileSection | null {
  const sectionsNeedingUpdates = getSectionsNeedingUpdates(sections);
  return sectionsNeedingUpdates.length > 0 ? sectionsNeedingUpdates[0] : null;
}

/**
 * Updates a section's status and last updated date
 */
export function updateSectionStatus(
  sections: ProfileSection[],
  sectionId: string,
  status: ProfileSection["status"],
): ProfileSection[] {
  return sections.map((section) =>
    section.id === sectionId
      ? { ...section, status, lastUpdated: new Date() }
      : section,
  );
}
