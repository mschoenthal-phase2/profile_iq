import React, { useState } from "react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export interface LicenseData {
  id: string;
  name: string;
  licenseNumber: string;
  state: string;
  status: "active" | "inactive";
  issueDate?: Date;
  expirationDate?: Date;
  issuingAuthority?: string;
}

interface AddLicenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLicense: (license: Omit<LicenseData, "id">) => void;
  isLoading?: boolean;
}

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
  { value: "DC", label: "District of Columbia" },
];

export function AddLicenseDialog({
  open,
  onOpenChange,
  onAddLicense,
  isLoading = false,
}: AddLicenseDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    state: "",
    status: "active" as "active" | "inactive",
    issueDate: undefined as Date | undefined,
    expirationDate: undefined as Date | undefined,
    issuingAuthority: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    field: string,
    value: string | Date | undefined,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "License name is required";
    }

    if (!formData.licenseNumber.trim()) {
      newErrors.licenseNumber = "License number is required";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (formData.expirationDate && formData.issueDate) {
      if (formData.expirationDate <= formData.issueDate) {
        newErrors.expirationDate = "Expiration date must be after issue date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    onAddLicense(formData);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      licenseNumber: "",
      state: "",
      status: "active",
      issueDate: undefined,
      expirationDate: undefined,
      issuingAuthority: "",
    });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Professional License</DialogTitle>
          <DialogDescription>
            Add a new professional license to your profile. All required fields
            must be completed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* License Name */}
          <div>
            <Label htmlFor="licenseName">License Name *</Label>
            <Input
              id="licenseName"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Medical License, Nursing License"
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* License Number */}
          <div>
            <Label htmlFor="licenseNumber">License Number *</Label>
            <Input
              id="licenseNumber"
              value={formData.licenseNumber}
              onChange={(e) =>
                handleInputChange("licenseNumber", e.target.value)
              }
              placeholder="Enter license number"
              className={errors.licenseNumber ? "border-red-500" : ""}
            />
            {errors.licenseNumber && (
              <p className="text-sm text-red-500 mt-1">
                {errors.licenseNumber}
              </p>
            )}
          </div>

          {/* State */}
          <div>
            <Label htmlFor="state">Issuing State *</Label>
            <Select
              value={formData.state}
              onValueChange={(value) => handleInputChange("state", value)}
            >
              <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-sm text-red-500 mt-1">{errors.state}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                handleInputChange("status", value as "active" | "inactive")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Issue Date */}
          <div>
            <Label>Issue Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.issueDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.issueDate ? (
                    format(formData.issueDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.issueDate}
                  onSelect={(date) => handleInputChange("issueDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Expiration Date */}
          <div>
            <Label>Expiration Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.expirationDate && "text-muted-foreground",
                    errors.expirationDate && "border-red-500",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.expirationDate ? (
                    format(formData.expirationDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.expirationDate}
                  onSelect={(date) => handleInputChange("expirationDate", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.expirationDate && (
              <p className="text-sm text-red-500 mt-1">
                {errors.expirationDate}
              </p>
            )}
          </div>

          {/* Issuing Authority */}
          <div>
            <Label htmlFor="issuingAuthority">Issuing Authority</Label>
            <Input
              id="issuingAuthority"
              value={formData.issuingAuthority}
              onChange={(e) =>
                handleInputChange("issuingAuthority", e.target.value)
              }
              placeholder="e.g., State Medical Board"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add License
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
