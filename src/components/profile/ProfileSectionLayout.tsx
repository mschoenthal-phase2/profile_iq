import React, { ReactNode } from "react";
import { ProfileSectionHeader } from "./ProfileSectionHeader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ProfileSectionLayoutProps {
  title: string;
  description: string;
  isEditing: boolean;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  showUnsavedDialog: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onBackToDashboard: () => void;
  onConfirmDiscard: () => void;
  onSaveAndReturn: () => void;
  onCloseUnsavedDialog: () => void;
  children: ReactNode;
  dashboardState?: any;
}

export const ProfileSectionLayout: React.FC<ProfileSectionLayoutProps> = ({
  title,
  description,
  isEditing,
  isSaving,
  hasUnsavedChanges,
  showUnsavedDialog,
  onEdit,
  onSave,
  onCancel,
  onBackToDashboard,
  onConfirmDiscard,
  onSaveAndReturn,
  onCloseUnsavedDialog,
  children,
}) => {
  return (
    <div className="min-h-screen bg-phase2-net-gray/20">
      {/* Header */}
      <ProfileSectionHeader
        title={title}
        description={description}
        isEditing={isEditing}
        isSaving={isSaving}
        hasUnsavedChanges={hasUnsavedChanges}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
        onBackToDashboard={onBackToDashboard}
      />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={onCloseUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save your changes before
              leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onConfirmDiscard}>
              Discard Changes
            </AlertDialogCancel>
            <AlertDialogAction onClick={onSaveAndReturn}>
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
