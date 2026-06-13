import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Download, 
  Eye, 
  Calendar,
  TrendingUp,
  PieChart,
  Briefcase,
  Home,
  Heart,
  Shield,
  CreditCard,
  FileText
} from 'lucide-react';

const months = [
  "January 2024", "February 2024", "March 2024", "April 2024", 
  "May 2024", "June 2024", "July 2024", "August 2024",
  "September 2024", "October 2024", "November 2024", "December 2024"
];

const PayslipCard = ({ month, gross, net, onView, onDownload }) => (
  <div className="bg-white p-4 rounded-[20px] border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="flex justify-between items-start mb-3">
      <div>
        <h4 className="font-bold text-[#1B254B]">{month}</h4>
        <p className="text-xs text-gray-400 mt-1">Payslip</p>
      </div>
      <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Paid</span>
    </div>
    <div className="mb-4">
      <p className="text-xs text-gray-400 mb-1">Net Salary</p>
      <p className="text-2xl font-bold text-[#05CD99]">₹{net.toLocaleString()}</p>
      <p className="text-[10px] text-gray-400 mt-1">Gross: ₹{gross.toLocaleString()}</p>
    </div>
    <div className="flex gap-2">
      <button 
        onClick={onView}
        className="flex-1 bg-[#F4F7FE] text-[#0B4DA2] py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-blue-100 transition-colors active:scale-95"
      >
        <Eye size={14} /> View
      </button>
      <button 
        onClick={onDownload}
        className="flex-1 bg-[#042A5B] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#0B4DA2] transition-colors active:scale-95"
      >
        <Download size={14} /> Download
      </button>
    </div>
  </div>
);

