import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Eye,
  EyeOff,
  Clock,
  Star,
  Calendar,
  TrendingUp,
} from "lucide-react";

interface MediaStatsProps {
  totalArticles: number;
  visibleArticles: number;
  featuredArticles: number;
  lastUpdated?: number; // timestamp
}

export const MediaStats: React.FC<MediaStatsProps> = ({
  totalArticles,
  visibleArticles,
  featuredArticles,
  lastUpdated,
}) => {
  const hiddenArticles = totalArticles - visibleArticles;

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
      {/* Total Media Coverage */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Media Coverage
          </CardTitle>
          <Camera className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalArticles}</div>
          <p className="text-xs text-muted-foreground">
            Articles in your profile
          </p>
        </CardContent>
      </Card>

      {/* Visible Articles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Visible Articles
          </CardTitle>
          <Eye className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">{visibleArticles}</div>
            {totalArticles > 0 && (
              <Badge variant="secondary" className="text-xs">
                {Math.round((visibleArticles / totalArticles) * 100)}%
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Shown on your public profile
          </p>
        </CardContent>
      </Card>

      {/* Featured Articles */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Featured Articles
          </CardTitle>
          <Star className="h-4 w-4 text-yellow-600" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <div className="text-2xl font-bold">{featuredArticles}</div>
            {visibleArticles > 0 && (
              <Badge variant="secondary" className="text-xs">
                {Math.round((featuredArticles / visibleArticles) * 100)}%
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Highlighted on your profile
          </p>
        </CardContent>
      </Card>

      {/* Last Updated */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatLastUpdated(lastUpdated)}
          </div>
          <p className="text-xs text-muted-foreground">
            Last media coverage update
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
