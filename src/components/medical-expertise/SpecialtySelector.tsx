import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, ChevronRight } from "lucide-react";
import { MedicalSpecialty } from "@/types/medical-expertise";
import { cn } from "@/lib/utils";

interface SpecialtySelectorProps {
  specialties: MedicalSpecialty[];
  selectedSpecialties: string[];
  onSpecialtyToggle: (
    specialty: string,
    specialtyId: number,
    isSelected: boolean,
  ) => void;
  loading: boolean;
  isEditing: boolean;
}

export function SpecialtySelector({
  specialties,
  selectedSpecialties,
  onSpecialtyToggle,
  loading,
  isEditing,
}: SpecialtySelectorProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            Medical Specialties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  // View mode - just show selected specialties
  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5" />
            Medical Specialties
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedSpecialties.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedSpecialties.map((specialty, index) => (
                <Badge
                  key={`${specialty}-${index}`}
                  variant="default"
                  className="px-3 py-1"
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No specialties selected
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Edit mode - show all specialties with compact design
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5" />
          Select Medical Specialties
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose your specialties. You can select multiple specialties.
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty) => {
            const isSelected = selectedSpecialties.includes(
              specialty.specialty,
            );
            return (
              <Button
                key={specialty.specialty_id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-auto px-3 py-2 transition-all duration-200",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent",
                )}
                onClick={() =>
                  onSpecialtyToggle(
                    specialty.specialty,
                    specialty.specialty_id,
                    !isSelected,
                  )
                }
              >
                <span className="text-sm">{specialty.specialty}</span>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