export const PayrollPageOld = ({ user }) => {
  const [selectedMonth, setSelectedMonth] = useState("October 2024");
  const [payrollRecords, setPayrollRecords] = useState<any[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    fetch(`http://localhost:5000/api/payroll/${userId}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => setPayrollRecords(data))
      .catch(() => {});
  }, []);

  const getPayrollId = (month: string) => {
    const rec = payrollRecords.find(p => p.month === month);
    return rec?._id || null;
  };

  const handleView = (month: string) => {
    const id = getPayrollId(month);
    if (id) window.open(`http://localhost:5000/api/pdf/payslip/${id}`, '_blank');
    else alert(`No payslip record found for ${month}`);
  };

  const handleDownload = (month: string) => {
    const id = getPayrollId(month);
    if (id) {
      window.open(`http://localhost:5000/api/pdf/payslip/${id}`, '_blank');
    } else alert(`No payslip record found for ${month}`);
  };

  const earnings = {
    basic: 45000,
    hra: 18000,
    conveyance: 1600,
    specialAllowance: 15400,
    bonus: 5000
  };

  const deductions = {
    pf: 5400,
    esi: 675,
    professionalTax: 200,
    tds: 4500
  };

  const totalEarnings = Object.values(earnings).reduce((a, b) => a + b, 0);
  const totalDeductions = Object.values(deductions).reduce((a, b) => a + b, 0);
  const netSalary = totalEarnings - totalDeductions;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#042A5B] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl">
              <DollarSign size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Payroll & Salary</h1>
              <p className="text-blue-100 text-sm">{user.name} • {user.empId}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-xs text-blue-100 mb-1">Current Month Salary</p>
              <p className="text-2xl font-bold">₹{netSalary.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-xs text-blue-100 mb-1">YTD Earnings</p>
              <p className="text-2xl font-bold">₹{(netSalary * 10).toLocaleString()}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-xs text-blue-100 mb-1">Tax Deducted (YTD)</p>
              <p className="text-2xl font-bold">₹{(4500 * 10).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Month Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[#1B254B] text-lg">Salary Breakdown - {selectedMonth}</h3>
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 bg-[#F4F7FE] rounded-xl text-sm font-bold text-[#0B4DA2] outline-none border border-transparent focus:border-[#0B4DA2]/30"
              >
                {months.map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Earnings */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <TrendingUp size={18} className="text-green-600" />
                  </div>
                  <h4 className="font-bold text-[#1B254B]">Earnings</h4>
                </div>
                <div className="space-y-3">
                  {Object.entries(earnings).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-green-50 rounded-xl">
                      <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="font-bold text-[#1B254B]">₹{value.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-green-100 rounded-xl border-2 border-green-200">
                    <span className="font-bold text-[#1B254B]">Total Earnings</span>
                    <span className="font-bold text-green-700 text-lg">₹{totalEarnings.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <FileText size={18} className="text-red-600" />
                  </div>
                  <h4 className="font-bold text-[#1B254B]">Deductions</h4>
                </div>
                <div className="space-y-3">
                  {Object.entries(deductions).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-3 bg-red-50 rounded-xl">
                      <span className="text-sm text-gray-600 uppercase">{key}</span>
                      <span className="font-bold text-[#1B254B]">₹{value.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-red-100 rounded-xl border-2 border-red-200">
                    <span className="font-bold text-[#1B254B]">Total Deductions</span>
                    <span className="font-bold text-red-700 text-lg">₹{totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Salary */}
            <div className="mt-6 p-6 bg-gradient-to-r from-[#042A5B] to-[#0B4DA2] rounded-2xl text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Net Salary (Take Home)</p>
                  <p className="text-3xl font-bold">₹{netSalary.toLocaleString()}</p>
                </div>
                <button onClick={() => handleDownload(selectedMonth)} className="bg-white text-[#0B4DA2] px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-all active:scale-95">
                  <Download size={16} />
                  Download Payslip
                </button>
              </div>
            </div>
          </div>

          {/* Payslip History */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1B254B] text-lg mb-4">Payslip History (2024)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {payrollRecords.map((rec) => (
                <PayslipCard
                  key={rec._id}
                  month={rec.month}
                  gross={rec.grossSalary || totalEarnings}
                  net={rec.netSalary || netSalary}
                  onView={() => handleView(rec.month)}
                  onDownload={() => handleDownload(rec.month)}
                />
              ))}
              {payrollRecords.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-400">
                  No payslips found
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Tax Summary */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1B254B] text-lg mb-4 flex items-center gap-2">
              <PieChart size={20} className="text-[#0B4DA2]" />
              Tax Summary (FY 2024)
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Total Income</p>
                <p className="font-bold text-[#1B254B]">₹{(totalEarnings * 10).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Total Deductions</p>
                <p className="font-bold text-[#1B254B]">₹{(totalDeductions * 10).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">Tax Payable</p>
                <p className="font-bold text-[#1B254B]">₹{(4500 * 10).toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Investment Declarations */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1B254B] text-lg mb-4">Investment Declarations</h3>
            <div className="space-y-3">
              {[
                { icon: Home, label: "80C - HRA", amount: "₹1,50,000", color: "blue" },
                { icon: Heart, label: "80D - Medical", amount: "₹25,000", color: "red" },
                { icon: Shield, label: "80CCD - NPS", amount: "₹50,000", color: "green" }
              ].map((item, idx) => (
                <div key={idx} className={`p-3 bg-${item.color}-50 rounded-xl flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <item.icon size={16} className={`text-${item.color}-600`} />
                    <span className="text-sm font-bold text-[#1B254B]">{item.label}</span>
                  </div>
                  <span className="font-bold text-[#1B254B]">{item.amount}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-[#042A5B] text-white py-2 rounded-xl text-sm font-bold hover:bg-[#0B4DA2] transition-colors active:scale-95">
              Update Declarations
            </button>
          </div>

          {/* Form 16 */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1B254B] text-lg mb-4 flex items-center gap-2">
              <FileText size={20} className="text-[#0B4DA2]" />
              Form 16
            </h3>
            <div className="space-y-2">
              {["FY 2023-24", "FY 2022-23", "FY 2021-22"].map((year, idx) => (
                <button 
                  key={idx}
                  className="w-full p-3 bg-[#F4F7FE] rounded-xl flex items-center justify-between hover:bg-blue-100 transition-colors group"
                >
                  <span className="text-sm font-bold text-[#1B254B]">{year}</span>
                  <Download size={16} className="text-[#0B4DA2] group-hover:translate-y-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
