import React, { useState } from "react";
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
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Comprehensive list of medical professional titles and credentials
const MEDICAL_TITLES = [
  // Medical Degrees
  "MD", // Doctor of Medicine
  "DO", // Doctor of Osteopathic Medicine
  "MBBS", // Bachelor of Medicine, Bachelor of Surgery
  "MBChB", // Bachelor of Medicine, Bachelor of Surgery
  "BMBS", // Bachelor of Medicine, Bachelor of Surgery
  "MBBCh", // Bachelor of Medicine, Bachelor of Surgery
  "MBBChir", // Bachelor of Medicine, Bachelor of Surgery
  "MDCM", // Doctor of Medicine and Master of Surgery

  // Advanced Medical Degrees
  "DMD", // Doctor of Dental Medicine
  "DDS", // Doctor of Dental Surgery
  "DPM", // Doctor of Podiatric Medicine
  "DVM", // Doctor of Veterinary Medicine
  "OD", // Doctor of Optometry
  "PharmD", // Doctor of Pharmacy
  "PsyD", // Doctor of Psychology

  // Academic Degrees
  "PhD", // Doctor of Philosophy
  "ScD", // Doctor of Science
  "DrPH", // Doctor of Public Health
  "MPH", // Master of Public Health
  "MS", // Master of Science
  "MSc", // Master of Science
  "MA", // Master of Arts
  "MSN", // Master of Science in Nursing
  "MBA", // Master of Business Administration
  "MHA", // Master of Health Administration
  "MPA", // Master of Public Administration
  "MPP", // Master of Public Policy

  // Nursing Credentials
  "RN", // Registered Nurse
  "LPN", // Licensed Practical Nurse
  "LVN", // Licensed Vocational Nurse
  "NP", // Nurse Practitioner
  "CNS", // Clinical Nurse Specialist
  "CRNA", // Certified Registered Nurse Anesthetist
  "CNM", // Certified Nurse Midwife
  "APRN", // Advanced Practice Registered Nurse
  "BSN", // Bachelor of Science in Nursing
  "ADN", // Associate Degree in Nursing
  "DNP", // Doctor of Nursing Practice

  // Professional Certifications
  "PA", // Physician Assistant
  "PA-C", // Physician Assistant-Certified
  "RT", // Respiratory Therapist
  "RRT", // Registered Respiratory Therapist
  "CRT", // Certified Respiratory Therapist
  "PT", // Physical Therapist
  "DPT", // Doctor of Physical Therapy
  "OT", // Occupational Therapist
  "OTR", // Occupational Therapist Registered
  "SLP", // Speech-Language Pathologist
  "CCC-SLP", // Certificate of Clinical Competence in Speech-Language Pathology
  "AuD", // Doctor of Audiology
  "RPh", // Registered Pharmacist
  "PharmD", // Doctor of Pharmacy

  // Fellowship and Specialty Certifications
  "FACS", // Fellow of the American College of Surgeons
  "FACP", // Fellow of the American College of Physicians
  "FACEP", // Fellow of the American College of Emergency Physicians
  "FACOG", // Fellow of the American College of Obstetricians and Gynecologists
  "FACC", // Fellow of the American College of Cardiology
  "FAAN", // Fellow of the American Academy of Nursing
  "FAAFP", // Fellow of the American Academy of Family Physicians
  "FAAOS", // Fellow of the American Academy of Orthopaedic Surgeons
  "FAPA", // Fellow of the American Psychiatric Association
  "FCCP", // Fellow of the American College of Chest Physicians
  "FRCSC", // Fellow of the Royal College of Surgeons of Canada
  "FRCP", // Fellow of the Royal College of Physicians
  "FRCS", // Fellow of the Royal College of Surgeons

  // Board Certifications (abbreviated)
  "ABIM", // American Board of Internal Medicine
  "ABFM", // American Board of Family Medicine
  "ABEM", // American Board of Emergency Medicine
  "ABS", // American Board of Surgery
  "ABR", // American Board of Radiology
  "ABP", // American Board of Pediatrics
  "ABOG", // American Board of Obstetrics and Gynecology
  "ABD", // American Board of Dermatology
  "ABPN", // American Board of Psychiatry and Neurology
  "ABRO", // American Board of Radiation Oncology
];

