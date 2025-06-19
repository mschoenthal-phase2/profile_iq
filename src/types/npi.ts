export interface NPIAddress {
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  postal_code: string;
  country_code: string;
  country_name: string;
  address_purpose: string;
  address_type: string;
  telephone_number?: string;
  fax_number?: string;
}

export interface NPIBasic {
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  credential?: string;
  sole_proprietor?: string;
  gender?: string;
  enumeration_date?: string;
  last_updated?: string;
  status?: string;
  name?: string; // For organizations
  name_prefix?: string;
  name_suffix?: string;
  authorized_official_credential?: string;
  authorized_official_first_name?: string;
  authorized_official_last_name?: string;
  authorized_official_middle_name?: string;
  authorized_official_name_prefix?: string;
  authorized_official_name_suffix?: string;
  authorized_official_telephone_number?: string;
  authorized_official_title_or_position?: string;
}

export interface NPITaxonomy {
  code: string;
  desc: string;
  primary: boolean;
  state?: string;
  license?: string;
  taxonomy_group?: string;
}

export interface NPIProvider {
  number: string;
  enumeration_type: string;
  basic: NPIBasic;
  addresses: NPIAddress[];
  taxonomies: NPITaxonomy[];
  identifiers?: any[];
  endpoints?: any[];
  created_epoch: number;
  last_updated_epoch: number;
}

export interface NPIApiResponse {
  result_count: number;
  results: NPIProvider[];
}

export interface NPILookupError {
  message: string;
  details?: string;
}
