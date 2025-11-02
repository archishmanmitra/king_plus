import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Download, Clock, CheckCircle, XCircle, Coffee } from 'lucide-react';

interface AttendanceSheetProps {
  employeeId: string;
  month: number;
  year: number;
}

interface AttendanceDayRecord {
  date: string;
  status: 'present' | 'absent' | 'leave';
  clockIn: string | null;
  clockOut: string | null;
  totalHours: number;
  isOnLeave: boolean;
}

interface AttendanceSheetData {
  employee: {
    id: string;
    employeeId: string;
    name: string;
    designation: string;
    basicSalary: number;
  };
  cycle: {
    start: string;
    end: string;
    month: number;
    year: number;
  };
  summary: {
    totalWorkingDays: number;
    presentDays: number;
    absentDays: number;
    leaveDays: number;
  };
  attendanceSheet: AttendanceDayRecord[];
}

const AttendanceSheetPayroll: React.FC<AttendanceSheetProps> = ({ employeeId, month, year }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AttendanceSheetData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendanceSheet();
  }, [employeeId, month, year]);

  const fetchAttendanceSheet = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5001/api/payroll/attendance-sheet/${employeeId}?month=${month}&year=${year}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch attendance sheet');
      }

      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '-';
    const time = new Date(timeString);
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'present':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Present</Badge>;
      case 'absent':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Absent</Badge>;
      case 'leave':
        return <Badge variant="secondary"><Coffee className="h-3 w-3 mr-1" />On Leave</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const calculateAbsenceDeduction = () => {
    if (!data) return 0;
    const perDaySalary = data.employee.basicSalary / 30;
    return data.summary.absentDays * perDaySalary * 1.5;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-destructive">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Attendance Sheet - Payroll Cycle
              </CardTitle>
              <CardDescription>
                {formatDate(data.cycle.start)} to {formatDate(data.cycle.end)}
              </CardDescription>
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Employee Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Employee ID</div>
              <div className="font-medium">{data.employee.employeeId}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Name</div>
              <div className="font-medium">{data.employee.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Designation</div>
              <div className="font-medium">{data.employee.designation || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Basic Salary</div>
              <div className="font-medium">₹{data.employee.basicSalary.toFixed(2)}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Working Days</div>
            <div className="text-2xl font-bold">{data.summary.totalWorkingDays}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Present Days</div>
            <div className="text-2xl font-bold text-green-600">{data.summary.presentDays}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Absent Days</div>
            <div className="text-2xl font-bold text-red-600">{data.summary.absentDays}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Leave Days</div>
            <div className="text-2xl font-bold text-blue-600">{data.summary.leaveDays}</div>
          </CardContent>
        </Card>
      </div>

      {/* Absence Deduction Warning */}
      {data.summary.absentDays > 0 && (
        <Card className="border-destructive">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <XCircle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <div className="font-semibold text-destructive">Absence Deduction</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {data.summary.absentDays} absent day(s) × 1.5 days salary = ₹{calculateAbsenceDeduction().toFixed(2)} will be deducted
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Per day salary: ₹{(data.employee.basicSalary / 30).toFixed(2)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Attendance Records</CardTitle>
          <CardDescription>
            Complete attendance log for the payroll cycle
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Clock In</TableHead>
                <TableHead>Clock Out</TableHead>
                <TableHead>Total Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.attendanceSheet.map((record, index) => {
                const date = new Date(record.date);
                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                
                return (
                  <TableRow key={index} className={record.status === 'absent' ? 'bg-red-50' : ''}>
                    <TableCell className="font-medium">{formatDate(record.date)}</TableCell>
                    <TableCell>{dayName}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>{formatTime(record.clockIn)}</TableCell>
                    <TableCell>{formatTime(record.clockOut)}</TableCell>
                    <TableCell>
                      {record.totalHours > 0 ? (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {record.totalHours.toFixed(2)}h
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceSheetPayroll;

