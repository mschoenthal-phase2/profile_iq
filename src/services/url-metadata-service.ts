import { URLMetadata } from "@/types/media-press";

/**
 * URL Metadata Service
 * Extracts metadata from URLs using various techniques
 */
class URLMetadataService {
  /**
   * Extract metadata from a URL
   */
  async extractMetadata(url: string): Promise<URLMetadata> {
    try {
      // Validate URL
      const validatedUrl = this.validateAndNormalizeUrl(url);

      // For demo purposes, we'll create mock metadata
      // In production, this would use a proper metadata extraction service
      return this.extractMetadataDemo(validatedUrl);

      // Real implementation would use one of these approaches:
      // 1. Server-side proxy to avoid CORS issues
      // 2. Third-party service like Mercury API, Diffbot, or Embedly
      // 3. Custom backend endpoint that handles the scraping

      /*
      // Example using a hypothetical backend endpoint:
      const response = await fetch('/api/extract-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: validatedUrl })
      });
      
      if (!response.ok) {
        throw new Error(`Metadata extraction failed: ${response.statusText}`);
      }
      
      return await response.json();
      */
    } catch (error) {
      console.error("Error extracting URL metadata:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to extract metadata from URL",
      );
    }
  }

  /**
   * Demo implementation that creates realistic metadata
   */
  private extractMetadataDemo(url: string): URLMetadata {
    const domain = this.extractDomain(url);
    const path = new URL(url).pathname;

    // Generate realistic metadata based on the domain and URL structure
    const metadata: URLMetadata = {
      url,
      siteName: this.getSiteNameFromDomain(domain),
      favicon: `https://${domain}/favicon.ico`,
      type: "article",
    };

    // Generate title and description based on domain patterns
    if (domain.includes("nytimes.com")) {
      metadata.title =
        "Leading Healthcare Innovation: A Doctor's Journey in Modern Medicine";
      metadata.description =
        "Dr. Sarah Johnson discusses the latest advances in personalized medicine and her groundbreaking research in genomic therapy.";
      metadata.author = "Health Desk";
      metadata.publishedDate = this.getRandomRecentDate();
      metadata.imageUrl =
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop";
      metadata.tags = ["Healthcare", "Innovation", "Medicine", "Research"];
      metadata.excerpt =
        "In an exclusive interview, Dr. Johnson shares insights into the future of healthcare...";
      metadata.wordCount = 1200;
    } else if (domain.includes("cnn.com")) {
      metadata.title =
        "Medical Expert Weighs in on Latest Healthcare Policy Changes";
      metadata.description =
        "Local physician provides expert analysis on the implications of new healthcare legislation for patients and providers.";
      metadata.author = "Medical Correspondent";
      metadata.publishedDate = this.getRandomRecentDate();
      metadata.imageUrl =
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop";
      metadata.tags = ["Healthcare Policy", "Medicine", "Expert Opinion"];
      metadata.excerpt =
        "As healthcare policy continues to evolve, medical professionals are adapting...";
      metadata.wordCount = 800;
    } else if (domain.includes("forbes.com")) {
      metadata.title =
        "The Business of Healthcare: How Technology is Transforming Patient Care";
      metadata.description =
        "Industry leaders discuss the intersection of technology and healthcare delivery in today's market.";
      metadata.author = "Business Reporter";
      metadata.publishedDate = this.getRandomRecentDate();
      metadata.imageUrl =
        "https://images.unsplash.com/photo-1504813184591-01572f98c85f?w=800&h=400&fit=crop";
      metadata.tags = ["Business", "Healthcare Technology", "Innovation"];
      metadata.excerpt =
        "The healthcare industry is experiencing unprecedented transformation...";
      metadata.wordCount = 1500;
    } else if (domain.includes("npr.org")) {
      metadata.title =
        "In Their Own Words: Healthcare Workers on the Front Lines";
      metadata.description =
        "A candid conversation with healthcare professionals about their experiences and perspectives on modern medicine.";
      metadata.author = "Health Reporter";
      metadata.publishedDate = this.getRandomRecentDate();
      metadata.imageUrl =
        "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=400&fit=crop";
      metadata.tags = ["Healthcare", "Interview", "Front Lines"];
      metadata.excerpt =
        "Healthcare workers share their stories and insights from the field...";
      metadata.wordCount = 900;
    } else {
      // Generic fallback
      metadata.title = "Healthcare Professional Featured in Media Coverage";
      metadata.description =
        "Medical expert provides insights and expertise in latest media appearance.";
      metadata.author = "Staff Writer";
      metadata.publishedDate = this.getRandomRecentDate();
      metadata.imageUrl =
        "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=800&h=400&fit=crop";
      metadata.tags = ["Healthcare", "Medical Expert", "Media"];
      metadata.excerpt =
        "In this feature, medical professionals discuss current trends...";
      metadata.wordCount = 750;
    }

    return metadata;
  }

