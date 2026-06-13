import { useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  CalendarDays,
  Users,
  FileText,
  LogOut,
  Bell,
  Search,
  CheckCircle,
  Download,
  DoorOpen,
  User,
  TrendingUp,
  Eye,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  History,
  BarChart3,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner@2.0.3';

const logo = '/Company Logo.jpg';

interface Request {
  id: number;
  type: 'Leave' | 'Gate Pass';
  employee: string;
  empId: string;
  dept: string;
  date: string;
  duration: string;
  category: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
}

interface Employee {
  id: number;
  name: string;
  empId: string;
  dept: string;
  designation: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  reportsTo: string;
  workingDays: number;
  otHours: number;
  totalHours: number;
  cl: number;
  ml: number;
  present: number;
  absent: number;
  halfDays: number;
  shift: string;
  avatar: string;
}

interface Shift {
  id: string;
  name: string;
  time: string;
  active: number;
  color: string;
}

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

export function TimeOfficePortal() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceSearchTerm, setAttendanceSearchTerm] = useState('');
  const [showRequestHistory, setShowRequestHistory] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const [requests, setRequests] = useState<Request[]>([
    { id: 1, type: 'Leave', employee: 'Sarah Connor', empId: 'EMP002', dept: 'Product', date: '2025-01-25', duration: '2 Days', category: 'Medical', reason: 'Viral Fever. Doctor certificate attached.', status: 'Pending', appliedOn: '2025-01-20 10:30 AM' },
    { id: 2, type: 'Gate Pass', employee: 'Mike Ross', empId: 'EMP005', dept: 'Legal', date: '2025-01-24', duration: '2 Hours', category: 'Personal', reason: 'Bank visit for loan processing.', status: 'Pending', appliedOn: '2025-01-24 09:15 AM' },
    { id: 3, type: 'Leave', employee: 'John Doe', empId: 'EMP001', dept: 'Sales', date: '2025-01-26', duration: '1 Day', category: 'Casual', reason: 'Family function in hometown.', status: 'Pending', appliedOn: '2025-01-21 04:00 PM' },
  ]);

  const [employees] = useState<Employee[]>([
    { id: 1, name: 'Alex Johnson', empId: 'EMP-042', dept: 'Development', designation: 'Senior Developer', email: 'alex.j@company.com', phone: '+1 (555) 0123', location: 'Building A, Floor 3', joinDate: '12 Jan 2021', reportsTo: 'Sarah Connor', workingDays: 22, otHours: 4.5, totalHours: 180.5, cl: 1, ml: 0, present: 20, absent: 0, halfDays: 1, shift: 'GS', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { id: 2, name: 'Sarah Connor', empId: 'EMP-002', dept: 'Product', designation: 'Product Manager', email: 'sarah.c@company.com', phone: '+1 (555) 0124', location: 'Building A, Floor 3', joinDate: '15 Mar 2019', reportsTo: 'Director of Product', workingDays: 22, otHours: 0, totalHours: 160.0, cl: 0, ml: 2, present: 18, absent: 2, halfDays: 0, shift: 'GS', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
    { id: 3, name: 'Mike Ross', empId: 'EMP-005', dept: 'Legal', designation: 'Legal Consultant', email: 'mike.r@company.com', phone: '+1 (555) 0125', location: 'Building B, Floor 1', joinDate: '20 Aug 2022', reportsTo: 'Harvey Specter', workingDays: 22, otHours: 12.0, totalHours: 188.0, cl: 2, ml: 0, present: 19, absent: 1, halfDays: 0, shift: 'MS', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike' },
  ]);

  const [shifts] = useState<Shift[]>([
    { id: 'GS', name: 'General Shift', time: '09:00 AM - 06:00 PM', active: 42, color: 'bg-blue-600' },
    { id: 'MS', name: 'Morning Shift', time: '06:00 AM - 02:00 PM', active: 15, color: 'bg-orange-500' },
    { id: 'NS', name: 'Night Shift', time: '10:00 PM - 06:00 AM', active: 8, color: 'bg-indigo-900' },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: 'New leave request from Sarah Connor', time: '10 mins ago', read: false },
    { id: 2, text: 'Shift Morning is understaffed by 2', time: '1 hour ago', read: false },
  ]);

  const handleApprove = (requestId: number) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Approved' } : r));
    toast.success('Request approved successfully');
    setSelectedRequest(null);
  };

  const handleReject = (requestId: number) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Rejected' } : r));
    toast.error('Request rejected');
    setSelectedRequest(null);
  };

  const handleExportExcel = () => {
    toast.success('Excel file downloaded successfully');
  };

  const handleLogout = () => {
    toast.success('Logging out...');
    setTimeout(() => window.location.reload(), 1000);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingCount = requests.filter(r => r.status === 'Pending').length;

  const sidebarMenuItems = [
    { icon: Home, label: 'Dashboard', value: 'overview' },
    { icon: CheckSquare, label: 'Approvals', value: 'approvals', badge: pendingCount },
    { icon: FileText, label: 'Attendance', value: 'attendance' },
    { icon: CalendarDays, label: 'Shift Roster', value: 'shifts' },
    { icon: History, label: 'Reports', value: 'reports' },
    { icon: BarChart3, label: 'Analytics', value: 'analytics' },
    { icon: Settings, label: 'Settings', value: 'settings' }
  ];

  const StatCard = ({ icon: Icon, label, value, subtext, change, colorClass, onClick }: any) => (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-[24px] shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer w-full text-left border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${colorClass}`}>
          <Icon size={28} className="text-white" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg ${change > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}>
            {change > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-[#1B254B] mb-1">{value}</h3>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
      {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex">
      {/* Sidebar */}
      <motion.div
        className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-lg`}
        animate={{ width: sidebarCollapsed ? 80 : 256 }}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          {!sidebarCollapsed ? (
            <div className="flex flex-col gap-3">
              <img src={logo} alt="SMG Logo" className="w-full h-auto" />
              <div className="text-center">
                <h2 className="text-[#1B254B] font-bold">Time Office Portal</h2>
                <p className="text-xs text-gray-500">Attendance Management</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img src={logo} alt="SMG" className="w-10 h-10 object-contain" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarMenuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.value
                ? 'bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm font-bold">{item.label}</span>}
              {!sidebarCollapsed && item.badge > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Sidebar Toggle & Logout */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!sidebarCollapsed && <span className="text-sm font-bold">Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm font-bold">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1B254B]">{getGreeting()}, Time Office</h1>
              <p className="text-sm text-gray-500 mt-1">Attendance tracking & shift management</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search anything..."
                  className="pl-10 w-80 border-gray-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="relative border-gray-200 hover:bg-gray-50">
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1800px] mx-auto">

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard icon={Users} label="Total Employees" value={employees.length} subtext="Active on roll" colorClass="bg-blue-600" change={5} />
                  <StatCard icon={CheckCircle} label="Present Today" value="128" subtext="90% Attendance" colorClass="bg-emerald-500" change={3} />
                  <StatCard icon={Clock} label="Pending Requests" value={pendingCount} subtext="Leaves & Passes" colorClass="bg-amber-500" onClick={() => setActiveTab('approvals')} />
                  <StatCard icon={DoorOpen} label="Gate Passes" value="05" subtext="Issued Today" colorClass="bg-purple-500" change={-2} />
                </div>

                {/* Shift Efficiency & Pending Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-white rounded-[24px] shadow-md p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-[#1B254B] mb-6">Shift Efficiency (Live)</h3>
                    <div className="space-y-6">
                      {shifts.map(shift => (
                        <div key={shift.id}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${shift.color}`}>
                                {shift.id}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">{shift.name}</p>
                                <p className="text-xs text-gray-500">{shift.time}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">{shift.active}</p>
                              <p className="text-xs text-gray-500">Active</p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-3">
                            <div className={`h-3 rounded-full ${shift.color}`} style={{ width: `${(shift.active / 60) * 100}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white rounded-[24px] shadow-md p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-[#1B254B]">Pending Actions</h3>
                      <button onClick={() => setActiveTab('approvals')} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-blue-600">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                    <div className="space-y-3">
                      {requests.filter(r => r.status === 'Pending').slice(0, 5).map(req => (
                        <div key={req.id} className="p-4 rounded-xl border border-gray-100 hover:shadow-sm transition-all bg-gray-50/50 cursor-pointer" onClick={() => setActiveTab('approvals')}>
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${req.type === 'Leave' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                {req.type === 'Leave' ? 'LV' : 'GP'}
                              </div>
                              <span className="font-bold text-sm text-gray-900">{req.employee}</span>
                            </div>
                            <span className="text-xs text-gray-400">{req.date}</span>
                          </div>
                          <p className="text-xs text-gray-500 pl-10 line-clamp-1">{req.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Approvals Tab */}
            {activeTab === 'approvals' && (
              <div className="bg-white rounded-[24px] shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-[#1B254B]">{showRequestHistory ? 'Request History' : 'Pending Requests'}</h3>
                  <Button
                    onClick={() => setShowRequestHistory(!showRequestHistory)}
                    className={showRequestHistory ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}
                  >
                    {showRequestHistory ? <><ArrowLeft className="w-4 h-4 mr-2" /> Back to Pending</> : 'View History'}
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  {requests.filter(r => showRequestHistory ? r.status !== 'Pending' : r.status === 'Pending').map(req => (
                    <div key={req.id} className="p-5 rounded-xl border border-gray-200 hover:shadow-md transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${req.type === 'Leave' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                            {req.type === 'Leave' ? <CalendarDays size={24} /> : <DoorOpen size={24} />}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="font-bold text-gray-900">{req.employee}</h4>
                              <Badge variant={req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'destructive' : 'default'}>
                                {req.status}
                              </Badge>
                            </div>
                            <div className="flex gap-4 text-sm text-gray-500">
                              <span>{req.date}</span>
                              <span>{req.duration}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button variant="outline" size="sm" onClick={() => setSelectedRequest(req)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {!showRequestHistory && (
                            <>
                              <Button variant="outline" size="sm" className="text-red-600 border-red-200" onClick={() => handleReject(req.id)}>
                                Reject
                              </Button>
                              <Button size="sm" className="bg-blue-600" onClick={() => handleApprove(req.id)}>
                                Approve
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
              <div className="bg-white rounded-[24px] shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-[#1B254B]">Attendance Register</h3>
                    <Button onClick={handleExportExcel} className="bg-emerald-600 hover:bg-emerald-700">
                      <Download className="w-4 h-4 mr-2" />
                      Export Excel
                    </Button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      placeholder="Search by name, ID or department..."
                      className="pl-10"
                      value={attendanceSearchTerm}
                      onChange={(e) => setAttendanceSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Employee</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Present</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Absent</th>
                        <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">OT (Hrs)</th>
                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase">Total Hours</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {employees.filter(emp => emp.name.toLowerCase().includes(attendanceSearchTerm.toLowerCase())).map(emp => (
                        <tr key={emp.id} className="hover:bg-blue-50/40">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={emp.avatar} alt="" className="w-10 h-10 rounded-full" />
                              <div>
                                <p className="font-bold text-gray-900">{emp.name}</p>
                                <p className="text-xs text-gray-500">{emp.empId} • {emp.dept}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-lg">{emp.present}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {emp.absent > 0 ? <span className="bg-red-50 text-red-700 font-bold px-3 py-1 rounded-lg">{emp.absent}</span> : '-'}
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-blue-600">{emp.otHours > 0 ? emp.otHours : '-'}</td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-gray-900">{emp.totalHours}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Shifts Tab */}
            {activeTab === 'shifts' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {shifts.map(shift => (
                  <div key={shift.id} className="bg-white rounded-[24px] shadow-md p-6 border border-gray-100">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-4 ${shift.color}`}>
                      {shift.id}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{shift.name}</h3>
                    <p className="text-sm text-gray-500 mb-6">{shift.time}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">Active Staff</span>
                      <span className="text-2xl font-bold text-gray-900">{shift.active}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Other Tabs Placeholder */}
            {(activeTab === 'reports' || activeTab === 'analytics' || activeTab === 'settings') && (
              <div className="bg-white rounded-[24px] shadow-md p-12 border border-gray-100 text-center">
                <h3 className="text-2xl font-bold text-[#1B254B] mb-2">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
                <p className="text-gray-500">This section is under development</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
