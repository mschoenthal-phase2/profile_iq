export interface MediaArticle {
  id: string;
  url: string;
  title: string;
  description?: string;
  publishedDate?: Date;
  author?: string;
  publication: string;
  mediaType: MediaType;
  imageUrl?: string;
  tags: string[];
  excerpt?: string;
  wordCount?: number;
  isVisible: boolean;
  isSelected: boolean;
  status: MediaStatus;
  addedAt: Date;
  lastModified: Date;
  userNotes?: string;
  isFeatured: boolean;
}

export type MediaType =
  | "news_article"
  | "interview"
  | "podcast"
  | "video"
  | "blog_post"
  | "press_release"
  | "profile"
  | "opinion"
  | "other";

export type MediaStatus =
  | "pending" // Newly added, awaiting user review
  | "approved" // User has approved for profile
  | "rejected" // User has rejected
  | "manual" // Manually added by user
  | "hidden"; // Approved but hidden from public view

export interface URLMetadata {
  url: string;
  title?: string;
  description?: string;
  author?: string;
  publishedDate?: string;
  siteName?: string;
  imageUrl?: string;
  favicon?: string;
  tags?: string[];
  excerpt?: string;
  wordCount?: number;
  type?: string;
}

export interface MediaDiscoveryResult {
  searchQuery: string;
  searchDate: Date;
  totalFound: number;
  articles: MediaArticle[];
  suggestedSources: string[];
}

export interface MediaFilters {
  mediaType?: MediaType[];
  status?: MediaStatus[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  publication?: string[];
  tags?: string[];
  featured?: boolean;
}

export interface MediaManagementState {
  articles: MediaArticle[];
  discoveryResults: MediaDiscoveryResult | null;
  isSearching: boolean;
  searchError: string | null;
  isLoading: boolean;
  filters: MediaFilters;
  manualUrlInput: string;
  isLookingUpUrl: boolean;
  urlLookupError: string | null;
}

export const MEDIA_TYPES = [
  { value: "news_article", label: "News Article" },
  { value: "interview", label: "Interview" },
  { value: "podcast", label: "Podcast" },
  { value: "video", label: "Video" },
  { value: "blog_post", label: "Blog Post" },
  { value: "press_release", label: "Press Release" },
  { value: "profile", label: "Profile" },
  { value: "opinion", label: "Opinion/Editorial" },
  { value: "other", label: "Other" },
];

export const MEDIA_STATUS_LABELS = {
  pending: "Pending Review",
  approved: "Approved",
  rejected: "Rejected",
  manual: "Manual Entry",
  hidden: "Hidden",
};

export const COMMON_PUBLICATIONS = [
  "The New York Times",
  "The Wall Street Journal",
  "The Washington Post",
  "CNN",
  "BBC",
  "Reuters",
  "Associated Press",
  "Forbes",
  "Bloomberg",
  "Time Magazine",
  "Newsweek",
  "USA Today",
  "NPR",
  "PBS",
  "ABC News",
  "NBC News",
  "CBS News",
  "Fox News",
  "The Guardian",
  "Financial Times",
  "Harvard Business Review",
  "MIT Technology Review",
  "Scientific American",
  "Nature",
  "STAT News",
  "Medscape",
  "WebMD",
  "Health Affairs",
  "Modern Healthcare",
  "Becker's Hospital Review",
];
