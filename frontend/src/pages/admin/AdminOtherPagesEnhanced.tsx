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
  Plus,
  Mail,
  Phone,
  MapPin,
  Building,
  Briefcase as BriefcaseIcon,
  CreditCard,
  Star,
  Activity
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// User Management Page with FULL DETAILS MODAL
export const AdminUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showFullDetails, setShowFullDetails] = useState(false);

  const users = [
    { 
      id: 1, 
      name: 'Rajesh Kumar', 
      empId: 'EMP1001', 
      dept: 'Production', 
      role: 'Senior Operator', 
      email: 'rajesh.kumar@smg.com', 
      phone: '+91 98765 43210', 
      status: 'Active', 
      joinDate: '10-Jan-2018', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
      // Full Details
      dateOfBirth: '15-Mar-1985',
      bloodGroup: 'O+',
      address: 'Flat 101, Green Park Apartments, Sector 15, Noida, UP - 201301',
      emergencyContact: { name: 'Sunita Kumar', relation: 'Wife', phone: '+91 98765 43299' },
      education: [
        { degree: 'Diploma in Mechanical Engineering', institution: 'Government Polytechnic', year: '2003-2006' },
        { degree: 'Higher Secondary', institution: 'St. Xavier School', year: '2003' }
      ],
      experience: [
        { company: 'SMG Scooters', position: 'Senior Operator', from: '2018', to: 'Present' },
        { company: 'Hero MotoCorp', position: 'Junior Operator', from: '2015', to: '2018' },
        { company: 'Bajaj Auto', position: 'Trainee', from: '2013', to: '2015' }
      ],
      salary: { basic: '₹45,000', hra: '₹18,000', allowances: '₹12,000', total: '₹75,000' },
      attendance: { present: 285, absent: 5, leave: 10, percentage: 95 },
      performance: { rating: 4.5, lastReview: '15-Oct-2024', nextReview: '15-Oct-2025' },
      documents: [
        { name: 'Aadhaar Card', status: 'Verified', uploadDate: '12-Jan-2018' },
        { name: 'PAN Card', status: 'Verified', uploadDate: '12-Jan-2018' },
        { name: 'Offer Letter', status: 'Active', uploadDate: '10-Jan-2018' },
        { name: 'Bank Details', status: 'Verified', uploadDate: '12-Jan-2018' }
      ],
      skills: ['Machine Operation', 'Quality Control', 'Team Leadership', 'Safety Compliance'],
      certifications: [
        { name: 'Industrial Safety', issuer: 'NSCI', year: '2019' },
        { name: 'Machine Operations', issuer: 'SMG Training', year: '2018' }
      ],
      reportingTo: 'Rohit Verma (Production Manager)',
      teamSize: 8,
      shift: 'General (9:00 AM - 6:00 PM)'
    },
    { 
      id: 2, 
      name: 'Priya Sharma', 
      empId: 'EMP1025', 
      dept: 'Quality Control', 
      role: 'QC Inspector', 
      email: 'priya.sharma@smg.com', 
      phone: '+91 98765 43211', 
      status: 'Active', 
      joinDate: '15-Mar-2019', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
      dateOfBirth: '22-Jun-1990',
      bloodGroup: 'A+',
      address: 'House 205, Park View Colony, Sector 22, Gurgaon, HR - 122015',
      emergencyContact: { name: 'Vikram Sharma', relation: 'Husband', phone: '+91 98765 43288' },
      education: [
        { degree: 'B.Tech in Quality Engineering', institution: 'Delhi Technical University', year: '2008-2012' }
      ],
      experience: [
        { company: 'SMG Scooters', position: 'QC Inspector', from: '2019', to: 'Present' },
        { company: 'Maruti Suzuki', position: 'Quality Analyst', from: '2016', to: '2019' }
      ],
      salary: { basic: '₹55,000', hra: '₹22,000', allowances: '₹15,000', total: '₹92,000' },
      attendance: { present: 295, absent: 2, leave: 8, percentage: 97 },
      performance: { rating: 4.8, lastReview: '20-Sep-2024', nextReview: '20-Sep-2025' },
      documents: [
        { name: 'Aadhaar Card', status: 'Verified', uploadDate: '18-Mar-2019' },
        { name: 'PAN Card', status: 'Verified', uploadDate: '18-Mar-2019' },
        { name: 'Degree Certificate', status: 'Verified', uploadDate: '18-Mar-2019' }
      ],
      skills: ['Quality Assurance', 'ISO Standards', 'Inspection', 'Documentation'],
      certifications: [
        { name: 'Six Sigma Green Belt', issuer: 'ASQ', year: '2021' },
        { name: 'ISO 9001 Auditor', issuer: 'BSI', year: '2020' }
      ],
      reportingTo: 'Vikram Singh (QC Manager)',
      teamSize: 5,
      shift: 'General (9:00 AM - 6:00 PM)'
    },
    { 
      id: 3, 
      name: 'Amit Patel', 
      empId: 'EMP1089', 
      dept: 'Engineering', 
      role: 'Design Engineer', 
      email: 'amit.patel@smg.com', 
      phone: '+91 98765 43212', 
      status: 'Active', 
      joinDate: '20-Jul-2020', 
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
      dateOfBirth: '10-Apr-1992',
      bloodGroup: 'B+',
      address: 'Apartment 3B, Tech Heights, Sector 30, Noida, UP - 201303',
      emergencyContact: { name: 'Neha Patel', relation: 'Sister', phone: '+91 98765 43277' },
      education: [
        { degree: 'M.Tech in Design Engineering', institution: 'IIT Delhi', year: '2016-2018' },
        { degree: 'B.Tech in Mechanical Engineering', institution: 'NIT Surat', year: '2010-2014' }
      ],
      experience: [
        { company: 'SMG Scooters', position: 'Design Engineer', from: '2020', to: 'Present' },
        { company: 'Mahindra & Mahindra', position: 'Junior Engineer', from: '2018', to: '2020' }
      ],
      salary: { basic: '₹75,000', hra: '₹30,000', allowances: '₹20,000', total: '₹1,25,000' },
      attendance: { present: 280, absent: 8, leave: 12, percentage: 93 },
      performance: { rating: 4.6, lastReview: '01-Aug-2024', nextReview: '01-Aug-2025' },
      documents: [
        { name: 'Aadhaar Card', status: 'Verified', uploadDate: '22-Jul-2020' },
        { name: 'PAN Card', status: 'Verified', uploadDate: '22-Jul-2020' },
        { name: 'M.Tech Certificate', status: 'Verified', uploadDate: '22-Jul-2020' }
      ],
      skills: ['CAD Design', 'Product Development', 'AutoCAD', 'SolidWorks', 'Innovation'],
      certifications: [
        { name: 'Certified CAD Professional', issuer: 'Autodesk', year: '2019' },
        { name: 'Design Thinking', issuer: 'IDEO', year: '2021' }
      ],
      reportingTo: 'Suresh Reddy (Engineering Head)',
      teamSize: 12,
      shift: 'Flexible (10:00 AM - 7:00 PM)'
    }
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

  const handleViewFullDetails = (user) => {
    setSelectedUser(user);
    setShowFullDetails(true);
  };

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
                        onClick={() => handleViewFullDetails(user)}
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

      {/* FULL DETAILS MODAL */}
      {showFullDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setShowFullDetails(false)}>
          <div className="bg-white rounded-[28px] max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] p-6 rounded-t-[28px] text-white z-10">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-6 flex-1">
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="w-24 h-24 rounded-2xl border-4 border-white/20 shadow-lg" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold">{selectedUser.name}</h2>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                        selectedUser.status === 'Active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                        {selectedUser.status}
                      </span>
                    </div>
                    <p className="text-blue-100 mb-3">{selectedUser.role} • {selectedUser.dept} Department</p>
                    <div className="flex gap-6 text-sm flex-wrap">
                      <div>
                        <span className="text-blue-200">Employee ID:</span>
                        <span className="ml-2 font-bold">{selectedUser.empId}</span>
                      </div>
                      <div>
                        <span className="text-blue-200">Join Date:</span>
                        <span className="ml-2 font-bold">{selectedUser.joinDate}</span>
                      </div>
                      <div>
                        <span className="text-blue-200">Reporting To:</span>
                        <span className="ml-2 font-bold">{selectedUser.reportingTo}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={() => setShowFullDetails(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Contact & Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                    <Phone size={20} className="text-[#0B4DA2]" />
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="text-sm font-bold text-[#1B254B]">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <p className="text-sm font-bold text-[#1B254B]">{selectedUser.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Address</p>
                      <p className="text-sm text-gray-700">{selectedUser.address}</p>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                    <Users size={20} className="text-[#0B4DA2]" />
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Date of Birth</p>
                        <p className="text-sm font-bold text-[#1B254B]">{selectedUser.dateOfBirth}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Blood Group</p>
                        <p className="text-sm font-bold text-[#1B254B]">{selectedUser.bloodGroup}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Emergency Contact</p>
                      <p className="text-sm font-bold text-[#1B254B]">{selectedUser.emergencyContact.name}</p>
                      <p className="text-xs text-gray-500">{selectedUser.emergencyContact.relation} • {selectedUser.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <p className="text-xs text-blue-600 font-bold mb-1">Shift Timing</p>
                  <p className="text-lg font-bold text-[#1B254B]">{selectedUser.shift}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <p className="text-xs text-green-600 font-bold mb-1">Team Size</p>
                  <p className="text-lg font-bold text-[#1B254B]">{selectedUser.teamSize} Members</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                  <p className="text-xs text-purple-600 font-bold mb-1">Performance Rating</p>
                  <p className="text-lg font-bold text-[#1B254B]">{selectedUser.performance.rating} / 5.0</p>
                </div>
              </div>

              {/* Salary Details */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                  <IndianRupee size={20} className="text-[#0B4DA2]" />
                  Salary Structure
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Basic Salary</p>
                    <p className="text-lg font-bold text-[#1B254B]">{selectedUser.salary.basic}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">HRA</p>
                    <p className="text-lg font-bold text-[#1B254B]">{selectedUser.salary.hra}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Allowances</p>
                    <p className="text-lg font-bold text-[#1B254B]">{selectedUser.salary.allowances}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total (Monthly)</p>
                    <p className="text-xl font-bold text-green-600">{selectedUser.salary.total}</p>
                  </div>
                </div>
              </div>

              {/* Attendance Overview */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                  <Calendar size={20} className="text-[#0B4DA2]" />
                  Attendance Overview (This Year)
                </h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedUser.attendance.present}</p>
                    <p className="text-xs text-gray-500">Present</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{selectedUser.attendance.absent}</p>
                    <p className="text-xs text-gray-500">Absent</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{selectedUser.attendance.leave}</p>
                    <p className="text-xs text-gray-500">Leave</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#0B4DA2]">{selectedUser.attendance.percentage}%</p>
                    <p className="text-xs text-gray-500">Attendance Rate</p>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                  <GraduationCap size={20} className="text-[#0B4DA2]" />
                  Education
                </h3>
                <div className="space-y-3">
                  {selectedUser.education.map((edu, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200">
                      <p className="font-bold text-[#1B254B] text-sm">{edu.degree}</p>
                      <p className="text-xs text-gray-500">{edu.institution} • {edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                  <BriefcaseIcon size={20} className="text-[#0B4DA2]" />
                  Work Experience
                </h3>
                <div className="space-y-3">
                  {selectedUser.experience.map((exp, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border-l-4 border-[#0B4DA2]">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-[#1B254B] text-sm">{exp.position}</p>
                          <p className="text-xs text-gray-500">{exp.company}</p>
                        </div>
                        <span className="text-xs text-gray-400">{exp.from} - {exp.to}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills & Certifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                    <Star size={20} className="text-[#0B4DA2]" />
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.skills.map((skill, idx) => (
                      <span key={idx} className="bg-blue-100 text-[#0B4DA2] text-xs font-bold px-3 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                    <Award size={20} className="text-[#0B4DA2]" />
                    Certifications
                  </h3>
                  <div className="space-y-2">
                    {selectedUser.certifications.map((cert, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                        <p className="font-bold text-[#1B254B] text-xs">{cert.name}</p>
                        <p className="text-xs text-gray-500">{cert.issuer} • {cert.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                  <FileText size={20} className="text-[#0B4DA2]" />
                  Documents ({selectedUser.documents.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedUser.documents.map((doc, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl flex items-center justify-between border border-gray-200">
                      <div>
                        <p className="font-bold text-[#1B254B] text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-500">Uploaded: {doc.uploadDate}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        doc.status === 'Verified' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 rounded-b-[28px] flex gap-3">
              <button className="flex-1 bg-[#0B4DA2] text-white py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors flex items-center justify-center gap-2">
                <Edit size={18} />
                Edit Employee
              </button>
              <button className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <Download size={18} />
                Download Profile
              </button>
              <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors" onClick={() => setShowFullDetails(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export all other admin pages as before (no changes to these)
export { AdminAttendancePage, AdminTrainingPage, AdminAnalyticsPage, AdminAnnouncementsPage, AdminProjectsPage, AdminProductionPage, AdminPayrollPage } from './AdminOtherPages';
