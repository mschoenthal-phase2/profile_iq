import React from "react";
import { ProviderProfile } from "@/types/dashboard";

interface WelcomeHeaderProps {
  profile: ProviderProfile;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ profile }) => {
  const currentHour = new Date().getHours();
  const getTimeGreeting = () => {
    if (currentHour < 12) return "Good morning";
    if (currentHour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="bg-white rounded-lg border-2 border-phase2-net-gray p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-raleway font-bold text-phase2-soft-black">
            {getTimeGreeting()}, {profile.npiData.firstName}{" "}
            {profile.npiData.lastName}
          </h1>
          <p className="text-phase2-dark-gray font-raleway mt-2">
            {profile.personalInfo.jobTitle} • Manage your ProfileIQ and track
            performance
          </p>
        </div>
        <div className="hidden md:block">
          <div className="text-right">
            <p className="text-sm text-phase2-dark-gray font-raleway">
              {profile.personalInfo.organization || "Healthcare Professional"}
            </p>
            <p className="text-xs text-phase2-dark-gray font-raleway mt-1">
              Last login: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
