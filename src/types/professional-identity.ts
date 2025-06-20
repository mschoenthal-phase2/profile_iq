// Professional Identity Types
// This defines the data structures for professional identity functionality

export interface ProfessionalIdentityLicense {
  id: string;
  name: string;
  licenseNumber: string;
  state: string;
  status: "active" | "inactive";
  issueDate?: Date;
  expirationDate?: Date;
  issuingAuthority?: string;
}

export interface ProfessionalIdentitySpecialty {
  name: string;
  type: "primary" | "additional";
  taxonomyCode?: string;
  boardCertified?: boolean;
  certifyingBoard?: string;
}

export interface ProfessionalIdentityData {
  profilePhoto?: string;
  fullLegalName: string;
  npiNumber: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  pronouns: string;
  professionalEmail: string;
  licenses: ProfessionalIdentityLicense[];
  primarySpecialties: string[];
  additionalSpecialties: string[];
  jobTitle: string;
  department: string;
  division: string;
  section: string;
  credentials: string[];
}

// Form validation
export interface ProfessionalIdentityValidation {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: string[];
}

// Service layer interfaces
export interface ProfessionalIdentityService {
  getLicenses(userId: string): Promise<ProfessionalIdentityLicense[]>;
  addLicense(
    userId: string,
    license: Omit<ProfessionalIdentityLicense, "id">,
  ): Promise<ProfessionalIdentityLicense>;
  updateLicense(
    licenseId: string,
    updates: Partial<ProfessionalIdentityLicense>,
  ): Promise<ProfessionalIdentityLicense>;
  deleteLicense(licenseId: string): Promise<void>;

  getSpecialties(userId: string): Promise<ProfessionalIdentitySpecialty[]>;
  addSpecialty(
    userId: string,
    specialty: ProfessionalIdentitySpecialty,
  ): Promise<void>;
  removeSpecialty(userId: string, specialtyName: string): Promise<void>;
}

// Export types for form data
export type ProfessionalIdentityInsert = Omit<
  ProfessionalIdentityData,
  "id" | "created_at" | "updated_at"
>;
export type ProfessionalIdentityUpdate = Partial<ProfessionalIdentityInsert>;
