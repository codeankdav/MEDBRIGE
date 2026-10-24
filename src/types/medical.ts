export type PatientId = string;

export interface ConsentScopes {
  bloodAllergies: boolean;
  medicationsImplants: boolean;
  chronicConditions: boolean;
  emergencyContacts: boolean;
  sensitiveHistory: boolean;
}

export interface AllergyItem {
  name: string;
  reaction: string;
  severity: 'HIGH RISK' | 'MODERATE' | 'CRITICAL';
  contraindications: string;
  rescueDevice?: string;
}

export interface MedicationItem {
  name: string;
  dosage: string;
  route: string;
  frequency: string;
  classification: string;
}

export interface ImplantItem {
  name: string;
  category: string;
  mriStatus: string;
  telemetryStatus: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  authorizedProxy: boolean;
}

export interface ClinicalDirective {
  codeStatus: 'FULL CODE' | 'DNR (DO NOT RESUSCITATE)' | 'COMFORT MEASURES ONLY';
  intubationOrder: string;
  defibrillationOrder: string;
  artificialNutrition: string;
  organDonor: boolean;
  polstRegistryId: string;
  attendingPhysician: string;
  notarizedDate: string;
}

export interface PatientProfile {
  id: PatientId;
  name: string;
  dob: string;
  mrn: string;
  bloodGroup: string;
  rhFactor: string;
  universalDonor: boolean;
  antibodyScreen: string;
  triageSeverity: 'L-1 TRAUMA' | 'L-1 CRITICAL' | 'L-2 URGENT';
  aiContraindicationSummary: string;
  allergies: AllergyItem[];
  medications: MedicationItem[];
  implants: ImplantItem[];
  chronicConditions: string[];
  emergencyContacts: EmergencyContact[];
  sensitiveHistory: {
    psychiatryNotes: string;
    genomicNotes: string;
    confidentialClinician: string;
  };
  directives: ClinicalDirective;
  gender?: string;
  accountStatus?: 'Active' | 'Pending' | 'Suspended';
  proxyContact?: EmergencyContact;
  medicalHistory?: string[];
  dateOfBirth?: string;
  age?: number;
  triageVitals?: { heartRate: string; bloodPressure: string; spo2: string; glucose: string };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  badgeId: string;
  rolePill: string;
  actionEvent: string;
  status: 'VERIFIED' | 'ACCESS GRANTED' | 'MINTED' | 'EXPIRED / REVOKED' | 'OVERRIDE APPLIED';
  color: 'secondary' | 'primary' | 'error' | 'tertiary';
  hashProof: string;
}
