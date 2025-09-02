import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockPayrollRuns, mockEmployees } from '@/data/mockData';
import { DollarSign, Play, Download, FileText, Calculator, Clock } from 'lucide-react';

const Payroll: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payroll Management</h1>
          <p className="text-muted-foreground">Process and manage employee payroll</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Reports
          </Button>
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Run Payroll
          </Button>
        </div>
      </div>

      {/* Payroll Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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

      <Tabs defaultValue="wizard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="wizard">Payroll Wizard</TabsTrigger>
          <TabsTrigger value="history">Payroll History</TabsTrigger>
          <TabsTrigger value="preview">Preview & Approve</TabsTrigger>
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

              <div className="flex space-x-4">
                <Button 
                  onClick={() => setCurrentStep(Math.min(currentStep + 1, payrollSteps.length))}
                  disabled={currentStep === payrollSteps.length}
                >
                  Next Step
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentStep(Math.max(currentStep - 1, 1))}
                  disabled={currentStep === 1}
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Employees</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Processed By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
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
                      <TableCell>{run.processedBy}</TableCell>
                      <TableCell>{new Date(run.createdDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex space-x-2 justify-end">
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

                <div className="flex space-x-4">
                  <Button className="bg-success hover:bg-success/90">
                    Approve & Process Payroll
                  </Button>
                  <Button variant="outline">
                    Generate Preview Report
                  </Button>
                  <Button variant="destructive">
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