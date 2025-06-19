-- Supabase database schema for ProfileIQ
-- This file contains all the SQL to set up the database structure

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enums
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending', 'suspended');
CREATE TYPE license_status AS ENUM ('active', 'inactive', 'expired', 'pending');
CREATE TYPE publication_type AS ENUM ('peer_reviewed', 'book', 'chapter', 'abstract', 'other');
CREATE TYPE trial_status AS ENUM ('recruiting', 'active', 'completed', 'suspended', 'terminated');
CREATE TYPE location_type AS ENUM ('primary', 'secondary', 'affiliated', 'consulting');
CREATE TYPE education_type AS ENUM ('undergraduate', 'graduate', 'medical_school', 'residency', 'fellowship', 'continuing_education');

-- Users table (main profile data)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Personal Information (from signup step 1)
    full_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    -- Professional Information (from signup step 2)
    job_title TEXT NOT NULL,
    organization TEXT,
    npi_number TEXT NOT NULL UNIQUE,

    -- User Status
    status user_status DEFAULT 'pending',
    email_verified BOOLEAN DEFAULT FALSE,

    -- Preferences
    preferred_name TEXT,
    pronouns TEXT,
    languages TEXT[],

    -- Profile Settings
    profile_photo_url TEXT,
    profile_completion_percentage INTEGER DEFAULT 0,
    last_login_at TIMESTAMP WITH TIME ZONE,

    -- Terms & Privacy
    agreed_to_terms BOOLEAN DEFAULT FALSE,
    agreed_to_privacy BOOLEAN DEFAULT FALSE,
    terms_agreed_at TIMESTAMP WITH TIME ZONE,
    privacy_agreed_at TIMESTAMP WITH TIME ZONE
);

-- NPI Registry Data
CREATE TABLE npi_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Core NPI Information
    npi_number TEXT NOT NULL UNIQUE,
    enumeration_type TEXT NOT NULL, -- NPI-1 or NPI-2
    enumeration_date DATE,
    last_updated_npi DATE,
    status TEXT DEFAULT 'A',

    -- Basic Information from NPI
    legal_business_name TEXT,
    first_name TEXT,
    last_name TEXT,
    middle_name TEXT,
    name_prefix TEXT,
    name_suffix TEXT,
    credential TEXT,
    gender TEXT,
    sole_proprietor TEXT,

    -- Organization Information (for NPI-2)
    organization_name TEXT,
    authorized_official_first_name TEXT,
    authorized_official_last_name TEXT,
    authorized_official_middle_name TEXT,
    authorized_official_credential TEXT,
    authorized_official_title TEXT,
    authorized_official_telephone TEXT,

    -- Raw NPI Data (for backup)
    raw_npi_data JSONB,

    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE
);

-- Professional Identity
CREATE TABLE professional_identity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Personal Information
    full_legal_name TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    preferred_name TEXT,
    pronouns TEXT,
    professional_email TEXT NOT NULL,

    -- Professional Role
    job_title TEXT NOT NULL,
    department TEXT NOT NULL,
    division TEXT,
    section TEXT,

    -- Profile Status
    is_complete BOOLEAN DEFAULT FALSE,
    last_reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Professional Licenses
CREATE TABLE professional_licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    license_name TEXT NOT NULL,
    license_number TEXT NOT NULL,
    issuing_state TEXT NOT NULL,
    issuing_authority TEXT,
    issue_date DATE,
    expiration_date DATE,
    status license_status DEFAULT 'active',

    -- Verification
    is_verified BOOLEAN DEFAULT FALSE,
    verification_document_url TEXT,

    UNIQUE(user_id, license_number, issuing_state)
);

-- Medical Specialties
CREATE TABLE medical_specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    specialty_name TEXT NOT NULL,
    taxonomy_code TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    board_certified BOOLEAN DEFAULT FALSE,
    certification_date DATE,
    certifying_board TEXT,
    recertification_date DATE,

    UNIQUE(user_id, specialty_name)
);

-- Professional Credentials
CREATE TABLE professional_credentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    credential TEXT NOT NULL,
    display_order INTEGER DEFAULT 1,
    is_verified BOOLEAN DEFAULT FALSE,

    UNIQUE(user_id, credential)
);

-- Profile Sections Metadata
CREATE TABLE profile_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    section_id TEXT NOT NULL,
    section_name TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    is_visible BOOLEAN DEFAULT TRUE,
    is_required BOOLEAN DEFAULT FALSE,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_percentage INTEGER DEFAULT 0,

    UNIQUE(user_id, section_id)
);

