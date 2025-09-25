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
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="max-w-xl bg-lightblue border border-border/60 rounded-2xl shadow-xl supports-[backdrop-filter]:backdrop-blur-md">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl font-semibold text-foreground">Clock Out Submission</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground color-black">
            Submit your clock out details for approval
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Total Time Display */}
          <div className="p-4 md:p-5 rounded-xl bg-muted/30 border border-border/60">
            <div className="text-center">
              <div className="text-xs md:text-sm text-muted-foreground mb-1">Total Time Worked</div>
              <div className="font-mono text-2xl md:text-3xl font-bold text-primary">{totalTime}</div>
            </div>
          </div>

          {/* Work Type */}
          <div className="space-y-3">
            <Label className="text-sm">Work Type <span className="text-destructive">*</span></Label>
            <RadioGroup 
              value={formData.workType} 
              onValueChange={(value: 'personal' | 'official') => 
                setFormData({ ...formData, workType: value })
              }
              className="grid grid-cols-2 gap-3"
            >
              <label htmlFor="official" className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/40">
                <RadioGroupItem value="official" id="official" />
                <span className="text-sm">Official</span>
              </label>
              <label htmlFor="personal" className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/40">
                <RadioGroupItem value="personal" id="personal" />
                <span className="text-sm">Personal</span>
              </label>
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
            <Label htmlFor="ableToWork" className="text-sm">I am able to work</Label>
          </div>

          {/* Approval By */}
          <div className="space-y-2">
            <Label htmlFor="approvalBy" className="text-sm">To be approved by <span className="text-destructive">*</span></Label>
            <Select 
              value={formData.approvalBy} 
              onValueChange={(value) => setFormData({ ...formData, approvalBy: value })}
              required
            >
              <SelectTrigger id="approvalBy" className="focus-premium">
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
            <Label htmlFor="notes" className="text-sm">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional notes or comments..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              className="focus-premium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-border/60">
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
