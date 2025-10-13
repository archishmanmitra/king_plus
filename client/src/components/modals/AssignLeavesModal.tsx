import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  User,
  Calendar,
  Save,
  Plus,
  Minus,
  AlertCircle,
  Info,
  FileText,
  Users,
} from "lucide-react";

interface AssignLeavesFormData {
  employeeId: string;
  leaveType: "earned" | "maternity" | "paternity" | "compoff";
  days: number;
  reason: string;
  year: number;
}

interface Employee {
  name: string;
  employeeId: string;
  position?: string;
  department?: string;
  avatar?: string;
  leaveBalance?: {
    sick: number;
    vacation: number;
    personal: number;
    maternity: number;
    paternity: number;
    earned:number
    total: number;
  };
}

interface AssignLeavesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (leaveData: AssignLeavesFormData) => void;
  employees: Employee[];
}

const AssignLeavesModal: React.FC<AssignLeavesModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employees,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AssignLeavesFormData>({
    employeeId: "",
    leaveType: "earned",
    days: 1,
    reason: "",
    year: new Date().getFullYear(),
  });

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);

  const leaveTypes = [
    {
      value: "earned",
      label: "Earned Leave",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "maternity",
      label: "Maternity Leave",
      color: "bg-pink-100 text-pink-800",
    },
    {
      value: "paternity",
      label: "Paternity Leave",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "compoff",
      label: "Compensatory Off",
      color: "bg-green-100 text-green-800",
    },
  ];

  // Update selected employee when employeeId changes
  useEffect(() => {
    if (formData.employeeId) {
      const employee = employees.find(
        (emp) => emp.employeeId === formData.employeeId
      );
      setSelectedEmployee(employee || null);
    } else {
      setSelectedEmployee(null);
    }
  }, [formData.employeeId, employees]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.employeeId || !formData.leaveType || !formData.reason) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.days <= 0) {
      toast({
        title: "Validation Error",
        description: "Number of days must be greater than 0.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      toast({
        title: "Success",
        description: `Successfully assigned ${formData.days} ${
          leaveTypes.find((t) => t.value === formData.leaveType)?.label
        } days.`,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign leave days. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDaysChange = (newDays: number) => {
    if (newDays >= 0) {
      setFormData((prev) => ({ ...prev, days: newDays }));
    }
  };

  const selectedLeaveType = leaveTypes.find(
    (type) => type.value === formData.leaveType
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl">
            <Users className="h-6 w-6 mr-2" />
            Assign Leave Days
          </DialogTitle>
          <DialogDescription>
            Assign leave days to employees. This will add the specified number
            of days to their leave balance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Employee Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Employee Selection
            </h3>

            <div className="space-y-2">
              <Label htmlFor="employeeId">Select Employee *</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, employeeId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem
                      key={employee.employeeId}
                      value={employee.employeeId}
                    >
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {employee.employeeId} •{" "}
                            {employee.position || "Employee"}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Employee Info */}
            {selectedEmployee && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">
                        {selectedEmployee.name}
                      </h4>
                      <p className="text-sm text-blue-700">
                        ID: {selectedEmployee.employeeId} •{" "}
                        {selectedEmployee.position || "Employee"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Leave Assignment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Leave Assignment Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leaveType">Leave Type *</Label>
                <Select
                  value={formData.leaveType}
                  onValueChange={(
                    value: "earned" | "maternity" | "paternity" | "compoff"
                  ) => setFormData({ ...formData, leaveType: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center space-x-2">
                          <Badge className={type.color}>{type.label}</Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      year:
                        parseInt(e.target.value) || new Date().getFullYear(),
                    })
                  }
                  min="2020"
                  max="2030"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="days">Number of Days *</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDaysChange(formData.days - 1)}
                  disabled={formData.days <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={formData.days}
                  onChange={(e) =>
                    handleDaysChange(parseInt(e.target.value) || 0)
                  }
                  min="0"
                  max="365"
                  className="text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDaysChange(formData.days + 1)}
                  disabled={formData.days >= 365}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason for Assignment *</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="Provide a reason for assigning these leave days (e.g., Annual allocation, Special circumstances, etc.)"
                rows={3}
                required
              />
            </div>
          </div>

          {/* Current Leave Balance Display */}
          {selectedEmployee && selectedEmployee.leaveBalance && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Current Leave Balance
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold text-red-600">
                      {selectedEmployee.leaveBalance.sick}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Sick Days
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold text-blue-600">
                      {selectedEmployee.leaveBalance.vacation}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Vacation Days
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold text-green-600">
                      {selectedEmployee.leaveBalance.personal}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Personal Days
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold text-pink-600">
                      {selectedEmployee.leaveBalance.maternity}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Maternity Days
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold text-purple-600">
                      {selectedEmployee.leaveBalance.paternity}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Paternity Days
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <div className="text-lg font-bold text-primary">
                      {selectedEmployee.leaveBalance.total}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total Days
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Assignment Summary */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Info className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">
                    Assignment Summary
                  </p>
                  <p className="text-sm text-green-700">
                    {formData.days > 0 &&
                    selectedEmployee &&
                    selectedLeaveType ? (
                      <>
                        Adding <strong>{formData.days}</strong>{" "}
                        {selectedLeaveType.label.toLowerCase()} days to{" "}
                        <strong>{selectedEmployee.name}</strong> for year{" "}
                        <strong>{formData.year}</strong>
                      </>
                    ) : (
                      "Complete the form to see assignment summary"
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Assigning..." : "Assign Leave Days"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AssignLeavesModal;
