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
  Book,
  Users,
  ExternalLink,
} from "lucide-react";
import { Publication, PublicationDiscoveryResult } from "@/types/publications";

interface PublicationDiscoveryProps {
  onSearch: (authorName: string, affiliation?: string) => void;
  isSearching: boolean;
  discoveryResults: PublicationDiscoveryResult | null;
  onSelectPublications: (publications: Publication[]) => void;
  profileName: string;
  profileAffiliation: string;
}

export const PublicationDiscovery: React.FC<PublicationDiscoveryProps> = ({
  onSearch,
  isSearching,
  discoveryResults,
  onSelectPublications,
  profileName,
  profileAffiliation,
}) => {
  const [searchForm, setSearchForm] = useState({
    authorName: profileName || "",
    affiliation: profileAffiliation || "",
  });
  const [selectedPublications, setSelectedPublications] = useState<Set<string>>(
    new Set(),
  );

  const handleSearch = () => {
    if (!searchForm.authorName.trim()) return;

    onSearch(
      searchForm.authorName.trim(),
      searchForm.affiliation.trim() || undefined,
    );
    setSelectedPublications(new Set());
  };

  const handleRetrySearch = () => {
    handleSearch();
  };

  const handlePublicationSelect = (
    publicationId: string,
    isSelected: boolean,
  ) => {
    const newSelected = new Set(selectedPublications);
    if (isSelected) {
      newSelected.add(publicationId);
    } else {
      newSelected.delete(publicationId);
    }
    setSelectedPublications(newSelected);
  };

  const handleSelectAll = () => {
    if (!discoveryResults) return;

    const allIds = new Set(discoveryResults.publications.map((pub) => pub.id));
    setSelectedPublications(allIds);
  };

  const handleSelectNone = () => {
    setSelectedPublications(new Set());
  };

  const handleAddSelected = () => {
    if (!discoveryResults || selectedPublications.size === 0) return;

    const publicationsToAdd = discoveryResults.publications.filter((pub) =>
      selectedPublications.has(pub.id),
    );

    onSelectPublications(publicationsToAdd);
    setSelectedPublications(new Set());
  };

  const formatAuthors = (authors: string[]) => {
    if (authors.length === 0) return "Unknown authors";
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} and ${authors[1]}`;
    return `${authors[0]} et al.`;
  };

  const formatDate = (date: Date) => {
    return date.getFullYear().toString();
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search PubMed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="authorName">Author Name</Label>
              <Input
                id="authorName"
                placeholder="Enter author name (e.g., John Smith)"
                value={searchForm.authorName}
                onChange={(e) =>
                  setSearchForm((prev) => ({
                    ...prev,
                    authorName: e.target.value,
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
              disabled={isSearching || !searchForm.authorName.trim()}
              className="flex-1 md:flex-none"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Searching PubMed...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search Publications
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
                Found {discoveryResults.totalFound} potential publications
              </CardTitle>

              {discoveryResults.publications.length > 0 && (
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
              {selectedPublications.size > 0 && (
                <>
                  <span>•</span>
                  <span>{selectedPublications.size} selected</span>
                </>
              )}
            </div>
          </CardHeader>

          <CardContent>
            {discoveryResults.publications.length === 0 ? (
              <Alert>
                <Book className="h-4 w-4" />
                <AlertDescription>
                  No publications found yet. You can add publications manually
                  using the PMID lookup above.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <ScrollArea className="h-96 w-full">
                  <div className="space-y-4">
                    {discoveryResults.publications.map((publication) => (
                      <div
                        key={publication.id}
                        className="flex items-start gap-3 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <Checkbox
                          checked={selectedPublications.has(publication.id)}
                          onCheckedChange={(checked) =>
                            handlePublicationSelect(
                              publication.id,
                              checked as boolean,
                            )
                          }
                          className="mt-1"
                        />

                        <div className="flex-1 space-y-2">
                          <h4 className="font-medium leading-tight">
                            {publication.title}
                          </h4>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {formatAuthors(publication.authors)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Book className="w-3 h-3" />
                              {publication.journal}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(publication.publicationDate)}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">
                              {publication.publicationType.replace("_", " ")}
                            </Badge>

                            {publication.pmid && (
                              <Badge variant="outline">
                                PMID: {publication.pmid}
                              </Badge>
                            )}

                            {publication.doi && (
                              <a
                                href={`https://doi.org/${publication.doi}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                              >
                                DOI
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>

                          {publication.abstract && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {publication.abstract}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {selectedPublications.size > 0 && (
                  <>
                    <Separator className="my-4" />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        {selectedPublications.size} publication
                        {selectedPublications.size !== 1 ? "s" : ""} selected
                      </span>
                      <Button onClick={handleAddSelected}>
                        Add Selected Publications
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
