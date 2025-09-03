import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Save, UserPlus } from 'lucide-react';
import PersonalInformation from '@/components/profile/PersonalInformation';
import OfficialInformation from '@/components/profile/OfficialInformation';
import FinancialInformation from '@/components/profile/FinancialInformation';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: any) => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSave }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('official');

  // Empty employee data structure for new employee
  const emptyEmployeeData = {
    personalInfo: {
      firstName: '',
      lastName: '',
      gender: '',
      dateOfBirth: '',
      maritalStatus: '',
      nationality: '',
      primaryCitizenship: '',
      phoneNumber: '',
      email: '',
      addresses: {
        present: {
          contactName: '',
          address1: '',
          city: '',
          state: '',
          country: '',
          pinCode: '',
          mobileNumber: '',
          alternativeMobile: '',
          area: '',
          landmark: '',
          latitude: 0,
          longitude: 0
        },
        primary: {
          contactName: '',
          address1: '',
          city: '',
          state: '',
          country: '',
          pinCode: '',
          mobileNumber: '',
          alternativeMobile: '',
          area: '',
          landmark: '',
          latitude: 0,
          longitude: 0
        },
        emergency: {
          contactName: '',
          relation: '',
          phoneNumber: '',
          address: {
            contactName: '',
            address1: '',
            city: '',
            state: '',
            country: '',
            pinCode: '',
            mobileNumber: ''
          }
        }
      },
      passport: {
        passportNumber: '',
        expiryDate: '',
        issuingOffice: '',
        issuingCountry: '',
        contactNumber: '',
        address: ''
      },
      identityNumbers: {
        aadharNumber: '',
        panNumber: '',
        nsr: {
          itpin: '',
          tin: ''
        }
      },
      dependents: [],
      education: [],
      experience: []
    },
    officialInfo: {
      firstName: '',
      lastName: '',
      knownAs: '',
      dateOfJoining: '',
      jobConfirmation: false,
      role: '',
      designation: '',
      stream: '',
      subStream: '',
      baseLocation: '',
      currentLocation: '',
      unit: '',
      unitHead: '',
      confirmationDetails: {
        status: '',
        confirmationDate: '',
        approval: '',
        rating: 0
      },
      documents: []
    },
    financialInfo: {
      bankAccount: {
        bankName: '',
        accountNumber: '',
        ifscCode: '',
        modifiedDate: '',
        country: ''
      },
      retiral: {
        pfTotal: 0,
        employeePF: 0,
        employerPF: 0,
        employeeESI: 0,
        employerESI: 0,
        professionalTax: 0,
        incomeTax: 0,
        netTakeHome: 0,
        costToCompany: 0,
        basicSalary: 0,
        houseRentAllowance: 0,
        specialAllowance: 0
      }
    }
  };

  const [employeeData, setEmployeeData] = useState(emptyEmployeeData);

  const handleSave = () => {
    // Basic validation for required fields
    if (!employeeData.officialInfo.firstName || !employeeData.officialInfo.lastName || 
        !employeeData.officialInfo.designation || !employeeData.officialInfo.dateOfJoining) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required official information fields.",
        variant: "destructive"
      });
      return;
    }

    // Generate employee ID (in real app, this would be done by backend)
    const newEmployeeId = `EMP${String(Date.now()).slice(-3)}`;
    
    const newEmployee = {
      id: String(Date.now()),
      employeeId: newEmployeeId,
      name: `${employeeData.officialInfo.firstName} ${employeeData.officialInfo.lastName}`,
      email: employeeData.personalInfo.email || `${employeeData.officialInfo.firstName.toLowerCase()}.${employeeData.officialInfo.lastName.toLowerCase()}@company.com`,
      phone: employeeData.personalInfo.phoneNumber || '',
      position: employeeData.officialInfo.designation,
      department: employeeData.officialInfo.stream || 'Not Assigned',
      manager: employeeData.officialInfo.unitHead || 'Not Assigned',
      joinDate: employeeData.officialInfo.dateOfJoining,
      status: 'active',
      avatar: '',
      personalInfo: employeeData.personalInfo,
      officialInfo: employeeData.officialInfo,
      financialInfo: employeeData.financialInfo,
      // Legacy fields for compatibility
      personalInfoLegacy: {
        dateOfBirth: employeeData.personalInfo.dateOfBirth,
        address: employeeData.personalInfo.addresses.present.address1,
        emergencyContact: employeeData.personalInfo.addresses.emergency.phoneNumber,
        bloodGroup: 'Not Specified'
      },
      workInfo: {
        workLocation: employeeData.officialInfo.currentLocation,
        employmentType: 'full-time',
        salary: employeeData.financialInfo.retiral.basicSalary,
        benefits: []
      },
      timeline: [
        {
          id: '1',
          date: employeeData.officialInfo.dateOfJoining,
          type: 'joined',
          title: 'Joined Company',
          description: `Started as ${employeeData.officialInfo.designation}`
        }
      ]
    };

    onSave(newEmployee);
    
    toast({
      title: "Success",
      description: "Employee added successfully!",
    });
    
    // Reset form
    setEmployeeData(emptyEmployeeData);
    setActiveTab('official');
    onClose();
  };

  const handleCancel = () => {
    setEmployeeData(emptyEmployeeData);
    setActiveTab('official');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2" />
            Add New Employee
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal" disabled>
                Personal (Read-only)
              </TabsTrigger>
              <TabsTrigger value="official">
                Official
              </TabsTrigger>
              <TabsTrigger value="financial">
                Financial
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4">
              <div className="p-6 border-2 border-dashed border-muted rounded-lg text-center">
                <div className="text-muted-foreground">
                  <UserPlus className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Personal Information</h3>
                  <p className="text-sm">
                    Personal information will be empty for new employees.
                    <br />
                    Employees can fill this information themselves after account creation.
                  </p>
                  <p className="text-sm mt-2 text-amber-600">
                    <strong>Note:</strong> Admin/HR can only edit Official and Financial information.
                  </p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="official" className="space-y-4">
              <OfficialInformation 
                data={employeeData.officialInfo} 
                canEdit={true}
                isEditMode={true}
              />
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-4">
              <FinancialInformation 
                data={employeeData.financialInfo} 
                canEdit={true}
                isEditMode={true}
                showBankAccount={false}
                showRetiralOnly={true}
              />
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;
