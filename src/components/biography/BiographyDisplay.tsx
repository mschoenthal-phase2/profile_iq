import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Users, Heart, Edit3, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

interface BiographyDisplayProps {
  title: string;
  content: string;
  description: string;
  targetAudience: "professional" | "public";
  isGenerating?: boolean;
  onCopy?: () => void;
  onContentChange?: (content: string) => void;
  className?: string;
}

export function BiographyDisplay({
  title,
  content,
  description,
  targetAudience,
  isGenerating = false,
  onCopy,
  onContentChange,
  className,
}: BiographyDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);

  const handleCopy = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: `${title} has been copied to your clipboard.`,
      });
      onCopy?.();
    } catch (error) {
      console.error("Copy failed:", error);
      toast({
        title: "Failed to copy",
        description: "Unable to copy content to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setEditContent(content);
    setIsEditing(true);
  };

  const handleSave = () => {
    onContentChange?.(editContent);
    setIsEditing(false);
    toast({
      title: "Biography updated",
      description: `${title} has been saved.`,
    });
  };

  const handleCancel = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const getIcon = () => {
    return targetAudience === "professional" ? (
      <Users className="w-5 h-5 text-phase2-blue" />
    ) : (
      <Heart className="w-5 h-5 text-green-600" />
    );
  };

  const getAudienceLabel = () => {
    return targetAudience === "professional"
      ? "For Medical Professionals"
      : "For Patients";
  };

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-raleway">
            {getIcon()}
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="text-xs font-raleway p-2"
                  title="Cancel"
                >
                  <X className="w-3 h-3" />
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  className="text-xs font-raleway p-2"
                  title="Save"
                >
                  <Check className="w-3 h-3" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEdit}
                  disabled={!content || isGenerating}
                  className="text-xs font-raleway p-2"
                  title="Edit"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  disabled={!content || isGenerating}
                  className="text-xs font-raleway p-2"
                  title="Copy"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className={cn(
              "px-2 py-1 rounded-full font-medium",
              targetAudience === "professional"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700",
            )}
          >
            {getAudienceLabel()}
          </span>
        </div>
        {description && (
          <p className="text-sm text-phase2-dark-gray font-raleway">
            {description}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {isGenerating ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-phase2-blue border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : content ? (
          isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[200px] font-raleway text-sm leading-relaxed resize-none"
                placeholder={`Edit your ${targetAudience} biography...`}
              />
              <div className="text-xs text-phase2-dark-gray font-raleway">
                {editContent.length} characters
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <p className="text-sm text-phase2-soft-black font-raleway leading-relaxed whitespace-pre-wrap">
                {content}
              </p>
            </div>
          )
        ) : (
          <div className="text-center py-8 text-phase2-dark-gray">
            <p className="font-raleway text-sm">
              No biography generated yet. Add your personal information above
              and click "Regenerate Biographies" to get started.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
