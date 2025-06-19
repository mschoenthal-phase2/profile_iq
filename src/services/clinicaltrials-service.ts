import {
  ClinicalTrialsGovStudy,
  ClinicalTrialsSearchResult,
  ClinicalTrialLocation,
  ClinicalTrialOutcome,
} from "@/types/clinical-trials";

/**
 * ClinicalTrials.gov API Service
 * Provides functions to search and retrieve clinical trials from ClinicalTrials.gov
 */
class ClinicalTrialsService {
  private readonly baseUrl = "https://clinicaltrials.gov/api/v2";

  /**
   * Search ClinicalTrials.gov for trials by investigator name and affiliation
   */
  async searchByInvestigator(
    investigatorName: string,
    affiliation?: string,
    maxResults: number = 20,
  ): Promise<ClinicalTrialsSearchResult> {
    try {
      // Construct search query
      let searchTerms = [`term=${encodeURIComponent(investigatorName)}`];

      if (affiliation) {
        searchTerms.push(`affiliation=${encodeURIComponent(affiliation)}`);
      }

      // Use the ClinicalTrials.gov API v2
      const url = new URL(`${this.baseUrl}/studies`);
      url.searchParams.append("query.term", investigatorName);
      if (affiliation) {
        url.searchParams.append("query.locn", affiliation);
      }
      url.searchParams.append("pageSize", maxResults.toString());
      url.searchParams.append("format", "json");
      url.searchParams.append(
        "fields",
        "NCTId,BriefTitle,OverallStatus,Phase,StudyType,Condition,InterventionName,PrimaryPurpose,Allocation,Masking,EnrollmentCount,StartDate,CompletionDate,PrimaryCompletionDate,LeadSponsorName,CollaboratorName,LocationFacility,LocationCity,LocationState,LocationCountry,EligibilityCriteria,PrimaryOutcomeMeasure,SecondaryOutcomeMeasure,BriefSummary,DetailedDescription,Keyword,StudyDesign",
      );

      const response = await this.searchClinicalTrials(url.toString());

      if (!response.studies || response.studies.length === 0) {
        return {
          studies: [],
          totalCount: 0,
          searchTerms: [investigatorName],
        };
      }

      return {
        studies: response.studies,
        totalCount: response.totalCount || response.studies.length,
        searchTerms: [investigatorName, ...(affiliation ? [affiliation] : [])],
      };
    } catch (error) {
      console.error(
        "Error searching ClinicalTrials.gov by investigator:",
        error,
      );
      throw new Error(
        "Failed to search ClinicalTrials.gov. Please try again later.",
      );
    }
  }

