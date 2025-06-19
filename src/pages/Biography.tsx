import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { BiographyEditor } from "@/components/biography/BiographyEditor";
import { AIBiographyGenerator } from "@/components/biography/AIBiographyGenerator";
import { BiographyDisplay } from "@/components/biography/BiographyDisplay";
import { BiographyData, GeneratedBiographies } from "@/types/biography";
import { toast } from "@/hooks/use-toast";

export default function Biography() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleBack = () => {
    if (location.state?.dashboardState) {
      navigate("/dashboard", { state: location.state.dashboardState });
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-phase2-net-gray/20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="text-phase2-dark-gray hover:text-phase2-soft-black"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-phase2-blue" />
                <h1 className="text-2xl font-raleway font-bold text-phase2-soft-black">
                  Edit Biography
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              description="This biography will be shown to other healthcare providers, researchers, and medical professionals. It emphasizes your clinical expertise and professional accomplishments."
              targetAudience="professional"
              isGenerating={biographyData.isGenerating}
              onContentChange={handleProfessionalBiographyChange}
            />

            {/* Public Biography */}
            <BiographyDisplay
              title="Public Biography"
              content={biographyData.publicBiography}
              description="This biography will be shown to potential patients and their families. It emphasizes your compassionate care and what makes you a great choice as their doctor."
              targetAudience="public"
              isGenerating={biographyData.isGenerating}
              onContentChange={handlePublicBiographyChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
