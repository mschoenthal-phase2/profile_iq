import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  RefreshCw,
  CheckCircle2,
  Circle,
  Calendar,
  Building2,
  TestTube,
  Users,
  ExternalLink,
  MapPin,
  Activity,
} from "lucide-react";
import {
  ClinicalTrial,
  ClinicalTrialDiscoveryResult,
  TRIAL_STATUS_LABELS,
} from "@/types/clinical-trials";

interface ClinicalTrialDiscoveryProps {
  onSearch: (investigatorName: string, affiliation?: string) => void;
  isSearching: boolean;
  discoveryResults: ClinicalTrialDiscoveryResult | null;
  onSelectTrials: (trials: ClinicalTrial[]) => void;
  profileName: string;
  profileAffiliation: string;
}

export const ClinicalTrialDiscovery: React.FC<ClinicalTrialDiscoveryProps> = ({
  onSearch,
  isSearching,
  discoveryResults,
  onSelectTrials,
  profileName,
  profileAffiliation,
}) => {
  const [searchForm, setSearchForm] = useState({
    investigatorName: profileName || "",
    affiliation: profileAffiliation || "",
  });
  const [selectedTrials, setSelectedTrials] = useState<Set<string>>(new Set());

  const handleSearch = () => {
    if (!searchForm.investigatorName.trim()) return;

    onSearch(
      searchForm.investigatorName.trim(),
      searchForm.affiliation.trim() || undefined,
    );
    setSelectedTrials(new Set());
  };

  const handleRetrySearch = () => {
    handleSearch();
  };

  const handleTrialSelect = (trialId: string, isSelected: boolean) => {
    const newSelected = new Set(selectedTrials);
    if (isSelected) {
      newSelected.add(trialId);
    } else {
      newSelected.delete(trialId);
    }
    setSelectedTrials(newSelected);
  };

  const handleSelectAll = () => {
    if (!discoveryResults) return;

    const allIds = new Set(discoveryResults.trials.map((trial) => trial.id));
    setSelectedTrials(allIds);
  };

  const handleSelectNone = () => {
    setSelectedTrials(new Set());
  };

  const handleAddSelected = () => {
    if (!discoveryResults || selectedTrials.size === 0) return;

    const trialsToAdd = discoveryResults.trials.filter((trial) =>
      selectedTrials.has(trial.id),
    );

    onSelectTrials(trialsToAdd);
    setSelectedTrials(new Set());
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

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search ClinicalTrials.gov
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="investigatorName">Investigator Name</Label>
              <Input
                id="investigatorName"
                placeholder="Enter investigator name (e.g., John Smith)"
                value={searchForm.investigatorName}
                onChange={(e) =>
                  setSearchForm((prev) => ({
                    ...prev,
                    investigatorName: e.target.value,
                  }))
                }
                disabled={isSearching}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="affiliation">Affiliation (Optional)</Label>
              <Input
                id="affiliation"
                placeholder="Enter institution or hospital name"
                value={searchForm.affiliation}
                onChange={(e) =>
                  setSearchForm((prev) => ({
                    ...prev,
                    affiliation: e.target.value,
                  }))
                }
                disabled={isSearching}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSearch}
              disabled={isSearching || !searchForm.investigatorName.trim()}
              className="flex-1 md:flex-none"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Searching ClinicalTrials.gov...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Clinical Trials
                </>
              )}
            </Button>

            {discoveryResults && (
              <Button
                variant="outline"
                onClick={handleRetrySearch}
                disabled={isSearching}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Search
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {discoveryResults && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Found {discoveryResults.totalFound} potential clinical trials
              </CardTitle>

              {discoveryResults.trials.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    Select All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectNone}
                  >
                    Select None
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Search: {discoveryResults.searchQuery}</span>
              <span>•</span>
              <span>
                Date: {discoveryResults.searchDate.toLocaleDateString()}
              </span>
              {selectedTrials.size > 0 && (
                <>
                  <span>•</span>
                  <span>{selectedTrials.size} selected</span>
                </>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {discoveryResults.trials.length === 0 ? (
              <Alert>
                <TestTube className="h-4 w-4" />
                <AlertDescription>
                  No clinical trials found yet. You can add clinical trials
                  manually using the NCT ID lookup above.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <ScrollArea className="h-96 w-full">
                  <div className="space-y-4">
                    {discoveryResults.trials.map((trial) => (
                      <div
                        key={trial.id}
                        className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={selectedTrials.has(trial.id)}
                          onCheckedChange={(checked) =>
                            handleTrialSelect(trial.id, checked as boolean)
                          }
                          className="mt-1"
                        />

                        <div className="flex-1 space-y-3">
                          <div>
                            <h4 className="font-medium leading-tight mb-2">
                              {trial.title}
                            </h4>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center gap-1">
                                <TestTube className="w-3 h-3" />
                                {trial.nctId}
                              </span>
                              <span className="flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                {formatPhases(trial.phase)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(trial.startDate)}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {trial.enrollmentCount} participants
                              </span>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge
                                className={getStatusColor(trial.status)}
                                variant="outline"
                              >
                                {TRIAL_STATUS_LABELS[trial.status] ||
                                  trial.status}
                              </Badge>

                              <Badge variant="secondary">
                                {trial.studyType}
                              </Badge>

                              {trial.primaryPurpose && (
                                <Badge variant="outline">
                                  {trial.primaryPurpose}
                                </Badge>
                              )}

                              <a
                                href={`https://clinicaltrials.gov/study/${trial.nctId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                              >
                                View on ClinicalTrials.gov
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          {trial.conditions.length > 0 && (
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                Conditions:
                              </p>
                              <p className="text-sm">
                                {trial.conditions.slice(0, 3).join(", ")}
                                {trial.conditions.length > 3 && " ..."}
                              </p>
                            </div>
                          )}

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
                                {trial.locations[0].city},{" "}
                                {trial.locations[0].state}
                                {trial.locations.length > 1 &&
                                  ` (+${trial.locations.length - 1} more locations)`}
                              </span>
                            </div>
                          )}

                          {trial.briefSummary && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {trial.briefSummary}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {selectedTrials.size > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {selectedTrials.size} clinical trial
                        {selectedTrials.size !== 1 ? "s" : ""} selected
                      </span>
                      <Button onClick={handleAddSelected}>
                        Add Selected Clinical Trials
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
