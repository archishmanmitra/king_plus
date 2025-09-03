import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { CalendarIcon, Save, Upload, CheckCircle, XCircle, Clock } from 'lucide-react';

interface LeaveFormData {
  type: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  reason: string;
  duration: number;
}

interface LeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeaveFormData) => void;
}

export const LeaveApplicationModal: React.FC<LeaveModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<LeaveFormData>({
    type: '',
    startDate: undefined,
    endDate: undefined,
    reason: '',
    duration: 1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    toast({
      title: "Leave Application Submitted",
      description: "Your leave request has been submitted for approval.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Apply for Leave</DialogTitle>
          <DialogDescription>Submit a new leave request</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Leave Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Vacation Leave</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
                <SelectItem value="emergency">Emergency Leave</SelectItem>
                <SelectItem value="maternity">Maternity Leave</SelectItem>
                <SelectItem value="paternity">Paternity Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "MMM dd") : "Start"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => setFormData({ ...formData, startDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? format(formData.endDate, "MMM dd") : "End"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => setFormData({ ...formData, endDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Reason</Label>
            <Textarea
              placeholder="Please provide a reason for your leave..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Submit Application</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface ExpenseFormData {
  amount: string;
  category: string;
  description: string;
  date: Date | undefined;
  receipt: File | null;
  // New claim schema fields
  reportingManager: string;
  fromDate: string;
  toDate: string;
  location: string;
  currency: string;
  billNumber: string;
  percentageOfOfficialUse: string;
  vendor: string;
  comment: string;
}

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseFormData) => void;
}

export const ExpenseClaimModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: '',
    category: '',
    description: '',
    date: new Date(),
    receipt: null,
    reportingManager: '',
    fromDate: '',
    toDate: '',
    location: '',
    currency: 'USD',
    billNumber: '',
    percentageOfOfficialUse: '',
    vendor: '',
    comment: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    toast({
      title: "Expense Claim Submitted",
      description: "Your expense claim has been submitted for approval.",
    });
    onClose();
  };

  const managers = ['David Wilson', 'Emily Rodriguez', 'Soumodip Dey'];
  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Expense Claim</DialogTitle>
          <DialogDescription>Create a new expense reimbursement request with complete details</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount *</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="meals">Meals</SelectItem>
                    <SelectItem value="office">Office Supplies</SelectItem>
                    <SelectItem value="software">Software</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                placeholder="Describe your expense..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Claim Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Claim Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Reporting Manager *</Label>
                <Select value={formData.reportingManager} onValueChange={(value) => setFormData({ ...formData, reportingManager: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    {managers.map(manager => (
                      <SelectItem key={manager} value={manager}>{manager}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Bill Number *</Label>
                <Input
                  placeholder="Enter bill number"
                  value={formData.billNumber}
                  onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From Date *</Label>
                <Input
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>To Date *</Label>
                <Input
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Location *</Label>
                <Input
                  placeholder="Enter location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Currency *</Label>
                <Select value={formData.currency} onValueChange={(value) => setFormData({ ...formData, currency: value })} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map(curr => (
                      <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Percentage of Official Use *</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="100"
                  value={formData.percentageOfOfficialUse}
                  onChange={(e) => setFormData({ ...formData, percentageOfOfficialUse: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Vendor *</Label>
                <Input
                  placeholder="Enter vendor name"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Comment</Label>
              <Textarea
                placeholder="Additional comments or notes..."
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Receipt Upload *</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
              <Button type="button" variant="outline" size="sm">Choose File</Button>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit">Submit Claim</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestType: string;
  requestData: any;
  onApprove: () => void;
  onReject: () => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({ 
  isOpen, 
  onClose, 
  requestType, 
  requestData, 
  onApprove, 
  onReject 
}) => {
  const { toast } = useToast();
  const [comments, setComments] = useState('');

  const handleApprove = () => {
    onApprove();
    toast({
      title: "Request Approved",
      description: `${requestType} request has been approved.`,
    });
    onClose();
  };

  const handleReject = () => {
    onReject();
    toast({
      title: "Request Rejected",
      description: `${requestType} request has been rejected.`,
      variant: "destructive",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Review {requestType} Request</DialogTitle>
          <DialogDescription>Approve or reject this request</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Request Details */}
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Employee:</span>
              <span className="text-sm font-medium">{requestData?.employeeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Type:</span>
              <Badge variant="outline">{requestData?.type}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Amount/Duration:</span>
              <span className="text-sm font-medium">
                {requestData?.amount ? `$${requestData.amount}` : `${requestData?.days} days`}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">Reason:</span>
              <p className="text-sm">{requestData?.reason || requestData?.description}</p>
            </div>
          </div>
          
          {/* Manager Comments */}
          <div className="space-y-2">
            <Label>Manager Comments (Optional)</Label>
            <Textarea
              placeholder="Add any comments..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-2">
            <Button onClick={handleReject} variant="destructive" className="flex-1">
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApprove} className="flex-1 bg-success hover:bg-success/90">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};