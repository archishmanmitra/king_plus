import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface ClockOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClockOutFormData) => void;
  totalTime: string;
}

export interface ClockOutFormData {
  workType: 'personal' | 'official';
  ableToWork: boolean;
  approvalBy: string;
  notes: string;
}

export const ClockOutModal: React.FC<ClockOutModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  totalTime 
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ClockOutFormData>({
    workType: 'official',
    ableToWork: true,
    approvalBy: '',
    notes: ''
  });

  const managers = ['David Wilson', 'Emily Rodriguez', 'Soumodip Dey'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.approvalBy) {
      toast({
        title: "Validation Error",
        description: "Please select who will approve your clock out.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(formData);
    toast({
      title: "Clock Out Submitted",
      description: "Your clock out has been submitted successfully.",
    });
    onClose();
  };

  const handleClose = () => {
    setFormData({
      workType: 'official',
      ableToWork: true,
      approvalBy: '',
      notes: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Clock Out Submission</DialogTitle>
          <DialogDescription>
            Submit your clock out details for approval
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Total Time Display */}
          <div className="text-center p-4 bg-primary/10 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Total Time Worked</div>
            <div className="text-2xl font-bold text-primary">{totalTime}</div>
          </div>

          {/* Work Type */}
          <div className="space-y-3">
            <Label>Work Type *</Label>
            <RadioGroup 
              value={formData.workType} 
              onValueChange={(value: 'personal' | 'official') => 
                setFormData({ ...formData, workType: value })
              }
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="official" id="official" />
                <Label htmlFor="official">Official</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="personal" id="personal" />
                <Label htmlFor="personal">Personal</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Able to Work Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="ableToWork"
              checked={formData.ableToWork}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, ableToWork: checked as boolean })
              }
            />
            <Label htmlFor="ableToWork">I am able to work</Label>
          </div>

          {/* Approval By */}
          <div className="space-y-2">
            <Label htmlFor="approvalBy">To be approved by *</Label>
            <Select 
              value={formData.approvalBy} 
              onValueChange={(value) => setFormData({ ...formData, approvalBy: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select approver" />
              </SelectTrigger>
              <SelectContent>
                {managers.map(manager => (
                  <SelectItem key={manager} value={manager}>{manager}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes or comments..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
