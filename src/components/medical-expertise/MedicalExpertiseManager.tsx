import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";
import { SpecialtySelector } from "./SpecialtySelector";
import { ExpertiseSelector } from "./ExpertiseSelector";
import { MedicalExpertiseStatsComponent } from "./MedicalExpertiseStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, CheckCircle, AlertCircle, UserCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  MedicalExpertiseState,
  SelectedExpertise,
} from "@/types/medical-expertise";
import { medicalExpertiseService } from "@/services/medical-expertise-service";

export default function MedicalExpertiseManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("setup");

  const [state, setState] = useState<MedicalExpertiseState>({
    currentStep: 1,
    specialties: [],
    userProfile: null,
    selectedSpecialties: [],
    specialtyIds: [],
    selectedItems: {
      conditions: [],
      procedures: [],
      reasonsForVisit: [],
    },
    availableItems: {
      conditions: [],
      procedures: [],
      reasonsForVisit: [],
    },
    loading: false,
    error: null,
    hasUnsavedChanges: false,
    isEditing: false,
    isSaving: false,
  });

  // Mock user ID - in production this would come from auth context
  const userId = "mock_user_id";

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Load specialties
      const specialties = await medicalExpertiseService.getSpecialties();

      // Load user profile if exists
      const userProfile = await medicalExpertiseService.getUserProfile(userId);

      if (userProfile) {
        // Load user's existing selections
        const userExpertise = await medicalExpertiseService.getUserExpertise(
          userProfile.id,
        );

        const groupedExpertise: SelectedExpertise = {
          conditions: userExpertise
            .filter((e) => e.term_type === "Condition")
            .map((e) => e.term_id),
          procedures: userExpertise
            .filter((e) => e.term_type === "Procedure")
            .map((e) => e.term_id),
          reasonsForVisit: userExpertise
            .filter((e) => e.term_type === "Reason for Visit")
            .map((e) => e.term_id),
        };

        setState((prev) => ({
          ...prev,
          specialties,
          userProfile,
          selectedSpecialties: userProfile.specialty
            ? [userProfile.specialty]
            : [],
          specialtyIds: userProfile.specialty_id
            ? [userProfile.specialty_id]
            : [],
          selectedItems: groupedExpertise,
          currentStep: userProfile.specialty ? 2 : 1,
          loading: false,
        }));

        // Load available items if specialty is selected
        if (userProfile.specialty) {
          await loadAvailableItems([userProfile.specialty]);
        }
      } else {
        setState((prev) => ({
          ...prev,
          specialties,
          loading: false,
        }));
      }
    } catch (error) {
      console.error("Error loading initial data:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load medical expertise data",
      }));

      toast({
        title: "Loading Failed",
        description: "Failed to load medical expertise data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const loadAvailableItems = async (specialties: string[]) => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      // Load items for all selected specialties
      const allConditions: ClinicalExpertise[] = [];
      const allProcedures: ClinicalExpertise[] = [];
      const allReasonsForVisit: ClinicalExpertise[] = [];

      for (const specialty of specialties) {
        const [conditions, procedures, reasonsForVisit] = await Promise.all([
          medicalExpertiseService.getItemsBySpecialtyAndType(
            specialty,
            "Condition",
          ),
          medicalExpertiseService.getItemsBySpecialtyAndType(
            specialty,
            "Procedure",
          ),
          medicalExpertiseService.getItemsBySpecialtyAndType(
            specialty,
            "Reason for Visit",
          ),
        ]);

        allConditions.push(...conditions);
        allProcedures.push(...procedures);
        allReasonsForVisit.push(...reasonsForVisit);
      }

      setState((prev) => ({
        ...prev,
        availableItems: {
          conditions: allConditions,
          procedures: allProcedures,
          reasonsForVisit: allReasonsForVisit,
        },
        loading: false,
      }));
    } catch (error) {
      console.error("Error loading available items:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load expertise options",
      }));
    }
  };

  const handleSpecialtySelect = async (
    specialty: string,
    specialtyId: number,
  ) => {
    try {
      setState((prev) => ({
        ...prev,
        selectedSpecialty: specialty,
        specialtyId: specialtyId,
        loading: true,
      }));

      // Save/update user profile
      const profileData = {
        id: state.userProfile?.id,
        user_id: userId,
        specialty: specialty,
        specialty_id: specialtyId,
        updated_at: new Date().toISOString(),
      };

      const savedProfile =
        await medicalExpertiseService.upsertUserProfile(profileData);

      setState((prev) => ({
        ...prev,
        userProfile: savedProfile,
      }));

      // Load available items for this specialty
      await loadAvailableItems(specialty);

      // Move to next step
      setState((prev) => ({
        ...prev,
        currentStep: 2,
      }));

      setHasUnsavedChanges(true);

      toast({
        title: "Specialty Selected",
        description: `Selected ${specialty}. Now choose your areas of expertise.`,
      });
    } catch (error) {
      console.error("Error selecting specialty:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to save specialty selection",
      }));

      toast({
        title: "Selection Failed",
        description: "Failed to save specialty selection. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleItemSelectionChange = (
    itemType: keyof SelectedExpertise,
    termId: string,
    isSelected: boolean,
  ) => {
    setState((prev) => {
      const newSelectedItems = { ...prev.selectedItems };
      if (isSelected) {
        if (!newSelectedItems[itemType].includes(termId)) {
          newSelectedItems[itemType] = [...newSelectedItems[itemType], termId];
        }
      } else {
        newSelectedItems[itemType] = newSelectedItems[itemType].filter(
          (id) => id !== termId,
        );
      }

      return {
        ...prev,
        selectedItems: newSelectedItems,
      };
    });

    setHasUnsavedChanges(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setState((prev) => ({ ...prev, isSaving: true }));

    try {
      if (!state.userProfile) {
        throw new Error("User profile not found");
      }

      // Validate selections
      const validation = medicalExpertiseService.validateExpertise(
        state.selectedItems,
      );

      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "));
      }

      // Save selected expertise
      await medicalExpertiseService.saveUserExpertise(
        state.userProfile.id,
        state.selectedItems,
      );

      // Mark profile as completed
      await medicalExpertiseService.upsertUserProfile({
        ...state.userProfile,
        profile_completed: true,
        updated_at: new Date().toISOString(),
      });

      setHasUnsavedChanges(false);
      setIsEditing(false);

      toast({
        title: "Medical Expertise Saved",
        description:
          "Your medical expertise profile has been successfully saved.",
      });

      // Show warnings if any
      if (validation.warnings.length > 0) {
        setTimeout(() => {
          toast({
            title: "Recommendation",
            description: validation.warnings.join(", "),
            variant: "default",
          });
        }, 1000);
      }
    } catch (error) {
      console.error("Error saving medical expertise:", error);
      toast({
        title: "Save Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to save medical expertise. Please try again.",
        variant: "destructive",
      });
    } finally {
      setState((prev) => ({ ...prev, isSaving: false }));
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
      const dashboardState = location.state?.dashboardState;
      if (dashboardState) {
        navigate("/dashboard", { state: dashboardState });
      } else {
        navigate("/dashboard", { replace: true });
      }
    }
  };

  const handleConfirmDiscard = () => {
    setHasUnsavedChanges(false);
    setIsEditing(false);
    setShowUnsavedDialog(false);
    const dashboardState = location.state?.dashboardState;
    if (dashboardState) {
      navigate("/dashboard", { state: dashboardState });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  const handleSaveAndReturn = async () => {
    await handleSave();
    setShowUnsavedDialog(false);
    const dashboardState = location.state?.dashboardState;
    if (dashboardState) {
      navigate("/dashboard", { state: dashboardState });
    } else {
      navigate("/dashboard", { replace: true });
    }
  };

  const handleCloseUnsavedDialog = () => {
    setShowUnsavedDialog(false);
  };

  const handleBackToSpecialty = () => {
    setState((prev) => ({ ...prev, currentStep: 1 }));
  };

  // Calculate progress
  const getProgress = () => {
    if (!state.selectedSpecialty) return 0;
    const totalItems =
      state.selectedItems.conditions.length +
      state.selectedItems.procedures.length +
      state.selectedItems.reasonsForVisit.length;
    return Math.min(25 + (totalItems * 75) / 20, 100); // 25% for specialty, up to 75% for items
  };

  // Get stats for display
  const getStats = () => {
    return medicalExpertiseService.getExpertiseStats(
      state.selectedItems,
      state.selectedSpecialty || undefined,
    );
  };

  const totalSelected =
    state.selectedItems.conditions.length +
    state.selectedItems.procedures.length +
    state.selectedItems.reasonsForVisit.length;

  return (
    <ProfileSectionLayout
      title="Medical Expertise"
      description="Define your medical specialty and areas of expertise"
      isEditing={isEditing}
      isSaving={state.isSaving}
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
        {/* Error Alert */}
        {state.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="space-y-6">
          {state.currentStep === 1 ? (
            <SpecialtySelector
              specialties={state.specialties}
              selectedSpecialties={state.selectedSpecialties}
              onSpecialtyToggle={handleSpecialtyToggle}
              loading={state.loading}
            />
          ) : (
            <div className="space-y-6">
              <ExpertiseSelector
                availableItems={state.availableItems}
                selectedItems={state.selectedItems}
                onSelectionChange={handleItemSelectionChange}
                specialty={state.selectedSpecialty!}
                loading={state.loading}
              />

              {/* Navigation Controls */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={handleBackToSpecialty}
                      className="flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Change Specialty
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {totalSelected} items selected across all categories
                      </span>
                      {totalSelected > 0 && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </ProfileSectionLayout>
  );
}
