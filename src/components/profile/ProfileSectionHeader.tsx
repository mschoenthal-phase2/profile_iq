import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, Edit } from "lucide-react";

interface ProfileSectionHeaderProps {
  title: string;
  description: string;
  isEditing: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onBackToDashboard: () => void;
  dashboardState?: any; // For preserving dashboard state
}

export const ProfileSectionHeader: React.FC<ProfileSectionHeaderProps> = ({
  title,
  description,
  isEditing,
  isSaving,
  hasUnsavedChanges,
  onEdit,
  onSave,
  onCancel,
  onBackToDashboard,
}) => {
  return (
    <div className="bg-white border-b border-phase2-net-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBackToDashboard}
              className="text-phase2-dark-gray hover:text-phase2-blue px-2 py-1 h-8 shrink-0"
            >
              <ArrowLeft className="w-3 h-3 mr-1" />
              <span className="text-xs">Back</span>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-raleway font-bold text-phase2-soft-black">
                {title}
              </h1>
              <p className="text-phase2-dark-gray font-raleway">
                {description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  onClick={onSave}
                  disabled={isSaving || !hasUnsavedChanges}
                  className="min-w-[100px]"
                >
                  {isSaving ? (
                    <div className="flex items-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
