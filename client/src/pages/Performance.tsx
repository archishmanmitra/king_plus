import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockPerformanceReviews } from '@/data/mockData';
import { Target, TrendingUp, Star, Award, Plus, Eye } from 'lucide-react';

const Performance: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Tab state management
  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get('tab');
  const defaultTab = 'goals';
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

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Performance Management</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">Track goals, reviews, and employee development</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button variant="outline" className="w-full sm:w-auto text-sm font-semibold">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Set Goal</span>
            <span className="sm:hidden">Goal</span>
          </Button>
          <Button className="w-full sm:w-auto text-sm font-semibold">
            <Award className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Start Review</span>
            <span className="sm:hidden">Review</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Active Goals</div>
                <div className="text-xl font-bold">8</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-success" />
              <div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
                <div className="text-xl font-bold">4.2</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-warning" />
              <div>
                <div className="text-sm text-muted-foreground">Reviews Due</div>
                <div className="text-xl font-bold">3</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Goal Progress</div>
                <div className="text-xl font-bold">75%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="goals" className="text-xs sm:text-sm">Goals & OKRs</TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs sm:text-sm">Performance Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="goals">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Goals</CardTitle>
                <CardDescription>Track your objectives and key results</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: 'Improve System Security', progress: 75, status: 'on-track' },
                  { title: 'Complete Training Program', progress: 90, status: 'ahead' },
                  { title: 'Reduce Response Time', progress: 45, status: 'behind' }
                ].map((goal, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{goal.title}</h4>
                      <Badge variant={
                        goal.status === 'ahead' ? 'default' :
                        goal.status === 'on-track' ? 'secondary' :
                        'destructive'
                      }>
                        {goal.status}
                      </Badge>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="text-sm text-muted-foreground">{goal.progress}% complete</div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Goals</CardTitle>
                <CardDescription>Department objectives and progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { title: 'Q1 Revenue Target', progress: 85, team: 'Sales' },
                  { title: 'System Uptime 99.9%', progress: 95, team: 'IT' },
                  { title: 'Customer Satisfaction', progress: 70, team: 'Support' }
                ].map((goal, index) => (
                  <div key={index} className="space-y-2 p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{goal.title}</h4>
                        <p className="text-sm text-muted-foreground">{goal.team} Team</p>
                      </div>
                    </div>
                    <Progress value={goal.progress} className="h-2" />
                    <div className="text-sm text-muted-foreground">{goal.progress}% complete</div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reviews</CardTitle>
              <CardDescription>View and manage performance evaluations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockPerformanceReviews.map((review) => (
                  <div key={review.id} className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 p-4 border rounded-lg">
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {review.employeeName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate">{review.employeeName}</div>
                        <div className="text-sm text-muted-foreground">
                          {review.reviewPeriod} • {review.reviewType}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Reviewed by: {review.reviewer}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-start space-x-4">
                      <div className="text-center">
                        <div className="text-xl sm:text-2xl font-bold text-primary">{review.overallRating}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Rating</div>
                      </div>
                      <Badge variant={review.status === 'completed' ? 'default' : 'secondary'} className="text-xs sm:text-sm">
                        {review.status}
                      </Badge>
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-initial">
                        <Eye className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">View</span>
                        <span className="sm:hidden">View</span>
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

export default Performance;