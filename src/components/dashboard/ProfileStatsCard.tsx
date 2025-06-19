import React from "react";
import { Eye, AlertTriangle } from "lucide-react";

interface ProfileStatsCardProps {
  profileViews: number;
  sectionsNeedingUpdates: number;
}

export const ProfileStatsCard: React.FC<ProfileStatsCardProps> = ({
  profileViews,
  sectionsNeedingUpdates,
}) => {
  return (
    <div className="space-y-4">
      {/* Profile Views */}
      <div className="text-right">
        <div className="text-sm font-raleway font-semibold text-phase2-soft-black">
          Profile Views
        </div>
        <div className="flex items-center justify-end gap-2 mt-1">
          <Eye className="w-4 h-4 text-phase2-blue" />
          <span className="text-2xl font-raleway font-bold text-phase2-blue">
            {profileViews}
          </span>
          <span className="text-sm text-phase2-dark-gray font-raleway">
            this month
          </span>
        </div>
      </div>

      {/* Sections Needing Updates */}
      {sectionsNeedingUpdates > 0 && (
        <div className="text-right">
          <div className="text-sm font-raleway font-semibold text-phase2-soft-black">
            Sections Needing Updates
          </div>
          <div className="flex items-center justify-end gap-2 mt-1">
            <AlertTriangle className="w-4 h-4 text-orange-500" />
            <span className="text-2xl font-raleway font-bold text-orange-500">
              {sectionsNeedingUpdates}
            </span>
            <span className="text-sm text-phase2-dark-gray font-raleway">
              section{sectionsNeedingUpdates !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
