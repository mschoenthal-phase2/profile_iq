# ProfileIQ Supabase Integration

This directory contains all the necessary components for integrating ProfileIQ with Supabase as the backend database.

## 📁 File Structure

```
src/
├── types/database.ts           # TypeScript types for all database tables
├── lib/data-transformers.ts    # Utilities to transform frontend data to database format
├── services/supabase-service.ts # Service layer for all database operations
└── database/
    ├── schema.sql              # Complete SQL schema for Supabase setup
    └── README.md               # This documentation file
```

## 🗄️ Database Schema Overview

### Core Tables

1. **users** - Base user profiles from signup flow
2. **npi_data** - Complete NPI registry information
3. **professional_identity** - Combined credentials + professional identity data
4. **professional_licenses** - State licenses and certifications
5. **medical_specialties** - Primary and additional specialties
6. **professional_credentials** - Degrees and credentials (MD, DO, etc.)

### Profile Section Tables

7. **profile_sections** - Metadata about section completion status
8. **practice_essentials** - Practice information and affiliations
9. **insurance_plans** - Accepted insurance plans
10. **medical_expertise** - Areas of expertise and procedures
11. **publications** - Research publications and papers
12. **clinical_trials** - Clinical trial participation
13. **locations** - Practice locations and addresses
14. **education_training** - Educational background
15. **biography** - Professional summary and personal information
16. **media_press** - Media appearances and press coverage

## 🔄 Data Flow

### 1. Signup Flow Data Capture

```typescript
// From signup form (step 1 & 2)
const signupData = {
  fullName: "Dr. Justin Dimick",
  email: "jdimick@med.umich.edu",
  password: "hashedpassword",
  jobTitle: "Professor and Chair of Surgery",
  npiNumber: "1578714549",
  organization: "University of Michigan",
  agreeToTerms: true,
  agreeToPrivacy: true,
};

// Transform to database format
const userProfile = transformSignupDataToUserProfile(signupData);
```

### 2. NPI Lookup Data Storage

```typescript
// From NPPES API response
const npiProvider = {
  /* NPI API response */
};

// Transform and store
const npiData = transformNPIProviderToNPIData(userId, npiProvider);
await supabaseService.storeNPIData(npiData);
```

### 3. Profile Section Updates

```typescript
// From Professional Identity page
const professionalIdentityData = {
  /* form data */
};

// Transform and store
const transformedData = transformProfessionalIdentityData(
  userId,
  professionalIdentityData,
);
await supabaseService.storeProfessionalIdentity(transformedData);
```

## 🚀 Setting Up Supabase

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### Step 2: Set Up Database Schema

1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `schema.sql`
3. Run the script to create all tables, indexes, and policies

### Step 3: Configure Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Install Supabase Client

```bash
npm install @supabase/supabase-js
```

### Step 5: Initialize Supabase Service

```typescript
import { createClient } from "@supabase/supabase-js";
import { supabaseService } from "@/services/supabase-service";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

supabaseService.initialize(supabaseUrl, supabaseKey);
```

## 🔧 Usage Examples

### Creating a Complete User Profile

```typescript
import { supabaseService } from "@/services/supabase-service";

// During signup completion
const result = await supabaseService.createCompleteUserProfile(
  signupData,
  npiProvider,
  professionalIdentityData,
);

if (result.success) {
  console.log("User created:", result.data.userId);
} else {
  console.error("Error:", result.error);
}
```

### Updating a Profile Section

```typescript
// When user saves Professional Identity page
const result = await supabaseService.updateProfileSection(
  userId,
  "professional_identity",
  formData,
);
```

### Retrieving Complete Profile

```typescript
// For displaying dashboard
const result = await supabaseService.getCompleteProfile(userId);
if (result.success) {
  const profile = result.data; // CompleteProviderProfile type
}
```

### Searching Providers

```typescript
// For provider directory
const results = await supabaseService.searchProviders({
  specialty: "Surgery",
  location: "Michigan",
  name: "Dimick",
});
```

## 🔒 Security Features

### Row Level Security (RLS)

- **Enabled on all tables** - Users can only access their own data
- **Public search view** - Allows searching provider profiles (configurable)
- **Admin policies** - Can be added for administrative access

### Data Validation

- **Frontend validation** - Form validation before submission
- **Database constraints** - SQL constraints for data integrity
- **TypeScript types** - Compile-time type checking
- **Transform validation** - Runtime validation during data transformation

## 📊 Data Relationships

```
users (1) ←→ (1) npi_data
users (1) ←→ (1) professional_identity
users (1) ←→ (many) professional_licenses
users (1) ←→ (many) medical_specialties
users (1) ←→ (many) professional_credentials
users (1) ←→ (many) publications
users (1) ←→ (many) clinical_trials
users (1) ←→ (many) locations
users (1) ←→ (many) education_training
users (1) ←→ (1) biography
users (1) ←→ (many) media_press
```

## 🎯 Key Benefits

### 1. **Complete Data Capture**

- All signup flow data preserved
- Full NPI registry information stored
- Comprehensive profile sections covered

### 2. **Type Safety**

- Full TypeScript coverage
- Database types match frontend interfaces
- Compile-time error checking

### 3. **Data Integrity**

- Validation at multiple levels
- Database constraints and foreign keys
- Transformation utilities ensure consistency

### 4. **Scalability**

- Proper indexing for performance
- Normalized database structure
- Efficient querying with views

### 5. **Security**

- Row-level security policies
- User data isolation
- Configurable access controls

## 🔄 Migration Strategy

When you're ready to integrate Supabase:

1. **Phase 1**: Set up database and basic auth
2. **Phase 2**: Migrate signup flow to use Supabase
3. **Phase 3**: Connect Professional Identity page
4. **Phase 4**: Add remaining profile sections
5. **Phase 5**: Implement search and directory features

The current mock implementations in `supabase-service.ts` can be gradually replaced with real Supabase calls as you implement each phase.
