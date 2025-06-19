export interface Hospital {
  id: string;
  name: string;
  code: string;
  address?: string;
  contact_email?: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ProfileSectionPermission {
  id: string;
  hospital_id: string;
  section_id: string;
  is_visible: boolean;
  is_required: boolean;
  created_at: string;
  updated_at: string;
}

export interface HospitalPermissionSettings {
  hospital_id: string;
  hospital_name: string;
  permissions: {
    [sectionId: string]: {
      is_visible: boolean;
      is_required: boolean;
    };
  };
}

export interface AdminDashboardStats {
  total_hospitals: number;
  total_users: number;
  active_hospitals: number;
  sections_configured: number;
}

export type AdminAction =
  | "view_hospitals"
  | "manage_permissions"
  | "view_users"
  | "system_settings";

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: "super_admin" | "hospital_admin" | "system_admin";
  hospital_id?: string;
  permissions: AdminAction[];
  created_at: string;
  last_login?: string;
}

// Default profile sections that can be managed
export const MANAGEABLE_SECTIONS = [
  {
    id: "professional_identity",
    title: "Professional Identity",
    description: "Basic professional information and credentials",
    required_by_default: true,
  },
  {
    id: "education_training",
    title: "Education & Training",
    description: "Educational background and training history",
    required_by_default: true,
  },
  {
    id: "practice_essentials",
    title: "Practice Essentials",
    description: "Practice information and essentials",
    required_by_default: true,
  },
  {
    id: "locations",
    title: "Locations",
    description: "Practice locations and contact information",
    required_by_default: false,
  },
  {
    id: "biography",
    title: "Biography",
    description: "Professional biography and summary",
    required_by_default: false,
  },
  {
    id: "publications",
    title: "Publications",
    description: "Research publications and academic work",
    required_by_default: false,
  },
  {
    id: "clinical_trials",
    title: "Clinical Trials",
    description: "Clinical trial participation and research",
    required_by_default: false,
  },
  {
    id: "media_press",
    title: "Media & Press",
    description: "Media coverage and press mentions",
    required_by_default: false,
  },
  {
    id: "medical_expertise",
    title: "Medical Expertise",
    description: "Areas of medical expertise and specialization",
    required_by_default: false,
  },
] as const;
