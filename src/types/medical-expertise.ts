// Medical Expertise Types
// This defines the data structures for medical expertise functionality

export interface ClinicalExpertise {
  id: string;
  term_id: string;
  term: string;
  specialty: string;
  term_type: "Condition" | "Procedure" | "Reason for Visit" | "Other";
  specialty_id: number;
  created_at: string;
}

export interface UserExpertise {
  id: string;
  user_profile_id: string;
  term_id: string;
  term_type: "Condition" | "Procedure" | "Reason for Visit" | "Other";
  created_at: string;
  clinical_expertise?: ClinicalExpertise;
}

export interface UserProfile {
  id: string;
  user_id: string;
  email?: string;
  full_name?: string;
  specialty?: string;
  specialty_id?: number;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicalSpecialty {
  specialty: string;
  specialty_id: number;
}

export interface SelectedExpertise {
  conditions: string[];
  procedures: string[];
  reasonsForVisit: string[];
}

export interface MedicalExpertiseState {
  // Current step in the setup process
  currentStep: 1 | 2;

  // Available data
  specialties: MedicalSpecialty[];
  userProfile: UserProfile | null;

  // Selected data
  selectedSpecialties: string[];
  specialtyIds: number[];
  selectedItems: SelectedExpertise;

  // Available items for current specialty
  availableItems: {
    conditions: ClinicalExpertise[];
    procedures: ClinicalExpertise[];
    reasonsForVisit: ClinicalExpertise[];
  };

  // UI state
  loading: boolean;
  error: string | null;
  hasUnsavedChanges: boolean;
  isEditing: boolean;
  isSaving: boolean;
}

export interface MedicalExpertiseStats {
  totalSpecialties: number;
  selectedSpecialty: string | null;
  totalConditions: number;
  totalProcedures: number;
  totalReasonsForVisit: number;
  totalItems: number;
  lastUpdated?: Date;
}

export interface ExpertiseFilters {
  searchQuery?: string;
  termType?: "Condition" | "Procedure" | "Reason for Visit" | "All";
  showSelected?: boolean;
}

// Service layer interfaces
export interface MedicalExpertiseService {
  getSpecialties(): Promise<MedicalSpecialty[]>;
  getItemsBySpecialtyAndType(
    specialty: string,
    termType: string,
  ): Promise<ClinicalExpertise[]>;
  getUserProfile(userId: string): Promise<UserProfile | null>;
  upsertUserProfile(profileData: Partial<UserProfile>): Promise<UserProfile>;
  getUserExpertise(userProfileId: string): Promise<UserExpertise[]>;
  saveUserExpertise(
    userProfileId: string,
    selectedItems: SelectedExpertise,
  ): Promise<void>;
}

// Form validation
export interface MedicalExpertiseValidation {
  isSpecialtySelected: boolean;
  hasSelectedItems: boolean;
  errors: string[];
  warnings: string[];
}

// Export types for form data
export type MedicalExpertiseInsert = Omit<
  UserExpertise,
  "id" | "created_at" | "clinical_expertise"
>;
export type MedicalExpertiseUpdate = Partial<MedicalExpertiseInsert>;
