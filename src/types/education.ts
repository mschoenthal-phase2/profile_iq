// Education & Training data types

export interface MedicalSchool {
  id: string;
  institution: string;
  location: string;
  degree: string;
  graduationYear: string;
}

export interface Residency {
  id: string;
  institution: string;
  location: string;
  specialty: string;
  startYear: string;
  endYear: string;
}

export interface Fellowship {
  id: string;
  institution: string;
  location: string;
  fellowshipSpecialty: string;
  startYear: string;
  endYear: string;
}

export interface AdditionalEducation {
  id: string;
  institution: string;
  location: string;
  degree: string;
  graduationYear: string;
}

export interface EducationTrainingData {
  medicalSchool?: MedicalSchool;
  residencies: Residency[];
  fellowships: Fellowship[];
  additionalEducation: AdditionalEducation[];
}

// Mock data for institutions and programs
export const MEDICAL_SCHOOLS = [
  {
    name: "Johns Hopkins School of Medicine",
    location: "Baltimore, MD",
    degrees: ["Doctor of Medicine (MD)"],
  },
  {
    name: "Harvard Medical School",
    location: "Boston, MA",
    degrees: ["Doctor of Medicine (MD)"],
  },
  {
    name: "University of Michigan Medical School",
    location: "Ann Arbor, MI",
    degrees: ["Doctor of Medicine (MD)"],
  },
  {
    name: "Stanford University School of Medicine",
    location: "Stanford, CA",
    degrees: ["Doctor of Medicine (MD)"],
  },
  {
    name: "Mayo Clinic Alix School of Medicine",
    location: "Rochester, MN",
    degrees: ["Doctor of Medicine (MD)"],
  },
  {
    name: "University of Pennsylvania Perelman School of Medicine",
    location: "Philadelphia, PA",
    degrees: ["Doctor of Medicine (MD)"],
  },
  {
    name: "Washington University School of Medicine",
    location: "St. Louis, MO",
    degrees: ["Doctor of Medicine (MD)"],
  },
  {
    name: "Columbia University Vagelos College of Physicians and Surgeons",
    location: "New York, NY",
    degrees: ["Doctor of Medicine (MD)"],
  },
  {
    name: "University of California, San Francisco School of Medicine",
    location: "San Francisco, CA",
    degrees: ["Doctor of Medicine (MD)"],
  },
  {
    name: "Duke University School of Medicine",
    location: "Durham, NC",
    degrees: ["Doctor of Medicine (MD)"],
  },
];

export const RESIDENCY_PROGRAMS = [
  {
    name: "University of Michigan",
    location: "Ann Arbor, MI",
    specialties: [
      "General Surgery",
      "Internal Medicine",
      "Pediatrics",
      "Psychiatry",
      "Radiology",
      "Anesthesiology",
      "Emergency Medicine",
      "Family Medicine",
      "Orthopedic Surgery",
      "Neurosurgery",
    ],
  },
  {
    name: "Johns Hopkins Hospital",
    location: "Baltimore, MD",
    specialties: [
      "General Surgery",
      "Internal Medicine",
      "Pediatrics",
      "Radiology",
      "Anesthesiology",
      "Neurology",
      "Cardiology",
      "Gastroenterology",
    ],
  },
  {
    name: "Massachusetts General Hospital",
    location: "Boston, MA",
    specialties: [
      "General Surgery",
      "Internal Medicine",
      "Emergency Medicine",
      "Radiology",
      "Anesthesiology",
      "Orthopedic Surgery",
    ],
  },
  {
    name: "Mayo Clinic",
    location: "Rochester, MN",
    specialties: [
      "General Surgery",
      "Internal Medicine",
      "Pediatrics",
      "Radiology",
      "Cardiology",
      "Neurology",
    ],
  },
  {
    name: "Cleveland Clinic",
    location: "Cleveland, OH",
    specialties: [
      "General Surgery",
      "Cardiology",
      "Neurosurgery",
      "Orthopedic Surgery",
      "Radiology",
    ],
  },
];

export const FELLOWSHIP_PROGRAMS = [
  {
    name: "Dartmouth Institute for Health Policy & Clinical Practice",
    location: "Hanover, NH",
    specialties: ["Health Policy & Clinical Practice", "Healthcare Quality"],
  },
  {
    name: "University of Michigan",
    location: "Ann Arbor, MI",
    specialties: [
      "Minimally Invasive Surgery",
      "Bariatric Surgery",
      "Trauma Surgery",
      "Surgical Critical Care",
    ],
  },
  {
    name: "Johns Hopkins Hospital",
    location: "Baltimore, MD",
    specialties: [
      "Transplant Surgery",
      "Cardiac Surgery",
      "Vascular Surgery",
      "Pediatric Surgery",
    ],
  },
  {
    name: "Mayo Clinic",
    location: "Rochester, MN",
    specialties: [
      "Hepatobiliary Surgery",
      "Colorectal Surgery",
      "Endocrine Surgery",
    ],
  },
];

export const ADDITIONAL_INSTITUTIONS = [
  {
    name: "Dartmouth Institute for Health Policy & Clinical Practice",
    location: "Hanover, NH",
    degrees: [
      "Master of Public Health (MPH)",
      "Master of Health Administration (MHA)",
      "Certificate in Health Policy",
    ],
  },
  {
    name: "Harvard T.H. Chan School of Public Health",
    location: "Boston, MA",
    degrees: [
      "Master of Public Health (MPH)",
      "Master of Science (MS)",
      "Doctor of Public Health (DrPH)",
    ],
  },
  {
    name: "University of Michigan School of Public Health",
    location: "Ann Arbor, MI",
    degrees: [
      "Master of Public Health (MPH)",
      "Master of Health Services Administration (MHSA)",
    ],
  },
  {
    name: "Stanford Graduate School of Business",
    location: "Stanford, CA",
    degrees: ["Master of Business Administration (MBA)"],
  },
  {
    name: "Wharton School, University of Pennsylvania",
    location: "Philadelphia, PA",
    degrees: ["Master of Business Administration (MBA)"],
  },
];

// Helper functions
export function getInstitutionsByType(
  type: "medical_school" | "residency" | "fellowship" | "additional",
) {
  switch (type) {
    case "medical_school":
      return MEDICAL_SCHOOLS;
    case "residency":
      return RESIDENCY_PROGRAMS;
    case "fellowship":
      return FELLOWSHIP_PROGRAMS;
    case "additional":
      return ADDITIONAL_INSTITUTIONS;
    default:
      return [];
  }
}

export function getSpecialtiesByInstitution(
  institutionName: string,
  type: "residency" | "fellowship",
) {
  const programs =
    type === "residency" ? RESIDENCY_PROGRAMS : FELLOWSHIP_PROGRAMS;
  const institution = programs.find((prog) => prog.name === institutionName);
  return institution?.specialties || [];
}

export function getDegreesByInstitution(
  institutionName: string,
  type: "medical_school" | "additional",
) {
  const institutions =
    type === "medical_school" ? MEDICAL_SCHOOLS : ADDITIONAL_INSTITUTIONS;
  const institution = institutions.find(
    (inst) => inst.name === institutionName,
  );
  return institution?.degrees || [];
}
