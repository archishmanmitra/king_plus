export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  manager: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'terminated';
  avatar?: string;
  
  // Personal Information
  personalInfo: {
    // Personal Information
    firstName: string;
    lastName: string;
    gender: 'male' | 'female' | 'other';
    dateOfBirth: string;
    maritalStatus: 'single' | 'married' | 'divorced' | 'widowed';
    nationality: string;
    primaryCitizenship: string;
    phoneNumber: string;
    email: string;
    
    // Address
    addresses: {
      present: Address;
      primary: Address;
      emergency: EmergencyAddress;
    };
    
    // Passport
    passport: {
      passportNumber: string;
      expiryDate: string;
      issuingOffice: string;
      issuingCountry: string;
      contactNumber: string;
      address: string;
    };
    
    // Unique Identity Numbers
    identityNumbers: {
      aadharNumber: string;
      panNumber: string;
      nsr: {
        itpin: string;
        tin: string;
      };
    };
    
    // Dependents
    dependents: Dependent[];
    
    // Education
    education: Education[];
    
    // Experience
    experience: Experience[];
  };
  
  // Official Information
  officialInfo: {
    // Personal Level
    firstName: string;
    lastName: string;
    knownAs: string;
    dateOfJoining: string;
    jobConfirmation: boolean;
    role: string;
    designation: string;
    stream: string;
    subStream: string;
    baseLocation: string;
    currentLocation: string;
    unit: string;
    unitHead: string;
    
    // Confirmation Details
    confirmationDetails?: {
      status: string;
      confirmationDate: string;
      approval: string;
      rating: number;
    };
    
    // Documents
    documents: Document[];
  };
  
  // Financial Information
  financialInfo: {
    // Bank Account
    bankAccount: {
      bankName: string;
      accountNumber: string;
      ifscCode: string;
      modifiedDate: string;
      country: string;
    };
    
    // Retiral
    retiral: {
      pfTotal: number;
      employeePF: number;
      employerPF: number;
      employeeESI: number;
      employerESI: number;
      professionalTax: number;
      incomeTax: number;
      netTakeHome: number;
      costToCompany: number;
      basicSalary: number;
      houseRentAllowance: number;
      specialAllowance: number;
    };
  };
  
  // Legacy fields for backward compatibility
  personalInfoLegacy: {
    dateOfBirth: string;
    address: string;
    emergencyContact: string;
    bloodGroup: string;
  };
  workInfo: {
    workLocation: string;
    employmentType: 'full-time' | 'part-time' | 'contract';
    salary: number;
    benefits: string[];
  };
  timeline: TimelineEvent[];
}

export interface Address {
  contactName: string;
  address1: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
  mobileNumber: string;
  alternativeMobile?: string;
  area?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
}

export interface EmergencyAddress {
  contactName: string;
  relation: string;
  phoneNumber: string;
  address: Address;
}

export interface Dependent {
  relation: 'father' | 'mother' | 'wife' | 'husband' | 'other';
  name: string;
  nationality: string;
  dateOfBirth: string;
  occupation: string;
  relationEmployeeNumber?: string;
  passport?: string;
  address?: string;
}

export interface Education {
  branch: string;
  instituteName: string;
  passoutYear: string;
  qualification: string;
  universityName: string;
  level: 'secondary' | 'higher' | 'ug' | 'pg';
}

export interface Experience {
  country: string;
  organisationName: string;
  fromDate: string;
  toDate: string;
  designation: string;
  city: string;
  documentProof?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'joined' | 'promotion' | 'review' | 'leave' | 'training' | 'note';
  title: string;
  description: string;
  isPrivate?: boolean;
}

export interface Document {
  id: string;
  employeeId: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  url: string;
  uploadedBy: 'employee' | 'hr' | 'admin';
}