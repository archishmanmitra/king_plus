import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProjects, mockEmployees, mockTasks } from '@/data/mockData';
import KanbanTaskBoard from '@/components/tasks/KanbanTaskBoard';
import { Task } from '@/types/projects';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  FolderOpen, 
  Users, 
  Clock, 
  Calendar, 
  DollarSign, 
  Percent,
  User,
  Building2
} from 'lucide-react';

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);

  const project = mockProjects.find(p => p.id === projectId);

  useEffect(() => {
    if (projectId) {
      const initialTasks = mockTasks.filter(task => task.projectId === projectId);
      setTasks(initialTasks);
    }
  }, [projectId]);
  
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

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    toast({
      title: "Task Updated",
      description: "Task status has been updated successfully.",
    });
  };

  const handleTaskCreate = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    setTasks(prevTasks => [...prevTasks, newTask]);
    toast({
      title: "Task Created",
      description: "New task has been created successfully.",
    });
  };

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
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
        <div className="flex items-start space-x-3 md:space-x-4 min-w-0 flex-1">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/projects')}
            className="px-2 flex-shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to projects</span>
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground flex items-center tracking-tight">
              <FolderOpen className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 mr-2 sm:mr-3 text-blue-600 flex-shrink-0" />
              <span className="truncate">{project.name}</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs sm:text-sm">{project.projectCode}</Badge>
              <Badge variant="outline" className="text-xs sm:text-sm">{project.phaseStatus}</Badge>
              <Badge variant={getStatusColor(project.status)} className="text-xs sm:text-sm">{project.status}</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
        <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="team" className="text-xs sm:text-sm">
            <span className="hidden sm:inline">Team Members</span>
            <span className="sm:hidden">Team</span>
          </TabsTrigger>
          <TabsTrigger value="tasks" className="text-xs sm:text-sm">Tasks</TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs sm:text-sm">Timeline</TabsTrigger>
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
                    <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs sm:text-sm"><strong>Client:</strong> <span className="break-words">{project.client}</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs sm:text-sm"><strong>Manager:</strong> <span className="break-words">{project.manager}</span></span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs sm:text-sm"><strong>Start Date:</strong> {formatDate(project.startDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs sm:text-sm"><strong>End Date:</strong> {formatDate(project.endDate)}</span>
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
                
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {members.map((member) => (
                  <Card key={member?.id} className="p-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
                        <AvatarImage src={member?.avatar} />
                        <AvatarFallback>
                          {member?.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm sm:text-base truncate">{member?.name}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{member?.position}</p>
                        <p className="text-xs text-muted-foreground truncate">{member?.department}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-4">
          <div>
            <CardHeader className="px-0 pb-4">
              <CardTitle>Project Tasks ({tasks.length})</CardTitle>
              <CardDescription>
                Drag and drop tasks between columns to update their status
              </CardDescription>
            </CardHeader>
            <KanbanTaskBoard
              tasks={tasks}
              projectId={projectId!}
              onTaskUpdate={handleTaskUpdate}
              onTaskCreate={handleTaskCreate}
            />
          </div>
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
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 border rounded-lg">
                  <div className="h-3 w-3 bg-green-500 rounded-full flex-shrink-0 mt-1.5"></div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm sm:text-base">Project Started</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{formatDate(project.startDate)}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 border rounded-lg">
                  <div className="h-3 w-3 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm sm:text-base">Current Progress</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{project.progress}% completed</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 sm:space-x-4 p-3 border rounded-lg">
                  <div className="h-3 w-3 bg-gray-400 rounded-full flex-shrink-0 mt-1.5"></div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm sm:text-base">Expected Completion</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{formatDate(project.endDate)}</p>
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
