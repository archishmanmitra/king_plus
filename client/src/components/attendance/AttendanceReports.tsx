import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, Users, CheckCircle, Clock, ChevronLeft, ChevronRight, CalendarIcon } from 'lucide-react';

import { AttendanceRecord } from '@/types/attendance';

interface AttendanceReportsProps {
  attendanceData: AttendanceRecord[];
  employees: Array<{
    id: string;
    employeeId: string;
    name: string;
    department: string;
  }>;
}

interface DailyStats {
  date: string;
  present: number;
  absent: number;
  late: number;
  halfDay: number;
  onLeave: number;
  total: number;
}

export const AttendanceReports: React.FC<AttendanceReportsProps> = ({
  attendanceData,
  employees
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date(2024, 8, 1)); // September 2024
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get unique departments for filtering
  const departments = ['all', ...Array.from(new Set(employees.map(emp => emp.department)))];
  const statuses = ['all', 'present', 'absent', 'late', 'half-day'];

  // Calculate daily statistics for all employees
  const getDailyStats = (): DailyStats[] => {
    const statsMap = new Map<string, DailyStats>();
    
    // Initialize all dates in the current month
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      statsMap.set(date, {
        date,
        present: 0,
        absent: 0,
        late: 0,
        halfDay: 0,
        onLeave: 0,
        total: employees.length
      });
    }

    // Count attendance for each date
    attendanceData.forEach(record => {
      const stats = statsMap.get(record.date);
      if (stats) {
        switch (record.status) {
          case 'present':
            stats.present++;
            break;
          case 'absent':
            stats.absent++;
            break;
          case 'late':
            stats.late++;
            break;
          case 'half-day':
            stats.halfDay++;
            break;
        }
      }
    });

    // Calculate absent (including weekends and holidays)
    statsMap.forEach(stats => {
      const date = new Date(stats.date);
      const dayOfWeek = date.getDay();
      
      // If it's a weekend (Saturday = 6, Sunday = 0)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        stats.absent = stats.total;
        stats.present = 0;
        stats.late = 0;
        stats.halfDay = 0;
      } else {
        // For weekdays, calculate absent as total - present - late - halfDay
        stats.absent = stats.total - stats.present - stats.late - stats.halfDay;
      }
    });

    return Array.from(statsMap.values()).sort((a, b) => a.date.localeCompare(b.date));
  };

  // Filter attendance data based on filters
  const filteredAttendance = attendanceData.filter(record => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const employee = employees.find(emp => emp.employeeId === record.employeeId);
      if (!employee?.name.toLowerCase().includes(searchLower) &&
          !record.employeeId.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    if (departmentFilter !== 'all') {
      const employee = employees.find(emp => emp.employeeId === record.employeeId);
      if (employee?.department !== departmentFilter) {
        return false;
      }
    }

    if (statusFilter !== 'all' && record.status !== statusFilter) {
      return false;
    }

    return true;
  });

  // Calculate statistics
  const totalEmployees = employees.length;
  const presentCount = filteredAttendance.filter(r => r.status === 'present').length;
  const absentCount = totalEmployees - presentCount;
  const lateCount = filteredAttendance.filter(r => r.status === 'late').length;
  const halfDayCount = filteredAttendance.filter(r => r.status === 'half-day').length;
  const attendanceRate = totalEmployees > 0 ? Math.round((presentCount / totalEmployees) * 100) : 0;

  // Get month details for calendar
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

  const monthDays = getMonthDetails(currentMonth);
  const dailyStats = getDailyStats();

  // Get stats for a specific date
  const getStatsForDate = (date: Date): DailyStats | null => {
    const dateString = date.toISOString().split('T')[0];
    return dailyStats.find(stats => stats.date === dateString) || null;
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <div>
        <h2 className="text-2xl font-bold">Attendance Reports</h2>
        <p className="text-muted-foreground">
          View and filter employee attendance records
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{totalEmployees}</div>
            <div className="text-sm text-muted-foreground">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{presentCount}</div>
            <div className="text-sm text-muted-foreground">Present</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-destructive">{absentCount}</div>
            <div className="text-sm text-muted-foreground">Absent</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{attendanceRate}%</div>
            <div className="text-sm text-muted-foreground">Rate</div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Attendance Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="h-6 w-6 mr-3" />
              Daily Attendance Overview
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
                const stats = getStatsForDate(date);
                
                let dayClass = "p-3 text-center border rounded-lg cursor-pointer transition-colors hover:bg-muted/50";
                
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
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className={`text-sm font-medium ${!isCurrentMonth ? 'text-muted-foreground' : ''}`}>
                      {date.getDate()}
                    </div>
                                         {stats && isCurrentMonth && stats.total > 0 && (
                       <div className="space-y-1 mt-2">
                         {stats.present > 0 && (
                           <div className="text-xs bg-green-500 text-white px-1 py-0.5 rounded">
                             {stats.present} Present
                           </div>
                         )}
                         {stats.late > 0 && (
                           <div className="text-xs bg-yellow-500 text-white px-1 py-0.5 rounded">
                             {stats.late} Late
                           </div>
                         )}
                         {stats.halfDay > 0 && (
                           <div className="text-xs bg-purple-500 text-white px-1 py-0.5 rounded">
                             {stats.halfDay} Half
                           </div>
                         )}
                         {stats.absent > 0 && (
                           <div className="text-xs bg-red-500 text-white px-1 py-0.5 rounded">
                             {stats.absent} Absent
                           </div>
                         )}
                       </div>
                     )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details */}
          {selectedDate && (() => {
            const stats = getStatsForDate(selectedDate);
            if (stats) {
              return (
                <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                  <h3 className="font-semibold mb-3">Attendance Summary for {selectedDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">{stats.present}</div>
                      <div className="text-sm text-green-600">Present</div>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-700">{stats.absent}</div>
                      <div className="text-sm text-red-600">Absent</div>
                    </div>
                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-700">{stats.late}</div>
                      <div className="text-sm text-yellow-600">Late</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-700">{stats.halfDay}</div>
                      <div className="text-sm text-purple-600">Half Day</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">{stats.total}</div>
                      <div className="text-sm text-blue-600">Total</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <div className="text-lg font-semibold text-primary">
                      Attendance Rate: {stats.total > 0 ? Math.round(((stats.present + stats.late + stats.halfDay) / stats.total) * 100) : 0}%
                    </div>
                  </div>
                </div>
              );
            } else {
              return (
                <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No attendance data for this date</p>
                  </div>
                </div>
              );
            }
          })()}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Employee</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Employee Attendance</CardTitle>
            <span className="text-sm text-muted-foreground">
              {filteredAttendance.length} of {totalEmployees} employees
            </span>
          </div>
        </CardHeader>
        <CardContent>
          {filteredAttendance.length > 0 ? (
            <div className="space-y-3">
              {filteredAttendance.map((record) => {
                const employee = employees.find(emp => emp.employeeId === record.employeeId);
                return (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {employee?.name ? employee.name.split(' ').map(n => n[0]).join('') : '--'}
                      </div>
                      <div>
                        <div className="font-medium">{employee?.name || 'Unknown Employee'}</div>
                        <div className="text-sm text-muted-foreground">
                          {record.employeeId} • {employee?.department || 'Unknown Department'}
                        </div>
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
                      <div className="text-right">
                        <div className="font-medium">{record.totalHours}h</div>
                        <div className="text-sm text-muted-foreground">Hours</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={
                          record.status === 'present' ? 'default' :
                          record.status === 'absent' ? 'destructive' :
                          record.status === 'late' ? 'secondary' :
                          'outline'
                        }>
                          {record.status}
                        </Badge>
                        {record.method === 'biometric' && <CheckCircle className="h-4 w-4 text-success" />}
                        {record.method === 'geo' && <Clock className="h-4 w-4 text-primary" />}
                        {record.method === 'selfie' && <Users className="h-4 w-4 text-warning" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
              <p>No attendance records found for the selected criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
