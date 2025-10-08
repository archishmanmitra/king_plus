import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, UserPlus } from "lucide-react";
import PersonalInformation from "@/components/profile/PersonalInformation";
import OfficialInformation from "@/components/profile/OfficialInformation";
import FinancialInformation from "@/components/profile/FinancialInformation";
import { useAuth } from "@/contexts/AuthContext";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: any) => void;
}

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("user");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  // Empty employee data structure for new employee
  const emptyEmployeeData = {
    userDetails: {
      username: "",
      email: "",
      role: "employee",
    },
    personalInfo: {
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      maritalStatus: "",
      nationality: "",
      primaryCitizenship: "",
      phoneNumber: "",
      email: "",
      addresses: {
        present: {
          contactName: "",
          address1: "",
          city: "",
          state: "",
          country: "",
          pinCode: "",
          mobileNumber: "",
          alternativeMobile: "",
          area: "",
          landmark: "",
          latitude: 0,
          longitude: 0,
        },
        primary: {
          contactName: "",
          address1: "",
          city: "",
          state: "",
          country: "",
          pinCode: "",
          mobileNumber: "",
          alternativeMobile: "",
          area: "",
          landmark: "",
          latitude: 0,
          longitude: 0,
        },
        emergency: {
          contactName: "",
          relation: "",
          phoneNumber: "",
          address: {
            contactName: "",
            address1: "",
            city: "",
            state: "",
            country: "",
            pinCode: "",
            mobileNumber: "",
          },
        },
      },
      passport: {
        passportNumber: "",
        expiryDate: "",
        issuingOffice: "",
        issuingCountry: "",
        contactNumber: "",
        address: "",
      },
      identityNumbers: {
        aadharNumber: "",
        panNumber: "",
        nsr: {
          itpin: "",
          tin: "",
        },
      },
      dependents: [],
      education: [],
      experience: [],
    },
    officialInfo: {
      firstName: "",
      lastName: "",
      knownAs: "",
      dateOfJoining: "",
      jobConfirmation: false,
      role: "",
      designation: "",
      stream: "",
      subStream: "",
      baseLocation: "",
      currentLocation: "",
      unit: "",
      unitHead: "",
      confirmationDetails: {
        status: "",
        confirmationDate: "",
        approval: "",
        rating: 0,
      },
      documents: [],
    },
    financialInfo: {
      bankAccount: {
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        modifiedDate: "",
        country: "",
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
        specialAllowance: 0,
      },
    },
  };

  const [employeeData, setEmployeeData] = useState(emptyEmployeeData);

  const handleSave = async () => {
    // Basic validation for required fields (user-only invitation)
    if (!employeeData.userDetails.email || !employeeData.userDetails.role) {
      toast({
        title: "Validation Error",
        description: "Please fill email and role.",
        variant: "destructive",
      });
      return;
    }

    if (!user?.id) {
      toast({
        title: "Not authenticated",
        description: "Please login first",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      // Create invitation only (no employee record here). The legacy full employee creation remains available elsewhere.
      const response = await fetch(`${API_URL}/invitations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: employeeData.userDetails.email,
          role: employeeData.userDetails.role,
          createdByUserId: user.id,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || "Failed to create employee");
      }

      const { invitation } = await response.json();

      // Don't call onSave immediately - wait until admin copies the link
      // onSave({ ...employee, invitation });
      const url = `${window.location.origin}/invite?token=${invitation.token}`;
      setInviteUrl(url);
      setShowInvite(true);
      toast({
        title: "Invitation Created",
        description:
          "Share the generated invitation link with the user to register.",
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: e?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // If we have an invite URL, save the employee data before closing
    if (inviteUrl && showInvite) {
      // Get the employee data from the current state
      const newEmployee = {
        id: `EMP${Date.now()}`, // Generate a temporary ID
        employeeId: `EMP${Date.now()}`,
        name:
          `${employeeData.officialInfo.firstName} ${employeeData.officialInfo.lastName}`.trim() ||
          "New Employee",
        email: employeeData.userDetails.email,
        phone: employeeData.personalInfo.phoneNumber || "N/A",
        position: employeeData.officialInfo.designation || "Employee",
        department: employeeData.officialInfo.stream || "General",
        manager: employeeData.officialInfo.unitHead || "N/A",
        joinDate:
          employeeData.officialInfo.dateOfJoining ||
          new Date().toISOString().split("T")[0],
        status: "active",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      };
      onSave(newEmployee);
    }

    setEmployeeData(emptyEmployeeData);
    setActiveTab("user");
    setInviteUrl(null);
    setShowInvite(false);
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
          <DialogDescription>
            Create a new employee account and send an invitation to complete
            their profile setup.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="user">
                User Details
              </TabsTrigger>
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
            
            <TabsContent value="user" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={employeeData.userDetails.email}
                    onChange={(e) => setEmployeeData(prev => ({
                      ...prev,
                      userDetails: { ...prev.userDetails, email: e.target.value }
                    }))}
                    placeholder="employee@company.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-role">Role</Label>
                  <Select
                    value={employeeData.userDetails.role}
                    onValueChange={(val) => setEmployeeData(prev => ({
                      ...prev,
                      userDetails: { ...prev.userDetails, role: val }
                    }))}
                  >
                    <SelectTrigger id="user-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="hr_manager">HR Manager</SelectItem>
                      <SelectItem value="global_admin">Global Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">The invitation link will be sent to this email and will expire in 24 hours.</p>
            </TabsContent>
            
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
                onChange={(field, value) => {
                  setEmployeeData(prev => ({
                    ...prev,
                    officialInfo: {
                      ...prev.officialInfo,
                      [field]: value
                    }
                  }));
                }}
              />
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-4">
              <FinancialInformation 
                data={employeeData.financialInfo} 
                canEdit={true}
                isEditMode={true}
                showBankAccount={false}
                showRetiralOnly={true}
                onChange={(field, value) => {
                  setEmployeeData(prev => ({
                    ...prev,
                    financialInfo: {
                      ...prev.financialInfo,
                      retiral: {
                        ...prev.financialInfo.retiral,
                        [field]: value
                      }
                    }
                  }));
                }}
              />
            </TabsContent>
          </Tabs> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Name</Label>
              <Input
                id="username"
                type="text"
                value={employeeData.userDetails.username}
                onChange={(e) =>
                  setEmployeeData((prev) => ({
                    ...prev,
                    userDetails: {
                      ...prev.userDetails,
                      username: e.target.value,
                    },
                  }))
                }
                placeholder="Walter White"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-email">Email</Label>
              <Input
                id="user-email"
                type="email"
                value={employeeData.userDetails.email}
                onChange={(e) =>
                  setEmployeeData((prev) => ({
                    ...prev,
                    userDetails: { ...prev.userDetails, email: e.target.value },
                  }))
                }
                placeholder="employee@company.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-role">Role</Label>
              <Select
                value={employeeData.userDetails.role}
                onValueChange={(val) =>
                  setEmployeeData((prev) => ({
                    ...prev,
                    userDetails: { ...prev.userDetails, role: val },
                  }))
                }
              >
                <SelectTrigger id="user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="hr_manager">HR Manager</SelectItem>
                  <SelectItem value="global_admin">Global Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            The invitation link will be sent to this email and will expire in 24
            hours.
          </p>
          {showInvite && inviteUrl && (
            <div className="space-y-4 p-6 border-2 border-green-200 rounded-lg bg-green-50">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <Label className="text-green-800 font-semibold">
                  Employee Created Successfully!
                </Label>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-green-700">
                  Invitation URL (expires in 24 hours from now)
                </Label>
                <div className="flex items-center space-x-2">
                  <Input
                    readOnly
                    value={inviteUrl}
                    className="flex-1 font-mono text-sm bg-white border-green-300"
                  />
                  <Button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(inviteUrl);
                        toast({
                          title: "Copied!",
                          description:
                            "Invitation URL copied to clipboard. Share this link with the employee.",
                        });
                      } catch (e) {
                        toast({
                          title: "Copy failed",
                          description: "Please copy the link manually.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Copy Link
                  </Button>
                </div>
                <p className="text-xs text-green-600">
                  <strong>Important:</strong> Share this link with the employee.
                  They must use it within 24 hours to complete their account
                  setup.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              {showInvite ? "Done & Add to List" : "Cancel"}
            </Button>
            {!showInvite && (
              <Button onClick={handleSave} disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Adding..." : "Add Employee"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;
