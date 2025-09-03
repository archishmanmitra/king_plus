import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProjects, mockEmployees, mockTasks } from '@/data/mockData';
import { 
  ArrowLeft, 
  FolderOpen, 
  Users, 
  Clock, 
  Calendar, 
  DollarSign, 
  Percent,
  User,
  Building2,
  Target,
  CheckCircle,
  Clock as TaskClock,
  AlertCircle
} from 'lucide-react';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const project = mockProjects.find(p => p.id === projectId);
  
  if (!project) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-muted-foreground">Project Not Found</h2>
          <p className="text-muted-foreground mt-2">The requested project could not be found.</p>
          <Button onClick={() => navigate('/projects')} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const members = project.teamMembers.map(id => mockEmployees.find(emp => emp.id === id)).filter(Boolean);
  const reportingManager = mockEmployees.find(emp => emp.id === project.reportingManager);
  const projectTasks = mockTasks.filter(task => task.projectId === projectId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'completed': return 'secondary';
      case 'planning': return 'outline';
      case 'on-hold': return 'destructive';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'in-progress': return 'text-blue-600';
      case 'review': return 'text-yellow-600';
      case 'todo': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <TaskClock className="h-4 w-4" />;
      case 'review': return <AlertCircle className="h-4 w-4" />;
      case 'todo': return <Target className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/projects')}
            className="px-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center">
              <FolderOpen className="h-8 w-8 mr-3 text-blue-600" />
              {project.name}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{project.projectCode}</Badge>
              <Badge variant="outline">{project.phaseStatus}</Badge>
              <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Budget</p>
                <p className="text-xl font-bold">{formatCurrency(project.budget)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Team Size</p>
                <p className="text-xl font-bold">{project.teamMembers.length} members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Billable Hours</p>
                <p className="text-xl font-bold">{project.billableHours}h</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Percent className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Allocation</p>
                <p className="text-xl font-bold">{project.allocationPercentage}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team Members</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{project.description}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm"><strong>Client:</strong> {project.client}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm"><strong>Manager:</strong> {project.manager}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm"><strong>Start Date:</strong> {formatDate(project.startDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm"><strong>End Date:</strong> {formatDate(project.endDate)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Billable Hours</p>
                    <p className="font-medium">{project.billableHours}h</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Non-billable Hours</p>
                    <p className="font-medium">{project.nonBillableHours}h</p>
                  </div>
                </div>

                {reportingManager && (
                  <div className="pt-3 border-t">
                    <h4 className="font-medium mb-2">Reporting Manager</h4>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={reportingManager.avatar} />
                        <AvatarFallback>
                          {reportingManager.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{reportingManager.name}</p>
                        <p className="text-sm text-muted-foreground">{reportingManager.position}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Members ({members.length})</CardTitle>
              <CardDescription>
                Project team composition and member details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <Card key={member?.id} className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member?.avatar} />
                        <AvatarFallback>
                          {member?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{member?.name}</h4>
                        <p className="text-sm text-muted-foreground">{member?.position}</p>
                        <p className="text-xs text-muted-foreground">{member?.department}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Tasks ({projectTasks.length})</CardTitle>
              <CardDescription>
                Track progress and manage project tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {projectTasks.length > 0 ? (
                <div className="space-y-3">
                  {projectTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={getTaskStatusColor(task.status)}>
                          {getTaskStatusIcon(task.status)}
                        </div>
                        <div>
                          <h4 className="font-medium">{task.name}</h4>
                          <p className="text-sm text-muted-foreground">{task.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                            <span>Assignee: {task.assignee}</span>
                            <span>Estimated: {task.estimatedHours}h</span>
                            <span>Actual: {task.actualHours}h</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {task.priority}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {task.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tasks found for this project</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>
                Key milestones and project timeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium">Project Started</h4>
                    <p className="text-sm text-muted-foreground">{formatDate(project.startDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium">Current Progress</h4>
                    <p className="text-sm text-muted-foreground">{project.progress}% completed</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
                  <div>
                    <h4 className="font-medium">Expected Completion</h4>
                    <p className="text-sm text-muted-foreground">{formatDate(project.endDate)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetail;
