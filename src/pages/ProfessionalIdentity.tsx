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
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";
import {
  AddLicenseDialog,
  type LicenseData,
} from "@/components/professional-identity/AddLicenseDialog";
import {
  AddSpecialtyDialog,
  type SpecialtyData,
} from "@/components/professional-identity/AddSpecialtyDialog";
import {
  User,
  Upload,
  Plus,
  X,
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
  licenses: LicenseData[];
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
  const [showAddLicenseDialog, setShowAddLicenseDialog] = useState(false);
  const [showAddSpecialtyDialog, setShowAddSpecialtyDialog] = useState(false);

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
        enumeration_date: "2008-05-23",
        last_updated: "2023-10-15",
        status: "A",
      },
      addresses: [
        {
          address_1: "1500 E Medical Center Dr",
          city: "Ann Arbor",
          state: "MI",
          postal_code: "48109",
          country_code: "US",
          country_name: "United States",
          address_purpose: "MAILING",
          address_type: "DOM",
          telephone_number: "(734) 936-5738",
        },
      ],
      taxonomies: [
        {
          code: "208600000X",
          desc: "Surgery",
          primary: true,
          state: "MI",
          license: "4301082842",
        },
      ],
      created_epoch: 1211515200,
      last_updated_epoch: 1697356800,
    },
  };

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

      // Navigate back to dashboard with preserved state
      navigate("/dashboard", {
        state: dashboardState,
      });
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
      navigate("/dashboard", {
        state: dashboardState,
      });
    }
  };

  const confirmDiscard = () => {
    setFormData(originalData);
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setShowUnsavedDialog(false);
    navigate("/dashboard", {
      state: dashboardState,
    });
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

  const handleAddLicense = (licenseData: Omit<LicenseData, "id">) => {
    const newLicense: LicenseData = {
      ...licenseData,
      id: Date.now().toString(), // In a real app, this would come from the server
    };

    setFormData((prev) => ({
      ...prev,
      licenses: [...prev.licenses, newLicense],
    }));

    setShowAddLicenseDialog(false);
  };

  const handleRemoveLicense = (licenseId: string) => {
    setFormData((prev) => ({
      ...prev,
      licenses: prev.licenses.filter((license) => license.id !== licenseId),
    }));
  };

  const handleAddSpecialty = (specialtyData: SpecialtyData) => {
    const targetArray =
      specialtyData.type === "primary"
        ? "primarySpecialties"
        : "additionalSpecialties";

    setFormData((prev) => ({
      ...prev,
      [targetArray]: [...prev[targetArray], specialtyData.name],
    }));

    setShowAddSpecialtyDialog(false);
  };

  const getAllSpecialties = () => {
    return [...formData.primarySpecialties, ...formData.additionalSpecialties];
  };

  return (
    <ProfileSectionLayout
      title="Professional Identity"
      description="Manage your professional information and credentials"
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddLicenseDialog(true)}
                >
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
                          license.status === "active" ? "default" : "secondary"
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveLicense(license.id)}
                    >
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
                          handleRemoveArrayItem("additionalSpecialties", index)
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
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => setShowAddSpecialtyDialog(true)}
                >
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
              Section. Each level will update the available options for the next
              level.
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
                  onChange={(e) => handleInputChange("section", e.target.value)}
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

      {/* Dialogs */}
      <AddLicenseDialog
        open={showAddLicenseDialog}
        onOpenChange={setShowAddLicenseDialog}
        onAddLicense={handleAddLicense}
        isLoading={isSaving}
      />

      <AddSpecialtyDialog
        open={showAddSpecialtyDialog}
        onOpenChange={setShowAddSpecialtyDialog}
        onAddSpecialty={handleAddSpecialty}
        existingSpecialties={getAllSpecialties()}
        isLoading={isSaving}
      />
    </ProfileSectionLayout>
  );
}
