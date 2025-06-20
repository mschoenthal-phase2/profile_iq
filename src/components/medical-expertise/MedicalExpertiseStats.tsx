import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Scissors,
  UserCheck,
  TrendingUp,
  Clock,
  Stethoscope,
} from "lucide-react";
import { MedicalExpertiseStats } from "@/types/medical-expertise";
import { formatDistanceToNow } from "date-fns";

interface MedicalExpertiseStatsProps {
  stats: MedicalExpertiseStats;
  loading?: boolean;
}

export function MedicalExpertiseStatsComponent({
  stats,
  loading = false,
}: MedicalExpertiseStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="h-20 bg-gray-200 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Selected Specialty",
      value: stats.selectedSpecialty || "Not Selected",
      icon: Stethoscope,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: stats.selectedSpecialty
        ? "Primary specialty"
        : "Choose specialty first",
    },
    {
      title: "Conditions",
      value: stats.totalConditions.toString(),
      icon: Heart,
      color: "text-red-600",
      bgColor: "bg-red-50",
      description: `${stats.totalConditions} conditions selected`,
    },
    {
      title: "Procedures",
      value: stats.totalProcedures.toString(),
      icon: Scissors,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: `${stats.totalProcedures} procedures selected`,
    },
    {
      title: "Reasons for Visit",
      value: stats.totalReasonsForVisit.toString(),
      icon: UserCheck,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: `${stats.totalReasonsForVisit} reasons selected`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-xl font-bold">{stat.value}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Medical Expertise Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {stats.totalItems}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Selected Items
              </div>
            </div>
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {stats.selectedSpecialty ? "1" : "0"}
              </div>
              <div className="text-sm text-muted-foreground">
                Specialty Selected
              </div>
            </div>
            <div className="text-center p-4 bg-accent rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(
                  ((stats.totalConditions > 0 ? 1 : 0) +
                    (stats.totalProcedures > 0 ? 1 : 0) +
                    (stats.totalReasonsForVisit > 0 ? 1 : 0)) *
                    33.33,
                )}
                %
              </div>
              <div className="text-sm text-muted-foreground">
                Profile Completion
              </div>
            </div>
          </div>

          {/* Breakdown by Category */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Expertise Breakdown</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium">Conditions</span>
                </div>
                <Badge variant="secondary">{stats.totalConditions}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Procedures</span>
                </div>
                <Badge variant="secondary">{stats.totalProcedures}</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Reasons for Visit</span>
                </div>
                <Badge variant="secondary">{stats.totalReasonsForVisit}</Badge>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          {stats.lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
              <Clock className="w-4 h-4" />
              <span>
                Last updated {formatDistanceToNow(stats.lastUpdated)} ago
              </span>
            </div>
          )}

          {/* Profile Status */}
          <div className="pt-2">
            {stats.totalItems === 0 ? (
              <Badge variant="outline" className="w-full justify-center py-2">
                No expertise selected yet
              </Badge>
            ) : stats.totalItems < 5 ? (
              <Badge variant="secondary" className="w-full justify-center py-2">
                Getting started
              </Badge>
            ) : stats.totalItems < 15 ? (
              <Badge variant="default" className="w-full justify-center py-2">
                Good progress
              </Badge>
            ) : (
              <Badge
                variant="default"
                className="w-full justify-center py-2 bg-green-600 hover:bg-green-700"
              >
                Comprehensive profile
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
