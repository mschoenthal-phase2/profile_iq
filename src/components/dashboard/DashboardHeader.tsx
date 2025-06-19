import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ProviderProfile } from "@/types/dashboard";
import {
  Download,
  FileText,
  Users,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";

interface DashboardHeaderProps {
  profile: ProviderProfile;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  profile,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleExportPDF = (type: "summary" | "full") => {
    console.log(`Exporting ${type} PDF`);
  };

  const handleSignOut = () => {
    console.log("Signing out");
  };

  const handleSettings = () => {
    console.log("Opening settings");
  };

  return (
    <div className="bg-gradient-to-br from-phase2-blue to-phase2-electric-violet relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-phase2-misty-teal opacity-20 rounded-full transform translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-phase2-karma-coral opacity-20 rounded-full transform -translate-x-24 translate-y-24" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Left Side - ProfileIQ and User Info */}
          <div className="flex items-center gap-8">
            {/* ProfileIQ Branding - Top Left */}
            <div>
              <h1 className="text-2xl font-big-shoulders font-bold text-white">
                ProfileIQ
              </h1>
            </div>

            {/* Profile Avatar and Info */}
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12 border-3 border-white/20">
                <AvatarImage src="" />
                <AvatarFallback className="bg-yellow-400 text-white text-sm font-semibold">
                  {profile.npiData.firstName?.[0]}
                  {profile.npiData.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div>
                <h2 className="text-xl font-raleway font-bold text-white">
                  {profile.npiData.firstName} {profile.npiData.lastName}
                </h2>
                <p className="text-white/80 font-raleway text-sm">
                  {profile.personalInfo.jobTitle} • {profile.npiData.department}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Actions and Profile Menu */}
          <div className="flex items-center gap-4">
            {/* Action Buttons */}
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

            {/* Profile Dropdown Menu */}
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white/80 hover:text-white hover:bg-white/20 flex items-center gap-2"
                >
                  <Avatar className="w-8 h-8 border-2 border-white/30">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-white/20 text-white text-xs">
                      {profile.npiData.firstName?.[0]}
                      {profile.npiData.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">
                    {profile.npiData.firstName} {profile.npiData.lastName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {profile.personalInfo.email}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSettings}>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="text-red-600"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
