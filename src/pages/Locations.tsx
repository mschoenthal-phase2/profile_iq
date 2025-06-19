import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileSectionLayout } from "@/components/profile/ProfileSectionLayout";
import {
  LocationsData,
  LocationData,
  DaySchedule,
  PREDEFINED_LOCATIONS,
  TIME_OPTIONS,
  DAYS_OF_WEEK,
  getPredefinedLocationById,
  createNewLocation,
  validateLocationsData,
} from "@/types/locations";
import {
  MapPin,
  Plus,
  X,
  Clock,
  Phone,
  Building,
  FileText,
} from "lucide-react";

export default function Locations() {
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

  // Initial data with one primary location
  const initialData: LocationsData = {
    locations: [
      {
        id: "1",
        locationId: "1",
        locationName: "University Hospital",
        address: "1500 E Medical Center Dr",
        city: "Ann Arbor",
        state: "MI",
        postalCode: "48109",
        floor: "7th Floor",
        suiteOfficeNumber: "Suite 7C27",
        phoneNumber: "(734) 936-5738",
        faxNumber: "(734) 936-9784",
        officeHours: {
          monday: { isClosed: false, startTime: "8:00 AM", endTime: "5:00 PM" },
          tuesday: {
            isClosed: false,
            startTime: "8:00 AM",
            endTime: "5:00 PM",
          },
          wednesday: {
            isClosed: false,
            startTime: "8:00 AM",
            endTime: "5:00 PM",
          },
          thursday: {
            isClosed: false,
            startTime: "8:00 AM",
            endTime: "5:00 PM",
          },
          friday: { isClosed: false, startTime: "8:00 AM", endTime: "4:00 PM" },
          saturday: { isClosed: true },
          sunday: { isClosed: true },
        },
        isPrimaryLocation: true,
        acceptingNewPatients: true,
        specialNotes:
          "Bariatric surgery consultations and procedures performed here. Please bring insurance authorization.",
      },
    ],
  };

  const [formData, setFormData] = useState<LocationsData>(initialData);
  const [originalData, setOriginalData] = useState<LocationsData>(initialData);

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
      const errors = validateLocationsData(formData);
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

  // Location handlers
  const addLocation = (predefinedLocationId: string) => {
    try {
      const newLocation = createNewLocation(predefinedLocationId);
      setFormData((prev) => ({
        ...prev,
        locations: [...prev.locations, newLocation],
      }));
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const updateLocation = (
    index: number,
    field: keyof LocationData,
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.map((location, i) =>
        i === index ? { ...location, [field]: value } : location,
      ),
    }));
  };

  const updateLocationHours = (
    locationIndex: number,
    day: keyof LocationData["officeHours"],
    schedule: DaySchedule,
  ) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.map((location, i) =>
        i === locationIndex
          ? {
              ...location,
              officeHours: {
                ...location.officeHours,
                [day]: schedule,
              },
            }
          : location,
      ),
    }));
  };

  const removeLocation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };

  const handleLocationSelect = (index: number, locationId: string) => {
    const predefinedLocation = getPredefinedLocationById(locationId);
    if (predefinedLocation) {
      updateLocation(index, "locationId", locationId);
      updateLocation(index, "locationName", predefinedLocation.name);
      updateLocation(index, "address", predefinedLocation.address);
      updateLocation(index, "city", predefinedLocation.city);
      updateLocation(index, "state", predefinedLocation.state);
      updateLocation(index, "postalCode", predefinedLocation.postalCode);
    }
  };

  const handlePrimaryLocationChange = (index: number, isPrimary: boolean) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.map((location, i) => ({
        ...location,
        isPrimaryLocation: i === index ? isPrimary : false, // Only one can be primary
      })),
    }));
  };

  // Get available locations that haven't been added yet
  const availableLocations = PREDEFINED_LOCATIONS.filter(
    (predefined) =>
      !formData.locations.some(
        (location) => location.locationId === predefined.id,
      ),
  );

  return (
    <ProfileSectionLayout
      title="Locations"
      description="Manage your practice locations and office hours"
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
      <div className="space-y-6">
        {/* Header with Add Location */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Edit Locations
            </h3>
            <p className="text-sm text-gray-600">
              Manage your practice locations and schedules
            </p>
          </div>
          {isEditing && availableLocations.length > 0 && (
            <Select onValueChange={(value) => addLocation(value)}>
              <SelectTrigger className="w-auto border-none bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add Location
              </SelectTrigger>
              <SelectContent>
                {availableLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Locations List */}
        <div className="space-y-6">
          {formData.locations.map((locationData, index) => (
            <Card key={locationData.id} className="relative">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">
                          {locationData.locationName}
                        </CardTitle>
                        <div className="flex gap-2">
                          {locationData.isPrimaryLocation && (
                            <Badge variant="default">Primary</Badge>
                          )}
                          {locationData.acceptingNewPatients && (
                            <Badge variant="secondary">
                              Accepting New Patients
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {locationData.address}, {locationData.city},{" "}
                        {locationData.state} {locationData.postalCode}
                      </p>
                    </div>
                  </div>
                  {isEditing && formData.locations.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLocation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Location Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`floor-${index}`}>Floor</Label>
                    <Input
                      id={`floor-${index}`}
                      value={locationData.floor || ""}
                      onChange={(e) =>
                        updateLocation(index, "floor", e.target.value)
                      }
                      placeholder="e.g., 7th Floor"
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`suite-${index}`}>
                      Suite/Office Number
                    </Label>
                    <Input
                      id={`suite-${index}`}
                      value={locationData.suiteOfficeNumber || ""}
                      onChange={(e) =>
                        updateLocation(
                          index,
                          "suiteOfficeNumber",
                          e.target.value,
                        )
                      }
                      placeholder="e.g., Suite 7C27"
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label
                      htmlFor={`phone-${index}`}
                      className="flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id={`phone-${index}`}
                      value={locationData.phoneNumber || ""}
                      onChange={(e) =>
                        updateLocation(index, "phoneNumber", e.target.value)
                      }
                      placeholder="(734) 936-5738"
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`fax-${index}`}>Fax Number</Label>
                    <Input
                      id={`fax-${index}`}
                      value={locationData.faxNumber || ""}
                      onChange={(e) =>
                        updateLocation(index, "faxNumber", e.target.value)
                      }
                      placeholder="(734) 936-9784"
                      disabled={!isEditing}
                      className={!isEditing ? "bg-gray-50" : ""}
                    />
                  </div>
                </div>

                {/* Office Hours */}
                <div>
                  <Label className="flex items-center gap-2 mb-4">
                    <Clock className="w-4 h-4" />
                    Office / Clinic Hours
                  </Label>
                  <div className="space-y-3">
                    {DAYS_OF_WEEK.map(({ key, label }) => {
                      const daySchedule =
                        locationData.officeHours[
                          key as keyof typeof locationData.officeHours
                        ];
                      return (
                        <div key={key} className="flex items-center gap-4">
                          <div className="w-20 text-sm font-medium">
                            {label}:
                          </div>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={daySchedule.isClosed}
                              onCheckedChange={(checked) =>
                                updateLocationHours(index, key as any, {
                                  isClosed: checked as boolean,
                                  startTime: checked ? undefined : "8:00 AM",
                                  endTime: checked ? undefined : "5:00 PM",
                                })
                              }
                              disabled={!isEditing}
                            />
                            <Label className="text-sm">Closed</Label>
                          </div>
                          {!daySchedule.isClosed && (
                            <>
                              <Select
                                value={daySchedule.startTime || ""}
                                onValueChange={(value) =>
                                  updateLocationHours(index, key as any, {
                                    ...daySchedule,
                                    startTime: value,
                                  })
                                }
                                disabled={!isEditing}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="Start" />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIME_OPTIONS.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <span className="text-sm text-gray-500">to</span>
                              <Select
                                value={daySchedule.endTime || ""}
                                onValueChange={(value) =>
                                  updateLocationHours(index, key as any, {
                                    ...daySchedule,
                                    endTime: value,
                                  })
                                }
                                disabled={!isEditing}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue placeholder="End" />
                                </SelectTrigger>
                                <SelectContent>
                                  {TIME_OPTIONS.map((time) => (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Location Settings */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`primary-${index}`}
                      checked={locationData.isPrimaryLocation}
                      onCheckedChange={(checked) =>
                        handlePrimaryLocationChange(index, checked as boolean)
                      }
                      disabled={!isEditing}
                    />
                    <Label
                      htmlFor={`primary-${index}`}
                      className="text-sm font-medium"
                    >
                      Primary location
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`accepting-${index}`}
                      checked={locationData.acceptingNewPatients}
                      onCheckedChange={(checked) =>
                        updateLocation(index, "acceptingNewPatients", checked)
                      }
                      disabled={!isEditing}
                    />
                    <Label
                      htmlFor={`accepting-${index}`}
                      className="text-sm font-medium"
                    >
                      Accepting new patients
                    </Label>
                  </div>
                </div>

                {/* Special Notes */}
                <div>
                  <Label
                    htmlFor={`notes-${index}`}
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Special Notes
                  </Label>
                  <Textarea
                    id={`notes-${index}`}
                    value={locationData.specialNotes || ""}
                    onChange={(e) =>
                      updateLocation(index, "specialNotes", e.target.value)
                    }
                    placeholder="Enter any special instructions or notes for this location..."
                    disabled={!isEditing}
                    className={`mt-2 min-h-[80px] ${!isEditing ? "bg-gray-50" : ""}`}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {formData.locations.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No locations added yet
              </h3>
              <p className="text-gray-600 mb-4">
                Add your practice locations to help patients find you
              </p>
              {isEditing && availableLocations.length > 0 && (
                <Select onValueChange={(value) => addLocation(value)}>
                  <SelectTrigger className="w-auto">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Location
                  </SelectTrigger>
                  <SelectContent>
                    {availableLocations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </ProfileSectionLayout>
  );
}
