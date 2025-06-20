import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpecialtyData {
  name: string;
  type: "primary" | "additional";
  taxonomyCode?: string;
  boardCertified?: boolean;
  certifyingBoard?: string;
}

interface AddSpecialtyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddSpecialty: (specialty: SpecialtyData) => void;
  existingSpecialties: string[];
  isLoading?: boolean;
}

// Common medical specialties
const MEDICAL_SPECIALTIES = [
  "Allergy and Immunology",
  "Anesthesiology",
  "Cardiology",
  "Cardiovascular Surgery",
  "Dermatology",
  "Emergency Medicine",
  "Endocrinology",
  "Family Medicine",
  "Gastroenterology",
  "General Surgery",
  "Geriatrics",
  "Hematology",
  "Infectious Disease",
  "Internal Medicine",
  "Interventional Cardiology",
  "Nephrology",
  "Neurology",
  "Neurosurgery",
  "Obstetrics and Gynecology",
  "Oncology",
  "Ophthalmology",
  "Orthopedic Surgery",
  "Otolaryngology",
  "Pathology",
  "Pediatrics",
  "Physical Medicine and Rehabilitation",
  "Plastic Surgery",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Rheumatology",
  "Sports Medicine",
  "Urology",
  "Vascular Surgery",
];

// Common subspecialties
const SUBSPECIALTIES = [
  "Acute Care Surgery",
  "Bariatric Surgery",
  "Cardiac Electrophysiology",
  "Colorectal Surgery",
  "Critical Care Medicine",
  "Endocrine Surgery",
  "Hand Surgery",
  "Hepatobiliary Surgery",
  "Interventional Radiology",
  "Laparoscopic Surgery",
  "Maternal-Fetal Medicine",
  "Minimally Invasive Surgery",
  "Mohs Surgery",
  "Pediatric Surgery",
  "Reproductive Endocrinology",
  "Robotic Surgery",
  "Spine Surgery",
  "Surgical Oncology",
  "Thoracic Surgery",
  "Transplant Surgery",
  "Trauma Surgery",
  "Vascular and Interventional Radiology",
];

const CERTIFYING_BOARDS = [
  "American Board of Anesthesiology",
  "American Board of Dermatology",
  "American Board of Emergency Medicine",
  "American Board of Family Medicine",
  "American Board of Internal Medicine",
  "American Board of Medical Specialties",
  "American Board of Neurological Surgery",
  "American Board of Obstetrics and Gynecology",
  "American Board of Ophthalmology",
  "American Board of Orthopaedic Surgery",
  "American Board of Pathology",
  "American Board of Pediatrics",
  "American Board of Plastic Surgery",
  "American Board of Psychiatry and Neurology",
  "American Board of Radiology",
  "American Board of Surgery",
  "American Board of Urology",
];

