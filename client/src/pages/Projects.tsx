import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockProjects, mockTasks, mockEmployees } from '@/data/mockData';
import { FolderOpen, Plus, Users, Clock, Calendar, DollarSign, Eye } from 'lucide-react';
import NewProjectModal from '@/components/modals/NewProjectModal';
import { useNavigate } from 'react-router-dom';

const Projects: React.FC = () => {
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleNewProject = (projectData: any) => {
    // Here you would typically send the data to your backend
    console.log('New project data:', projectData);
    // For now, we'll just close the modal
    setIsNewProjectModalOpen(false);
  };

  const handleProjectClick = (projectId: string) => {
    navigate(`/project/${projectId}`);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Project Management</h1>
          <p className="text-muted-foreground">Manage projects and track progress</p>
        </div>
        <Button onClick={() => setIsNewProjectModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project) => {
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
                <div className="grid grid-cols-2 gap-3 text-sm">
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

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSave={handleNewProject}
      />
    </div>
  );
};

export default Projects;