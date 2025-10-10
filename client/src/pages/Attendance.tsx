import React, { useEffect, useMemo, useState } from "react";
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
import {
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Camera,
  Play,
  Pause,
  Square,
} from "lucide-react";
import { useAttendanceTimer } from "@/hooks/use-attendance-timer";
import {
  ClockOutModal,
  ClockOutFormData,
} from "@/components/modals/ClockOutModal";
import { AttendanceCalendar } from "@/components/attendance/AttendanceCalendar";
import { AttendanceReports } from "@/components/attendance/AttendanceReports";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { approveAttendance, getMyAttendance, getPendingApprovals, rejectAttendance, attendanceClockIn, attendanceClockOut, attendancePause, attendanceResume } from "@/api/employees";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Attendance: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [myAttendances, setMyAttendances] = useState<Array<{ id: string; employeeId: string; workDate?: string; date?: string; clockIn: string | null; clockOut: string | null; totalHours: number; status: string; approverId?: string | null; submittedAt?: string | null; approvedAt?: string | null; timestamps?: Array<{ id: string; attendanceId: string; startTime: string; endTime: string | null; }>; }>>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [timestampsModal, setTimestampsModal] = useState<{ open: boolean; attendance: any | null }>({ open: false, attendance: null });
  const [isClockOutModalOpen, setIsClockOutModalOpen] = useState(false);
  const [historySelectedDate, setHistorySelectedDate] = useState<
    Date | undefined
  >(new Date());

  const {
    isClockedIn,
    isRunning,
    clockIn,
    clockOut,
    pauseTimer,
    resumeTimer,
    resetTimer,
    formatTime,
    elapsedTime,
  } = useAttendanceTimer();

  const handleClockIn = () => {
    if (!user?.employeeId) return;
    attendanceClockIn(user.employeeId)
      .then(() => {
    clockIn();
        toast({ title: "Clocked In", description: "You have successfully clocked in." });
        // Refresh my attendance after action
        return getMyAttendance(user.employeeId);
      })
      .then((res) => setMyAttendances(res.attendances || []))
      .catch(() => toast({ title: 'Clock-in failed', variant: 'destructive' }));
  };

  const handleClockOut = () => {
    if (!user?.employeeId) return;
    attendanceClockOut(user.employeeId)
      .then(() => {
    clockOut();
    setIsClockOutModalOpen(true);
        return getMyAttendance(user.employeeId);
      })
      .then((res) => setMyAttendances(res.attendances || []))
      .catch(() => toast({ title: 'Clock-out failed', variant: 'destructive' }));
  };

  const handlePause = () => {
    if (!user?.employeeId) return;
    attendancePause(user.employeeId)
      .then(() => {
    pauseTimer();
        toast({ title: "Timer Paused", description: "Timer paused." });
      })
      .catch(() => toast({ title: 'Pause failed', variant: 'destructive' }));
  };

  const handleResume = () => {
    if (!user?.employeeId) return;
    attendanceResume(user.employeeId)
      .then(() => {
    resumeTimer();
        toast({ title: "Timer Resumed", description: "Timer resumed." });
      })
      .catch(() => toast({ title: 'Resume failed', variant: 'destructive' }));
  };

  const handleClockOutSubmit = (data: ClockOutFormData) => {
    console.log("Clock out submitted:", {
      ...data,
      totalTime: formatTime(elapsedTime),
      clockOutTime: new Date().toLocaleTimeString(),
      clockInTime: new Date(Date.now() - elapsedTime).toLocaleTimeString(),
    });

    // Here you would typically send the data to your backend
    // For now, we'll just show a success message and reset the timer

    toast({
      title: "Clock Out Complete",
      description: `You have worked for ${formatTime(elapsedTime)} today.`,
    });

    // Reset the timer after successful submission
    resetTimer();
    setIsClockOutModalOpen(false);
  };

  const handleClockOutModalClose = () => {
    setIsClockOutModalOpen(false);
    // Resume the timer if modal is closed without submission
    if (isClockedIn && !isRunning) {
      // This would resume the timer - for now we'll just keep it stopped
    }
  };

  useEffect(() => {
    const load = async () => {
      if (!user?.employeeId) return;
      try {
        setIsLoading(true);
        const res = await getMyAttendance(user.employeeId);
        setMyAttendances(res.attendances || []);
      } catch (e: any) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [user?.employeeId]);

  useEffect(() => {
    const loadApprovals = async () => {
      if (!user || user.role === 'employee') return;
      try {
        const res = await getPendingApprovals(user.id);
        setApprovals(res.attendances || []);
      } catch (e) {
        console.error(e);
      }
    };
    loadApprovals();
  }, [user]);

  const calendarData = useMemo(() => {
    return myAttendances.map((a) => ({
      date: new Date(a.workDate || a.date as string).toISOString().split('T')[0],
      status: (a.clockIn ? 'present' : 'absent') as 'present' | 'absent',
      clockIn: a.clockIn ? new Date(a.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--',
      clockOut: a.clockOut ? new Date(a.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
      totalHours: Number(a.totalHours || 0),
      method: 'manual' as 'manual',
      location: undefined as undefined,
      notes: undefined as undefined,
      employeeId: user?.employeeId,
    }));
  }, [myAttendances, user?.employeeId]);

  const todaysAttendance = useMemo(() => {
    const todayKey = new Date();
    todayKey.setHours(0,0,0,0);
    return myAttendances.find((a) => new Date(a.workDate || a.date as string).getTime() === todayKey.getTime()) || null;
  }, [myAttendances]);

  const openTimestamps = (attendance: any) => setTimestampsModal({ open: true, attendance });
  const closeTimestamps = () => setTimestampsModal({ open: false, attendance: null });

  const handleApprove = async (id: string) => {
    try {
      await approveAttendance(id);
      toast({ title: 'Approved', description: 'Attendance approved.' });
      setApprovals((prev) => prev.filter((a) => a.id !== id));
    } catch (e: any) {
      toast({ title: 'Error', description: 'Failed to approve', variant: 'destructive' });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectAttendance(id);
      toast({ title: 'Rejected', description: 'Attendance rejected.' });
      setApprovals((prev) => prev.filter((a) => a.id !== id));
    } catch (e: any) {
      toast({ title: 'Error', description: 'Failed to reject', variant: 'destructive' });
    }
  };

  const getTodayHours = useMemo(() => {
    if (!todaysAttendance) return 0;
    if (todaysAttendance.clockIn && !todaysAttendance.clockOut) {
      const start = new Date(todaysAttendance.clockIn).getTime();
      const now = Date.now();
      return Math.max(0, (now - start) / 1000 / 3600);
    }
    return Number(todaysAttendance.totalHours || 0);
  }, [todaysAttendance]);

  function getMonday(d: Date) {
    const date = new Date(d);
    const day = (date.getDay() + 6) % 7; // 0=Mon ... 6=Sun
    date.setDate(date.getDate() - day);
    date.setHours(0,0,0,0);
    return date;
  }

  function getSundayOfWeek(d: Date) {
    const monday = getMonday(d);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23,59,59,999);
    return sunday;
  }

  function sumHoursInRange(start: Date, end: Date) {
    return myAttendances.reduce((sum, a) => {
      const wd = new Date(a.workDate || a.date as string);
      if (wd >= start && wd <= end) {
        if (a.clockIn && !a.clockOut && wd.toDateString() === new Date().toDateString()) {
          const curr = Math.max(0, (Date.now() - new Date(a.clockIn).getTime()) / 1000 / 3600);
          return sum + curr;
        }
        return sum + Number(a.totalHours || 0);
      }
      return sum;
    }, 0);
  }

  const weekStart = useMemo(() => getMonday(new Date()), []);
  const weekEnd = useMemo(() => getSundayOfWeek(new Date()), []);
  const monthStart = useMemo(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1, 0,0,0,0); }, []);
  const monthEnd = useMemo(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth()+1, 0, 23,59,59,999); }, []);

  const weekHours = useMemo(() => sumHoursInRange(weekStart, weekEnd), [myAttendances, weekStart, weekEnd]);
  const monthHours = useMemo(() => sumHoursInRange(monthStart, monthEnd), [myAttendances, monthStart, monthEnd]);

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Attendance Management
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Track and manage employee attendance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Clock In/Out Section */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-base md:text-lg">
              <Clock className="h-4 w-4 md:h-5 md:w-5 mr-2" />
              Time Tracking
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">
              Clock in and out for today
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6">
            <div className="text-center p-4 md:p-6 border-2 border-dashed border-border rounded-lg">
              {/* Current Time Display */}
              <div className="text-2xl md:text-4xl font-bold text-primary mb-2">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground mb-4">
                {new Date().toLocaleDateString([], {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>

              {/* Timer Display */}
              {isClockedIn && (
                <div className="mb-4 md:mb-6 p-3 md:p-4 bg-primary/10 rounded-lg">
                  <div className="text-xs md:text-sm text-muted-foreground mb-2">
                    Time Worked Today
                  </div>
                  <div className="text-2xl md:text-3xl font-mono font-bold text-primary">
                    {formatTime(elapsedTime)}
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    {isRunning ? (
                      <div className="flex items-center text-success text-xs md:text-sm">
                        <Play className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        Timer Running
                      </div>
                    ) : (
                      <div className="flex items-center text-warning text-xs md:text-sm">
                        <Pause className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        Timer Paused
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Clock In/Out Buttons */}
              <div className="flex flex-col space-y-2 sm:flex-row sm:flex-wrap sm:space-y-0 sm:gap-2 justify-center">
                {!isClockedIn ? (
                  <Button
                    onClick={handleClockIn}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 text-sm"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Clock In</span>
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={handleClockOut}
                      variant="destructive"
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 text-sm"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Clock Out</span>
                    </Button>

                    {isRunning ? (
                      <Button
                        onClick={handlePause}
                        variant="outline"
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 text-sm"
                      >
                        <Pause className="h-4 w-4" />
                        <span>Pause</span>
                      </Button>
                    ) : (
                      <Button
                        onClick={handleResume}
                        variant="outline"
                        className="w-full sm:w-auto flex items-center justify-center space-x-2 text-sm"
                      >
                        <Play className="h-4 w-4" />
                        <span>Resume</span>
                      </Button>
                    )}

                    <Button
                      onClick={resetTimer}
                      variant="outline"
                      className="w-full sm:w-auto flex items-center justify-center space-x-2 text-sm"
                    >
                      <Square className="h-4 w-4" />
                      <span>Reset</span>
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              <Card>
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="text-lg md:text-2xl font-bold text-success">
                    {(() => {
                      const h = getTodayHours;
                      const totalSeconds = Math.round(h * 3600);
                      const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
                      const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
                      const ss = String(totalSeconds % 60).padStart(2, '0');
                      return `${hh}:${mm}:${ss}`;
                    })()}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Today's Hours
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="text-lg md:text-2xl font-bold text-primary">
                    {weekHours.toFixed(1)}h
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    This Week
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3 md:p-4 text-center">
                  <div className="text-lg md:text-2xl font-bold text-foreground">
                    {monthHours.toFixed(1)}h
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    This Month
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Quick Overview</CardTitle>
            <CardDescription>Today's attendance summary</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">231</div>
                <div className="text-sm text-muted-foreground">Present</div>
              </div>
              <div className="text-center p-4 bg-destructive/10 rounded-lg">
                <div className="text-2xl font-bold text-destructive">8</div>
                <div className="text-sm text-muted-foreground">Absent</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">3</div>
                <div className="text-sm text-muted-foreground">On Leave</div>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <div className="text-2xl font-bold text-warning">95%</div>
                <div className="text-sm text-muted-foreground">Rate</div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      <Tabs defaultValue="today" className="space-y-3 md:space-y-4">
        <TabsList className={`grid w-full ${user?.role === 'employee' ? 'grid-cols-2' : 'grid-cols-4'} md:w-auto`}>
          <TabsTrigger value="today" className="text-xs md:text-sm">
            Today's Attendance
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs md:text-sm">
            Attendance History
          </TabsTrigger>
          {user?.role !== 'employee' && (
            <TabsTrigger value="approvals" className="text-xs md:text-sm">
              Approvals
            </TabsTrigger>
          )}
          {user?.role !== 'employee' && (
          <TabsTrigger value="reports" className="text-xs md:text-sm">
            Reports
          </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="today">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base md:text-lg">
                Today's Attendance Summary
              </CardTitle>
              <CardDescription className="text-xs md:text-sm">
                Real-time attendance status for all employees
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Attendance Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
                <div className="text-center p-3 md:p-4 bg-success/10 rounded-lg">
                  <div className="text-lg md:text-2xl font-bold text-success">
                    231
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Present
                  </div>
                </div>
                <div className="text-center p-3 md:p-4 bg-destructive/10 rounded-lg">
                  <div className="text-lg md:text-2xl font-bold text-destructive">
                    8
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Absent
                  </div>
                </div>
                <div className="text-center p-3 md:p-4 bg-primary/10 rounded-lg">
                  <div className="text-lg md:text-2xl font-bold text-primary">
                    3
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    On Leave
                  </div>
                </div>
                <div className="text-center p-3 md:p-4 bg-warning/10 rounded-lg">
                  <div className="text-lg md:text-2xl font-bold text-warning">
                    95%
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    Rate
                  </div>
                </div>
              </div>

              {todaysAttendance ? (
              <div className="space-y-3 md:space-y-4">
                  <div className="flex flex-col space-y-3 md:flex-row md:items-center md:justify-between md:space-y-0 p-3 md:p-4 border rounded-lg">
                        <div className="min-w-0">
                          <div className="font-medium text-sm md:text-base truncate">
                        {user?.name}
                          </div>
                          <div className="text-xs md:text-sm text-muted-foreground truncate">
                        {user?.employeeId}
                      </div>
                    </div>
                      <div className="flex items-center justify-between md:space-x-4">
                        <div className="flex space-x-4 md:space-x-4">
                          <div className="text-center md:text-right">
                            <div className="font-medium text-xs md:text-sm">
                            {todaysAttendance.clockIn ? new Date(todaysAttendance.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                            </div>
                          <div className="text-xs text-muted-foreground">Clock In</div>
                          </div>
                          <div className="text-center md:text-right">
                            <div className="font-medium text-xs md:text-sm">
                            {todaysAttendance.clockOut ? new Date(todaysAttendance.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "--:--"}
                          </div>
                          <div className="text-xs text-muted-foreground">Clock Out</div>
                        </div>
                      </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                          variant={todaysAttendance.clockIn ? "default" : "destructive"}
                            className="text-xs"
                          >
                          {todaysAttendance.clockIn ? 'present' : 'absent'}
                          </Badge>
                        <Button variant="outline" size="sm" onClick={() => openTimestamps(todaysAttendance)}>View Timestamps</Button>
                      </div>
                    </div>
                  </div>
              </div>
              ) : (
                <div className="text-sm text-muted-foreground">No attendance for today.</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <AttendanceCalendar
            attendanceData={calendarData}
            selectedDate={historySelectedDate}
            onDateSelect={setHistorySelectedDate}
            employees={[]}
          />
        </TabsContent>

        {user?.role !== 'employee' && (
          <TabsContent value="approvals">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg">Pending Approvals</CardTitle>
                <CardDescription className="text-xs md:text-sm">Approve or reject submitted attendances</CardDescription>
              </CardHeader>
              <CardContent>
                {approvals.length ? (
                  <div className="space-y-3">
                    {approvals.map((a) => (
                      <div key={a.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="font-medium">{new Date(a.workDate || a.date as string).toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">
                              In {a.clockIn ? new Date(a.clockIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'} • Out {a.clockOut ? new Date(a.clockOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={() => handleApprove(a.id)}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => handleReject(a.id)}>Reject</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No pending approvals.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {user?.role !== 'employee' && (
        <TabsContent value="reports">
          <AttendanceReports
              attendanceData={calendarData as any}
              employees={[]}
          />
        </TabsContent>
        )}
      </Tabs>

      {/* Clock Out Modal */}
      <ClockOutModal
        isOpen={isClockOutModalOpen}
        onClose={handleClockOutModalClose}
        onSubmit={handleClockOutSubmit}
        totalTime={formatTime(elapsedTime)}
      />

      {/* Timestamps Modal */}
      <Dialog open={timestampsModal.open} onOpenChange={(open) => (open ? null : closeTimestamps())}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Timestamps</DialogTitle>
          </DialogHeader>
          {timestampsModal.attendance && (
            <div className="space-y-2">
              {(timestampsModal.attendance.timestamps || []).length ? (
                (timestampsModal.attendance.timestamps || []).map((t: any) => (
                  <div key={t.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="text-sm">
                      <div className="font-medium">Start</div>
                      <div className="text-muted-foreground">{new Date(t.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div className="text-sm text-right">
                      <div className="font-medium">End</div>
                      <div className="text-muted-foreground">{t.endTime ? new Date(t.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No timestamps recorded.</div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Attendance;