export function AddSpecialtyDialog({
  open,
  onOpenChange,
  onAddSpecialty,
  existingSpecialties,
  isLoading = false,
}: AddSpecialtyDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "additional" as "primary" | "additional",
    taxonomyCode: "",
    boardCertified: false,
    certifyingBoard: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSpecialties, setFilteredSpecialties] = useState<string[]>([]);
  const [customSpecialty, setCustomSpecialty] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSpecialties([]);
      return;
    }

    const allSpecialties = [...MEDICAL_SPECIALTIES, ...SUBSPECIALTIES];
    const filtered = allSpecialties
      .filter(
        (specialty) =>
          specialty.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !existingSpecialties.includes(specialty),
      )
      .slice(0, 10);

    setFilteredSpecialties(filtered);
  }, [searchQuery, existingSpecialties]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user makes changes
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSpecialtySelect = (specialty: string) => {
    setFormData((prev) => ({ ...prev, name: specialty }));
    setSearchQuery(specialty);
    setFilteredSpecialties([]);
    setShowCustomInput(false);
    setCustomSpecialty("");
  };

  const handleCustomSpecialtyAdd = () => {
    if (customSpecialty.trim()) {
      setFormData((prev) => ({ ...prev, name: customSpecialty.trim() }));
      setSearchQuery(customSpecialty.trim());
      setShowCustomInput(false);
      setCustomSpecialty("");
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Specialty name is required";
    }

    if (existingSpecialties.includes(formData.name)) {
      newErrors.name = "This specialty is already added";
    }

    if (formData.boardCertified && !formData.certifyingBoard) {
      newErrors.certifyingBoard = "Please select certifying board";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onAddSpecialty(formData);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      type: "additional",
      taxonomyCode: "",
      boardCertified: false,
      certifyingBoard: "",
    });
    setSearchQuery("");
    setFilteredSpecialties([]);
    setCustomSpecialty("");
    setShowCustomInput(false);
    setErrors({});
    onOpenChange(false);
  };

  const clearSpecialtySelection = () => {
    setFormData((prev) => ({ ...prev, name: "" }));
    setSearchQuery("");
    setFilteredSpecialties([]);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add Medical Specialty</DialogTitle>
          <DialogDescription>
            Add a new medical specialty to your profile. Search for existing
            specialties or add a custom one.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden">
          {/* Specialty Type */}
          <div>
            <Label htmlFor="type">Specialty Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                handleInputChange("type", value as "primary" | "additional")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Primary Specialty</SelectItem>
                <SelectItem value="additional">Additional Specialty</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Specialty Search */}
          <div>
            <Label htmlFor="specialtySearch">Specialty Name *</Label>
            {formData.name ? (
              <div className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                <span className="font-medium">{formData.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSpecialtySelection}
                  className="h-auto p-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="specialtySearch"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for medical specialty..."
                    className={cn("pl-10", errors.name && "border-red-500")}
                  />
                </div>

                {/* Search Results */}
                {filteredSpecialties.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                    <ScrollArea className="max-h-48">
                      {filteredSpecialties.map((specialty) => (
                        <button
                          key={specialty}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 border-b last:border-b-0"
                          onClick={() => handleSpecialtySelect(specialty)}
                        >
                          {specialty}
                        </button>
                      ))}
                    </ScrollArea>
                    <div className="border-t p-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-blue-600"
                        onClick={() => setShowCustomInput(true)}
                      >
                        Add "{searchQuery}" as custom specialty
                      </Button>
                    </div>
                  </div>
                )}

                {/* Custom Specialty Input */}
                {showCustomInput && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3">
                    <Label
                      htmlFor="customSpecialty"
                      className="text-sm font-medium"
                    >
                      Custom Specialty Name
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="customSpecialty"
                        value={customSpecialty}
                        onChange={(e) => setCustomSpecialty(e.target.value)}
                        placeholder="Enter specialty name"
                        className="flex-1"
                      />
                      <Button
                        size="sm"
                        onClick={handleCustomSpecialtyAdd}
                        disabled={!customSpecialty.trim()}
                      >
                        Add
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => setShowCustomInput(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Board Certification */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="boardCertified"
              checked={formData.boardCertified}
              onCheckedChange={(checked) =>
                handleInputChange("boardCertified", checked as boolean)
              }
            />
            <Label
              htmlFor="boardCertified"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Board Certified in this specialty
            </Label>
          </div>

          {/* Certifying Board */}
          {formData.boardCertified && (
            <div>
              <Label htmlFor="certifyingBoard">Certifying Board *</Label>
              <Select
                value={formData.certifyingBoard}
                onValueChange={(value) =>
                  handleInputChange("certifyingBoard", value)
                }
              >
                <SelectTrigger
                  className={errors.certifyingBoard ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select certifying board" />
                </SelectTrigger>
                <SelectContent>
                  <ScrollArea className="h-48">
                    {CERTIFYING_BOARDS.map((board) => (
                      <SelectItem key={board} value={board}>
                        {board}
                      </SelectItem>
                    ))}
                  </ScrollArea>
                </SelectContent>
              </Select>
              {errors.certifyingBoard && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.certifyingBoard}
                </p>
              )}
            </div>
          )}

          {/* Taxonomy Code */}
          <div>
            <Label htmlFor="taxonomyCode">Taxonomy Code (Optional)</Label>
            <Input
              id="taxonomyCode"
              value={formData.taxonomyCode}
              onChange={(e) =>
                handleInputChange("taxonomyCode", e.target.value)
              }
              placeholder="e.g., 208600000X"
            />
            <p className="text-xs text-gray-500 mt-1">
              Healthcare Provider Taxonomy Code if known
            </p>
          </div>

          {/* Existing Specialties Display */}
          {existingSpecialties.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Current Specialties
              </Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {existingSpecialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !formData.name}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Specialty
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
