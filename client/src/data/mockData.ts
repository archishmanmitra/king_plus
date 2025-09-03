import { Employee, TimelineEvent } from '@/types/employee';
import { AttendanceRecord, LeaveRequest, LeaveBalance } from '@/types/attendance';
import { PayrollRun, Payslip, ExpenseClaim } from '@/types/payroll';
import { PerformanceReview, Goal, OKR } from '@/types/performance';
import { Project, Task, TimesheetEntry } from '@/types/projects';

export const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'Soumodip Dey',
    email: 'soumodip.dey@company.com',
    phone: '+1 (555) 123-4567',
    position: 'CEO (Chief Executive Officer) ',
    department: 'IT',
    manager: 'David Wilson',
    joinDate: '2022-01-15',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612c8d6?w=150&h=150&fit=crop&crop=face',
    
    // Personal Information
    personalInfo: {
      firstName: 'Soumodip',
      lastName: 'Dey',
      gender: 'female',
      dateOfBirth: '1990-05-12',
      maritalStatus: 'single',
      nationality: 'Indian',
      primaryCitizenship: 'United States',
      phoneNumber: '+1 (555) 123-4567',
      email: 'Soumodip.Dey@company.com',
      
      addresses: {
        present: {
          contactName: 'Soumodip Dey',
          address1: '123 Main Street',
          city: 'New York',
          state: 'NY',
          country: 'United States',
          pinCode: '10001',
          mobileNumber: '+1 (555) 123-4567',
          alternativeMobile: '+1 (555) 123-4568',
          area: 'Manhattan',
          landmark: 'Near Central Park',
          latitude: 40.7589,
          longitude: -73.9851
        },
        primary: {
          contactName: 'Soumodip Dey',
          address1: '123 Main Street',
          city: 'New York',
          state: 'NY',
          country: 'United States',
          pinCode: '10001',
          mobileNumber: '+1 (555) 123-4567',
          alternativeMobile: '+1 (555) 123-4568',
          area: 'Manhattan',
          landmark: 'Near Central Park',
          latitude: 40.7589,
          longitude: -73.9851
        },
        emergency: {
          contactName: 'Abir Dey',
          relation: 'Father',
          phoneNumber: '+1 (555) 987-6543',
          address: {
            contactName: 'Abir Dey',
            address1: '456 Oak Avenue',
            city: 'Boston',
            state: 'MA',
            country: 'United States',
            pinCode: '02101',
            mobileNumber: '+1 (555) 987-6543'
          }
        }
      },
      
      passport: {
        passportNumber: 'US123456789',
        expiryDate: '2030-05-12',
        issuingOffice: 'New York Passport Agency',
        issuingCountry: 'United States',
        contactNumber: '+1 (555) 123-4567',
        address: '123 Main Street, New York, NY 10001'
      },
      
      identityNumbers: {
        aadharNumber: 'N/A',
        panNumber: 'N/A',
        nsr: {
          itpin: 'N/A',
          tin: 'N/A'
        }
      },
      
      dependents: [
        {
          relation: 'father',
          name: 'abir Dey',
          nationality: 'Indian',
          dateOfBirth: '1965-03-15',
          occupation: 'Engineer',
          address: '456 Oak Avenue, Boston, MA 02101'
        },
        {
          relation: 'mother',
          name: 'Mary Dey',
          nationality: 'Indian',
          dateOfBirth: '1967-07-22',
          occupation: 'Teacher',
          address: '456 Oak Avenue, Boston, MA 02101'
        }
      ],
      
      education: [
        {
          branch: 'Computer Science',
          instituteName: 'MIT',
          passoutYear: '2012',
          qualification: 'Bachelor of Science',
          universityName: 'Massachusetts Institute of Technology',
          level: 'ug'
        },
        {
          branch: 'Information Technology',
          instituteName: 'Stanford University',
          passoutYear: '2014',
          qualification: 'Master of Science',
          universityName: 'Stanford University',
          level: 'pg'
        }
      ],
      
      experience: [
        {
          country: 'United States',
          organisationName: 'Google Inc.',
          fromDate: '2014-08-01',
          toDate: '2018-12-31',
          designation: 'Software Engineer',
          city: 'Mountain View',
          documentProof: 'google_experience.pdf'
        },
        {
          country: 'United States',
          organisationName: 'Microsoft Corporation',
          fromDate: '2019-01-01',
          toDate: '2021-12-31',
          designation: 'Senior Software Engineer',
          city: 'Seattle',
          documentProof: 'microsoft_experience.pdf'
        }
      ]
    },
    
    // Official Information
    officialInfo: {
      firstName: 'Soumodip',
      lastName: 'Dey',
      knownAs: 'Soumodip',
      dateOfJoining: '2022-01-15',
      jobConfirmation: true,
      role: 'CEO (Chief Executive Officer) ',
      designation: 'Senior CEO (Chief Executive Officer) ',
      stream: 'Information Technology',
      subStream: 'System Administration',
      baseLocation: 'New York Office',
      currentLocation: 'New York Office',
      unit: 'IT Infrastructure',
      unitHead: 'David Wilson',
      
      confirmationDetails: {
        status: 'Confirmed',
        confirmationDate: '2022-07-15',
        approval: 'Approved by HR Manager',
        rating: 4.5
      },
      
      documents: [
        {
          id: '1',
          employeeId: 'EMP001',
          name: 'Offer Letter',
          type: 'Offer Letter',
          uploadDate: '2022-01-15',
          size: '245 KB',
          url: '/documents/offer_letter.pdf',
          uploadedBy: 'hr'
        },
        {
          id: '2',
          employeeId: 'EMP001',
          name: 'Employment Contract',
          type: 'Contract',
          uploadDate: '2022-01-15',
          size: '1.2 MB',
          url: '/documents/employment_contract.pdf',
          uploadedBy: 'hr'
        }
      ]
    },
    
    // Financial Information
    financialInfo: {
      bankAccount: {
        bankName: 'Chase Bank',
        accountNumber: '1234567890',
        ifscCode: 'CHASUS33',
        modifiedDate: '2022-01-15',
        country: 'United States'
      },
      retiral: {
        pfTotal: 15000,
        employeePF: 12000,
        employerPF: 3000,
        employeeESI: 800,
        employerESI: 3200,
        professionalTax: 200,
        incomeTax: 5000,
        netTakeHome: 65000,
        costToCompany: 85000,
        basicSalary: 50000,
        houseRentAllowance: 15000,
        specialAllowance: 20000
      }
    },
    
    // Legacy fields for backward compatibility
    personalInfoLegacy: {
      dateOfBirth: '1990-05-12',
      address: '123 Main St, New York, NY 10001',
      emergencyContact: '+1 (555) 987-6543',
      bloodGroup: 'O+'
    },
    workInfo: {
      workLocation: 'New York Office',
      employmentType: 'full-time',
      salary: 75000,
      benefits: ['Health Insurance', 'Dental', '401k', 'Flexible PTO']
    },
    timeline: [
      {
        id: '1',
        date: '2024-01-15',
        type: 'review',
        title: 'Annual Performance Review',
        description: 'Exceeded expectations in system administration and security'
      },
      {
        id: '2',
        date: '2023-06-01',
        type: 'promotion',
        title: 'Promoted to Senior CEO (Chief Executive Officer) ',
        description: 'Recognition for outstanding performance and leadership'
      }
    ]
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Indrajit Das',
    email: 'indrajit.das@company.com',
    phone: '+1 (555) 234-5678',
    position: 'HR Manager',
    department: 'Human Resources',
    manager: 'Lisa Thompson',
    joinDate: '2021-03-10',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    
    // Personal Information
    personalInfo: {
      firstName: 'indrajit ',
      lastName: 'Das',
      gender: 'male',
      dateOfBirth: '1988-09-22',
      maritalStatus: 'married',
      nationality: 'Indian',
      primaryCitizenship: 'United States',
      phoneNumber: '+1 (555) 234-5678',
      email: 'indrajit .Das@company.com',
      
      addresses: {
        present: {
          contactName: 'Indrajit Das',
          address1: '456 Oak Avenue',
          city: 'San Francisco',
          state: 'CA',
          country: 'United States',
          pinCode: '94102',
          mobileNumber: '+1 (555) 234-5678',
          alternativeMobile: '+1 (555) 234-5679',
          area: 'Mission District',
          landmark: 'Near Dolores Park',
          latitude: 37.7749,
          longitude: -122.4194
        },
        primary: {
          contactName: 'Indrajit Das',
          address1: '456 Oak Avenue',
          city: 'San Francisco',
          state: 'CA',
          country: 'United States',
          pinCode: '94102',
          mobileNumber: '+1 (555) 234-5678',
          alternativeMobile: '+1 (555) 234-5679',
          area: 'Mission District',
          landmark: 'Near Dolores Park',
          latitude: 37.7749,
          longitude: -122.4194
        },
        emergency: {
          contactName: 'Jennifer Das',
          relation: 'Wife',
          phoneNumber: '+1 (555) 876-5432',
          address: {
            contactName: 'Jennifer Das',
            address1: '456 Oak Avenue',
            city: 'San Francisco',
            state: 'CA',
            country: 'United States',
            pinCode: '94102',
            mobileNumber: '+1 (555) 876-5432'
          }
        }
      },
      
      passport: {
        passportNumber: 'US987654321',
        expiryDate: '2029-09-22',
        issuingOffice: 'San Francisco Passport Agency',
        issuingCountry: 'United States',
        contactNumber: '+1 (555) 234-5678',
        address: '456 Oak Avenue, San Francisco, CA 94102'
      },
      
      identityNumbers: {
        aadharNumber: 'N/A',
        panNumber: 'N/A',
        nsr: {
          itpin: 'N/A',
          tin: 'N/A'
        }
      },
      
      dependents: [
        {
          relation: 'wife',
          name: 'Jennifer Das',
          nationality: 'Indian',
          dateOfBirth: '1990-04-15',
          occupation: 'Marketing Manager',
          address: '456 Oak Avenue, San Francisco, CA 94102'
        }
      ],
      
      education: [
        {
          branch: 'Human Resources',
          instituteName: 'UC Berkeley',
          passoutYear: '2010',
          qualification: 'Bachelor of Arts',
          universityName: 'University of California, Berkeley',
          level: 'ug'
        },
        {
          branch: 'Business Administration',
          instituteName: 'Stanford University',
          passoutYear: '2012',
          qualification: 'Master of Business Administration',
          universityName: 'Stanford University',
          level: 'pg'
        }
      ],
      
      experience: [
        {
          country: 'United States',
          organisationName: 'Salesforce',
          fromDate: '2012-08-01',
          toDate: '2018-12-31',
          designation: 'HR Specialist',
          city: 'San Francisco',
          documentProof: 'salesforce_experience.pdf'
        },
        {
          country: 'United States',
          organisationName: 'Uber Technologies',
          fromDate: '2019-01-01',
          toDate: '2021-02-28',
          designation: 'Senior HR Manager',
          city: 'San Francisco',
          documentProof: 'uber_experience.pdf'
        }
      ]
    },
    
    // Official Information
    officialInfo: {
      firstName: 'indrajit ',
      lastName: 'Das',
      knownAs: 'Mike',
      dateOfJoining: '2021-03-10',
      jobConfirmation: true,
      role: 'HR Manager',
      designation: 'Senior HR Manager',
      stream: 'Human Resources',
      subStream: 'Employee Relations',
      baseLocation: 'San Francisco Office',
      currentLocation: 'San Francisco Office',
      unit: 'HR Operations',
      unitHead: 'Lisa Thompson',
      
      confirmationDetails: {
        status: 'Confirmed',
        confirmationDate: '2021-09-10',
        approval: 'Approved by Director',
        rating: 4.8
      },
      
      documents: [
        {
          id: '3',
          employeeId: 'EMP002',
          name: 'Offer Letter',
          type: 'Offer Letter',
          uploadDate: '2021-03-10',
          size: '256 KB',
          url: '/documents/offer_letter_mike.pdf',
          uploadedBy: 'hr'
        }
      ]
    },
    
    // Financial Information
    financialInfo: {
      bankAccount: {
        bankName: 'Wells Fargo',
        accountNumber: '0987654321',
        ifscCode: 'WFBIUS6S',
        modifiedDate: '2021-03-10',
        country: 'United States'
      },
      retiral: {
        pfTotal: 25000,
        employeePF: 20000,
        employerPF: 5000,
        employeeESI: 1200,
        employerESI: 4800,
        professionalTax: 300,
        incomeTax: 8000,
        netTakeHome: 75000,
        costToCompany: 95000,
        basicSalary: 60000,
        houseRentAllowance: 20000,
        specialAllowance: 15000
      }
    },
    
    // Legacy fields for backward compatibility
    personalInfoLegacy: {
      dateOfBirth: '1988-09-22',
      address: '456 Oak Ave, San Francisco, CA 94102',
      emergencyContact: '+1 (555) 876-5432',
      bloodGroup: 'A+'
    },
    workInfo: {
      workLocation: 'San Francisco Office',
      employmentType: 'full-time',
      salary: 85000,
      benefits: ['Health Insurance', 'Dental', '401k', 'Stock Options']
    },
    timeline: [
      {
        id: '3',
        date: '2024-02-01',
        type: 'training',
        title: 'Leadership Development Program',
        description: 'Completed advanced management training'
      }
    ]
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@company.com',
    phone: '+1 (555) 345-6789',
    position: 'Payroll Administrator',
    department: 'Finance',
    manager: 'Robert Kim',
    joinDate: '2023-01-05',
    status: 'active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    
    // Personal Information
    personalInfo: {
      firstName: 'Emily',
      lastName: 'Rodriguez',
      gender: 'female',
      dateOfBirth: '1992-11-08',
      maritalStatus: 'single',
      nationality: 'Indian',
      primaryCitizenship: 'United States',
      phoneNumber: '+1 (555) 345-6789',
      email: 'emily.rodriguez@company.com',
      
      addresses: {
        present: {
          contactName: 'Emily Rodriguez',
          address1: '789 Pine Street',
          city: 'Austin',
          state: 'TX',
          country: 'United States',
          pinCode: '78701',
          mobileNumber: '+1 (555) 345-6789',
          alternativeMobile: '+1 (555) 345-6790',
          area: 'Downtown',
          landmark: 'Near State Capitol',
          latitude: 30.2672,
          longitude: -97.7431
        },
        primary: {
          contactName: 'Emily Rodriguez',
          address1: '789 Pine Street',
          city: 'Austin',
          state: 'TX',
          country: 'United States',
          pinCode: '78701',
          mobileNumber: '+1 (555) 345-6789',
          alternativeMobile: '+1 (555) 345-6790',
          area: 'Downtown',
          landmark: 'Near State Capitol',
          latitude: 30.2672,
          longitude: -97.7431
        },
        emergency: {
          contactName: 'Carlos Rodriguez',
          relation: 'Father',
          phoneNumber: '+1 (555) 765-4321',
          address: {
            contactName: 'Carlos Rodriguez',
            address1: '321 Elm Street',
            city: 'Houston',
            state: 'TX',
            country: 'United States',
            pinCode: '77001',
            mobileNumber: '+1 (555) 765-4321'
          }
        }
      },
      
      passport: {
        passportNumber: 'US456789123',
        expiryDate: '2032-11-08',
        issuingOffice: 'Houston Passport Agency',
        issuingCountry: 'United States',
        contactNumber: '+1 (555) 345-6789',
        address: '789 Pine Street, Austin, TX 78701'
      },
      
      identityNumbers: {
        aadharNumber: 'N/A',
        panNumber: 'N/A',
        nsr: {
          itpin: 'N/A',
          tin: 'N/A'
        }
      },
      
      dependents: [
        {
          relation: 'father',
          name: 'Carlos Rodriguez',
          nationality: 'Indian',
          dateOfBirth: '1968-12-03',
          occupation: 'Accountant',
          address: '321 Elm Street, Houston, TX 77001'
        }
      ],
      
      education: [
        {
          branch: 'Accounting',
          instituteName: 'University of Texas',
          passoutYear: '2014',
          qualification: 'Bachelor of Business Administration',
          universityName: 'University of Texas at Austin',
          level: 'ug'
        }
      ],
      
      experience: [
        {
          country: 'United States',
          organisationName: 'Deloitte',
          fromDate: '2014-08-01',
          toDate: '2022-12-31',
          designation: 'Staff Accountant',
          city: 'Austin',
          documentProof: 'deloitte_experience.pdf'
        }
      ]
    },
    
    // Official Information
    officialInfo: {
      firstName: 'Emily',
      lastName: 'Rodriguez',
      knownAs: 'Emily',
      dateOfJoining: '2023-01-05',
      jobConfirmation: true,
      role: 'Operations Manager',
      designation: 'Operations Manager',
      stream: 'Operations',
      subStream: 'Operations Management',
      baseLocation: 'Austin Office',
      currentLocation: 'Austin Office',
      unit: 'Operations',
      unitHead: 'Robert Kim',
      
      confirmationDetails: {
        status: 'Confirmed',
        confirmationDate: '2023-07-05',
        approval: 'Approved by Director',
        rating: 4.2
      },
      
      documents: [
        {
          id: '4',
          employeeId: 'EMP003',
          name: 'Offer Letter',
          type: 'Offer Letter',
          uploadDate: '2023-01-05',
          size: '234 KB',
          url: '/documents/offer_letter_emily.pdf',
          uploadedBy: 'hr'
        },
        {
          id: '5',
          employeeId: 'EMP003',
          name: 'Confirmation Letter',
          type: 'Confirmation Letter',
          uploadDate: '2023-07-05',
          size: '198 KB',
          url: '/documents/confirmation_letter_emily.pdf',
          uploadedBy: 'hr'
        }
      ]
    },
    
    // Financial Information
    financialInfo: {
      bankAccount: {
        bankName: 'Bank of America',
        accountNumber: '1122334455',
        ifscCode: 'BOFAUS3N',
        modifiedDate: '2023-01-05',
        country: 'United States'
      },
      retiral: {
        pfTotal: 8000,
        employeePF: 6400,
        employerPF: 1600,
        employeeESI: 500,
        employerESI: 2000,
        professionalTax: 150,
        incomeTax: 3000,
        netTakeHome: 55000,
        costToCompany: 70000,
        basicSalary: 40000,
        houseRentAllowance: 15000,
        specialAllowance: 15000
      }
    },
    
    // Legacy fields for backward compatibility
    personalInfoLegacy: {
      dateOfBirth: '1992-11-08',
      address: '789 Pine St, Austin, TX 78701',
      emergencyContact: '+1 (555) 765-4321',
      bloodGroup: 'B+'
    },
    workInfo: {
      workLocation: 'Austin Office',
      employmentType: 'full-time',
      salary: 65000,
      benefits: ['Health Insurance', 'Dental', '401k']
    },
    timeline: []
  },
  {
    id: '4',
    employeeId: 'EMP004',
    name: 'Abir Lal Banerjee',
    email: 'abir.banerjee@company.com',
    phone: '+1 (555) 456-7890',
    position: 'Software Engineer',
    department: 'Engineering',
    manager: 'Emily Rodriguez',
    joinDate: '2023-06-01',
    status: 'active',
    avatar: '/images/Abir3.png',
    
    // Personal Information
    personalInfo: {
      firstName: 'abir',
      lastName: 'Banerjee',
      gender: 'male',
      dateOfBirth: '1995-03-18',
      maritalStatus: 'single',
      nationality: 'Indian',
      primaryCitizenship: 'United States',
      phoneNumber: '+1 (555) 456-7890',
      email: 'abir.Banerjee@company.com',
      
      addresses: {
        present: {
          contactName: 'Abir Lal Banerjee',
          address1: '555 Tech Street',
          city: 'Seattle',
          state: 'WA',
          country: 'United States',
          pinCode: '98101',
          mobileNumber: '+1 (555) 456-7890',
          alternativeMobile: '+1 (555) 456-7891',
          area: 'Downtown',
          landmark: 'Near Space Needle',
          latitude: 47.6062,
          longitude: -122.3321
        },
        primary: {
          contactName: 'Abir Lal Banerjee',
          address1: '555 Tech Street',
          city: 'Seattle',
          state: 'WA',
          country: 'United States',
          pinCode: '98101',
          mobileNumber: '+1 (555) 456-7890',
          alternativeMobile: '+1 (555) 456-7891',
          area: 'Downtown',
          landmark: 'Near Space Needle',
          latitude: 47.6062,
          longitude: -122.3321
        },
        emergency: {
          contactName: 'Jane Banerjee',
          relation: 'Sister',
          phoneNumber: '+1 (555) 654-3210',
          address: {
            contactName: 'Jane Banerjee',
            address1: '777 Family Lane',
            city: 'Portland',
            state: 'OR',
            country: 'United States',
            pinCode: '97201',
            mobileNumber: '+1 (555) 654-3210'
          }
        }
      },
      
      passport: {
        passportNumber: 'US789123456',
        expiryDate: '2033-03-18',
        issuingOffice: 'Seattle Passport Agency',
        issuingCountry: 'United States',
        contactNumber: '+1 (555) 456-7890',
        address: '555 Tech Street, Seattle, WA 98101'
      },
      
      identityNumbers: {
        aadharNumber: 'N/A',
        panNumber: 'N/A',
        nsr: {
          itpin: 'N/A',
          tin: 'N/A'
        }
      },
      
      dependents: [
        {
          relation: 'other',
          name: 'Jane Banerjee',
          nationality: 'Indian',
          dateOfBirth: '1998-08-25',
          occupation: 'Graphic Designer',
          address: '777 Family Lane, Portland, OR 97201'
        }
      ],
      
      education: [
        {
          branch: 'Computer Science',
          instituteName: 'University of Washington',
          passoutYear: '2017',
          qualification: 'Bachelor of Science',
          universityName: 'University of Washington',
          level: 'ug'
        },
        {
          branch: 'Software Engineering',
          instituteName: 'Carnegie Mellon University',
          passoutYear: '2019',
          qualification: 'Master of Science',
          universityName: 'Carnegie Mellon University',
          level: 'pg'
        }
      ],
      
      experience: [
        {
          country: 'United States',
          organisationName: 'Amazon',
          fromDate: '2019-08-01',
          toDate: '2022-05-31',
          designation: 'Software Development Engineer',
          city: 'Seattle',
          documentProof: 'amazon_experience.pdf'
        },
        {
          country: 'United States',
          organisationName: 'Meta',
          fromDate: '2022-06-01',
          toDate: '2023-05-31',
          designation: 'Senior Software Engineer',
          city: 'Menlo Park',
          documentProof: 'meta_experience.pdf'
        }
      ]
    },
    
    // Official Information
    officialInfo: {
      firstName: 'abir',
      lastName: 'Banerjee',
      knownAs: 'abirny',
      dateOfJoining: '2023-06-01',
      jobConfirmation: false,
      role: 'Software Engineer',
      designation: 'Software Engineer',
      stream: 'Engineering',
      subStream: 'Software Development',
      baseLocation: 'Seattle Office',
      currentLocation: 'Seattle Office',
      unit: 'Engineering Team',
      unitHead: 'Emily Rodriguez',
      
      documents: [
        {
          id: '6',
          employeeId: 'EMP004',
          name: 'Offer Letter',
          type: 'Offer Letter',
          uploadDate: '2023-06-01',
          size: '267 KB',
          url: '/documents/offer_letter_abir.pdf',
          uploadedBy: 'hr'
        },
        {
          id: '7',
          employeeId: 'EMP004',
          name: 'Background Check',
          type: 'Background Check',
          uploadDate: '2023-05-25',
          size: '145 KB',
          url: '/documents/background_check_abir.pdf',
          uploadedBy: 'hr'
        }
      ]
    },
    
    // Financial Information
    financialInfo: {
      bankAccount: {
        bankName: 'Chase Bank',
        accountNumber: '9876543210',
        ifscCode: 'CHASUS33',
        modifiedDate: '2023-06-01',
        country: 'United States'
      },
      retiral: {
        pfTotal: 12000,
        employeePF: 9600,
        employerPF: 2400,
        employeeESI: 600,
        employerESI: 2400,
        professionalTax: 180,
        incomeTax: 4000,
        netTakeHome: 60000,
        costToCompany: 75000,
        basicSalary: 45000,
        houseRentAllowance: 15000,
        specialAllowance: 15000
      }
    },
    
    // Legacy fields for backward compatibility
    personalInfoLegacy: {
      dateOfBirth: '1995-03-18',
      address: '555 Tech St, Seattle, WA 98101',
      emergencyContact: '+1 (555) 654-3210',
      bloodGroup: 'AB+'
    },
    workInfo: {
      workLocation: 'Seattle Office',
      employmentType: 'full-time',
      salary: 70000,
      benefits: ['Health Insurance', 'Dental', '401k', 'Stock Options']
    },
    timeline: [
      {
        id: '4',
        date: '2023-06-01',
        type: 'joined',
        title: 'Joined Company',
        description: 'Started as Software Engineer in Engineering team'
      }
    ]
  }
];

