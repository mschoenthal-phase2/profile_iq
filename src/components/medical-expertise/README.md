# Medical Expertise Components

This directory contains all components related to medical expertise management functionality.

## Components

### `MedicalExpertiseManager.tsx`

Main component that orchestrates the medical expertise setup and management process. Handles state management, data loading, and navigation between different steps.

### `SpecialtySelector.tsx`

Component for selecting medical specialty. Displays available specialties in a grid layout and handles specialty selection.

### `ExpertiseSelector.tsx`

Component for selecting conditions, procedures, and reasons for visits based on the selected specialty. Provides search and filter functionality.

### `MedicalExpertiseStats.tsx`

Component that displays statistics and summary information about the user's selected medical expertise.

## Features

- **Specialty-based filtering**: Users can only select items relevant to their specialty
- **Multi-step process**: Clear progression from specialty selection to expertise building
- **Search and filter**: Find specific conditions, procedures, or reasons for visits
- **Real-time validation**: Ensures appropriate selections are made
- **Responsive design**: Works on desktop and mobile devices
- **State persistence**: Saves progress as users make selections

## Data Flow

1. User selects their medical specialty
2. System loads available conditions, procedures, and reasons for visits for that specialty
3. User selects their areas of expertise
4. Data is validated and saved to the user's profile

## Integration

The components integrate with:

- Supabase for data persistence
- The existing profile system
- The dashboard navigation
- Form validation and error handling
