import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Search, RefreshCw, AlertCircle, Info } from "lucide-react";

interface ManualURLEntryProps {
  onAddByURL: (url: string) => void;
  isLoading: boolean;
  error: string | null;
}

export const ManualURLEntry: React.FC<ManualURLEntryProps> = ({
  onAddByURL,
  isLoading,
  error,
}) => {
  const [urlInput, setUrlInput] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = urlInput.trim();

    if (!trimmedUrl) return;

    // Basic URL validation
    if (!isValidUrl(trimmedUrl)) {
      return;
    }

    onAddByURL(trimmedUrl);
  };

  const isValidUrl = (url: string): boolean => {
    try {
      // Add protocol if missing
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const clearInput = () => {
    setUrlInput("");
    setNotes("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrlInput(e.target.value);
  };

  const isValidURL = urlInput.trim() && isValidUrl(urlInput.trim());

  return (
    <div className="space-y-4">
      {/* Instructions */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Enter the URL of a news article, interview, or media coverage to add
          it to your profile. We'll automatically extract the article details.
        </AlertDescription>
      </Alert>

      {/* URL Entry Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="articleUrl">Article URL</Label>
          <div className="flex gap-2">
            <Input
              id="articleUrl"
              placeholder="https://example.com/article-about-you"
              value={urlInput}
              onChange={handleInputChange}
              disabled={isLoading}
              className={error ? "border-destructive" : ""}
            />
            <Button
              type="submit"
              disabled={!isValidURL || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Add Article
                </>
              )}
            </Button>
          </div>
          {!isValidURL && urlInput.trim() && (
            <p className="text-sm text-destructive">
              Please enter a valid URL (e.g., https://example.com/article)
            </p>
          )}
        </div>

        {/* Optional Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Add any personal notes about this article..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isLoading}
            className="h-20"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </form>
    </div>
  );
};