// Extended attendance data for September 2024 - Optimized for calendar display
export const mockAttendanceExtended: AttendanceRecord[] = [
  // September 1-7 (Week 1) - Show mixed attendance patterns
  {
    id: 'sep-1',
    employeeId: 'EMP001',
    date: '2024-09-01',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'New York Office',
    notes: 'Great start to the week! Completed all planned tasks.'
  },
  {
    id: 'sep-1-emp2',
    employeeId: 'EMP002',
    date: '2024-09-01',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'geo',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-1-emp3',
    employeeId: 'EMP003',
    date: '2024-09-01',
    clockIn: '09:00',
    clockOut: '17:30',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'Chicago Office'
  },
  {
    id: 'sep-1-emp4',
    employeeId: 'EMP004',
    date: '2024-09-01',
    clockIn: '08:00',
    clockOut: '16:30',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 2 - Show late arrivals
  {
    id: 'sep-2',
    employeeId: 'EMP001',
    date: '2024-09-02',
    clockIn: '09:15',
    clockOut: '17:45',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'late',
    method: 'geo',
    location: 'New York Office',
    notes: 'Traffic delay on the way to office. Made up time by staying late.'
  },
  {
    id: 'sep-2-emp2',
    employeeId: 'EMP002',
    date: '2024-09-02',
    clockIn: '09:45',
    clockOut: '18:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'late',
    method: 'selfie',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-2-emp3',
    employeeId: 'EMP003',
    date: '2024-09-02',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'geo',
    location: 'Chicago Office'
  },
  {
    id: 'sep-2-emp4',
    employeeId: 'EMP004',
    date: '2024-09-02',
    clockIn: '08:15',
    clockOut: '16:45',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 3 - Show mixed patterns
  {
    id: 'sep-3',
    employeeId: 'EMP001',
    date: '2024-09-03',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'New York Office'
  },
  {
    id: 'sep-3-emp2',
    employeeId: 'EMP002',
    date: '2024-09-03',
    clockIn: '08:15',
    clockOut: '17:45',
    totalHours: 9.5,
    overtimeHours: 1.5,
    status: 'present',
    method: 'biometric',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-3-emp3',
    employeeId: 'EMP003',
    date: '2024-09-03',
    clockIn: '09:30',
    clockOut: '17:00',
    totalHours: 7.5,
    overtimeHours: 0,
    status: 'late',
    method: 'selfie',
    location: 'Chicago Office'
  },
  {
    id: 'sep-3-emp4',
    employeeId: 'EMP004',
    date: '2024-09-03',
    clockIn: '09:00',
    clockOut: '17:30',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'late',
    method: 'geo',
    location: 'Remote'
  },
  
  // September 4 - Show half-day and absent patterns
  {
    id: 'sep-4',
    employeeId: 'EMP001',
    date: '2024-09-04',
    clockIn: '09:00',
    clockOut: '17:30',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'New York Office'
  },
  {
    id: 'sep-4-emp2',
    employeeId: 'EMP002',
    date: '2024-09-04',
    clockIn: '--:--',
    clockOut: '--:--',
    totalHours: 0,
    overtimeHours: 0,
    status: 'absent',
    method: 'manual',
    location: 'Sick Leave'
  },
  {
    id: 'sep-4-emp3',
    employeeId: 'EMP003',
    date: '2024-09-04',
    clockIn: '08:45',
    clockOut: '13:00',
    totalHours: 4.25,
    overtimeHours: 0,
    status: 'half-day',
    method: 'biometric',
    location: 'Chicago Office'
  },
  {
    id: 'sep-4-emp4',
    employeeId: 'EMP004',
    date: '2024-09-04',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 5 - Show good attendance
  {
    id: 'sep-5',
    employeeId: 'EMP001',
    date: '2024-09-05',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'geo',
    location: 'New York Office'
  },
  {
    id: 'sep-5-emp2',
    employeeId: 'EMP002',
    date: '2024-09-05',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-5-emp3',
    employeeId: 'EMP003',
    date: '2024-09-05',
    clockIn: '08:15',
    clockOut: '17:45',
    totalHours: 9.5,
    overtimeHours: 1.5,
    status: 'present',
    method: 'biometric',
    location: 'Chicago Office'
  },
  {
    id: 'sep-5-emp4',
    employeeId: 'EMP004',
    date: '2024-09-05',
    clockIn: '--:--',
    clockOut: '--:--',
    totalHours: 0,
    overtimeHours: 0,
    status: 'absent',
    method: 'manual',
    location: 'Personal Leave'
  },
  
  // September 6-7 - Weekends (no data needed, will be auto-marked as absent)
  
  // September 8 - Weekend (no data needed)
  
  // September 9 - Show late pattern
  {
    id: 'sep-9',
    employeeId: 'EMP001',
    date: '2024-09-09',
    clockIn: '09:30',
    clockOut: '17:00',
    totalHours: 7.5,
    overtimeHours: 0,
    status: 'late',
    method: 'selfie',
    location: 'New York Office'
  },
  {
    id: 'sep-9-emp2',
    employeeId: 'EMP002',
    date: '2024-09-09',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-9-emp3',
    employeeId: 'EMP003',
    date: '2024-09-09',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'Chicago Office'
  },
  {
    id: 'sep-9-emp4',
    employeeId: 'EMP004',
    date: '2024-09-09',
    clockIn: '08:00',
    clockOut: '16:30',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 10 - Show good attendance
  {
    id: 'sep-10',
    employeeId: 'EMP001',
    date: '2024-09-10',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'New York Office'
  },
  {
    id: 'sep-10-emp2',
    employeeId: 'EMP002',
    date: '2024-09-10',
    clockIn: '08:15',
    clockOut: '17:45',
    totalHours: 9.5,
    overtimeHours: 1.5,
    status: 'present',
    method: 'biometric',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-10-emp3',
    employeeId: 'EMP003',
    date: '2024-09-10',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'geo',
    location: 'Chicago Office'
  },
  {
    id: 'sep-10-emp4',
    employeeId: 'EMP004',
    date: '2024-09-10',
    clockIn: '08:00',
    clockOut: '16:30',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 11 - Show mixed patterns
  {
    id: 'sep-11',
    employeeId: 'EMP001',
    date: '2024-09-11',
    clockIn: '09:00',
    clockOut: '17:30',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'New York Office'
  },
  {
    id: 'sep-11-emp2',
    employeeId: 'EMP002',
    date: '2024-09-11',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-11-emp3',
    employeeId: 'EMP003',
    date: '2024-09-11',
    clockIn: '09:15',
    clockOut: '17:45',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'late',
    method: 'geo',
    location: 'Chicago Office'
  },
  {
    id: 'sep-11-emp4',
    employeeId: 'EMP004',
    date: '2024-09-11',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 12 - Show half-day pattern
  {
    id: 'sep-12',
    employeeId: 'EMP001',
    date: '2024-09-12',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'New York Office'
  },
  {
    id: 'sep-12-emp2',
    employeeId: 'EMP002',
    date: '2024-09-12',
    clockIn: '08:00',
    clockOut: '16:30',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-12-emp3',
    employeeId: 'EMP003',
    date: '2024-09-12',
    clockIn: '09:00',
    clockOut: '13:00',
    totalHours: 4,
    overtimeHours: 0,
    status: 'half-day',
    method: 'geo',
    location: 'Chicago Office',
    notes: 'Doctor appointment in the afternoon. Will work from home if needed.'
  },
  {
    id: 'sep-12-emp4',
    employeeId: 'EMP004',
    date: '2024-09-12',
    clockIn: '08:15',
    clockOut: '16:45',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 13-14 - Weekends (no data needed)
  
  // September 15 - Weekend (no data needed)
  
  // September 16 - Show good attendance
  {
    id: 'sep-16',
    employeeId: 'EMP001',
    date: '2024-09-16',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'New York Office'
  },
  {
    id: 'sep-16-emp2',
    employeeId: 'EMP002',
    date: '2024-09-16',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'geo',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-16-emp3',
    employeeId: 'EMP003',
    date: '2024-09-16',
    clockIn: '08:15',
    clockOut: '17:45',
    totalHours: 9.5,
    overtimeHours: 1.5,
    status: 'present',
    method: 'biometric',
    location: 'Chicago Office'
  },
  {
    id: 'sep-16-emp4',
    employeeId: 'EMP004',
    date: '2024-09-16',
    clockIn: '08:00',
    clockOut: '16:30',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 17-21 - Show consistent patterns
  {
    id: 'sep-17',
    employeeId: 'EMP001',
    date: '2024-09-17',
    clockIn: '09:00',
    clockOut: '17:30',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'New York Office'
  },
  {
    id: 'sep-17-emp2',
    employeeId: 'EMP002',
    date: '2024-09-17',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-17-emp3',
    employeeId: 'EMP003',
    date: '2024-09-17',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'geo',
    location: 'Chicago Office'
  },
  {
    id: 'sep-17-emp4',
    employeeId: 'EMP004',
    date: '2024-09-17',
    clockIn: '08:15',
    clockOut: '16:45',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 18 - Show late pattern
  {
    id: 'sep-18',
    employeeId: 'EMP001',
    date: '2024-09-18',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'New York Office'
  },
  {
    id: 'sep-18-emp2',
    employeeId: 'EMP002',
    date: '2024-09-18',
    clockIn: '08:15',
    clockOut: '17:45',
    totalHours: 9.5,
    overtimeHours: 1.5,
    status: 'present',
    method: 'biometric',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-18-emp3',
    employeeId: 'EMP003',
    date: '2024-09-18',
    clockIn: '09:15',
    clockOut: '17:45',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'late',
    method: 'geo',
    location: 'Chicago Office'
  },
  {
    id: 'sep-18-emp4',
    employeeId: 'EMP004',
    date: '2024-09-18',
    clockIn: '08:00',
    clockOut: '16:30',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 19-21 - Continue patterns
  {
    id: 'sep-19',
    employeeId: 'EMP001',
    date: '2024-09-19',
    clockIn: '09:15',
    clockOut: '17:45',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'late',
    method: 'geo',
    location: 'New York Office'
  },
  {
    id: 'sep-19-emp2',
    employeeId: 'EMP002',
    date: '2024-09-19',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-19-emp3',
    employeeId: 'EMP003',
    date: '2024-09-19',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'geo',
    location: 'Chicago Office'
  },
  {
    id: 'sep-19-emp4',
    employeeId: 'EMP004',
    date: '2024-09-19',
    clockIn: '08:15',
    clockOut: '16:45',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 20-21 - Good attendance
  {
    id: 'sep-20',
    employeeId: 'EMP001',
    date: '2024-09-20',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'New York Office'
  },
  {
    id: 'sep-20-emp2',
    employeeId: 'EMP002',
    date: '2024-09-20',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'geo',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-20-emp3',
    employeeId: 'EMP003',
    date: '2024-09-20',
    clockIn: '08:15',
    clockOut: '17:45',
    totalHours: 9.5,
    overtimeHours: 1.5,
    status: 'present',
    method: 'biometric',
    location: 'Chicago Office'
  },
  {
    id: 'sep-20-emp4',
    employeeId: 'EMP004',
    date: '2024-09-20',
    clockIn: '08:00',
    clockOut: '16:30',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 21 - Weekend (no data needed)
  
  // September 22 - Weekend (no data needed)
  
  // September 23-27 - Show consistent good attendance
  {
    id: 'sep-23',
    employeeId: 'EMP001',
    date: '2024-09-23',
    clockIn: '09:00',
    clockOut: '17:30',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'New York Office'
  },
  {
    id: 'sep-23-emp2',
    employeeId: 'EMP002',
    date: '2024-09-23',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-23-emp3',
    employeeId: 'EMP003',
    date: '2024-09-23',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'geo',
    location: 'Chicago Office'
  },
  {
    id: 'sep-23-emp4',
    employeeId: 'EMP004',
    date: '2024-09-23',
    clockIn: '08:15',
    clockOut: '16:45',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 24-25 - Continue good patterns
  {
    id: 'sep-24',
    employeeId: 'EMP001',
    date: '2024-09-24',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'New York Office'
  },
  {
    id: 'sep-24-emp2',
    employeeId: 'EMP002',
    date: '2024-09-24',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'geo',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-24-emp3',
    employeeId: 'EMP003',
    date: '2024-09-24',
    clockIn: '08:15',
    clockOut: '17:45',
    totalHours: 9.5,
    overtimeHours: 1.5,
    status: 'present',
    method: 'biometric',
    location: 'Chicago Office'
  },
  {
    id: 'sep-24-emp4',
    employeeId: 'EMP004',
    date: '2024-09-24',
    clockIn: '08:00',
    clockOut: '16:30',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 25 - Show late pattern
  {
    id: 'sep-25',
    employeeId: 'EMP001',
    date: '2024-09-25',
    clockIn: '09:30',
    clockOut: '17:00',
    totalHours: 7.5,
    overtimeHours: 0,
    status: 'late',
    method: 'selfie',
    location: 'New York Office'
  },
  {
    id: 'sep-25-emp2',
    employeeId: 'EMP002',
    date: '2024-09-25',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-25-emp3',
    employeeId: 'EMP003',
    date: '2024-09-25',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'geo',
    location: 'Chicago Office'
  },
  {
    id: 'sep-25-emp4',
    employeeId: 'EMP004',
    date: '2024-09-25',
    clockIn: '08:15',
    clockOut: '16:45',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 26-27 - Good attendance
  {
    id: 'sep-26',
    employeeId: 'EMP001',
    date: '2024-09-26',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'New York Office'
  },
  {
    id: 'sep-26-emp2',
    employeeId: 'EMP002',
    date: '2024-09-26',
    clockIn: '08:15',
    clockOut: '17:45',
    totalHours: 9.5,
    overtimeHours: 1.5,
    status: 'present',
    method: 'biometric',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-26-emp3',
    employeeId: 'EMP003',
    date: '2024-09-26',
    clockIn: '08:00',
    clockOut: '16:30',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'geo',
    location: 'Chicago Office'
  },
  {
    id: 'sep-26-emp4',
    employeeId: 'EMP004',
    date: '2024-09-26',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 27 - Continue good pattern
  {
    id: 'sep-27',
    employeeId: 'EMP001',
    date: '2024-09-27',
    clockIn: '09:00',
    clockOut: '17:30',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'New York Office'
  },
  {
    id: 'sep-27-emp2',
    employeeId: 'EMP002',
    date: '2024-09-27',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-27-emp3',
    employeeId: 'EMP003',
    date: '2024-09-27',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'geo',
    location: 'Chicago Office'
  },
  {
    id: 'sep-27-emp4',
    employeeId: 'EMP004',
    date: '2024-09-27',
    clockIn: '08:15',
    clockOut: '16:45',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  },
  
  // September 28 - Weekend (no data needed)
  
  // September 29 - Weekend (no data needed)
  
  // September 30 - End of month, good attendance
  {
    id: 'sep-30',
    employeeId: 'EMP001',
    date: '2024-09-30',
    clockIn: '08:45',
    clockOut: '17:15',
    totalHours: 8.5,
    overtimeHours: 0.5,
    status: 'present',
    method: 'biometric',
    location: 'New York Office'
  },
  {
    id: 'sep-30-emp2',
    employeeId: 'EMP002',
    date: '2024-09-30',
    clockIn: '08:30',
    clockOut: '17:00',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'geo',
    location: 'San Francisco Office'
  },
  {
    id: 'sep-30-emp3',
    employeeId: 'EMP003',
    date: '2024-09-30',
    clockIn: '08:15',
    clockOut: '17:45',
    totalHours: 9.5,
    overtimeHours: 1.5,
    status: 'present',
    method: 'biometric',
    location: 'Chicago Office'
  },
  {
    id: 'sep-30-emp4',
    employeeId: 'EMP004',
    date: '2024-09-30',
    clockIn: '08:00',
    clockOut: '16:30',
    totalHours: 8.5,
    overtimeHours: 0,
    status: 'present',
    method: 'biometric',
    location: 'Remote'
  }
];

export const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'Soumodip Dey',
    type: 'vacation',
    startDate: '2024-02-15',
    endDate: '2024-02-19',
    days: 5,
    reason: 'Family vacation',
    status: 'approved',
    approver: 'David Wilson',
    appliedDate: '2024-01-20'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Indrajit Das',
    type: 'sick',
    startDate: '2024-01-18',
    endDate: '2024-01-18',
    days: 1,
    reason: 'Flu symptoms',
    status: 'pending',
    appliedDate: '2024-01-18'
  }
];

export const mockPayrollRuns: PayrollRun[] = [
  {
    id: '1',
    month: 'January',
    year: 2024,
    status: 'completed',
    totalEmployees: 150,
    totalAmount: 1250000,
    createdDate: '2024-01-31',
    processedBy: 'Emily Rodriguez'
  },
  {
    id: '2',
    month: 'December',
    year: 2023,
    status: 'paid',
    totalEmployees: 148,
    totalAmount: 1180000,
    createdDate: '2023-12-31',
    processedBy: 'Emily Rodriguez'
  }
];

export const mockExpenses: ExpenseClaim[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'Soumodip Dey',
    category: 'Travel',
    amount: 450.00,
    description: 'Client visit - flight and accommodation',
    date: '2024-01-10',
    status: 'approved',
    approver: 'David Wilson',
    receipts: ['receipt1.pdf', 'receipt2.pdf'],
    reportingManager: 'David Wilson',
    fromDate: '2024-01-08',
    toDate: '2024-01-10',
    location: 'New York',
    currency: 'USD',
    billNumber: 'BILL-001-2024',
    percentageOfOfficialUse: 100,
    vendor: 'Delta Airlines',
    comment: 'Business trip to meet client for project discussion'
  },
  {
    id: '2',
    employeeId: 'EMP002',
    employeeName: 'Indrajit Das',
    category: 'Meals',
    amount: 85.50,
    description: 'Team lunch meeting',
    date: '2024-01-12',
    status: 'pending',
    receipts: ['receipt3.pdf'],
    reportingManager: 'Emily Rodriguez',
    fromDate: '2024-01-12',
    toDate: '2024-01-12',
    location: 'Seattle',
    currency: 'USD',
    billNumber: 'BILL-002-2024',
    percentageOfOfficialUse: 80,
    vendor: 'Local Restaurant',
    comment: 'Team lunch to discuss project milestones'
  },
  {
    id: '3',
    employeeId: 'EMP003',
    employeeName: 'Emily Rodriguez',
    category: 'Office Supplies',
    amount: 125.75,
    description: 'Office stationery and supplies',
    date: '2024-01-15',
    status: 'approved',
    approver: 'Soumodip Dey',
    receipts: ['receipt4.pdf'],
    reportingManager: 'Soumodip Dey',
    fromDate: '2024-01-15',
    toDate: '2024-01-15',
    location: 'Seattle',
    currency: 'USD',
    billNumber: 'BILL-003-2024',
    percentageOfOfficialUse: 100,
    vendor: 'Office Depot',
    comment: 'Monthly office supplies for team'
  },
  {
    id: '4',
    employeeId: 'EMP001',
    employeeName: 'Soumodip Dey',
    category: 'Software',
    amount: 299.99,
    description: 'Development software license',
    date: '2024-01-18',
    status: 'pending',
    receipts: ['receipt5.pdf'],
    reportingManager: 'David Wilson',
    fromDate: '2024-01-18',
    toDate: '2024-01-18',
    location: 'Remote',
    currency: 'USD',
    billNumber: 'BILL-004-2024',
    percentageOfOfficialUse: 100,
    vendor: 'JetBrains',
    comment: 'Annual license for development tools'
  }
];

export const mockPerformanceReviews: PerformanceReview[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    employeeName: 'Soumodip Dey',
    reviewPeriod: 'Q4 2023',
    reviewType: 'quarterly',
    overallRating: 4.5,
    goals: [
      {
        id: '1',
        title: 'Improve System Security',
        description: 'Implement advanced security protocols',
        category: 'performance',
        targetDate: '2024-03-31',
        status: 'in-progress',
        progress: 75,
        weight: 40
      }
    ],
    feedback: [
      {
        id: '1',
        category: 'Technical Skills',
        rating: 5,
        comments: 'Exceptional technical expertise',
        reviewer: 'David Wilson',
        reviewerRole: 'Manager'
      }
    ],
    status: 'completed',
    reviewDate: '2024-01-15',
    reviewer: 'David Wilson'
  }
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'HRMS Platform',
    description: 'Complete HR management system development with modern UI/UX, advanced reporting, and integration capabilities',
    client: 'Internal',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    budget: 500000,
    billableHours: 1200,
    nonBillableHours: 300,
    teamMembers: ['1', '2', '3'],
    manager: 'Soumodip Dey',
    progress: 45,
    projectCode: 'HRMS-2024-001',
    phaseStatus: 'Production',
    allocationPercentage: 80,
    reportingManager: '1'
  },
  {
    id: '2',
    name: 'Customer Portal',
    description: 'Self-service customer portal development with real-time support and payment integration',
    client: 'Acme Corp',
    status: 'planning',
    startDate: '2024-03-01',
    endDate: '2024-08-31',
    budget: 300000,
    billableHours: 800,
    nonBillableHours: 150,
    teamMembers: ['2', '3', '4'],
    manager: 'Indrajit Das',
    progress: 10,
    projectCode: 'CUST-2024-002',
    phaseStatus: 'PreProd',
    allocationPercentage: 60,
    reportingManager: '2'
  },
  {
    id: '3',
    name: 'Mobile App Redesign',
    description: 'Complete redesign of mobile application with enhanced user experience and performance optimization',
    client: 'TechStart Inc',
    status: 'active',
    startDate: '2024-02-15',
    endDate: '2024-07-15',
    budget: 250000,
    billableHours: 600,
    nonBillableHours: 100,
    teamMembers: ['1', '4'],
    manager: 'Soumodip Dey',
    progress: 75,
    projectCode: 'MOB-2024-003',
    phaseStatus: 'Production',
    allocationPercentage: 90,
    reportingManager: '1'
  },
  {
    id: '4',
    name: 'E-commerce Platform',
    description: 'Full-stack e-commerce platform with inventory management, payment processing, and analytics dashboard',
    client: 'RetailMax',
    status: 'completed',
    startDate: '2023-10-01',
    endDate: '2024-01-31',
    budget: 400000,
    billableHours: 950,
    nonBillableHours: 200,
    teamMembers: ['2', '3'],
    manager: 'Indrajit Das',
    progress: 100,
    projectCode: 'ECOM-2023-004',
    phaseStatus: 'PostProd',
    allocationPercentage: 100,
    reportingManager: '2'
  },
  {
    id: '5',
    name: 'Data Analytics Dashboard',
    description: 'Advanced data visualization and analytics dashboard for business intelligence and reporting',
    client: 'DataCorp',
    status: 'on-hold',
    startDate: '2024-04-01',
    endDate: '2024-09-30',
    budget: 350000,
    billableHours: 750,
    nonBillableHours: 150,
    teamMembers: ['3', '4'],
    manager: 'Emily Rodriguez',
    progress: 25,
    projectCode: 'DATA-2024-005',
    phaseStatus: 'PreProd',
    allocationPercentage: 50,
    reportingManager: '3'
  }
];

export const mockTasks: Task[] = [
  {
    id: '1',
    projectId: '1',
    name: 'Database Design',
    description: 'Design the database schema for HRMS',
    assignee: 'Soumodip Dey',
    status: 'completed',
    priority: 'high',
    estimatedHours: 40,
    actualHours: 38,
    billable: true,
    startDate: '2024-01-01',
    dueDate: '2024-01-15'
  },
  {
    id: '2',
    projectId: '1',
    name: 'User Interface Development',
    description: 'Develop the main user interface components',
    assignee: 'Indrajit Das',
    status: 'in-progress',
    priority: 'medium',
    estimatedHours: 60,
    actualHours: 25,
    billable: true,
    startDate: '2024-01-10',
    dueDate: '2024-02-10'
  }
];