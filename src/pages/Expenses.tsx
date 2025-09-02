import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { mockExpenses } from '@/data/mockData';
import { FileText, Plus, Upload, DollarSign, Calendar, CheckCircle, XCircle, MapPin, User, Receipt, Building } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Expenses: React.FC = () => {
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [reportingManager, setReportingManager] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [location, setLocation] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [billNumber, setBillNumber] = useState('');
  const [percentageOfOfficialUse, setPercentageOfOfficialUse] = useState('');
  const [vendor, setVendor] = useState('');
  const [comment, setComment] = useState('');

  const expenseCategories = ['Travel', 'Meals', 'Office Supplies', 'Software', 'Training', 'Marketing', 'Other'];
  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'];
  const managers = ['David Wilson', 'Emily Rodriguez', 'Sarah Johnson'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!amount || !category || !description || !reportingManager || !fromDate || !toDate || !location || !billNumber || !percentageOfOfficialUse || !vendor) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Handle form submission here
    const newExpense = {
      id: Date.now().toString(),
      employeeId: 'EMP001', // This would come from auth context
      employeeName: 'Sarah Johnson', // This would come from auth context
      category: category.toLowerCase(),
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString().split('T')[0],
      status: 'pending' as const,
      receipts: [],
      reportingManager,
      fromDate,
      toDate,
      location,
      currency,
      billNumber,
      percentageOfOfficialUse: parseInt(percentageOfOfficialUse),
      vendor,
      comment
    };

    console.log('Submitting expense claim:', newExpense);
    
    // Here you would typically send the data to your backend
    // For now, we'll just show a success message
    
    toast({
      title: "Expense Claim Submitted",
      description: "Your expense claim has been submitted for approval.",
    });
    
    // Reset form and close modal
    resetForm();
    setIsFormOpen(false);
  };

  const resetForm = () => {
    setAmount('');
    setCategory('');
    setDescription('');
    setReportingManager('');
    setFromDate('');
    setToDate('');
    setLocation('');
    setCurrency('USD');
    setBillNumber('');
    setPercentageOfOfficialUse('');
    setVendor('');
    setComment('');
  };

  const openForm = () => {
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Expense Management</h1>
          <p className="text-muted-foreground">Submit and track your expense claims</p>
        </div>
        <Button onClick={openForm}>
          <Plus className="h-4 w-4 mr-2" />
          New Expense
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm text-muted-foreground">Total Submitted</div>
                <div className="text-xl font-bold">$2,340</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <div className="text-sm text-muted-foreground">Approved</div>
                <div className="text-xl font-bold">$1,890</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-warning" />
              <div>
                <div className="text-sm text-muted-foreground">Pending</div>
                <div className="text-xl font-bold">$450</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <div>
                <div className="text-sm text-muted-foreground">Rejected</div>
                <div className="text-xl font-bold">$0</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="claims" className="space-y-4">
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value="claims">My Claims</TabsTrigger>
          <TabsTrigger value="approve">Approve Claims</TabsTrigger>
        </TabsList>

        <TabsContent value="claims">
          <Card>
            <CardHeader>
              <CardTitle>My Expense Claims</CardTitle>
              <CardDescription>
                Track the status of your submitted expense claims
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockExpenses.map((expense) => (
                  <div key={expense.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{expense.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {expense.category} • {expense.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{expense.currency} {expense.amount.toFixed(2)}</div>
                        <Badge variant={
                          expense.status === 'approved' ? 'default' :
                          expense.status === 'rejected' ? 'destructive' :
                          'secondary'
                        }>
                          {expense.status}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Additional claim details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Manager:</span> {expense.reportingManager}
                      </div>
                      <div>
                        <span className="font-medium">Bill:</span> {expense.billNumber}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {expense.location}
                      </div>
                      <div>
                        <span className="font-medium">Vendor:</span> {expense.vendor}
                      </div>
                      <div>
                        <span className="font-medium">From:</span> {expense.fromDate}
                      </div>
                      <div>
                        <span className="font-medium">To:</span> {expense.toDate}
                      </div>
                      <div>
                        <span className="font-medium">Official Use:</span> {expense.percentageOfOfficialUse}%
                      </div>
                      {expense.comment && (
                        <div className="col-span-2 md:col-span-4">
                          <span className="font-medium">Comment:</span> {expense.comment}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approve">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>
                Expense claims requiring your approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockExpenses.filter(e => e.status === 'pending').map((expense) => (
                  <div key={expense.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                          {expense.employeeName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-medium">{expense.employeeName}</div>
                          <div className="text-sm text-muted-foreground">{expense.description}</div>
                          <div className="text-sm text-muted-foreground">
                            {expense.category} • {expense.date}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right mr-4">
                          <div className="font-medium">{expense.currency} {expense.amount.toFixed(2)}</div>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="bg-success hover:bg-success/90">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Additional claim details for approval */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Manager:</span> {expense.reportingManager}
                      </div>
                      <div>
                        <span className="font-medium">Bill:</span> {expense.billNumber}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {expense.location}
                      </div>
                      <div>
                        <span className="font-medium">Vendor:</span> {expense.vendor}
                      </div>
                      <div>
                        <span className="font-medium">From:</span> {expense.fromDate}
                      </div>
                      <div>
                        <span className="font-medium">To:</span> {expense.toDate}
                      </div>
                      <div>
                        <span className="font-medium">Official Use:</span> {expense.percentageOfOfficialUse}%
                      </div>
                      {expense.comment && (
                        <div className="col-span-2 md:col-span-4">
                          <span className="font-medium">Comment:</span> {expense.comment}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Expense Claim Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submit New Expense Claim</DialogTitle>
            <DialogDescription>
              Submit a new expense claim for reimbursement with complete details
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map(cat => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your expense..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Claim Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Claim Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportingManager">
                    <User className="h-4 w-4 inline mr-2" />
                    Reporting Manager *
                  </Label>
                  <Select value={reportingManager} onValueChange={setReportingManager} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                    </SelectTrigger>
                    <SelectContent>
                      {managers.map(manager => (
                        <SelectItem key={manager} value={manager}>{manager}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="billNumber">
                    <Receipt className="h-4 w-4 inline mr-2" />
                    Bill Number *
                  </Label>
                  <Input
                    id="billNumber"
                    placeholder="Enter bill number"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromDate">From Date *</Label>
                  <Input
                    id="fromDate"
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toDate">To Date *</Label>
                  <Input
                    id="toDate"
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Location *
                  </Label>
                  <Input
                    id="location"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency *</Label>
                  <Select value={currency} onValueChange={setCurrency} required>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map(curr => (
                        <SelectItem key={curr} value={curr}>{curr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="percentageOfOfficialUse">Percentage of Official Use *</Label>
                  <Input
                    id="percentageOfOfficialUse"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="100"
                    value={percentageOfOfficialUse}
                    onChange={(e) => setPercentageOfOfficialUse(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vendor">
                    <Building className="h-4 w-4 inline mr-2" />
                    Vendor *
                  </Label>
                  <Input
                    id="vendor"
                    placeholder="Enter vendor name"
                    value={vendor}
                    onChange={(e) => setVendor(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Additional comments or notes..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {/* Receipt Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Receipt Upload</h3>
              <div className="space-y-2">
                <Label>Receipt Upload *</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your receipt or click to browse
                  </p>
                  <Button variant="outline" size="sm" type="button">
                    Choose File
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={closeForm}>
                Cancel
              </Button>
              <Button type="submit">
                Submit Expense Claim
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;