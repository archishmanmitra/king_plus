import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Clock, 
  DollarSign, 
  Target, 
  Calendar, 
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  User
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const dashboardStats = [
    {
      title: "Total Employees",
      value: "247",
      change: "+12",
      changeType: "positive",
      icon: Users,
      roles: ['global_admin', 'hr_manager', 'hr_executive']
    },
    {
      title: "Present Today",
      value: "231",
      change: "93.5%",
      changeType: "positive",
      icon: CheckCircle,
      roles: ['global_admin', 'hr_manager', 'hr_executive']
    },
    {
      title: "Pending Leaves",
      value: "8",
      change: "-2",
      changeType: "positive",
      icon: Calendar,
      roles: ['global_admin', 'hr_manager', 'hr_executive']
    },
    {
      title: "This Month Payroll",
      value: "$1.2M",
      change: "+5.2%",
      changeType: "positive",
      icon: DollarSign,
      roles: ['global_admin', 'hr_manager', 'manager']
    },
    {
      title: "My Leave Balance",
      value: "18 days",
      change: "Available",
      changeType: "neutral",
      icon: Calendar,
      roles: ['employee', 'manager']
    },
    {
      title: "Hours This Week",
      value: "38.5h",
      change: "2.5h remaining",
      changeType: "neutral",
      icon: Clock,
      roles: ['employee', 'manager']
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'leave',
      message: 'Sarah Johnson applied for vacation leave',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'attendance',
      message: 'Michael Chen clocked in at 9:15 AM',
      time: '3 hours ago',
      status: 'info'
    },
    {
      id: 3,
      type: 'payroll',
      message: 'January payroll processed successfully',
      time: '1 day ago',
      status: 'success'
    },
    {
      id: 4,
      type: 'performance',
      message: 'Q4 performance reviews due next week',
      time: '2 days ago',
      status: 'warning'
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: 'Complete performance review',
      dueDate: 'Due in 3 days',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Submit expense reports',
      dueDate: 'Due tomorrow',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Team meeting preparation',
      dueDate: 'Due today',
      priority: 'low'
    }
  ];

  const filteredStats = dashboardStats.filter(stat => 
    !stat.roles || (user && stat.roles.includes(user.role))
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Good morning, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening in your organization today.
          </p>
        </div>
        <div className="flex space-x-2">
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="outline">
            <TrendingUp className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredStats.map((stat, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className={`text-xs ${
                stat.changeType === 'positive' ? 'text-success' : 
                stat.changeType === 'negative' ? 'text-destructive' : 
                'text-muted-foreground'
              }`}>
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest updates from across the organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-success' :
                  activity.status === 'warning' ? 'bg-warning' :
                  activity.status === 'pending' ? 'bg-primary' :
                  'bg-muted-foreground'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
                <Badge variant={
                  activity.status === 'success' ? 'default' :
                  activity.status === 'warning' ? 'secondary' :
                  activity.status === 'pending' ? 'outline' :
                  'secondary'
                }>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Upcoming Tasks
            </CardTitle>
            <CardDescription>
              Your pending actions and deadlines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {task.dueDate}
                  </p>
                </div>
                <Badge variant={
                  task.priority === 'high' ? 'destructive' :
                  task.priority === 'medium' ? 'default' :
                  'secondary'
                }>
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Employees and Managers */}
      {(user?.role === 'employee' || user?.role === 'manager') && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              {user?.role === 'manager' ? 'Common tasks for you and your team' : 'Common tasks you can perform'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Apply Leave</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Clock className="h-6 w-6" />
                <span className="text-sm">Clock In/Out</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Submit Expense</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col space-y-2">
                <Target className="h-6 w-6" />
                <span className="text-sm">Update Goals</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;