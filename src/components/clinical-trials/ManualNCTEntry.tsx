import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Search,
  RefreshCw,
  AlertCircle,
  Info,
  ExternalLink,
  TestTube,
} from "lucide-react";

interface ManualNCTEntryProps {
  onAddByNCT: (nctId: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const ManualNCTEntry: React.FC<ManualNCTEntryProps> = ({
  onAddByNCT,
  isLoading,
  error,
}) => {
  const [nctInput, setNctInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedNCT = nctInput.trim().toUpperCase();

    if (!trimmedNCT) return;

    // Validate NCT ID format
    if (!/^NCT\d{8}$/.test(trimmedNCT)) {
      return;
    }

    onAddByNCT(trimmedNCT);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Auto-format as user types
    let value = e.target.value.toUpperCase().replace(/[^NCT0-9]/g, "");

    // Ensure it starts with NCT
    if (value && !value.startsWith("NCT")) {
      value = "NCT" + value;
    }

    // Limit to NCT + 8 digits
    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    setNctInput(value);
  };

  const clearInput = () => {
    setNctInput("");
  };

  const isValidNCT = nctInput.trim() && /^NCT\d{8}$/.test(nctInput.trim());

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Enter an NCT ID from ClinicalTrials.gov to add a clinical trial to
          your profile. Find NCT IDs on{" "}
          <a
            href="https://clinicaltrials.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1"
          >
            ClinicalTrials.gov
            <ExternalLink className="w-3 h-3" />
          </a>
        </AlertDescription>
      </Alert>

      {/* NCT Entry Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nctId">NCT ID</Label>
          <div className="flex gap-2">
            <Input
              id="nctId"
              placeholder="Enter NCT ID (e.g., NCT12345678)"
              value={nctInput}
              onChange={handleInputChange}
              disabled={isLoading}
              className={error ? "border-destructive" : ""}
            />
            <Button
              type="submit"
              disabled={!isValidNCT || isLoading}
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
                  Add Trial
                </>
              )}
            </Button>
          </div>
          {!isValidNCT && nctInput.trim() && (
            <p className="text-sm text-destructive">
              NCT ID should be in format: NCT followed by 8 digits
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
          Example NCT IDs to try:
        </p>
        <div className="flex flex-wrap gap-2">
          {["NCT04123456", "NCT03987654", "NCT02456789", "NCT01234567"].map(
            (nctId) => (
              <Button
                key={nctId}
                variant="outline"
                size="sm"
                onClick={() => setNctInput(nctId)}
                disabled={isLoading}
                className="text-xs font-mono"
              >
                {nctId}
              </Button>
            ),
          )}
        </div>
      </div>

      {/* Additional Help */}
      <div className="mt-4 p-3 bg-muted/50 rounded-md">
        <div className="flex gap-3">
          <TestTube className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-medium">Finding NCT IDs:</p>
            <ol className="space-y-1 text-muted-foreground list-decimal list-inside">
              <li>Visit ClinicalTrials.gov and search for studies</li>
              <li>Click on a study title to view details</li>
              <li>The NCT ID appears at the top of the study page</li>
              <li>Copy the complete NCT ID (e.g., NCT12345678)</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
