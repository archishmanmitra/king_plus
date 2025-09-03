import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { mockEmployees } from '@/data/mockData';
import { 
  Calendar as CalendarIcon, 
  Save, 
  Upload,
  User,
  MapPin,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  Info,
  FileText,
  X
} from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';

interface LeaveApplicationFormData {
  leaveType: string;
  subType: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  rejoinDate: Date | undefined;
  halfDaySession: 'morning' | 'afternoon' | '';
  numberOfDays: number;
  reason: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  emergencyContactAddress: string;
  addressDuringLeave: string;
  reportingManager: string;
  backupPersonnel: string;
  medicalCertificate: boolean;
  attachments: File[];
  handoverNotes: string;
  workFromHomeOption: boolean;
  alternateEmail: string;
  alternatePhone: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  projectsAffected: string;
  clientNotification: boolean;
  anticipatedImpact: string;
}

interface LeaveApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (leaveData: LeaveApplicationFormData) => void;
  leaveBalance: {
    sick: number;
    vacation: number;
    personal: number;
    maternity: number;
    paternity: number;
    total: number;
  };
}

const LeaveApplicationModal: React.FC<LeaveApplicationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  leaveBalance 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<LeaveApplicationFormData>({
    leaveType: '',
    subType: '',
    startDate: undefined,
    endDate: undefined,
    rejoinDate: undefined,
    halfDaySession: '',
    numberOfDays: 0,
    reason: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    emergencyContactAddress: '',
    addressDuringLeave: '',
    reportingManager: '',
    backupPersonnel: '',
    medicalCertificate: false,
    attachments: [],
    handoverNotes: '',
    workFromHomeOption: false,
    alternateEmail: '',
    alternatePhone: '',
    urgencyLevel: 'low',
    projectsAffected: '',
    clientNotification: false,
    anticipatedImpact: ''
  });

  // Calculate number of days when dates change
  React.useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const days = differenceInDays(formData.endDate, formData.startDate) + 1;
      const rejoin = addDays(formData.endDate, 1);
      setFormData(prev => ({
        ...prev,
        numberOfDays: days,
        rejoinDate: rejoin
      }));
    }
  }, [formData.startDate, formData.endDate]);

  const leaveTypes = [
    { value: 'sick', label: 'Sick Leave', balance: leaveBalance.sick },
    { value: 'vacation', label: 'Vacation Leave', balance: leaveBalance.vacation },
    { value: 'personal', label: 'Personal Leave', balance: leaveBalance.personal },
    { value: 'emergency', label: 'Emergency Leave', balance: 0 },
    { value: 'maternity', label: 'Maternity Leave', balance: leaveBalance.maternity },
    { value: 'paternity', label: 'Paternity Leave', balance: leaveBalance.paternity },
    { value: 'bereavement', label: 'Bereavement Leave', balance: 5 },
    { value: 'study', label: 'Study Leave', balance: 0 },
    { value: 'sabbatical', label: 'Sabbatical', balance: 0 },
    { value: 'unpaid', label: 'Unpaid Leave', balance: 0 }
  ];

  const getSubTypes = (leaveType: string) => {
    switch (leaveType) {
      case 'sick':
        return ['Illness', 'Medical Appointment', 'Surgery', 'Recovery', 'Mental Health'];
      case 'vacation':
        return ['Annual Leave', 'Holiday Trip', 'Family Time', 'Personal Travel'];
      case 'personal':
        return ['Family Event', 'Personal Business', 'Home Emergency', 'Other'];
      case 'emergency':
        return ['Family Emergency', 'Medical Emergency', 'Natural Disaster', 'Urgent Personal Matter'];
      case 'maternity':
        return ['Pre-natal', 'Post-natal', 'Adoption'];
      case 'paternity':
        return ['Newborn Care', 'Adoption', 'Partner Support'];
      case 'bereavement':
        return ['Immediate Family', 'Extended Family', 'Close Friend'];
      case 'study':
        return ['Examination', 'Course Completion', 'Research', 'Conference'];
      default:
        return [];
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.leaveType || !formData.startDate || !formData.endDate || !formData.reason) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.startDate >= formData.endDate) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.emergencyContactName || !formData.emergencyContactPhone) {
      toast({
        title: "Validation Error",
        description: "Emergency contact information is required.",
        variant: "destructive"
      });
      return;
    }

    // Check leave balance
    const selectedLeaveType = leaveTypes.find(type => type.value === formData.leaveType);
    if (selectedLeaveType && selectedLeaveType.balance > 0 && formData.numberOfDays > selectedLeaveType.balance) {
      toast({
        title: "Insufficient Leave Balance",
        description: `You only have ${selectedLeaveType.balance} days of ${selectedLeaveType.label} remaining.`,
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    
    toast({
      title: "Success",
      description: "Leave application submitted successfully!",
    });
    
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const selectedLeaveType = leaveTypes.find(type => type.value === formData.leaveType);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <FileText className="h-6 w-6 mr-2" />
            Leave Application Form
          </DialogTitle>
          <DialogDescription>
            Please fill out all required information for your leave request. All fields marked with * are mandatory.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Leave Details Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Leave Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="leaveType">Leave Type *</Label>
                <Select 
                  value={formData.leaveType} 
                  onValueChange={(value) => setFormData({ ...formData, leaveType: value, subType: '' })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex justify-between items-center w-full">
                          <span>{type.label}</span>
                          {type.balance > 0 && (
                            <Badge variant="outline" className="ml-2">
                              {type.balance} days
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedLeaveType && selectedLeaveType.balance > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Available balance: {selectedLeaveType.balance} days
                  </p>
                )}
              </div>

              {formData.leaveType && (
                <div className="space-y-2">
                  <Label htmlFor="subType">Leave Sub-type</Label>
                  <Select 
                    value={formData.subType} 
                    onValueChange={(value) => setFormData({ ...formData, subType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select sub-type" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubTypes(formData.leaveType).map((subType) => (
                        <SelectItem key={subType} value={subType}>
                          {subType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : "Pick start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={(date) => setFormData({ ...formData, startDate: date })}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : "Pick end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.endDate}
                      onSelect={(date) => setFormData({ ...formData, endDate: date })}
                      disabled={(date) => !formData.startDate || date < formData.startDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Rejoin Date</Label>
                <Input
                  value={formData.rejoinDate ? format(formData.rejoinDate, "PPP") : ""}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Auto-calculated</p>
              </div>
            </div>

            {formData.numberOfDays === 1 && (
              <div className="space-y-2">
                <Label>Half Day Session</Label>
                <Select 
                  value={formData.halfDaySession} 
                  onValueChange={(value: 'morning' | 'afternoon') => setFormData({ ...formData, halfDaySession: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select session (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9 AM - 1 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (2 PM - 6 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-900">Leave Summary</p>
                    <p className="text-sm text-blue-700">
                      Total Days: <strong>{formData.numberOfDays}</strong>
                      {formData.startDate && formData.endDate && (
                        <span className="ml-4">
                          From: {format(formData.startDate, "dd MMM yyyy")} to {format(formData.endDate, "dd MMM yyyy")}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Contact Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Emergency Contact *</CardTitle>
                  <CardDescription>Person to contact in case of emergency</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Full Name *</Label>
                    <Input
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      placeholder="Emergency contact name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number *</Label>
                    <Input
                      value={formData.emergencyContactPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Relationship</Label>
                    <Select 
                      value={formData.emergencyContactRelation} 
                      onValueChange={(value) => setFormData({ ...formData, emergencyContactRelation: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Alternative Contact</CardTitle>
                  <CardDescription>Alternative ways to reach you during leave</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Alternate Email</Label>
                    <Input
                      type="email"
                      value={formData.alternateEmail}
                      onChange={(e) => setFormData({ ...formData, alternateEmail: e.target.value })}
                      placeholder="personal@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Alternate Phone</Label>
                    <Input
                      value={formData.alternatePhone}
                      onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-2">
              <Label>Address During Leave</Label>
              <Textarea
                value={formData.addressDuringLeave}
                onChange={(e) => setFormData({ ...formData, addressDuringLeave: e.target.value })}
                placeholder="Complete address where you'll be staying during leave"
                rows={3}
              />
            </div>
          </div>

          {/* Work Handover */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Work Handover & Coverage</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Reporting Manager *</Label>
                <Select 
                  value={formData.reportingManager} 
                  onValueChange={(value) => setFormData({ ...formData, reportingManager: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reporting manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Backup Personnel</Label>
                <Select 
                  value={formData.backupPersonnel} 
                  onValueChange={(value) => setFormData({ ...formData, backupPersonnel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select backup person" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Projects Affected</Label>
              <Textarea
                value={formData.projectsAffected}
                onChange={(e) => setFormData({ ...formData, projectsAffected: e.target.value })}
                placeholder="List all projects that might be affected by your leave"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label>Handover Notes</Label>
              <Textarea
                value={formData.handoverNotes}
                onChange={(e) => setFormData({ ...formData, handoverNotes: e.target.value })}
                placeholder="Detailed handover instructions for your replacement"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Urgency Level</Label>
                <Select 
                  value={formData.urgencyLevel} 
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => setFormData({ ...formData, urgencyLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low - Planned leave</SelectItem>
                    <SelectItem value="medium">Medium - Some urgency</SelectItem>
                    <SelectItem value="high">High - Urgent situation</SelectItem>
                    <SelectItem value="critical">Critical - Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="clientNotification"
                    checked={formData.clientNotification}
                    onCheckedChange={(checked) => setFormData({ ...formData, clientNotification: checked as boolean })}
                  />
                  <Label htmlFor="clientNotification">Client notification required</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="workFromHome"
                    checked={formData.workFromHomeOption}
                    onCheckedChange={(checked) => setFormData({ ...formData, workFromHomeOption: checked as boolean })}
                  />
                  <Label htmlFor="workFromHome">Available for urgent work from home</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Reason & Documentation */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold border-b pb-2">Reason & Documentation</h3>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Detailed Reason *</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Please provide a detailed reason for your leave request..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Anticipated Impact</Label>
              <Textarea
                value={formData.anticipatedImpact}
                onChange={(e) => setFormData({ ...formData, anticipatedImpact: e.target.value })}
                placeholder="Describe the anticipated impact on your work and team"
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="medicalCertificate"
                  checked={formData.medicalCertificate}
                  onCheckedChange={(checked) => setFormData({ ...formData, medicalCertificate: checked as boolean })}
                />
                <Label htmlFor="medicalCertificate">Medical certificate attached (if applicable)</Label>
              </div>

              <div className="space-y-2">
                <Label>Supporting Documents</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Upload supporting documents (medical certificates, travel documents, etc.)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    Choose Files
                  </Button>
                </div>
                
                {formData.attachments.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Attached Files:</p>
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Submit Leave Application
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeaveApplicationModal;
