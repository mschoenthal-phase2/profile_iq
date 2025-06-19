import React from "react";
import { Eye, AlertTriangle, CheckCircle } from "lucide-react";

interface ProfileStatsCardProps {
  profileViews: number;
  sectionsNeedingUpdates: number;
  completionPercentage?: number;
  isDarkMode?: boolean;
}

export const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({
  profileViews,
  sectionsNeedingUpdates,
  completionPercentage = 0,
  isDarkMode = false,
}) => {
  const textColor = isDarkMode ? "text-white" : "text-phase2-soft-black";
  const mutedTextColor = isDarkMode ? "text-white/70" : "text-phase2-dark-gray";
  const iconColor = isDarkMode ? "text-white" : "text-phase2-blue";
  return (
    <div className="space-y-4">
      {/* Profile Views */}
      <div className="text-right">
        <div className={`text-sm font-raleway font-semibold ${textColor}`}>
          Profile Views
        </div>
        <div className="flex items-center justify-end gap-2 mt-1">
          <Eye className={`w-4 h-4 ${iconColor}`} />
          <span className={`text-2xl font-raleway font-bold ${iconColor}`}>
            {profileViews}
          </span>
          <span className={`text-sm ${mutedTextColor} font-raleway`}>
            this month
          </span>
        </div>
      </div>

      {/* Profile Completion */}
      <div className="text-right">
        <div className={`text-sm font-raleway font-semibold ${textColor}`}>
          Profile Completion
        </div>
        <div className="flex items-center justify-end gap-2 mt-1">
          <CheckCircle
            className={`w-4 h-4 ${isDarkMode ? "text-green-400" : "text-green-500"}`}
          />
          <span
            className={`text-2xl font-raleway font-bold ${isDarkMode ? "text-green-400" : "text-green-500"}`}
          >
            {completionPercentage}%
          </span>
          <span className={`text-sm ${mutedTextColor} font-raleway`}>
            complete
          </span>
        </div>
      </div>

      {/* Sections Needing Updates */}
      {sectionsNeedingUpdates > 0 && (
        <div className="text-right">
          <div className={`text-sm font-raleway font-semibold ${textColor}`}>
            Sections Needing Updates
          </div>
          <div className="flex items-center justify-end gap-2 mt-1">
            <AlertTriangle
              className={`w-4 h-4 ${isDarkMode ? "text-orange-400" : "text-orange-500"}`}
            />
            <span
              className={`text-2xl font-raleway font-bold ${isDarkMode ? "text-orange-400" : "text-orange-500"}`}
            >
              {sectionsNeedingUpdates}
            </span>
            <span className={`text-sm ${mutedTextColor} font-raleway`}>
              section{sectionsNeedingUpdates !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
