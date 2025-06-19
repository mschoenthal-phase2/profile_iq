import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";
import { BiographyEditor } from "@/components/biography/BiographyEditor";
import { AIBiographyGenerator } from "@/components/biography/AIBiographyGenerator";
import { BiographyDisplay } from "@/components/biography/BiographyDisplay";
import { BiographyData, GeneratedBiographies } from "@/types/biography";
import { toast } from "@/hooks/use-toast";

export default function Biography() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [biographyData, setBiographyData] = useState<BiographyData>({
    personalInput: "",
    professionalBiography: "",
    publicBiography: "",
    lastUpdated: new Date(),
    isGenerating: false,
  });

  useEffect(() => {
    // Load any existing biography data from navigation state or localStorage
    const existingData = location.state?.biographyData;
    if (existingData) {
      setBiographyData(existingData);
    } else {
      // Try to load from localStorage as a fallback
      const savedData = localStorage.getItem("biographyData");
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setBiographyData({
            ...parsed,
            lastUpdated: new Date(parsed.lastUpdated),
          });
        } catch (error) {
          console.error("Error loading saved biography data:", error);
        }
      }
    }
  }, [location.state]);

  const handlePersonalInputChange = (value: string) => {
    setBiographyData((prev) => ({
      ...prev,
      personalInput: value,
    }));
    setHasUnsavedChanges(true);
  };

  const handleProfessionalBiographyChange = (content: string) => {
    setBiographyData((prev) => ({
      ...prev,
      professionalBiography: content,
      lastUpdated: new Date(),
    }));
    // Save to localStorage
    const dataToSave = {
      ...biographyData,
      professionalBiography: content,
      lastUpdated: new Date(),
    };
    localStorage.setItem("biographyData", JSON.stringify(dataToSave));
  };

  const handlePublicBiographyChange = (content: string) => {
    setBiographyData((prev) => ({
      ...prev,
      publicBiography: content,
      lastUpdated: new Date(),
    }));
    // Save to localStorage
    const dataToSave = {
      ...biographyData,
      publicBiography: content,
      lastUpdated: new Date(),
    };
    localStorage.setItem("biographyData", JSON.stringify(dataToSave));
  };

  const handleGenerateBiographies = async () => {
    if (!biographyData.personalInput.trim()) {
      toast({
        title: "Input Required",
        description:
          "Please add some personal information before generating biographies.",
        variant: "destructive",
      });
      return;
    }

    setBiographyData((prev) => ({
      ...prev,
      isGenerating: true,
    }));

    try {
      // Simulate AI generation - in a real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Mock generated biographies based on input
      const mockProfessionalBio = `Dr. ${location.state?.dashboardState?.signupData?.fullName || "John Doe"} is a distinguished healthcare professional with extensive experience in their field. ${biographyData.personalInput.slice(0, 200)}... Their commitment to evidence-based practice and patient-centered care has earned recognition among peers and colleagues in the medical community.`;

      const mockPublicBio = `Dr. ${location.state?.dashboardState?.signupData?.fullName || "John Doe"} is dedicated to providing exceptional healthcare with a personal touch. ${biographyData.personalInput.slice(0, 150)}... They believe in building strong relationships with patients and making healthcare accessible and understandable for everyone.`;

      setBiographyData((prev) => ({
        ...prev,
        professionalBiography: mockProfessionalBio,
        publicBiography: mockPublicBio,
        isGenerating: false,
        lastUpdated: new Date(),
      }));

      // Save to localStorage
      const dataToSave = {
        ...biographyData,
        professionalBiography: mockProfessionalBio,
        publicBiography: mockPublicBio,
        isGenerating: false,
        lastUpdated: new Date(),
      };
      localStorage.setItem("biographyData", JSON.stringify(dataToSave));

      toast({
        title: "Biographies Generated",
        description:
          "Your professional and public biographies have been successfully generated.",
      });
    } catch (error) {
      setBiographyData((prev) => ({
        ...prev,
        isGenerating: false,
      }));

      toast({
        title: "Generation Failed",
        description: "Failed to generate biographies. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Save to localStorage
    localStorage.setItem("biographyData", JSON.stringify(biographyData));

    setHasUnsavedChanges(false);
    setIsEditing(false);
    setIsSaving(false);

    toast({
      title: "Biography Saved",
      description: "Your biography has been successfully saved.",
    });
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

  return (
    <ProfileSectionLayout
      title="Biography"
      description="Manage your professional and public biographies"
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
      <div className="space-y-8">
        {/* Personal Input Section */}
        <BiographyEditor
          value={biographyData.personalInput}
          onChange={handlePersonalInputChange}
          placeholder="I became a doctor because I wanted to make a meaningful difference in people's lives. I'm passionate about surgical innovation and improving patient outcomes through evidence-based practices. Outside of medicine, I enjoy running, spending time with my family, and mentoring young surgeons. I believe in treating each patient with compassion and respect, taking time to explain procedures and ensuring they feel comfortable with their care decisions."
        />

        {/* AI Generator Section */}
        <AIBiographyGenerator
          onGenerate={handleGenerateBiographies}
          isGenerating={biographyData.isGenerating}
          hasInput={biographyData.personalInput.trim().length > 0}
        />

        {/* Generated Biographies */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Professional Biography */}
          <BiographyDisplay
            title="Professional Biography"
            content={biographyData.professionalBiography}
            description=""
            targetAudience="professional"
            isGenerating={biographyData.isGenerating}
            onContentChange={handleProfessionalBiographyChange}
          />

          {/* Public Biography */}
          <BiographyDisplay
            title="Public Biography"
            content={biographyData.publicBiography}
            description=""
            targetAudience="public"
            isGenerating={biographyData.isGenerating}
            onContentChange={handlePublicBiographyChange}
          />
        </div>
      </div>
    </ProfileSectionLayout>
  );
}