// Categorized titles for better organization
const TITLE_CATEGORIES = {
  "Medical Degrees": [
    "MD",
    "DO",
    "MBBS",
    "MBChB",
    "BMBS",
    "MBBCh",
    "MBBChir",
    "MDCM",
  ],
  "Dental & Specialized Medical": [
    "DMD",
    "DDS",
    "DPM",
    "DVM",
    "OD",
    "PharmD",
    "PsyD",
  ],
  "Academic Degrees": [
    "PhD",
    "ScD",
    "DrPH",
    "MPH",
    "MS",
    "MSc",
    "MA",
    "MSN",
    "MBA",
    "MHA",
    "MPA",
    "MPP",
  ],
  Nursing: [
    "RN",
    "LPN",
    "LVN",
    "NP",
    "CNS",
    "CRNA",
    "CNM",
    "APRN",
    "BSN",
    "ADN",
    "DNP",
  ],
  "Allied Health": [
    "PA",
    "PA-C",
    "RT",
    "RRT",
    "CRT",
    "PT",
    "DPT",
    "OT",
    "OTR",
    "SLP",
    "CCC-SLP",
    "AuD",
    "RPh",
  ],
  Fellowships: [
    "FACS",
    "FACP",
    "FACEP",
    "FACOG",
    "FACC",
    "FAAN",
    "FAAFP",
    "FAAOS",
    "FAPA",
    "FCCP",
    "FRCSC",
    "FRCP",
    "FRCS",
  ],
  "Board Certifications": [
    "ABIM",
    "ABFM",
    "ABEM",
    "ABS",
    "ABR",
    "ABP",
    "ABOG",
    "ABD",
    "ABPN",
    "ABRO",
  ],
};

interface ProfessionalTitleSelectorProps {
  value: string[];
  onChange: (titles: string[]) => void;
  isEditing: boolean;
  className?: string;
}

export function ProfessionalTitleSelector({
  value,
  onChange,
  isEditing,
  className,
}: ProfessionalTitleSelectorProps) {
  const [selectedTitle, setSelectedTitle] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleAddTitle = (title: string) => {
    if (title && !value.includes(title)) {
      onChange([...value, title]);
      setSelectedTitle("");
      setCustomTitle("");
      setShowCustomInput(false);
    }
  };

  const handleRemoveTitle = (titleToRemove: string) => {
    onChange(value.filter((title) => title !== titleToRemove));
  };

  const handleAddCustomTitle = () => {
    if (customTitle.trim()) {
      handleAddTitle(customTitle.trim());
    }
  };

  const availableTitles = MEDICAL_TITLES.filter(
    (title) => !value.includes(title),
  );

  return (
    <div className={cn("space-y-4", className)}>
      {/* Current Titles */}
      <div>
        <Label className="text-base font-semibold">
          Current Titles & Credentials
        </Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((title, index) => (
            <Badge key={index} className="gap-1">
              {title}
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:bg-transparent text-white hover:text-white"
                  onClick={() => handleRemoveTitle(title)}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </Badge>
          ))}
        </div>
        {value.length === 0 && (
          <p className="text-sm text-phase2-dark-gray italic mt-2">
            No professional titles selected
          </p>
        )}
      </div>

      {/* Add New Title */}
      {isEditing && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Add Professional Title
          </Label>

          {/* Dropdown Selection */}
          <div className="flex gap-2">
            <Select
              value={selectedTitle}
              onValueChange={(value) => {
                setSelectedTitle(value);
                setShowCustomInput(false);
              }}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a professional title or credential" />
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {Object.entries(TITLE_CATEGORIES).map(([category, titles]) => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 border-b">
                      {category}
                    </div>
                    {titles
                      .filter((title) => availableTitles.includes(title))
                      .map((title) => (
                        <SelectItem key={title} value={title}>
                          {title}
                        </SelectItem>
                      ))}
                  </div>
                ))}
                {/* Uncategorized titles */}
                {availableTitles.filter(
                  (title) =>
                    !Object.values(TITLE_CATEGORIES).flat().includes(title),
                ).length > 0 && (
                  <div>
                    <div className="px-2 py-1.5 text-sm font-semibold text-gray-500 border-b">
                      Other
                    </div>
                    {availableTitles
                      .filter(
                        (title) =>
                          !Object.values(TITLE_CATEGORIES)
                            .flat()
                            .includes(title),
                      )
                      .map((title) => (
                        <SelectItem key={title} value={title}>
                          {title}
                        </SelectItem>
                      ))}
                  </div>
                )}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => handleAddTitle(selectedTitle)}
              disabled={!selectedTitle}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add
            </Button>
          </div>

          {/* Custom Title Input */}
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-blue-600 hover:text-blue-700"
              onClick={() => setShowCustomInput(!showCustomInput)}
            >
              {showCustomInput ? "Hide custom input" : "Add custom title"}
            </Button>

            {showCustomInput && (
              <div className="flex gap-2">
                <Input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Enter custom professional title"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleAddCustomTitle}
                  disabled={!customTitle.trim()}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            )}
          </div>

          {/* Helper Text */}
          <p className="text-xs text-gray-500">
            Select from common medical professional titles and credentials. You
            can also add custom titles if needed.
          </p>
        </div>
      )}
    </div>
  );
}
