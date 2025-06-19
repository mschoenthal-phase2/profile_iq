import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileSectionCard } from "@/components/dashboard/ProfileSectionCard";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { HealthcareFooter } from "@/components/dashboard/HealthcareFooter";
import {
  ProviderProfile,
  ProfileSection,
  DEFAULT_PROFILE_SECTIONS,
  ProfileSectionConfig,
} from "@/types/dashboard";
import {
  getHospitalSectionConfig,
  applySectionConfig,
  calculateProfileCompletion,
  getSectionsByStatus,
} from "@/lib/section-config";
import { NPIProvider } from "@/types/npi";
import { AlertCircle } from "lucide-react";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [sections, setSections] = useState<ProfileSection[]>(
    DEFAULT_PROFILE_SECTIONS,
  );
  const [sectionConfig, setSectionConfig] = useState<ProfileSectionConfig>({
    visibleSections: DEFAULT_PROFILE_SECTIONS.map((s) => s.id),
    requiredSections: DEFAULT_PROFILE_SECTIONS.filter((s) => s.isRequired).map(
      (s) => s.id,
    ),
  });

  useEffect(() => {
    // Get data from signup flow via navigation state
    const signupData = location.state?.signupData;
    const npiData = location.state?.npiProvider;

    if (!signupData || !npiData) {
      // Redirect to signup if no data available
      navigate("/signup");
      return;
    }

    // Build provider profile from signup and NPI data
    const providerProfile: ProviderProfile = {
      personalInfo: {
        fullName: signupData.fullName,
        email: signupData.email,
        jobTitle: signupData.jobTitle,
        organization: signupData.organization,
      },
      npiData: {
        number: npiData.number,
        firstName: npiData.basic.first_name,
        lastName: npiData.basic.last_name,
        credential: npiData.basic.credential,
        gender: npiData.basic.gender,
        department:
          npiData.basic.name ||
          `Department of ${npiData.taxonomies?.[0]?.desc || "Medicine"}`,
        specialty: npiData.taxonomies?.[0]?.desc,
        addresses: npiData.addresses,
      },
      preferences: {
        pronouns:
          npiData.basic.gender === "M"
            ? "He/Him"
            : npiData.basic.gender === "F"
              ? "She/Her"
              : undefined,
        languages: ["English"], // Default, would be configurable
      },
      stats: {
        profileViews: Math.floor(Math.random() * 300) + 150, // Mock data
        sectionsNeedingUpdates: sections.filter(
          (s) => s.status === "needs_update",
        ).length,
      },
    };

    setProfile(providerProfile);

    // Apply hospital-specific section configuration
    // In production, this would come from an API based on the user's organization
    const hospitalConfig = getHospitalSectionConfig(signupData.organization);
    if (hospitalConfig) {
      setSectionConfig(hospitalConfig);
      // For now, show all sections regardless of hospital config to see all 11 sections
      // const configuredSections = applySectionConfig(sections, hospitalConfig);
      // setSections(configuredSections);
    }

    // Ensure all sections are visible for the demo
    const allVisibleSections = sections.map((section) => ({
      ...section,
      isVisible: true,
    }));
    setSections(allVisibleSections);
  }, [location.state, navigate]);

  const handleSectionEdit = (sectionId: string) => {
    if (sectionId === "professional_identity") {
      navigate("/professional-identity", {
        state: {
          isEditing: true,
          dashboardState: location.state,
        },
      });
    } else if (sectionId === "education_training") {
      navigate("/education-training", {
        state: {
          isEditing: true,
          dashboardState: location.state,
        },
      });
    } else if (sectionId === "practice_essentials") {
      navigate("/practice-essentials", {
        state: {
          isEditing: true,
          dashboardState: location.state,
        },
      });
    } else if (sectionId === "locations") {
      navigate("/locations", {
        state: {
          isEditing: true,
          dashboardState: location.state,
        },
      });
    } else {
      // Navigate to other section edit pages
      console.log(`Editing section: ${sectionId}`);
    }
  };

  const handleSectionReview = (sectionId: string) => {
    if (sectionId === "professional_identity") {
      navigate("/professional-identity", {
        state: {
          isEditing: false,
          dashboardState: location.state,
        },
      });
    } else if (sectionId === "education_training") {
      navigate("/education-training", {
        state: {
          isEditing: false,
          dashboardState: location.state,
        },
      });
    } else if (sectionId === "practice_essentials") {
      navigate("/practice-essentials", {
        state: {
          isEditing: false,
          dashboardState: location.state,
        },
      });
    } else if (sectionId === "locations") {
      navigate("/locations", {
        state: {
          isEditing: false,
          dashboardState: location.state,
        },
      });
    } else {
      // Navigate to other section review pages
      console.log(`Reviewing section: ${sectionId}`);
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-phase2-net-gray/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-phase2-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-phase2-dark-gray font-raleway">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const sectionsNeedingUpdates = sections.filter(
    (section) => section.status === "needs_update",
  );
  const completionPercentage = calculateProfileCompletion(sections);

  return (
    <div className="min-h-screen bg-phase2-net-gray/20">
      {/* Dashboard Header with Brand Continuity */}
      <DashboardHeader profile={profile} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main Content - Profile Sections */}
        <div>
          <div className="space-y-6">
            {/* Sections Header */}
            <div>
              <h2 className="text-2xl font-raleway font-bold text-phase2-soft-black">
                Profile Sections (10)
              </h2>
              <p className="text-phase2-dark-gray font-raleway mt-1">
                Review and edit all sections of your professional profile •
                aligned with profile creation flow
              </p>
            </div>

            {/* Sections Needing Updates Alert */}
            {sectionsNeedingUpdates.length > 0 && (
              <Card className="border-2 border-orange-200 bg-orange-50">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    <div>
                      <h4 className="font-raleway font-semibold text-orange-800">
                        Sections Needing Updates
                      </h4>
                      <p className="text-sm text-orange-700 font-raleway">
                        {sectionsNeedingUpdates.length} section
                        {sectionsNeedingUpdates.length !== 1 ? "s" : ""} need
                        {sectionsNeedingUpdates.length === 1 ? "s" : ""} your
                        attention
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Profile Sections Grid - Show ALL 11 sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.map((section) => (
                <ProfileSectionCard
                  key={section.id}
                  section={section}
                  onEdit={() => handleSectionEdit(section.id)}
                  onReview={() => handleSectionReview(section.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <HealthcareFooter />
    </div>
  );
}
