// Supabase Database Schema Types
// This file defines all the data structures that will be stored in Supabase

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserProfile;
        Insert: UserProfileInsert;
        Update: UserProfileUpdate;
      };
      npi_data: {
        Row: NPIData;
        Insert: NPIDataInsert;
        Update: NPIDataUpdate;
      };
      professional_identity: {
        Row: ProfessionalIdentityData;
        Insert: ProfessionalIdentityInsert;
        Update: ProfessionalIdentityUpdate;
      };
      professional_licenses: {
        Row: ProfessionalLicense;
        Insert: ProfessionalLicenseInsert;
        Update: ProfessionalLicenseUpdate;
      };
      medical_specialties: {
        Row: MedicalSpecialty;
        Insert: MedicalSpecialtyInsert;
        Update: MedicalSpecialtyUpdate;
      };
      professional_credentials: {
        Row: ProfessionalCredential;
        Insert: ProfessionalCredentialInsert;
        Update: ProfessionalCredentialUpdate;
      };
      profile_sections: {
        Row: ProfileSectionData;
        Insert: ProfileSectionInsert;
        Update: ProfileSectionUpdate;
      };
      practice_essentials: {
        Row: PracticeEssentials;
        Insert: PracticeEssentialsInsert;
        Update: PracticeEssentialsUpdate;
      };
      insurance_plans: {
        Row: InsurancePlan;
        Insert: InsurancePlanInsert;
        Update: InsurancePlanUpdate;
      };
      medical_expertise: {
        Row: MedicalExpertise;
        Insert: MedicalExpertiseInsert;
        Update: MedicalExpertiseUpdate;
      };
      publications: {
        Row: Publication;
        Insert: PublicationInsert;
        Update: PublicationUpdate;
      };
      clinical_trials: {
        Row: ClinicalTrial;
        Insert: ClinicalTrialInsert;
        Update: ClinicalTrialUpdate;
      };
      locations: {
        Row: Location;
        Insert: LocationInsert;
        Update: LocationUpdate;
      };
      education_training: {
        Row: EducationTraining;
        Insert: EducationTrainingInsert;
        Update: EducationTrainingUpdate;
      };
      biography: {
        Row: Biography;
        Insert: BiographyInsert;
        Update: BiographyUpdate;
      };
      media_press: {
        Row: MediaPress;
        Insert: MediaPressInsert;
        Update: MediaPressUpdate;
      };
    };
    Views: {
      // Views for complex queries
      complete_provider_profile: {
        Row: CompleteProviderProfile;
      };
    };
    Functions: {
      // Custom database functions
      [_ in never]: never;
    };
    Enums: {
      user_status: "active" | "inactive" | "pending" | "suspended";
      license_status: "active" | "inactive" | "expired" | "pending";
      publication_type:
        | "peer_reviewed"
        | "book"
        | "chapter"
        | "abstract"
        | "other";
      trial_status:
        | "recruiting"
        | "active"
        | "completed"
        | "suspended"
        | "terminated";
      location_type: "primary" | "secondary" | "affiliated" | "consulting";
      education_type:
        | "undergraduate"
        | "graduate"
        | "medical_school"
        | "residency"
        | "fellowship"
        | "continuing_education";
    };
  };
}

// Base User Profile (from signup flow)
export interface UserProfile {
  id: string;
  created_at: string;
  updated_at: string;

  // Personal Information (from signup step 1)
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;

  // Professional Information (from signup step 2)
  job_title: string;
  organization?: string;
  npi_number: string;

  // User Status
  status: Database["public"]["Enums"]["user_status"];
  email_verified: boolean;

  // Preferences
  preferred_name?: string;
  pronouns?: string;
  languages?: string[];

  // Profile Settings
  profile_photo_url?: string;
  profile_completion_percentage: number;
  last_login_at?: string;

  // Terms & Privacy
  agreed_to_terms: boolean;
  agreed_to_privacy: boolean;
  terms_agreed_at?: string;
  privacy_agreed_at?: string;
}

// NPI Registry Data (from NPI lookup)
export interface NPIData {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  // Core NPI Information
  npi_number: string;
  enumeration_type: string; // NPI-1 (Individual) or NPI-2 (Organization)
  enumeration_date?: string;
  last_updated_npi?: string;
  status: string; // A = Active, etc.

