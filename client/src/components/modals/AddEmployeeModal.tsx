import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, UserPlus } from 'lucide-react';
import OfficialInformation from '@/components/profile/OfficialInformation';
import { useAuth } from '@/contexts/AuthContext';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: any) => void;
}

type NewEmployeeData = {
  userDetails: {
    email: string;
    role: 'employee' | 'manager' | 'hr_manager' | 'global_admin';
  };
  officialInfo: {
    firstName: string;
    lastName: string;
  };
};

const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose, onSave }) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('user');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  // Empty employee data structure for new employee
  const emptyEmployeeData: NewEmployeeData = {
    userDetails: { email: '', role: 'employee' },
    officialInfo: { firstName: '', lastName: '' }
  };

  const [employeeData, setEmployeeData] = useState<NewEmployeeData>(emptyEmployeeData);

  const handleSave = async () => {
    // Basic validation for required fields (minimal)
    if (!employeeData.userDetails.email || !employeeData.userDetails.role ||
        !employeeData.officialInfo.firstName || !employeeData.officialInfo.lastName) {
      toast({
        title: "Validation Error",
        description: "Please fill first name, last name, email and role.",
        variant: "destructive"
      });
      return;
    }

    if (!user?.id) {
      toast({ title: 'Not authenticated', description: 'Please login first', variant: 'destructive' });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userDetails: employeeData.userDetails,
          officialInfo: employeeData.officialInfo,
          createdByUserId: user.id
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to create employee');
      }

      const { employee, invitation } = await response.json();

      onSave({ ...employee, invitation });
      const url = `${window.location.origin}/invite?token=${invitation.token}`;
      setInviteUrl(url);
      setShowInvite(true);
      toast({ title: 'Success', description: 'Employee added and invitation created.' });
    } catch (e: any) {
      toast({ title: 'Error', description: e?.message || 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEmployeeData(emptyEmployeeData);
    setActiveTab('user');
    setInviteUrl(null);
    setShowInvite(false);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleCancel();
        }
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card border border-border/60 shadow-xl rounded-2xl supports-[backdrop-filter]:backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg md:text-xl font-semibold text-foreground">
            <UserPlus className="h-5 w-5 mr-2" />
            Add New Employee
          </DialogTitle>
          <DialogDescription>
            Enter first name, last name, email, and role to generate an invite link.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-muted/40 rounded-xl p-1">
              <TabsTrigger value="user" className="rounded-lg text-sm data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground">
                User Details
              </TabsTrigger>
              <TabsTrigger value="official" className="rounded-lg text-sm data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground">
                Official
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="user" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input
                    id="first-name"
                    value={employeeData.officialInfo.firstName}
                    onChange={(e) => setEmployeeData(prev => ({
                      ...prev,
                      officialInfo: { ...prev.officialInfo, firstName: e.target.value }
                    }))}
                    placeholder="John"
                    className="focus-premium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input
                    id="last-name"
                    value={employeeData.officialInfo.lastName}
                    onChange={(e) => setEmployeeData(prev => ({
                      ...prev,
                      officialInfo: { ...prev.officialInfo, lastName: e.target.value }
                    }))}
                    placeholder="Doe"
                    className="focus-premium"
                  />
                </div>
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
                    className="focus-premium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-role">Role</Label>
                  <Select
                    value={employeeData.userDetails.role}
                    onValueChange={(val) =>
                      setEmployeeData(prev => ({
                        ...prev,
                        userDetails: {
                          ...prev.userDetails,
                          role: val as NewEmployeeData['userDetails']['role']
                        }
                      }))
                    }
                  >
                    <SelectTrigger id="user-role" className="focus-premium">
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
            
            
            
            <TabsContent value="official" className="space-y-4">
              <OfficialInformation 
                data={employeeData.officialInfo} 
                canEdit={true}
                isEditMode={true}
              />
            </TabsContent>
            
            
          </Tabs>

          {showInvite && inviteUrl && (
            <div className="space-y-2 p-4 border border-border/60 rounded-lg bg-muted/20">
              <Label>Invitation URL (expires in 24 hours)</Label>
              <div className="flex items-center space-x-2">
                <Input readOnly value={inviteUrl} className="flex-1 focus-premium" />
                <Button
                  type="button"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(inviteUrl)
                      toast({ title: 'Copied', description: 'Invitation URL copied to clipboard.' })
                    } catch (e) {
                      toast({ title: 'Copy failed', description: 'Please copy the link manually.', variant: 'destructive' })
                    }
                  }}
                >
                  Copy
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const mailto = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(employeeData.userDetails.email)}&su=${encodeURIComponent('Your KIN-G+ invitation')}&body=${encodeURIComponent('Please complete your registration using this link: ' + inviteUrl)}`
                    window.open(mailto, '_blank')
                  }}
                >
                  Send Gmail
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border/60">
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              {showInvite ? 'Close' : 'Cancel'}
            </Button>
            {!showInvite && (
              <Button onClick={handleSave} disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Creating...' : 'Create Invite Link'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;
