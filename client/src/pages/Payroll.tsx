import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockPayrollRuns, mockEmployees } from '@/data/mockData';
import { DollarSign, Play, Download, FileText, Calculator, Clock } from 'lucide-react';

const Payroll: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Tab state management
  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get('tab');
  const defaultTab = 'wizard';
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

  const payrollSteps = [
    { id: 1, title: 'Attendance Review', completed: true },
    { id: 2, title: 'Salary Calculation', completed: true },
    { id: 3, title: 'Deductions & Benefits', completed: false },
    { id: 4, title: 'Tax Calculations', completed: false },
    { id: 5, title: 'Final Review', completed: false },
    { id: 6, title: 'Process Payment', completed: false }
  ];

  const payrollSummary = {
    totalEmployees: 247,
    totalGrossPay: 1250000,
    totalDeductions: 187500,
    totalNetPay: 1062500,
    taxDeducted: 156000
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Payroll Management</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">Process and manage employee payroll</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button variant="outline" className="w-full sm:w-auto text-sm font-semibold">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export Reports</span>
            <span className="sm:hidden">Export</span>
          </Button>
          <Button className="w-full sm:w-auto text-sm font-semibold">
            <Play className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Run Payroll</span>
            <span className="sm:hidden">Run</span>
          </Button>
        </div>
      </div>

      {/* Payroll Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Gross Pay</div>
                <div className="text-xl font-bold">${(payrollSummary.totalGrossPay / 1000).toFixed(0)}K</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-warning" />
              <div>
                <div className="text-sm text-muted-foreground">Deductions</div>
                <div className="text-xl font-bold">${(payrollSummary.totalDeductions / 1000).toFixed(0)}K</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-destructive" />
              <div>
                <div className="text-sm text-muted-foreground">Tax Deducted</div>
                <div className="text-xl font-bold">${(payrollSummary.taxDeducted / 1000).toFixed(0)}K</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-success" />
              <div>
                <div className="text-sm text-muted-foreground">Net Pay</div>
                <div className="text-xl font-bold">${(payrollSummary.totalNetPay / 1000).toFixed(0)}K</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Employees</div>
                <div className="text-xl font-bold">{payrollSummary.totalEmployees}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="wizard" className="text-xs sm:text-sm">Payroll Wizard</TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm">Payroll History</TabsTrigger>
          <TabsTrigger value="preview" className="text-xs sm:text-sm">Preview & Approve</TabsTrigger>
        </TabsList>

        <TabsContent value="wizard">
          <Card>
            <CardHeader>
              <CardTitle>Guided Payroll Processing</CardTitle>
              <CardDescription>
                Follow the step-by-step process to run payroll for this month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round((payrollSteps.filter(s => s.completed).length / payrollSteps.length) * 100)}%</span>
                </div>
                <Progress value={(payrollSteps.filter(s => s.completed).length / payrollSteps.length) * 100} />
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {payrollSteps.map((step) => (
                  <div 
                    key={step.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border ${
                      step.completed ? 'bg-success/10 border-success/20' : 
                      step.id === currentStep ? 'bg-primary/10 border-primary/20' : 
                      'bg-muted/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step.completed ? 'bg-success text-success-foreground' :
                        step.id === currentStep ? 'bg-primary text-primary-foreground' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {step.completed ? '✓' : step.id}
                      </div>
                      <div>
                        <div className="font-medium">{step.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {step.completed ? 'Completed' : 
                           step.id === currentStep ? 'In Progress' : 'Pending'}
                        </div>
                      </div>
                    </div>
                    {step.id === currentStep && (
                      <Button size="sm">
                        Continue
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Button 
                  onClick={() => setCurrentStep(Math.min(currentStep + 1, payrollSteps.length))}
                  disabled={currentStep === payrollSteps.length}
                  className="w-full sm:w-auto"
                >
                  Next Step
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(currentStep - 1, 1))}
                  disabled={currentStep === 1}
                  className="w-full sm:w-auto"
                >
                  Previous Step
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>
                Previous payroll runs and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Period</TableHead>
                      <TableHead className="min-w-[80px]">Employees</TableHead>
                      <TableHead className="min-w-[120px]">Total Amount</TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="min-w-[120px] hidden lg:table-cell">Processed By</TableHead>
                      <TableHead className="min-w-[100px] hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-right min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                  {mockPayrollRuns.map((run) => (
                    <TableRow key={run.id}>
                      <TableCell className="font-medium">
                        {run.month} {run.year}
                      </TableCell>
                      <TableCell>{run.totalEmployees}</TableCell>
                      <TableCell>${run.totalAmount.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={
                          run.status === 'completed' ? 'default' :
                          run.status === 'paid' ? 'secondary' :
                          run.status === 'processing' ? 'outline' :
                          'destructive'
                        }>
                          {run.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">{run.processedBy}</TableCell>
                      <TableCell className="hidden md:table-cell">{new Date(run.createdDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 justify-end">
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Payroll Preview</CardTitle>
              <CardDescription>
                Review and approve payroll before processing payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-primary/10 rounded-lg">
                    <div className="text-2xl font-bold text-primary">{payrollSummary.totalEmployees}</div>
                    <div className="text-sm text-muted-foreground">Total Employees</div>
                  </div>
                  <div className="text-center p-4 bg-success/10 rounded-lg">
                    <div className="text-2xl font-bold text-success">${payrollSummary.totalNetPay.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Net Pay</div>
                  </div>
                  <div className="text-center p-4 bg-warning/10 rounded-lg">
                    <div className="text-2xl font-bold text-warning">${payrollSummary.taxDeducted.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Total Tax Deducted</div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <Button className="bg-success hover:bg-success/90 w-full sm:w-auto">
                    <span className="hidden sm:inline">Approve & Process Payroll</span>
                    <span className="sm:hidden">Approve & Process</span>
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto">
                    <span className="hidden sm:inline">Generate Preview Report</span>
                    <span className="sm:hidden">Generate Report</span>
                  </Button>
                  <Button variant="destructive" className="w-full sm:w-auto">
                    Cancel Payroll Run
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payroll;