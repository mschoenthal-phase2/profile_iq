import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";
import {
  PracticeEssentialsData,
  PatientCare,
  LanguageSpoken,
  LanguageProficiency,
  AGE_GROUPS,
  APPOINTMENT_TYPES,
  PROFICIENCY_LEVELS,
  COMMON_LANGUAGES,
  getLanguageByCode,
  getProficiencyLabel,
  validatePracticeEssentials,
} from "@/types/practice";
import {
  Heart,
  Plus,
  X,
  Search,
  Globe,
  Users,
  Calendar,
  StickyNote,
} from "lucide-react";

export default function PracticeEssentials() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [languageSearch, setLanguageSearch] = useState("");

  // Get dashboard state from navigation or use mock data
  const dashboardState = location.state?.dashboardState || {
    signupData: {
      fullName: "Justin Dimick",
      email: "jdimick@med.umich.edu",
      jobTitle: "Professor and Chair of Surgery",
      organization: "University of Michigan",
    },
    npiProvider: {
      number: "1578714549",
      enumeration_type: "NPI-1",
      basic: {
        first_name: "Justin",
        last_name: "Dimick",
        credential: "MD",
        gender: "M",
      },
    },
  };

  // Initial data
  const initialData: PracticeEssentialsData = {
    patientCare: {
      acceptingNewPatients: true,
      ageGroupsTreated: ["adults", "seniors"],
      appointmentTypes: ["in-person", "telemedicine"],
      schedulingNotes:
        "Please call to schedule. Same-day appointments available for urgent surgical consultations.",
    },
    languagesSpoken: [
      {
        id: "1",
        languageCode: "en-US",
        languageName: "English (United States)",
        proficiency: "native",
      },
      {
        id: "2",
        languageCode: "es-US",
        languageName: "Spanish (United States)",
        proficiency: "conversational",
      },
    ],
  };

  const [formData, setFormData] = useState<PracticeEssentialsData>(initialData);
  const [originalData, setOriginalData] =
    useState<PracticeEssentialsData>(initialData);

  useEffect(() => {
    if (location.state?.isEditing) {
      setIsEditing(true);
    }
  }, [location.state]);

  useEffect(() => {
    const hasChanges =
      JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasUnsavedChanges(hasChanges);
  }, [formData, originalData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Validate form data
      const errors = validatePracticeEssentials(formData);
      if (errors.length > 0) {
        console.error("Validation errors:", errors);
        alert("Please fix the following errors:\n" + errors.join("\n"));
        return;
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOriginalData(formData);
      setIsEditing(false);
      setHasUnsavedChanges(false);
      navigate("/dashboard", { state: dashboardState });
    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      setShowUnsavedDialog(true);
    } else {
      setIsEditing(false);
      setFormData(originalData);
    }
  };

  const handleBackToDashboard = () => {
    if (hasUnsavedChanges && isEditing) {
      setShowUnsavedDialog(true);
    } else {
      navigate("/dashboard", { state: dashboardState });
    }
  };

  const confirmDiscard = () => {
    setFormData(originalData);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setShowUnsavedDialog(false);
    navigate("/dashboard", { state: dashboardState });
  };

  const handleSaveAndReturn = async () => {
    setShowUnsavedDialog(false);
    await handleSave();
  };

  // Patient Care handlers
  const updatePatientCare = (field: keyof PatientCare, value: any) => {
    setFormData((prev) => ({
      ...prev,
      patientCare: {
        ...prev.patientCare,
        [field]: value,
      },
    }));
  };

  const handleAgeGroupChange = (ageGroupId: string, checked: boolean) => {
    const currentGroups = formData.patientCare.ageGroupsTreated;
    const updatedGroups = checked
      ? [...currentGroups, ageGroupId]
      : currentGroups.filter((id) => id !== ageGroupId);

    updatePatientCare("ageGroupsTreated", updatedGroups);
  };

  const handleAppointmentTypeChange = (
    appointmentTypeId: string,
    checked: boolean,
  ) => {
    const currentTypes = formData.patientCare.appointmentTypes;
    const updatedTypes = checked
      ? [...currentTypes, appointmentTypeId]
      : currentTypes.filter((id) => id !== appointmentTypeId);

    updatePatientCare("appointmentTypes", updatedTypes);
  };

  // Language handlers
  const addLanguage = () => {
    const newLanguage: LanguageSpoken = {
      id: Date.now().toString(),
      languageCode: "",
      languageName: "",
      proficiency: "basic",
    };
    setFormData((prev) => ({
      ...prev,
      languagesSpoken: [...prev.languagesSpoken, newLanguage],
    }));
  };

  const updateLanguage = (
    index: number,
    field: keyof LanguageSpoken,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.map((lang, i) =>
        i === index ? { ...lang, [field]: value } : lang,
      ),
    }));
  };

  const handleLanguageSelect = (index: number, languageCode: string) => {
    const language = getLanguageByCode(languageCode);
    if (language) {
      updateLanguage(index, "languageCode", languageCode);
      updateLanguage(index, "languageName", language.name);
    }
  };

  const removeLanguage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      languagesSpoken: prev.languagesSpoken.filter((_, i) => i !== index),
    }));
  };

  const filteredLanguages = COMMON_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
      lang.region.toLowerCase().includes(languageSearch.toLowerCase()),
  );

  return (
    <ProfileSectionLayout
      title="Practice Essentials"
      description="Manage your practice settings and patient care preferences"
      isEditing={isEditing}
      isSaving={isSaving}
      hasUnsavedChanges={hasUnsavedChanges}
      showUnsavedDialog={showUnsavedDialog}
      onEdit={() => {
        console.log("Edit button clicked");
        setIsEditing(true);
      }}
      onSave={handleSave}
      onCancel={handleCancel}
      onBackToDashboard={handleBackToDashboard}
      onConfirmDiscard={confirmDiscard}
      onSaveAndReturn={handleSaveAndReturn}
      onCloseUnsavedDialog={() => setShowUnsavedDialog(false)}
      dashboardState={dashboardState}
    >
      <div className="space-y-8">
        {/* Patient Care Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Patient Care
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Accepting New Patients */}
            <div className="flex items-center justify-between">
              <div>
                <Label
                  htmlFor="accepting-patients"
                  className="text-base font-medium"
                >
                  Accepting New Patients
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Allow new patients to find and book appointments with you
                </p>
              </div>
              <Switch
                id="accepting-patients"
                checked={formData.patientCare.acceptingNewPatients}
                onCheckedChange={(checked) =>
                  updatePatientCare("acceptingNewPatients", checked)
                }
                disabled={!isEditing}
              />
            </div>

            {/* Age Groups Treated */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-4 h-4" />
                <Label className="text-base font-medium">
                  Age Groups Treated
                </Label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AGE_GROUPS.map((ageGroup) => (
                  <div
                    key={ageGroup.id}
                    className="flex items-center space-x-3"
                  >
                    <Checkbox
                      id={ageGroup.id}
                      checked={formData.patientCare.ageGroupsTreated.includes(
                        ageGroup.id,
                      )}
                      onCheckedChange={(checked) =>
                        handleAgeGroupChange(ageGroup.id, checked as boolean)
                      }
                      disabled={!isEditing}
                    />
                    <Label
                      htmlFor={ageGroup.id}
                      className={`text-sm ${!isEditing ? "text-gray-600" : ""}`}
                    >
                      {ageGroup.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Appointment Types */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4" />
                <Label className="text-base font-medium">
                  Appointment Types
                </Label>
              </div>
              <div className="space-y-4">
                {APPOINTMENT_TYPES.map((appointmentType) => (
                  <div
                    key={appointmentType.id}
                    className="flex items-start space-x-3"
                  >
                    <Checkbox
                      id={appointmentType.id}
                      checked={formData.patientCare.appointmentTypes.includes(
                        appointmentType.id,
                      )}
                      onCheckedChange={(checked) =>
                        handleAppointmentTypeChange(
                          appointmentType.id,
                          checked as boolean,
                        )
                      }
                      disabled={!isEditing}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={appointmentType.id}
                        className={`text-sm font-medium ${!isEditing ? "text-gray-600" : ""}`}
                      >
                        {appointmentType.label}
                      </Label>
                      <p className="text-xs text-gray-500 mt-1">
                        {appointmentType.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Scheduling Notes */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <StickyNote className="w-4 h-4" />
                <Label
                  htmlFor="scheduling-notes"
                  className="text-base font-medium"
                >
                  Scheduling Notes
                </Label>
              </div>
              <Textarea
                id="scheduling-notes"
                value={formData.patientCare.schedulingNotes}
                onChange={(e) =>
                  updatePatientCare("schedulingNotes", e.target.value)
                }
                placeholder="Enter any special instructions for scheduling appointments..."
                disabled={!isEditing}
                className={`min-h-[100px] ${!isEditing ? "bg-gray-50" : ""}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Languages Spoken Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Languages Spoken
              </CardTitle>
              {isEditing && (
                <Button onClick={addLanguage} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Language
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.languagesSpoken.map((language, index) => (
              <div key={language.id} className="border rounded-lg p-4 relative">
                {isEditing && formData.languagesSpoken.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLanguage(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Language</Label>
                    <div className="mt-2">
                      {!isEditing ? (
                        <div className="text-sm p-2 bg-gray-50 rounded border">
                          {language.languageName || "No language selected"}
                        </div>
                      ) : (
                        <Select
                          value={language.languageCode}
                          onValueChange={(value) =>
                            handleLanguageSelect(index, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Search for a language to add..." />
                          </SelectTrigger>
                          <SelectContent>
                            <div className="p-2">
                              <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                  placeholder="Search languages..."
                                  value={languageSearch}
                                  onChange={(e) =>
                                    setLanguageSearch(e.target.value)
                                  }
                                  className="pl-8"
                                />
                              </div>
                            </div>
                            {filteredLanguages.map((lang) => (
                              <SelectItem key={lang.code} value={lang.code}>
                                {lang.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                    {language.languageCode && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getLanguageByCode(language.languageCode)?.code}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-sm font-medium">
                      Proficiency Level
                    </Label>
                    <div className="mt-2 flex gap-2">
                      {PROFICIENCY_LEVELS.map((level) => (
                        <Button
                          key={level.value}
                          type="button"
                          variant={
                            language.proficiency === level.value
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            updateLanguage(index, "proficiency", level.value)
                          }
                          disabled={!isEditing}
                          className="flex-1"
                        >
                          {level.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {formData.languagesSpoken.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No languages added yet</p>
                {isEditing && (
                  <Button
                    onClick={addLanguage}
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Your First Language
                  </Button>
                )}
              </div>
            )}

            {isEditing && (
              <div className="text-xs text-gray-500 border-t pt-4">
                <p>
                  Languages use IETF BCP 47 standards. Search supports variants
                  like "Chinese Simplified" or "Spanish Mexico".
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ProfileSectionLayout>
  );
}
