import {
  PubMedArticle,
  PubMedSearchResult,
  PubMedAuthor,
} from "@/types/publications";

/**
 * PubMed API Service
 * Provides functions to search and retrieve publications from PubMed
 */
class PubMedService {
  private readonly baseUrl = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";
  private readonly tool = "ProfileIQ";
  private readonly email = "support@profileiq.com"; // Replace with actual email

  /**
   * Search PubMed for publications by author name
   */
  async searchByAuthor(
    authorName: string,
    maxResults: number = 20,
    affiliation?: string,
  ): Promise<PubMedSearchResult> {
    try {
      // Construct search query
      let searchQuery = `${authorName}[Author]`;
      if (affiliation) {
        searchQuery += ` AND ${affiliation}[Affiliation]`;
      }

      // Step 1: Search for PMIDs
      const searchResponse = await this.searchPubMed(searchQuery, maxResults);

      if (!searchResponse.idList || searchResponse.idList.length === 0) {
        return {
          articles: [],
          totalCount: 0,
          queryKey: "",
          webEnv: "",
        };
      }

      // Step 2: Fetch detailed information for each PMID
      const articles = await this.fetchArticleDetails(searchResponse.idList);

      return {
        articles,
        totalCount: parseInt(searchResponse.count || "0"),
        queryKey: searchResponse.queryKey || "",
        webEnv: searchResponse.webEnv || "",
      };
    } catch (error) {
      console.error("Error searching PubMed by author:", error);
      throw new Error("Failed to search PubMed. Please try again later.");
    }
  }

  /**
   * Search PubMed for a specific publication by PMID
   */
  async getPublicationByPMID(pmid: string): Promise<PubMedArticle | null> {
    try {
      const articles = await this.fetchArticleDetails([pmid]);
      return articles.length > 0 ? articles[0] : null;
    } catch (error) {
      console.error("Error fetching publication by PMID:", error);
      throw new Error(
        "Failed to fetch publication. Please check the PMID and try again.",
      );
    }
  }