  /**
   * Get a specific clinical trial by NCT ID
   */
  async getTrialByNCTId(nctId: string): Promise<ClinicalTrialsGovStudy | null> {
    try {
      // Clean and validate NCT ID format
      const cleanNCTId = nctId.trim().toUpperCase();
      if (!cleanNCTId.match(/^NCT\d{8}$/)) {
        throw new Error("Invalid NCT ID format. Expected format: NCT########");
      }

      const url = new URL(`${this.baseUrl}/studies/${cleanNCTId}`);
      url.searchParams.append("format", "json");
      url.searchParams.append(
        "fields",
        "NCTId,BriefTitle,OverallStatus,Phase,StudyType,Condition,InterventionName,PrimaryPurpose,Allocation,Masking,EnrollmentCount,StartDate,CompletionDate,PrimaryCompletionDate,LeadSponsorName,CollaboratorName,LocationFacility,LocationCity,LocationState,LocationCountry,EligibilityCriteria,PrimaryOutcomeMeasure,SecondaryOutcomeMeasure,BriefSummary,DetailedDescription,Keyword,StudyDesign",
      );

      const response = await fetch(url.toString());
      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`ClinicalTrials.gov API error: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.studies || data.studies.length === 0) {
        return null;
      }

      return this.parseClinicalTrialData(data.studies[0]);
    } catch (error) {
      console.error("Error fetching trial by NCT ID:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to fetch trial. Please check the NCT ID and try again.",
      );
    }
  }

  /**
   * Search ClinicalTrials.gov using their API
   */
  private async searchClinicalTrials(url: string): Promise<any> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `ClinicalTrials.gov search failed: ${response.statusText}`,
      );
    }

    const data = await response.json();

    // Parse the response and convert to our format
    const studies =
      data.studies?.map((study: any) => this.parseClinicalTrialData(study)) ||
      [];

    return {
      studies,
      totalCount: data.totalCount || studies.length,
    };
  }

  /**
   * Parse clinical trial data from ClinicalTrials.gov API response
   */
  private parseClinicalTrialData(study: any): ClinicalTrialsGovStudy {
    const protocolSection = study.protocolSection || {};
    const identificationModule = protocolSection.identificationModule || {};
    const statusModule = protocolSection.statusModule || {};
    const designModule = protocolSection.designModule || {};
    const conditionsModule = protocolSection.conditionsModule || {};
    const interventionsModule = protocolSection.interventionsModule || {};
    const outcomesModule = protocolSection.outcomesModule || {};
    const eligibilityModule = protocolSection.eligibilityModule || {};
    const contactsLocationsModule =
      protocolSection.contactsLocationsModule || {};
    const sponsorCollaboratorsModule =
      protocolSection.sponsorCollaboratorsModule || {};
    const descriptionModule = protocolSection.descriptionModule || {};

    return {
      nctId: identificationModule.nctId || "",
      title: identificationModule.briefTitle || "",
      status: statusModule.overallStatus || "unknown",
      phase: designModule.phases || [],
      studyType: designModule.studyType || "",
      conditions: conditionsModule.conditions || [],
      interventions:
        interventionsModule.interventions?.map((i: any) => i.name || "") || [],
      primaryPurpose: designModule.designInfo?.primaryPurpose || "",
      allocation: designModule.designInfo?.allocation || "",
      masking: designModule.designInfo?.maskingInfo?.masking || "",
      enrollmentCount: designModule.enrollmentInfo?.count || 0,
      startDate: statusModule.startDateStruct?.date || undefined,
      completionDate: statusModule.completionDateStruct?.date || undefined,
      primaryCompletionDate:
        statusModule.primaryCompletionDateStruct?.date || undefined,
      sponsor: sponsorCollaboratorsModule.leadSponsor?.name || "",
      collaborators:
        sponsorCollaboratorsModule.collaborators?.map((c: any) => c.name) || [],
      locations: this.parseLocations(contactsLocationsModule.locations || []),
      eligibilityCriteria: eligibilityModule.eligibilityCriteria || "",
      primaryOutcomes: this.parseOutcomes(outcomesModule.primaryOutcomes || []),
      secondaryOutcomes: this.parseOutcomes(
        outcomesModule.secondaryOutcomes || [],
      ),
      briefSummary: descriptionModule.briefSummary || "",
      detailedDescription: descriptionModule.detailedDescription || undefined,
      keywords: conditionsModule.keywords || [],
      studyDesign: designModule.designInfo?.studyType || "",
    };
  }

  /**
   * Parse location data from API response
   */
  private parseLocations(locations: any[]): ClinicalTrialLocation[] {
    return locations.map((location) => ({
      facility: location.facility || "",
      city: location.city || "",
      state: location.state || "",
      country: location.country || "",
      zipCode: location.zip || undefined,
      status: location.status || undefined,
      contactName: location.contacts?.[0]?.name || undefined,
      contactPhone: location.contacts?.[0]?.phone || undefined,
      contactEmail: location.contacts?.[0]?.email || undefined,
    }));
  }

  /**
   * Parse outcome measures from API response
   */
  private parseOutcomes(outcomes: any[]): ClinicalTrialOutcome[] {
    return outcomes.map((outcome) => ({
      measure: outcome.measure || "",
      timeFrame: outcome.timeFrame || "",
      description: outcome.description || undefined,
    }));
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
      suggestions.push(`${userName} AND ${affiliation}`);
    });

    // Add common name variations
    const nameParts = userName.split(" ");
    if (nameParts.length >= 2) {
      const lastName = nameParts[nameParts.length - 1];
      const firstInitial = nameParts[0].charAt(0);
      suggestions.push(`${lastName}, ${firstInitial}`);
    }

    return suggestions.slice(0, 5); // Limit to 5 suggestions
  }

  /**
   * Validate NCT ID format
   */
  validateNCTId(nctId: string): boolean {
    const cleanId = nctId.trim().toUpperCase();
    return /^NCT\d{8}$/.test(cleanId);
  }

  /**
   * Format NCT ID to standard format
   */
  formatNCTId(nctId: string): string {
    return nctId.trim().toUpperCase();
  }
}

// Export singleton instance
export const clinicalTrialsService = new ClinicalTrialsService();