  // Basic Information from NPI
  legal_business_name?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  name_prefix?: string;
  name_suffix?: string;
  credential?: string;
  gender?: string;
  sole_proprietor?: string;

  // Organization Information (for NPI-2)
  organization_name?: string;
  authorized_official_first_name?: string;
  authorized_official_last_name?: string;
  authorized_official_middle_name?: string;
  authorized_official_credential?: string;
  authorized_official_title?: string;
  authorized_official_telephone?: string;

  // Raw NPI Data (for backup)
  raw_npi_data: any; // JSON field with complete NPI response

  // Verification
  is_verified: boolean;
  verified_at?: string;
}

// Professional Identity (comprehensive profile data)
export interface ProfessionalIdentityData {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  // Personal Information
  full_legal_name: string;
  first_name: string;
  last_name: string;
  preferred_name?: string;
  pronouns?: string;
  professional_email: string;

  // Professional Role
  job_title: string;
  department: string;
  division?: string;
  section?: string;

  // Profile Status
  is_complete: boolean;
  last_reviewed_at?: string;
}

// Professional Licenses
export interface ProfessionalLicense {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  license_name: string;
  license_number: string;
  issuing_state: string;
  issuing_authority?: string;
  issue_date?: string;
  expiration_date?: string;
  status: Database["public"]["Enums"]["license_status"];

  // Verification
  is_verified: boolean;
  verification_document_url?: string;
}

// Medical Specialties
export interface MedicalSpecialty {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  specialty_name: string;
  taxonomy_code?: string;
  is_primary: boolean;
  board_certified: boolean;
  certification_date?: string;
  certifying_board?: string;
  recertification_date?: string;
}

// Professional Credentials
export interface ProfessionalCredential {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  credential: string; // MD, DO, RN, etc.
  display_order: number;
  is_verified: boolean;
}

// Profile Sections Metadata
export interface ProfileSectionData {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  section_id: string; // professional_identity, practice_essentials, etc.
  section_name: string;
  is_completed: boolean;
  is_visible: boolean;
  is_required: boolean;
  last_updated_at: string;
  completion_percentage: number;
}

// Practice Essentials
export interface PracticeEssentials {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  practice_name?: string;
  practice_type?: string;
  hospital_affiliations?: string[];
  group_affiliations?: string[];
  telehealth_services: boolean;
  languages_spoken?: string[];
  patient_age_groups?: string[];
  practice_focus?: string[];
}

// Insurance Plans
export interface InsurancePlan {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  insurance_name: string;
  plan_type: string;
  is_accepted: boolean;
  notes?: string;
  verification_status: "verified" | "pending" | "requires_update";
}

// Medical Expertise
export interface MedicalExpertise {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  expertise_area: string;
  description?: string;
  years_of_experience?: number;
  case_volume?: number;
  special_procedures?: string[];
  research_interests?: string[];
}

// Publications
export interface Publication {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  title: string;
  authors: string[];
  journal_name?: string;
  publication_date?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  pmid?: string;
  publication_type: Database["public"]["Enums"]["publication_type"];
  abstract?: string;
  keywords?: string[];
  is_featured: boolean;
}

// Clinical Trials
export interface ClinicalTrial {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  trial_title: string;
  nct_number?: string;
  phase?: string;
  status: Database["public"]["Enums"]["trial_status"];
  start_date?: string;
  completion_date?: string;
  sponsor?: string;
  role: string; // Principal Investigator, Co-Investigator, etc.
  description?: string;
  conditions_studied?: string[];
}

// Locations
export interface Location {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  location_name: string;
  location_type: Database["public"]["Enums"]["location_type"];
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  is_primary: boolean;
  accepts_new_patients: boolean;
  telehealth_available: boolean;
}

// Education & Training
export interface EducationTraining {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  institution_name: string;
  education_type: Database["public"]["Enums"]["education_type"];
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  is_current: boolean;
  gpa?: number;
  honors?: string[];
  description?: string;
}

// Biography
export interface Biography {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  professional_summary: string;
  personal_interests?: string;
  philosophy_of_care?: string;
  awards_honors?: string[];
  memberships?: string[];
  volunteer_work?: string[];
  languages_spoken?: string[];
}

