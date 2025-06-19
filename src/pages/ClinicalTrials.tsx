import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";
import { ClinicalTrialDiscovery } from "@/components/clinical-trials/ClinicalTrialDiscovery";
import { ClinicalTrialList } from "@/components/clinical-trials/ClinicalTrialList";
import { ManualNCTEntry } from "@/components/clinical-trials/ManualNCTEntry";
import { ClinicalTrialStats } from "@/components/clinical-trials/ClinicalTrialStats";
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
import { TestTube, Search, Plus, BarChart3, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  ClinicalTrial,
  ClinicalTrialManagementState,
  ClinicalTrialDiscoveryResult,
} from "@/types/clinical-trials";
import { clinicalTrialsService } from "@/services/clinicaltrials-service";

export default function ClinicalTrials() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("manage");
  const [showAddNCTDialog, setShowAddNCTDialog] = useState(false);

  const [state, setState] = useState<ClinicalTrialManagementState>({
    trials: [],
    discoveryResults: null,
    isSearching: false,
    searchError: null,
    isLoading: false,
    filters: {},
    manualNCTInput: "",
    isLookingUpNCT: false,
    nctLookupError: null,
  });

  useEffect(() => {
    // Load existing clinical trials from localStorage or API
    loadExistingTrials();
  }, []);

  const loadExistingTrials = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      // In production, this would load from Supabase
      const savedTrials = localStorage.getItem("userClinicalTrials");
      if (savedTrials) {
        const trials = JSON.parse(savedTrials);
        setState((prev) => ({
          ...prev,
          trials: trials.map((trial: any) => ({
            ...trial,
            startDate: trial.startDate ? new Date(trial.startDate) : undefined,
            completionDate: trial.completionDate
              ? new Date(trial.completionDate)
              : undefined,
            primaryCompletionDate: trial.primaryCompletionDate
              ? new Date(trial.primaryCompletionDate)
              : undefined,
            addedAt: new Date(trial.addedAt),
            lastModified: new Date(trial.lastModified),
          })),
          isLoading: false,
        }));
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error loading clinical trials:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        searchError: "Failed to load existing clinical trials",
      }));
    }
  };

  const handleDiscoverTrials = async (
    investigatorName: string,
    affiliation?: string,
  ) => {
    setState((prev) => ({
      ...prev,
      isSearching: true,
      searchError: null,
      discoveryResults: null,
    }));

    try {
      const searchResult = await clinicalTrialsService.searchByInvestigator(
        investigatorName,
        affiliation,
        50,
      );

      // Convert ClinicalTrials.gov studies to ClinicalTrial objects
      const trials: ClinicalTrial[] = searchResult.studies.map((study) => ({
        id: `ct-${study.nctId}`,
        nctId: study.nctId,
        title: study.title,
        status: study.status as any,
        phase: study.phase,
        studyType: study.studyType,
        conditions: study.conditions,
        interventions: study.interventions,
        primaryPurpose: study.primaryPurpose,
        allocation: study.allocation,
        masking: study.masking,
        enrollmentCount: study.enrollmentCount,
        startDate: study.startDate ? new Date(study.startDate) : undefined,
        completionDate: study.completionDate
          ? new Date(study.completionDate)
          : undefined,
        primaryCompletionDate: study.primaryCompletionDate
          ? new Date(study.primaryCompletionDate)
          : undefined,
        sponsor: study.sponsor,
        collaborators: study.collaborators,
        locations: study.locations,
        eligibilityCriteria: study.eligibilityCriteria,
        primaryOutcomes: study.primaryOutcomes,
        secondaryOutcomes: study.secondaryOutcomes,
        briefSummary: study.briefSummary,
        detailedDescription: study.detailedDescription,
        keywords: study.keywords,
        studyDesign: study.studyDesign,
        userRole: "principal_investigator", // Default role - user can change this
        isVisible: false,
        isSelected: false,
        userStatus: "pending",
        addedAt: new Date(),
        lastModified: new Date(),
      }));

      const discoveryResult: ClinicalTrialDiscoveryResult = {
        searchQuery: `${investigatorName}${affiliation ? ` (${affiliation})` : ""}`,
        searchDate: new Date(),
        totalFound: searchResult.totalCount,
        trials,
        suggestedKeywords: clinicalTrialsService.generateSearchSuggestions(
          investigatorName,
          affiliation ? [affiliation] : [],
        ),
      };

      setState((prev) => ({
        ...prev,
        isSearching: false,
        discoveryResults: discoveryResult,
      }));

      if (trials.length > 0) {
        setActiveTab("discovery");
        toast({
          title: "Clinical Trials Found",
          description: `Found ${trials.length} potential clinical trials. Review and select which ones to add to your profile.`,
        });
      } else {
        toast({
          title: "No Clinical Trials Found",
          description:
            "No clinical trials were found for the provided search criteria. Try adjusting your search terms or add trials manually.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error discovering clinical trials:", error);
      setState((prev) => ({
        ...prev,
        isSearching: false,
        searchError:
          error instanceof Error
            ? error.message
            : "Failed to search for clinical trials",
      }));

      toast({
        title: "Search Failed",
        description:
          "Failed to search ClinicalTrials.gov. Please check your internet connection and try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddTrialByNCT = async (nctId: string) => {
    setState((prev) => ({
      ...prev,
      isLookingUpNCT: true,
      nctLookupError: null,
    }));

    try {
      const study = await clinicalTrialsService.getTrialByNCTId(nctId);

      if (!study) {
        throw new Error("Clinical trial not found for the provided NCT ID");
      }

      const trial: ClinicalTrial = {
        id: `manual-${study.nctId}-${Date.now()}`,
        nctId: study.nctId,
        title: study.title,
        status: study.status as any,
        phase: study.phase,
        studyType: study.studyType,
        conditions: study.conditions,
        interventions: study.interventions,
        primaryPurpose: study.primaryPurpose,
        allocation: study.allocation,
        masking: study.masking,
        enrollmentCount: study.enrollmentCount,
        startDate: study.startDate ? new Date(study.startDate) : undefined,
        completionDate: study.completionDate
          ? new Date(study.completionDate)
          : undefined,
        primaryCompletionDate: study.primaryCompletionDate
          ? new Date(study.primaryCompletionDate)
          : undefined,
        sponsor: study.sponsor,
        collaborators: study.collaborators,
        locations: study.locations,
        eligibilityCriteria: study.eligibilityCriteria,
        primaryOutcomes: study.primaryOutcomes,
        secondaryOutcomes: study.secondaryOutcomes,
        briefSummary: study.briefSummary,
        detailedDescription: study.detailedDescription,
        keywords: study.keywords,
        studyDesign: study.studyDesign,
        userRole: "principal_investigator", // Default role
        isVisible: true,
        isSelected: true,
        userStatus: "manual",
        addedAt: new Date(),
        lastModified: new Date(),
      };

      setState((prev) => ({
        ...prev,
        trials: [...prev.trials, trial],
        isLookingUpNCT: false,
        manualNCTInput: "",
      }));

      setHasUnsavedChanges(true);
      setShowAddNCTDialog(false);

      toast({
        title: "Clinical Trial Added",
        description: `Successfully added "${study.title}" to your clinical trials.`,
      });
    } catch (error) {
      console.error("Error adding clinical trial by NCT:", error);
      setState((prev) => ({
        ...prev,
        isLookingUpNCT: false,
        nctLookupError:
          error instanceof Error
            ? error.message
            : "Failed to add clinical trial",
      }));

      toast({
        title: "Failed to Add Clinical Trial",
        description:
          "Could not find a clinical trial with that NCT ID. Please check the ID and try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectTrials = (selectedTrials: ClinicalTrial[]) => {
    const newTrials = selectedTrials.map((trial) => ({
      ...trial,
      isSelected: true,
      userStatus: "approved" as const,
      addedAt: new Date(),
    }));

    setState((prev) => ({
      ...prev,
      trials: [...prev.trials, ...newTrials],
    }));

    setHasUnsavedChanges(true);
    setActiveTab("manage");

    toast({
      title: "Clinical Trials Added",
      description: `Added ${newTrials.length} clinical trials to your profile.`,
    });
  };

  const handleUpdateTrial = (updatedTrial: ClinicalTrial) => {
    setState((prev) => ({
      ...prev,
      trials: prev.trials.map((trial) =>
        trial.id === updatedTrial.id ? updatedTrial : trial,
      ),
    }));
    setHasUnsavedChanges(true);
  };

  const handleDeleteTrial = (trialId: string) => {
    setState((prev) => ({
      ...prev,
      trials: prev.trials.filter((trial) => trial.id !== trialId),
    }));
    setHasUnsavedChanges(true);

    toast({
      title: "Clinical Trial Removed",
      description: "Clinical trial has been removed from your profile.",
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Save to localStorage (in production, this would save to Supabase)
      localStorage.setItem("userClinicalTrials", JSON.stringify(state.trials));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setHasUnsavedChanges(false);
      setIsEditing(false);

      toast({
        title: "Clinical Trials Saved",
        description: "Your clinical trials have been successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save clinical trials. Please try again.",
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
      // Always navigate to dashboard, preserving state if available
      const dashboardState = location.state?.dashboardState;
      if (dashboardState) {
        navigate("/dashboard", { state: dashboardState });
      } else {
        // Force navigation to dashboard
        navigate("/dashboard", { replace: true });
      }
    }
  };

  const handleConfirmDiscard = () => {
    setHasUnsavedChanges(false);
    setIsEditing(false);
    setShowUnsavedDialog(false);
    // Always navigate to dashboard, preserving state if available
    const dashboardState = location.state?.dashboardState;
    if (dashboardState) {
      navigate("/dashboard", { state: dashboardState });
    } else {
      // Force navigation to dashboard
      navigate("/dashboard", { replace: true });
    }
  };

  const handleSaveAndReturn = async () => {
    await handleSave();
    setShowUnsavedDialog(false);
    // Always navigate to dashboard, preserving state if available
    const dashboardState = location.state?.dashboardState;
    if (dashboardState) {
      navigate("/dashboard", { state: dashboardState });
    } else {
      // Force navigation to dashboard
      navigate("/dashboard", { replace: true });
    }
  };

  const handleCloseUnsavedDialog = () => {
    setShowUnsavedDialog(false);
  };

  const approvedTrials = state.trials.filter(
    (trial) => trial.userStatus === "approved" || trial.userStatus === "manual",
  );
  const visibleTrials = approvedTrials.filter((trial) => trial.isVisible);

  return (
    <ProfileSectionLayout
      title="Clinical Trials"
      description="Manage your clinical trial involvement and research studies"
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
        <ClinicalTrialStats
          totalTrials={approvedTrials.length}
          visibleTrials={visibleTrials.length}
          pendingReview={state.discoveryResults?.trials.length || 0}
          lastUpdated={
            approvedTrials.length > 0
              ? Math.max(
                  ...approvedTrials.map((trial) =>
                    trial.lastModified.getTime(),
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
              <TestTube className="w-4 h-4" />
              Manage Clinical Trials
              {approvedTrials.length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {approvedTrials.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="discovery" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Clinical Trial Discovery
              {state.discoveryResults && (
                <Badge variant="outline" className="ml-1">
                  {state.discoveryResults.trials.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <TestTube className="w-5 h-5" />
                    Your Clinical Trials
                  </CardTitle>

                  <Dialog
                    open={showAddNCTDialog}
                    onOpenChange={setShowAddNCTDialog}
                  >
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Clinical Trial
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <Plus className="w-5 h-5" />
                          Add Clinical Trial by NCT ID
                        </DialogTitle>
                      </DialogHeader>
                      <ManualNCTEntry
                        onAddByNCT={handleAddTrialByNCT}
                        isLoading={state.isLookingUpNCT}
                        error={state.nctLookupError}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <ClinicalTrialList
                  trials={approvedTrials}
                  onUpdateTrial={handleUpdateTrial}
                  onDeleteTrial={handleDeleteTrial}
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
                  Clinical Trial Discovery
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ClinicalTrialDiscovery
                  onSearch={handleDiscoverTrials}
                  isSearching={state.isSearching}
                  discoveryResults={state.discoveryResults}
                  onSelectTrials={handleSelectTrials}
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
