import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
// Removed mock data; page now supports empty/default profile when data is unavailable
import { Edit, Plus, MapPin, Phone, Mail, Calendar, User, Building, GraduationCap, Briefcase, CreditCard, PiggyBank, Shield, Crown, ArrowLeft } from 'lucide-react';
import PersonalInformation from '@/components/profile/PersonalInformation';
import OfficialInformation from '@/components/profile/OfficialInformation';
import FinancialInformation from '@/components/profile/FinancialInformation';
import { getEmployeeByEmployeeId } from '@/api/employees';

const MyProfile: React.FC = () => {
  const { user } = useAuth();
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Target employee id: either route param or current user's
  const targetEmployeeId = employeeId || user?.employeeId;

  // Empty/default profile shape to ensure subcomponents render without errors when data is absent
  const emptyProfile = {
    avatar: '',
    name: '',
    position: '',
    department: '',
    employeeId: targetEmployeeId || '',
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
          latitude: '',
          longitude: ''
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
          latitude: '',
          longitude: ''
        },
        emergency: {
          contactName: '',
          relation: '',
          phoneNumber: '',
          address: {
            address1: '',
            city: '',
            state: '',
            country: '',
            pinCode: ''
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
        nsr: { itpin: '', tin: '' }
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
        branchName: ''
      },
      retiral: {
        basicSalary: 0,
        houseRentAllowance: 0,
        specialAllowance: 0,
        employerPF: 0,
        employerESI: 0,
        employeePF: 0,
        employeeESI: 0,
        professionalTax: 0,
        incomeTax: 0,
        netTakeHome: 0,
        costToCompany: 0,
        pfTotal: 0
      }
    }
  };

  // Fetch real data; fall back to emptyProfile while ensuring name from basic user schema
  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const id = targetEmployeeId || '';
        const json = await getEmployeeByEmployeeId(id);
        const serverProfile = json?.employee || {};
        const merged = { ...emptyProfile, ...serverProfile };
        // Ensure name from authenticated user if empty
        if (!merged.name && user?.name) merged.name = user.name;
        if (isMounted) setProfile(merged);
      } catch (e) {
        const fallback = { ...emptyProfile };
        if (!fallback.name && user?.name) fallback.name = user.name;
        if (isMounted) setProfile(fallback);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    if (targetEmployeeId) fetchProfile();
    return () => { isMounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetEmployeeId]);
  
  // Check if viewing own profile or someone else's
  const isOwnProfile = !employeeId || employeeId === user?.employeeId;
  
  // Permission logic based on user role and profile ownership
  // All users (except HR/Admin) can edit their own personal info + bank account
  // Permission logic:
  // - All users (except HR/Admin): Can edit their own Personal Information and Bank Account
  // - HR/Admin: Can edit their own everything, and others' Official Information and Retiral
  const canEditPersonal = isOwnProfile;
  const canEditOfficial = (isOwnProfile && (user?.role === 'hr_manager' || user?.role === 'global_admin')) || (!isOwnProfile && (user?.role === 'hr_manager' || user?.role === 'global_admin'));
  const canEditBankDetails = isOwnProfile;
  const canEditRetiral = (isOwnProfile && (user?.role === 'hr_manager' || user?.role === 'global_admin')) || (!isOwnProfile && (user?.role === 'hr_manager' || user?.role === 'global_admin'));

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'global_admin':
        return <Badge variant="destructive" className="flex items-center"><Crown className="h-3 w-3 mr-1" />Global Admin</Badge>;
      case 'hr_manager':
        return <Badge variant="default" className="flex items-center"><Shield className="h-3 w-3 mr-1" />HR Manager</Badge>;
      case 'employee':
        return <Badge variant="secondary" className="flex items-center"><User className="h-3 w-3 mr-1" />Employee</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button for viewing other employees */}
      {!isOwnProfile && (
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/employees')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Employees
          </Button>
        </div>
      )}

      {/* Profile Header */}
      <Card className="shadow-md">
        <CardHeader className="text-center">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar || ''} alt={profile?.name || ''} />
              <AvatarFallback className="text-2xl">{((profile?.name || user?.name || '')).split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{profile?.name || user?.name || ''}</h1>
              <p className="text-xl text-muted-foreground">{profile?.position || ''}</p>
              <p className="text-muted-foreground">{profile?.department || ''} • {profile?.employeeId || targetEmployeeId}</p>
              <div className="mt-2">
                {getRoleBadge(user?.role || 'employee')}
                {!isOwnProfile && (
                  <Badge variant="outline" className="ml-2">Viewing Profile</Badge>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Edit Employee Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <Tabs defaultValue="personal" className="space-y-6">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="personal">Personal</TabsTrigger>
                        <TabsTrigger value="official">Official</TabsTrigger>
                        <TabsTrigger value="financial">Financial</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="personal" className="space-y-4">
                        <PersonalInformation 
                          data={profile?.personalInfo || emptyProfile.personalInfo} 
                          canEdit={canEditPersonal}
                          isEditMode={true}
                        />
                      </TabsContent>
                      
                      <TabsContent value="official" className="space-y-4">
                        <OfficialInformation 
                          data={profile?.officialInfo || emptyProfile.officialInfo} 
                          canEdit={canEditOfficial}
                          isEditMode={true}
                        />
                      </TabsContent>
                      
                      <TabsContent value="financial" className="space-y-4">
                        <FinancialInformation 
                          data={profile?.financialInfo || emptyProfile.financialInfo} 
                          canEditBank={canEditBankDetails}
                          canEditRetiral={canEditRetiral}
                          isEditMode={true}
                        />
                      </TabsContent>
                    </Tabs>
                    
                    <div className="flex justify-end space-x-2 pt-4 border-t">
                      <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => {
                        // TODO: Implement save functionality
                        setIsEditModalOpen(false);
                      }}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Personal
          </TabsTrigger>
          <TabsTrigger value="official" className="flex items-center">
            <Building className="h-4 w-4 mr-2" />
            Official
          </TabsTrigger>
          <TabsTrigger value="financial" className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            Financial
          </TabsTrigger>
        </TabsList>

        {/* Personal Tab - Personal Information */}
        <TabsContent value="personal" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
            <p className="text-muted-foreground">
              Personal details, addresses, documents, education, and experience information.
              {canEditPersonal ? ' You can edit this information.' : ' You cannot edit this information.'}
            </p>
          </div>
          <PersonalInformation 
            data={profile?.personalInfo || emptyProfile.personalInfo} 
            canEdit={canEditPersonal}
          />
        </TabsContent>

        {/* Official Tab */}
        <TabsContent value="official" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Official Information</h2>
            <p className="text-muted-foreground">
              Employment details, confirmation status, and official documents.
              {canEditOfficial ? ' You can edit this information.' : ' You cannot edit this information.'}
            </p>
          </div>
          <OfficialInformation 
            data={profile?.officialInfo || emptyProfile.officialInfo} 
            canEdit={canEditOfficial}
          />
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Financial Information</h2>
            <p className="text-muted-foreground">
              Bank details and salary breakdown. 
              {canEditBankDetails ? ' You can edit bank details.' : ' You cannot edit bank details.'} 
              {canEditRetiral ? ' You can edit retiral information.' : ' You cannot edit retiral information.'}
            </p>
          </div>
          <FinancialInformation 
            data={profile?.financialInfo || emptyProfile.financialInfo} 
            canEditBank={canEditBankDetails}
            canEditRetiral={canEditRetiral}
          />
        </TabsContent>
      </Tabs>


    </div>
  );
};

export default MyProfile;
