// Basic supporting types
export type Gender = 'Male' | 'Female' | 'Other' | 'PreferNotToSay';
export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Other';
export type EmploymentType = 'FullTime' | 'PartTime' | 'Contract' | 'Intern' | 'Consultant';
export type WorkMode = 'Onsite' | 'Remote' | 'Hybrid';
export type BloodGroup = 'A+'|'A-'|'B+'|'B-'|'AB+'|'AB-'|'O+'|'O-';
export type AssetStatus = 'Assigned' | 'Returned' | 'Damaged' | 'Lost';
export type PerfRating = 1|2|3|4|5;
export type Currency = 'INR'|'USD'|'EUR'|'GBP'|'AUD'|'SGD'|'CAD'|'Other';
export type DocType =
  | 'Aadhaar' | 'PAN' | 'Passport' | 'DL' | 'VoterID'
  | 'OfferLetter' | 'ExperienceLetter' | 'RelievingLetter'
  | 'EducationCert' | 'AddressProof' | 'BankProof' | 'Photograph' | 'Resume';

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface Phone {
  countryCode: string;     // e.g., +91
  number: string;          // digits
  type?: 'Mobile' | 'Home' | 'Work';
  isPrimary?: boolean;
}

export interface Email {
  address: string;
  type?: 'Personal' | 'Work';
  isPrimary?: boolean;
}

export interface BankDetails {
  accountHolder: string;
  bankName: string;
  accountNumber: string;
  ifscOrSwift: string;        // IFSC (India) or SWIFT
  branch?: string;
  pan?: string;               // tax linkage
  upiId?: string;
}

export interface GovernmentIds {
  aadhaar?: string;           // India
  pan?: string;               // India
  passportNumber?: string;
  passportExpiry?: string;    // ISO date
  uan?: string;               // EPF (India)
  esic?: string;              // ESIC (India)
  ssnOrTin?: string;          // other geos
}

export interface DocumentMeta {
  type: DocType;
  numberOrId?: string;
  fileName?: string;
  fileType?: string;          // e.g. application/pdf
  sizeBytes?: number;
  url?: string;               // storage URL/path
  uploadedOn?: string;        // ISO date
  expiryDate?: string;        // ISO date (for passport etc)
  verified?: boolean;
  remarks?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phones: Phone[];
  email?: string;
  address?: Address;
}

export interface Education {
  level: '10th'|'12th'|'Diploma'|'Bachelors'|'Masters'|'Doctorate'|'Other';
  degreeOrCourse: string;
  institution: string;
  boardOrUniversity?: string;
  startDate?: string;
  endDate?: string;
  gradeOrPercentage?: string;
  certificate?: DocumentMeta;
}

export interface Experience {
  organization: string;
  title: string;
  startDate: string;
  endDate?: string;
  lastCTC?: { amount: number; currency: Currency };
  responsibilities?: string[];
  relievingLetter?: DocumentMeta;
}

export interface WorkLocation {
  siteCode?: string;          // e.g., MUM-001
  name?: string;              // Kurla Office
  address?: Address;
  timezone?: string;          // e.g., Asia/Kolkata
}

export interface Compensation {
  currency: Currency;
  ctcAnnual: number;          // Annual CTC
  fixedAnnual?: number;
  variableAnnual?: number;
  payFrequency: 'Monthly'|'BiWeekly'|'Weekly';
  inHandMonthly?: number;
  effectiveFrom?: string;
  components?: {
    name: string;             // e.g., Basic, HRA, LTA
    amount: number;
    periodicity: 'Monthly'|'Annual'|'OneTime';
    taxable?: boolean;
  }[];
}

export interface Benefits {
  healthInsurance?: {
    provider?: string;
    policyNumber?: string;
    sumInsured?: number;
    dependentsCovered?: boolean;
    startDate?: string;
    endDate?: string;
  };
  providentFund?: { enrolled: boolean; uan?: string; employerContributionPct?: number; employeeContributionPct?: number; };
  gratuity?: { eligible: boolean; };
  esop?: { eligible: boolean; grantDate?: string; optionsGranted?: number; };
  otherBenefits?: string[];
}

