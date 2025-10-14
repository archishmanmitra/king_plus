import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockLeaveRequests, indianHolidays2025 } from "@/data/mockData";
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Gift,
  Users,
} from "lucide-react";
import LeaveApplicationModal from "@/components/modals/LeaveApplicationModal";
import AssignLeavesModal from "@/components/modals/AssignLeavesModal";
import { HolidayCalendar } from "@/components/leave/HolidayCalendar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  getAllEmployees,
  addLeaveDays,
  getEmployeeLeaveBalance,
} from "@/api/employees";

const Leave: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const canSeeTeamTab = user?.role !== "employee";
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isAssignLeavesModalOpen, setIsAssignLeavesModalOpen] = useState(false);
  const [selectedHolidayDate, setSelectedHolidayDate] = useState<Date>();
  const [employees, setEmployees] = useState<any[]>([]);
  const [employeesWithLeaveBalance, setEmployeesWithLeaveBalance] = useState<
    any[]
  >([]);

  const leaveBalance = {
    sick: 12,
    vacation: 18,
    personal: 8,
    maternity: 90,
    paternity: 15,
    total: 38,
  };

  const handleLeaveApplication = (leaveData: any) => {
    console.log("Leave application submitted:", leaveData);
    setIsLeaveModalOpen(false);
  };

  const handleAssignLeaves = async (leaveData: any) => {
    try {
      await addLeaveDays(
        leaveData.employeeId,
        leaveData.leaveType,
        leaveData.days,
        leaveData.reason
      );
      toast({
        title: "Success",
        description: `Successfully assigned ${leaveData.days} ${leaveData.leaveType} days.`,
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: "Failed to assign leave days",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const loadEmployees = async () => {
      if (!user || user.role !== "global_admin") return;
      try {
        const res = await getAllEmployees();
        const employeesList = res.employees || [];
        setEmployees(employeesList);

        // Load leave balance for each employee
        const employeesWithBalance = await Promise.all(
          employeesList.map(async (emp: any) => {
            try {
              const balanceRes = await getEmployeeLeaveBalance(emp.employeeId);
              return {
                ...emp,
                leaveBalance: balanceRes.leaveBalance,
              };
            } catch (e) {
              console.error(
                `Failed to load leave balance for ${emp.employeeId}:`,
                e
              );
              return emp;
            }
          })
        );
        setEmployeesWithLeaveBalance(employeesWithBalance);
      } catch (e) {
        console.error(e);
      }
    };
    loadEmployees();
  }, [user]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Leave Management
          </h1>
          <p className="text-muted-foreground">
            Comprehensive leave management with holiday calendar
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {user?.role === "global_admin" && (
            <Button
              onClick={() => setIsAssignLeavesModalOpen(true)}
              variant="outline"
              size="lg"
            >
              <Users className="h-5 w-5 mr-2" />
              Assign Leaves
            </Button>
          )}
          <Button onClick={() => setIsLeaveModalOpen(true)} size="lg">
            <FileText className="h-5 w-5 mr-2" />
            Apply for Leave
          </Button>
        </div>
      </div>

      {/* Enhanced Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {leaveBalance.total}
            </div>
            <p className="text-sm text-muted-foreground">days available</p>
          </CardContent>
          <div className="absolute top-2 right-2">
            <Clock className="h-6 w-6 text-primary/30" />
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Vacation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {leaveBalance.vacation}
            </div>
            <p className="text-sm text-muted-foreground">days left</p>
          </CardContent>
          <div className="absolute top-2 right-2">
            <Gift className="h-6 w-6 text-green-600/30" />
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sick Leave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {leaveBalance.sick}
            </div>
            <p className="text-sm text-muted-foreground">days left</p>
          </CardContent>
          <div className="absolute top-2 right-2">
            <Plus className="h-6 w-6 text-yellow-600/30" />
          </div>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Personal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {leaveBalance.personal}
            </div>
            <p className="text-sm text-muted-foreground">days left</p>
          </CardContent>
          <div className="absolute top-2 right-2">
            <CalendarIcon className="h-6 w-6 text-blue-600/30" />
          </div>
        </Card>
      </div>

      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList
          className={`grid w-full ${
            canSeeTeamTab ? "grid-cols-3" : "grid-cols-2"
          }`}
        >
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          {canSeeTeamTab && (
            <TabsTrigger value="team">Team Requests</TabsTrigger>
          )}
          <TabsTrigger value="holidays">Holiday Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>My Leave Requests</CardTitle>
              <CardDescription>
                Track the status of your leave applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLeaveRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          request.status === "approved"
                            ? "bg-success"
                            : request.status === "rejected"
                            ? "bg-destructive"
                            : "bg-warning"
                        }`}
                      />
                      <div>
                        <div className="font-medium capitalize">
                          {request.type} Leave
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {request.startDate} to {request.endDate} (
                          {request.days} days)
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {request.reason}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge
                        variant={
                          request.status === "approved"
                            ? "default"
                            : request.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {request.status}
                      </Badge>
                      <div className="text-right text-sm text-muted-foreground">
                        Applied: {request.appliedDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {canSeeTeamTab && (
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Leave Requests</CardTitle>
                <CardDescription>
                  Pending leave requests requiring your approval
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockLeaveRequests
                    .filter((r) => r.status === "pending")
                    .map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                            {request.employeeName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                          <div>
                            <div className="font-medium">
                              {request.employeeName}
                            </div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {request.type} Leave - {request.days} days
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {request.startDate} to {request.endDate}
                            </div>
                            <div className="text-sm text-foreground mt-1">
                              {request.reason}
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="holidays">
          <HolidayCalendar
            holidays={indianHolidays2025}
            selectedDate={selectedHolidayDate}
            onDateSelect={setSelectedHolidayDate}
          />
        </TabsContent>
      </Tabs>

      {/* Leave Application Modal */}
      <LeaveApplicationModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSave={handleLeaveApplication}
        leaveBalance={leaveBalance}
      />

      {/* Assign Leaves Modal */}
      <AssignLeavesModal
        isOpen={isAssignLeavesModalOpen}
        onClose={() => setIsAssignLeavesModalOpen(false)}
        onSave={handleAssignLeaves}
        employees={employeesWithLeaveBalance}
      />
    </div>
  );
};

export default Leave;
