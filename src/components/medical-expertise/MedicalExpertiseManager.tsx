import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";
import { SpecialtySelector } from "./SpecialtySelector";
import { ExpertiseSelector } from "./ExpertiseSelector";
import { MedicalExpertiseStatsComponent } from "./MedicalExpertiseStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  MedicalExpertiseState,
  SelectedExpertise,
  ClinicalExpertise,
} from "@/types/medical-expertise";
import { medicalExpertiseService } from "@/services/medical-expertise-service";

export default function MedicalExpertiseManager() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const [state, setState] = useState<MedicalExpertiseState>({
    currentStep: 1, // Keep for type compatibility but won't use
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

  const handleSpecialtyToggle = async (
    specialty: string,
    specialtyId: number,
    isSelected: boolean,
  ) => {
    try {
      let newSelectedSpecialties: string[];
      let newSpecialtyIds: number[];

      if (isSelected) {
        // Add specialty if not already selected
        newSelectedSpecialties = [...state.selectedSpecialties, specialty];
        newSpecialtyIds = [...state.specialtyIds, specialtyId];
      } else {
        // Remove specialty
        newSelectedSpecialties = state.selectedSpecialties.filter(
          (s) => s !== specialty,
        );
        newSpecialtyIds = state.specialtyIds.filter((id) => id !== specialtyId);
      }

      setState((prev) => ({
        ...prev,
        selectedSpecialties: newSelectedSpecialties,
        specialtyIds: newSpecialtyIds,
      }));

      // If we have selected specialties, save them and move to step 2
      if (newSelectedSpecialties.length > 0) {
        // Save/update user profile with selected specialties
        const profileData = {
          id: state.userProfile?.id,
          user_id: userId,
          specialty: newSelectedSpecialties.join(", "), // Store as comma-separated string
          specialty_id: newSpecialtyIds[0], // Use first specialty ID for compatibility
          updated_at: new Date().toISOString(),
        };

        const savedProfile =
          await medicalExpertiseService.upsertUserProfile(profileData);

        setState((prev) => ({
          ...prev,
          userProfile: savedProfile,
        }));

        // Load available items for selected specialties
        await loadAvailableItems(newSelectedSpecialties);
      } else {
        // No specialties selected, clear available items
        setState((prev) => ({
          ...prev,
          availableItems: {
            conditions: [],
            procedures: [],
            reasonsForVisit: [],
          },
        }));
      }

      setHasUnsavedChanges(true);

      if (isSelected) {
        toast({
          title: "Specialty Added",
          description: `Added ${specialty} to your specialties.`,
        });
      } else {
        toast({
          title: "Specialty Removed",
          description: `Removed ${specialty} from your specialties.`,
        });
      }
    } catch (error) {
      console.error("Error toggling specialty:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update specialty selection",
      }));

      toast({
        title: "Selection Failed",
        description: "Failed to update specialty selection. Please try again.",
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
          {/* Specialty Selection */}
          <SpecialtySelector
            specialties={state.specialties}
            selectedSpecialties={state.selectedSpecialties}
            onSpecialtyToggle={handleSpecialtyToggle}
            loading={state.loading}
            isEditing={isEditing}
          />

          {/* Expertise Selection - Only show if specialties are selected */}
          {state.selectedSpecialties.length > 0 && (
            <ExpertiseSelector
              availableItems={state.availableItems}
              selectedItems={state.selectedItems}
              onSelectionChange={handleItemSelectionChange}
              loading={state.loading}
              isEditing={isEditing}
            />
          )}
        </div>
      </div>
    </ProfileSectionLayout>
  );
}
