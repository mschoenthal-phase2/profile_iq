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
import {
  Camera,
  Calendar,
  ExternalLink,
  Eye,
  EyeOff,
  Trash2,
  Building2,
  User,
  Star,
  FileText,
} from "lucide-react";
import {
  MediaArticle,
  MEDIA_TYPES,
  MEDIA_STATUS_LABELS,
} from "@/types/media-press";
import { cn } from "@/lib/utils";

interface MediaListProps {
  articles: MediaArticle[];
  onUpdateArticle: (article: MediaArticle) => void;
  onDeleteArticle: (articleId: string) => void;
  isEditing: boolean;
}

export const MediaList: React.FC<MediaListProps> = ({
  articles,
  onUpdateArticle,
  onDeleteArticle,
  isEditing,
}) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggleVisibility = (article: MediaArticle) => {
    const updatedArticle = {
      ...article,
      isVisible: !article.isVisible,
      lastModified: new Date(),
    };
    onUpdateArticle(updatedArticle);
  };

  const handleToggleFeatured = (article: MediaArticle) => {
    const updatedArticle = {
      ...article,
      isFeatured: !article.isFeatured,
      lastModified: new Date(),
    };
    onUpdateArticle(updatedArticle);
  };

  const handleMediaTypeChange = (article: MediaArticle, newType: string) => {
    const updatedArticle = {
      ...article,
      mediaType: newType as any,
      lastModified: new Date(),
    };
    onUpdateArticle(updatedArticle);
  };

  const handleDeleteClick = (articleId: string) => {
    setDeletingId(articleId);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      onDeleteArticle(deletingId);
      setDeletingId(null);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return "Date not available";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMediaTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return "🎥";
      case "podcast":
        return "🎙️";
      case "interview":
        return "💬";
      case "blog_post":
        return "📝";
      case "press_release":
        return "📰";
      case "opinion":
        return "💭";
      default:
        return "📄";
    }
  };

  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-raleway font-semibold text-phase2-soft-black mb-2">
          No media coverage found yet
        </h3>
        <p className="text-sm text-muted-foreground">
          Use the "Media Discovery" tab or "Add Article" button to add media
          coverage to your profile
        </p>
      </div>
    );
  }

  const visibleArticles = articles.filter((article) => article.isVisible);
  const hiddenArticles = articles.filter((article) => !article.isVisible);
  const featuredArticles = articles.filter((article) => article.isFeatured);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-phase2-blue rounded-full"></div>
              <span className="font-medium">
                {articles.length} Total Articles
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>{visibleArticles.length} Visible</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted-foreground rounded-full"></div>
              <span>{hiddenArticles.length} Hidden</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span>{featuredArticles.length} Featured</span>
            </div>
          </div>
          {isEditing && (
            <p className="text-xs text-muted-foreground">
              Toggle visibility, feature articles, or remove using the controls
              on each card
            </p>
          )}
        </div>
      </div>

      {/* All Articles - Single List */}
      <div className="space-y-4">
        {articles.map((article) => (
          <MediaArticleCard
            key={article.id}
            article={article}
            onToggleVisibility={handleToggleVisibility}
            onToggleFeatured={handleToggleFeatured}
            onMediaTypeChange={handleMediaTypeChange}
            onDelete={handleDeleteClick}
            isEditing={isEditing}
            formatDate={formatDate}
            getMediaTypeIcon={getMediaTypeIcon}
            isHidden={!article.isVisible}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Article</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this article from your profile?
              This action cannot be undone.
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
              Delete Article
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

interface MediaArticleCardProps {
  article: MediaArticle;
  onToggleVisibility: (article: MediaArticle) => void;
  onToggleFeatured: (article: MediaArticle) => void;
  onMediaTypeChange: (article: MediaArticle, type: string) => void;
  onDelete: (articleId: string) => void;
  isEditing: boolean;
  formatDate: (date?: Date) => string;
  getMediaTypeIcon: (type: string) => string;
  isHidden?: boolean;
}

const MediaArticleCard: React.FC<MediaArticleCardProps> = ({
  article,
  onToggleVisibility,
  onToggleFeatured,
  onMediaTypeChange,
  onDelete,
  isEditing,
  formatDate,
  getMediaTypeIcon,
  isHidden = false,
}) => {
  return (
    <Card
      className={cn(
        "border-2 transition-all duration-200 hover:shadow-md",
        isHidden
          ? "border-muted bg-muted/30 opacity-75"
          : "border-phase2-net-gray",
        article.isFeatured && "ring-2 ring-yellow-200 border-yellow-300",
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            {/* Article Image or Icon */}
            <div
              className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                article.isVisible ? "bg-phase2-blue/10" : "bg-muted",
              )}
            >
              {article.imageUrl ? (
                <img
                  src={article.imageUrl}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-xl">
                  {getMediaTypeIcon(article.mediaType)}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-raleway font-semibold text-phase2-soft-black line-clamp-2 mb-2">
                {article.title}
              </h4>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Building2 className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{article.publication}</span>
                </span>
                {article.author && (
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{article.author}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 flex-shrink-0" />
                  {formatDate(article.publishedDate)}
                </span>
                {article.wordCount && (
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 flex-shrink-0" />
                    {article.wordCount} words
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap mb-3">
                <Badge variant="secondary">
                  {
                    MEDIA_TYPES.find((type) => type.value === article.mediaType)
                      ?.label
                  }
                </Badge>

                <Badge
                  variant={article.status === "manual" ? "default" : "outline"}
                >
                  {MEDIA_STATUS_LABELS[article.status] || article.status}
                </Badge>

                {article.isFeatured && (
                  <Badge
                    variant="default"
                    className="bg-yellow-100 text-yellow-800 border-yellow-200"
                  >
                    <Star className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                )}

                {article.isVisible ? (
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
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 text-xs flex items-center gap-1"
                >
                  View Article
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Article Description */}
              {article.description && (
                <div className="mb-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.description}
                  </p>
                </div>
              )}

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    Tags:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {article.tags.slice(0, 6).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {article.tags.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{article.tags.length - 6} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id={`visibility-${article.id}`}
                  checked={article.isVisible}
                  onCheckedChange={() => onToggleVisibility(article)}
                />
                <Label
                  htmlFor={`visibility-${article.id}`}
                  className="text-xs cursor-pointer"
                >
                  {article.isVisible ? "Visible" : "Hidden"}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id={`featured-${article.id}`}
                  checked={article.isFeatured}
                  onCheckedChange={() => onToggleFeatured(article)}
                />
                <Label
                  htmlFor={`featured-${article.id}`}
                  className="text-xs cursor-pointer"
                >
                  Featured
                </Label>
              </div>

              <div className="space-y-1">
                <Label className="text-xs">Media Type</Label>
                <Select
                  value={article.mediaType}
                  onValueChange={(value) => onMediaTypeChange(article, value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDIA_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(article.id)}
                className="text-destructive hover:text-destructive hover:border-destructive"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      {/* Excerpt */}
      {article.excerpt && (
        <CardContent className="pt-0">
          <div className="mt-2 p-3 bg-muted/50 rounded-md">
            <h5 className="text-xs font-medium text-muted-foreground mb-2">
              Excerpt
            </h5>
            <p className="text-sm line-clamp-3">{article.excerpt}</p>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
