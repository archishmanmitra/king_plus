import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Printer, FileText, Calendar } from 'lucide-react';
import { Payslip, SalaryComponent } from '@/types/payroll';

interface PayslipViewProps {
  employeeId: string;
  month: number;
  year: number;
}

const PayslipView: React.FC<PayslipViewProps> = ({ employeeId, month, year }) => {
  const [loading, setLoading] = useState(true);
  const [payslip, setPayslip] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const payslipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchPayslip();
  }, [employeeId, month, year]);

  const fetchPayslip = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Generate payslip
      const response = await fetch(
        `http://localhost:5001/api/payroll/generate/${employeeId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ month, year }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to generate payslip');
      }

      const result = await response.json();
      setPayslip(result.payslip);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!payslipRef.current) return;

    // Create a printable version
    const printWindow = window.open('', '', 'width=800,height=600');
    if (!printWindow) return;

    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Payslip - ${payslip.employeeName} - ${getMonthName(month)} ${year}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
          .header h1 { font-size: 24px; margin-bottom: 5px; }
          .header p { font-size: 12px; color: #666; }
          .title { text-align: center; background: #000; color: white; padding: 10px; margin: 20px 0; font-size: 18px; font-weight: bold; }
          .info-section { margin-bottom: 20px; }
          .info-row { display: flex; margin-bottom: 8px; }
          .info-label { font-weight: bold; width: 200px; }
          .info-value { flex: 1; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { border: 1px solid #000; padding: 8px; text-align: left; }
          th { background: #f0f0f0; font-weight: bold; }
          .amount { text-align: right; }
          .total-row { font-weight: bold; background: #f9f9f9; }
          .net-pay { background: #000; color: white; font-size: 16px; }
          .deduction-note { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; margin: 15px 0; }
          .deduction-note strong { color: #856404; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #000; }
          .signature { margin-top: 40px; display: flex; justify-content: space-between; }
          .signature div { text-align: center; }
          .signature-line { border-top: 1px solid #000; width: 200px; margin: 0 auto; padding-top: 5px; }
          @media print {
            body { padding: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        ${generatePayslipHTML()}
      </body>
      </html>
    `;

    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const generatePayslipHTML = () => {
    if (!payslip) return '';

    const allowances = typeof payslip.allowances === 'string' 
      ? JSON.parse(payslip.allowances) 
      : payslip.allowances;
    
    const deductions = typeof payslip.deductions === 'string'
      ? JSON.parse(payslip.deductions)
      : payslip.deductions;

    const absenceDeduction = deductions.find((d: SalaryComponent) => d.name.includes('Absence'));

    return `
      <div class="header">
        <h1>Kin-G Technologies</h1>
        <p>Registered Office: Kolkata, West Bengal</p>
      </div>

      <div class="title">Payslip - ${getMonthName(month)} ${year}</div>

      <div class="info-section">
        <div class="info-row">
          <div class="info-label">Employee Name:</div>
          <div class="info-value">${payslip.employeeName}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Employee ID:</div>
          <div class="info-value">${payslip.employeeId || 'N/A'}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Designation:</div>
          <div class="info-value">System Engineer</div>
        </div>
        <div class="info-row">
          <div class="info-label">Working Period:</div>
          <div class="info-value">${formatDate(payslip.cycleStart)} - ${formatDate(payslip.cycleEnd)}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Total Working Days:</div>
          <div class="info-value">${payslip.workingDays || 0}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Total Absent:</div>
          <div class="info-value">${payslip.absentDays || 0}</div>
        </div>
        <div class="info-row">
          <div class="info-label">Total Leave:</div>
          <div class="info-value">${payslip.leaveDays || 0}</div>
        </div>
      </div>

      ${absenceDeduction && payslip.absentDays > 0 ? `
        <div class="deduction-note">
          <strong>⚠ Absence Deduction Notice</strong><br/>
          <span style="font-size: 14px;">
            ${payslip.absentDays} absent day(s) detected. Deduction: ${payslip.absentDays} days × 1.5 = ₹${absenceDeduction.amount.toFixed(2)}<br/>
            Calculation: Per day salary (₹${(payslip.basicSalary / 30).toFixed(2)}) × ${payslip.absentDays} × 1.5 = ₹${absenceDeduction.amount.toFixed(2)}
          </span>
        </div>
      ` : ''}

      <table>
        <thead>
          <tr>
            <th>Particulars</th>
            <th class="amount">Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Basic Salary</td>
            <td class="amount">${payslip.basicSalary.toFixed(2)}</td>
          </tr>
          ${allowances.map((a: SalaryComponent) => `
            <tr>
              <td>${a.name}</td>
              <td class="amount">${a.amount.toFixed(2)}</td>
            </tr>
          `).join('')}
          ${allowances.filter((a: SalaryComponent) => a.amount === 0).length > 0 ? `
            <tr>
              <td>HRA</td>
              <td class="amount">00.00</td>
            </tr>
            <tr>
              <td>Special Allowance</td>
              <td class="amount">00.00</td>
            </tr>
          ` : ''}
          <tr>
            <td>Other Allowance</td>
            <td class="amount">00.00</td>
          </tr>
          <tr class="total-row">
            <td>Gross Salary</td>
            <td class="amount">${payslip.grossPay.toFixed(2)}</td>
          </tr>
          <tr>
            <td>Deductions (PF/ESI/TDS)</td>
            <td class="amount">${deductions.filter((d: SalaryComponent) => !d.name.includes('Absence')).reduce((sum: number, d: SalaryComponent) => sum + d.amount, 0).toFixed(2)}</td>
          </tr>
          ${absenceDeduction ? `
            <tr style="background: #ffebee;">
              <td><strong>${absenceDeduction.name}</strong></td>
              <td class="amount"><strong>${absenceDeduction.amount.toFixed(2)}</strong></td>
            </tr>
          ` : ''}
          <tr class="net-pay">
            <td>Net Salary Payable</td>
            <td class="amount">${payslip.netPay.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div class="footer">
        <p style="margin-bottom: 10px;"><strong>Authorised Signature</strong></p>
        <div class="signature">
          <div>
            <div style="margin-bottom: 50px;"></div>
            <div class="signature-line">(HR & Accounts Department)</div>
          </div>
          <div>
            <div style="margin-bottom: 50px;"></div>
            <div class="signature-line">Kin-G Technologies</div>
          </div>
        </div>
      </div>
    `;
  };

  const getMonthName = (monthNum: number) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[monthNum - 1];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-destructive">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  if (!payslip) return null;

  const allowances = typeof payslip.allowances === 'string' 
    ? JSON.parse(payslip.allowances) 
    : payslip.allowances;
  
  const deductions = typeof payslip.deductions === 'string'
    ? JSON.parse(payslip.deductions)
    : payslip.deductions;

  const absenceDeduction = deductions.find((d: SalaryComponent) => d.name.includes('Absence'));

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Payslip - {getMonthName(month)} {year}
              </CardTitle>
              <CardDescription>
                Generated payslip with attendance-based deductions
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Payslip Preview */}
      <Card ref={payslipRef}>
        <CardContent className="p-8">
          {/* Company Header */}
          <div className="text-center border-b-2 pb-4 mb-6">
            <h1 className="text-2xl font-bold">Kin-G Technologies</h1>
            <p className="text-sm text-muted-foreground">Registered Office: Kolkata, West Bengal</p>
          </div>

          {/* Title */}
          <div className="bg-primary text-primary-foreground text-center py-3 rounded-lg mb-6">
            <h2 className="text-xl font-bold">Payslip - {getMonthName(month)} {year}</h2>
          </div>

          {/* Employee Information */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold w-40">Employee Name:</span>
                <span>{payslip.employeeName}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-40">Employee ID:</span>
                <span>{payslip.employeeId || 'N/A'}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-40">Designation:</span>
                <span>System Engineer</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex">
                <span className="font-semibold w-40">Working Period:</span>
                <span>{formatDate(payslip.cycleStart)} - {formatDate(payslip.cycleEnd)}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-40">Total Working Days:</span>
                <span>{payslip.workingDays || 0}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-40">Total Absent:</span>
                <span className="text-red-600 font-medium">{payslip.absentDays || 0}</span>
              </div>
              <div className="flex">
                <span className="font-semibold w-40">Total Leave:</span>
                <span>{payslip.leaveDays || 0}</span>
              </div>
            </div>
          </div>

          {/* Absence Warning */}
          {absenceDeduction && payslip.absentDays > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="font-semibold text-yellow-800 mb-2">⚠ Absence Deduction Notice</div>
              <div className="text-sm text-yellow-700">
                <p>{payslip.absentDays} absent day(s) detected. Deduction calculation:</p>
                <p className="mt-1">
                  Per day salary: ₹{(payslip.basicSalary / 30).toFixed(2)} × {payslip.absentDays} days × 1.5 = 
                  <strong className="ml-1">₹{absenceDeduction.amount.toFixed(2)}</strong>
                </p>
              </div>
            </div>
          )}

          {/* Salary Details Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 border-b">Particulars</th>
                  <th className="text-right p-3 border-b">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3 border-b">Basic Salary</td>
                  <td className="p-3 border-b text-right">{payslip.basicSalary.toFixed(2)}</td>
                </tr>
                {allowances.map((allowance: SalaryComponent, index: number) => (
                  <tr key={index}>
                    <td className="p-3 border-b">{allowance.name}</td>
                    <td className="p-3 border-b text-right">{allowance.amount.toFixed(2)}</td>
                  </tr>
                ))}
                {allowances.length === 0 && (
                  <>
                    <tr>
                      <td className="p-3 border-b">HRA</td>
                      <td className="p-3 border-b text-right">00.00</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b">Special Allowance</td>
                      <td className="p-3 border-b text-right">00.00</td>
                    </tr>
                  </>
                )}
                <tr>
                  <td className="p-3 border-b">Other Allowance</td>
                  <td className="p-3 border-b text-right">00.00</td>
                </tr>
                <tr className="bg-muted font-semibold">
                  <td className="p-3 border-b">Gross Salary</td>
                  <td className="p-3 border-b text-right">{payslip.grossPay.toFixed(2)}</td>
                </tr>
                {deductions.map((deduction: SalaryComponent, index: number) => (
                  <tr key={index} className={deduction.name.includes('Absence') ? 'bg-red-50' : ''}>
                    <td className="p-3 border-b">
                      {deduction.name}
                      {deduction.name.includes('Absence') && <Badge variant="destructive" className="ml-2">Absence</Badge>}
                    </td>
                    <td className="p-3 border-b text-right">{deduction.amount.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-primary text-primary-foreground font-bold">
                  <td className="p-3">Net Salary Payable</td>
                  <td className="p-3 text-right">{payslip.netPay.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t">
            <div className="mb-4">
              <p className="font-semibold">Authorised Signature</p>
            </div>
            <div className="flex justify-between mt-12">
              <div className="text-center">
                <div className="border-t border-black w-48 mx-auto pt-2">
                  <p className="text-sm">(HR & Accounts Department)</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-t border-black w-48 mx-auto pt-2">
                  <p className="text-sm">Kin-G Technologies</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PayslipView;

