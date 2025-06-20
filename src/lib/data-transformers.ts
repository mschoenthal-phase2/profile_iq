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
