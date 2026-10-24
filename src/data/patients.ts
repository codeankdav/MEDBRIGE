import { PatientProfile, PatientId } from '../types/medical';

const ORIGINAL_PATIENTS: Record<string, PatientProfile> = {
  'aarav-mehta': {
    id: 'aarav-mehta',
    name: 'Aarav Mehta',
    dob: '1984-06-14 (Age 42)',
    mrn: '8492-AX',
    bloodGroup: 'O-',
    rhFactor: 'RH NEGATIVE',
    universalDonor: true,
    antibodyScreen: 'NEGATIVE (Crossmatched)',
    triageSeverity: 'L-1 TRAUMA',
    aiContraindicationSummary: 'High bleeding risk (Apixaban). Penicillin anaphylaxis. Pacemaker MRI caution.',
    allergies: [
      {
        name: 'Penicillin',
        reaction: 'Anaphylaxis',
        severity: 'CRITICAL',
        contraindications: 'Beta-Lactams, Cephalosporins',
        rescueDevice: 'Epipen Prescribed',
      },
      {
        name: 'Sulfonamides',
        reaction: 'Toxic Rash / Erythema Multiforme',
        severity: 'HIGH RISK',
        contraindications: 'Bactrim, Sulfa diuretics',
      },
    ],
    medications: [
      {
        name: 'Apixaban 5mg',
        dosage: '5mg',
        route: 'Oral',
        frequency: 'BID (Twice Daily)',
        classification: 'Active Anticoagulant (Factor Xa Inhibitor)',
      },
    ],
    implants: [
      {
        name: 'Cardiac Pacemaker',
        category: 'Dual-Chamber Transvenous',
        mriStatus: 'MRI Caution (Conditioned 1.5T)',
        telemetryStatus: 'SYNCED FIRSTNET',
      },
    ],
    chronicConditions: [
      'Atrial fibrillation (paroxysmal, CHA2DS2-VASc score 2)',
      'Essential hypertension baseline (controlled on ACEi)',
    ],
    emergencyContacts: [
      {
        name: 'Maya Mehta',
        relationship: 'Spouse & Healthcare Proxy',
        phone: '+1 (555) 392-8819',
        authorizedProxy: true,
      },
      {
        name: 'Rohan Mehta',
        relationship: 'Brother',
        phone: '+1 (555) 741-9022',
        authorizedProxy: false,
      },
    ],
    sensitiveHistory: {
      psychiatryNotes: 'Outpatient treatment for generalized adjustment disorder (2021). Shielded by Zero-Knowledge Rule #3.',
      genomicNotes: 'APOE-e4 carrier risk assessment. Shielded from standard emergency triage view.',
      confidentialClinician: 'Dr. Evelyn Reed (Behavioral Health)',
    },
    directives: {
      codeStatus: 'FULL CODE',
      intubationOrder: 'Attempt full resuscitation, intubation allowed for acute trauma',
      defibrillationOrder: 'Standard ACLS defibrillation permitted with magnet shielding over pacemaker',
      artificialNutrition: 'Full support unless determined irreversible by two attending physicians',
      organDonor: true,
      polstRegistryId: 'POLST-CA-99214-MEHTA',
      attendingPhysician: 'Dr. Sarah Lin, MD (Chief of Cardiology, St. Mary Health)',
      notarizedDate: '2026-03-12',
    },
  },

  'zoya-khan': {
    id: 'zoya-khan',
    name: 'Zoya Khan',
    dob: '1995-11-20 (Age 30)',
    mrn: '5177-ZB',
    bloodGroup: 'B+',
    rhFactor: 'RH POSITIVE',
    universalDonor: false,
    antibodyScreen: 'NEGATIVE (Kell: Neg, Duffy: Normal)',
    triageSeverity: 'L-2 URGENT',
    aiContraindicationSummary: 'DKA vulnerability if insulin pump disconnected. Severe NSAID bronchospasm alert.',
    allergies: [
      {
        name: 'Aspirin / NSAIDs',
        reaction: 'Severe Bronchospasm & Angioedema',
        severity: 'CRITICAL',
        contraindications: 'Ketorolac, Ibuprofen, Naproxen',
        rescueDevice: 'Albuterol + IM Epi',
      },
      {
        name: 'Sulfa Antibiotics',
        reaction: 'Severe Cutaneous Adverse Reaction',
        severity: 'HIGH RISK',
        contraindications: 'Sulfamethoxazole / Trimethoprim',
      },
    ],
    medications: [
      {
        name: 'Insulin Lispro (Humalog)',
        dosage: 'Continuous SubQ (0.75 u/hr)',
        route: 'Subcutaneous Pump',
        frequency: 'Basal / Bolus Algorithmic',
        classification: 'Rapid-Acting Human Insulin Analog',
      },
      {
        name: 'Albuterol Sulfate HFA',
        dosage: '90mcg / actuation',
        route: 'Inhalation',
        frequency: 'PRN Wheezing (Max Q4H)',
        classification: 'Short-Acting Beta2-Agonist (SABA)',
      },
    ],
    implants: [
      {
        name: 'Omnipod 5 Automated Insulin Pod',
        category: 'Tubeless Subcutaneous Delivery',
        mriStatus: 'Remove Pod Prior to MRI / CT Scan',
        telemetryStatus: 'BLE TRANSMITTER LINKED',
      },
      {
        name: 'Dexcom G7 CGM Sensor',
        category: 'Continuous Glucose Monitor (Right Tricep)',
        mriStatus: 'Non-MRI Compatible',
        telemetryStatus: 'NFC & BLUETOOTH STREAMING',
      },
    ],
    chronicConditions: [
      'Type 1 Diabetes Mellitus (diagnosed age 9, tight glycemic control)',
      'Moderate persistent asthma (exercise & allergen induced)',
    ],
    emergencyContacts: [
      {
        name: 'Tariq Khan',
        relationship: 'Father / Emergency Contact',
        phone: '+1 (555) 488-3012',
        authorizedProxy: true,
      },
    ],
    sensitiveHistory: {
      psychiatryNotes: 'Post-adolescent diabetic burnout therapy (2018). Protected under HIPAA Rule §164.508.',
      genomicNotes: 'BRCA1/2 negative genetic sequencing results.',
      confidentialClinician: 'Dr. Michael Cho (Endocrinology)',
    },
    directives: {
      codeStatus: 'FULL CODE',
      intubationOrder: 'Intubation authorized for acute respiratory arrest or diabetic coma',
      defibrillationOrder: 'Full ACLS standard resuscitation authorized',
      artificialNutrition: 'Full metabolic & nutritional support authorized',
      organDonor: true,
      polstRegistryId: 'POLST-CA-44810-KHAN',
      attendingPhysician: 'Dr. Anita Desai, MD (Endocrine Intensive Care)',
      notarizedDate: '2026-01-18',
    },
  },

  'rajesh-verma': {
    id: 'rajesh-verma',
    name: 'Rajesh Verma',
    dob: '1956-03-08 (Age 70)',
    mrn: '9031-RV',
    bloodGroup: 'A+',
    rhFactor: 'RH POSITIVE',
    universalDonor: false,
    antibodyScreen: 'NEGATIVE (CMV Negative, Crossmatched)',
    triageSeverity: 'L-1 CRITICAL',
    aiContraindicationSummary: 'ACTIVE DNR DIRECTIVE ON FILE. Dual Antiplatelet Bleed Risk. Severe Latex Allergy.',
    allergies: [
      {
        name: 'Latex',
        reaction: 'Severe Contact Anaphylaxis',
        severity: 'CRITICAL',
        contraindications: 'Natural rubber gloves, catheters, bungs',
        rescueDevice: 'Latex-Free Cart Mandatory',
      },
      {
        name: 'IV Iodinated Contrast',
        reaction: 'Severe Anaphylactoid Bronchospasm',
        severity: 'HIGH RISK',
        contraindications: 'Standard CT contrast without steroid pre-treatment',
      },
    ],
    medications: [
      {
        name: 'Clopidogrel 75mg',
        dosage: '75mg',
        route: 'Oral',
        frequency: 'Daily',
        classification: 'Antiplatelet P2Y12 Inhibitor (Bleeding Alert)',
      },
      {
        name: 'Metoprolol Succinate 50mg',
        dosage: '50mg',
        route: 'Oral',
        frequency: 'Daily (Morning)',
        classification: 'Beta-1 Selective Adrenergic Blocker',
      },
    ],
    implants: [
      {
        name: 'Aortic Endovascular Stent Graft',
        category: 'EVAR AAA Prosthesis (Placed 2024)',
        mriStatus: 'MR Conditional (3.0T / 1.5T Safe)',
        telemetryStatus: 'VASCULAR REGISTRY VERIFIED',
      },
    ],
    chronicConditions: [
      'Coronary Artery Disease s/p PCI with drug-eluting stents (2022)',
      'Stage 3 Chronic Kidney Disease (Baseline Cr 1.6, eGFR 48)',
    ],
    emergencyContacts: [
      {
        name: 'Sunita Verma',
        relationship: 'Spouse & Medical Power of Attorney',
        phone: '+1 (555) 919-6644',
        authorizedProxy: true,
      },
    ],
    sensitiveHistory: {
      psychiatryNotes: 'Cognitive baseline screening notes (Normal MoCA score 28/30). Confidential patient archive.',
      genomicNotes: 'APOE-e3/e3 neutral baseline screening.',
      confidentialClinician: 'Dr. Ramesh Patel (Geriatric Medicine)',
    },
    directives: {
      codeStatus: 'DNR (DO NOT RESUSCITATE)',
      intubationOrder: 'DO NOT INTUBATE (DNI) - Non-invasive BiPAP/CPAP allowed for comfort',
      defibrillationOrder: 'DO NOT DEFIBRILLATE - Allow natural death in cardiac arrest',
      artificialNutrition: 'Comfort feeds only. No long-term PEG tube placement.',
      organDonor: false,
      polstRegistryId: 'POLST-CA-11209-VERMA',
      attendingPhysician: 'Dr. Gregory House, MD (Palliative & Vascular Surgery)',
      notarizedDate: '2026-05-19',
    },
  },
};

