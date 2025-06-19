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
} from "@/lib/section-config.js";
import {
  getHospitalPermissions,
  applySectionPermissions,
  HospitalPermissions,
  createPermissionSummary,
} from "@/lib/hospital-permissions";
import { NPIProvider } from "@/types/npi";
import { AlertCircle, Building2 } from "lucide-react";

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
  const [hospitalPermissions, setHospitalPermissions] =
    useState<HospitalPermissions | null>(null);
  const [permissionSummary, setPermissionSummary] = useState<any>(null);

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

    // Load hospital-specific permissions
    loadHospitalPermissions(signupData.organization);
  }, [location.state, navigate]);

  const loadHospitalPermissions = async (organization?: string) => {
    try {
      const permissions = await getHospitalPermissions(organization);
      setHospitalPermissions(permissions);

      // Apply permissions to sections
      const filteredSections = applySectionPermissions(
        DEFAULT_PROFILE_SECTIONS,
        permissions,
      );
      setSections(filteredSections);

      // Create permission summary for display
      const summary = createPermissionSummary(permissions);
      setPermissionSummary(summary);
    } catch (error) {
      console.error("Error loading hospital permissions:", error);
      // Fallback to default sections
      setSections(DEFAULT_PROFILE_SECTIONS);
    }
  };

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
    } else if (sectionId === "biography") {
      navigate("/biography", {
        state: {
          isEditing: true,
          dashboardState: location.state,
        },
      });
    } else if (sectionId === "publications") {
      navigate("/publications", {
        state: {
          isEditing: true,
          dashboardState: location.state,
        },
      });
    } else if (sectionId === "clinical_trials") {
      navigate("/clinical-trials", {
        state: {
          isEditing: true,
          dashboardState: location.state,
        },
      });
    } else if (sectionId === "media_press") {
      navigate("/media-press", {
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
    } else if (sectionId === "biography") {
      navigate("/biography", {
        state: {
          isEditing: false,
          dashboardState: location.state,
        },
      });
    } else if (sectionId === "publications") {
      navigate("/publications", {
        state: {
          isEditing: false,
          dashboardState: location.state,
        },
      });
    } else if (sectionId === "clinical_trials") {
      navigate("/clinical-trials", {
        state: {
          isEditing: false,
          dashboardState: location.state,
        },
      });
    } else if (sectionId === "media_press") {
      navigate("/media-press", {
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
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-raleway font-bold text-phase2-soft-black">
                    Profile Sections ({sections.length})
                  </h2>
                  <p className="text-phase2-dark-gray font-raleway mt-1">
                    Review and edit all sections of your professional profile •
                    aligned with profile creation flow
                  </p>
                </div>

                {permissionSummary && profile?.personalInfo.organization && (
                  <div className="flex items-center space-x-2 px-3 py-2 bg-blue-50 rounded-lg">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">
                        {profile.personalInfo.organization}
                      </p>
                      <p className="text-blue-600">
                        {permissionSummary.visible_count} of{" "}
                        {permissionSummary.total_sections} sections visible
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Hospital Restrictions Alert */}
            {permissionSummary &&
              permissionSummary.hidden_sections.length > 0 && (
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Building2 className="w-5 h-5 text-blue-600" />
                      <div>
                        <h4 className="font-raleway font-semibold text-blue-800">
                          Hospital Configuration
                        </h4>
                        <p className="text-sm text-blue-700 font-raleway">
                          Your hospital has configured{" "}
                          {permissionSummary.visible_count} of{" "}
                          {permissionSummary.total_sections} profile sections to
                          be visible.
                          {permissionSummary.hidden_sections.length > 0 && (
                            <span className="block mt-1">
                              Hidden sections:{" "}
                              {permissionSummary.hidden_sections
                                .join(", ")
                                .replace(/_/g, " ")}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

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

            {/* Profile Sections Grid - Show sections based on hospital permissions */}
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
