import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  Users, 
  Building2, 
  Mail, 
  Shield, 
  Bell, 
  Clock, 
  DollarSign,
  Database,
  Download,
  Upload,
  Save,
  RefreshCw
} from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    company: {
      name: 'TechCorp Solutions',
      address: '123 Business Ave, Tech City, TC 12345',
      phone: '+1 (555) 123-4567',
      email: 'info@techcorp.com',
      website: 'www.techcorp.com',
      taxId: '12-3456789'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      leaveApprovals: true,
      payrollReminders: true,
      attendanceAlerts: true
    },
    attendance: {
      clockInTolerance: 15,
      overtimeThreshold: 8,
      workingDaysPerWeek: 5,
      requireGeoLocation: true,
      allowMobileClockIn: true,
      biometricAuth: false
    },
    payroll: {
      currency: 'USD',
      payrollFrequency: 'monthly',
      overtimeRate: 1.5,
      taxRate: 0.25,
      autoCalculateOT: true,
      includeWeekends: false
    },
    leave: {
      defaultAnnualLeave: 20,
      defaultSickLeave: 10,
      carryOverDays: 5,
      requireApproval: true,
      allowNegativeBalance: false,
      autoApprove: false
    },
    security: {
      passwordPolicy: 'strong',
      sessionTimeout: 60,
      twoFactorAuth: false,
      ipWhitelist: '',
      auditLogs: true,
      dataRetention: 7
    }
  });

  const saveSettings = (section: string) => {
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully.`,
    });
  };

  const resetToDefaults = () => {
    toast({
      title: "Settings Reset",
      description: "All settings have been reset to default values.",
    });
  };

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hrms-settings.json';
    link.click();
    
    toast({
      title: "Settings Exported",
      description: "Settings have been exported to a JSON file.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground">Configure your HRMS platform settings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportSettings}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <Tabs defaultValue="company" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
          <TabsTrigger value="leave">Leave</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                Company Information
              </CardTitle>
              <CardDescription>
                Configure your organization's basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    value={settings.company.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      company: { ...settings.company, name: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-id">Tax ID</Label>
                  <Input
                    id="tax-id"
                    value={settings.company.taxId}
                    onChange={(e) => setSettings({
                      ...settings,
                      company: { ...settings.company, taxId: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={settings.company.address}
                  onChange={(e) => setSettings({
                    ...settings,
                    company: { ...settings.company, address: e.target.value }
                  })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={settings.company.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      company: { ...settings.company, phone: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.company.email}
                    onChange={(e) => setSettings({
                      ...settings,
                      company: { ...settings.company, email: e.target.value }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={settings.company.website}
                    onChange={(e) => setSettings({
                      ...settings,
                      company: { ...settings.company, website: e.target.value }
                    })}
                  />
                </div>
              </div>

              <Button onClick={() => saveSettings('Company')}>
                <Save className="h-4 w-4 mr-2" />
                Save Company Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure how and when notifications are sent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, emailNotifications: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={settings.notifications.smsNotifications}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, smsNotifications: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive browser push notifications</p>
                  </div>
                  <Switch
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, pushNotifications: checked }
                    })}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Leave Approval Notifications</Label>
                    <p className="text-sm text-muted-foreground">Notify when leave requests need approval</p>
                  </div>
                  <Switch
                    checked={settings.notifications.leaveApprovals}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, leaveApprovals: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Payroll Reminders</Label>
                    <p className="text-sm text-muted-foreground">Remind about payroll processing</p>
                  </div>
                  <Switch
                    checked={settings.notifications.payrollReminders}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, payrollReminders: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Attendance Alerts</Label>
                    <p className="text-sm text-muted-foreground">Alert for late arrivals and absences</p>
                  </div>
                  <Switch
                    checked={settings.notifications.attendanceAlerts}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      notifications: { ...settings.notifications, attendanceAlerts: checked }
                    })}
                  />
                </div>
              </div>

              <Button onClick={() => saveSettings('Notifications')}>
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Attendance Configuration
              </CardTitle>
              <CardDescription>
                Configure attendance tracking and policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clock-tolerance">Clock-in Tolerance (minutes)</Label>
                  <Input
                    id="clock-tolerance"
                    type="number"
                    value={settings.attendance.clockInTolerance}
                    onChange={(e) => setSettings({
                      ...settings,
                      attendance: { ...settings.attendance, clockInTolerance: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overtime-threshold">Overtime Threshold (hours)</Label>
                  <Input
                    id="overtime-threshold"
                    type="number"
                    value={settings.attendance.overtimeThreshold}
                    onChange={(e) => setSettings({
                      ...settings,
                      attendance: { ...settings.attendance, overtimeThreshold: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Geo-location</Label>
                    <p className="text-sm text-muted-foreground">Require location verification for clock-in</p>
                  </div>
                  <Switch
                    checked={settings.attendance.requireGeoLocation}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      attendance: { ...settings.attendance, requireGeoLocation: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Mobile Clock-in</Label>
                    <p className="text-sm text-muted-foreground">Allow employees to clock in from mobile devices</p>
                  </div>
                  <Switch
                    checked={settings.attendance.allowMobileClockIn}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      attendance: { ...settings.attendance, allowMobileClockIn: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Biometric Authentication</Label>
                    <p className="text-sm text-muted-foreground">Enable biometric verification</p>
                  </div>
                  <Switch
                    checked={settings.attendance.biometricAuth}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      attendance: { ...settings.attendance, biometricAuth: checked }
                    })}
                  />
                </div>
              </div>

              <Button onClick={() => saveSettings('Attendance')}>
                <Save className="h-4 w-4 mr-2" />
                Save Attendance Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Payroll Configuration
              </CardTitle>
              <CardDescription>
                Configure payroll processing and calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={settings.payroll.currency} onValueChange={(value) => setSettings({
                    ...settings,
                    payroll: { ...settings.payroll, currency: value }
                  })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payroll-frequency">Payroll Frequency</Label>
                  <Select value={settings.payroll.payrollFrequency} onValueChange={(value) => setSettings({
                    ...settings,
                    payroll: { ...settings.payroll, payrollFrequency: value }
                  })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="overtime-rate">Overtime Rate Multiplier</Label>
                  <Input
                    id="overtime-rate"
                    type="number"
                    step="0.1"
                    value={settings.payroll.overtimeRate}
                    onChange={(e) => setSettings({
                      ...settings,
                      payroll: { ...settings.payroll, overtimeRate: parseFloat(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Default Tax Rate</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    step="0.01"
                    value={settings.payroll.taxRate}
                    onChange={(e) => setSettings({
                      ...settings,
                      payroll: { ...settings.payroll, taxRate: parseFloat(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-calculate Overtime</Label>
                    <p className="text-sm text-muted-foreground">Automatically calculate overtime based on hours worked</p>
                  </div>
                  <Switch
                    checked={settings.payroll.autoCalculateOT}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      payroll: { ...settings.payroll, autoCalculateOT: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Include Weekends</Label>
                    <p className="text-sm text-muted-foreground">Include weekend hours in payroll calculations</p>
                  </div>
                  <Switch
                    checked={settings.payroll.includeWeekends}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      payroll: { ...settings.payroll, includeWeekends: checked }
                    })}
                  />
                </div>
              </div>

              <Button onClick={() => saveSettings('Payroll')}>
                <Save className="h-4 w-4 mr-2" />
                Save Payroll Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Leave Management
              </CardTitle>
              <CardDescription>
                Configure leave policies and approval workflows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="annual-leave">Default Annual Leave (days)</Label>
                  <Input
                    id="annual-leave"
                    type="number"
                    value={settings.leave.defaultAnnualLeave}
                    onChange={(e) => setSettings({
                      ...settings,
                      leave: { ...settings.leave, defaultAnnualLeave: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sick-leave">Default Sick Leave (days)</Label>
                  <Input
                    id="sick-leave"
                    type="number"
                    value={settings.leave.defaultSickLeave}
                    onChange={(e) => setSettings({
                      ...settings,
                      leave: { ...settings.leave, defaultSickLeave: parseInt(e.target.value) }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="carry-over">Carry Over Days</Label>
                  <Input
                    id="carry-over"
                    type="number"
                    value={settings.leave.carryOverDays}
                    onChange={(e) => setSettings({
                      ...settings,
                      leave: { ...settings.leave, carryOverDays: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Approval</Label>
                    <p className="text-sm text-muted-foreground">All leave requests require manager approval</p>
                  </div>
                  <Switch
                    checked={settings.leave.requireApproval}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      leave: { ...settings.leave, requireApproval: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Negative Balance</Label>
                    <p className="text-sm text-muted-foreground">Allow employees to go into negative leave balance</p>
                  </div>
                  <Switch
                    checked={settings.leave.allowNegativeBalance}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      leave: { ...settings.leave, allowNegativeBalance: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-approve Sick Leave</Label>
                    <p className="text-sm text-muted-foreground">Automatically approve sick leave requests</p>
                  </div>
                  <Switch
                    checked={settings.leave.autoApprove}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      leave: { ...settings.leave, autoApprove: checked }
                    })}
                  />
                </div>
              </div>

              <Button onClick={() => saveSettings('Leave')}>
                <Save className="h-4 w-4 mr-2" />
                Save Leave Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security & Privacy
              </CardTitle>
              <CardDescription>
                Configure security policies and data protection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password-policy">Password Policy</Label>
                  <Select value={settings.security.passwordPolicy} onValueChange={(value) => setSettings({
                    ...settings,
                    security: { ...settings.security, passwordPolicy: value }
                  })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (8 characters)</SelectItem>
                      <SelectItem value="strong">Strong (12+ chars, mixed case, numbers, symbols)</SelectItem>
                      <SelectItem value="enterprise">Enterprise (16+ chars, complex requirements)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      security: { ...settings.security, sessionTimeout: parseInt(e.target.value) }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ip-whitelist">IP Whitelist (comma-separated)</Label>
                <Textarea
                  id="ip-whitelist"
                  placeholder="192.168.1.1, 10.0.0.1, ..."
                  value={settings.security.ipWhitelist}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, ipWhitelist: e.target.value }
                  })}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Require 2FA for all users</p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, twoFactorAuth: checked }
                    })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Audit Logs</Label>
                    <p className="text-sm text-muted-foreground">Enable comprehensive audit logging</p>
                  </div>
                  <Switch
                    checked={settings.security.auditLogs}
                    onCheckedChange={(checked) => setSettings({
                      ...settings,
                      security: { ...settings.security, auditLogs: checked }
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="data-retention">Data Retention (years)</Label>
                <Input
                  id="data-retention"
                  type="number"
                  value={settings.security.dataRetention}
                  onChange={(e) => setSettings({
                    ...settings,
                    security: { ...settings.security, dataRetention: parseInt(e.target.value) }
                  })}
                />
              </div>

              <Button onClick={() => saveSettings('Security')}>
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;