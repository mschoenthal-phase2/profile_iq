# Professional Identity Components

This directory contains modular components for managing professional identity information, specifically licenses and medical specialties.

## Components

### AddLicenseDialog

A dialog component for adding new professional licenses to a user's profile.

**Features:**

- Form validation for required fields
- State selection dropdown with all US states
- Date pickers for issue and expiration dates
- Status selection (active/inactive)
- Error handling and validation

**Props:**

- `open`: boolean - Controls dialog visibility
- `onOpenChange`: (open: boolean) => void - Callback for dialog state changes
- `onAddLicense`: (license: Omit<LicenseData, "id">) => void - Callback when license is added
- `isLoading`: boolean - Shows loading state

**Usage:**

```tsx
<AddLicenseDialog
  open={showDialog}
  onOpenChange={setShowDialog}
  onAddLicense={handleAddLicense}
  isLoading={isSaving}
/>
```

### AddSpecialtyDialog

A dialog component for adding medical specialties (primary or additional) to a user's profile.

**Features:**

- Searchable specialty selection from predefined lists
- Custom specialty entry capability
- Board certification options
- Prevents duplicate specialty addition
- Categorization as primary or additional specialty

**Props:**

- `open`: boolean - Controls dialog visibility
- `onOpenChange`: (open: boolean) => void - Callback for dialog state changes
- `onAddSpecialty`: (specialty: SpecialtyData) => void - Callback when specialty is added
- `existingSpecialties`: string[] - List of already added specialties
- `isLoading`: boolean - Shows loading state

**Usage:**

```tsx
<AddSpecialtyDialog
  open={showDialog}
  onOpenChange={setShowDialog}
  onAddSpecialty={handleAddSpecialty}
  existingSpecialties={currentSpecialties}
  isLoading={isSaving}
/>
```

## Types

### LicenseData

```tsx
interface LicenseData {
  id: string;
  name: string;
  licenseNumber: string;
  state: string;
  status: "active" | "inactive";
  issueDate?: Date;
  expirationDate?: Date;
  issuingAuthority?: string;
}
```

### SpecialtyData

```tsx
interface SpecialtyData {
  name: string;
  type: "primary" | "additional";
  taxonomyCode?: string;
  boardCertified?: boolean;
  certifyingBoard?: string;
}
```

## Integration

These components are designed to integrate seamlessly with the ProfessionalIdentity page and follow the existing design system patterns:

- Uses Radix UI components for accessibility
- Follows the existing styling patterns with Tailwind CSS
- Implements proper form validation
- Handles loading and error states
- Maintains consistency with the overall application UX

## Data Flow

1. User clicks "Add License" or "Add Specialty" button
2. Respective dialog opens with empty form
3. User fills out form with validation
4. Form submission triggers parent callback with new data
5. Parent component updates state and closes dialog
6. New item appears in the respective list

## Validation

Both components include comprehensive form validation:

- Required field validation
- Date validation (expiration after issue date)
- Duplicate prevention for specialties
- Real-time error feedback
- Visual error indicators

## Accessibility

- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Semantic HTML structure
