export interface Publication {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  publicationDate: Date;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  pmid?: string;
  abstract?: string;
  keywords: string[];
  publicationType: PublicationType;
  isVisible: boolean;
  isSelected: boolean;
  status: PublicationStatus;
  addedAt: Date;
  lastModified: Date;
}

export type PublicationType =
  | "peer_reviewed"
  | "book"
  | "chapter"
  | "abstract"
  | "review"
  | "case_report"
  | "editorial"
  | "other";

export type PublicationStatus =
  | "pending" // Newly discovered, awaiting user review
  | "approved" // User has approved for profile
  | "rejected" // User has rejected
  | "manual" // Manually added by user
  | "hidden"; // Approved but hidden from public view

export interface PubMedArticle {
  pmid: string;
  title: string;
  authors: PubMedAuthor[];
  journal: string;
  pubDate: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  abstract?: string;
  keywords: string[];
  publicationType: string[];
  affiliations: string[];
}

export interface PubMedAuthor {
  lastName: string;
  foreName: string;
  initials: string;
  affiliations: string[];
}

export interface PubMedSearchResult {
  articles: PubMedArticle[];
  totalCount: number;
  queryKey: string;
  webEnv: string;
}

export interface PublicationDiscoveryResult {
  searchQuery: string;
  searchDate: Date;
  totalFound: number;
  publications: Publication[];
  suggestedKeywords: string[];
}

export interface PublicationFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  publicationType?: PublicationType[];
  journal?: string[];
  status?: PublicationStatus[];
  keywords?: string[];
}

export interface PublicationManagementState {
  publications: Publication[];
  discoveryResults: PublicationDiscoveryResult | null;
  isSearching: boolean;
  searchError: string | null;
  isLoading: boolean;
  filters: PublicationFilters;
  manualPmidInput: string;
  isLookingUpPmid: boolean;
  pmidLookupError: string | null;
}