-- Practice Essentials
CREATE TABLE practice_essentials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Patient Care Settings
    accepting_new_patients BOOLEAN DEFAULT TRUE,
    age_groups_treated TEXT[] DEFAULT '{}',
    appointment_types TEXT[] DEFAULT '{}',
    scheduling_notes TEXT,

    -- Legacy fields (keeping for backward compatibility)
    practice_name TEXT,
    practice_type TEXT,
    hospital_affiliations TEXT[],
    group_affiliations TEXT[],
    telehealth_services BOOLEAN DEFAULT FALSE,
    patient_age_groups TEXT[],
    practice_focus TEXT[]
);

-- Languages Spoken (separate table for better normalization)
CREATE TABLE languages_spoken (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    language_code TEXT NOT NULL, -- ISO 639-1 language code (e.g., 'en-US', 'es-MX')
    language_name TEXT NOT NULL, -- Human readable name (e.g., 'English (United States)')
    proficiency TEXT NOT NULL CHECK (proficiency IN ('native', 'fluent', 'conversational', 'basic')),
    display_order INTEGER DEFAULT 1,

    UNIQUE(user_id, language_code)
);

-- Insurance Plans
CREATE TABLE insurance_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    insurance_name TEXT NOT NULL,
    plan_type TEXT NOT NULL,
    is_accepted BOOLEAN DEFAULT TRUE,
    notes TEXT,
    verification_status TEXT DEFAULT 'pending',

    UNIQUE(user_id, insurance_name, plan_type)
);

-- Medical Expertise
CREATE TABLE medical_expertise (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    expertise_area TEXT NOT NULL,
    description TEXT,
    years_of_experience INTEGER,
    case_volume INTEGER,
    special_procedures TEXT[],
    research_interests TEXT[],

    UNIQUE(user_id, expertise_area)
);

-- Publications
CREATE TABLE publications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    title TEXT NOT NULL,
    authors TEXT[] NOT NULL,
    journal_name TEXT,
    publication_date DATE,
    volume TEXT,
    issue TEXT,
    pages TEXT,
    doi TEXT,
    pmid TEXT,
    publication_type publication_type DEFAULT 'peer_reviewed',
    abstract TEXT,
    keywords TEXT[],
    is_featured BOOLEAN DEFAULT FALSE
);

-- Clinical Trials
CREATE TABLE clinical_trials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    trial_title TEXT NOT NULL,
    nct_number TEXT,
    phase TEXT,
    status trial_status DEFAULT 'recruiting',
    start_date DATE,
    completion_date DATE,
    sponsor TEXT,
    role TEXT NOT NULL,
    description TEXT,
    conditions_studied TEXT[]
);

-- Locations
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Location Reference
    predefined_location_id TEXT NOT NULL, -- References predefined location list
    location_name TEXT NOT NULL,
    location_type location_type DEFAULT 'primary',

    -- Address Information
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    country TEXT DEFAULT 'United States',

    -- Location Details
    floor_number TEXT,
    suite_office_number TEXT,

    -- Contact Information
    phone TEXT,
    fax TEXT,
    email TEXT,
    website TEXT,

    -- Settings
    is_primary BOOLEAN DEFAULT FALSE,
    accepts_new_patients BOOLEAN DEFAULT TRUE,
    telehealth_available BOOLEAN DEFAULT FALSE,

    -- Notes
    special_notes TEXT
);

-- Office Hours (separate table for better normalization)
CREATE TABLE office_hours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    day_of_week TEXT NOT NULL CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
    is_closed BOOLEAN DEFAULT FALSE,
    start_time TEXT, -- Format: "8:00 AM"
    end_time TEXT,   -- Format: "5:00 PM"

    UNIQUE(location_id, day_of_week)
);

-- Education & Training
CREATE TABLE education_training (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    institution_name TEXT NOT NULL,
    education_type education_type NOT NULL,
    degree TEXT,
    field_of_study TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    gpa DECIMAL(3,2),
    honors TEXT[],
    description TEXT
);

-- Biography
CREATE TABLE biography (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    professional_summary TEXT NOT NULL,
    personal_interests TEXT,
    philosophy_of_care TEXT,
    awards_honors TEXT[],
    memberships TEXT[],
    volunteer_work TEXT[],
    languages_spoken TEXT[]
);

