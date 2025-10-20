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
import { indianHolidays2025 } from "@/data/mockData";
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
import { getAllEmployees } from "@/api/employees";
import {
  getMyLeaveBalance,
  getLeaveBalance,
  addLeaveDays,
  createLeaveRequest,
  getLeaveRequests,
  updateLeaveRequestStatus,
  getPendingApprovals,
  getTeamLeaveRequests,
} from "@/api/leave";

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
  const [myLeaveRequests, setMyLeaveRequests] = useState<any[]>([]);
  const [teamLeaveRequests, setTeamLeaveRequests] = useState<any[]>([]);
  const [leaveBalance, setLeaveBalance] = useState({
    sick: 0,
    earned: 0,
    vacation: 0,
    personal: 0,
    maternity: 0,
    paternity: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  const handleLeaveApplication = async (leaveData: any) => {
    try {
      // Map frontend field names to backend field names
      await createLeaveRequest({
        type: leaveData.type, // Use the correct field name
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
        days: leaveData.days, // Add days field
        reason: leaveData.reason,
      });
      toast({
        title: "Success",
        description: "Leave request submitted successfully",
      });
      setIsLeaveModalOpen(false);
      // Reload leave requests and balance
      loadMyLeaveRequests();
      loadMyLeaveBalance();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed to submit leave request",
        variant: "destructive",
      });
    }
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
      setIsAssignLeavesModalOpen(false);
      // Reload employees with updated balance
      loadEmployees();
    } catch (e: any) {
      toast({
        title: "Error",
        description: "Failed to assign leave days",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (requestId: string) => {
    try {
      await updateLeaveRequestStatus(requestId, "approved", user?.id);
      toast({
        title: "Success",
        description: "Leave request approved",
      });
      // Reload both team requests and my requests
      loadTeamLeaveRequests();
      loadMyLeaveRequests();
    } catch (e: any) {
      toast({
        title: "Error",
        description: "Failed to approve leave request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      await updateLeaveRequestStatus(requestId, "rejected", user?.id);
      toast({
        title: "Success",
        description: "Leave request rejected",
      });
      // Reload both team requests and my requests
      loadTeamLeaveRequests();
      loadMyLeaveRequests();
    } catch (e: any) {
      toast({
        title: "Error",
        description: "Failed to reject leave request",
        variant: "destructive",
      });
    }
  };

  const loadMyLeaveBalance = async () => {
    try {
      const res = await getMyLeaveBalance();
      const balance = res.leaveBalance;
      setLeaveBalance({
        sick: balance?.sick || 0,
        earned: balance?.earned || 0,
        vacation: balance?.vacation || 0,
        personal: balance?.personal || 0,
        maternity: balance?.maternity || 0,
        paternity: balance?.paternity || 0,
        total: balance?.total || 0,
      });
    } catch (e) {
      console.error("Failed to load leave balance:", e);
    }
  };

  const loadMyLeaveRequests = async () => {
    try {
      // Only load the current user's own requests, not employee requests
      const res = await getLeaveRequests({ viewType: "my" });
      setMyLeaveRequests(res.leaveRequests || []);
    } catch (e) {
      console.error("Failed to load leave requests:", e);
    }
  };

  const loadTeamLeaveRequests = async () => {
    if (!canSeeTeamTab) return;
    try {
      if (user?.role === "global_admin" || user?.role === "hr_manager") {
        // For admins, load all leave requests (they will see all in team tab)
        const res = await getLeaveRequests();
        setTeamLeaveRequests(res.leaveRequests || []);
      } else {
        // For managers, load only direct reports' leave requests
        const res = await getTeamLeaveRequests();
        setTeamLeaveRequests(res.teamLeaveRequests || []);
      }
    } catch (e) {
      console.error("Failed to load team leave requests:", e);
    }
  };

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
            const balanceRes = await getLeaveBalance(emp.id);
            return {
              ...emp,
              leaveBalance: balanceRes.leaveBalance,
            };
          } catch (e) {
            console.error(`Failed to load leave balance for ${emp.id}:`, e);
            return emp;
          }
        })
      );
      setEmployeesWithLeaveBalance(employeesWithBalance);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        loadMyLeaveBalance(),
        loadMyLeaveRequests(),
        loadTeamLeaveRequests(),
        loadEmployees(),
      ]);
      setLoading(false);
    };
    loadData();
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
        <Card className="relative overflow-hidden h-40 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 border-blue-600/30 shadow-lg shadow-blue-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-100">
              Total Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {leaveBalance.total}
            </div>
            <p className="text-sm text-blue-200">days available</p>
          </CardContent>
          <div className="absolute top-2 right-2">
            <Clock className="h-6 w-6 text-white/70" />
          </div>
        </Card>

        <Card className="relative overflow-hidden h-40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Earned Leave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {leaveBalance.earned}
            </div>
            <p className="text-sm text-muted-foreground">days left</p>
          </CardContent>
          <div className="absolute top-2 right-2">
            <Gift className="h-6 w-6 text-green-600/30" />
          </div>
        </Card>

        <Card className="relative overflow-hidden h-40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Maternity Leave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">
              {leaveBalance.maternity}
            </div>
            <p className="text-sm text-muted-foreground">days left</p>
          </CardContent>
          <div className="absolute top-2 right-2">
            <Plus className="h-6 w-6 text-pink-600/30" />
          </div>
        </Card>

        <Card className="relative overflow-hidden h-40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Paternity Leave
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {leaveBalance.paternity}
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
                Track the status of your own leave applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : myLeaveRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No leave requests found
                </div>
              ) : (
                <div className="space-y-4">
                  {myLeaveRequests.map((request: any) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                          {request.employee?.official?.firstName?.[0] || ""}
                          {request.employee?.official?.lastName?.[0] || ""}
                        </div>
                        <div>
                          <div className="font-medium">
                            {request.employee?.official?.firstName}{" "}
                            {request.employee?.official?.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {request.type} Leave - {request.days} days
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(request.startDate).toLocaleDateString()}{" "}
                            to {new Date(request.endDate).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-foreground mt-1">
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
                          Applied:{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </div>
                        {request.status === "pending" && canSeeTeamTab && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(request.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(request.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {canSeeTeamTab && (
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>Team Leave Requests</CardTitle>
                <CardDescription>
                  {user?.role === "global_admin" || user?.role === "hr_manager"
                    ? "All leave requests from employees requiring your approval"
                    : "Leave requests from your direct reports requiring your approval"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : teamLeaveRequests.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No leave requests found
                  </div>
                ) : (
                  <div className="space-y-4">
                    {teamLeaveRequests.map((request: any) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                            {request.employee?.official?.firstName?.[0] || ""}
                            {request.employee?.official?.lastName?.[0] || ""}
                          </div>
                          <div>
                            <div className="font-medium">
                              {request.employee?.official?.firstName}{" "}
                              {request.employee?.official?.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {request.type} Leave - {request.days} days
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(request.startDate).toLocaleDateString()}{" "}
                              to{" "}
                              {new Date(request.endDate).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-foreground mt-1">
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
                            Applied:{" "}
                            {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                          {request.status === "pending" && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApprove(request.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(request.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="holidays">
          <HolidayCalendar
            holidays={indianHolidays2025 as any}
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