const firstNames = ['Mira','Dev','Anaya','Ishaan','Leela','Kabir','Nisha','Arjun','Tara','Neil','Riya','Vihaan','Sana','Kiran','Aditi','Rohan','Meera','Ayaan','Diya','Sameer','Ira','Rehan','Maya','Aarav','Zara','Nikhil','Saira','Rahul','Amara','Yash'];
const lastNames = ['Iyer','Shah','Reddy','Kapoor','Nair','Malhotra','Patel','Joshi','Desai','Rao','Bose','Sethi','Menon','Kulkarni','Chopra','Bhat','Saxena','Pillai','Khanna','Sen'];
const bloodGroups = ['O+','O-','A+','A-','B+','B-','AB+','AB-'];
const conditions = ['Mild intermittent asthma','Essential hypertension','Migraine without aura','Seasonal allergic rhinitis','Hypothyroidism','Type 2 diabetes (diet controlled)','No known chronic conditions'];
const allergyNames = ['No known allergies','Pollen','Amoxicillin','Shellfish','Ibuprofen','Latex','Peanuts','Adhesive tape'];
const medicationNames = ['None reported','Lisinopril 10mg','Levothyroxine 50mcg','Cetirizine 10mg','Metformin 500mg','Albuterol inhaler','Atorvastatin 20mg'];
const contacts = ['Asha','Vikram','Rina','Kunal','Priya','Naveen','Sonal','Irfan','Geeta','Manoj'];
const calcAge = (dob: string) => { const b = new Date(`${dob.slice(0,10)}T00:00:00`); const n = new Date(); let a = n.getFullYear()-b.getFullYear(); if (n.getMonth()<b.getMonth() || (n.getMonth()===b.getMonth() && n.getDate()<b.getDate())) a--; return a; };
const generated: Record<string, PatientProfile> = {};
for (let i=4; i<=100; i++) {
  const n=i-4, given=firstNames[n%firstNames.length], family=lastNames[Math.floor(n/firstNames.length)%lastNames.length];
  const name=`${given} ${family}`, slug=`patient-${String(i).padStart(3,'0')}`, bg=bloodGroups[n%8], dob=`${1970+n%35}-${String(1+n%12).padStart(2,'0')}-${String(1+(n*7)%27).padStart(2,'0')}`;
  const allergy=allergyNames[n%allergyNames.length], medication=medicationNames[(n*3)%medicationNames.length], condition=conditions[(n*5)%conditions.length], contact=contacts[n%contacts.length];
  const emergency={name:`${contact} ${family}`,relationship:'Family contact',phone:`+1 (555) ${String(200+n).padStart(3,'0')}-${String(1000+n).slice(-4)}`,authorizedProxy:true};
  generated[slug]={id:slug,name,dob:`${dob} (Age ${calcAge(dob)})`,mrn:`MB-${String(10000+i)}`,bloodGroup:bg,rhFactor:bg.endsWith('+')?'RH POSITIVE':'RH NEGATIVE',universalDonor:bg==='O-',antibodyScreen:'NEGATIVE (Synthetic demo record)',triageSeverity:'L-2 URGENT',aiContraindicationSummary:allergy==='No known allergies'?'No critical contraindications on file (synthetic record).':`${allergy} listed as an allergy; verify before treatment.`,allergies:allergy==='No known allergies'?[]:[{name:allergy,reaction:'Reported reaction; confirm with patient',severity:'MODERATE',contraindications:`Avoid ${allergy} pending clinical review`}],medications:medication==='None reported'?[]:[{name:medication,dosage:medication.split(' ').slice(-1)[0],route:'Oral',frequency:'As prescribed',classification:'Patient reported medication'}],implants:[],chronicConditions:condition.startsWith('No known')?[]:[condition],emergencyContacts:[emergency],proxyContact:emergency,medicalHistory:[condition==='No known chronic conditions'?'No additional history reported':condition,'Synthetic demonstration profile'],gender:['Female','Male','Non-binary'][n%3],accountStatus:(['Active','Active','Pending','Suspended'] as const)[n%4],sensitiveHistory:{psychiatryNotes:'No sensitive history provided in synthetic demo record.',genomicNotes:'No genomic data provided.',confidentialClinician:'Not specified'},directives:{codeStatus:'FULL CODE',intubationOrder:'Standard emergency care per clinical assessment',defibrillationOrder:'Standard ACLS per clinical assessment',artificialNutrition:'Per clinical assessment',organDonor:false,polstRegistryId:`DEMO-${String(i).padStart(3,'0')}`,attendingPhysician:'Synthetic demonstration record',notarizedDate:'2026-01-01'}};
}
const allPatients: Record<string, PatientProfile> = {...ORIGINAL_PATIENTS,...generated};
export const PATIENTS: Record<string, PatientProfile> = Object.fromEntries(Object.entries(allPatients).map(([id,p])=>{const n=Number(id.match(/\d+/)?.[0]||1);return [id,{...p,dateOfBirth:p.dob.slice(0,10),age:calcAge(p.dob),gender:p.gender||'Not specified',accountStatus:p.accountStatus||'Active',proxyContact:p.proxyContact||p.emergencyContacts.find(c=>c.authorizedProxy)||p.emergencyContacts[0],medicalHistory:p.medicalHistory||p.chronicConditions,triageVitals:p.triageVitals||{heartRate:`${65+n%35} BPM`,bloodPressure:`${110+n%30}/${70+n%18}`,spo2:`${95+n%5}%`,glucose:`${85+(n*7)%60} mg/dL`}}]}));
export const PATIENT_LIST = Object.values(PATIENTS);