export interface LeaveBalances {
  annual?: number;
  sick?: number;
  casual?: number;
  compOff?: number;
  maternity?: number;
  paternity?: number;
  lossOfPay?: number;
  lastUpdated?: string;
}

export interface ITAccess {
  emailId?: string;           // corporate email
  loginId?: string;
  adOrAzureId?: string;
  roles?: string[];           // e.g., ['HR','Manager']
  permissions?: string[];     // or use RBAC in app
  resources?: { system: string; accessLevel: string; assignedOn?: string }[];
}

export interface Asset {
  tagId: string;              // asset tag
  type: string;               // Laptop, Monitor, Phone
  make?: string;
  model?: string;
  serialNumber?: string;
  issuedOn?: string;
  returnedOn?: string;
  status: AssetStatus;
  remarks?: string;
}

export interface PerformanceRecord {
  cycle: string;              // e.g., 2024-H2
  rating: PerfRating;
  reviewer: string;
  reviewDate: string;
  goals?: { name: string; weight?: number; score?: number; }[];
  comments?: string;
  documents?: DocumentMeta[];
}

export interface Onboarding {
  offerDate?: string;
  acceptedOn?: string;
  backgroundCheckStatus?: 'Pending'|'Clear'|'Issue';
  joiningDate: string;        // DOJ
  probationMonths?: number;
  confirmationDate?: string;
  buddyOrMentor?: string;
  checklist?: { item: string; completed: boolean; completedOn?: string }[];
}

export interface Separation {
  status?: 'Active'|'Resigned'|'Terminated'|'Retired';
  resignationDate?: string;
  lastWorkingDay?: string;
  reason?: string;
  exitChecklist?: { item: string; completed: boolean; completedOn?: string }[];
  documents?: DocumentMeta[]; // relieving, experience letter
}

export interface HealthInfo {
  bloodGroup?: BloodGroup;
  allergies?: string[];
  disabilities?: string;
}

export interface TaxInfo {
  pan?: string;
  regime?: 'Old'|'New';                   // India
  declarations?: { section: string; amount: number }[]; // 80C, 80D etc.
}

export interface AttendanceProfile {
  workMode: WorkMode;
  shift?: string;                           // e.g., General, UK, US
  weeklyOff?: ('Sat'|'Sun'|'Mon'|'Tue'|'Wed'|'Thu'|'Fri')[];
  managerId?: string;
  deviceIds?: string[];                     // biometric ids
}

export interface Employee {
  // Identifiers
  employeeId: string;                       // Unique key (e.g., EMP00123)
  corporateEmail?: string;

  // Personal
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName?: string;                        // computed if needed
  dob?: string;                             // ISO YYYY-MM-DD
  gender?: Gender;
  maritalStatus?: MaritalStatus;
  nationality?: string;
  photoUrl?: string;

  // Contact
  emails: Email[];
  phones: Phone[];
  currentAddress?: Address;
  permanentAddress?: Address;

  // Compliance IDs
  governmentIds?: GovernmentIds;

  // Employment
  employment: {
    title: string;                          // Designation
    department: string;
    businessUnit?: string;
    division?: string;
    gradeLevel?: string;                    // L1/L2 etc.
    employmentType: EmploymentType;
    dateOfJoining: string;
    workLocation?: WorkLocation;
    attendance?: AttendanceProfile;
  };

  // Compensation & Benefits
  compensation: Compensation;
  bank?: BankDetails;
  tax?: TaxInfo;
  benefits?: Benefits;

  // HR Data
  leaveBalances?: LeaveBalances;
  documents?: DocumentMeta[];
  emergencyContacts?: EmergencyContact[];
  education?: Education[];
  experience?: Experience[];
  skills?: string[];
  certifications?: { name: string; authority?: string; validTill?: string; certificate?: DocumentMeta }[];

  // IT & Assets
  itAccess?: ITAccess;
  assets?: Asset[];

  // Onboarding / Performance / Separation
  onboarding?: Onboarding;
  performance?: PerformanceRecord[];
  separation?: Separation;

  // Health (optional)
  health?: HealthInfo;

  // Audit
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}