// NPI (National Provider Identifier) API utilities

export async function searchNPIProviders(query) {
  try {
    const response = await fetch(
      `https://npiregistry.cms.hhs.gov/api/?version=2.1&search_type=1&name=${encodeURIComponent(query)}&limit=10`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch NPI data');
    }
    
    const data = await response.json();
    
    return data.results?.map((result) => ({
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

export function validateNPI(npi) {
  // Basic NPI validation - should be 10 digits
  if (!/^\d{10}$/.test(npi)) {
    return false;
  }
  
  // Luhn algorithm check for NPI
  const digits = npi.split('').map(Number);
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    let digit = digits[i];
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit = Math.floor(digit / 10) + (digit % 10);
      }
    }
    sum += digit;
  }
  
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === digits[9];
}
