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
            Select Your Medical Specialty
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="h-20 bg-gray-200 animate-pulse rounded-lg"
              />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Stethoscope className="w-5 h-5" />
          Select Your Medical Specialty
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Choose your specialties to see relevant conditions, procedures, and
          reasons for visits. You can select multiple specialties.
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialties.map((specialty) => {
            const isSelected = selectedSpecialties.includes(
              specialty.specialty,
            );
            return (
              <Button
                key={specialty.specialty_id}
                variant={isSelected ? "default" : "outline"}
                className={cn(
                  "h-auto p-4 justify-between group transition-all duration-200",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-md scale-[1.02]"
                    : "hover:bg-accent hover:scale-[1.01]",
                )}
                onClick={() =>
                  onSpecialtyToggle(
                    specialty.specialty,
                    specialty.specialty_id,
                    !isSelected,
                  )
                }
              >
                <div className="flex flex-col items-start gap-1 text-left">
                  <span className="font-medium text-sm leading-tight">
                    {specialty.specialty}
                  </span>
                  {isSelected && (
                    <Badge variant="secondary" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>
                <ChevronRight
                  className={cn(
                    "w-4 h-4 transition-transform group-hover:translate-x-1",
                    isSelected && "text-primary-foreground",
                  )}
                />
              </Button>
            );
          })}
        </div>

        {selectedSpecialties.length > 0 && (
          <div className="mt-6 p-4 bg-accent rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-sm">Selected Specialties</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedSpecialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="outline"
                      className="text-xs"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              <Badge variant="default">Ready</Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
