export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Profile {
  id: string;
  full_name: string;
  date_of_birth: string;
  blood_group: string;
  blood_pressure: string;
  sugar_level: string;
  medical_condition_details: string;
  medical_conditions: string[];
  allergies: string[];
  medications: string[];
  emergency_contacts: EmergencyContact[];
  created_at: string;
  updated_at: string;
}