-- Media & Press
CREATE TABLE media_press (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    title TEXT NOT NULL,
    media_type TEXT NOT NULL,
    publication_source TEXT,
    date DATE,
    url TEXT,
    description TEXT,
    is_featured BOOLEAN DEFAULT FALSE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_npi_number ON users(npi_number);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_npi_data_user_id ON npi_data(user_id);
CREATE INDEX idx_npi_data_npi_number ON npi_data(npi_number);
CREATE INDEX idx_professional_identity_user_id ON professional_identity(user_id);
CREATE INDEX idx_professional_licenses_user_id ON professional_licenses(user_id);
CREATE INDEX idx_medical_specialties_user_id ON medical_specialties(user_id);
CREATE INDEX idx_medical_specialties_primary ON medical_specialties(user_id, is_primary);
CREATE INDEX idx_profile_sections_user_id ON profile_sections(user_id);
CREATE INDEX idx_publications_user_id ON publications(user_id);
CREATE INDEX idx_publications_featured ON publications(user_id, is_featured);
CREATE INDEX idx_locations_user_id ON locations(user_id);
CREATE INDEX idx_locations_primary ON locations(user_id, is_primary);
CREATE INDEX idx_office_hours_location_id ON office_hours(location_id);
CREATE INDEX idx_office_hours_day ON office_hours(location_id, day_of_week);
CREATE INDEX idx_languages_spoken_user_id ON languages_spoken(user_id);
CREATE INDEX idx_languages_spoken_proficiency ON languages_spoken(user_id, proficiency);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_npi_data_updated_at BEFORE UPDATE ON npi_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professional_identity_updated_at BEFORE UPDATE ON professional_identity FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professional_licenses_updated_at BEFORE UPDATE ON professional_licenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_specialties_updated_at BEFORE UPDATE ON medical_specialties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professional_credentials_updated_at BEFORE UPDATE ON professional_credentials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profile_sections_updated_at BEFORE UPDATE ON profile_sections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_practice_essentials_updated_at BEFORE UPDATE ON practice_essentials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_insurance_plans_updated_at BEFORE UPDATE ON insurance_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medical_expertise_updated_at BEFORE UPDATE ON medical_expertise FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_publications_updated_at BEFORE UPDATE ON publications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clinical_trials_updated_at BEFORE UPDATE ON clinical_trials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_training_updated_at BEFORE UPDATE ON education_training FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_biography_updated_at BEFORE UPDATE ON biography FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_press_updated_at BEFORE UPDATE ON media_press FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_languages_spoken_updated_at BEFORE UPDATE ON languages_spoken FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_office_hours_updated_at BEFORE UPDATE ON office_hours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for complete provider profile
CREATE VIEW complete_provider_profile AS
SELECT
    u.*,
    nd.npi_number as verified_npi,
    nd.raw_npi_data,
    pi.professional_email,
    pi.department,
    pi.division,
    pi.section,
    ARRAY_AGG(DISTINCT pl.license_name) FILTER (WHERE pl.license_name IS NOT NULL) as licenses,
    ARRAY_AGG(DISTINCT ms.specialty_name) FILTER (WHERE ms.specialty_name IS NOT NULL) as specialties,
    ARRAY_AGG(DISTINCT pc.credential) FILTER (WHERE pc.credential IS NOT NULL) as credentials
FROM users u
LEFT JOIN npi_data nd ON u.id = nd.user_id
LEFT JOIN professional_identity pi ON u.id = pi.user_id
LEFT JOIN professional_licenses pl ON u.id = pl.user_id AND pl.status = 'active'
LEFT JOIN medical_specialties ms ON u.id = ms.user_id
LEFT JOIN professional_credentials pc ON u.id = pc.user_id
GROUP BY u.id, nd.npi_number, nd.raw_npi_data, pi.professional_email, pi.department, pi.division, pi.section;

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE npi_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_identity ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_essentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_expertise ENABLE ROW LEVEL SECURITY;
ALTER TABLE publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE clinical_trials ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_training ENABLE ROW LEVEL SECURITY;
ALTER TABLE biography ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_press ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages_spoken ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_hours ENABLE ROW LEVEL SECURITY;

-- Create policies (users can only access their own data)
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own NPI data" ON npi_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own NPI data" ON npi_data FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own professional identity" ON professional_identity FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own licenses" ON professional_licenses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own specialties" ON medical_specialties FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own credentials" ON professional_credentials FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own profile sections" ON profile_sections FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own practice essentials" ON practice_essentials FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own insurance plans" ON insurance_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own medical expertise" ON medical_expertise FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own publications" ON publications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own clinical trials" ON clinical_trials FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own locations" ON locations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own education" ON education_training FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own biography" ON biography FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own media" ON media_press FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own languages" ON languages_spoken FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own office hours" ON office_hours FOR ALL USING (EXISTS (
    SELECT 1 FROM locations WHERE locations.id = office_hours.location_id AND locations.user_id = auth.uid()
));

-- Public read policies for search functionality (optional, can be restricted)
CREATE POLICY "Public can search provider profiles" ON complete_provider_profile FOR SELECT USING (true);
