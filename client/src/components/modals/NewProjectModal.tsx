import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { mockEmployees } from '@/data/mockData';
import { 
  FolderOpen, 
  Save, 
  X,
  User,
  Calendar,
  Percent,
  Code,
  Users
} from 'lucide-react';

interface NewProjectFormData {
  name: string;
  description: string;
  projectCode: string;
  phaseStatus: 'Production' | 'PreProd' | 'PostProd' | '';
  allocationPercentage: number;
  fromDate: string;
  toDate: string;
  reportingManager: string;
  members: string[];
  client: string;
  budget: number;
}

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (projectData: NewProjectFormData) => void;
}

const NewProjectModal: React.FC<NewProjectModalProps> = ({ isOpen, onClose, onSave }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<NewProjectFormData>({
    name: '',
    description: '',
    projectCode: '',
    phaseStatus: '',
    allocationPercentage: 0,
    fromDate: '',
    toDate: '',
    reportingManager: '',
    members: [],
    client: '',
    budget: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.projectCode || !formData.phaseStatus || 
        !formData.fromDate || !formData.toDate || !formData.reportingManager) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.allocationPercentage < 0 || formData.allocationPercentage > 100) {
      toast({
        title: "Validation Error",
        description: "Allocation percentage must be between 0 and 100.",
        variant: "destructive"
      });
      return;
    }

    if (new Date(formData.fromDate) >= new Date(formData.toDate)) {
      toast({
        title: "Validation Error",
        description: "From date must be before to date.",
        variant: "destructive"
      });
      return;
    }

    onSave(formData);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      projectCode: '',
      phaseStatus: '',
      allocationPercentage: 0,
      fromDate: '',
      toDate: '',
      reportingManager: '',
      members: [],
      client: '',
      budget: 0
    });
    
    toast({
      title: "Success",
      description: "Project created successfully!",
    });
    
    onClose();
  };

  const handleMemberToggle = (employeeId: string) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(employeeId)
        ? prev.members.filter(id => id !== employeeId)
        : [...prev.members, employeeId]
    }));
  };

  const getSelectedMemberNames = () => {
    return formData.members
      .map(id => mockEmployees.find(emp => emp.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            <FolderOpen className="h-5 w-5 mr-2" />
            Create New Project
          </DialogTitle>
          <DialogDescription className='text-white'>
            Fill in the project details to create a new project.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg text-white">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="projectCode">
                  <Code className="h-4 w-4 inline mr-2" />
                  Project Code *
                </Label>
                <Input
                  id="projectCode"
                  value={formData.projectCode}
                  onChange={(e) => setFormData({ ...formData, projectCode: e.target.value.toUpperCase() })}
                  placeholder="e.g., PROJ-2024-001"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the project objectives and scope"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                  placeholder="Enter client name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Budget (USD)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Project Configuration */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg text-white">Project Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phaseStatus">Phase Status *</Label>
                <Select 
                  value={formData.phaseStatus} 
                  onValueChange={(value: 'Production' | 'PreProd' | 'PostProd') => 
                    setFormData({ ...formData, phaseStatus: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select phase status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PreProd">Pre-Production</SelectItem>
                    <SelectItem value="Production">Production</SelectItem>
                    <SelectItem value="PostProd">Post-Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allocationPercentage">
                  <Percent className="h-4 w-4 inline mr-2" />
                  Allocation Percentage *
                </Label>
                <Input
                  id="allocationPercentage"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.allocationPercentage}
                  onChange={(e) => setFormData({ ...formData, allocationPercentage: Number(e.target.value) })}
                  placeholder="0-100"
                  required
                />
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg text-white">Timeline</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromDate">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  From Date *
                </Label>
                <Input
                  id="fromDate"
                  type="date"
                  value={formData.fromDate}
                  onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="toDate">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  To Date *
                </Label>
                <Input
                  id="toDate"
                  type="date"
                  value={formData.toDate}
                  onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          {/* Team Management */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg text-white">Team Management</h3>
            
            <div className="space-y-2">
              <Label htmlFor="reportingManager">
                <User className="h-4 w-4 inline mr-2" />
                Reporting Manager *
              </Label>
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
              <Label>
                <Users className="h-4 w-4 inline mr-2" />
                Team Members (Select multiple)
              </Label>
              <Select 
                value={formData.members.length > 0 ? formData.members[0] : ''} 
                onValueChange={(value) => {
                  if (value && !formData.members.includes(value)) {
                    setFormData(prev => ({
                      ...prev,
                      members: [...prev.members, value]
                    }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team members" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees
                    .filter(employee => !formData.members.includes(employee.id))
                    .map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name} - {employee.position} ({employee.department})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {formData.members.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Selected members ({formData.members.length}):
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {formData.members.map(memberId => {
                      const member = mockEmployees.find(emp => emp.id === memberId);
                      return member ? (
                        <Badge key={memberId} variant="secondary" className="text-xs">
                          {member.name}
                          <X 
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={() => handleMemberToggle(memberId)}
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewProjectModal;
