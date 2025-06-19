import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Book,
  Eye,
  EyeOff,
  Clock,
  TrendingUp,
  Calendar,
  Search,
} from "lucide-react";

interface PublicationStatsProps {
  totalPublications: number;
  visiblePublications: number;
  pendingReview: number;
  lastUpdated?: number; // timestamp
}

export const PublicationStats: React.FC<PublicationStatsProps> = ({
  totalPublications,
  visiblePublications,
  pendingReview,
  lastUpdated,
}) => {
  const hiddenPublications = totalPublications - visiblePublications;

  const formatLastUpdated = (timestamp?: number) => {
    if (!timestamp) return "Never";

    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Publications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Publications
          </CardTitle>
          <Book className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalPublications}</div>
          <p className="text-xs text-muted-foreground">
            Publications in your profile
          </p>
        </CardContent>
      </Card>

      {/* Visible Publications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Visible Publications
          </CardTitle>
          <Eye className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">{visiblePublications}</div>
            {totalPublications > 0 && (
              <Badge variant="secondary" className="text-xs">
                {Math.round((visiblePublications / totalPublications) * 100)}%
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Shown on your public profile
          </p>
        </CardContent>
      </Card>

      {/* Hidden Publications */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Hidden Publications
          </CardTitle>
          <EyeOff className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{hiddenPublications}</div>
          <p className="text-xs text-muted-foreground">
            Not shown on public profile
          </p>
        </CardContent>
      </Card>

      {/* Last Updated / Pending Review */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {pendingReview > 0 ? "Pending Review" : "Last Updated"}
          </CardTitle>
          {pendingReview > 0 ? (
            <Search className="h-4 w-4 text-orange-600" />
          ) : (
            <Clock className="h-4 w-4 text-muted-foreground" />
          )}
        </CardHeader>
        <CardContent>
          {pendingReview > 0 ? (
            <>
              <div className="text-2xl font-bold text-orange-600">
                {pendingReview}
              </div>
              <p className="text-xs text-muted-foreground">
                Publications awaiting review
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">
                {formatLastUpdated(lastUpdated)}
              </div>
              <p className="text-xs text-muted-foreground">
                Last publication update
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