  /**
   * Validate and normalize URL
   */
  private validateAndNormalizeUrl(url: string): string {
    try {
      // Add protocol if missing
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }

      const urlObj = new URL(url);

      // Basic validation
      if (!urlObj.hostname) {
        throw new Error("Invalid URL: No hostname found");
      }

      return urlObj.toString();
    } catch (error) {
      throw new Error("Invalid URL format. Please enter a valid web address.");
    }
  }

  /**
   * Extract domain from URL
   */
  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname.toLowerCase();
    } catch {
      return "";
    }
  }

  /**
   * Get site name from domain
   */
  private getSiteNameFromDomain(domain: string): string {
    const siteNames: Record<string, string> = {
      "nytimes.com": "The New York Times",
      "wsj.com": "The Wall Street Journal",
      "washingtonpost.com": "The Washington Post",
      "cnn.com": "CNN",
      "bbc.com": "BBC",
      "reuters.com": "Reuters",
      "forbes.com": "Forbes",
      "bloomberg.com": "Bloomberg",
      "npr.org": "NPR",
      "pbs.org": "PBS",
      "abcnews.go.com": "ABC News",
      "nbcnews.com": "NBC News",
      "cbsnews.com": "CBS News",
      "foxnews.com": "Fox News",
      "theguardian.com": "The Guardian",
      "ft.com": "Financial Times",
      "statnews.com": "STAT News",
      "medscape.com": "Medscape",
      "webmd.com": "WebMD",
    };

    // Check for exact matches
    if (siteNames[domain]) {
      return siteNames[domain];
    }

    // Check for partial matches (e.g., www.nytimes.com)
    for (const [key, value] of Object.entries(siteNames)) {
      if (domain.includes(key) || key.includes(domain.replace("www.", ""))) {
        return value;
      }
    }

    // Fallback: Capitalize first letter of domain
    const siteName = domain.replace("www.", "").split(".")[0];
    return siteName.charAt(0).toUpperCase() + siteName.slice(1);
  }

  /**
   * Generate a random recent date
   */
  private getRandomRecentDate(): string {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 365); // Random date within last year
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return date.toISOString().split("T")[0]; // Return YYYY-MM-DD format
  }

  /**
   * Detect media type from URL and metadata
   */
  detectMediaType(url: string, metadata?: URLMetadata): string {
    const domain = this.extractDomain(url);
    const path = url.toLowerCase();

    // Video platforms
    if (domain.includes("youtube.com") || domain.includes("vimeo.com")) {
      return "video";
    }

    // Podcast platforms
    if (
      domain.includes("spotify.com") ||
      domain.includes("apple.com/podcasts") ||
      path.includes("podcast") ||
      path.includes("episode")
    ) {
      return "podcast";
    }

    // Press releases
    if (
      path.includes("press-release") ||
      path.includes("pr/") ||
      domain.includes("businesswire.com") ||
      domain.includes("prnewswire.com")
    ) {
      return "press_release";
    }

    // Interviews
    if (
      path.includes("interview") ||
      metadata?.title?.toLowerCase().includes("interview")
    ) {
      return "interview";
    }

    // Opinion/Editorial
    if (
      path.includes("opinion") ||
      path.includes("editorial") ||
      path.includes("op-ed") ||
      metadata?.title?.toLowerCase().includes("opinion")
    ) {
      return "opinion";
    }

    // Blog posts
    if (
      path.includes("blog") ||
      domain.includes("medium.com") ||
      domain.includes("substack.com")
    ) {
      return "blog_post";
    }

    // Default to news article
    return "news_article";
  }

  /**
   * Generate search suggestions for media discovery
   */
  generateSearchSuggestions(
    userName: string,
    specialties: string[] = [],
    affiliations: string[] = [],
  ): string[] {
    const suggestions: string[] = [];

    // Basic name searches
    suggestions.push(userName);
    suggestions.push(`"${userName}"`); // Exact match

    // Add specialty-based searches
    specialties.forEach((specialty) => {
      suggestions.push(`"${userName}" ${specialty}`);
    });

    // Add affiliation-based searches
    affiliations.forEach((affiliation) => {
      suggestions.push(`"${userName}" "${affiliation}"`);
    });

    // Add professional title variations
    const titles = ["Dr.", "Doctor", "MD", "PhD"];
    titles.forEach((title) => {
      if (!userName.toLowerCase().includes(title.toLowerCase())) {
        suggestions.push(`${title} ${userName}`);
      }
    });

    return suggestions.slice(0, 6); // Limit to 6 suggestions
  }
}

// Export singleton instance
export const urlMetadataService = new URLMetadataService();
