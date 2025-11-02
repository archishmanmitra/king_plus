import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Award,
  Trophy,
  Star,
  Plus,
  Trash2,
  Calendar,
  User,
  Sparkles,
  Medal,
  Heart,
  Gift,
  Search,
  Filter,
} from 'lucide-react';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

interface AwardData {
  id: string;
  title: string;
  description: string;
  awardType: 'certificate' | 'appreciation' | 'achievement' | 'milestone' | 'recognition';
  recipientId: string;
  recipientName: string;
  issuedBy: string;
  issuedByName: string;
  certificateUrl?: string;
  badgeIcon?: string;
  isPublic: boolean;
  celebrationDate: string;
  createdAt: string;
}

interface Employee {
  id: string;
  employeeId: string;
  official?: {
    firstName: string;
    lastName: string;
  };
}

const AwardsAndCelebration: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [awards, setAwards] = useState<AwardData[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    awardType: 'appreciation',
    recipientId: '',
    badgeIcon: '🏆',
  });

  const isAdmin = user?.role === 'global_admin';

  useEffect(() => {
    fetchAwards();
    if (isAdmin) {
      fetchEmployees();
    }
  }, [isAdmin]);

  const fetchAwards = async () => {
    try {
      const token = localStorage.getItem('hrms_token');
      const response = await fetch(`${API_URL}/awards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAwards(data);
      } else {
        throw new Error('Failed to fetch awards');
      }
    } catch (error) {
      console.error('Error fetching awards:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch awards',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('hrms_token');
      const response = await fetch(`${API_URL}/employees`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees || []);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleCreateAward = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.recipientId) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const token = localStorage.getItem('hrms_token');
      const response = await fetch(`${API_URL}/awards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newAward = await response.json();
        setAwards([newAward, ...awards]);
        setShowCreateDialog(false);
        setFormData({
          title: '',
          description: '',
          awardType: 'appreciation',
          recipientId: '',
          badgeIcon: '🏆',
        });
        toast({
          title: 'Success',
          description: 'Award created successfully! 🎉',
        });
      } else {
        throw new Error('Failed to create award');
      }
    } catch (error) {
      console.error('Error creating award:', error);
      toast({
        title: 'Error',
        description: 'Failed to create award',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAward = async (awardId: string) => {
    if (!confirm('Are you sure you want to delete this award?')) {
      return;
    }

    try {
      const token = localStorage.getItem('hrms_token');
      const response = await fetch(`${API_URL}/awards/${awardId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setAwards(awards.filter((a) => a.id !== awardId));
        toast({
          title: 'Success',
          description: 'Award deleted successfully',
        });
      } else {
        throw new Error('Failed to delete award');
      }
    } catch (error) {
      console.error('Error deleting award:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete award',
        variant: 'destructive',
      });
    }
  };

  const filteredAwards = awards.filter((award) => {
    const matchesSearch =
      award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      award.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      award.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || award.awardType === filterType;
    return matchesSearch && matchesFilter;
  });

  const getAwardIcon = (type: string, customIcon?: string) => {
    if (customIcon) return customIcon;
    
    const icons: Record<string, string> = {
      certificate: '📜',
      appreciation: '💝',
      achievement: '🏆',
      milestone: '🎯',
      recognition: '⭐',
    };
    return icons[type] || '🏆';
  };

  const getAwardColor = (type: string) => {
    const colors: Record<string, string> = {
      certificate: 'from-blue-500 to-blue-600',
      appreciation: 'from-pink-500 to-rose-600',
      achievement: 'from-amber-500 to-orange-600',
      milestone: 'from-purple-500 to-indigo-600',
      recognition: 'from-emerald-500 to-green-600',
    };
    return colors[type] || 'from-blue-500 to-blue-600';
  };

  const getAwardTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      certificate: 'Certificate',
      appreciation: 'Appreciation',
      achievement: 'Achievement',
      milestone: 'Milestone',
      recognition: 'Recognition',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Sparkles className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="w-8 h-8 text-amber-500" />
            Awards & Celebration
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin
              ? 'Recognize and celebrate your team members achievements'
              : 'View awards and celebrations across the organization'}
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Award
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search awards or recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="certificate">Certificate</SelectItem>
                  <SelectItem value="appreciation">Appreciation</SelectItem>
                  <SelectItem value="achievement">Achievement</SelectItem>
                  <SelectItem value="milestone">Milestone</SelectItem>
                  <SelectItem value="recognition">Recognition</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Awards Grid */}
      {filteredAwards.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Award className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No awards found</h3>
            <p className="text-muted-foreground">
              {isAdmin
                ? 'Create your first award to celebrate team achievements'
                : 'No awards have been issued yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAwards.map((award) => (
            <Card
              key={award.id}
              className="relative overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Award Header with Gradient */}
              <div
                className={`h-24 bg-gradient-to-r ${getAwardColor(
                  award.awardType
                )} flex items-center justify-center relative`}
              >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="text-6xl z-10">{getAwardIcon(award.awardType, award.badgeIcon)}</div>
                <Sparkles className="absolute top-2 right-2 w-5 h-5 text-white/60" />
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {getAwardTypeLabel(award.awardType)}
                  </Badge>
                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeleteAward(award.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <CardTitle className="text-xl">{award.title}</CardTitle>
                <CardDescription className="line-clamp-2">{award.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <span className="font-semibold text-foreground">{award.recipientName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Gift className="w-4 h-4" />
                  <span>Issued by {award.issuedByName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(award.celebrationDate), 'MMM dd, yyyy')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Award Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Create New Award
            </DialogTitle>
            <DialogDescription>
              Recognize an employee's achievements and contributions
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateAward} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipientId">Recipient *</Label>
                <Select
                  value={formData.recipientId}
                  onValueChange={(value) => setFormData({ ...formData, recipientId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.official
                          ? `${emp.official.firstName} ${emp.official.lastName} (${emp.employeeId})`
                          : emp.employeeId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="awardType">Award Type *</Label>
                <Select
                  value={formData.awardType}
                  onValueChange={(value) => setFormData({ ...formData, awardType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certificate">Certificate</SelectItem>
                    <SelectItem value="appreciation">Appreciation</SelectItem>
                    <SelectItem value="achievement">Achievement</SelectItem>
                    <SelectItem value="milestone">Milestone</SelectItem>
                    <SelectItem value="recognition">Recognition</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Award Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Employee of the Month"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the achievement or reason for this award..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="badgeIcon">Badge Icon (Emoji)</Label>
              <Input
                id="badgeIcon"
                value={formData.badgeIcon}
                onChange={(e) => setFormData({ ...formData, badgeIcon: e.target.value })}
                placeholder="🏆"
                maxLength={2}
              />
              <p className="text-xs text-muted-foreground">
                Choose an emoji to represent this award (e.g., 🏆, ⭐, 🎖️, 🥇, 💎)
              </p>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="gap-2">
                <Sparkles className="w-4 h-4" />
                Create Award
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AwardsAndCelebration;

