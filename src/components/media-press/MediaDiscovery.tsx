import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  RefreshCw,
  Globe,
  Info,
  Plus,
  Lightbulb,
  ExternalLink,
} from "lucide-react";
import {
  MediaArticle,
  MediaDiscoveryResult,
  COMMON_PUBLICATIONS,
} from "@/types/media-press";

interface MediaDiscoveryProps {
  onSearch: (searchQuery: string) => void;
  isSearching: boolean;
  discoveryResults: MediaDiscoveryResult | null;
  onSelectArticles: (articles: MediaArticle[]) => void;
  profileName: string;
  profileAffiliation: string;
}

export const MediaDiscovery: React.FC<MediaDiscoveryProps> = ({
  onSearch,
  isSearching,
  discoveryResults,
  onSelectArticles,
  profileName,
  profileAffiliation,
}) => {
  const [searchQuery, setSearchQuery] = useState(profileName || "");

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    onSearch(searchQuery.trim());
  };

  const handleRetrySearch = () => {
    handleSearch();
  };

  return (
    <div className="space-y-6">
      {/* Auto-discovery Notice */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Media search will start automatically</strong> - We'll
          periodically scan for your media mentions across major news sources.
          For now, please add articles manually using the URL method.
        </AlertDescription>
      </Alert>

      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search for Media Coverage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="searchQuery">Enter your name or search terms</Label>
            <div className="flex gap-2">
              <Input
                id="searchQuery"
                placeholder="Dr. John Smith, medical expert, etc."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                disabled={isSearching}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="min-w-[100px]"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </div>

          {discoveryResults && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRetrySearch}
                disabled={isSearching}
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Search
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {discoveryResults && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                No media coverage found
              </CardTitle>
            </div>
            <div className="text-sm text-muted-foreground">
              Search query: "{discoveryResults.searchQuery}" •{" "}
              {discoveryResults.searchDate.toLocaleDateString()}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-raleway font-semibold text-phase2-soft-black mb-2">
                No media coverage found yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Search for your media appearances or add manual entries to get
                started.
              </p>

              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={handleRetrySearch}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Auto Search
                </Button>
                <Button
                  onClick={() => {
                    /* This would open the manual URL dialog */
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Manual Entry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Tips for Finding Media Coverage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                1
              </div>
              <div>
                <p className="font-medium">
                  Search with variations of your name
                </p>
                <p className="text-muted-foreground">
                  Try "Dr. Smith", "John Smith MD", or "J. Smith"
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                2
              </div>
              <div>
                <p className="font-medium">
                  Include your specialty or expertise
                </p>
                <p className="text-muted-foreground">
                  "Dr. Smith cardiology" or "John Smith heart surgeon"
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                3
              </div>
              <div>
                <p className="font-medium">Add your institution name</p>
                <p className="text-muted-foreground">
                  "Dr. Smith Mayo Clinic" or "John Smith Johns Hopkins"
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                4
              </div>
              <div>
                <p className="font-medium">Check major news sources directly</p>
                <p className="text-muted-foreground">
                  Search within specific publications for your mentions
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-muted/50 rounded-md">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Common news sources to check:
            </p>
            <div className="flex flex-wrap gap-2">
              {COMMON_PUBLICATIONS.slice(0, 8).map((publication) => (
                <Button
                  key={publication}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => {
                    const searchUrl = `https://www.google.com/search?q=site:${publication
                      .toLowerCase()
                      .replace(/\s/g, "")}+${encodeURIComponent(searchQuery)}`;
                    window.open(searchUrl, "_blank");
                  }}
                >
                  {publication}
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
