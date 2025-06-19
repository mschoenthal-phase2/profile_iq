import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";
import { PublicationDiscovery } from "@/components/publications/PublicationDiscovery";
import { PublicationList } from "@/components/publications/PublicationList";
import { ManualPMIDEntry } from "@/components/publications/ManualPMIDEntry";
import { PublicationStats } from "@/components/publications/PublicationStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Book, Search, Plus, BarChart3, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  Publication,
  PublicationManagementState,
  PublicationDiscoveryResult,
} from "@/types/publications";
import { pubmedService } from "@/services/pubmed-service";

export default function Publications() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("manage");
  const [showAddPMIDDialog, setShowAddPMIDDialog] = useState(false);

  const [state, setState] = useState<PublicationManagementState>({
    publications: [],
    discoveryResults: null,
    isSearching: false,
    searchError: null,
    isLoading: false,
    filters: {},
    manualPmidInput: "",
    isLookingUpPmid: false,
    pmidLookupError: null,
  });

  useEffect(() => {
    // Load existing publications from localStorage or API
    loadExistingPublications();
  }, []);

  const loadExistingPublications = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      // In production, this would load from Supabase
      const savedPublications = localStorage.getItem("userPublications");
      if (savedPublications) {
        const publications = JSON.parse(savedPublications);
        setState((prev) => ({
          ...prev,
          publications: publications.map((pub: any) => ({
            ...pub,
            publicationDate: new Date(pub.publicationDate),
            addedAt: new Date(pub.addedAt),
            lastModified: new Date(pub.lastModified),
          })),
          isLoading: false,
        }));
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error loading publications:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        searchError: "Failed to load existing publications",
      }));
    }
  };

  const handleDiscoverPublications = async (
    authorName: string,
    affiliation?: string,
  ) => {
    setState((prev) => ({
      ...prev,
      isSearching: true,
      searchError: null,
      discoveryResults: null,
    }));

    try {
      const searchResult = await pubmedService.searchByAuthor(
        authorName,
        50,
        affiliation,
      );

      // Convert PubMed articles to Publications
      const publications: Publication[] = searchResult.articles.map(
        (article) => ({
          id: `pubmed-${article.pmid}`,
          title: article.title,
          authors: article.authors.map((author) =>
            `${author.foreName} ${author.lastName}`.trim(),
          ),
          journal: article.journal,
          publicationDate: new Date(article.pubDate || Date.now()),
          volume: article.volume,
          issue: article.issue,
          pages: article.pages,
          doi: article.doi,
          pmid: article.pmid,
          abstract: article.abstract,
          keywords: article.keywords,
          publicationType: article.publicationType.includes("Journal Article")
            ? "peer_reviewed"
            : "other",
          isVisible: false,
          isSelected: false,
          status: "pending",
          addedAt: new Date(),
          lastModified: new Date(),
        }),
      );

      const discoveryResult: PublicationDiscoveryResult = {
        searchQuery: `${authorName}${affiliation ? ` (${affiliation})` : ""}`,
        searchDate: new Date(),
        totalFound: searchResult.totalCount,
        publications,
        suggestedKeywords: pubmedService.generateSearchSuggestions(
          authorName,
          affiliation ? [affiliation] : [],
        ),
      };

      setState((prev) => ({
        ...prev,
        isSearching: false,
        discoveryResults: discoveryResult,
      }));

      if (publications.length > 0) {
        setActiveTab("discovery");
        toast({
          title: "Publications Found",
          description: `Found ${publications.length} potential publications. Review and select which ones to add to your profile.`,
        });
      } else {
        toast({
          title: "No Publications Found",
          description:
            "No publications were found for the provided search criteria. Try adjusting your search terms or add publications manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error discovering publications:", error);
      setState((prev) => ({
        ...prev,
        isSearching: false,
        searchError:
          error instanceof Error
            ? error.message
            : "Failed to search for publications",
      }));

      toast({
        title: "Search Failed",
        description:
          "Failed to search PubMed. Please check your internet connection and try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddPublicationByPMID = async (pmid: string) => {
    setState((prev) => ({
      ...prev,
      isLookingUpPmid: true,
      pmidLookupError: null,
    }));

    try {
      const article = await pubmedService.getPublicationByPMID(pmid);

      if (!article) {
        throw new Error("Publication not found for the provided PMID");
      }

      const publication: Publication = {
        id: `manual-${article.pmid}-${Date.now()}`,
        title: article.title,
        authors: article.authors.map((author) =>
          `${author.foreName} ${author.lastName}`.trim(),
        ),
        journal: article.journal,
        publicationDate: new Date(article.pubDate || Date.now()),
        volume: article.volume,
        issue: article.issue,
        pages: article.pages,
        doi: article.doi,
        pmid: article.pmid,
        abstract: article.abstract,
        keywords: article.keywords,
        publicationType: article.publicationType.includes("Journal Article")
          ? "peer_reviewed"
          : "other",
        isVisible: true,
        isSelected: true,
        status: "manual",
        addedAt: new Date(),
        lastModified: new Date(),
      };

      setState((prev) => ({
        ...prev,
        publications: [...prev.publications, publication],
        isLookingUpPmid: false,
        manualPmidInput: "",
      }));

      setHasUnsavedChanges(true);
      setShowAddPMIDDialog(false);

      toast({
        title: "Publication Added",
        description: `Successfully added "${article.title}" to your publications.`,
      });
    } catch (error) {
      console.error("Error adding publication by PMID:", error);
      setState((prev) => ({
        ...prev,
        isLookingUpPmid: false,
        pmidLookupError:
          error instanceof Error ? error.message : "Failed to add publication",
      }));

      toast({
        title: "Failed to Add Publication",
        description:
          "Could not find a publication with that PMID. Please check the number and try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectPublications = (selectedPublications: Publication[]) => {
    const newPublications = selectedPublications.map((pub) => ({
      ...pub,
      isSelected: true,
      status: "approved" as const,
      addedAt: new Date(),
    }));

    setState((prev) => ({
      ...prev,
      publications: [...prev.publications, ...newPublications],
    }));

    setHasUnsavedChanges(true);
    setActiveTab("manage");

    toast({
      title: "Publications Added",
      description: `Added ${newPublications.length} publications to your profile.`,
    });
  };

  const handleUpdatePublication = (updatedPublication: Publication) => {
    setState((prev) => ({
      ...prev,
      publications: prev.publications.map((pub) =>
        pub.id === updatedPublication.id ? updatedPublication : pub,
      ),
    }));
    setHasUnsavedChanges(true);
  };

  const handleDeletePublication = (publicationId: string) => {
    setState((prev) => ({
      ...prev,
      publications: prev.publications.filter((pub) => pub.id !== publicationId),
    }));
    setHasUnsavedChanges(true);

    toast({
      title: "Publication Removed",
      description: "Publication has been removed from your profile.",
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Save to localStorage (in production, this would save to Supabase)
      localStorage.setItem(
        "userPublications",
        JSON.stringify(state.publications),
      );

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setHasUnsavedChanges(false);
      setIsEditing(false);

      toast({
        title: "Publications Saved",
        description: "Your publications have been successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save publications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleBackToDashboard = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      if (location.state?.dashboardState) {
        navigate("/dashboard", { state: location.state.dashboardState });
      } else {
        navigate("/dashboard");
      }
    }
  };

  const handleConfirmDiscard = () => {
    setHasUnsavedChanges(false);
    setIsEditing(false);
    setShowUnsavedDialog(false);
    if (location.state?.dashboardState) {
      navigate("/dashboard", { state: location.state.dashboardState });
    } else {
      navigate("/dashboard");
    }
  };

  const handleSaveAndReturn = async () => {
    await handleSave();
    setShowUnsavedDialog(false);
    if (location.state?.dashboardState) {
      navigate("/dashboard", { state: location.state.dashboardState });
    } else {
      navigate("/dashboard");
    }
  };

  const handleCloseUnsavedDialog = () => {
    setShowUnsavedDialog(false);
  };

  const approvedPublications = state.publications.filter(
    (pub) => pub.status === "approved" || pub.status === "manual",
  );
  const visiblePublications = approvedPublications.filter(
    (pub) => pub.isVisible,
  );

  return (
    <ProfileSectionLayout
      title="Publications"
      description="Manage your research publications and scholarly work"
      isEditing={isEditing}
      isSaving={isSaving}
      hasUnsavedChanges={hasUnsavedChanges}
      showUnsavedDialog={showUnsavedDialog}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onBackToDashboard={handleBackToDashboard}
      onConfirmDiscard={handleConfirmDiscard}
      onSaveAndReturn={handleSaveAndReturn}
      onCloseUnsavedDialog={handleCloseUnsavedDialog}
      dashboardState={location.state?.dashboardState}
    >
      <div className="space-y-6">
        {/* Statistics Overview */}
        <PublicationStats
          totalPublications={approvedPublications.length}
          visiblePublications={visiblePublications.length}
          pendingReview={state.discoveryResults?.publications.length || 0}
          lastUpdated={
            approvedPublications.length > 0
              ? Math.max(
                  ...approvedPublications.map((pub) =>
                    pub.lastModified.getTime(),
                  ),
                )
              : undefined
          }
        />

        {/* Error Alert */}
        {state.searchError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.searchError}</AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Book className="w-4 h-4" />
              Manage Publications
              {approvedPublications.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {approvedPublications.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="discovery" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Publication Discovery
              {state.discoveryResults && (
                <Badge variant="outline" className="ml-1">
                  {state.discoveryResults.publications.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Book className="w-5 h-5" />
                    Your Publications
                  </CardTitle>

                  <Dialog
                    open={showAddPMIDDialog}
                    onOpenChange={setShowAddPMIDDialog}
                  >
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Publication
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Plus className="w-5 h-5" />
                          Add Publication by PMID
                        </DialogTitle>
                      </DialogHeader>
                      <ManualPMIDEntry
                        onAddByPMID={handleAddPublicationByPMID}
                        isLoading={state.isLookingUpPmid}
                        error={state.pmidLookupError}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <PublicationList
                  publications={approvedPublications}
                  onUpdatePublication={handleUpdatePublication}
                  onDeletePublication={handleDeletePublication}
                  isEditing={isEditing}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discovery" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Publication Discovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PublicationDiscovery
                  onSearch={handleDiscoverPublications}
                  isSearching={state.isSearching}
                  discoveryResults={state.discoveryResults}
                  onSelectPublications={handleSelectPublications}
                  profileName={
                    location.state?.dashboardState?.signupData?.fullName || ""
                  }
                  profileAffiliation={
                    location.state?.dashboardState?.signupData?.organization ||
                    ""
                  }
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProfileSectionLayout>
  );
}
