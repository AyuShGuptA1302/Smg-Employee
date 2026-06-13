import React, { useState } from 'react';
import {
  Users,
  Calendar,
  GraduationCap,
  BarChart3,
  Megaphone,
  Briefcase,
  Factory,
  Shield,
  Settings,
  FileText,
  IndianRupee,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  UserCheck,
  UserX,
  AlertCircle,
  TrendingUp,
  Award,
  BookOpen,
  Plus
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// User Management Page
export const AdminUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);

  const users = [
    { id: 1, name: 'Rajesh Kumar', empId: 'EMP1001', dept: 'Production', role: 'Senior Operator', email: 'rajesh.kumar@smg.com', phone: '+91 98765 43210', status: 'Active', joinDate: '10-Jan-2018', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh' },
    { id: 2, name: 'Priya Sharma', empId: 'EMP1025', dept: 'Quality Control', role: 'QC Inspector', email: 'priya.sharma@smg.com', phone: '+91 98765 43211', status: 'Active', joinDate: '15-Mar-2019', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
    { id: 3, name: 'Amit Patel', empId: 'EMP1089', dept: 'Engineering', role: 'Design Engineer', email: 'amit.patel@smg.com', phone: '+91 98765 43212', status: 'Active', joinDate: '20-Jul-2020', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit' },
    { id: 4, name: 'Sneha Gupta', empId: 'EMP1156', dept: 'Sales & Marketing', role: 'Marketing Manager', email: 'sneha.gupta@smg.com', phone: '+91 98765 43213', status: 'Active', joinDate: '05-Feb-2021', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha' },
    { id: 5, name: 'Vikram Singh', empId: 'EMP1234', dept: 'R&D', role: 'Research Scientist', email: 'vikram.singh@smg.com', phone: '+91 98765 43214', status: 'Active', joinDate: '12-Sep-2019', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram' },
    { id: 6, name: 'Anita Desai', empId: 'EMP1067', dept: 'Administration', role: 'Admin Officer', email: 'anita.desai@smg.com', phone: '+91 98765 43215', status: 'Active', joinDate: '18-Apr-2020', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita' },
    { id: 7, name: 'Rohit Verma', empId: 'EMP1145', dept: 'Production', role: 'Production Manager', email: 'rohit.verma@smg.com', phone: '+91 98765 43216', status: 'Inactive', joinDate: '22-Nov-2017', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit' },
    { id: 8, name: 'Kavita Joshi', empId: 'EMP1278', dept: 'HR', role: 'HR Manager', email: 'kavita.joshi@smg.com', phone: '+91 98765 43217', status: 'Active', joinDate: '30-Jun-2018', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita' },
    { id: 9, name: 'Suresh Reddy', empId: 'EMP1312', dept: 'Finance', role: 'Accountant', email: 'suresh.reddy@smg.com', phone: '+91 98765 43218', status: 'Active', joinDate: '14-Aug-2021', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh' },
    { id: 10, name: 'Meena Iyer', empId: 'EMP1401', dept: 'IT', role: 'System Administrator', email: 'meena.iyer@smg.com', phone: '+91 98765 43219', status: 'Active', joinDate: '25-Jan-2022', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meena' }
  ];

  const departments = ['Production', 'Quality Control', 'Engineering', 'Sales & Marketing', 'Administration', 'R&D', 'HR', 'Finance', 'IT', 'Logistics'];

  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === 'all' || user.dept === filterDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-4 rounded-2xl"><Users size={32} /></div>
            <div>
              <h1 className="text-3xl font-bold mb-2">User Management</h1>
              <p className="text-blue-100">Manage employee accounts and access control</p>
            </div>
          </div>
          <button className="bg-white text-[#0B4DA2] px-5 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2">
            <Plus size={18} />
            Add User
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <Users size={24} className="text-[#0B4DA2] mb-2" />
          <p className="text-2xl font-bold text-[#1B254B]">1,247</p>
          <p className="text-xs text-gray-500">Total Employees</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <UserCheck size={24} className="text-green-600 mb-2" />
          <p className="text-2xl font-bold text-[#1B254B]">1,189</p>
          <p className="text-xs text-gray-500">Active Users</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <UserX size={24} className="text-red-600 mb-2" />
          <p className="text-2xl font-bold text-[#1B254B]">58</p>
          <p className="text-xs text-gray-500">Inactive Users</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <Award size={24} className="text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-[#1B254B]">12</p>
          <p className="text-xs text-gray-500">Departments</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 flex-1 min-w-[300px]">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, ID, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm ml-2 w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="bg-gray-50 border-none outline-none text-sm px-4 py-2 rounded-xl font-bold"
            >
              <option value="all">All Departments</option>
              {departments.map((dept, idx) => (
                <option key={idx} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Employee</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Employee ID</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Department</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Role</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Contact</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full border-2 border-gray-200" />
                      <div>
                        <p className="text-sm font-bold text-[#1B254B]">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-bold text-[#0B4DA2]">{user.empId}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-700">{user.dept}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-700">{user.role}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-gray-500">{user.phone}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="p-2 bg-blue-50 text-[#0B4DA2] rounded-lg hover:bg-blue-100 transition-colors"
                        title="View Profile"
                      >
                        <Eye size={16} />
                      </button>
                      <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#1B254B]">Employee Profile</h3>
                <button onClick={() => setSelectedUser(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-6 mb-6">
                <img src={selectedUser.avatar} alt={selectedUser.name} className="w-24 h-24 rounded-2xl border-4 border-gray-200" />
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[#1B254B] mb-1">{selectedUser.name}</h2>
                  <p className="text-gray-600 mb-2">{selectedUser.role}</p>
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-[#0B4DA2] text-xs font-bold px-3 py-1 rounded-full">{selectedUser.empId}</span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      selectedUser.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {selectedUser.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Department</p>
                  <p className="font-bold text-[#1B254B]">{selectedUser.dept}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="font-bold text-[#1B254B]">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone</p>
                  <p className="font-bold text-[#1B254B]">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Join Date</p>
                  <p className="font-bold text-[#1B254B]">{selectedUser.joinDate}</p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button className="flex-1 bg-[#0B4DA2] text-white py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors">
                Edit Profile
              </button>
              <button className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors">
                View Full Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Attendance Administration Page
export const AdminAttendancePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const attendanceData = [
    { id: 1, name: 'Rajesh Kumar', empId: 'EMP1001', dept: 'Production', checkIn: '08:55 AM', checkOut: '06:12 PM', status: 'Present', hours: '9h 17m', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh' },
    { id: 2, name: 'Priya Sharma', empId: 'EMP1025', dept: 'Quality Control', checkIn: '09:00 AM', checkOut: '06:00 PM', status: 'Present', hours: '9h 00m', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya' },
    { id: 3, name: 'Amit Patel', empId: 'EMP1089', dept: 'Engineering', checkIn: '-', checkOut: '-', status: 'Leave', hours: '-', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit' },
    { id: 4, name: 'Sneha Gupta', empId: 'EMP1156', dept: 'Sales & Marketing', checkIn: '08:45 AM', checkOut: '-', status: 'Present', hours: 'In Progress', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha' },
    { id: 5, name: 'Vikram Singh', empId: 'EMP1234', dept: 'R&D', checkIn: '-', checkOut: '-', status: 'Absent', hours: '-', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram' },
    { id: 6, name: 'Anita Desai', empId: 'EMP1067', dept: 'Administration', checkIn: '09:15 AM', checkOut: '06:30 PM', status: 'Present', hours: '9h 15m', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita' },
    { id: 7, name: 'Rohit Verma', empId: 'EMP1145', dept: 'Production', checkIn: '09:30 AM', checkOut: '-', status: 'Present', hours: 'In Progress', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit' },
    { id: 8, name: 'Kavita Joshi', empId: 'EMP1278', dept: 'HR', checkIn: '-', checkOut: '-', status: 'Leave', hours: '-', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita' }
  ];

  const filteredAttendance = attendanceData.filter(emp => {
    const matchesSearch = searchQuery === '' ||
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.empId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || emp.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const presentCount = attendanceData.filter(e => e.status === 'Present').length;
  const absentCount = attendanceData.filter(e => e.status === 'Absent').length;
  const leaveCount = attendanceData.filter(e => e.status === 'Leave').length;
  const avgAttendance = ((presentCount / attendanceData.length) * 100).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-4 rounded-2xl"><Calendar size={32} /></div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Attendance Administration</h1>
            <p className="text-blue-100">Monitor and manage employee attendance records</p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <UserCheck size={24} className="text-green-600 mb-2" />
          <p className="text-2xl font-bold text-green-600">{presentCount}</p>
          <p className="text-xs text-gray-500">Present Today</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <UserX size={24} className="text-red-600 mb-2" />
          <p className="text-2xl font-bold text-red-600">{absentCount}</p>
          <p className="text-xs text-gray-500">Absent</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <Calendar size={24} className="text-yellow-600 mb-2" />
          <p className="text-2xl font-bold text-yellow-600">{leaveCount}</p>
          <p className="text-xs text-gray-500">On Leave</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <TrendingUp size={24} className="text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-purple-600">{avgAttendance}%</p>
          <p className="text-xs text-gray-500">Attendance Rate</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 flex-1">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm ml-2 w-full"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFilterStatus('all')} className={`px-4 py-2 rounded-xl text-xs font-bold ${filterStatus === 'all' ? 'bg-[#0B4DA2] text-white' : 'bg-gray-100 text-gray-600'}`}>
              All
            </button>
            <button onClick={() => setFilterStatus('Present')} className={`px-4 py-2 rounded-xl text-xs font-bold ${filterStatus === 'Present' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              Present
            </button>
            <button onClick={() => setFilterStatus('Absent')} className={`px-4 py-2 rounded-xl text-xs font-bold ${filterStatus === 'Absent' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              Absent
            </button>
            <button onClick={() => setFilterStatus('Leave')} className={`px-4 py-2 rounded-xl text-xs font-bold ${filterStatus === 'Leave' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              On Leave
            </button>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Employee</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Employee ID</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Department</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Check In</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Check Out</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Hours</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={emp.avatar} alt={emp.name} className="w-10 h-10 rounded-full border-2 border-gray-200" />
                      <span className="text-sm font-bold text-[#1B254B]">{emp.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-bold text-[#0B4DA2]">{emp.empId}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-700">{emp.dept}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-700">{emp.checkIn}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-700">{emp.checkOut}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-bold text-[#1B254B]">{emp.hours}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      emp.status === 'Present' ? 'bg-green-100 text-green-700' :
                      emp.status === 'Leave' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Training Management Page
export const AdminTrainingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const trainings = [
    { id: 1, title: 'Safety Training Program', type: 'Mandatory', dept: 'Production', date: '2024-12-15', duration: '4 hours', enrolled: 45, completed: 12, instructor: 'Vikram Singh' },
    { id: 2, title: 'Quality Control Standards', type: 'Mandatory', dept: 'Quality Control', date: '2024-12-18', duration: '6 hours', enrolled: 25, completed: 25, instructor: 'Priya Sharma' },
    { id: 3, title: 'Advanced Excel Skills', type: 'Optional', dept: 'All', date: '2024-12-20', duration: '8 hours', enrolled: 78, completed: 45, instructor: 'Sneha Gupta' },
    { id: 4, title: 'Leadership Workshop', type: 'Optional', dept: 'Management', date: '2024-12-22', duration: '12 hours', enrolled: 15, completed: 8, instructor: 'Amit Patel' },
    { id: 5, title: 'Technical Documentation', type: 'Mandatory', dept: 'Engineering', date: '2024-12-25', duration: '5 hours', enrolled: 32, completed: 18, instructor: 'Rohit Verma' }
  ];

  const filteredTrainings = trainings.filter(training => {
    const matchesSearch = searchQuery === '' || training.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || training.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalTrainings = trainings.length;
  const totalEnrolled = trainings.reduce((sum, t) => sum + t.enrolled, 0);
  const totalCompleted = trainings.reduce((sum, t) => sum + t.completed, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-4 rounded-2xl"><GraduationCap size={32} /></div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Training Management</h1>
              <p className="text-blue-100">Organize and track employee training programs</p>
            </div>
          </div>
          <button className="bg-white text-[#0B4DA2] px-5 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2">
            <Plus size={18} />
            Add Training
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <BookOpen size={24} className="text-[#0B4DA2] mb-2" />
          <p className="text-2xl font-bold text-[#1B254B]">{totalTrainings}</p>
          <p className="text-xs text-gray-500">Active Programs</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <Users size={24} className="text-green-600 mb-2" />
          <p className="text-2xl font-bold text-[#1B254B]">{totalEnrolled}</p>
          <p className="text-xs text-gray-500">Total Enrolled</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <CheckCircle size={24} className="text-purple-600 mb-2" />
          <p className="text-2xl font-bold text-[#1B254B]">{totalCompleted}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 flex-1">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search trainings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm ml-2 w-full"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setFilterType('all')} className={`px-4 py-2 rounded-xl text-xs font-bold ${filterType === 'all' ? 'bg-[#0B4DA2] text-white' : 'bg-gray-100 text-gray-600'}`}>
              All
            </button>
            <button onClick={() => setFilterType('Mandatory')} className={`px-4 py-2 rounded-xl text-xs font-bold ${filterType === 'Mandatory' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              Mandatory
            </button>
            <button onClick={() => setFilterType('Optional')} className={`px-4 py-2 rounded-xl text-xs font-bold ${filterType === 'Optional' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
              Optional
            </button>
          </div>
        </div>
      </div>

      {/* Training List */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Training Program</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Department</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Duration</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Enrolled</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Progress</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTrainings.map((training) => (
                <tr key={training.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-bold text-[#1B254B]">{training.title}</p>
                      <p className="text-xs text-gray-400">Instructor: {training.instructor}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      training.type === 'Mandatory' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {training.type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-700">{training.dept}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-700">{training.date}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-700">{training.duration}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-bold text-[#1B254B]">{training.enrolled}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full" style={{ width: `${(training.completed / training.enrolled) * 100}%` }}></div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">{training.completed}/{training.enrolled} completed</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-blue-50 text-[#0B4DA2] rounded-lg hover:bg-blue-100 transition-colors" title="View">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Edit">
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Department Analytics Page
export const AdminAnalyticsPage = () => {
  const departments = [
    { name: 'Production', employees: 450, avgAttendance: 98, productivity: 95, budget: '₹45,00,000', expenses: '₹42,50,000' },
    { name: 'Quality Control', employees: 125, avgAttendance: 95, productivity: 92, budget: '₹12,50,000', expenses: '₹11,80,000' },
    { name: 'Engineering', employees: 200, avgAttendance: 97, productivity: 94, budget: '₹25,00,000', expenses: '₹23,75,000' },
    { name: 'Sales & Marketing', employees: 180, avgAttendance: 96, productivity: 91, budget: '₹18,00,000', expenses: '₹17,10,000' },
    { name: 'Administration', employees: 92, avgAttendance: 99, productivity: 96, budget: '₹10,20,000', expenses: '₹9,95,000' },
    { name: 'R&D', employees: 200, avgAttendance: 94, productivity: 93, budget: '₹14,05,000', expenses: '₹13,20,000' }
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-[24px] text-white shadow-lg">
          <IndianRupee size={32} className="mb-3" />
          <p className="text-3xl font-bold mb-2">₹1.24 Cr</p>
          <p className="text-sm text-blue-100">Monthly Payroll Expense</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-[24px] text-white shadow-lg">
          <TrendingUp size={32} className="mb-3" />
          <p className="text-3xl font-bold mb-2">96.8%</p>
          <p className="text-sm text-green-100">Overall Productivity Score</p>
        </div>
      </div>

      {/* Department Comparison */}
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
                const utilization = ((parseFloat(dept.expenses.replace(/[₹,]/g, '')) / parseFloat(dept.budget.replace(/[₹,]/g, ''))) * 100).toFixed(1);
                return (
                  <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <span className="text-sm font-bold text-[#1B254B]">{dept.name}</span>
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
                      <span className="text-sm text-gray-700">{dept.budget}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-gray-700">{dept.expenses}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden w-24">
                            <div className={`h-full ${parseFloat(utilization) > 95 ? 'bg-red-500' : parseFloat(utilization) > 85 ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${utilization}%` }}></div>
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

// Announcements Management
export const AdminAnnouncementsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const announcements = [
    { id: 1, title: 'Holiday Announcement', content: 'Company will remain closed on Dec 25th for Christmas', date: '2024-12-10', author: 'Admin', status: 'Published' },
    { id: 2, title: 'New Policy Released', content: 'Updated Work from Home policy is now available', date: '2024-12-07', author: 'HR Team', status: 'Published' },
    { id: 3, title: 'Team Building Event', content: 'Annual team outing scheduled for Jan 15th', date: '2024-12-05', author: 'Admin', status: 'Draft' },
    { id: 4, title: 'System Maintenance', content: 'Portal will be under maintenance on Dec 20th', date: '2024-12-03', author: 'IT Team', status: 'Scheduled' }
  ];

  const filteredAnnouncements = announcements.filter(a =>
    searchQuery === '' || a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-4 rounded-2xl"><Megaphone size={32} /></div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Announcement Management</h1>
              <p className="text-blue-100">Create and manage company-wide announcements</p>
            </div>
          </div>
          <button className="bg-white text-[#0B4DA2] px-5 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2">
            <Plus size={18} />
            New Announcement
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm ml-2 w-full"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-bold text-[#1B254B] mb-1">{announcement.title}</h3>
                <p className="text-sm text-gray-600">{announcement.content}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                announcement.status === 'Published' ? 'bg-green-100 text-green-700' :
                announcement.status === 'Draft' ? 'bg-gray-100 text-gray-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {announcement.status}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>By {announcement.author}</span>
                <span>{announcement.date}</span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-blue-50 text-[#0B4DA2] rounded-lg hover:bg-blue-100 transition-colors"><Eye size={14} /></button>
                <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"><Edit size={14} /></button>
                <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Projects Listing
export const AdminProjectsPage = () => {
  const projects = [
    { id: 1, name: 'New Scooter Model Development', status: 'On Track', progress: 75, dept: 'R&D', team: 25, deadline: '2025-03-15' },
    { id: 2, name: 'Factory Automation Phase 2', status: 'At Risk', progress: 45, dept: 'Production', team: 18, deadline: '2025-01-30' },
    { id: 3, name: 'Quality Management System Upgrade', status: 'On Track', progress: 90, dept: 'Quality Control', team: 12, deadline: '2024-12-30' },
    { id: 4, name: 'Marketing Campaign Q1 2025', status: 'Delayed', progress: 30, dept: 'Sales & Marketing', team: 15, deadline: '2025-01-15' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-4 rounded-2xl"><Briefcase size={32} /></div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Project Listing</h1>
              <p className="text-blue-100">View and manage all organizational projects</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-[#1B254B]">23</p>
          <p className="text-xs text-gray-600">Active Projects</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-green-600">18</p>
          <p className="text-xs text-gray-600">On Track</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-yellow-600">3</p>
          <p className="text-xs text-gray-600">At Risk</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-red-600">2</p>
          <p className="text-xs text-gray-600">Delayed</p>
        </div>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-[#1B254B] mb-1">{project.name}</h3>
                <p className="text-xs text-gray-500">Department: {project.dept} • Team Size: {project.team} • Deadline: {project.deadline}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                project.status === 'On Track' ? 'bg-green-100 text-green-700' :
                project.status === 'At Risk' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {project.status}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className={`h-full ${project.progress >= 70 ? 'bg-green-500' : project.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${project.progress}%` }}></div>
                </div>
                <span className="text-sm font-bold text-[#1B254B]">{project.progress}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Production Area
export const AdminProductionPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-4 rounded-2xl"><Factory size={32} /></div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Production Area</h1>
            <p className="text-blue-100">Department-specific production workflows and monitoring</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-[#1B254B]">12,450</p>
          <p className="text-xs text-gray-600">Units Produced Today</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-green-600">98.5%</p>
          <p className="text-xs text-gray-600">Quality Pass Rate</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-[#1B254B]">450</p>
          <p className="text-xs text-gray-600">Production Staff</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <p className="text-sm text-gray-600">Monitor production metrics, track quality control, manage production schedules, and generate reports.</p>
      </div>
    </div>
  );
};

// Payroll Administration
export const AdminPayrollPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-4 rounded-2xl"><IndianRupee size={32} /></div>
          <div>
            <h1 className="text-3xl font-bold mb-2">Payroll Administration</h1>
            <p className="text-blue-100">Manage employee payroll and compensation</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-[#1B254B]">₹1,24,75,000</p>
          <p className="text-xs text-gray-600">Total Monthly Payroll</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-[#1B254B]">1,247</p>
          <p className="text-xs text-gray-600">Employees on Payroll</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <p className="text-2xl font-bold text-[#1B254B]">28th Dec</p>
          <p className="text-xs text-gray-600">Next Payout Date</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <p className="text-sm text-gray-600">Process payroll, manage salary structures, generate payslips, and handle tax calculations.</p>
      </div>
    </div>
  );
};