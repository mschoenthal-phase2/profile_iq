import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Search,
  RefreshCw,
  AlertCircle,
  Info,
  ExternalLink,
  Book,
} from "lucide-react";

interface ManualPMIDEntryProps {
  onAddByPMID: (pmid: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const ManualPMIDEntry: React.FC<ManualPMIDEntryProps> = ({
  onAddByPMID,
  isLoading,
  error,
}) => {
  const [pmidInput, setPmidInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedPmid = pmidInput.trim();

    if (!trimmedPmid) return;

    // Validate PMID format (should be numeric)
    if (!/^\d+$/.test(trimmedPmid)) {
      return;
    }

    onAddByPMID(trimmedPmid);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numeric input
    const value = e.target.value.replace(/\D/g, "");
    setPmidInput(value);
  };

  const clearInput = () => {
    setPmidInput("");
  };

  const isValidPmid = pmidInput.trim() && /^\d+$/.test(pmidInput.trim());

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Enter a PubMed ID (PMID) to add a publication to your profile. Find
          PMIDs on{" "}
          <a
            href="https://pubmed.ncbi.nlm.nih.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1"
          >
            PubMed.gov
            <ExternalLink className="w-3 h-3" />
          </a>
        </AlertDescription>
      </Alert>

      {/* PMID Entry Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pmid">PubMed ID (PMID)</Label>
          <div className="flex gap-2">
            <Input
              id="pmid"
              placeholder="Enter PMID (e.g., 12345678)"
              value={pmidInput}
              onChange={handleInputChange}
              disabled={isLoading}
              className={error ? "border-destructive" : ""}
            />
            <Button
              type="submit"
              disabled={!isValidPmid || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Looking up...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Add Publication
                </>
              )}
            </Button>
          </div>
          {!isValidPmid && pmidInput.trim() && (
            <p className="text-sm text-destructive">
              PMID should contain only numbers
            </p>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>

      {/* Quick Examples */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Example PMIDs to try:
        </p>
        <div className="flex flex-wrap gap-2">
          {["35648032", "34654321", "33456789", "32123456"].map((pmid) => (
            <Button
              key={pmid}
              variant="outline"
              size="sm"
              onClick={() => setPmidInput(pmid)}
              disabled={isLoading}
              className="text-xs"
            >
              {pmid}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};
