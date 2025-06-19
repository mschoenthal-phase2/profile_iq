// NPI API utilities
export async function searchNPIProviders(query) {
  try {
    const response = await fetch(
      `https://npiregistry.cms.hhs.gov/api/?version=2.1&search_type=1&name=${encodeURIComponent(query)}&limit=10`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch NPI data');
    }
    
    const data = await response.json();
    
    if (!data.results) {
      return [];
    }
    
    return data.results.map(function(result) {
      return {
        npi: result.number,
        name: result.basic.first_name + ' ' + result.basic.last_name,
        specialty: result.taxonomies && result.taxonomies[0] ? result.taxonomies[0].desc : 'Unknown',
        address: result.addresses && result.addresses[0] ? result.addresses[0].city + ', ' + result.addresses[0].state : 'Unknown'
      };
    });
  } catch (error) {
    console.error('Error fetching NPI data:', error);
    return [];
  }
}

export function validateNPI(npi) {
  if (!npi || typeof npi !== 'string') {
    return false;
  }
  
  // Check if it's exactly 10 digits
  if (!/^\d{10}$/.test(npi)) {
    return false;
  }
  
  return true;
}
