import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit, CreditCard, PiggyBank, DollarSign, Calculator, TrendingUp, Calendar, Building, Download } from 'lucide-react';

interface FinancialInformationProps {
  data: any;
  canEditBank?: boolean;
  canEditRetiral?: boolean;
  isEditMode?: boolean;
  showBankAccount?: boolean;
  showRetiralOnly?: boolean;
  onChange?: (field: string, value: any) => void;
}

const FinancialInformation: React.FC<FinancialInformationProps> = ({ 
  data, 
  canEditBank = false, 
  canEditRetiral = false, 
  isEditMode = false,
  showBankAccount = true,
  showRetiralOnly = false,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState(showRetiralOnly ? 'retiral' : 'bank');

  // Determine effective permissions (role-specific flags only)
  const effectiveCanEditBank = !!canEditBank;
  const effectiveCanEditRetiral = !!canEditRetiral;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {!showRetiralOnly && (
          <TabsList className={`grid w-full ${showBankAccount ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {showBankAccount && <TabsTrigger value="bank">Bank Account</TabsTrigger>}
            <TabsTrigger value="retiral">Retiral</TabsTrigger>
          </TabsList>
        )}

        {/* Bank Account Tab */}
        {showBankAccount && !showRetiralOnly && (
          <TabsContent value="bank" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Bank Account Information
                </CardTitle>
                <CardDescription>
                  Your banking details for salary and other payments
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input 
                      id="bankName" 
                      value={data.bankAccount?.bankName || ''} 
                      onChange={(e) => onChange?.('bankName', e.target.value)}
                      disabled={!effectiveCanEditBank}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input 
                      id="accountNumber" 
                      value={data.bankAccount?.accountNumber || ''} 
                      onChange={(e) => onChange?.('accountNumber', e.target.value)}
                      disabled={!effectiveCanEditBank}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input 
                      id="ifscCode" 
                      value={data.bankAccount?.ifscCode || ''} 
                      onChange={(e) => onChange?.('ifscCode', e.target.value)}
                      disabled={!effectiveCanEditBank}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="branchName">Branch Name</Label>
                    <Input 
                      id="branchName" 
                      value={data.bankAccount?.branchName || ''} 
                      onChange={(e) => onChange?.('branchName', e.target.value)}
                      disabled={!effectiveCanEditBank}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Retiral Tab */}
        <TabsContent value="retiral" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PiggyBank className="h-5 w-5 mr-2" />
                Salary & Retiral Information
              </CardTitle>
              <CardDescription>
                Your salary structure and retiral benefits
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Salary Structure */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Salary Structure
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basicSalary">Basic Salary</Label>
                    <Input 
                      id="basicSalary" 
                      type="number" 
                      value={data.retiral?.basicSalary || 0} 
                      onChange={(e) => onChange?.('basicSalary', parseFloat(e.target.value) || 0)}
                      disabled={!effectiveCanEditRetiral}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="houseRentAllowance">House Rent Allowance</Label>
                    <Input 
                      id="houseRentAllowance" 
                      type="number" 
                      value={data.retiral?.houseRentAllowance || 0} 
                      onChange={(e) => onChange?.('houseRentAllowance', parseFloat(e.target.value) || 0)}
                      disabled={!effectiveCanEditRetiral}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialAllowance">Special Allowance</Label>
                    <Input 
                      id="specialAllowance" 
                      type="number" 
                      value={data.retiral?.specialAllowance || 0} 
                      onChange={(e) => onChange?.('specialAllowance', parseFloat(e.target.value) || 0)}
                      disabled={!effectiveCanEditRetiral}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyGross">Monthly Gross</Label>
                    <Input 
                      id="monthlyGross" 
                      type="number" 
                      defaultValue={((data.retiral?.basicSalary || 0) + (data.retiral?.houseRentAllowance || 0) + (data.retiral?.specialAllowance || 0))} 
                      disabled={true}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Organization's Statutory Liabilities */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Organization's Statutory Liabilities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employerPF">Provident Fund</Label>
                    <Input 
                      id="employerPF" 
                      type="number" 
                      value={data.retiral?.employerPF || 0} 
                      onChange={(e) => onChange?.('employerPF', parseFloat(e.target.value) || 0)}
                      disabled={!effectiveCanEditRetiral}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employerESI">Employee's Insurance</Label>
                    <Input 
                      id="employerESI" 
                      type="number" 
                      value={data.retiral?.employerESI || 0} 
                      onChange={(e) => onChange?.('employerESI', parseFloat(e.target.value) || 0)}
                      disabled={!effectiveCanEditRetiral}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="totalStatutoryLiabilities">Total - Organization's Statutory Liabilities</Label>
                    <Input 
                      id="totalStatutoryLiabilities" 
                      type="number" 
                      defaultValue={((data.retiral?.employerPF || 0) + (data.retiral?.employerESI || 0))} 
                      disabled={true}
                      readOnly
                      className="font-bold"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Employee's Deductions */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center">
                  <Calculator className="h-4 w-4 mr-2" />
                  Employee's Deductions
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeePF">Provident Fund</Label>
                    <Input 
                      id="employeePF" 
                      type="number" 
                      value={data.retiral?.employeePF || 0} 
                      onChange={(e) => onChange?.('employeePF', parseFloat(e.target.value) || 0)}
                      disabled={!effectiveCanEditRetiral}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employeeESI">Employee's Insurance</Label>
                    <Input 
                      id="employeeESI" 
                      type="number" 
                      value={data.retiral?.employeeESI || 0} 
                      onChange={(e) => onChange?.('employeeESI', parseFloat(e.target.value) || 0)}
                      disabled={!effectiveCanEditRetiral}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="professionalTax">Professional Tax</Label>
                    <Input 
                      id="professionalTax" 
                      type="number" 
                      value={data.retiral?.professionalTax || 0} 
                      onChange={(e) => onChange?.('professionalTax', parseFloat(e.target.value) || 0)}
                      disabled={!effectiveCanEditRetiral}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="incomeTax">Income Tax</Label>
                    <Input 
                      id="incomeTax" 
                      type="number" 
                      value={data.retiral?.incomeTax || 0} 
                      onChange={(e) => onChange?.('incomeTax', parseFloat(e.target.value) || 0)}
                      disabled={!effectiveCanEditRetiral}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="totalDeductions">Total - Employee's Deductions</Label>
                    <Input 
                      id="totalDeductions" 
                      type="number" 
                      defaultValue={((data.retiral?.employeePF || 0) + (data.retiral?.employeeESI || 0) + (data.retiral?.professionalTax || 0) + (data.retiral?.incomeTax || 0))} 
                      disabled={true}
                      readOnly
                      className="font-bold"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Net Take Home & CTC */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Net Take Home & CTC
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="netTakeHome">Net Take Home</Label>
                    <Input 
                      id="netTakeHome" 
                      type="number" 
                      value={data.retiral?.netTakeHome || 0} 
                      onChange={(e) => onChange?.('netTakeHome', parseFloat(e.target.value) || 0)}
                      disabled={!effectiveCanEditRetiral}
                      className="font-bold text-green-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="costToCompany">Cost to Company (CTC)</Label>
                    <Input 
                      id="costToCompany" 
                      type="number" 
                      value={data.retiral?.costToCompany || 0} 
                      onChange={(e) => onChange?.('costToCompany', parseFloat(e.target.value) || 0)}
                      disabled={!effectiveCanEditRetiral}
                      className="font-bold text-blue-600"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="pfTotal">PF Total (Employee + Employer)</Label>
                    <Input 
                      id="pfTotal" 
                      type="number" 
                      value={data.retiral?.pfTotal || 0} 
                      onChange={(e) => onChange?.('pfTotal', parseFloat(e.target.value) || 0)}
                      disabled={!effectiveCanEditRetiral}
                      className="font-bold"
                    />
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

export default FinancialInformation;