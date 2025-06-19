import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ProfileStatsCard } from "./ProfileStatsCard";
import { ProviderProfile } from "@/types/dashboard";
import { Download, FileText, Users, LogOut } from "lucide-react";

interface DashboardHeaderProps {
  profile: ProviderProfile;
  profileViews: number;
  sectionsNeedingUpdates: number;
  completionPercentage: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  profile,
  profileViews,
  sectionsNeedingUpdates,
  completionPercentage,
}) => {
  const currentHour = new Date().getHours();
  const getTimeGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleExportPDF = (type: "summary" | "full") => {
    console.log(`Exporting ${type} PDF`);
  };

  const handleSignOut = () => {
    console.log("Signing out");
  };

  return (
    <div className="bg-gradient-to-br from-phase2-blue to-phase2-electric-violet relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-phase2-misty-teal opacity-20 rounded-full transform translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-phase2-karma-coral opacity-20 rounded-full transform -translate-x-24 translate-y-24" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          {/* Left Side - Profile Info */}
          <div className="flex items-center gap-6">
            {/* ProfileIQ Branding */}
            <div className="hidden lg:block">
              <h1 className="text-2xl font-big-shoulders font-bold text-white mb-1">
                ProfileIQ
              </h1>
              <div className="w-16 h-0.5 bg-white/30"></div>
            </div>

            <Separator
              orientation="vertical"
              className="hidden lg:block h-16 bg-white/30"
            />

            {/* Profile Avatar and Info */}
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16 border-4 border-white/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-yellow-400 text-white text-lg font-semibold">
                  {profile.npiData.firstName?.[0]}
                  {profile.npiData.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-2xl lg:text-3xl font-raleway font-bold text-white">
                  {getTimeGreeting()}, {profile.npiData.firstName}{" "}
                  {profile.npiData.lastName}
                </h2>
                <p className="text-white/90 font-raleway mt-1">
                  {profile.personalInfo.jobTitle} • {profile.npiData.department}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                    <Users className="w-3 h-3 mr-1" />
                    Your Professional Profile
                  </Badge>
                  <Badge className="bg-blue-500/30 text-white border-blue-300/50">
                    NPI: {profile.npiData.number}
                  </Badge>
                  {profile.preferences.pronouns && (
                    <Badge className="bg-green-500/30 text-white border-green-300/50">
                      {profile.preferences.pronouns}
                    </Badge>
                  )}
                  {profile.preferences.languages &&
                    profile.preferences.languages.length > 0 && (
                      <Badge className="bg-purple-500/30 text-white border-purple-300/50">
                        {profile.preferences.languages.join(", ")}
                      </Badge>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Actions and Stats */}
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Stats */}
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <ProfileStatsCard
                profileViews={profileViews}
                sectionsNeedingUpdates={sectionsNeedingUpdates}
                completionPercentage={completionPercentage}
                isDarkMode={true}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleExportPDF("summary")}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Summary PDF
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleExportPDF("full")}
                  className="bg-white/20 text-white border-white/30 hover:bg-white/30"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Full PDF
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-white/80 hover:text-white hover:bg-white/20"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
