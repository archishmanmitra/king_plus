import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockProjects, mockTasks, mockEmployees } from '@/data/mockData';
import { FolderOpen, Plus, Users, Clock, Calendar, DollarSign, Eye } from 'lucide-react';
import NewProjectModal from '@/components/modals/NewProjectModal';
import { useAuth } from '@/contexts/AuthContext';

const Projects: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Tab state management
  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get('tab');
  const defaultTab = 'all';
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

  const handleNewProject = (projectData: any) => {
    // Here you would typically send the data to your backend
    console.log('New project data:', projectData);
    // For now, we'll just close the modal
    setIsNewProjectModalOpen(false);
  };

  const getProjectMembers = (memberIds: string[]) => {
    return memberIds.map(id => mockEmployees.find(emp => emp.id === id)).filter(Boolean);
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

  // Filter projects based on active tab
  const filteredProjects = useMemo(() => {
    switch (activeTab) {
      case 'my-projects':
        // Filter projects where user is a team member (simplified check)
        return mockProjects.filter(project => 
          project.teamMembers.includes(user?.employeeId || '')
        );
      case 'active':
        return mockProjects.filter(project => project.status === 'active');
      case 'completed':
        return mockProjects.filter(project => project.status === 'completed');
      case 'all':
      default:
        return mockProjects;
    }
  }, [activeTab, user?.employeeId]);

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Project Management</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">Manage projects and track progress</p>
        </div>
        <Button onClick={() => setIsNewProjectModalOpen(true)} className="w-full sm:w-auto text-sm font-semibold">
          <Plus className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">New Project</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all" className="text-xs sm:text-sm">All Projects</TabsTrigger>
          <TabsTrigger value="my-projects" className="text-xs sm:text-sm">My Projects</TabsTrigger>
          <TabsTrigger value="active" className="text-xs sm:text-sm">Active</TabsTrigger>
          <TabsTrigger value="completed" className="text-xs sm:text-sm">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
          const members = getProjectMembers(project.teamMembers);
          return (
            <Card 
              key={project.id} 
              className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center text-lg">
                      <FolderOpen className="h-5 w-5 mr-2 text-blue-600" />
                      {project.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {project.projectCode}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {project.phaseStatus}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <CardDescription className="text-sm line-clamp-2">
                  {/* {project.description} */}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Project Stats */}
                <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{formatCurrency(project.budget)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>{project.billableHours}h billable</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span>{new Date(project.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-orange-600" />
                    <span>{project.teamMembers.length} members</span>
                  </div>
                </div>

                {/* Team Members */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Team</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProjectClick(project.id);
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                      {members.slice(0, 3).map((member) => (
                        <Avatar key={member?.id} className="h-8 w-8 border-2 border-background">
                          <AvatarImage src={member?.avatar} />
                          <AvatarFallback className="text-xs">
                            {member?.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {members.length > 3 && (
                        <div className="h-8 w-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">
                            +{members.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {members[0]?.name}{members.length > 1 && ` +${members.length - 1} others`}
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Progress</span>
                    <span className="font-medium text-blue-600">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Manager & Client */}
                <div className="pt-2 border-t border-border/50">
                  <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Manager:</span> {project.manager}
                    </div>
                    <div>
                      <span className="font-medium">Client:</span> {project.client}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
          </div>
        </TabsContent>
      </Tabs>

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSave={handleNewProject}
      />
    </div>
  );
};

export default Projects;