import {
  UserProfileInsert,
  NPIDataInsert,
  CompleteProviderProfile,
} from "@/types/database";

/**
 * Transform signup data to user profile format for database insertion
 */
export function transformSignupDataToUserProfile(
  signupData: any,
): UserProfileInsert {
  return {
    full_name: signupData.fullName,
    email: signupData.email,
    job_title: signupData.jobTitle,
    organization: signupData.organization,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Transform NPI provider data to database format
 */
export function transformNPIProviderToNPIData(npiProvider: any): NPIDataInsert {
  const primaryAddress = npiProvider.addresses?.[0];
  const primaryTaxonomy = npiProvider.taxonomies?.[0];

  return {
    npi_number: npiProvider.number,
    first_name: npiProvider.basic?.first_name,
    last_name: npiProvider.basic?.last_name,
    credential: npiProvider.basic?.credential,
    gender: npiProvider.basic?.gender,
    enumeration_date: npiProvider.basic?.enumeration_date,
    last_updated: npiProvider.basic?.last_updated,
    status: npiProvider.basic?.status,
    primary_address: primaryAddress
      ? {
          address_1: primaryAddress.address_1,
          address_2: primaryAddress.address_2,
          city: primaryAddress.city,
          state: primaryAddress.state,
          postal_code: primaryAddress.postal_code,
          country_code: primaryAddress.country_code,
          telephone_number: primaryAddress.telephone_number,
        }
      : undefined,
    primary_taxonomy: primaryTaxonomy
      ? {
          code: primaryTaxonomy.code,
          description: primaryTaxonomy.desc,
          primary: primaryTaxonomy.primary,
          state: primaryTaxonomy.state,
          license: primaryTaxonomy.license,
        }
      : undefined,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Transform complete signup data for batch operations
 */
export function transformCompleteSignupData(
  signupData: any,
  npiProvider: any,
  professionalIdentityData?: any,
): {
  userProfile: UserProfileInsert;
  npiData: NPIDataInsert;
  professionalIdentity?: any;
  licenses?: any[];
  specialties?: any[];
  credentials?: any[];
} {
  const userProfile = transformSignupDataToUserProfile(signupData);
  const npiData = transformNPIProviderToNPIData(npiProvider);

  return {
    userProfile,
    npiData,
    professionalIdentity: professionalIdentityData,
    licenses:
      npiProvider.taxonomies?.map((taxonomy: any) => ({
        license_number: taxonomy.license,
        state: taxonomy.state,
        status: "active",
        created_at: new Date().toISOString(),
      })) || [],
    specialties:
      npiProvider.taxonomies?.map((taxonomy: any) => ({
        name: taxonomy.desc,
        code: taxonomy.code,
        is_primary: taxonomy.primary,
        created_at: new Date().toISOString(),
      })) || [],
    credentials: npiProvider.basic?.credential
      ? [
          {
            type: "degree",
            value: npiProvider.basic.credential,
            verified: true,
            created_at: new Date().toISOString(),
          },
        ]
      : [],
  };
}

/**
 * Validate user profile data before database insertion
 */
export function validateUserProfileData(data: UserProfileInsert): string[] {
  const errors: string[] = [];

  if (!data.full_name || data.full_name.trim().length === 0) {
    errors.push("Full name is required");
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    errors.push("Email format is invalid");
  }

  if (!data.job_title || data.job_title.trim().length === 0) {
    errors.push("Job title is required");
  }

  return errors;
}

/**
 * Validate NPI data before database insertion
 */
export function validateNPIData(data: NPIDataInsert): string[] {
  const errors: string[] = [];

  if (!data.npi_number || data.npi_number.trim().length === 0) {
    errors.push("NPI number is required");
  } else if (!/^\d{10}$/.test(data.npi_number)) {
    errors.push("NPI number must be exactly 10 digits");
  }

  if (!data.first_name || data.first_name.trim().length === 0) {
    errors.push("First name is required");
  }

  if (!data.last_name || data.last_name.trim().length === 0) {
    errors.push("Last name is required");
  }

  return errors;
}

/**
 * Validate complete profile data
 */
export function validateCompleteProfile(
  profile: CompleteProviderProfile,
): string[] {
  const errors: string[] = [];

  // Add comprehensive validation logic here
  if (!profile.personal_info?.full_name) {
    errors.push("Personal information is incomplete");
  }

  if (!profile.npi_data?.npi_number) {
    errors.push("NPI data is required");
  }

  return errors;
}

/**
 * Sanitize input data to prevent potential security issues
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .substring(0, 1000); // Limit length
}

/**
 * Transform database profile to display format
 */
export function transformProfileForDisplay(
  dbProfile: any,
): CompleteProviderProfile {
  return {
    personal_info: {
      id: dbProfile.id,
      full_name: dbProfile.full_name,
      email: dbProfile.email,
      job_title: dbProfile.job_title,
      organization: dbProfile.organization,
      created_at: dbProfile.created_at,
      updated_at: dbProfile.updated_at,
    },
    npi_data: dbProfile.npi_data || {},
    professional_identity: dbProfile.professional_identity || {},
    locations: dbProfile.locations || [],
    education_training: dbProfile.education_training || [],
    practice_essentials: dbProfile.practice_essentials || {},
    medical_expertise: dbProfile.medical_expertise || {},
    publications: dbProfile.publications || [],
    clinical_trials: dbProfile.clinical_trials || [],
    media_press: dbProfile.media_press || [],
    biography: dbProfile.biography || {},
  };
}
