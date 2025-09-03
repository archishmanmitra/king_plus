import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockAttendanceExtended, mockEmployees } from '@/data/mockData';
import { Clock, CheckCircle, XCircle, MapPin, Camera, Play, Pause, Square } from 'lucide-react';
import { useAttendanceTimer } from '@/hooks/use-attendance-timer';
import { ClockOutModal, ClockOutFormData } from '@/components/modals/ClockOutModal';
import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar';
import { AttendanceReports } from '@/components/attendance/AttendanceReports';
import { useToast } from '@/hooks/use-toast';

const Attendance: React.FC = () => {
  const { toast } = useToast();
  const [isClockOutModalOpen, setIsClockOutModalOpen] = useState(false);
  const [historySelectedDate, setHistorySelectedDate] = useState<Date | undefined>(new Date());
  
  const {
    isClockedIn,
    isRunning,
    clockIn,
    clockOut,
    pauseTimer,
    resumeTimer,
    resetTimer,
    formatTime,
    elapsedTime
  } = useAttendanceTimer();

  const handleClockIn = () => {
    clockIn();
    toast({
      title: "Clocked In",
      description: "You have successfully clocked in. Timer is now running.",
    });
  };

  const handleClockOut = () => {
    clockOut();
    setIsClockOutModalOpen(true);
  };

  const handlePause = () => {
    pauseTimer();
    toast({
      title: "Timer Paused",
      description: "Your timer has been paused. Click resume to continue.",
    });
  };

  const handleResume = () => {
    resumeTimer();
    toast({
      title: "Timer Resumed",
      description: "Your timer is now running again.",
    });
  };

  const handleClockOutSubmit = (data: ClockOutFormData) => {
    console.log('Clock out submitted:', {
      ...data,
      totalTime: formatTime(elapsedTime),
      clockOutTime: new Date().toLocaleTimeString(),
      clockInTime: new Date(Date.now() - elapsedTime).toLocaleTimeString()
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

  // Mock attendance history data for the calendar - using September data
  const mockAttendanceHistory = mockAttendanceExtended.map(record => ({
    date: record.date,
    status: record.status,
    clockIn: record.clockIn,
    clockOut: record.clockOut,
    totalHours: record.totalHours,
    method: record.method,
    location: record.location,
    notes: record.notes,
    employeeId: record.employeeId
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Management</h1>
          <p className="text-muted-foreground">Track and manage employee attendance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        {/* Clock In/Out Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Time Tracking
            </CardTitle>
            <CardDescription>Clock in and out for today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center p-6 border-2 border-dashed border-border rounded-lg">
              {/* Current Time Display */}
              <div className="text-4xl font-bold text-primary mb-2">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className="text-sm text-muted-foreground mb-4">
                {new Date().toLocaleDateString([], { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>

              {/* Timer Display */}
              {isClockedIn && (
                <div className="mb-6 p-4 bg-primary/10 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-2">Time Worked Today</div>
                  <div className="text-3xl font-mono font-bold text-primary">
                    {formatTime(elapsedTime)}
                  </div>
                  <div className="flex items-center justify-center mt-2">
                    {isRunning ? (
                      <div className="flex items-center text-success text-sm">
                        <Play className="h-4 w-4 mr-1" />
                        Timer Running
                      </div>
                    ) : (
                      <div className="flex items-center text-warning text-sm">
                        <Pause className="h-4 w-4 mr-1" />
                        Timer Paused
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Clock In/Out Buttons */}
              <div className="flex flex-wrap gap-2 justify-center">
                {!isClockedIn ? (
                  <Button onClick={handleClockIn} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4" />
                    <span>Clock In</span>
                  </Button>
                ) : (
                  <>
                    <Button 
                      onClick={handleClockOut} 
                      variant="destructive" 
                      className="flex items-center space-x-2"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Clock Out</span>
                    </Button>
                    
                    {isRunning ? (
                      <Button 
                        onClick={handlePause} 
                        variant="outline" 
                        className="flex items-center space-x-2"
                      >
                        <Pause className="h-4 w-4" />
                        <span>Pause</span>
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleResume} 
                        variant="outline" 
                        className="flex items-center space-x-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>Resume</span>
                      </Button>
                    )}
                    
                    <Button 
                      onClick={resetTimer} 
                      variant="outline" 
                      className="flex items-center space-x-2"
                    >
                      <Square className="h-4 w-4" />
                      <span>Reset</span>
                    </Button>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">
                    {isClockedIn ? formatTime(elapsedTime) : '00:00:00'}
                  </div>
                  <div className="text-sm text-muted-foreground">Today's Hours</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">40h</div>
                  <div className="text-sm text-muted-foreground">This Week</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-foreground">172h</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
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

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today's Attendance</TabsTrigger>
          <TabsTrigger value="history">Attendance History</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <Card>
            <CardHeader>
              <CardTitle>Today's Attendance Summary</CardTitle>
              <CardDescription>
                Real-time attendance status for all employees
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Attendance Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

              <div className="space-y-4">
                {mockAttendanceExtended.slice(0, 8).map((record) => {
                  const employee = mockEmployees.find(e => e.employeeId === record.employeeId);
                  return (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                          {employee?.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{employee?.name}</div>
                          <div className="text-sm text-muted-foreground">{employee?.department}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="font-medium">{record.clockIn}</div>
                          <div className="text-sm text-muted-foreground">Clock In</div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{record.clockOut || '--:--'}</div>
                          <div className="text-sm text-muted-foreground">Clock Out</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={record.status === 'present' ? 'default' : 'destructive'}>
                            {record.status}
                          </Badge>
                          {record.method === 'biometric' && <CheckCircle className="h-4 w-4 text-success" />}
                          {record.method === 'geo' && <MapPin className="h-4 w-4 text-primary" />}
                          {record.method === 'selfie' && <Camera className="h-4 w-4 text-warning" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <AttendanceCalendar
            attendanceData={mockAttendanceHistory}
            selectedDate={historySelectedDate}
            onDateSelect={setHistorySelectedDate}
            employees={mockEmployees}
          />
        </TabsContent>

        <TabsContent value="reports">
          <AttendanceReports
            attendanceData={mockAttendanceExtended}
            employees={mockEmployees}
          />
        </TabsContent>
      </Tabs>

      {/* Clock Out Modal */}
      <ClockOutModal
        isOpen={isClockOutModalOpen}
        onClose={handleClockOutModalClose}
        onSubmit={handleClockOutSubmit}
        totalTime={formatTime(elapsedTime)}
      />
    </div>
  );
};

export default Attendance;