export interface PayrollRun {
  id: string;
  month: string;
  year: number;
  status: 'draft' | 'processing' | 'completed' | 'paid';
  totalEmployees: number;
  totalAmount: number;
  createdDate: string;
  processedBy: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  payrollRunId: string;
  month: string;
  year: number;
  basicSalary: number;
  allowances: SalaryComponent[];
  deductions: SalaryComponent[];
  grossPay: number;
  netPay: number;
  taxDeducted: number;
}

export interface SalaryComponent {
  name: string;
  amount: number;
  type: 'allowance' | 'deduction';
}

export interface ExpenseClaim {
  id: string;
  employeeId: string;
  employeeName: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  approver?: string;
  receipts: string[];
  // New claim schema fields
  reportingManager: string;
  fromDate: string;
  toDate: string;
  location: string;
  currency: string;
  billNumber: string;
  percentageOfOfficialUse: number;
  vendor: string;
  comment: string;
}