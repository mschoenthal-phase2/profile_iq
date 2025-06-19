import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProfileSectionCard } from "@/components/dashboard/ProfileSectionCard";
import { ProfileStatsCard } from "@/components/dashboard/ProfileStatsCard";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import {
  ProviderProfile,
  ProfileSection,
  DEFAULT_PROFILE_SECTIONS,
  ProfileSectionConfig,
} from "@/types/dashboard";
import { NPIProvider } from "@/types/npi";
import { Download, FileText, Users, AlertCircle, Settings } from "lucide-react";

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

    // Simulate hospital-specific section configuration
    // In production, this would come from an API based on the user's organization
    const hospitalConfig = getHospitalSectionConfig(signupData.organization);
    if (hospitalConfig) {
      setSectionConfig(hospitalConfig);
      // Filter sections based on hospital config
      const filteredSections = sections.map((section) => ({
        ...section,
        isVisible: hospitalConfig.visibleSections.includes(section.id),
        isRequired: hospitalConfig.requiredSections.includes(section.id),
      }));
      setSections(filteredSections);
    }
  }, [location.state, navigate]);

  // Mock function to get hospital-specific section configuration
  const getHospitalSectionConfig = (
    organization?: string,
  ): ProfileSectionConfig | null => {
    // This would be replaced with an API call in production
    const hospitalConfigs: Record<string, ProfileSectionConfig> = {
      "Advent Health": {
        visibleSections: [
          "credentials",
          "professional_identity",
          "practice_essentials",
          "insurance_plans",
          "medical_expertise",
          "locations",
        ],
        requiredSections: [
          "credentials",
          "professional_identity",
          "practice_essentials",
        ],
      },
      "Mayo Clinic": {
        visibleSections: DEFAULT_PROFILE_SECTIONS.map((s) => s.id), // All sections
        requiredSections: [
          "credentials",
          "professional_identity",
          "practice_essentials",
          "medical_expertise",
          "publications",
        ],
      },
      // Add more hospital configurations as needed
    };

    return organization ? hospitalConfigs[organization] || null : null;
  };

  const handleSectionEdit = (sectionId: string) => {
    // Navigate to section edit page
    console.log(`Editing section: ${sectionId}`);
  };

  const handleSectionReview = (sectionId: string) => {
    // Navigate to section review page
    console.log(`Reviewing section: ${sectionId}`);
  };

  const handleExportPDF = (type: "summary" | "full") => {
    // Export PDF functionality
    console.log(`Exporting ${type} PDF`);
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

  const visibleSections = sections.filter((section) => section.isVisible);
  const sectionsNeedingUpdates = visibleSections.filter(
    (section) => section.status === "needs_update",
  );

  return (
    <div className="min-h-screen bg-phase2-net-gray/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <WelcomeHeader profile={profile} />

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="border-2 border-phase2-net-gray">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-raleway text-phase2-soft-black flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Your Professional Profile
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPDF("summary")}
                      className="text-xs"
                    >
                      <FileText className="w-4 h-4 mr-1" />
                      Summary PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportPDF("full")}
                      className="text-xs"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Full PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Avatar and Basic Info */}
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16 border-4 border-yellow-400">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-yellow-400 text-white text-lg font-semibold">
                      {profile.npiData.firstName?.[0]}
                      {profile.npiData.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-raleway font-semibold text-phase2-soft-black">
                      {profile.npiData.firstName} {profile.npiData.lastName},{" "}
                      {profile.npiData.credential}
                    </h3>
                    <p className="text-phase2-dark-gray font-raleway">
                      {profile.personalInfo.jobTitle}
                    </p>
                    <p className="text-sm text-phase2-dark-gray font-raleway">
                      {profile.npiData.department}
                    </p>
                  </div>
                </div>

                {/* NPI and Additional Info */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      NPI: {profile.npiData.number}
                    </Badge>
                    {profile.preferences.pronouns && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        {profile.preferences.pronouns}
                      </Badge>
                    )}
                    {profile.preferences.languages &&
                      profile.preferences.languages.length > 0 && (
                        <Badge
                          variant="secondary"
                          className="bg-purple-100 text-purple-800"
                        >
                          {profile.preferences.languages.join(", ")}
                        </Badge>
                      )}
                  </div>
                </div>

                <Separator />

                {/* Profile Stats */}
                <ProfileStatsCard
                  profileViews={profile.stats.profileViews}
                  sectionsNeedingUpdates={sectionsNeedingUpdates.length}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Sections */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Sections Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-raleway font-bold text-phase2-soft-black">
                    Profile Sections ({visibleSections.length})
                  </h2>
                  <p className="text-phase2-dark-gray font-raleway mt-1">
                    Review and edit all sections of your professional profile •
                    aligned with profile creation flow
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Preferences
                </Button>
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

              {/* Profile Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {visibleSections.map((section) => (
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
      </div>
    </div>
  );
}
