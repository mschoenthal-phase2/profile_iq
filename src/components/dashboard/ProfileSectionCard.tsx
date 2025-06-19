import React from "react";
import { ProfileSection } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  User,
  Briefcase,
  Shield,
  Stethoscope,
  BookOpen,
  TestTube,
  MapPin,
  GraduationCap,
  UserCircle,
  Camera,
  Edit,
  Eye,
  Clock,
} from "lucide-react";

interface ProfileSectionCardProps {
  section: ProfileSection;
  onEdit: () => void;
  onReview: () => void;
}

const iconMap = {
  award: Award,
  user: User,
  briefcase: Briefcase,
  shield: Shield,
  stethoscope: Stethoscope,
  "book-open": BookOpen,
  flask: TestTube,
  "map-pin": MapPin,
  "graduation-cap": GraduationCap,
  "user-circle": UserCircle,
  camera: Camera,
};

export const ProfileSectionCard: React.FC<ProfileSectionCardProps> = ({
  section,
  onEdit,
  onReview,
}) => {
  const Icon = iconMap[section.icon as keyof typeof iconMap] || User;

  const getStatusColor = (status: ProfileSection["status"]) => {
    switch (status) {
      case "complete":
        return "bg-green-100 text-green-800 border-green-200";
      case "needs_update":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "missing":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: ProfileSection["status"]) => {
    switch (status) {
      case "complete":
        return "Complete";
      case "needs_update":
        return "Needs Update";
      case "missing":
        return "Missing";
      default:
        return "Unknown";
    }
  };

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? "s" : ""} ago`;
    if (diffDays < 365)
      return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? "s" : ""} ago`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) !== 1 ? "s" : ""} ago`;
  };

  return (
    <Card
      className={`border-2 transition-all duration-200 hover:shadow-md ${
        section.status === "needs_update"
          ? "border-orange-200 bg-orange-50/30"
          : "border-phase2-net-gray"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                section.status === "needs_update"
                  ? "bg-orange-100"
                  : "bg-phase2-blue/10"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  section.status === "needs_update"
                    ? "text-orange-600"
                    : "text-phase2-blue"
                }`}
              />
            </div>
            <div>
              <h3 className="font-raleway font-semibold text-phase2-soft-black">
                {section.title}
                {section.isRequired && (
                  <span className="text-phase2-karma-coral ml-1">*</span>
                )}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-3 h-3 text-phase2-dark-gray" />
                <span className="text-xs text-phase2-dark-gray font-raleway">
                  Updated {formatLastUpdated(section.lastUpdated)}
                </span>
              </div>
            </div>
          </div>
          <Badge className={`text-xs ${getStatusColor(section.status)}`}>
            {getStatusText(section.status)}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          {section.status === "needs_update" ? (
            <Button size="sm" onClick={onReview} className="flex-1">
              <Eye className="w-4 h-4 mr-1" />
              Review
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onReview}
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
