# Clinical Trials Management System

This module provides a comprehensive clinical trials management system for healthcare providers, integrating with ClinicalTrials.gov API to discover and manage clinical trial involvement.

## Features

### 1. Clinical Trial Discovery

- **ClinicalTrials.gov Integration**: Search ClinicalTrials.gov by investigator name and affiliation
- **Automatic Matching**: Intelligent matching of clinical trials to user profiles
- **Bulk Selection**: Select multiple clinical trials at once for adding to profile

### 2. Manual Clinical Trial Entry

- **NCT ID Lookup**: Add clinical trials by entering NCT ID from ClinicalTrials.gov
- **Validation**: Automatic validation of NCT ID format and existence
- **Rich Metadata**: Automatically pulls trial details including phases, conditions, outcomes, and locations

### 3. Clinical Trial Management

- **Visibility Control**: Toggle clinical trial visibility on public profile
- **Role Assignment**: Specify user's role in each trial (PI, Sub-Investigator, Coordinator, etc.)
- **Status Tracking**: Track trial status (pending, approved, rejected, manual, hidden)
- **Detailed Information**: Display comprehensive trial information including outcomes, locations, and timelines

### 4. Statistics & Analytics

- **Trial Metrics**: Total, visible, and hidden clinical trial counts
- **Review Status**: Track trials pending review
- **Last Updated**: Monitor when trials were last modified

## Components

### Core Components

#### `ClinicalTrials.tsx`

Main page component that orchestrates the entire clinical trials workflow. Handles:

- Tab navigation between manage and discovery
- State management for trials and discovery results
- Integration with ClinicalTrials.gov service
- Save/cancel functionality with unsaved changes detection

#### `ClinicalTrialDiscovery.tsx`

Handles the ClinicalTrials.gov search and discovery process:

- Search form with investigator name and affiliation
- Results display with trial previews including phases, conditions, and enrollment
- Bulk selection interface
- Integration with ClinicalTrials.gov API service

#### `ClinicalTrialList.tsx`

Displays and manages the user's clinical trials:

- Clinical trial cards with comprehensive details
- Visibility toggle controls
- Role selection dropdown for each trial
- Delete confirmation dialogs
- Trial status and phase information

#### `ManualNCTEntry.tsx`

Provides manual clinical trial entry via NCT ID:

- NCT ID input validation with auto-formatting
- Step-by-step instructions
- Example NCT IDs for testing
- Integration help and guidelines

#### `ClinicalTrialStats.tsx`

Dashboard-style statistics component:

- Clinical trial count metrics
- Visibility breakdown
- Pending review indicators
- Last updated timestamps

## Services

### `clinicaltrials-service.ts`

Comprehensive ClinicalTrials.gov API integration:

- Search by investigator name and affiliation
- Fetch trial details by NCT ID
- API response parsing and data transformation
- Error handling and validation
- NCT ID format validation and formatting

## Data Types

### Core Types

```typescript
interface ClinicalTrial {
  id: string;
  nctId: string;
  title: string;
  status: ClinicalTrialStatus;
  phase: string[];
  studyType: string;
  conditions: string[];
  interventions: string[];
  userRole: UserTrialRole;
  isVisible: boolean;
  userStatus: UserTrialStatus;
}
```

### User Roles

- **Principal Investigator**: Leading the trial
- **Sub-Investigator**: Supporting investigator role
- **Study Coordinator**: Managing trial operations
- **Sponsor**: Funding/sponsoring the trial
- **Collaborator**: Collaborative role
- **Consultant**: Advisory role
- **Other**: Custom role designation

### Trial Statuses

- **Not Yet Recruiting**: Trial not started
- **Recruiting**: Actively enrolling participants
- **Active, Not Recruiting**: Running but not enrolling
- **Completed**: Trial finished
- **Terminated/Withdrawn**: Trial stopped early
- **Suspended**: Temporarily paused

## Integration

The clinical trials system integrates seamlessly with:

- **Dashboard**: Clinical trials card appears after publications section
- **Profile Layout**: Uses common profile section layout
- **Supabase**: Ready for database integration with clinical_trials table
- **UI Components**: Leverages existing design system components

## Usage

### For Developers

1. **Adding Clinical Trials Route**: Already integrated in `App.tsx`
2. **Dashboard Integration**: Clinical trials card automatically appears in dashboard
3. **Database Setup**: Clinical trials table schema included in `schema.sql`

### For Users

1. **Discovery**: Use "Clinical Trial Discovery" tab to search ClinicalTrials.gov
2. **Manual Entry**: Use "Add Clinical Trial" button for specific trials by NCT ID
3. **Management**: Use "Manage Clinical Trials" tab to control visibility and assign roles

## Configuration

### Environment Variables

- No additional environment variables required
- Uses public ClinicalTrials.gov API endpoints

### API Endpoints

- **ClinicalTrials.gov API v2**: `https://clinicaltrials.gov/api/v2/studies`
- **Study Details**: `https://clinicaltrials.gov/api/v2/studies/{nctId}`

## Key Features vs Publications

While similar in structure to the Publications system, Clinical Trials adds:

1. **Role Management**: Users can specify their role in each trial
2. **Phase Information**: Display trial phases (Phase 1, 2, 3, etc.)
3. **Multi-location Support**: Trials can span multiple locations
4. **Enrollment Data**: Participant count and recruitment status
5. **Outcome Measures**: Primary and secondary endpoints
6. **Sponsor Information**: Funding and collaboration details

## Future Enhancements

1. **Advanced Filtering**: Filter by phase, status, condition, location
2. **Timeline View**: Visual timeline of trial involvement
3. **Collaboration Networks**: Identify co-investigators and collaborators
4. **Impact Tracking**: Monitor trial outcomes and publications
5. **Auto-Discovery**: Periodic automatic discovery of new trials
6. **Integration with IRB Systems**: Connect with institutional review boards
