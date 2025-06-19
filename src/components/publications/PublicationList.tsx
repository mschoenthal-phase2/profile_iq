import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Book,
  Calendar,
  Users,
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
} from "lucide-react";
import { Publication } from "@/types/publications";

interface PublicationListProps {
  publications: Publication[];
  onUpdatePublication: (publication: Publication) => void;
  onDeletePublication: (publicationId: string) => void;
  isEditing: boolean;
}

export const PublicationList: React.FC<PublicationListProps> = ({
  publications,
  onUpdatePublication,
  onDeletePublication,
  isEditing,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggleVisibility = (publication: Publication) => {
    const updatedPublication = {
      ...publication,
      isVisible: !publication.isVisible,
      lastModified: new Date(),
    };
    onUpdatePublication(updatedPublication);
  };

  const handleDeleteClick = (publicationId: string) => {
    setDeletingId(publicationId);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      onDeletePublication(deletingId);
      setDeletingId(null);
    }
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

  const formatCitation = (publication: Publication) => {
    const authors = formatAuthors(publication.authors);
    const year = formatDate(publication.publicationDate);
    const journal = publication.journal;
    const volume = publication.volume;
    const issue = publication.issue;
    const pages = publication.pages;

    let citation = `${authors}. ${publication.title}. ${journal}. ${year}`;

    if (volume) {
      citation += `;${volume}`;
      if (issue) {
        citation += `(${issue})`;
      }
      if (pages) {
        citation += `:${pages}`;
      }
    }

    if (publication.doi) {
      citation += `. doi:${publication.doi}`;
    }

    return citation;
  };

  if (publications.length === 0) {
    return (
      <div className="text-center py-8">
        <Book className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground mb-2">
          No publications found yet
        </h3>
        <p className="text-sm text-muted-foreground">
          You can add publications manually using the PMID lookup above
        </p>
      </div>
    );
  }

  const visiblePublications = publications.filter((pub) => pub.isVisible);
  const hiddenPublications = publications.filter((pub) => !pub.isVisible);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{publications.length} total publications</span>
          <span>•</span>
          <span>{visiblePublications.length} visible</span>
          <span>•</span>
          <span>{hiddenPublications.length} hidden</span>
        </div>
      </div>

      {/* Visible Publications */}
      {visiblePublications.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-green-600" />
            <h3 className="font-medium">Visible Publications</h3>
            <Badge variant="secondary">{visiblePublications.length}</Badge>
          </div>

          <ScrollArea className="h-96 w-full">
            <div className="space-y-4">
              {visiblePublications.map((publication) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                  onToggleVisibility={handleToggleVisibility}
                  onDelete={handleDeleteClick}
                  isEditing={isEditing}
                  formatCitation={formatCitation}
                  formatAuthors={formatAuthors}
                  formatDate={formatDate}
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Hidden Publications */}
      {hiddenPublications.length > 0 && (
        <div className="space-y-4">
          <Separator />
          <div className="flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium">Hidden Publications</h3>
            <Badge variant="outline">{hiddenPublications.length}</Badge>
          </div>

          <ScrollArea className="h-64 w-full">
            <div className="space-y-4">
              {hiddenPublications.map((publication) => (
                <PublicationCard
                  key={publication.id}
                  publication={publication}
                  onToggleVisibility={handleToggleVisibility}
                  onDelete={handleDeleteClick}
                  isEditing={isEditing}
                  formatCitation={formatCitation}
                  formatAuthors={formatAuthors}
                  formatDate={formatDate}
                  isHidden
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Publication</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this publication from your
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
              Delete Publication
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface PublicationCardProps {
  publication: Publication;
  onToggleVisibility: (publication: Publication) => void;
  onDelete: (publicationId: string) => void;
  isEditing: boolean;
  formatCitation: (publication: Publication) => string;
  formatAuthors: (authors: string[]) => string;
  formatDate: (date: Date) => string;
  isHidden?: boolean;
}

const PublicationCard: React.FC<PublicationCardProps> = ({
  publication,
  onToggleVisibility,
  onDelete,
  isEditing,
  formatCitation,
  formatAuthors,
  formatDate,
  isHidden = false,
}) => {
  return (
    <Card className={isHidden ? "opacity-60" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h4 className="font-medium leading-tight">{publication.title}</h4>

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

              <Badge
                variant={
                  publication.status === "manual" ? "default" : "outline"
                }
              >
                {publication.status}
              </Badge>

              {publication.pmid && (
                <Badge variant="outline">PMID: {publication.pmid}</Badge>
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
          </div>

          {isEditing && (
            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id={`visibility-${publication.id}`}
                  checked={publication.isVisible}
                  onCheckedChange={() => onToggleVisibility(publication)}
                />
                <Label
                  htmlFor={`visibility-${publication.id}`}
                  className="text-xs"
                >
                  {publication.isVisible ? "Visible" : "Hidden"}
                </Label>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(publication.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {publication.abstract && (
          <div className="space-y-2">
            <h5 className="text-sm font-medium">Abstract</h5>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {publication.abstract}
            </p>
          </div>
        )}

        <div className="mt-4 p-3 bg-muted/50 rounded-md">
          <h5 className="text-xs font-medium text-muted-foreground mb-2">
            Citation
          </h5>
          <p className="text-sm">{formatCitation(publication)}</p>
        </div>

        {publication.keywords.length > 0 && (
          <div className="mt-3">
            <h5 className="text-xs font-medium text-muted-foreground mb-2">
              Keywords
            </h5>
            <div className="flex flex-wrap gap-1">
              {publication.keywords.slice(0, 8).map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
              {publication.keywords.length > 8 && (
                <Badge variant="outline" className="text-xs">
                  +{publication.keywords.length - 8} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
