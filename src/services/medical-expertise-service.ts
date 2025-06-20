// Medical Expertise Service
// This service handles all API interactions for medical expertise functionality

import {
  MedicalSpecialty,
  ClinicalExpertise,
  UserProfile,
  UserExpertise,
  SelectedExpertise,
  MedicalExpertiseService,
} from "@/types/medical-expertise";

class MedicalExpertiseServiceImpl implements MedicalExpertiseService {
  // Mock data for specialties (in production, this would be from Supabase)
  private mockSpecialties: MedicalSpecialty[] = [
    { specialty: "Cardiology", specialty_id: 1 },
    { specialty: "Dermatology", specialty_id: 2 },
    { specialty: "Emergency Medicine", specialty_id: 3 },
    { specialty: "Family Medicine", specialty_id: 4 },
    { specialty: "Internal Medicine", specialty_id: 5 },
    { specialty: "Neurology", specialty_id: 6 },
    { specialty: "Obstetrics & Gynecology", specialty_id: 7 },
    { specialty: "Oncology", specialty_id: 8 },
    { specialty: "Orthopedic Surgery", specialty_id: 9 },
    { specialty: "Pediatrics", specialty_id: 10 },
    { specialty: "Psychiatry", specialty_id: 11 },
    { specialty: "Radiology", specialty_id: 12 },
    { specialty: "Surgery", specialty_id: 13 },
    { specialty: "Urology", specialty_id: 14 },
  ];

  // Mock clinical expertise data (in production, this would be populated from CSV data)
  private mockClinicalExpertise: ClinicalExpertise[] = [
    // Cardiology examples
    {
      id: "ce_1",
      term_id: "CARD_C001",
      term: "Coronary Artery Disease",
      specialty: "Cardiology",
      term_type: "Condition",
      specialty_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_2",
      term_id: "CARD_C002",
      term: "Heart Failure",
      specialty: "Cardiology",
      term_type: "Condition",
      specialty_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_3",
      term_id: "CARD_C003",
      term: "Atrial Fibrillation",
      specialty: "Cardiology",
      term_type: "Condition",
      specialty_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_4",
      term_id: "CARD_P001",
      term: "Cardiac Catheterization",
      specialty: "Cardiology",
      term_type: "Procedure",
      specialty_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_5",
      term_id: "CARD_P002",
      term: "Echocardiogram",
      specialty: "Cardiology",
      term_type: "Procedure",
      specialty_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_6",
      term_id: "CARD_R001",
      term: "Chest Pain",
      specialty: "Cardiology",
      term_type: "Reason for Visit",
      specialty_id: 1,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_7",
      term_id: "CARD_R002",
      term: "Palpitations",
      specialty: "Cardiology",
      term_type: "Reason for Visit",
      specialty_id: 1,
      created_at: new Date().toISOString(),
    },

    // Family Medicine examples
    {
      id: "ce_8",
      term_id: "FAM_C001",
      term: "Diabetes Mellitus Type 2",
      specialty: "Family Medicine",
      term_type: "Condition",
      specialty_id: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_9",
      term_id: "FAM_C002",
      term: "Hypertension",
      specialty: "Family Medicine",
      term_type: "Condition",
      specialty_id: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_10",
      term_id: "FAM_C003",
      term: "Upper Respiratory Infection",
      specialty: "Family Medicine",
      term_type: "Condition",
      specialty_id: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_11",
      term_id: "FAM_P001",
      term: "Annual Physical Exam",
      specialty: "Family Medicine",
      term_type: "Procedure",
      specialty_id: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_12",
      term_id: "FAM_P002",
      term: "Immunizations",
      specialty: "Family Medicine",
      term_type: "Procedure",
      specialty_id: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_13",
      term_id: "FAM_R001",
      term: "Routine Checkup",
      specialty: "Family Medicine",
      term_type: "Reason for Visit",
      specialty_id: 4,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_14",
      term_id: "FAM_R002",
      term: "Fever",
      specialty: "Family Medicine",
      term_type: "Reason for Visit",
      specialty_id: 4,
      created_at: new Date().toISOString(),
    },

    // Dermatology examples
    {
      id: "ce_15",
      term_id: "DERM_C001",
      term: "Acne Vulgaris",
      specialty: "Dermatology",
      term_type: "Condition",
      specialty_id: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_16",
      term_id: "DERM_C002",
      term: "Eczema",
      specialty: "Dermatology",
      term_type: "Condition",
      specialty_id: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_17",
      term_id: "DERM_P001",
      term: "Skin Biopsy",
      specialty: "Dermatology",
      term_type: "Procedure",
      specialty_id: 2,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_18",
      term_id: "DERM_R001",
      term: "Skin Rash",
      specialty: "Dermatology",
      term_type: "Reason for Visit",
      specialty_id: 2,
      created_at: new Date().toISOString(),
    },

    // Pediatrics examples
    {
      id: "ce_19",
      term_id: "PED_C001",
      term: "Asthma",
      specialty: "Pediatrics",
      term_type: "Condition",
      specialty_id: 10,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_20",
      term_id: "PED_C002",
      term: "ADHD",
      specialty: "Pediatrics",
      term_type: "Condition",
      specialty_id: 10,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_21",
      term_id: "PED_P001",
      term: "Well Child Visit",
      specialty: "Pediatrics",
      term_type: "Procedure",
      specialty_id: 10,
      created_at: new Date().toISOString(),
    },
    {
      id: "ce_22",
      term_id: "PED_R001",
      term: "Developmental Concerns",
      specialty: "Pediatrics",
      term_type: "Reason for Visit",
      specialty_id: 10,
      created_at: new Date().toISOString(),
    },
  ];

