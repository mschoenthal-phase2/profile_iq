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
    <div className="space-y-6">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Enter a PubMed ID (PMID) from PubMed to add a publication to your
          profile. You can find PMIDs on{" "}
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Publication by PMID
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                  className="min-w-[140px]"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Looking up...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Look Up Publication
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
        </CardContent>
      </Card>

      <Separator />

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-5 h-5" />
            How to Find a PMID
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                1
              </div>
              <div>
                <p className="font-medium">Visit PubMed</p>
                <p className="text-muted-foreground">
                  Go to{" "}
                  <a
                    href="https://pubmed.ncbi.nlm.nih.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    pubmed.ncbi.nlm.nih.gov
                  </a>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                2
              </div>
              <div>
                <p className="font-medium">Search for your publication</p>
                <p className="text-muted-foreground">
                  Use the title, author name, or keywords to find your
                  publication
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                3
              </div>
              <div>
                <p className="font-medium">Click on the publication</p>
                <p className="text-muted-foreground">
                  Click on the title to open the publication details page
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                4
              </div>
              <div>
                <p className="font-medium">Copy the PMID</p>
                <p className="text-muted-foreground">
                  The PMID is displayed at the top of the page, usually as
                  "PMID: 12345678"
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Example PMIDs:
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
        </CardContent>
      </Card>
    </div>
  );
};