// Media & Press
export interface MediaPress {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;

  title: string;
  media_type:
    | "interview"
    | "article"
    | "podcast"
    | "video"
    | "award"
    | "speaking_engagement"
    | "other";
  publication_source?: string;
  date?: string;
  url?: string;
  description?: string;
  is_featured: boolean;
}

// Complete Provider Profile (view combining all data)
export interface CompleteProviderProfile extends UserProfile {
  npi_data?: NPIData;
  professional_identity?: ProfessionalIdentityData;
  licenses: ProfessionalLicense[];
  specialties: MedicalSpecialty[];
  credentials: ProfessionalCredential[];
  practice_essentials?: PracticeEssentials;
  insurance_plans: InsurancePlan[];
  medical_expertise: MedicalExpertise[];
  publications: Publication[];
  clinical_trials: ClinicalTrial[];
  locations: Location[];
  education_training: EducationTraining[];
  biography?: Biography;
  media_press: MediaPress[];
}

// Insert types (for creating new records)
export type UserProfileInsert = Omit<
  UserProfile,
  "id" | "created_at" | "updated_at"
>;
export type NPIDataInsert = Omit<NPIData, "id" | "created_at" | "updated_at">;
export type ProfessionalIdentityInsert = Omit<
  ProfessionalIdentityData,
  "id" | "created_at" | "updated_at"
>;
export type ProfessionalLicenseInsert = Omit<
  ProfessionalLicense,
  "id" | "created_at" | "updated_at"
>;
export type MedicalSpecialtyInsert = Omit<
  MedicalSpecialty,
  "id" | "created_at" | "updated_at"
>;
export type ProfessionalCredentialInsert = Omit<
  ProfessionalCredential,
  "id" | "created_at" | "updated_at"
>;
export type ProfileSectionInsert = Omit<
  ProfileSectionData,
  "id" | "created_at" | "updated_at"
>;
export type PracticeEssentialsInsert = Omit<
  PracticeEssentials,
  "id" | "created_at" | "updated_at"
>;
export type InsurancePlanInsert = Omit<
  InsurancePlan,
  "id" | "created_at" | "updated_at"
>;
export type MedicalExpertiseInsert = Omit<
  MedicalExpertise,
  "id" | "created_at" | "updated_at"
>;
export type PublicationInsert = Omit<
  Publication,
  "id" | "created_at" | "updated_at"
>;
export type ClinicalTrialInsert = Omit<
  ClinicalTrial,
  "id" | "created_at" | "updated_at"
>;
export type LocationInsert = Omit<Location, "id" | "created_at" | "updated_at">;
export type EducationTrainingInsert = Omit<
  EducationTraining,
  "id" | "created_at" | "updated_at"
>;
export type BiographyInsert = Omit<
  Biography,
  "id" | "created_at" | "updated_at"
>;
export type MediaPressInsert = Omit<
  MediaPress,
  "id" | "created_at" | "updated_at"
>;

// Update types (for updating existing records)
export type UserProfileUpdate = Partial<UserProfileInsert>;
export type NPIDataUpdate = Partial<NPIDataInsert>;
export type ProfessionalIdentityUpdate = Partial<ProfessionalIdentityInsert>;
export type ProfessionalLicenseUpdate = Partial<ProfessionalLicenseInsert>;
export type MedicalSpecialtyUpdate = Partial<MedicalSpecialtyInsert>;
export type ProfessionalCredentialUpdate =
  Partial<ProfessionalCredentialInsert>;
export type ProfileSectionUpdate = Partial<ProfileSectionInsert>;
export type PracticeEssentialsUpdate = Partial<PracticeEssentialsInsert>;
export type InsurancePlanUpdate = Partial<InsurancePlanInsert>;
export type MedicalExpertiseUpdate = Partial<MedicalExpertiseInsert>;
export type PublicationUpdate = Partial<PublicationInsert>;
export type ClinicalTrialUpdate = Partial<ClinicalTrialInsert>;
export type LocationUpdate = Partial<LocationInsert>;
export type EducationTrainingUpdate = Partial<EducationTrainingInsert>;
export type BiographyUpdate = Partial<BiographyInsert>;
export type MediaPressUpdate = Partial<MediaPressInsert>;
