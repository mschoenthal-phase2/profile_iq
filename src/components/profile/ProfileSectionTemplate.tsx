import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileSectionLayout } from "./ProfileSectionLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Template for creating new profile section pages
 *
 * Usage Example:
 *
 * 1. Copy this template
 * 2. Rename to your section (e.g., PracticeEssentials.tsx)
 * 3. Update the title and description
 * 4. Replace the form data interface and content
 * 5. Add navigation handlers in Dashboard.tsx
 *
 * This ensures all profile sections have consistent:
 * - Header layout and navigation
 * - Edit/Save/Cancel functionality
 * - Unsaved changes handling
 * - Dashboard state preservation
 */

interface ExampleSectionData {
  // Define your section's data structure here
  field1: string;
  field2: string;
  // ... add more fields as needed
}

export default function ExampleProfileSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get dashboard state from navigation or use mock data
  const dashboardState =
    location.state?.dashboardState ||
    {
      // Fallback data - same as in ProfessionalIdentity
    };

  // Initial data for this section
  const initialData: ExampleSectionData = {
    field1: "Example value 1",
    field2: "Example value 2",
  };

  const [formData, setFormData] = useState<ExampleSectionData>(initialData);
  const [originalData, setOriginalData] =
    useState<ExampleSectionData>(initialData);

  useEffect(() => {
    // Check if coming from dashboard with edit mode
    if (location.state?.isEditing) {
      setIsEditing(true);
    }
  }, [location.state]);

  useEffect(() => {
    // Check for unsaved changes
    const hasChanges =
      JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasUnsavedChanges(hasChanges);
  }, [formData, originalData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOriginalData(formData);
      setIsEditing(false);
      setHasUnsavedChanges(false);

      // Navigate back to dashboard with preserved state
      navigate("/dashboard", {
        state: dashboardState,
      });
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      setIsEditing(false);
      setFormData(originalData);
    }
  };

  const handleBackToDashboard = () => {
    if (hasUnsavedChanges && isEditing) {
      setShowUnsavedDialog(true);
    } else {
      navigate("/dashboard", {
        state: dashboardState,
      });
    }
  };

  const confirmDiscard = () => {
    setFormData(originalData);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setShowUnsavedDialog(false);
    navigate("/dashboard", {
      state: dashboardState,
    });
  };

  const handleSaveAndReturn = async () => {
    setShowUnsavedDialog(false);
    await handleSave();
  };

  return (
    <ProfileSectionLayout
      title="Example Section" // Update this
      description="Manage your example section information" // Update this
      isEditing={isEditing}
      isSaving={isSaving}
      hasUnsavedChanges={hasUnsavedChanges}
      showUnsavedDialog={showUnsavedDialog}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={handleCancel}
      onBackToDashboard={handleBackToDashboard}
      onConfirmDiscard={confirmDiscard}
      onSaveAndReturn={handleSaveAndReturn}
      onCloseUnsavedDialog={() => setShowUnsavedDialog(false)}
      dashboardState={dashboardState}
    >
      {/* Your section content goes here */}
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Example Section Content</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Replace this with your section's specific content and forms.</p>
            {/* Add your forms, inputs, and other content here */}
          </CardContent>
        </Card>
      </div>
    </ProfileSectionLayout>
  );
}
