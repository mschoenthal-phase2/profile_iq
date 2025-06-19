import { NPIApiResponse, NPIProvider, NPILookupError } from "@/types/npi";

const NPI_REGISTRY_API_URL = "https://npiregistry.cms.hhs.gov/api";

export class NPIApiClient {
  private static instance: NPIApiClient;
  private baseUrl: string;

  private constructor() {
    this.baseUrl = NPI_REGISTRY_API_URL;
  }

  public static getInstance(): NPIApiClient {
    if (!NPIApiClient.instance) {
      NPIApiClient.instance = new NPIApiClient();
    }
    return NPIApiClient.instance;
  }

  /**
   * Search for providers by NPI number
   */
  async searchByNPI(npiNumber: string): Promise{
    try {
      if (!this.isValidNPI(npiNumber)) {
        throw new Error("Invalid NPI number format");
      }

      const response = await fetch(
        `${this.baseUrl}/?number=${npiNumber}&version=2.1`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NPIApiResponse = await response.json();

      if (data.result_count === 0) {
        return null;
      }

      return data.results[0];
    } catch (error) {
      console.error("Error searching by NPI:", error);
      throw this.createLookupError(error);
    }
  }

  /**
   * Search for providers by name and location
   */
  async searchByName(
    firstName?: string,
    lastName?: string,
    organizationName?: string,
    city?: string,
    state?: string,
    limit: number = 20,
  ): Promise{
    try {
      const params = new URLSearchParams();
      params.append("version", "2.1");
      params.append("limit", limit.toString());

      if (firstName) params.append("first_name", firstName);
      if (lastName) params.append("last_name", lastName);
      if (organizationName)
        params.append("organization_name", organizationName);
      if (city) params.append("city", city);
      if (state) params.append("state", state);

      const response = await fetch(`${this.baseUrl}/?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NPIApiResponse = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error searching by name:", error);
      throw this.createLookupError(error);
    }
  }

  /**
   * Search for providers by taxonomy (specialty)
   */
  async searchByTaxonomy(
    taxonomyDescription: string,
    city?: string,
    state?: string,
    limit: number = 20,
  ): Promise{
    try {
      const params = new URLSearchParams();
      params.append("version", "2.1");
      params.append("taxonomy_description", taxonomyDescription);
      params.append("limit", limit.toString());

      if (city) params.append("city", city);
      if (state) params.append("state", state);

      const response = await fetch(`${this.baseUrl}/?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NPIApiResponse = await response.json();
      return data.results || [];
    } catch (error) {
      console.error("Error searching by taxonomy:", error);
      throw this.createLookupError(error);
    }
  }

  /**
   * Validates NPI number format (10-digit number)
   */
  isValidNPI(npi: string): boolean {
    // Remove any non-digits
    const cleanNPI = npi.replace(/\D/g, "");

    // Must be exactly 10 digits
    if (cleanNPI.length !== 10) {
      return false;
    }

    // Optional: Validate using Luhn algorithm for NPI
    return this.validateNPILuhn(cleanNPI);
  }

  /**
   * Validates NPI using Luhn algorithm
   */
  private validateNPILuhn(npi: string): boolean {
    const digits = npi.split("").map(Number);
    let sum = 0;

    for (let i = 0; i9) {
          digit = Math.floor(digit / 10) + (digit % 10);
        }
      }
      sum += digit;
    }

    const checkDigit = (10 - (sum % 10)) % 10;
    return checkDigit === digits[9];
  }

  /**
   * Formats NPI number for display
   */
  formatNPI(npi: string): string {
    const cleanNPI = npi.replace(/\D/g, "");
    if (cleanNPI.length === 10) {
      return cleanNPI.replace(/(\d{4})(\d{3})(\d{3})/, "$1-$2-$3");
    }
    return npi;
  }

  /**
   * Creates a standardized lookup error
   */
  private createLookupError(error: any): NPILookupError {
    if (error instanceof Error) {
      return {
        message: error.message,
        details: error.stack,
      };
    }

    return {
      message: "An unexpected error occurred during NPI lookup",
      details: String(error),
    };
  }

  /**
   * Gets the primary practice address for a provider
   */
  getPrimaryAddress(provider: NPIProvider) {
    return (
      provider.addresses?.find(
        (addr) =>
          addr.address_purpose?.toLowerCase() === "practice" ||
          addr.address_purpose?.toLowerCase() === "location",
      ) || provider.addresses?.[0]
    );
  }

  /**
   * Gets the primary taxonomy (specialty) for a provider
   */
  getPrimaryTaxonomy(provider: NPIProvider) {
    return (
      provider.taxonomies?.find((tax) => tax.primary) ||
      provider.taxonomies?.[0]
    );
  }

  /**
   * Gets the provider's full name
   */
  getProviderName(provider: NPIProvider): string {
    const { basic } = provider;

    if (provider.enumeration_type === "NPI-1") {
      // Individual provider
      const parts = [
        basic.name_prefix,
        basic.first_name,
        basic.middle_name,
        basic.last_name,
        basic.name_suffix,
        basic.credential,
      ].filter(Boolean);

      return parts.join(" ");
    } else {
      // Organization
      return basic.name || "Unknown Organization";
    }
  }
}

// Export a singleton instance
export const npiApiClient = NPIApiClient.getInstance();
