import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight, CalendarIcon, CheckCircle, XCircle, Clock, Minus, MapPin, Users, Camera } from 'lucide-react';

interface AttendanceDay {
  date: string;
  status: 'present' | 'absent';
  clockIn: string;
  clockOut?: string;
  totalHours: number;
  method?: 'biometric' | 'geo' | 'selfie' | 'manual';
  location?: string;
  notes?: string;
  employeeId?: string;
}

interface AttendanceCalendarProps {
  attendanceData: AttendanceDay[];
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  employees?: Array<{
    id: string;
    employeeId: string;
    name: string;
    department: string;
  }>;
}

export const AttendanceCalendar: React.FC<AttendanceCalendarProps> = ({
  attendanceData,
  selectedDate,
  onDateSelect,
  employees = []
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedDate, setClickedDate] = useState<Date | null>(null);

  // Create a map of attendance data by date for easy lookup
  const attendanceMap = new Map<string, AttendanceDay[]>();
  attendanceData.forEach(day => {
    const existing = attendanceMap.get(day.date) || [];
    existing.push(day);
    attendanceMap.set(day.date, existing);
  });

  // Function to get attendance status for a specific date
  const getAttendanceStatus = (date: Date): 'present' | 'absent' | null => {
    const dateString = date.toISOString().split('T')[0];
    const attendanceRecords = attendanceMap.get(dateString);
    if (!attendanceRecords || attendanceRecords.length === 0) return null;
    
    // If all records have the same status, return that status
    const statuses = attendanceRecords.map(r => r.status);
    if (statuses.every(s => s === statuses[0])) {
      return statuses[0];
    }
    
    // If mixed statuses, return the most common one
    const statusCount = statuses.reduce((acc, status) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(statusCount).sort(([,a], [,b]) => b - a)[0][0] as any;
  };

  // Function to get attendance details for a specific date
  const getAttendanceDetails = (date: Date): AttendanceDay[] => {
    const dateString = date.toISOString().split('T')[0];
    return attendanceMap.get(dateString) || [];
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    setClickedDate(date);
    setIsModalOpen(true);
    onDateSelect(date);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setClickedDate(null);
  };

  // Get month details
  const getMonthDetails = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Navigate months
  const previousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  // Get day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Calculate attendance statistics for a date
  const getDateStats = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const records = attendanceMap.get(dateString) || [];
    
    const stats = {
      present: 0,
      absent: 0,
      total: records.length
    } as any;
    
    records.forEach(record => {
      switch (record.status) {
        case 'present':
          stats.present++;
          break;
        case 'absent':
          stats.absent++;
          break;
        default:
          break;
      }
    });
    
    return stats;
  };

  const monthDays = getMonthDetails(currentMonth);

  // Get method icon
  const getMethodIcon = (method?: string) => {
    switch (method) {
      case 'biometric':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'geo':
        return <MapPin className="h-4 w-4 text-blue-600" />;
      case 'selfie':
        return <Camera className="h-4 w-4 text-purple-600" />;
      case 'manual':
        return <Users className="h-4 w-4 text-orange-600" />;
      default:
        return null;
    }
  };

  // Get employee name
  const getEmployeeName = (employeeId?: string) => {
    if (!employeeId || employees.length === 0) return 'Unknown Employee';
    const employee = employees.find(emp => emp.employeeId === employeeId);
    return employee?.name || 'Unknown Employee';
  };

  return (
    <div className="space-y-6">
      {/* Attendance Statistics */}
      <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{attendanceData.length}</div>
            <div className="text-sm text-muted-foreground">Total Records</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">
              {attendanceData.filter(r => r.status === 'present').length}
            </div>
            <div className="text-sm text-muted-foreground">Present</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">
              {attendanceData.filter(r => r.status === 'absent').length}
            </div>
            <div className="text-sm text-muted-foreground">Absent</div>
          </CardContent>
        </Card>
        
      </div>

      {/* Big Custom Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="h-6 w-6 mr-3" />
              Attendance Calendar
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={previousMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-lg font-semibold min-w-[200px] text-center">
                {getMonthName(currentMonth)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={nextMonth}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="w-full">
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="p-3 text-center font-semibold text-sm text-muted-foreground bg-muted/50 rounded-md">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                const attendanceStatus = getAttendanceStatus(date);
                const dateStats = getDateStats(date);
                
                let dayClass = "p-4 text-center border rounded-lg cursor-pointer transition-colors hover:bg-muted/50";
                let statusIndicator = null;
                
                if (attendanceStatus === 'present') {
                  dayClass += " bg-green-100 border-green-300 hover:bg-green-200";
                  statusIndicator = <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />;
                } else if (attendanceStatus === 'absent') {
                  dayClass += " bg-red-100 border-red-300 hover:bg-red-200";
                  statusIndicator = <XCircle className="h-4 w-4 text-red-600 mx-auto mb-1" />;
                } else {
                  dayClass += " bg-gray-50 border-gray-200";
                }

                if (isToday) {
                  dayClass += " ring-2 ring-blue-500 ring-offset-2";
                }

                if (isSelected) {
                  dayClass += " ring-2 ring-primary ring-offset-2";
                }

                if (!isCurrentMonth) {
                  dayClass += " opacity-50";
                }

                return (
                  <div
                    key={index}
                    className={dayClass}
                    onClick={() => handleDateClick(date)}
                  >
                    {statusIndicator}
                    <div className={`text-sm font-medium ${!isCurrentMonth ? 'text-muted-foreground' : ''}`}>
                      {date.getDate()}
                    </div>
                    {dateStats.total > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        <div className="text-center">
                          {dateStats.present > 0 && (
                            <div className="text-xs bg-green-500 text-white px-1 rounded mb-1">
                              {dateStats.present} Present
                            </div>
                          )}
                          {/* Late and Half Day removed */}
                          {dateStats.absent > 0 && (
                            <div className="text-xs bg-red-500 text-white px-1 rounded">
                              {dateStats.absent} Absent
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/30">
              <h3 className="font-semibold mb-3">Details for {selectedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</h3>
              
              {(() => {
                const details = getAttendanceDetails(selectedDate);
                if (details && details.length > 0) {
                  return (
                    <div className="space-y-4">
                      {/* Summary Statistics */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-lg font-bold text-green-700">
                            {details.filter(d => d.status === 'present').length}
                          </div>
                          <div className="text-sm text-green-600">Present</div>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <div className="text-lg font-bold text-red-700">
                            {details.filter(d => d.status === 'absent').length}
                          </div>
                          <div className="text-sm text-red-600">Absent</div>
                        </div>
                        {/* Late/Half Day removed */}
                      </div>

                      {/* Individual Records */}
                      <div className="space-y-3">
                        <h4 className="font-medium text-muted-foreground">Employee Details:</h4>
                        {details.map((record, index) => (
                          <div key={index} className="p-3 border rounded-lg bg-background">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">
                                {getEmployeeName(record.employeeId)}
                              </span>
                              <Badge variant={
                                record.status === 'present' ? 'default' : 'destructive'
                              }>
                                {record.status}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Clock In:</span>
                                <span className="ml-2 font-medium">{record.clockIn}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Clock Out:</span>
                                <span className="ml-2 font-medium">{record.clockOut || '--:--'}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Hours:</span>
                                <span className="ml-2 font-medium">{record.totalHours}h</span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-muted-foreground">Method:</span>
                                <span className="ml-2 flex items-center">
                                  {getMethodIcon(record.method)}
                                  <span className="ml-1 capitalize">{record.method || 'N/A'}</span>
                                </span>
                              </div>
                            </div>
                            {record.location && (
                              <div className="mt-2 text-sm">
                                <span className="text-muted-foreground">Location:</span>
                                <span className="ml-2">{record.location}</span>
                              </div>
                            )}
                            {record.notes && (
                              <div className="mt-2 text-sm">
                                <span className="text-muted-foreground">Notes:</span>
                                <span className="ml-2 italic">{record.notes}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div className="text-center py-4 text-muted-foreground">
                      <XCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                      <p>No attendance record for this date</p>
                    </div>
                  );
                }
              })()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle>Calendar Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-green-500"></div>
              <span className="text-sm">Present</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-red-500"></div>
              <span className="text-sm">Absent</span>
            </div>
            {/* Late and Half Day removed */}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {clickedDate && clickedDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </DialogTitle>
          </DialogHeader>
          
          {clickedDate && (() => {
            const details = getAttendanceDetails(clickedDate);
            if (details && details.length > 0) {
              return (
                <div className="space-y-4">
                  {/* Summary Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-700">
                        {details.filter(d => d.status === 'present').length}
                      </div>
                      <div className="text-sm text-green-600">Present</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-lg font-bold text-red-700">
                        {details.filter(d => d.status === 'absent').length}
                      </div>
                      <div className="text-sm text-red-600">Absent</div>
                    </div>
                    
                  </div>

                  {/* Individual Records */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-muted-foreground">Employee Details:</h4>
                    {details.map((record, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            {getEmployeeName(record.employeeId)}
                          </span>
                          <Badge variant={
                            record.status === 'present' ? 'default' :
                            record.status === 'absent' ? 'destructive' :
                            record.status === 'late' ? 'secondary' :
                            'outline'
                          }>
                            {record.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Clock In:</span>
                            <span className="ml-2 font-medium">{record.clockIn}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Clock Out:</span>
                            <span className="ml-2 font-medium">{record.clockOut || '--:--'}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Hours:</span>
                            <span className="ml-2 font-medium">{record.totalHours}h</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-muted-foreground">Method:</span>
                            <span className="ml-2 flex items-center">
                              {getMethodIcon(record.method)}
                              <span className="ml-1 capitalize">{record.method || 'N/A'}</span>
                            </span>
                          </div>
                        </div>
                        {record.location && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="ml-2">{record.location}</span>
                          </div>
                        )}
                        {record.notes && (
                          <div className="mt-2 text-sm">
                            <span className="text-muted-foreground">Notes:</span>
                            <span className="ml-2 italic">{record.notes}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            } else {
              return (
                <div className="text-center py-8 text-muted-foreground">
                  <XCircle className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                  <p className="font-medium">No attendance record</p>
                  <p className="text-sm">This date has no attendance data</p>
                </div>
              );
            }
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
};
