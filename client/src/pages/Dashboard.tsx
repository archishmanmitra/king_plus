import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
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
  User,
  Loader2,
} from "lucide-react";
import { getDashboardStats, DashboardStats } from "@/api/dashboard";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const dashboardStats = await getDashboardStats(user?.employeeId);
        setStats(dashboardStats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Set default values on error
        setStats({
          totalEmployees: 0,
          presentToday: 0,
          pendingLeaves: 0,
          monthlyPayroll: 0,
          myLeaveBalance: 0,
          hoursThisWeek: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.employeeId]);

  const dashboardStats = [
    {
      title: "Total Employees",
      value: loading ? "..." : (stats?.totalEmployees || 0).toString(),
      change: stats?.totalEmployees ? "Active" : "N/A",
      changeType: stats?.totalEmployees ? "positive" : "neutral",
      icon: Users,
      roles: ["global_admin", "hr_manager"],
    },
    {
      title: "Present Today",
      value: loading ? "..." : (stats?.presentToday || 0).toString(),
      change: stats?.presentToday ? `${Math.round((stats.presentToday / (stats.totalEmployees || 1)) * 100)}%` : "N/A",
      changeType: stats?.presentToday ? "positive" : "neutral",
      icon: CheckCircle,
      roles: ["global_admin", "hr_manager"],
    },
    {
      title: "Pending Leaves",
      value: loading ? "..." : (stats?.pendingLeaves || 0).toString(),
      change: stats?.pendingLeaves ? "Awaiting approval" : "None",
      changeType: stats?.pendingLeaves ? "neutral" : "positive",
      icon: Calendar,
      roles: ["global_admin", "hr_manager"],
    },
    {
      title: "This Month Payroll",
      value: loading ? "..." : (stats?.monthlyPayroll ? `$${(stats.monthlyPayroll / 1000000).toFixed(1)}M` : "N/A"),
      change: stats?.monthlyPayroll ? "Processed" : "Not available",
      changeType: stats?.monthlyPayroll ? "positive" : "neutral",
      icon: DollarSign,
      roles: ["global_admin", "hr_manager", "manager"],
    },
    {
      title: "My Leave Balance",
      value: loading ? "..." : (stats?.myLeaveBalance ? `${stats.myLeaveBalance} days` : "N/A"),
      change: stats?.myLeaveBalance ? "Available" : "Not available",
      changeType: stats?.myLeaveBalance ? "neutral" : "neutral",
      icon: Calendar,
      roles: ["employee", "manager"],
    },
    {
      title: "Hours This Week",
      value: loading ? "..." : (stats?.hoursThisWeek ? `${stats.hoursThisWeek}h` : "N/A"),
      change: stats?.hoursThisWeek ? `${40 - stats.hoursThisWeek}h remaining` : "Not tracked",
      changeType: stats?.hoursThisWeek ? "neutral" : "neutral",
      icon: Clock,
      roles: ["employee", "manager"],
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: "info",
      message: "No recent activities available",
      time: "N/A",
      status: "info",
    },
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "No upcoming tasks",
      dueDate: "N/A",
      priority: "low",
    },
  ];

  const filteredStats = dashboardStats.filter(
    (stat) => !stat.roles || (user && stat.roles.includes(user.role))
  );

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col space-y-6 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Welcome back, <span className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">{user?.name}</span>!
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mt-2 font-medium">
            Here's what's happening in your organization today.
          </p>
        </div>
        <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
          <Button className="btn-premium w-full sm:w-auto text-sm font-semibold">
            <FileText className="h-4 w-4 mr-2 " />
            <span className="hidden sm:inline text-white">Generate Report</span>
            <span className="sm:hidden">Report</span>
          </Button>
          <Button variant="outline" className="w-full sm:w-auto text-sm font-semibold hover:bg-muted/50 transition-colors">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">View Analytics</span>
            <span className="sm:hidden">Analytics</span>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {filteredStats.map((stat, index) => (
          <Card
            key={index}
            className="card-premium group animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground tracking-wide">
                {stat.title}
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-200">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight flex items-center">
                {loading && stat.value === "..." ? (
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                ) : null}
                {stat.value}
              </div>
              <p
                className={`text-sm font-medium ${
                  stat.changeType === "positive"
                    ? "text-success"
                    : stat.changeType === "negative"
                    ? "text-destructive"
                    : "text-muted-foreground"
                }`}
              >
                {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Activities */}
        <Card className="card-premium animate-slide-up" style={{ animationDelay: '400ms' }}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 mr-3">
                <AlertCircle className="h-5 w-5 text-primary" />
              </div>
              Recent Activities
            </CardTitle>
            <CardDescription className="text-sm font-medium text-muted-foreground">
              Latest updates from across the organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-xl hover:bg-muted/30 transition-all duration-200 group"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 shadow-sm ${
                    activity.status === "success"
                      ? "bg-success shadow-success/30"
                      : activity.status === "warning"
                      ? "bg-warning shadow-warning/30"
                      : activity.status === "pending"
                      ? "bg-primary shadow-primary/30"
                      : "bg-muted-foreground"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {activity.time}
                  </p>
                </div>
                <Badge
                  variant={
                    activity.status === "success"
                      ? "default"
                      : activity.status === "warning"
                      ? "secondary"
                      : activity.status === "pending"
                      ? "outline"
                      : "secondary"
                  }
                  className="text-xs flex-shrink-0 font-medium"
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="card-premium animate-slide-up" style={{ animationDelay: '500ms' }}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 mr-3">
                <Target className="h-5 w-5 text-primary" />
              </div>
              Upcoming Tasks
            </CardTitle>
            <CardDescription className="text-sm font-medium text-muted-foreground">
              Your pending actions and deadlines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-all duration-200 group"
              >
                <div className="flex-1 min-w-0 pr-3">
                  <p className="text-sm font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    {task.dueDate}
                  </p>
                </div>
                <Badge
                  variant={
                    task.priority === "high"
                      ? "destructive"
                      : task.priority === "medium"
                      ? "default"
                      : "secondary"
                  }
                  className="text-xs flex-shrink-0 font-medium"
                >
                  {task.priority}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions for Employees and Managers */}
      {(user?.role === "employee" || user?.role === "manager") && (
        <Card className="card-premium animate-slide-up" style={{ animationDelay: '600ms' }}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg font-semibold">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 mr-3">
                <User className="h-5 w-5 text-primary" />
              </div>
              Quick Actions
            </CardTitle>
            <CardDescription className="text-sm font-medium text-muted-foreground">
              {user?.role === "manager"
                ? "Common tasks for you and your team"
                : "Common tasks you can perform"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <Button
                variant="outline"
                className="h-20 md:h-24 flex flex-col space-y-2 p-4 hover:bg-muted/50 transition-all duration-200 group border-border/50"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-200">
                  <Calendar className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <span className="text-xs md:text-sm text-center leading-tight font-semibold">
                  Apply Leave
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-20 md:h-24 flex flex-col space-y-2 p-4 hover:bg-muted/50 transition-all duration-200 group border-border/50"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-200">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <span className="text-xs md:text-sm text-center leading-tight font-semibold">
                  Clock In/Out
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-20 md:h-24 flex flex-col space-y-2 p-4 hover:bg-muted/50 transition-all duration-200 group border-border/50"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-200">
                  <FileText className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <span className="text-xs md:text-sm text-center leading-tight font-semibold">
                  Submit Expense
                </span>
              </Button>
              <Button
                variant="outline"
                className="h-20 md:h-24 flex flex-col space-y-2 p-4 hover:bg-muted/50 transition-all duration-200 group border-border/50"
              >
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-200">
                  <Target className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                </div>
                <span className="text-xs md:text-sm text-center leading-tight font-semibold">
                  Update Goals
                </span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