  /**
   * Search PubMed using the ESearch API
   */
  private async searchPubMed(query: string, maxResults: number): Promise<any> {
    const url = new URL(`${this.baseUrl}/esearch.fcgi`);
    url.searchParams.append("db", "pubmed");
    url.searchParams.append("term", query);
    url.searchParams.append("retmax", maxResults.toString());
    url.searchParams.append("retmode", "json");
    url.searchParams.append("tool", this.tool);
    url.searchParams.append("email", this.email);
    url.searchParams.append("usehistory", "y");

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`PubMed search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.esearchresult;
  }

  /**
   * Fetch detailed article information using ESummary and EFetch APIs
   */
  private async fetchArticleDetails(pmids: string[]): Promise<PubMedArticle[]> {
    if (pmids.length === 0) return [];

    try {
      // Use EFetch to get detailed XML data
      const url = new URL(`${this.baseUrl}/efetch.fcgi`);
      url.searchParams.append("db", "pubmed");
      url.searchParams.append("id", pmids.join(","));
      url.searchParams.append("retmode", "xml");
      url.searchParams.append("tool", this.tool);
      url.searchParams.append("email", this.email);

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`PubMed fetch failed: ${response.statusText}`);
      }

      const xmlText = await response.text();
      return this.parseXMLResponse(xmlText);
    } catch (error) {
      console.error("Error fetching article details:", error);

      // Fallback to ESummary API for basic information
      return this.fetchBasicArticleInfo(pmids);
    }
  }

  /**
   * Fallback method using ESummary API for basic article information
   */
  private async fetchBasicArticleInfo(
    pmids: string[],
  ): Promise<PubMedArticle[]> {
    const url = new URL(`${this.baseUrl}/esummary.fcgi`);
    url.searchParams.append("db", "pubmed");
    url.searchParams.append("id", pmids.join(","));
    url.searchParams.append("retmode", "json");
    url.searchParams.append("tool", this.tool);
    url.searchParams.append("email", this.email);

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`PubMed summary failed: ${response.statusText}`);
    }

    const data = await response.json();
    const articles: PubMedArticle[] = [];

    for (const pmid of pmids) {
      const article = data.result[pmid];
      if (article && article.title) {
        articles.push({
          pmid,
          title: article.title,
          authors: this.parseAuthorsFromSummary(article.authors),
          journal: article.source || "",
          pubDate: article.pubdate || "",
          volume: article.volume || undefined,
          issue: article.issue || undefined,
          pages: article.pages || undefined,
          doi: article.elocationid?.includes("doi:")
            ? article.elocationid.replace("doi:", "")
            : undefined,
          abstract: undefined, // Not available in summary
          keywords: [],
          publicationType: article.pubtype || [],
          affiliations: [],
        });
      }
    }

    return articles;
  }

  /**
   * Parse XML response from EFetch API
   */
  private parseXMLResponse(xmlText: string): PubMedArticle[] {
    // This is a simplified XML parser - in production, you'd use a proper XML parser
    const articles: PubMedArticle[] = [];

    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const articleElements = xmlDoc.getElementsByTagName("PubmedArticle");

      for (let i = 0; i < articleElements.length; i++) {
        const articleElement = articleElements[i];
        const article = this.parseArticleElement(articleElement);
        if (article) {
          articles.push(article);
        }
      }
    } catch (error) {
      console.error("Error parsing XML response:", error);
    }

    return articles;
  }

  /**
   * Parse individual article element from XML
   */
  private parseArticleElement(articleElement: Element): PubMedArticle | null {
    try {
      const pmid = this.getTextContent(articleElement, "PMID");
      const title = this.getTextContent(articleElement, "ArticleTitle");

      if (!pmid || !title) return null;

      const journal =
        this.getTextContent(articleElement, "Title") ||
        this.getTextContent(articleElement, "MedlineTA") ||
        "";

      const pubDate = this.extractPubDate(articleElement);
      const authors = this.extractAuthors(articleElement);
      const abstract = this.getTextContent(articleElement, "AbstractText");
      const keywords = this.extractKeywords(articleElement);

      // Extract journal details
      const volume = this.getTextContent(articleElement, "Volume");
      const issue = this.getTextContent(articleElement, "Issue");
      const pages = this.getTextContent(articleElement, "MedlinePgn");

      // Extract DOI
      const doi = this.extractDOI(articleElement);

      // Extract publication types
      const publicationType = this.extractPublicationTypes(articleElement);

      return {
        pmid,
        title,
        authors,
        journal,
        pubDate,
        volume,
        issue,
        pages,
        doi,
        abstract,
        keywords,
        publicationType,
        affiliations: [],
      };
    } catch (error) {
      console.error("Error parsing article element:", error);
      return null;
    }
  }

  /**
   * Helper function to get text content from XML element
   */
  private getTextContent(parent: Element, tagName: string): string | undefined {
    const element = parent.getElementsByTagName(tagName)[0];
    return element?.textContent?.trim() || undefined;
  }

  /**
   * Extract publication date from XML
   */
  private extractPubDate(articleElement: Element): string {
    const pubDateElement = articleElement.getElementsByTagName("PubDate")[0];
    if (!pubDateElement) return "";

    const year = this.getTextContent(pubDateElement, "Year") || "";
    const month = this.getTextContent(pubDateElement, "Month") || "";
    const day = this.getTextContent(pubDateElement, "Day") || "";

    return [year, month, day].filter(Boolean).join(" ");
  }

  /**
   * Extract authors from XML
   */
  private extractAuthors(articleElement: Element): PubMedAuthor[] {
    const authors: PubMedAuthor[] = [];
    const authorElements = articleElement.getElementsByTagName("Author");

    for (let i = 0; i < authorElements.length; i++) {
      const authorElement = authorElements[i];
      const lastName = this.getTextContent(authorElement, "LastName") || "";
      const foreName = this.getTextContent(authorElement, "ForeName") || "";
      const initials = this.getTextContent(authorElement, "Initials") || "";

      if (lastName || foreName) {
        authors.push({
          lastName,
          foreName,
          initials,
          affiliations: this.extractAuthorAffiliations(authorElement),
        });
      }
    }

    return authors;
  }

  /**
   * Extract author affiliations
   */
  private extractAuthorAffiliations(authorElement: Element): string[] {
    const affiliations: string[] = [];
    const affiliationElements =
      authorElement.getElementsByTagName("Affiliation");

    for (let i = 0; i < affiliationElements.length; i++) {
      const affiliation = affiliationElements[i].textContent?.trim();
      if (affiliation) {
        affiliations.push(affiliation);
      }
    }

    return affiliations;
  }

  /**
   * Extract keywords from XML
   */
  private extractKeywords(articleElement: Element): string[] {
    const keywords: string[] = [];
    const keywordElements = articleElement.getElementsByTagName("Keyword");

    for (let i = 0; i < keywordElements.length; i++) {
      const keyword = keywordElements[i].textContent?.trim();
      if (keyword) {
        keywords.push(keyword);
      }
    }

    return keywords;
  }

  /**
   * Extract DOI from XML
   */
  private extractDOI(articleElement: Element): string | undefined {
    const articleIdElements = articleElement.getElementsByTagName("ArticleId");

    for (let i = 0; i < articleIdElements.length; i++) {
      const idElement = articleIdElements[i];
      if (idElement.getAttribute("IdType") === "doi") {
        return idElement.textContent?.trim();
      }
    }

    return undefined;
  }

  /**
   * Extract publication types from XML
   */
  private extractPublicationTypes(articleElement: Element): string[] {
    const types: string[] = [];
    const typeElements = articleElement.getElementsByTagName("PublicationType");

    for (let i = 0; i < typeElements.length; i++) {
      const type = typeElements[i].textContent?.trim();
      if (type) {
        types.push(type);
      }
    }

    return types;
  }

  /**
   * Parse authors from ESummary response
   */
  private parseAuthorsFromSummary(authorsArray: any[]): PubMedAuthor[] {
    if (!Array.isArray(authorsArray)) return [];

    return authorsArray.map((author) => {
      if (typeof author === "string") {
        // Simple string format "LastName ForeName"
        const nameParts = author.split(" ");
        return {
          lastName: nameParts[0] || "",
          foreName: nameParts.slice(1).join(" ") || "",
          initials: "",
          affiliations: [],
        };
      }

      return {
        lastName: author.name || "",
        foreName: author.authtype || "",
        initials: "",
        affiliations: [],
      };
    });
  }

  /**
   * Generate suggested search terms based on user profile
   */
  generateSearchSuggestions(
    userName: string,
    affiliations: string[] = [],
  ): string[] {
    const suggestions: string[] = [];

    // Basic name variations
    suggestions.push(userName);

    // Add affiliation-based searches
    affiliations.forEach((affiliation) => {
      suggestions.push(`${userName}[Author] AND ${affiliation}[Affiliation]`);
    });

    // Add common name variations
    const nameParts = userName.split(" ");
    if (nameParts.length >= 2) {
      const lastName = nameParts[nameParts.length - 1];
      const firstInitial = nameParts[0].charAt(0);
      suggestions.push(`${lastName} ${firstInitial}[Author]`);
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }
}

// Export singleton instance
export const pubmedService = new PubMedService();
