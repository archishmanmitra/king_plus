import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Edit, MapPin, Phone, Mail, Calendar, User, GraduationCap, Briefcase, Plus, Download, Globe, IdCard, CreditCard, Users, Trash2 } from 'lucide-react';

interface PersonalInformationProps {
  data: any;
  canEdit: boolean;
  isEditMode?: boolean;
}

const PersonalInformation: React.FC<PersonalInformationProps> = ({ data, canEdit, isEditMode = false }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [localData, setLocalData] = useState(data);
  
  // For personal information, all sub-tabs should have the same edit permission
  const canEditAllPersonalTabs = canEdit;

  // Update local data when props change
  useEffect(() => {
    setLocalData(data);
  }, [data]);

  // Add new dependent
  const addDependent = () => {
    const newDependent = {
      relation: 'other',
      name: '',
      nationality: '',
      dateOfBirth: '',
      occupation: '',
      relationEmployeeNumber: '',
      passport: '',
      address: ''
    };
    setLocalData(prev => ({
      ...prev,
      dependents: [...prev.dependents, newDependent]
    }));
  };

  // Remove dependent
  const removeDependent = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      dependents: prev.dependents.filter((_, i) => i !== index)
    }));
  };

  // Add new education
  const addEducation = () => {
    const newEducation = {
      branch: '',
      instituteName: '',
      passoutYear: '',
      qualification: '',
      universityName: '',
      level: 'ug'
    };
    setLocalData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  // Remove education
  const removeEducation = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  // Add new experience
  const addExperience = () => {
    const newExperience = {
      country: '',
      organisationName: '',
      fromDate: '',
      toDate: '',
      designation: '',
      city: '',
      documentProof: ''
    };
    setLocalData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  // Remove experience
  const removeExperience = (index: number) => {
    setLocalData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="address">Address</TabsTrigger>
          <TabsTrigger value="passport">Passport</TabsTrigger>
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="dependents">Dependents</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
                <CardDescription>Basic personal details and contact information</CardDescription>
              </div>

            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isEditMode ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        defaultValue={localData.firstName} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        defaultValue={localData.lastName} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select defaultValue={localData.gender} disabled={!canEditAllPersonalTabs}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input 
                        id="dateOfBirth" 
                        type="date" 
                        defaultValue={localData.dateOfBirth} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maritalStatus">Marital Status</Label>
                      <Select defaultValue={localData.maritalStatus} disabled={!canEditAllPersonalTabs}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input 
                        id="nationality" 
                        defaultValue={localData.nationality} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="primaryCitizenship">Primary Citizenship</Label>
                      <Input 
                        id="primaryCitizenship" 
                        defaultValue={localData.primaryCitizenship} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number</Label>
                      <Input 
                        id="phoneNumber" 
                        defaultValue={localData.phoneNumber} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        defaultValue={localData.email} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Name</label>
                      <p className="text-foreground">{localData.firstName} {localData.lastName}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Gender</label>
                      <p className="text-foreground capitalize">{localData.gender}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                      <p className="text-foreground flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(localData.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Marital Status</label>
                      <p className="text-foreground capitalize">{localData.maritalStatus}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Nationality</label>
                      <p className="text-foreground flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        {localData.nationality}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Primary Citizenship</label>
                      <p className="text-foreground">{localData.primaryCitizenship}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                      <p className="text-foreground flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {localData.phoneNumber}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-foreground flex items-center">
                        <Mail className="h-4 w-4 mr-2" />
                        {localData.email}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Address Tab */}
        <TabsContent value="address" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Address Information
                </CardTitle>
                <CardDescription>Present, primary, and emergency contact addresses</CardDescription>
              </div>

            </CardHeader>
            <CardContent className="space-y-6">
              {/* Present Address */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Present Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isEditMode ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="presentContactName">Contact Name</Label>
                        <Input 
                          id="presentContactName" 
                          defaultValue={localData.addresses.present.contactName} 
                          disabled={!canEditAllPersonalTabs}
                          className={!canEditAllPersonalTabs ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="presentAddress1">Address 1</Label>
                        <Input 
                          id="presentAddress1" 
                          defaultValue={data.addresses.present.address1} 
                          disabled={!canEditAllPersonalTabs}
                          className={!canEditAllPersonalTabs ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="presentCity">City</Label>
                        <Input 
                          id="presentCity" 
                          defaultValue={data.addresses.present.city} 
                          disabled={!canEditAllPersonalTabs}
                          className={!canEditAllPersonalTabs ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="presentState">State</Label>
                        <Input 
                          id="presentState" 
                          defaultValue={data.addresses.present.state} 
                          disabled={!canEditAllPersonalTabs}
                          className={!canEditAllPersonalTabs ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="presentCountry">Country</Label>
                        <Input 
                          id="presentCountry" 
                          defaultValue={data.addresses.present.country} 
                          disabled={!canEditAllPersonalTabs}
                          className={!canEditAllPersonalTabs ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="presentPinCode">Pin Code</Label>
                        <Input 
                          id="presentPinCode" 
                          defaultValue={data.addresses.present.pinCode} 
                          disabled={!canEditAllPersonalTabs}
                          className={!canEditAllPersonalTabs ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="presentMobileNumber">Mobile Number</Label>
                        <Input 
                          id="presentMobileNumber" 
                          defaultValue={data.addresses.present.mobileNumber} 
                          disabled={!canEditAllPersonalTabs}
                          className={!canEditAllPersonalTabs ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="presentAlternativeMobile">Alternative Mobile</Label>
                        <Input 
                          id="presentAlternativeMobile" 
                          defaultValue={data.addresses.present.alternativeMobile || ''} 
                          disabled={!canEditAllPersonalTabs}
                          className={!canEditAllPersonalTabs ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="presentArea">Area</Label>
                        <Input 
                          id="presentArea" 
                          defaultValue={data.addresses.present.area || ''} 
                          disabled={!canEditAllPersonalTabs}
                          className={!canEditAllPersonalTabs ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="presentLandmark">Landmark</Label>
                        <Input 
                          id="presentLandmark" 
                          defaultValue={data.addresses.present.landmark || ''} 
                          disabled={!canEditAllPersonalTabs}
                          className={!canEditAllPersonalTabs ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="presentLatitude">Latitude</Label>
                        <Input 
                          id="presentLatitude" 
                          type="number" 
                          step="any"
                          defaultValue={data.addresses.present.latitude || ''} 
                          disabled={!canEditAllPersonalTabs}
                          className={!canEditAllPersonalTabs ? "bg-muted" : ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="presentLongitude">Longitude</Label>
                        <Input 
                          id="presentLongitude" 
                          type="number" 
                          step="any"
                          defaultValue={data.addresses.present.longitude || ''} 
                          disabled={!canEditAllPersonalTabs}
                          className={!canEditAllPersonalTabs ? "bg-muted" : ""}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Contact Name</label>
                        <p className="text-foreground">{data.addresses.present.contactName}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Address 1</label>
                        <p className="text-foreground">{data.addresses.present.address1}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">City</label>
                        <p className="text-foreground">{data.addresses.present.city}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">State</label>
                        <p className="text-foreground">{data.addresses.present.state}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Country</label>
                        <p className="text-foreground">{data.addresses.present.country}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Pin Code</label>
                        <p className="text-foreground">{data.addresses.present.pinCode}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Mobile Number</label>
                        <p className="text-foreground flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {data.addresses.present.mobileNumber}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Alternative Mobile</label>
                        <p className="text-foreground">{data.addresses.present.alternativeMobile || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Area</label>
                        <p className="text-foreground">{data.addresses.present.area || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Landmark</label>
                        <p className="text-foreground">{data.addresses.present.landmark || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Latitude/Longitude</label>
                        <p className="text-foreground">
                          {data.addresses.present.latitude && data.addresses.present.longitude 
                            ? `${data.addresses.present.latitude}, ${data.addresses.present.longitude}`
                            : 'N/A'
                          }
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Primary Address */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Primary Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Contact Name</label>
                    <p className="text-foreground">{data.addresses.primary.contactName}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Address 1</label>
                    <p className="text-foreground">{data.addresses.primary.address1}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">City</label>
                    <p className="text-foreground">{data.addresses.primary.city}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">State</label>
                    <p className="text-foreground">{data.addresses.primary.state}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Country</label>
                    <p className="text-foreground">{data.addresses.primary.country}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Pin Code</label>
                    <p className="text-foreground">{data.addresses.primary.pinCode}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Mobile Number</label>
                    <p className="text-foreground flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {data.addresses.primary.mobileNumber}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Alternative Mobile</label>
                    <p className="text-foreground">{data.addresses.primary.alternativeMobile || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Area</label>
                    <p className="text-foreground">{data.addresses.primary.area || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Landmark</label>
                    <p className="text-foreground">{data.addresses.primary.landmark || 'N/A'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Latitude/Longitude</label>
                    <p className="text-foreground">
                      {data.addresses.primary.latitude && data.addresses.primary.longitude 
                        ? `${data.addresses.primary.latitude}, ${data.addresses.primary.longitude}`
                        : 'N/A'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Emergency Address */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Contact Name</label>
                    <p className="text-foreground">{data.addresses.emergency.contactName}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Relation</label>
                    <p className="text-foreground capitalize">{data.addresses.emergency.relation}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <p className="text-foreground flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {data.addresses.emergency.phoneNumber}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Address</label>
                    <p className="text-foreground">{data.addresses.emergency.address.address1}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">City</label>
                    <p className="text-foreground">{data.addresses.emergency.address.city}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">State</label>
                    <p className="text-foreground">{data.addresses.emergency.address.state}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Country</label>
                    <p className="text-foreground">{data.addresses.emergency.address.country}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Pin Code</label>
                    <p className="text-foreground">{data.addresses.emergency.address.pinCode}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Passport Tab */}
        <TabsContent value="passport" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <IdCard className="h-5 w-5 mr-2" />
                  Passport Information
                </CardTitle>
                <CardDescription>Passport details and documentation</CardDescription>
              </div>

            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isEditMode ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="passportNumber">Passport Number</Label>
                      <Input 
                        id="passportNumber" 
                        defaultValue={data.passport.passportNumber} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passportExpiryDate">Expiry Date</Label>
                      <Input 
                        id="passportExpiryDate" 
                        type="date" 
                        defaultValue={data.passport.expiryDate} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issuingOffice">Issuing Office</Label>
                      <Input 
                        id="issuingOffice" 
                        defaultValue={data.passport.issuingOffice} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="issuingCountry">Issuing Country</Label>
                      <Input 
                        id="issuingCountry" 
                        defaultValue={data.passport.issuingCountry} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passportContactNumber">Contact Number</Label>
                      <Input 
                        id="passportContactNumber" 
                        defaultValue={data.passport.contactNumber} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passportAddress">Address</Label>
                      <Textarea 
                        id="passportAddress" 
                        defaultValue={data.passport.address} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Passport Number</label>
                      <p className="text-foreground">{data.passport.passportNumber}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Expiry Date</label>
                      <p className="text-foreground flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(data.passport.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Issuing Office</label>
                      <p className="text-foreground">{data.passport.issuingOffice}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Issuing Country</label>
                      <p className="text-foreground">{data.passport.issuingCountry}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Contact Number</label>
                      <p className="text-foreground flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {data.passport.contactNumber}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="text-foreground">{data.passport.address}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Identity Numbers Tab */}
        <TabsContent value="identity" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Unique Identity Numbers
                </CardTitle>
                <CardDescription>Government issued identity documents and numbers</CardDescription>
              </div>

            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isEditMode ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="aadharNumber">Aadhar Number</Label>
                      <Input 
                        id="aadharNumber" 
                        defaultValue={data.identityNumbers.aadharNumber} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="panNumber">PAN Number</Label>
                      <Input 
                        id="panNumber" 
                        defaultValue={data.identityNumbers.panNumber} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itpin">NSR - ITPIN</Label>
                      <Input 
                        id="itpin" 
                        defaultValue={data.identityNumbers.nsr.itpin} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tin">NSR - TIN</Label>
                      <Input 
                        id="tin" 
                        defaultValue={data.identityNumbers.nsr.tin} 
                        disabled={!canEditAllPersonalTabs}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Aadhar Number</label>
                      <p className="text-foreground">{data.identityNumbers.aadharNumber}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">PAN Number</label>
                      <p className="text-foreground">{data.identityNumbers.panNumber}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">NSR - ITPIN</label>
                      <p className="text-foreground">{data.identityNumbers.nsr.itpin}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">NSR - TIN</label>
                      <p className="text-foreground">{data.identityNumbers.nsr.tin}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dependents Tab */}
        <TabsContent value="dependents" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Dependents
                </CardTitle>
                <CardDescription>Family members and dependents information</CardDescription>
              </div>
              {isEditMode && canEditAllPersonalTabs && (
                <Button variant="outline" size="sm" onClick={addDependent}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Dependent
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {localData.dependents.map((dependent: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold capitalize">{dependent.relation}</h4>
                    {isEditMode && canEditAllPersonalTabs && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeDependent(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isEditMode ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor={`dependent-relation-${index}`}>Relation</Label>
                          <Select defaultValue={dependent.relation} disabled={!canEditAllPersonalTabs}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="father">Father</SelectItem>
                              <SelectItem value="mother">Mother</SelectItem>
                              <SelectItem value="wife">Wife</SelectItem>
                              <SelectItem value="husband">Husband</SelectItem>
                              <SelectItem value="sister">Sister</SelectItem>
                              <SelectItem value="brother">Brother</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`dependent-name-${index}`}>Name</Label>
                          <Input 
                            id={`dependent-name-${index}`}
                            defaultValue={dependent.name} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`dependent-nationality-${index}`}>Nationality</Label>
                          <Input 
                            id={`dependent-nationality-${index}`}
                            defaultValue={dependent.nationality} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`dependent-dob-${index}`}>Date of Birth</Label>
                          <Input 
                            id={`dependent-dob-${index}`}
                            type="date" 
                            defaultValue={dependent.dateOfBirth} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`dependent-occupation-${index}`}>Occupation</Label>
                          <Input 
                            id={`dependent-occupation-${index}`}
                            defaultValue={dependent.occupation} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`dependent-emp-number-${index}`}>Relation Employee Number</Label>
                          <Input 
                            id={`dependent-emp-number-${index}`}
                            defaultValue={dependent.relationEmployeeNumber || ''} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`dependent-passport-${index}`}>Passport</Label>
                          <Input 
                            id={`dependent-passport-${index}`}
                            defaultValue={dependent.passport || ''} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`dependent-address-${index}`}>Address</Label>
                          <Textarea 
                            id={`dependent-address-${index}`}
                            defaultValue={dependent.address || ''} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Name</label>
                          <p className="text-foreground">{dependent.name}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Nationality</label>
                          <p className="text-foreground">{dependent.nationality}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                          <p className="text-foreground flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(dependent.dateOfBirth).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                          <p className="text-foreground">{dependent.occupation}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Relation Employee Number</label>
                          <p className="text-foreground">{dependent.relationEmployeeNumber || 'N/A'}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Passport</label>
                          <p className="text-foreground">{dependent.passport || 'N/A'}</p>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium text-muted-foreground">Address</label>
                          <p className="text-foreground">{dependent.address || 'N/A'}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <GraduationCap className="h-5 w-5 mr-2" />
                  Education
                </CardTitle>
                <CardDescription>Academic qualifications and educational background</CardDescription>
              </div>
              {isEditMode && canEditAllPersonalTabs && (
                <Button variant="outline" size="sm" onClick={addEducation}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {localData.education.map((edu: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="capitalize">{edu.level}</Badge>
                      <h4 className="font-semibold">{edu.qualification}</h4>
                    </div>
                    {isEditMode && canEditAllPersonalTabs && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isEditMode ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor={`edu-level-${index}`}>Level</Label>
                          <Select defaultValue={edu.level} disabled={!canEditAllPersonalTabs}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="secondary">Secondary</SelectItem>
                              <SelectItem value="higher">Higher Secondary</SelectItem>
                              <SelectItem value="ug">Undergraduate</SelectItem>
                              <SelectItem value="pg">Postgraduate</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edu-qualification-${index}`}>Qualification</Label>
                          <Input 
                            id={`edu-qualification-${index}`}
                            defaultValue={edu.qualification} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edu-branch-${index}`}>Branch</Label>
                          <Input 
                            id={`edu-branch-${index}`}
                            defaultValue={edu.branch} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edu-institute-${index}`}>Institute Name</Label>
                          <Input 
                            id={`edu-institute-${index}`}
                            defaultValue={edu.instituteName} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edu-passout-${index}`}>Passout Year</Label>
                          <Input 
                            id={`edu-passout-${index}`}
                            defaultValue={edu.passoutYear} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edu-university-${index}`}>University Name</Label>
                          <Input 
                            id={`edu-university-${index}`}
                            defaultValue={edu.universityName} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Branch</label>
                          <p className="text-foreground">{edu.branch}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Institute Name</label>
                          <p className="text-foreground">{edu.instituteName}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Passout Year</label>
                          <p className="text-foreground">{edu.passoutYear}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">University Name</label>
                          <p className="text-foreground">{edu.universityName}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Tab */}
        <TabsContent value="experience" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Experience
                </CardTitle>
                <CardDescription>Previous work experience and employment history</CardDescription>
              </div>
              {isEditMode && canEditAllPersonalTabs && (
                <Button variant="outline" size="sm" onClick={addExperience}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {localData.experience.map((exp: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold">{exp.designation}</h4>
                    <div className="flex space-x-2">
                      {exp.documentProof && (
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      {isEditMode && canEditAllPersonalTabs && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeExperience(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {isEditMode ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor={`exp-country-${index}`}>Country</Label>
                          <Input 
                            id={`exp-country-${index}`}
                            defaultValue={exp.country} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`exp-org-${index}`}>Organisation Name</Label>
                          <Input 
                            id={`exp-org-${index}`}
                            defaultValue={exp.organisationName} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`exp-from-${index}`}>From Date</Label>
                          <Input 
                            id={`exp-from-${index}`}
                            type="date" 
                            defaultValue={exp.fromDate} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`exp-to-${index}`}>To Date</Label>
                          <Input 
                            id={`exp-to-${index}`}
                            type="date" 
                            defaultValue={exp.toDate} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`exp-designation-${index}`}>Designation</Label>
                          <Input 
                            id={`exp-designation-${index}`}
                            defaultValue={exp.designation} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`exp-city-${index}`}>City</Label>
                          <Input 
                            id={`exp-city-${index}`}
                            defaultValue={exp.city} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`exp-doc-${index}`}>Document Proof</Label>
                          <Input 
                            id={`exp-doc-${index}`}
                            defaultValue={exp.documentProof || ''} 
                            disabled={!canEditAllPersonalTabs}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Country</label>
                          <p className="text-foreground">{exp.country}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Organisation Name</label>
                          <p className="text-foreground">{exp.organisationName}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">From Date</label>
                          <p className="text-foreground flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(exp.fromDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">To Date</label>
                          <p className="text-foreground flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(exp.toDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">Designation</label>
                          <p className="text-foreground">{exp.designation}</p>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">City</label>
                          <p className="text-foreground">{exp.city}</p>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-sm font-medium text-muted-foreground">Document Proof</label>
                          <p className="text-foreground">{exp.documentProof || 'No document uploaded'}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PersonalInformation;
