import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";
import {
  EducationTrainingData,
  MedicalSchool,
  Residency,
  Fellowship,
  AdditionalEducation,
  MEDICAL_SCHOOLS,
  RESIDENCY_PROGRAMS,
  FELLOWSHIP_PROGRAMS,
  ADDITIONAL_INSTITUTIONS,
  getSpecialtiesByInstitution,
  getDegreesByInstitution,
} from "@/types/education";
import {
  GraduationCap,
  Plus,
  X,
  Stethoscope,
  Award,
  BookOpen,
} from "lucide-react";

export default function EducationTraining() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
  const initialData: EducationTrainingData = {
    medicalSchool: {
      id: "1",
      institution: "Johns Hopkins School of Medicine",
      location: "Baltimore, MD",
      degree: "Doctor of Medicine (MD)",
      graduationYear: "1999",
    },
    residencies: [
      {
        id: "1",
        institution: "University of Michigan",
        location: "Ann Arbor, MI",
        specialty: "General Surgery",
        startYear: "1999",
        endYear: "2005",
      },
    ],
    fellowships: [
      {
        id: "1",
        institution:
          "Dartmouth Institute for Health Policy & Clinical Practice",
        location: "Hanover, NH",
        fellowshipSpecialty: "Health Policy & Clinical Practice",
        startYear: "2006",
        endYear: "2007",
      },
    ],
    additionalEducation: [
      {
        id: "1",
        institution:
          "Dartmouth Institute for Health Policy & Clinical Practice",
        location: "Hanover, NH",
        degree: "Master of Public Health (MPH)",
        graduationYear: "2007",
      },
    ],
  };

  const [formData, setFormData] = useState<EducationTrainingData>(initialData);
  const [originalData, setOriginalData] =
    useState<EducationTrainingData>(initialData);

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

  // Medical School handlers
  const updateMedicalSchool = (field: keyof MedicalSchool, value: string) => {
    setFormData((prev) => ({
      ...prev,
      medicalSchool: prev.medicalSchool
        ? { ...prev.medicalSchool, [field]: value }
        : {
            id: "1",
            institution: "",
            location: "",
            degree: "",
            graduationYear: "",
            [field]: value,
          },
    }));
  };

  const handleMedicalSchoolInstitutionChange = (institutionName: string) => {
    const institution = MEDICAL_SCHOOLS.find(
      (school) => school.name === institutionName,
    );
    if (institution) {
      updateMedicalSchool("institution", institutionName);
      updateMedicalSchool("location", institution.location);
      updateMedicalSchool("degree", institution.degrees[0] || "");
    }
  };

  // Residency handlers
  const addResidency = () => {
    const newResidency: Residency = {
      id: Date.now().toString(),
      institution: "",
      location: "",
      specialty: "",
      startYear: "",
      endYear: "",
    };
    setFormData((prev) => ({
      ...prev,
      residencies: [...prev.residencies, newResidency],
    }));
  };

  const updateResidency = (
    index: number,
    field: keyof Residency,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      residencies: prev.residencies.map((residency, i) =>
        i === index ? { ...residency, [field]: value } : residency,
      ),
    }));
  };

  const handleResidencyInstitutionChange = (
    index: number,
    institutionName: string,
  ) => {
    const institution = RESIDENCY_PROGRAMS.find(
      (program) => program.name === institutionName,
    );
    if (institution) {
      updateResidency(index, "institution", institutionName);
      updateResidency(index, "location", institution.location);
    }
  };

  const removeResidency = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      residencies: prev.residencies.filter((_, i) => i !== index),
    }));
  };

  // Fellowship handlers
  const addFellowship = () => {
    const newFellowship: Fellowship = {
      id: Date.now().toString(),
      institution: "",
      location: "",
      fellowshipSpecialty: "",
      startYear: "",
      endYear: "",
    };
    setFormData((prev) => ({
      ...prev,
      fellowships: [...prev.fellowships, newFellowship],
    }));
  };

  const updateFellowship = (
    index: number,
    field: keyof Fellowship,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      fellowships: prev.fellowships.map((fellowship, i) =>
        i === index ? { ...fellowship, [field]: value } : fellowship,
      ),
    }));
  };

  const handleFellowshipInstitutionChange = (
    index: number,
    institutionName: string,
  ) => {
    const institution = FELLOWSHIP_PROGRAMS.find(
      (program) => program.name === institutionName,
    );
    if (institution) {
      updateFellowship(index, "institution", institutionName);
      updateFellowship(index, "location", institution.location);
    }
  };

  const removeFellowship = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      fellowships: prev.fellowships.filter((_, i) => i !== index),
    }));
  };

  // Additional Education handlers
  const addAdditionalEducation = () => {
    const newEducation: AdditionalEducation = {
      id: Date.now().toString(),
      institution: "",
      location: "",
      degree: "",
      graduationYear: "",
    };
    setFormData((prev) => ({
      ...prev,
      additionalEducation: [...prev.additionalEducation, newEducation],
    }));
  };

  const updateAdditionalEducation = (
    index: number,
    field: keyof AdditionalEducation,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      additionalEducation: prev.additionalEducation.map((education, i) =>
        i === index ? { ...education, [field]: value } : education,
      ),
    }));
  };

  const handleAdditionalEducationInstitutionChange = (
    index: number,
    institutionName: string,
  ) => {
    const institution = ADDITIONAL_INSTITUTIONS.find(
      (inst) => inst.name === institutionName,
    );
    if (institution) {
      updateAdditionalEducation(index, "institution", institutionName);
      updateAdditionalEducation(index, "location", institution.location);
    }
  };

  const removeAdditionalEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      additionalEducation: prev.additionalEducation.filter(
        (_, i) => i !== index,
      ),
    }));
  };

  return (
    <ProfileSectionLayout
      title="Education & Training"
      description="Manage your educational background and training history"
      isEditing={isEditing}
      isSaving={isSaving}
      hasUnsavedChanges={hasUnsavedChanges}
      showUnsavedDialog={showUnsavedDialog}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={handleCancel}
      onBackToDashboard={handleBackToDashboard}
      onConfirmDiscard={confirmDiscard}
      onSaveAndReturn={handleSaveAndReturn}
      onCloseUnsavedDialog={() => setShowUnsavedDialog(false)}
      dashboardState={dashboardState}
    >
      <div className="space-y-8">
        {/* Medical School Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Medical School
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="ms-institution">Institution *</Label>
                <Select
                  value={formData.medicalSchool?.institution || ""}
                  onValueChange={handleMedicalSchoolInstitutionChange}
                  disabled={!isEditing}
                >
                  <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                    <SelectValue placeholder="Select medical school" />
                  </SelectTrigger>
                  <SelectContent>
                    {MEDICAL_SCHOOLS.map((school) => (
                      <SelectItem key={school.name} value={school.name}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ms-location">Location *</Label>
                <Input
                  id="ms-location"
                  value={formData.medicalSchool?.location || ""}
                  onChange={(e) =>
                    updateMedicalSchool("location", e.target.value)
                  }
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
              <div>
                <Label htmlFor="ms-degree">Degree *</Label>
                <Select
                  value={formData.medicalSchool?.degree || ""}
                  onValueChange={(value) =>
                    updateMedicalSchool("degree", value)
                  }
                  disabled={!isEditing}
                >
                  <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                    <SelectValue placeholder="Select degree" />
                  </SelectTrigger>
                  <SelectContent>
                    {getDegreesByInstitution(
                      formData.medicalSchool?.institution || "",
                      "medical_school",
                    ).map((degree) => (
                      <SelectItem key={degree} value={degree}>
                        {degree}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ms-graduation">Graduation Year *</Label>
                <Input
                  id="ms-graduation"
                  value={formData.medicalSchool?.graduationYear || ""}
                  onChange={(e) =>
                    updateMedicalSchool("graduationYear", e.target.value)
                  }
                  placeholder="YYYY"
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Residency Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Residency
              </CardTitle>
              {isEditing && (
                <Button onClick={addResidency} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Residency
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.residencies.map((residency, index) => (
              <div
                key={residency.id}
                className="border rounded-lg p-4 relative"
              >
                {isEditing && formData.residencies.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeResidency(index)}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Institution *</Label>
                    <Select
                      value={residency.institution}
                      onValueChange={(value) =>
                        handleResidencyInstitutionChange(index, value)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                        <SelectValue placeholder="Select institution" />
                      </SelectTrigger>
                      <SelectContent>
                        {RESIDENCY_PROGRAMS.map((program) => (
                          <SelectItem key={program.name} value={program.name}>
                            {program.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Location *</Label>
                    <Input
                      value={residency.location}
                      onChange={(e) =>
                        updateResidency(index, "location", e.target.value)
                      }
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label>Specialty *</Label>
                    <Select
                      value={residency.specialty}
                      onValueChange={(value) =>
                        updateResidency(index, "specialty", value)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSpecialtiesByInstitution(
                          residency.institution,
                          "residency",
                        ).map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Year *</Label>
                      <Input
                        value={residency.startYear}
                        onChange={(e) =>
                          updateResidency(index, "startYear", e.target.value)
                        }
                        placeholder="YYYY"
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div>
                      <Label>End Year *</Label>
                      <Input
                        value={residency.endYear}
                        onChange={(e) =>
                          updateResidency(index, "endYear", e.target.value)
                        }
                        placeholder="YYYY"
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Fellowship Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Fellowship (Optional)
              </CardTitle>
              {isEditing && (
                <Button onClick={addFellowship} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Fellowship
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.fellowships.map((fellowship, index) => (
              <div
                key={fellowship.id}
                className="border rounded-lg p-4 relative"
              >
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFellowship(index)}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Institution</Label>
                    <Select
                      value={fellowship.institution}
                      onValueChange={(value) =>
                        handleFellowshipInstitutionChange(index, value)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                        <SelectValue placeholder="Select institution" />
                      </SelectTrigger>
                      <SelectContent>
                        {FELLOWSHIP_PROGRAMS.map((program) => (
                          <SelectItem key={program.name} value={program.name}>
                            {program.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={fellowship.location}
                      onChange={(e) =>
                        updateFellowship(index, "location", e.target.value)
                      }
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label>Fellowship Specialty</Label>
                    <Select
                      value={fellowship.fellowshipSpecialty}
                      onValueChange={(value) =>
                        updateFellowship(index, "fellowshipSpecialty", value)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                        <SelectValue placeholder="Select specialty" />
                      </SelectTrigger>
                      <SelectContent>
                        {getSpecialtiesByInstitution(
                          fellowship.institution,
                          "fellowship",
                        ).map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Year</Label>
                      <Input
                        value={fellowship.startYear}
                        onChange={(e) =>
                          updateFellowship(index, "startYear", e.target.value)
                        }
                        placeholder="YYYY"
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                    <div>
                      <Label>End Year</Label>
                      <Input
                        value={fellowship.endYear}
                        onChange={(e) =>
                          updateFellowship(index, "endYear", e.target.value)
                        }
                        placeholder="YYYY"
                        disabled={!isEditing}
                        className={!isEditing ? "bg-gray-50" : ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Additional Education Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Additional Education (Optional)
              </CardTitle>
              {isEditing && (
                <Button
                  onClick={addAdditionalEducation}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Education
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {formData.additionalEducation.map((education, index) => (
              <div
                key={education.id}
                className="border rounded-lg p-4 relative"
              >
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAdditionalEducation(index)}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Institution</Label>
                    <Select
                      value={education.institution}
                      onValueChange={(value) =>
                        handleAdditionalEducationInstitutionChange(index, value)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                        <SelectValue placeholder="Select institution" />
                      </SelectTrigger>
                      <SelectContent>
                        {ADDITIONAL_INSTITUTIONS.map((institution) => (
                          <SelectItem
                            key={institution.name}
                            value={institution.name}
                          >
                            {institution.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={education.location}
                      onChange={(e) =>
                        updateAdditionalEducation(
                          index,
                          "location",
                          e.target.value,
                        )
                      }
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label>Degree</Label>
                    <Select
                      value={education.degree}
                      onValueChange={(value) =>
                        updateAdditionalEducation(index, "degree", value)
                      }
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        {getDegreesByInstitution(
                          education.institution,
                          "additional",
                        ).map((degree) => (
                          <SelectItem key={degree} value={degree}>
                            {degree}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Graduation Year</Label>
                    <Input
                      value={education.graduationYear}
                      onChange={(e) =>
                        updateAdditionalEducation(
                          index,
                          "graduationYear",
                          e.target.value,
                        )
                      }
                      placeholder="YYYY"
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </ProfileSectionLayout>
  );
}