  async getSpecialties(): Promise<MedicalSpecialty[]> {
    // Simulate API delay
    await this.delay(500);
    return this.mockSpecialties;
  }

  async getItemsBySpecialtyAndType(
    specialty: string,
    termType: string,
  ): Promise<ClinicalExpertise[]> {
    // Simulate API delay
    await this.delay(300);
    return this.mockClinicalExpertise.filter(
      (item) => item.specialty === specialty && item.term_type === termType,
    );
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    // Simulate API delay
    await this.delay(300);

    // Check localStorage for saved profile (in production, this would be Supabase)
    const savedProfile = localStorage.getItem(`userProfile_${userId}`);
    if (savedProfile) {
      return JSON.parse(savedProfile);
    }

    return null;
  }

  async upsertUserProfile(
    profileData: Partial<UserProfile>,
  ): Promise<UserProfile> {
    // Simulate API delay
    await this.delay(500);

    const now = new Date().toISOString();
    const profile: UserProfile = {
      id: profileData.id || `profile_${Date.now()}`,
      user_id: profileData.user_id || "mock_user_id",
      email: profileData.email,
      full_name: profileData.full_name,
      specialty: profileData.specialty,
      specialty_id: profileData.specialty_id,
      profile_completed: profileData.profile_completed || false,
      created_at: profileData.created_at || now,
      updated_at: now,
      ...profileData,
    };

    // Save to localStorage (in production, this would be Supabase)
    localStorage.setItem(
      `userProfile_${profile.user_id}`,
      JSON.stringify(profile),
    );

    return profile;
  }

  async getUserExpertise(userProfileId: string): Promise<UserExpertise[]> {
    // Simulate API delay
    await this.delay(300);

    // Check localStorage for saved expertise (in production, this would be Supabase)
    const savedExpertise = localStorage.getItem(
      `userExpertise_${userProfileId}`,
    );
    if (savedExpertise) {
      const expertise = JSON.parse(savedExpertise);
      // Enrich with clinical expertise data
      return expertise.map((exp: UserExpertise) => ({
        ...exp,
        clinical_expertise: this.mockClinicalExpertise.find(
          (ce) => ce.term_id === exp.term_id,
        ),
      }));
    }

    return [];
  }

  async saveUserExpertise(
    userProfileId: string,
    selectedItems: SelectedExpertise,
  ): Promise<void> {
    // Simulate API delay
    await this.delay(800);

    // Prepare data for storage
    const expertiseData: UserExpertise[] = [];

    // Add conditions
    selectedItems.conditions.forEach((termId) => {
      expertiseData.push({
        id: `exp_${termId}_${Date.now()}`,
        user_profile_id: userProfileId,
        term_id: termId,
        term_type: "Condition",
        created_at: new Date().toISOString(),
      });
    });

    // Add procedures
    selectedItems.procedures.forEach((termId) => {
      expertiseData.push({
        id: `exp_${termId}_${Date.now()}`,
        user_profile_id: userProfileId,
        term_id: termId,
        term_type: "Procedure",
        created_at: new Date().toISOString(),
      });
    });

    // Add reasons for visit
    selectedItems.reasonsForVisit.forEach((termId) => {
      expertiseData.push({
        id: `exp_${termId}_${Date.now()}`,
        user_profile_id: userProfileId,
        term_id: termId,
        term_type: "Reason for Visit",
        created_at: new Date().toISOString(),
      });
    });

    // Save to localStorage (in production, this would be Supabase)
    localStorage.setItem(
      `userExpertise_${userProfileId}`,
      JSON.stringify(expertiseData),
    );
  }

  // Utility method to simulate API delays
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Method to validate selected expertise
  validateExpertise(selectedItems: SelectedExpertise): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    const totalItems =
      selectedItems.conditions.length +
      selectedItems.procedures.length +
      selectedItems.reasonsForVisit.length;

    if (totalItems === 0) {
      errors.push("Please select at least one area of expertise");
    }

    if (totalItems > 50) {
      warnings.push(
        "Consider limiting your selections to your primary areas of expertise",
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Method to get expertise statistics
  getExpertiseStats(selectedItems: SelectedExpertise, specialty?: string) {
    return {
      totalSpecialties: specialty ? 1 : 0,
      selectedSpecialty: specialty || null,
      totalConditions: selectedItems.conditions.length,
      totalProcedures: selectedItems.procedures.length,
      totalReasonsForVisit: selectedItems.reasonsForVisit.length,
      totalItems:
        selectedItems.conditions.length +
        selectedItems.procedures.length +
        selectedItems.reasonsForVisit.length,
      lastUpdated: new Date(),
    };
  }
}

// Export singleton instance
export const medicalExpertiseService = new MedicalExpertiseServiceImpl();
