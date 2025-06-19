import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  TestTube,
  Calendar,
  Users,
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
  Building2,
  MapPin,
  Activity,
} from "lucide-react";
import {
  ClinicalTrial,
  USER_ROLES,
  TRIAL_STATUS_LABELS,
} from "@/types/clinical-trials";
import { cn } from "@/lib/utils";

interface ClinicalTrialListProps {
  trials: ClinicalTrial[];
  onUpdateTrial: (trial: ClinicalTrial) => void;
  onDeleteTrial: (trialId: string) => void;
  isEditing: boolean;
}

export const ClinicalTrialList: React.FC<ClinicalTrialListProps> = ({
  trials,
  onUpdateTrial,
  onDeleteTrial,
  isEditing,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggleVisibility = (trial: ClinicalTrial) => {
    const updatedTrial = {
      ...trial,
      isVisible: !trial.isVisible,
      lastModified: new Date(),
    };
    onUpdateTrial(updatedTrial);
  };

  const handleRoleChange = (trial: ClinicalTrial, newRole: string) => {
    const updatedTrial = {
      ...trial,
      userRole: newRole as any,
      lastModified: new Date(),
    };
    onUpdateTrial(updatedTrial);
  };

  const handleDeleteClick = (trialId: string) => {
    setDeletingId(trialId);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      onDeleteTrial(deletingId);
      setDeletingId(null);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Not specified";
    return date.getFullYear().toString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "recruiting":
        return "bg-green-100 text-green-800 border-green-200";
      case "active_not_recruiting":
      case "active, not recruiting":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "terminated":
      case "withdrawn":
        return "bg-red-100 text-red-800 border-red-200";
      case "suspended":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-muted text-muted-foreground border-muted";
    }
  };

  const formatPhases = (phases: string[]) => {
    if (phases.length === 0) return "Not applicable";
    return phases.join(", ");
  };

  if (trials.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
          <TestTube className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-raleway font-semibold text-phase2-soft-black mb-2">
          No clinical trials found yet
        </h3>
        <p className="text-sm text-muted-foreground">
          Use the "Clinical Trial Discovery" tab or "Add Clinical Trial" button
          to add trials to your profile
        </p>
      </div>
    );
  }

  const visibleTrials = trials.filter((trial) => trial.isVisible);
  const hiddenTrials = trials.filter((trial) => !trial.isVisible);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-phase2-blue rounded-full"></div>
              <span className="font-medium">
                {trials.length} Total Clinical Trials
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>{visibleTrials.length} Visible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
              <span>{hiddenTrials.length} Hidden</span>
            </div>
          </div>
          {isEditing && (
            <p className="text-xs text-muted-foreground">
              Toggle visibility, change your role, or remove trials using the
              controls on each card
            </p>
          )}
        </div>
      </div>

      {/* All Clinical Trials - Single List */}
      <div className="space-y-4">
        {trials.map((trial) => (
          <ClinicalTrialCard
            key={trial.id}
            trial={trial}
            onToggleVisibility={handleToggleVisibility}
            onRoleChange={handleRoleChange}
            onDelete={handleDeleteClick}
            isEditing={isEditing}
            formatDate={formatDate}
            getStatusColor={getStatusColor}
            formatPhases={formatPhases}
            isHidden={!trial.isVisible}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Clinical Trial</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this clinical trial from your
              profile? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeletingId(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Clinical Trial
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface ClinicalTrialCardProps {
  trial: ClinicalTrial;
  onToggleVisibility: (trial: ClinicalTrial) => void;
  onRoleChange: (trial: ClinicalTrial, role: string) => void;
  onDelete: (trialId: string) => void;
  isEditing: boolean;
  formatDate: (date?: Date) => string;
  getStatusColor: (status: string) => string;
  formatPhases: (phases: string[]) => string;
  isHidden?: boolean;
}

const ClinicalTrialCard: React.FC<ClinicalTrialCardProps> = ({
  trial,
  onToggleVisibility,
  onRoleChange,
  onDelete,
  isEditing,
  formatDate,
  getStatusColor,
  formatPhases,
  isHidden = false,
}) => {
  return (
    <Card
      className={cn(
        "border-2 transition-all duration-200 hover:shadow-md",
        isHidden
          ? "border-muted bg-muted/30 opacity-75"
          : "border-phase2-net-gray",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                trial.isVisible ? "bg-phase2-blue/10" : "bg-muted",
              )}
            >
              <TestTube
                className={cn(
                  "w-5 h-5",
                  trial.isVisible
                    ? "text-phase2-blue"
                    : "text-muted-foreground",
                )}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-raleway font-semibold text-phase2-soft-black line-clamp-2 mb-2">
                {trial.title}
              </h4>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <TestTube className="w-3 h-3 flex-shrink-0" />
                  <span className="font-mono">{trial.nctId}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 flex-shrink-0" />
                  <span>{formatPhases(trial.phase)}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  {formatDate(trial.startDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3 flex-shrink-0" />
                  {trial.enrollmentCount} participants
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-3">
                <Badge
                  className={getStatusColor(trial.status)}
                  variant="outline"
                >
                  {TRIAL_STATUS_LABELS[trial.status] || trial.status}
                </Badge>

                <Badge variant="secondary">{trial.studyType}</Badge>

                {trial.userRole && (
                  <Badge
                    variant="default"
                    className="bg-purple-100 text-purple-800 border-purple-200"
                  >
                    {USER_ROLES.find((r) => r.value === trial.userRole)
                      ?.label || trial.userRole}
                  </Badge>
                )}

                {trial.isVisible ? (
                  <Badge
                    variant="default"
                    className="bg-green-100 text-green-800 border-green-200"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Visible
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    <EyeOff className="w-3 h-3 mr-1" />
                    Hidden
                  </Badge>
                )}

                <a
                  href={`https://clinicaltrials.gov/study/${trial.nctId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                >
                  ClinicalTrials.gov
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Conditions */}
              {trial.conditions.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Conditions:
                  </p>
                  <p className="text-sm">
                    {trial.conditions.slice(0, 3).join(", ")}
                    {trial.conditions.length > 3 && " ..."}
                  </p>
                </div>
              )}

              {/* Sponsor and Location */}
              <div className="space-y-1">
                {trial.sponsor && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Building2 className="w-3 h-3" />
                    <span>Sponsored by {trial.sponsor}</span>
                  </div>
                )}

                {trial.locations.length > 0 && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span>
                      {trial.locations[0].city}, {trial.locations[0].state}
                      {trial.locations.length > 1 &&
                        ` (+${trial.locations.length - 1} more locations)`}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id={`visibility-${trial.id}`}
                  checked={trial.isVisible}
                  onCheckedChange={() => onToggleVisibility(trial)}
                />
                <Label
                  htmlFor={`visibility-${trial.id}`}
                  className="text-xs cursor-pointer"
                >
                  {trial.isVisible ? "Visible" : "Hidden"}
                </Label>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Your Role</Label>
                <Select
                  value={trial.userRole}
                  onValueChange={(value) => onRoleChange(trial, value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(trial.id)}
                className="text-destructive hover:text-destructive hover:border-destructive"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {trial.briefSummary && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Summary</h5>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {trial.briefSummary}
            </p>
          </div>
        )}

        {trial.primaryOutcomes.length > 0 && (
          <div className="mt-4">
            <h5 className="text-xs font-medium text-muted-foreground mb-2">
              Primary Outcomes
            </h5>
            <div className="space-y-1">
              {trial.primaryOutcomes.slice(0, 2).map((outcome, index) => (
                <div key={index} className="text-sm">
                  <span className="font-medium">{outcome.measure}</span>
                  {outcome.timeFrame && (
                    <span className="text-muted-foreground ml-2">
                      [{outcome.timeFrame}]
                    </span>
                  )}
                </div>
              ))}
              {trial.primaryOutcomes.length > 2 && (
                <p className="text-xs text-muted-foreground">
                  +{trial.primaryOutcomes.length - 2} more outcomes
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
