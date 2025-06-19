// Locations data types

export interface LocationsData {
  locations: LocationData[];
}

export interface LocationData {
  id: string;
  locationId: string; // References predefined location
  locationName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  floor?: string;
  suiteOfficeNumber?: string;
  phoneNumber?: string;
  faxNumber?: string;
  officeHours: OfficeHours;
  isPrimaryLocation: boolean;
  acceptingNewPatients: boolean;
  specialNotes?: string;
}

export interface OfficeHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isClosed: boolean;
  startTime?: string;
  endTime?: string;
}

export interface PredefinedLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  type: "hospital" | "clinic" | "medical_center" | "health_system";
}

// Demo predefined locations
export const PREDEFINED_LOCATIONS: PredefinedLocation[] = [
  {
    id: "1",
    name: "University Hospital",
    address: "1500 E Medical Center Dr",
    city: "Ann Arbor",
    state: "MI",
    postalCode: "48109",
    type: "hospital",
  },
  {
    id: "2",
    name: "Michigan Medicine - Cardiovascular Center",
    address: "1500 E Medical Center Dr",
    city: "Ann Arbor",
    state: "MI",
    postalCode: "48109",
    type: "medical_center",
  },
  {
    id: "3",
    name: "Michigan Medicine - Cancer Center",
    address: "1500 E Medical Center Dr",
    city: "Ann Arbor",
    state: "MI",
    postalCode: "48109",
    type: "medical_center",
  },
  {
    id: "4",
    name: "Von Voigtlander Women's Hospital",
    address: "1500 E Medical Center Dr",
    city: "Ann Arbor",
    state: "MI",
    postalCode: "48109",
    type: "hospital",
  },
  {
    id: "5",
    name: "Michigan Medicine - Brighton Center",
    address: "12851 Grand River Ave",
    city: "Brighton",
    state: "MI",
    postalCode: "48116",
    type: "clinic",
  },
  {
    id: "6",
    name: "Michigan Medicine - Livonia Center",
    address: "20000 Newburgh Rd",
    city: "Livonia",
    state: "MI",
    postalCode: "48152",
    type: "clinic",
  },
  {
    id: "7",
    name: "Michigan Medicine - West Ann Arbor Health Center",
    address: "3250 W Liberty Rd",
    city: "Ann Arbor",
    state: "MI",
    postalCode: "48103",
    type: "clinic",
  },
  {
    id: "8",
    name: "Michigan Medicine - Chelsea Hospital",
    address: "775 S Main St",
    city: "Chelsea",
    state: "MI",
    postalCode: "48118",
    type: "hospital",
  },
  {
    id: "9",
    name: "Michigan Medicine - Northville Health Center",
    address: "42020 W Seven Mile Rd",
    city: "Northville",
    state: "MI",
    postalCode: "48167",
    type: "clinic",
  },
  {
    id: "10",
    name: "Michigan Medicine - Domino's Farms",
    address: "24 Frank Lloyd Wright Dr",
    city: "Ann Arbor",
    state: "MI",
    postalCode: "48105",
    type: "medical_center",
  },
] as const;

// Time options for schedule dropdowns
export const TIME_OPTIONS = [
  "6:00 AM",
  "6:30 AM",
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
] as const;

// Days of the week
export const DAYS_OF_WEEK = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
] as const;

// Helper functions
export function getPredefinedLocationById(
  id: string,
): PredefinedLocation | undefined {
  return PREDEFINED_LOCATIONS.find((location) => location.id === id);
}

export function getDefaultOfficeHours(): OfficeHours {
  return {
    monday: { isClosed: false, startTime: "8:00 AM", endTime: "5:00 PM" },
    tuesday: { isClosed: false, startTime: "8:00 AM", endTime: "5:00 PM" },
    wednesday: { isClosed: false, startTime: "8:00 AM", endTime: "5:00 PM" },
    thursday: { isClosed: false, startTime: "8:00 AM", endTime: "5:00 PM" },
    friday: { isClosed: false, startTime: "8:00 AM", endTime: "4:00 PM" },
    saturday: { isClosed: true },
    sunday: { isClosed: true },
  };
}

export function createNewLocation(predefinedLocationId: string): LocationData {
  const predefinedLocation = getPredefinedLocationById(predefinedLocationId);
  if (!predefinedLocation) {
    throw new Error(
      `Predefined location with id ${predefinedLocationId} not found`,
    );
  }

  return {
    id: Date.now().toString(),
    locationId: predefinedLocationId,
    locationName: predefinedLocation.name,
    address: predefinedLocation.address,
    city: predefinedLocation.city,
    state: predefinedLocation.state,
    postalCode: predefinedLocation.postalCode,
    officeHours: getDefaultOfficeHours(),
    isPrimaryLocation: false,
    acceptingNewPatients: true,
  };
}

// Validation functions
export function validateLocationsData(data: LocationsData): string[] {
  const errors: string[] = [];

  if (data.locations.length === 0) {
    errors.push("Please add at least one location");
  }

  // Check that only one location is marked as primary
  const primaryLocations = data.locations.filter(
    (loc) => loc.isPrimaryLocation,
  );
  if (primaryLocations.length === 0) {
    errors.push("Please select one location as your primary location");
  } else if (primaryLocations.length > 1) {
    errors.push("Only one location can be marked as primary");
  }

  // Validate each location
  data.locations.forEach((location, index) => {
    if (!location.locationName) {
      errors.push(`Location ${index + 1}: Please select a location`);
    }

    // Validate office hours
    Object.entries(location.officeHours).forEach(([day, schedule]) => {
      if (!schedule.isClosed && (!schedule.startTime || !schedule.endTime)) {
        errors.push(
          `Location ${index + 1}: Please set hours for ${day} or mark as closed`,
        );
      }
    });
  });

  return errors;
}
