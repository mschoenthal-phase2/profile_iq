// NPI (National Provider Identifier) API utilities
export interface NPIProvider {
  npi: string;
  name: string;
  specialty: string;
  address: string;
}

export async function searchNPIProviders(query: string): Promise<NPIProvider[]> {
  try {
    const response = await fetch(
      `https://npiregistry.cms.hhs.gov/api/?version=2.1&search_type=1&name=${encodeURIComponent(query)}&limit=10`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch NPI data');
    }
    
    const data = await response.json();
    
    return data.results?.map((result: any) => ({
      npi: result.number,
      name: `${result.basic.first_name} ${result.basic.last_name}`,
      specialty: result.taxonomies?.[0]?.desc || 'Unknown',
      address: `${result.addresses?.[0]?.city}, ${result.addresses?.[0]?.state}`
    })) || [];
  } catch (error) {
    console.error('Error fetching NPI data:', error);
    return [];
  }
}

export function validateNPI(npi: string): boolean {
  // Basic NPI validation - should be 10 digits
  return /^\d{10}$/.test(npi);
}
