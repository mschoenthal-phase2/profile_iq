import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";
import { MediaList } from "@/components/media-press/MediaList";
import { ManualURLEntry } from "@/components/media-press/ManualURLEntry";
import { MediaStats } from "@/components/media-press/MediaStats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Camera, Plus, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  MediaArticle,
  MediaManagementState,
  MediaDiscoveryResult,
} from "@/types/media-press";
import { urlMetadataService } from "@/services/url-metadata-service";

export default function MediaPress() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [state, setState] = useState<MediaManagementState>({
    articles: [],
    discoveryResults: null,
    isSearching: false,
    searchError: null,
    isLoading: false,
    filters: {},
    manualUrlInput: "",
    isLookingUpUrl: false,
    urlLookupError: null,
  });

  useEffect(() => {
    // Load existing media articles from localStorage or API
    loadExistingArticles();
  }, []);

  const loadExistingArticles = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      // In production, this would load from Supabase
      const savedArticles = localStorage.getItem("userMediaArticles");
      if (savedArticles) {
        const articles = JSON.parse(savedArticles);
        setState((prev) => ({
          ...prev,
          articles: articles.map((article: any) => ({
            ...article,
            publishedDate: article.publishedDate
              ? new Date(article.publishedDate)
              : undefined,
            addedAt: new Date(article.addedAt),
            lastModified: new Date(article.lastModified),
          })),
          isLoading: false,
        }));
      } else {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error loading media articles:", error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        searchError: "Failed to load existing media articles",
      }));
    }
  };

  const handleAddArticleByURL = async (url: string) => {
    setState((prev) => ({
      ...prev,
      isLookingUpUrl: true,
      urlLookupError: null,
    }));

    try {
      const metadata = await urlMetadataService.extractMetadata(url);

      if (!metadata.title) {
        throw new Error("Could not extract article information from the URL");
      }

      const mediaType = urlMetadataService.detectMediaType(url, metadata);

      const article: MediaArticle = {
        id: `manual-${Date.now()}`,
        url: metadata.url,
        title: metadata.title,
        description: metadata.description,
        publishedDate: metadata.publishedDate
          ? new Date(metadata.publishedDate)
          : undefined,
        author: metadata.author,
        publication: metadata.siteName || "Unknown Publication",
        mediaType: mediaType as any,
        imageUrl: metadata.imageUrl,
        tags: metadata.tags || [],
        excerpt: metadata.excerpt,
        wordCount: metadata.wordCount,
        isVisible: true,
        isSelected: true,
        status: "manual",
        addedAt: new Date(),
        lastModified: new Date(),
        isFeatured: false,
      };

      setState((prev) => ({
        ...prev,
        articles: [...prev.articles, article],
        isLookingUpUrl: false,
        manualUrlInput: "",
      }));

      setHasUnsavedChanges(true);
      setShowAddURLDialog(false);

      toast({
        title: "Article Added",
        description: `Successfully added "${metadata.title}" to your media coverage.`,
      });
    } catch (error) {
      console.error("Error adding article by URL:", error);
      setState((prev) => ({
        ...prev,
        isLookingUpUrl: false,
        urlLookupError:
          error instanceof Error ? error.message : "Failed to add article",
      }));

      toast({
        title: "Failed to Add Article",
        description:
          "Could not extract article information from the URL. Please check the URL and try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateArticle = (updatedArticle: MediaArticle) => {
    setState((prev) => ({
      ...prev,
      articles: prev.articles.map((article) =>
        article.id === updatedArticle.id ? updatedArticle : article,
      ),
    }));
    setHasUnsavedChanges(true);
  };

  const handleDeleteArticle = (articleId: string) => {
    setState((prev) => ({
      ...prev,
      articles: prev.articles.filter((article) => article.id !== articleId),
    }));
    setHasUnsavedChanges(true);

    toast({
      title: "Article Removed",
      description: "Article has been removed from your profile.",
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Save to localStorage (in production, this would save to Supabase)
      localStorage.setItem("userMediaArticles", JSON.stringify(state.articles));

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setHasUnsavedChanges(false);
      setIsEditing(false);

      toast({
        title: "Media Coverage Saved",
        description: "Your media coverage has been successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save media coverage. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      setIsEditing(false);
    }
  };

  const handleBackToDashboard = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      // Always navigate to dashboard, preserving state if available
      const dashboardState = location.state?.dashboardState;
      if (dashboardState) {
        navigate("/dashboard", { state: dashboardState });
      } else {
        // Force navigation to dashboard
        navigate("/dashboard", { replace: true });
      }
    }
  };

  const handleConfirmDiscard = () => {
    setHasUnsavedChanges(false);
    setIsEditing(false);
    setShowUnsavedDialog(false);
    // Always navigate to dashboard, preserving state if available
    const dashboardState = location.state?.dashboardState;
    if (dashboardState) {
      navigate("/dashboard", { state: dashboardState });
    } else {
      // Force navigation to dashboard
      navigate("/dashboard", { replace: true });
    }
  };

  const handleSaveAndReturn = async () => {
    await handleSave();
    setShowUnsavedDialog(false);
    // Always navigate to dashboard, preserving state if available
    const dashboardState = location.state?.dashboardState;
    if (dashboardState) {
      navigate("/dashboard", { state: dashboardState });
    } else {
      // Force navigation to dashboard
      navigate("/dashboard", { replace: true });
    }
  };

  const handleCloseUnsavedDialog = () => {
    setShowUnsavedDialog(false);
  };

  const approvedArticles = state.articles.filter(
    (article) => article.status === "approved" || article.status === "manual",
  );
  const visibleArticles = approvedArticles.filter(
    (article) => article.isVisible,
  );

  return (
    <ProfileSectionLayout
      title="Media & Press"
      description="Manage your media coverage and press appearances"
      isEditing={isEditing}
      isSaving={isSaving}
      hasUnsavedChanges={hasUnsavedChanges}
      showUnsavedDialog={showUnsavedDialog}
      onEdit={handleEdit}
      onSave={handleSave}
      onCancel={handleCancel}
      onBackToDashboard={handleBackToDashboard}
      onConfirmDiscard={handleConfirmDiscard}
      onSaveAndReturn={handleSaveAndReturn}
      onCloseUnsavedDialog={handleCloseUnsavedDialog}
      dashboardState={location.state?.dashboardState}
    >
      <div className="space-y-6">
        {/* Statistics Overview */}
        <MediaStats
          totalArticles={approvedArticles.length}
          visibleArticles={visibleArticles.length}
          featuredArticles={
            approvedArticles.filter((article) => article.isFeatured).length
          }
          lastUpdated={
            approvedArticles.length > 0
              ? Math.max(
                  ...approvedArticles.map((article) =>
                    article.lastModified.getTime(),
                  ),
                )
              : undefined
          }
        />

        {/* Error Alert */}
        {state.searchError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.searchError}</AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Your Media Coverage
                {approvedArticles.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {approvedArticles.length}
                  </Badge>
                )}
              </CardTitle>

              <Dialog
                open={showAddURLDialog}
                onOpenChange={setShowAddURLDialog}
              >
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Article
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5" />
                      Add Article by URL
                    </DialogTitle>
                  </DialogHeader>
                  <ManualURLEntry
                    onAddByURL={handleAddArticleByURL}
                    isLoading={state.isLookingUpUrl}
                    error={state.urlLookupError}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <MediaList
              articles={approvedArticles}
              onUpdateArticle={handleUpdateArticle}
              onDeleteArticle={handleDeleteArticle}
              isEditing={isEditing}
            />
          </CardContent>
        </Card>
      </div>
    </ProfileSectionLayout>
  );
}
