import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockLeaveRequests } from '@/data/mockData';
import { Calendar as CalendarIcon, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';

const Leave: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [leaveType, setLeaveType] = useState('');
  const [reason, setReason] = useState('');

  const leaveBalance = {
    sick: 12,
    vacation: 18,
    personal: 8,
    total: 38
  };

  const submitLeaveRequest = () => {
    console.log('Leave request submitted');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leave Management</h1>
          <p className="text-muted-foreground">Manage your leave requests and balance</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Apply for Leave
        </Button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{leaveBalance.total}</div>
            <p className="text-sm text-muted-foreground">days available</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vacation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{leaveBalance.vacation}</div>
            <p className="text-sm text-muted-foreground">days left</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sick Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{leaveBalance.sick}</div>
            <p className="text-sm text-muted-foreground">days left</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Personal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{leaveBalance.personal}</div>
            <p className="text-sm text-muted-foreground">days left</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="apply" className="space-y-4">
        <TabsList>
          <TabsTrigger value="apply">Apply for Leave</TabsTrigger>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="team">Team Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="apply">
          <Card>
            <CardHeader>
              <CardTitle>Apply for Leave</CardTitle>
              <CardDescription>
                Submit a new leave request for approval
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="leave-type">Leave Type</Label>
                  <Select value={leaveType} onValueChange={setLeaveType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select leave type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vacation">Vacation Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="personal">Personal Leave</SelectItem>
                      <SelectItem value="emergency">Emergency Leave</SelectItem>
                      <SelectItem value="maternity">Maternity Leave</SelectItem>
                      <SelectItem value="paternity">Paternity Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  id="reason"
                  placeholder="Please provide a reason for your leave request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <Button onClick={submitLeaveRequest} className="w-full md:w-auto">
                Submit Leave Request
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>My Leave Requests</CardTitle>
              <CardDescription>
                Track the status of your leave applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLeaveRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        request.status === 'approved' ? 'bg-success' :
                        request.status === 'rejected' ? 'bg-destructive' :
                        'bg-warning'
                      }`} />
                      <div>
                        <div className="font-medium capitalize">{request.type} Leave</div>
                        <div className="text-sm text-muted-foreground">
                          {request.startDate} to {request.endDate} ({request.days} days)
                        </div>
                        <div className="text-sm text-muted-foreground">{request.reason}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant={
                        request.status === 'approved' ? 'default' :
                        request.status === 'rejected' ? 'destructive' :
                        'secondary'
                      }>
                        {request.status}
                      </Badge>
                      <div className="text-right text-sm text-muted-foreground">
                        Applied: {request.appliedDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Team Leave Requests</CardTitle>
              <CardDescription>
                Pending leave requests requiring your approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockLeaveRequests.filter(r => r.status === 'pending').map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                        {request.employeeName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium">{request.employeeName}</div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {request.type} Leave - {request.days} days
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {request.startDate} to {request.endDate}
                        </div>
                        <div className="text-sm text-foreground mt-1">{request.reason}</div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="bg-success hover:bg-success/90">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button size="sm" variant="destructive">
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leave;