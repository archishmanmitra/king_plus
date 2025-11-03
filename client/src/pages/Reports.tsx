import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockEmployees, mockAttendance, mockLeaveRequests, mockPayrollRuns } from '@/data/mockData';
import { 
  TrendingUp, 
  Download, 
  Filter, 
  Calendar,
  Users,
  Clock,
  DollarSign,
  FileText,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';

const Reports: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState('this-month');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Tab state management
  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get('tab');
  const defaultTab = 'attendance';
  const [activeTab, setActiveTab] = useState(urlTab || defaultTab);

  // Keep active tab in sync with URL changes
  useEffect(() => {
    const nextTab = urlTab || defaultTab;
    if (nextTab !== activeTab) {
      setActiveTab(nextTab);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlTab]);

  const onTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(location.search);
    params.set('tab', tab);
    navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
  };

  const generateReport = (type: string) => {
    console.log(`Generating ${type} report`);
  };

  const exportReport = (format: string) => {
    console.log(`Exporting report as ${format}`);
  };

  const attendanceStats = {
    totalPresent: 231,
    totalAbsent: 8,
    avgHoursWorked: 8.2,
    overtimeHours: 45,
    presentRate: 96.7
  };

  const leaveStats = {
    totalRequests: 24,
    approved: 20,
    pending: 3,
    rejected: 1,
    mostUsedType: 'Vacation'
  };

  const payrollStats = {
    totalCost: 1250000,
    avgSalary: 5060,
    totalDeductions: 187500,
    taxesCollected: 156000
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Reports & Analytics</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">Comprehensive insights and data analysis</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 w-full md:w-auto">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full sm:w-auto text-sm font-semibold">
            <Filter className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Filter</span>
            <span className="sm:hidden">Filter</span>
          </Button>
          <Button className="w-full sm:w-auto text-sm font-semibold">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export All</span>
            <span className="sm:hidden">Export</span>
          </Button>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <p className="text-3xl font-bold">{mockEmployees.length}</p>
                <p className="text-sm text-success">+2.5% from last month</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Attendance Rate</p>
                <p className="text-3xl font-bold">{attendanceStats.presentRate}%</p>
                <p className="text-sm text-success">+1.2% from last month</p>
              </div>
              <Clock className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Payroll Cost</p>
                <p className="text-3xl font-bold">${(payrollStats.totalCost / 1000).toFixed(0)}K</p>
                <p className="text-sm text-warning">+5.2% from last month</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leave Utilization</p>
                <p className="text-3xl font-bold">78%</p>
                <p className="text-sm text-muted-foreground">Of annual allocation</p>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="attendance" className="text-xs sm:text-sm">Attendance</TabsTrigger>
          <TabsTrigger value="leave" className="text-xs sm:text-sm">Leave</TabsTrigger>
          <TabsTrigger value="payroll" className="text-xs sm:text-sm">Payroll</TabsTrigger>
          <TabsTrigger value="performance" className="text-xs sm:text-sm">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Attendance Overview
                </CardTitle>
                <CardDescription>Daily attendance statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-success/10 rounded-lg">
                      <div className="text-2xl font-bold text-success">{attendanceStats.totalPresent}</div>
                      <div className="text-sm text-muted-foreground">Present Today</div>
                    </div>
                    <div className="text-center p-4 bg-destructive/10 rounded-lg">
                      <div className="text-2xl font-bold text-destructive">{attendanceStats.totalAbsent}</div>
                      <div className="text-sm text-muted-foreground">Absent Today</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Average Hours Worked</span>
                      <span className="font-medium">{attendanceStats.avgHoursWorked}h</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Total Overtime Hours</span>
                      <span className="font-medium">{attendanceStats.overtimeHours}h</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Button size="sm" onClick={() => generateReport('attendance')} className="w-full sm:w-auto">
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Generate Report</span>
                    <span className="sm:hidden">Generate</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => exportReport('csv')} className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Export CSV</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Department Wise Attendance
                </CardTitle>
                <CardDescription>Attendance breakdown by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Engineering', 'HR', 'Finance', 'Marketing'].map((dept, index) => {
                    const rates = [95, 98, 92, 89];
                    return (
                      <div key={dept} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{dept}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full">
                            <div 
                              className="h-2 bg-primary rounded-full" 
                              style={{ width: `${rates[index]}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12">{rates[index]}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="leave">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Leave Statistics
                </CardTitle>
                <CardDescription>Leave requests and utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <div className="text-lg font-bold text-primary">{leaveStats.totalRequests}</div>
                      <div className="text-xs text-muted-foreground">Total Requests</div>
                    </div>
                    <div className="p-3 bg-success/10 rounded-lg">
                      <div className="text-lg font-bold text-success">{leaveStats.approved}</div>
                      <div className="text-xs text-muted-foreground">Approved</div>
                    </div>
                    <div className="p-3 bg-warning/10 rounded-lg">
                      <div className="text-lg font-bold text-warning">{leaveStats.pending}</div>
                      <div className="text-xs text-muted-foreground">Pending</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Most Used Leave Type</span>
                      <Badge variant="outline">{leaveStats.mostUsedType}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Average Leave Duration</span>
                      <span className="font-medium">3.2 days</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Button size="sm" onClick={() => generateReport('leave')} className="w-full sm:w-auto">
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Generate Report</span>
                    <span className="sm:hidden">Generate</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => exportReport('pdf')} className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Export PDF</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <LineChart className="h-5 w-5 mr-2" />
                  Leave Trends
                </CardTitle>
                <CardDescription>Monthly leave patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Vacation', 'Sick', 'Personal', 'Emergency'].map((type, index) => {
                    const counts = [12, 5, 4, 3];
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{type}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-muted rounded-full">
                            <div 
                              className="h-2 bg-primary rounded-full" 
                              style={{ width: `${(counts[index] / 12) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8">{counts[index]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payroll">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  Payroll Summary
                </CardTitle>
                <CardDescription>Financial overview and costs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="text-xl font-bold text-primary">${(payrollStats.totalCost / 1000).toFixed(0)}K</div>
                      <div className="text-sm text-muted-foreground">Total Cost</div>
                    </div>
                    <div className="text-center p-4 bg-success/10 rounded-lg">
                      <div className="text-xl font-bold text-success">${payrollStats.avgSalary}</div>
                      <div className="text-sm text-muted-foreground">Avg Salary</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total Deductions</span>
                      <span className="font-medium">${payrollStats.totalDeductions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Taxes Collected</span>
                      <span className="font-medium">${payrollStats.taxesCollected.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
                  <Button size="sm" onClick={() => generateReport('payroll')} className="w-full sm:w-auto">
                    <FileText className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Generate Report</span>
                    <span className="sm:hidden">Generate</span>
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => exportReport('excel')} className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Export Excel</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Payroll cost analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Base Salaries', amount: 850000, color: 'bg-primary' },
                    { name: 'Benefits', amount: 200000, color: 'bg-success' },
                    { name: 'Overtime', amount: 100000, color: 'bg-warning' },
                    { name: 'Bonuses', amount: 100000, color: 'bg-destructive' }
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">${(item.amount / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Performance Analytics
              </CardTitle>
              <CardDescription>Employee performance metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">4.2</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="text-center p-4 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">89%</div>
                  <div className="text-sm text-muted-foreground">Goal Completion</div>
                </div>
                <div className="text-center p-4 bg-warning/10 rounded-lg">
                  <div className="text-2xl font-bold text-warning">12</div>
                  <div className="text-sm text-muted-foreground">Reviews Due</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default Reports;