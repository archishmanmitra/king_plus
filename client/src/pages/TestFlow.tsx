import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const TestFlow: React.FC = () => {
  const [testEmail, setTestEmail] = useState('test@company.com');
  const [testPassword, setTestPassword] = useState('password123');
  const [inviteToken, setInviteToken] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const { toast } = useToast();
  const { user, login, logout } = useAuth();

  const testCreateEmployee = async () => {
    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userDetails: {
            email: testEmail,
            role: 'employee'
          },
          officialInfo: {
            firstName: 'Test',
            lastName: 'User'
          },
          createdByUserId: user?.id || 'test-admin-id'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create employee');
      }

      const { employee, invitation } = await response.json();
      setInviteToken(invitation.token);
      toast({
        title: 'Employee Created',
        description: `Employee created with ID: ${employee.employeeId}. Invitation token: ${invitation.token}`
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const testInviteFlow = async () => {
    try {
      // First, get invitation details
      const inviteResponse = await fetch(`/api/invitations/${inviteToken}`);
      if (!inviteResponse.ok) {
        throw new Error('Failed to fetch invitation');
      }
      const inviteData = await inviteResponse.json();
      
      toast({
        title: 'Invitation Details',
        description: `Email: ${inviteData.email}, Role: ${inviteData.role}`
      });

      // Then accept the invitation
      const acceptResponse = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: inviteToken,
          password: invitePassword
        })
      });

      if (!acceptResponse.ok) {
        const error = await acceptResponse.json();
        throw new Error(error.error || 'Failed to accept invitation');
      }

      toast({
        title: 'Invitation Accepted',
        description: 'User account created successfully!'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  };

  const testLogin = async () => {
    const success = await login(testEmail, testPassword);
    if (success) {
      toast({
        title: 'Login Successful',
        description: 'You are now logged in!'
      });
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Test Employee Creation Flow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {user ? (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-800">Logged in as: {user.email} ({user.role})</p>
                <Button onClick={logout} variant="outline" className="mt-2">
                  Logout
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Step 1: Create Employee</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="test-email">Test Email</Label>
                    <Input
                      id="test-email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={testCreateEmployee}>
                  Create Test Employee
                </Button>
              </div>

              {inviteToken && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Step 2: Test Invitation Flow</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="invite-password">Password for New User</Label>
                      <Input
                        id="invite-password"
                        type="password"
                        value={invitePassword}
                        onChange={(e) => setInvitePassword(e.target.value)}
                        placeholder="Enter password"
                      />
                    </div>
                  </div>
                  <Button onClick={testInviteFlow}>
                    Accept Invitation
                  </Button>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Step 3: Test Login</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="login-email">Login Email</Label>
                    <Input
                      id="login-email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Login Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={testPassword}
                      onChange={(e) => setTestPassword(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={testLogin}>
                  Test Login
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">Please login first to test the flow</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestFlow;
