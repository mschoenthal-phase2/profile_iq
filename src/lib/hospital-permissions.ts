import { ProfileSection } from "@/types/dashboard";
import { supabaseService } from "@/services/supabase-service";

export interface HospitalPermissions {
  [sectionId: string]: {
    is_visible: boolean;
    is_required: boolean;
  };
}

// Mock hospital mapping - in production this would come from the user's profile
const HOSPITAL_CODE_MAP: Record= {
  "University of Michigan": "hosp_1",
  "Cleveland Clinic": "hosp_2",
  "Mayo Clinic": "hosp_3",
};

/**
 * Get hospital permissions for a given organization
 */
export async function getHospitalPermissions(
  organization?: string,
): Promise{
  if (!organization) {
    // Return default permissions if no organization
    return getDefaultPermissions();
  }

  // Map organization name to hospital ID
  const hospitalId = HOSPITAL_CODE_MAP[organization];
  if (!hospitalId) {
    console.warn(`No hospital mapping found for: ${organization}`);
    return getDefaultPermissions();
  }

  try {
    const result = await supabaseService.getHospitalPermissions(hospitalId);
    if (result.success && result.data) {
      return result.data;
    }
  } catch (error) {
    console.error("Error fetching hospital permissions:", error);
  }

  return getDefaultPermissions();
}

/**
 * Get default permissions when no hospital-specific config is found
 */
export function getDefaultPermissions(): HospitalPermissions {
  return {
    professional_identity: { is_visible: true, is_required: true },
    education_training: { is_visible: true, is_required: true },
    practice_essentials: { is_visible: true, is_required: true },
    locations: { is_visible: true, is_required: false },
    biography: { is_visible: true, is_required: false },
    publications: { is_visible: true, is_required: false },
    clinical_trials: { is_visible: true, is_required: false },
    media_press: { is_visible: true, is_required: false },
    medical_expertise: { is_visible: true, is_required: false },
  };
}

/**
 * Apply hospital permissions to profile sections
 */
export function applySectionPermissions(
  sections: ProfileSection[],
  permissions: HospitalPermissions,
): ProfileSection[] {
  return sections
    .map((section) => {
      const permission = permissions[section.id];
      if (!permission) {
        // If no permission defined, keep original visibility
        return section;
      }

      return {
        ...section,
        isVisible: permission.is_visible,
        isRequired: permission.is_required,
      };
    })
    .filter((section) => section.isVisible); // Only return visible sections
}

/**
 * Check if user can access a specific section
 */
export function canUserAccessSection(
  sectionId: string,
  permissions: HospitalPermissions,
): boolean {
  const permission = permissions[sectionId];
  return permission ? permission.is_visible : true;
}

/**
 * Get hospital-specific navigation restrictions
 */
export function getNavigationRestrictions(permissions: HospitalPermissions): {
  allowedSections: string[];
  restrictedSections: string[];
} {
  const allowedSections: string[] = [];
  const restrictedSections: string[] = [];

  Object.entries(permissions).forEach(([sectionId, permission]) => {
    if (permission.is_visible) {
      allowedSections.push(sectionId);
    } else {
      restrictedSections.push(sectionId);
    }
  });

  return { allowedSections, restrictedSections };
}

/**
 * Create a permission summary for display
 */
export function createPermissionSummary(permissions: HospitalPermissions): {
  visible_count: number;
  required_count: number;
  total_sections: number;
  hidden_sections: string[];
} {
  let visible_count = 0;
  let required_count = 0;
  const hidden_sections: string[] = [];
  const total_sections = Object.keys(permissions).length;

  Object.entries(permissions).forEach(([sectionId, permission]) => {
    if (permission.is_visible) {
      visible_count++;
      if (permission.is_required) {
        required_count++;
      }
    } else {
      hidden_sections.push(sectionId);
    }
  });

  return {
    visible_count,
    required_count,
    total_sections,
    hidden_sections,
  };
}
