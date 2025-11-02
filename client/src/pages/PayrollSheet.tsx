import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, FileText, RefreshCw } from 'lucide-react';
import AttendanceSheetPayroll from '@/components/attendance/AttendanceSheetPayroll';
import PayslipView from '@/components/payroll/PayslipView';
import { useAuth } from '@/contexts/AuthContext';

const PayrollSheet: React.FC = () => {
  const { user } = useAuth();
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [refreshKey, setRefreshKey] = useState(0);

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!user?.employeeId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardContent className="p-6">
            <p className="text-muted-foreground">No employee record found for this user.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payroll & Attendance</h1>
          <p className="text-muted-foreground">View your attendance sheet and payslip</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedMonth.toString()} onValueChange={(v) => setSelectedMonth(parseInt(v))}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(parseInt(v))}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-semibold text-blue-900">Payroll Cycle Information</div>
              <div className="text-sm text-blue-700 mt-1">
                Our payroll cycle runs from the <strong>22nd of the previous month to the 21st of the current month</strong>.
                Your attendance and salary are calculated based on this cycle.
              </div>
              <div className="text-xs text-blue-600 mt-2">
                • Absences without approved leave will result in 1.5 days salary deduction per absent day<br/>
                • Working days exclude Sundays
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Attendance Sheet
          </TabsTrigger>
          <TabsTrigger value="payslip" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Payslip
          </TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" key={`attendance-${refreshKey}`}>
          <AttendanceSheetPayroll
            employeeId={user.employeeId}
            month={selectedMonth}
            year={selectedYear}
          />
        </TabsContent>

        <TabsContent value="payslip" key={`payslip-${refreshKey}`}>
          <PayslipView
            employeeId={user.employeeId}
            month={selectedMonth}
            year={selectedYear}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PayrollSheet;

