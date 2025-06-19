// Practice Essentials data types

export interface PracticeEssentialsData {
  patientCare: PatientCare;
  languagesSpoken: LanguageSpoken[];
}

export interface PatientCare {
  acceptingNewPatients: boolean;
  ageGroupsTreated: string[];
  appointmentTypes: string[];
  schedulingNotes: string;
}

export interface LanguageSpoken {
  id: string;
  languageCode: string;
  languageName: string;
  proficiency: LanguageProficiency;
}

export type LanguageProficiency =
  | "native"
  | "fluent"
  | "conversational"
  | "basic";

// Age groups as shown in the image
export const AGE_GROUPS = [
  { id: "newborns", label: "Newborns (0-1 month)", category: "pediatric" },
  { id: "infants", label: "Infants (1-12 months)", category: "pediatric" },
  { id: "toddlers", label: "Toddlers (1-3 years)", category: "pediatric" },
  { id: "preschool", label: "Preschool (3-5 years)", category: "pediatric" },
  { id: "school-age", label: "School Age (6-12 years)", category: "pediatric" },
  { id: "teens", label: "Teens (13-17 years)", category: "pediatric" },
  { id: "adults", label: "Adults (18-64 years)", category: "adult" },
  { id: "seniors", label: "Seniors (65+ years)", category: "adult" },
] as const;

// Appointment types as shown in the image
export const APPOINTMENT_TYPES = [
  {
    id: "in-person",
    label: "In-Person Visits",
    description: "Face-to-face appointments in your office",
  },
  {
    id: "telemedicine",
    label: "Telemedicine",
    description: "Virtual appointments via video call",
  },
  {
    id: "telephone",
    label: "Telephone Consultations",
    description: "Phone-based consultations",
  },
  {
    id: "home-visits",
    label: "Home Visits",
    description: "Patient visits at their home",
  },
] as const;

// Language proficiency levels
export const PROFICIENCY_LEVELS: {
  value: LanguageProficiency;
  label: string;
}[] = [
  { value: "native", label: "Native" },
  { value: "fluent", label: "Fluent" },
  { value: "conversational", label: "Conversational" },
  { value: "basic", label: "Basic" },
];

// ISO 639-1 language codes with common medical languages
export const COMMON_LANGUAGES = [
  { code: "en-US", name: "English (United States)", region: "United States" },
  { code: "es-US", name: "Spanish (United States)", region: "United States" },
  { code: "es-MX", name: "Spanish (Mexico)", region: "Mexico" },
  { code: "fr-FR", name: "French (France)", region: "France" },
  { code: "de-DE", name: "German (Germany)", region: "Germany" },
  { code: "it-IT", name: "Italian (Italy)", region: "Italy" },
  { code: "pt-BR", name: "Portuguese (Brazil)", region: "Brazil" },
  { code: "ru-RU", name: "Russian (Russia)", region: "Russia" },
  { code: "zh-CN", name: "Chinese Simplified (China)", region: "China" },
  { code: "zh-TW", name: "Chinese Traditional (Taiwan)", region: "Taiwan" },
  { code: "ja-JP", name: "Japanese (Japan)", region: "Japan" },
  { code: "ko-KR", name: "Korean (South Korea)", region: "South Korea" },
  { code: "ar-SA", name: "Arabic (Saudi Arabia)", region: "Saudi Arabia" },
  { code: "hi-IN", name: "Hindi (India)", region: "India" },
  { code: "bn-BD", name: "Bengali (Bangladesh)", region: "Bangladesh" },
  { code: "ur-PK", name: "Urdu (Pakistan)", region: "Pakistan" },
  { code: "fa-IR", name: "Persian (Iran)", region: "Iran" },
  { code: "tr-TR", name: "Turkish (Turkey)", region: "Turkey" },
  { code: "pl-PL", name: "Polish (Poland)", region: "Poland" },
  { code: "nl-NL", name: "Dutch (Netherlands)", region: "Netherlands" },
  { code: "sv-SE", name: "Swedish (Sweden)", region: "Sweden" },
  { code: "da-DK", name: "Danish (Denmark)", region: "Denmark" },
  { code: "no-NO", name: "Norwegian (Norway)", region: "Norway" },
  { code: "fi-FI", name: "Finnish (Finland)", region: "Finland" },
  { code: "he-IL", name: "Hebrew (Israel)", region: "Israel" },
  { code: "th-TH", name: "Thai (Thailand)", region: "Thailand" },
  { code: "vi-VN", name: "Vietnamese (Vietnam)", region: "Vietnam" },
  { code: "tl-PH", name: "Filipino (Philippines)", region: "Philippines" },
] as const;

// Helper functions
export function getLanguageByCode(code: string) {
  return COMMON_LANGUAGES.find((lang) => lang.code === code);
}

export function getAgeGroupById(id: string) {
  return AGE_GROUPS.find((group) => group.id === id);
}

export function getAppointmentTypeById(id: string) {
  return APPOINTMENT_TYPES.find((type) => type.id === id);
}

export function getProficiencyLabel(proficiency: LanguageProficiency): string {
  const level = PROFICIENCY_LEVELS.find((p) => p.value === proficiency);
  return level ? level.label : proficiency;
}

// Validation functions
export function validatePracticeEssentials(
  data: PracticeEssentialsData,
): string[] {
  const errors: string[] = [];

  // Validate that at least one age group is selected
  if (data.patientCare.ageGroupsTreated.length === 0) {
    errors.push("Please select at least one age group treated");
  }

  // Validate that at least one appointment type is selected
  if (data.patientCare.appointmentTypes.length === 0) {
    errors.push("Please select at least one appointment type");
  }

  // Validate languages
  data.languagesSpoken.forEach((lang, index) => {
    if (!lang.languageCode) {
      errors.push(`Language ${index + 1}: Please select a language`);
    }
    if (!lang.proficiency) {
      errors.push(`Language ${index + 1}: Please select a proficiency level`);
    }
  });

  return errors;
}
