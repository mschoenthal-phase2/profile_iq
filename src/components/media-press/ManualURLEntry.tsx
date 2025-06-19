import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  RefreshCw,
  AlertCircle,
  Info,
  ExternalLink,
  Globe,
  Link,
} from "lucide-react";

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

      {/* Quick Examples */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">
          Example URLs to try:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "https://nytimes.com/health/doctor-interview.html",
            "https://cnn.com/health/medical-expert.html",
            "https://forbes.com/healthcare/innovation.html",
            "https://npr.org/health/frontlines.html",
          ].map((url) => (
            <Button
              key={url}
              variant="outline"
              size="sm"
              onClick={() => setUrlInput(url)}
              disabled={isLoading}
              className="text-xs"
            >
              <Link className="w-3 h-3 mr-1" />
              {new URL(url).hostname}
            </Button>
          ))}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-4 p-3 bg-muted/50 rounded-md">
        <div className="flex gap-3">
          <Globe className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="space-y-2 text-sm">
            <p className="font-medium">Supported Content Types:</p>
            <ul className="space-y-1 text-muted-foreground list-disc list-inside">
              <li>News articles and interviews</li>
              <li>Blog posts and opinion pieces</li>
              <li>Press releases and announcements</li>
              <li>Podcast episodes and video interviews</li>
              <li>Profile features and spotlights</li>
            </ul>
            <p className="text-xs mt-2">
              <strong>Note:</strong> We automatically detect article details
              like title, author, publication date, and description. You can
              edit these details after adding the article.
            </p>
          </div>
        </div>
      </div>

      {/* Popular News Sources */}
      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-sm font-medium text-blue-900 mb-2">
          🔍 Popular News Sources:
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
          <div>
            <p>• The New York Times</p>
            <p>• CNN Health</p>
            <p>• Forbes</p>
            <p>• NPR Health</p>
          </div>
          <div>
            <p>• BBC Health</p>
            <p>• STAT News</p>
            <p>• Medscape</p>
            <p>• Local news outlets</p>
          </div>
        </div>
      </div>
    </div>
  );
};
