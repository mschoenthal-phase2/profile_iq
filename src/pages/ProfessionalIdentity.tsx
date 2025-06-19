import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  User,
  Upload,
  Plus,
  X,
  ArrowLeft,
  Save,
  Edit,
  FileText,
  Stethoscope,
  Award,
  Briefcase,
} from "lucide-react";

interface ProfessionalIdentityData {
  profilePhoto?: string;
  fullLegalName: string;
  npiNumber: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  pronouns: string;
  professionalEmail: string;
  licenses: Array<{
    id: string;
    name: string;
    licenseNumber: string;
    state: string;
    status: "active" | "inactive";
  }>;
  primarySpecialties: string[];
  additionalSpecialties: string[];
  jobTitle: string;
  department: string;
  division: string;
  section: string;
  credentials: string[];
}

export default function ProfessionalIdentity() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Get initial data from navigation state or use defaults
  const initialData: ProfessionalIdentityData = {
    profilePhoto: "",
    fullLegalName: "Dr. Justin B Dimick, MD",
    npiNumber: "1578714549",
    firstName: "Justin",
    lastName: "Dimick",
    preferredName: "Dr. Dimick",
    pronouns: "He/Him",
    professionalEmail: "jdimick@med.umich.edu",
    licenses: [
      {
        id: "1",
        name: "Michigan Medical License",
        licenseNumber: "4301082842",
        state: "MI",
        status: "active",
      },
    ],
    primarySpecialties: ["Surgery", "General Surgery"],
    additionalSpecialties: ["Minimally Invasive Surgery", "Bariatric Surgery"],
    jobTitle: "Professor and Chair of Surgery",
    department: "Surgery",
    division: "General Surgery",
    section: "Acute Care Surgery",
    credentials: ["MD", "MPH", "FACS"],
  };

  const [formData, setFormData] =
    useState<ProfessionalIdentityData>(initialData);
  const [originalData, setOriginalData] =
    useState<ProfessionalIdentityData>(initialData);

  useEffect(() => {
    // Check if coming from dashboard with edit mode
    if (location.state?.isEditing) {
      setIsEditing(true);
    }
  }, [location.state]);

  useEffect(() => {
    // Check for unsaved changes
    const hasChanges =
      JSON.stringify(formData) !== JSON.stringify(originalData);
    setHasUnsavedChanges(hasChanges);
  }, [formData, originalData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (
    field: keyof ProfessionalIdentityData,
    index: number,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) =>
        i === index ? value : item,
      ),
    }));
  };

  const handleAddArrayItem = (
    field: keyof ProfessionalIdentityData,
    value: string,
  ) => {
    if (value.trim()) {
      setFormData((prev) => ({
        ...prev,
        [field]: [...(prev[field] as string[]), value.trim()],
      }));
    }
  };

  const handleRemoveArrayItem = (
    field: keyof ProfessionalIdentityData,
    index: number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOriginalData(formData);
      setIsEditing(false);
      setHasUnsavedChanges(false);

      // Navigate back to dashboard after successful save
      navigate("/dashboard");
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
      setFormData(originalData); // Reset form data to original state
    }
  };

  const handleBackToDashboard = () => {
    if (hasUnsavedChanges && isEditing) {
      setShowUnsavedDialog(true);
    } else {
      navigate("/dashboard");
    }
  };

  const confirmDiscard = () => {
    setFormData(originalData);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setShowUnsavedDialog(false);
    navigate("/dashboard");
  };

  const handleSaveAndReturn = async () => {
    setShowUnsavedDialog(false);
    await handleSave();
    // handleSave already navigates to dashboard
  };

  const handlePhotoUpload = () => {
    // Handle photo upload logic
    console.log("Photo upload clicked");
  };

  return (
    <div className="min-h-screen bg-phase2-net-gray/20">
      {/* Header */}
      <div className="bg-white border-b border-phase2-net-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToDashboard}
                className="text-phase2-dark-gray hover:text-phase2-blue"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <div>
                <h1 className="text-2xl font-raleway font-bold text-phase2-soft-black">
                  Professional Identity
                </h1>
                <p className="text-phase2-dark-gray font-raleway">
                  Manage your professional information and credentials
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving || !hasUnsavedChanges}
                    className="min-w-[100px]"
                  >
                    {isSaving ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Profile Photo Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Photo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={formData.profilePhoto} />
                  <AvatarFallback className="bg-phase2-blue text-white text-2xl">
                    {formData.firstName[0]}
                    {formData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-phase2-dark-gray mb-3">
                    Upload a professional headshot. This will appear on your
                    profile and in search results.
                  </p>
                  {isEditing && (
                    <Button variant="outline" onClick={handlePhotoUpload}>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fullLegalName">Full Legal Name *</Label>
                  <Input
                    id="fullLegalName"
                    value={formData.fullLegalName}
                    onChange={(e) =>
                      handleInputChange("fullLegalName", e.target.value)
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="npiNumber">NPI Number *</Label>
                  <Input
                    id="npiNumber"
                    value={formData.npiNumber}
                    onChange={(e) =>
                      handleInputChange("npiNumber", e.target.value)
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="preferredName">Preferred Name</Label>
                  <Input
                    id="preferredName"
                    value={formData.preferredName}
                    onChange={(e) =>
                      handleInputChange("preferredName", e.target.value)
                    }
                    placeholder="How you'd like to be addressed"
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="pronouns">Pronouns</Label>
                  <Select
                    value={formData.pronouns}
                    onValueChange={(value) =>
                      handleInputChange("pronouns", value)
                    }
                    disabled={!isEditing}
                  >
                    <SelectTrigger className={!isEditing ? "bg-gray-50" : ""}>
                      <SelectValue placeholder="Select or type pronouns" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="He/Him">He/Him</SelectItem>
                      <SelectItem value="She/Her">She/Her</SelectItem>
                      <SelectItem value="They/Them">They/Them</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="professionalEmail">Professional Email *</Label>
                <Input
                  id="professionalEmail"
                  type="email"
                  value={formData.professionalEmail}
                  onChange={(e) =>
                    handleInputChange("professionalEmail", e.target.value)
                  }
                  disabled={!isEditing}
                  className={!isEditing ? "bg-gray-50" : ""}
                />
              </div>
            </CardContent>
          </Card>

          {/* Professional Licenses Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Professional Licenses
                </CardTitle>
                {isEditing && (
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    Add License
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.licenses.map((license, index) => (
                  <div
                    key={license.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{license.name}</h4>
                        <Badge
                          variant={
                            license.status === "active"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {license.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-phase2-dark-gray">
                        License #: {license.licenseNumber} • State:{" "}
                        {license.state}
                      </p>
                    </div>
                    {isEditing && (
                      <Button variant="ghost" size="sm">
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Medical Specialties Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Medical Specialties
              </CardTitle>
              <p className="text-sm text-phase2-dark-gray">
                Your specialties are automatically populated from your board
                certifications. You can add additional specialties or modify as
                needed.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold">
                  Primary Specialties
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.primarySpecialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="gap-1">
                      {specialty}
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() =>
                            handleRemoveArrayItem("primarySpecialties", index)
                          }
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                </div>
                {formData.primarySpecialties.length === 0 && (
                  <p className="text-sm text-phase2-dark-gray italic mt-2">
                    No primary specialties selected
                  </p>
                )}
              </div>

              <div>
                <Label className="text-base font-semibold">
                  Additional Specialties & Subspecialties
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.additionalSpecialties.map((specialty, index) => (
                    <Badge key={index} variant="outline" className="gap-1">
                      {specialty}
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent"
                          onClick={() =>
                            handleRemoveArrayItem(
                              "additionalSpecialties",
                              index,
                            )
                          }
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                </div>
                {formData.additionalSpecialties.length === 0 && (
                  <p className="text-sm text-phase2-dark-gray italic mt-2">
                    No additional specialties selected
                  </p>
                )}
                {isEditing && (
                  <Button variant="outline" size="sm" className="mt-3">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Specialty
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Professional Role Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Professional Role
              </CardTitle>
              <p className="text-sm text-phase2-dark-gray">
                Select your organizational hierarchy: Department → Division →
                Section. Each level will update the available options for the
                next level.
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="jobTitle">Job Title *</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      handleInputChange("jobTitle", e.target.value)
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Input
                    id="department"
                    value={formData.department}
                    onChange={(e) =>
                      handleInputChange("department", e.target.value)
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="division">Division</Label>
                  <Input
                    id="division"
                    value={formData.division}
                    onChange={(e) =>
                      handleInputChange("division", e.target.value)
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
                <div>
                  <Label htmlFor="section">Section</Label>
                  <Input
                    id="section"
                    value={formData.section}
                    onChange={(e) =>
                      handleInputChange("section", e.target.value)
                    }
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Titles & Credentials Section */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Titles & Credentials</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {formData.credentials.map((credential, index) => (
                    <Badge key={index} className="gap-1">
                      {credential}
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent text-white hover:text-white"
                          onClick={() =>
                            handleRemoveArrayItem("credentials", index)
                          }
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search and select a professional title..."
                      className="flex-1"
                    />
                    <Button variant="outline">Add</Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Do you want to save your changes before
              leaving?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={confirmDiscard}>
              Discard Changes
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveAndReturn}>
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
