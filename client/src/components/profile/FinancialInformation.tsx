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
  canEdit?: boolean;
  onChange?: (field: string, value: any) => void;
}

const FinancialInformation: React.FC<FinancialInformationProps> = ({ 
  data, 
  canEditBank = false, 
  canEditRetiral = false, 
  isEditMode = false,
  showBankAccount = true,
  showRetiralOnly = false,
  canEdit = false,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState(showRetiralOnly ? 'retiral' : 'bank');

  // Determine effective permissions
  const effectiveCanEditBank = canEdit || canEditBank;
  const effectiveCanEditRetiral = canEdit || canEditRetiral;

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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Bank Account Details
                </CardTitle>
                <CardDescription>Banking information for salary disbursement</CardDescription>
              </div>

            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isEditMode ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bankName">Bank Name</Label>
                      <Input 
                        id="bankName" 
                        defaultValue={data.bankAccount.bankName} 
                        disabled={!effectiveCanEditBank}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input 
                        id="accountNumber" 
                        defaultValue={data.bankAccount.accountNumber} 
                        disabled={!effectiveCanEditBank}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifscCode">IFSC Code</Label>
                      <Input 
                        id="ifscCode" 
                        defaultValue={data.bankAccount.ifscCode} 
                        disabled={!effectiveCanEditBank}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input 
                        id="country" 
                        defaultValue={data.bankAccount.country} 
                        disabled={!effectiveCanEditBank}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="modifiedDate">Modified Date</Label>
                      <Input 
                        id="modifiedDate" 
                        type="date" 
                        defaultValue={data.bankAccount.modifiedDate} 
                        disabled={!effectiveCanEditBank}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Bank Name</label>
                      <p className="text-foreground font-medium">{data.bankAccount.bankName}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Account Number</label>
                      <p className="text-foreground font-mono">{data.bankAccount.accountNumber}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">IFSC Code</label>
                      <p className="text-foreground font-mono">{data.bankAccount.ifscCode}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Country</label>
                      <p className="text-foreground">{data.bankAccount.country}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Modified Date</label>
                      <p className="text-foreground flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(data.bankAccount.modifiedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        )}

        {/* Retiral Tab */}
        <TabsContent value="retiral" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <PiggyBank className="h-5 w-5 mr-2" />
                  Salary Break-Up & Retiral Benefits
                </CardTitle>
                <CardDescription>Complete salary structure and retirement benefits</CardDescription>
              </div>

            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stipend Bifurcation */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Stipend Bifurcation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                  {isEditMode ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="basicSalary">Basic (100%)</Label>
                        <Input 
                          id="basicSalary" 
                          type="number" 
                          value={data.retiral.basicSalary || 0} 
                          onChange={(e) => onChange?.('basicSalary', parseFloat(e.target.value) || 0)}
                          disabled={!effectiveCanEditRetiral}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="houseRentAllowance">House Rent Allowance (0%)</Label>
                        <Input 
                          id="houseRentAllowance" 
                          type="number" 
                          value={data.retiral.houseRentAllowance || 0} 
                          onChange={(e) => onChange?.('houseRentAllowance', parseFloat(e.target.value) || 0)}
                          disabled={!effectiveCanEditRetiral}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialAllowance">Special Allowance (0%)</Label>
                        <Input 
                          id="specialAllowance" 
                          type="number" 
                          value={data.retiral.specialAllowance || 0} 
                          onChange={(e) => onChange?.('specialAllowance', parseFloat(e.target.value) || 0)}
                          disabled={!effectiveCanEditRetiral}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="monthlyGross">Monthly Gross</Label>
                        <Input 
                          id="monthlyGross" 
                          type="number" 
                          defaultValue={((data.retiral.basicSalary || 0) + (data.retiral.houseRentAllowance || 0) + (data.retiral.specialAllowance || 0))} 
                          disabled={true}
                          readOnly
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Basic (100%)</label>
                        <p className="text-foreground font-medium">₹{data.retiral.basicSalary?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">House Rent Allowance (0%)</label>
                        <p className="text-foreground font-medium">₹{data.retiral.houseRentAllowance?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Special Allowance (0%)</label>
                        <p className="text-foreground font-medium">₹{data.retiral.specialAllowance?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Monthly Gross</label>
                        <p className="text-foreground font-bold text-lg">
                          ₹{((data.retiral.basicSalary || 0) + (data.retiral.houseRentAllowance || 0) + (data.retiral.specialAllowance || 0)).toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Organization's Statutory Liabilities */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Organization's Statutory Liabilities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                  {isEditMode ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="employerPF">Provident Fund</Label>
                        <Input 
                          id="employerPF" 
                          type="number" 
                          value={data.retiral.employerPF || 0} 
                          onChange={(e) => onChange?.('employerPF', parseFloat(e.target.value) || 0)}
                          disabled={!effectiveCanEditRetiral}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employerESI">Employee's Insurance</Label>
                        <Input 
                          id="employerESI" 
                          type="number" 
                          value={data.retiral.employerESI || 0} 
                          onChange={(e) => onChange?.('employerESI', parseFloat(e.target.value) || 0)}
                          disabled={!effectiveCanEditRetiral}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="totalStatutoryLiabilities">Total - Organization's Statutory Liabilities</Label>
                        <Input 
                          id="totalStatutoryLiabilities" 
                          type="number" 
                          defaultValue={((data.retiral.employerPF || 0) + (data.retiral.employerESI || 0))} 
                          disabled={true}
                          readOnly
                          className="font-bold"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Provident Fund</label>
                        <p className="text-foreground font-medium">₹{data.retiral.employerPF?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Employee's Insurance</label>
                        <p className="text-foreground font-medium">₹{data.retiral.employerESI?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-muted-foreground">Total - Organization's Statutory Liabilities</label>
                        <p className="text-foreground font-bold">
                          ₹{((data.retiral.employerPF || 0) + (data.retiral.employerESI || 0)).toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Deductions */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Deductions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-red-50 rounded-lg">
                  {isEditMode ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="employeePF">Employee's Provident Fund</Label>
                        <Input 
                          id="employeePF" 
                          type="number" 
                          value={data.retiral.employeePF || 0} 
                          onChange={(e) => onChange?.('employeePF', parseFloat(e.target.value) || 0)}
                          disabled={!effectiveCanEditRetiral}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employeeESI">Employee's State Insurance</Label>
                        <Input 
                          id="employeeESI" 
                          type="number" 
                          value={data.retiral.employeeESI || 0} 
                          onChange={(e) => onChange?.('employeeESI', parseFloat(e.target.value) || 0)}
                          disabled={!effectiveCanEditRetiral}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="professionalTax">Professional Tax</Label>
                        <Input 
                          id="professionalTax" 
                          type="number" 
                          value={data.retiral.professionalTax || 0} 
                          onChange={(e) => onChange?.('professionalTax', parseFloat(e.target.value) || 0)}
                          disabled={!effectiveCanEditRetiral}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="incomeTax">Income Tax ***</Label>
                        <Input 
                          id="incomeTax" 
                          type="number" 
                          value={data.retiral.incomeTax || 0} 
                          onChange={(e) => onChange?.('incomeTax', parseFloat(e.target.value) || 0)}
                          disabled={!effectiveCanEditRetiral}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalDeductions">Total Stipend Deduction</Label>
                        <Input 
                          id="totalDeductions" 
                          type="number" 
                          defaultValue={((data.retiral.employeePF || 0) + (data.retiral.employeeESI || 0) + (data.retiral.professionalTax || 0) + (data.retiral.incomeTax || 0))} 
                          disabled={true}
                          readOnly
                          className="font-bold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="netTakeHome">Net Take Home</Label>
                        <Input 
                          id="netTakeHome" 
                          type="number" 
                          value={data.retiral.netTakeHome || 0} 
                          onChange={(e) => onChange?.('netTakeHome', parseFloat(e.target.value) || 0)}
                          disabled={!effectiveCanEditRetiral}
                          className="font-bold text-green-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="costToCompany">Cost To Company</Label>
                        <Input 
                          id="costToCompany" 
                          type="number" 
                          value={data.retiral.costToCompany || 0} 
                          onChange={(e) => onChange?.('costToCompany', parseFloat(e.target.value) || 0)}
                          disabled={!effectiveCanEditRetiral}
                          className="font-bold text-blue-600"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pfTotal">PF Total</Label>
                        <Input 
                          id="pfTotal" 
                          type="number" 
                          value={data.retiral.pfTotal || 0} 
                          onChange={(e) => onChange?.('pfTotal', parseFloat(e.target.value) || 0)}
                          disabled={!effectiveCanEditRetiral}
                          className="font-bold"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Employee's Provident Fund</label>
                        <p className="text-foreground font-medium">₹{data.retiral.employeePF?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Employee's State Insurance</label>
                        <p className="text-foreground font-medium">₹{data.retiral.employeeESI?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Professional Tax</label>
                        <p className="text-foreground font-medium">₹{data.retiral.professionalTax?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Income Tax ***</label>
                        <p className="text-foreground font-medium">₹{data.retiral.incomeTax?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Total Stipend Deduction</label>
                        <p className="text-foreground font-bold">
                          ₹{((data.retiral.employeePF || 0) + (data.retiral.employeeESI || 0) + (data.retiral.professionalTax || 0) + (data.retiral.incomeTax || 0)).toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Net Take Home</label>
                        <p className="text-foreground font-bold text-green-600">
                          ₹{data.retiral.netTakeHome?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">Cost To Company</label>
                        <p className="text-foreground font-bold text-blue-600">
                          ₹{data.retiral.costToCompany?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">PF Total</label>
                        <p className="text-foreground font-bold">
                          ₹{data.retiral.pfTotal?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <Separator />

              {/* Summary */}
              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-medium mb-3">Salary Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Gross Salary</p>
                    <p className="text-lg font-bold">
                      ₹{((data.retiral.basicSalary || 0) + (data.retiral.houseRentAllowance || 0) + (data.retiral.specialAllowance || 0)).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Total Deductions</p>
                    <p className="text-lg font-bold text-red-600">
                      ₹{((data.retiral.employeePF || 0) + (data.retiral.employeeESI || 0) + (data.retiral.professionalTax || 0) + (data.retiral.incomeTax || 0)).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Net Take Home</p>
                    <p className="text-lg font-bold text-green-600">
                      ₹{data.retiral.netTakeHome?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footnote */}
              <div className="text-xs text-muted-foreground">
                *** Income Tax deduction as per Income Tax Act, 1961 (if applicable)
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialInformation;


                    <>

                      <div className="space-y-2">

                        <Label htmlFor="employerPF">Provident Fund</Label>

                        <Input 

                          id="employerPF" 

                          type="number" 

                          defaultValue={data.retiral.employerPF || 0} 

                          disabled={!effectiveCanEditRetiral}

                        />

                      </div>

                      <div className="space-y-2">

                        <Label htmlFor="employerESI">Employee's Insurance</Label>

                        <Input 

                          id="employerESI" 

                          type="number" 

                          defaultValue={data.retiral.employerESI || 0} 

                          disabled={!effectiveCanEditRetiral}

                        />

                      </div>

                      <div className="space-y-2 md:col-span-2">

                        <Label htmlFor="totalStatutoryLiabilities">Total - Organization's Statutory Liabilities</Label>

                        <Input 

                          id="totalStatutoryLiabilities" 

                          type="number" 

                          defaultValue={((data.retiral.employerPF || 0) + (data.retiral.employerESI || 0))} 
                          disabled={true}

                          readOnly
                          className="font-bold"

                        />

                      </div>

                    </>

                  ) : (

                    <>

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-muted-foreground">Provident Fund</label>

                        <p className="text-foreground font-medium">₹{data.retiral.employerPF?.toLocaleString() || 'N/A'}</p>

                      </div>

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-muted-foreground">Employee's Insurance</label>

                        <p className="text-foreground font-medium">₹{data.retiral.employerESI?.toLocaleString() || 'N/A'}</p>

                      </div>

                      <div className="space-y-2 md:col-span-2">

                        <label className="text-sm font-medium text-muted-foreground">Total - Organization's Statutory Liabilities</label>

                        <p className="text-foreground font-bold">

                          ₹{((data.retiral.employerPF || 0) + (data.retiral.employerESI || 0)).toLocaleString()}

                        </p>

                      </div>

                    </>

                  )}

                </div>

              </div>



              <Separator />



              {/* Deductions */}

              <div>

                <h3 className="text-lg font-semibold mb-4 flex items-center">

                  <TrendingUp className="h-5 w-5 mr-2" />

                  Deductions

                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-red-50 rounded-lg">

                  {isEditMode ? (

                    <>

                      <div className="space-y-2">

                        <Label htmlFor="employeePF">Employee's Provident Fund</Label>

                        <Input 

                          id="employeePF" 

                          type="number" 

                          defaultValue={data.retiral.employeePF || 0} 

                          disabled={!effectiveCanEditRetiral}

                        />

                      </div>

                      <div className="space-y-2">

                        <Label htmlFor="employeeESI">Employee's State Insurance</Label>

                        <Input 

                          id="employeeESI" 

                          type="number" 

                          defaultValue={data.retiral.employeeESI || 0} 

                          disabled={!effectiveCanEditRetiral}

                        />

                      </div>

                      <div className="space-y-2">

                        <Label htmlFor="professionalTax">Professional Tax</Label>

                        <Input 

                          id="professionalTax" 

                          type="number" 

                          defaultValue={data.retiral.professionalTax || 0} 

                          disabled={!effectiveCanEditRetiral}

                        />

                      </div>

                      <div className="space-y-2">

                        <Label htmlFor="incomeTax">Income Tax ***</Label>

                        <Input 

                          id="incomeTax" 

                          type="number" 

                          defaultValue={data.retiral.incomeTax || 0} 

                          disabled={!effectiveCanEditRetiral}

                        />

                      </div>

                      <div className="space-y-2">

                        <Label htmlFor="totalDeductions">Total Stipend Deduction</Label>

                        <Input 

                          id="totalDeductions" 

                          type="number" 

                          defaultValue={((data.retiral.employeePF || 0) + (data.retiral.employeeESI || 0) + (data.retiral.professionalTax || 0) + (data.retiral.incomeTax || 0))} 
                          disabled={true}

                          readOnly
                          className="font-bold"

                        />

                      </div>

                      <div className="space-y-2">

                        <Label htmlFor="netTakeHome">Net Take Home</Label>

                        <Input 

                          id="netTakeHome" 

                          type="number" 

                          defaultValue={data.retiral.netTakeHome || 0} 

                          disabled={!effectiveCanEditRetiral}

                          className="font-bold text-green-600"

                        />

                      </div>

                      <div className="space-y-2">

                        <Label htmlFor="costToCompany">Cost To Company</Label>

                        <Input 

                          id="costToCompany" 

                          type="number" 

                          defaultValue={data.retiral.costToCompany || 0} 

                          disabled={!effectiveCanEditRetiral}

                          className="font-bold text-blue-600"

                        />

                      </div>

                      <div className="space-y-2">

                        <Label htmlFor="pfTotal">PF Total</Label>

                        <Input 

                          id="pfTotal" 

                          type="number" 

                          defaultValue={data.retiral.pfTotal || 0} 

                          disabled={!effectiveCanEditRetiral}

                          className="font-bold"

                        />

                      </div>

                    </>

                  ) : (

                    <>

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-muted-foreground">Employee's Provident Fund</label>

                        <p className="text-foreground font-medium">₹{data.retiral.employeePF?.toLocaleString() || 'N/A'}</p>

                      </div>

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-muted-foreground">Employee's State Insurance</label>

                        <p className="text-foreground font-medium">₹{data.retiral.employeeESI?.toLocaleString() || 'N/A'}</p>

                      </div>

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-muted-foreground">Professional Tax</label>

                        <p className="text-foreground font-medium">₹{data.retiral.professionalTax?.toLocaleString() || 'N/A'}</p>

                      </div>

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-muted-foreground">Income Tax ***</label>

                        <p className="text-foreground font-medium">₹{data.retiral.incomeTax?.toLocaleString() || 'N/A'}</p>

                      </div>

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-muted-foreground">Total Stipend Deduction</label>

                        <p className="text-foreground font-bold">

                          ₹{((data.retiral.employeePF || 0) + (data.retiral.employeeESI || 0) + (data.retiral.professionalTax || 0) + (data.retiral.incomeTax || 0)).toLocaleString()}

                        </p>

                      </div>

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-muted-foreground">Net Take Home</label>

                        <p className="text-foreground font-bold text-green-600">

                          ₹{data.retiral.netTakeHome?.toLocaleString() || 'N/A'}

                        </p>

                      </div>

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-muted-foreground">Cost To Company</label>

                        <p className="text-foreground font-bold text-blue-600">

                          ₹{data.retiral.costToCompany?.toLocaleString() || 'N/A'}

                        </p>

                      </div>

                      <div className="space-y-2">

                        <label className="text-sm font-medium text-muted-foreground">PF Total</label>

                        <p className="text-foreground font-bold">

                          ₹{data.retiral.pfTotal?.toLocaleString() || 'N/A'}

                        </p>

                      </div>

                    </>

                  )}

                </div>

              </div>



              <Separator />



              {/* Summary */}

              <div className="bg-muted/30 p-4 rounded-lg">

                <h4 className="font-medium mb-3">Salary Summary</h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <div className="text-center">

                    <p className="text-sm text-muted-foreground">Gross Salary</p>

                    <p className="text-lg font-bold">

                      ₹{((data.retiral.basicSalary || 0) + (data.retiral.houseRentAllowance || 0) + (data.retiral.specialAllowance || 0)).toLocaleString()}

                    </p>

                  </div>

                  <div className="text-center">

                    <p className="text-sm text-muted-foreground">Total Deductions</p>

                    <p className="text-lg font-bold text-red-600">

                      ₹{((data.retiral.employeePF || 0) + (data.retiral.employeeESI || 0) + (data.retiral.professionalTax || 0) + (data.retiral.incomeTax || 0)).toLocaleString()}

                    </p>

                  </div>

                  <div className="text-center">

                    <p className="text-sm text-muted-foreground">Net Take Home</p>

                    <p className="text-lg font-bold text-green-600">

                      ₹{data.retiral.netTakeHome?.toLocaleString() || 'N/A'}

                    </p>

                  </div>

                </div>

              </div>



              {/* Footnote */}

              <div className="text-xs text-muted-foreground">

                *** Income Tax deduction as per Income Tax Act, 1961 (if applicable)

              </div>

            </CardContent>

          </Card>

        </TabsContent>

      </Tabs>

    </div>

  );

};



export default FinancialInformation;


