import React from 'react';
import { BarChart3, IndianRupee, TrendingUp, Users, Award } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const AdminAnalyticsPage = () => {
  const departments = [
    { name: 'Production', employees: 450, avgAttendance: 98, productivity: 95, budget: 4500000, expenses: 4250000 },
    { name: 'Quality Control', employees: 125, avgAttendance: 95, productivity: 92, budget: 1250000, expenses: 1180000 },
    { name: 'Engineering', employees: 200, avgAttendance: 97, productivity: 94, budget: 2500000, expenses: 2375000 },
    { name: 'Sales & Marketing', employees: 180, avgAttendance: 96, productivity: 91, budget: 1800000, expenses: 1710000 },
    { name: 'Administration', employees: 92, avgAttendance: 99, productivity: 96, budget: 1020000, expenses: 995000 },
    { name: 'R&D', employees: 200, avgAttendance: 94, productivity: 93, budget: 1405000, expenses: 1320000 }
  ];

  // Pie Chart Data - Employee Distribution
  const employeeDistData = departments.map(d => ({
    name: d.name,
    value: d.employees
  }));

  // Bar Chart Data - Budget vs Expenses
  const budgetData = departments.map(d => ({
    name: d.name.substring(0, 10),
    Budget: d.budget / 100000,
    Expenses: d.expenses / 100000
  }));

  // Line Chart Data - Attendance Trend
  const attendanceData = [
    { month: 'Jul', attendance: 94 },
    { month: 'Aug', attendance: 95 },
    { month: 'Sep', attendance: 96 },
    { month: 'Oct', attendance: 95.5 },
    { month: 'Nov', attendance: 97 },
    { month: 'Dec', attendance: 96.8 }
  ];

  // Productivity Bar Chart
  const productivityData = departments.map(d => ({
    name: d.name.substring(0, 10),
    Productivity: d.productivity,
    Attendance: d.avgAttendance
  }));

  const COLORS = ['#0B4DA2', '#05CD99', '#FFB547', '#EE5D50', '#87CEEB', '#9333EA'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-4 rounded-2xl"><BarChart3 size={32} /></div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Department Analytics</h1>
            <p className="text-blue-100">View comprehensive analytics and insights</p>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-[24px] text-white shadow-lg">
          <IndianRupee size={28} className="mb-3" />
          <p className="text-3xl font-bold mb-2">₹1.24 Cr</p>
          <p className="text-sm text-blue-100">Monthly Payroll Expense</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-[24px] text-white shadow-lg">
          <TrendingUp size={28} className="mb-3" />
          <p className="text-3xl font-bold mb-2">96.8%</p>
          <p className="text-sm text-green-100">Overall Productivity</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-[24px] text-white shadow-lg">
          <Users size={28} className="mb-3" />
          <p className="text-3xl font-bold mb-2">1,247</p>
          <p className="text-sm text-purple-100">Total Employees</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-[24px] text-white shadow-lg">
          <Award size={28} className="mb-3" />
          <p className="text-3xl font-bold mb-2">6</p>
          <p className="text-sm text-orange-100">Departments</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Employee Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#1B254B] mb-4 text-lg">Employee Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={employeeDistData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {employeeDistData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {employeeDistData.map((dept, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                <span className="text-gray-600">{dept.name}: {dept.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget vs Expenses Bar Chart */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#1B254B] mb-4 text-lg">Budget vs Expenses (₹ Lakhs)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Budget" fill="#0B4DA2" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Expenses" fill="#05CD99" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Attendance Trend Line Chart */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#1B254B] mb-4 text-lg">Attendance Trend (6 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[90, 100]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="attendance" stroke="#0B4DA2" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Productivity vs Attendance */}
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#1B254B] mb-4 text-lg">Productivity vs Attendance (%)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[85, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Productivity" fill="#FFB547" radius={[8, 8, 0, 0]} />
              <Bar dataKey="Attendance" fill="#9333EA" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Department Comparison Table */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-[#1B254B] text-lg">Department Performance Comparison</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Department</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Employees</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Attendance</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Productivity</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Budget</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Expenses</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Utilization</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, idx) => {
                const utilization = ((dept.expenses / dept.budget) * 100).toFixed(1);
                return (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                        <span className="text-sm font-bold text-[#1B254B]">{dept.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-700">{dept.employees}</span>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm font-bold ${dept.avgAttendance >= 97 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {dept.avgAttendance}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`text-sm font-bold ${dept.productivity >= 94 ? 'text-green-600' : 'text-yellow-600'}`}>
                        {dept.productivity}%
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-700">₹{(dept.budget / 100000).toFixed(2)}L</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-700">₹{(dept.expenses / 100000).toFixed(2)}L</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden w-24">
                            <div 
                              className={`h-full ${parseFloat(utilization) > 95 ? 'bg-red-500' : parseFloat(utilization) > 85 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                              style={{ width: `${utilization}%` }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{utilization}%</p>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
