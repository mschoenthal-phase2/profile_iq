import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Hospital,
  HospitalPermissionSettings,
  MANAGEABLE_SECTIONS,
} from "@/types/admin";
import { Building2, Eye, EyeOff, Lock, Unlock, Save } from "lucide-react";

interface HospitalPermissionManagerProps {
  hospitals: Hospital[];
  permissions: HospitalPermissionSettings[];
  onPermissionUpdate: (
    hospitalId: string,
    sectionId: string,
    updates: any,
  ) => Promise<void>;
}

export function HospitalPermissionManager({
  hospitals,
  permissions,
  onPermissionUpdate,
}: HospitalPermissionManagerProps) {
  const [selectedHospital, setSelectedHospital] = useState<string>("all");
  const [unsavedChanges, setUnsavedChanges] = useState<Record<string, any>>({});
  const [isSaving, setIsSaving] = useState(false);

  const getPermissionsForHospital = (hospitalId: string) => {
    const hospitalPermissions = permissions.find(
      (p) => p.hospital_id === hospitalId,
    );
    if (hospitalPermissions) {
      return hospitalPermissions.permissions;
    }

    // Return default permissions if none exist
    const defaultPermissions: Record<string, any> = {};
    MANAGEABLE_SECTIONS.forEach((section) => {
      defaultPermissions[section.id] = {
        is_visible: true,
        is_required: section.required_by_default,
      };
    });
    return defaultPermissions;
  };

  const handlePermissionChange = (
    hospitalId: string,
    sectionId: string,
    field: "is_visible" | "is_required",
    value: boolean,
  ) => {
    const key = `${hospitalId}-${sectionId}-${field}`;
    setUnsavedChanges((prev) => ({
      ...prev,
      [key]: { hospitalId, sectionId, field, value },
    }));
  };

  const getCurrentValue = (
    hospitalId: string,
    sectionId: string,
    field: "is_visible" | "is_required",
  ) => {
    const key = `${hospitalId}-${sectionId}-${field}`;
    if (key in unsavedChanges) {
      return unsavedChanges[key].value;
    }

    const permissions = getPermissionsForHospital(hospitalId);
    return (
      permissions[sectionId]?.[field] ?? (field === "is_visible" ? true : false)
    );
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      // Group changes by hospital and section
      const changesByHospitalSection: Record<string, any> = {};

      Object.values(unsavedChanges).forEach((change: any) => {
        const key = `${change.hospitalId}-${change.sectionId}`;
        if (!changesByHospitalSection[key]) {
          changesByHospitalSection[key] = {
            hospitalId: change.hospitalId,
            sectionId: change.sectionId,
            updates: {},
          };
        }
        changesByHospitalSection[key].updates[change.field] = change.value;
      });

      // Apply all changes
      for (const change of Object.values(changesByHospitalSection)) {
        await onPermissionUpdate(
          change.hospitalId,
          change.sectionId,
          change.updates,
        );
      }

      setUnsavedChanges({});
    } catch (error) {
      console.error("Error saving changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const hasUnsavedChanges = Object.keys(unsavedChanges).length > 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hospital Permission Management</CardTitle>
          <CardDescription>
            Configure which profile sections are visible and required for each
            hospital system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Select
                  value={selectedHospital}
                  onValueChange={setSelectedHospital}
                >
                  <SelectTrigger className="w-80">
                    <SelectValue placeholder="Select a hospital to configure" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Hospitals</SelectItem>
                    {hospitals.map((hospital) => (
                      <SelectItem key={hospital.id} value={hospital.id}>
                        <div className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4" />
                          <span>{hospital.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasUnsavedChanges && (
                <Button onClick={saveChanges} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </div>

            {hasUnsavedChanges && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  You have unsaved changes. Click "Save Changes" to apply them.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedHospital && selectedHospital !== "all" ? (
        <HospitalPermissionGrid
          hospital={hospitals.find((h) => h.id === selectedHospital)!}
          permissions={getPermissionsForHospital(selectedHospital)}
          onPermissionChange={handlePermissionChange}
          getCurrentValue={getCurrentValue}
        />
      ) : (
        <div className="grid gap-6">
          {hospitals.map((hospital) => (
            <HospitalPermissionGrid
              key={hospital.id}
              hospital={hospital}
              permissions={getPermissionsForHospital(hospital.id)}
              onPermissionChange={handlePermissionChange}
              getCurrentValue={getCurrentValue}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface HospitalPermissionGridProps {
  hospital: Hospital;
  permissions: Record<string, any>;
  onPermissionChange: (
    hospitalId: string,
    sectionId: string,
    field: "is_visible" | "is_required",
    value: boolean,
  ) => void;
  getCurrentValue: (
    hospitalId: string,
    sectionId: string,
    field: "is_visible" | "is_required",
  ) => boolean;
}

function HospitalPermissionGrid({
  hospital,
  permissions,
  onPermissionChange,
  getCurrentValue,
}: HospitalPermissionGridProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Building2 className="w-5 h-5" />
              <span>{hospital.name}</span>
            </CardTitle>
            <CardDescription>Code: {hospital.code}</CardDescription>
          </div>
          <Badge variant={hospital.is_active ? "default" : "secondary"}>
            {hospital.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600 pb-2 border-b">
            <div className="col-span-6">Profile Section</div>
            <div className="col-span-3 text-center">Visible</div>
            <div className="col-span-3 text-center">Required</div>
          </div>

          {MANAGEABLE_SECTIONS.map((section) => {
            const isVisible = getCurrentValue(
              hospital.id,
              section.id,
              "is_visible",
            );
            const isRequired = getCurrentValue(
              hospital.id,
              section.id,
              "is_required",
            );

            return (
              <div
                key={section.id}
                className="grid grid-cols-12 gap-4 items-center py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="col-span-6">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {section.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="col-span-3 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isVisible}
                      onCheckedChange={(checked) =>
                        onPermissionChange(
                          hospital.id,
                          section.id,
                          "is_visible",
                          checked,
                        )
                      }
                    />
                    {isVisible ? (
                      <Eye className="w-4 h-4 text-green-600" />
                    ) : (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>

                <div className="col-span-3 flex justify-center">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={isRequired}
                      disabled={!isVisible}
                      onCheckedChange={(checked) =>
                        onPermissionChange(
                          hospital.id,
                          section.id,
                          "is_required",
                          checked,
                        )
                      }
                    />
                    {isRequired ? (
                      <Lock className="w-4 h-4 text-red-600" />
                    ) : (
                      <Unlock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
