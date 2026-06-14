import React, { useState, useEffect } from 'react';
import {
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Award,
  FileText,
  IndianRupee,
  UserCheck,
  UserX,
  Activity,
  Briefcase,
  GraduationCap,
  Bell,
  BarChart3,
  ArrowUp,
  ArrowDown,
  LogIn,
  LogOut as LogOutIcon
} from 'lucide-react';

export const AdminDashboard = ({ onNavigate }) => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<'in' | 'out' | null>(null);
  const [showClockInSuccess, setShowClockInSuccess] = useState(false);
  const [showClockOutSuccess, setShowClockOutSuccess] = useState(false);

  const handleClockIn = () => {
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    setClockInTime(currentTime);
    setClockOutTime(null);
    setIsClockedIn(true);
    setShowClockInSuccess(true);
    setTimeout(() => setShowClockInSuccess(false), 3000);
  };

  const handleClockOut = () => {
    const currentTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    setClockOutTime(currentTime);
    setIsClockedIn(false);
    setShowClockOutSuccess(true);
    setTimeout(() => {
      setShowClockOutSuccess(false);
    }, 3000);
  };

  const [stats, setStats] = useState({
    totalEmployees: 0,
    activeEmployees: 0,
    onLeave: 0,
    pendingRequests: 0,
    monthlyPayroll: '₹0',
    completedTraining: 0,
    activeProjects: 0,
    departmentCount: 0
  });

  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [departmentStats, setDepartmentStats] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setStats(data.stats);
          setRecentRequests(data.recentRequests || []);
          setDepartmentStats(data.departmentStats || []);
        }
      })
      .catch(console.error);
  }, []);

  const StatCard = ({ icon: Icon, label, value, subtext, change, colorClass, onClick }) => (
    <button
      onClick={onClick}
      className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer w-full text-left active:scale-95"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform bg-gray-100`}>
          <Icon size={28} className={colorClass} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${change > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
            {change > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-[#1B254B] mb-1">{value}</h3>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
      {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
    </button>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl shadow-blue-900/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-[#87CEEB] rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-4xl font-bold mb-3">
                Admin Dashboard
              </h2>
              <p className="text-blue-100 text-lg mb-4">
                Complete overview of organizational operations and analytics
              </p>
              <div className="flex items-center gap-3">
                <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/20">
                  📊 Real-time Monitoring
                </span>
                <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/20">
                  🔔 {stats.pendingRequests} Pending Actions
                </span>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                <p className="text-xs text-blue-200 mb-1">Today's Date</p>
                <p className="text-2xl font-bold">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Employees"
          value={stats.totalEmployees}
          subtext={`${stats.activeEmployees} Active Today`}
          change={3.2}
          colorClass="text-[#0B4DA2]"
          onClick={() => onNavigate('admin-users')}
        />
        <StatCard
          icon={AlertCircle}
          label="Pending Requests"
          value={stats.pendingRequests}
          subtext="Require Immediate Action"
          change={-5.1}
          colorClass="text-[#EE5D50]"
          onClick={() => onNavigate('admin-requests')}
        />
        <StatCard
          icon={IndianRupee}
          label="Monthly Payroll"
          value={stats.monthlyPayroll}
          subtext="Current Month Budget"
          change={2.8}
          colorClass="text-[#05CD99]"
          onClick={() => onNavigate('admin-payroll')}
        />
        <StatCard
          icon={GraduationCap}
          label="Training Sessions"
          value={stats.completedTraining}
          subtext="Completed This Month"
          change={12.5}
          colorClass="text-[#FFB547]"
          onClick={() => onNavigate('admin-training')}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 text-center">
          <UserCheck size={24} className="text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-[#1B254B]">{stats.activeEmployees}</p>
          <p className="text-xs text-gray-500">Active Today</p>
        </div>
        <div className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 text-center">
          <UserX size={24} className="text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-[#1B254B]">{stats.onLeave}</p>
          <p className="text-xs text-gray-500">On Leave</p>
        </div>
        <div className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 text-center">
          <Briefcase size={24} className="text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-[#1B254B]">{stats.activeProjects}</p>
          <p className="text-xs text-gray-500">Active Projects</p>
        </div>
        <div className="bg-white p-4 rounded-[20px] shadow-sm border border-gray-100 text-center">
          <Activity size={24} className="text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-[#1B254B]">{stats.departmentCount}</p>
          <p className="text-xs text-gray-500">Departments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Requests */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#1B254B] text-lg">Recent Requests</h3>
            <button
              onClick={() => onNavigate('admin-requests')}
              className="text-xs font-bold text-[#0B4DA2] hover:underline"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            {recentRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => onNavigate('admin-requests')}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-[#1B254B] text-sm">{req.employee}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${req.priority === 'High' ? 'bg-red-100 text-red-700' :
                        req.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'
                      }`}>
                      {req.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{req.type}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{req.date}</p>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                  }`}>
                  {req.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Clock In/Out & Quick Actions */}
        <div className="space-y-6">
          {/* Clock In / Clock Out Card */}
          <div className="bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] p-6 rounded-[24px] shadow-lg text-white">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={20} />
              <h3 className="font-bold text-lg text-white">Attendance</h3>
            </div>
            {pendingAction ? (
              <div className="space-y-3 animate-in fade-in duration-200 text-left">
                <p className="text-xs text-blue-200 leading-relaxed">
                  Are you sure you want to {pendingAction === 'in' ? 'Clock In' : 'Clock Out'}?
                </p>
                <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20 text-center font-bold text-sm">
                  🕒 Current: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPendingAction(null)}
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg font-semibold text-xs transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (pendingAction === 'in') {
                        handleClockIn();
                      } else {
                        handleClockOut();
                      }
                      setPendingAction(null);
                    }}
                    className={`flex-1 py-2 rounded-lg font-semibold text-xs transition-all active:scale-95 ${
                      pendingAction === 'in' 
                        ? 'bg-white text-[#0B4DA2] hover:bg-blue-50' 
                        : 'bg-[#EE5D50] text-white hover:bg-red-600'
                    }`}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            ) : !isClockedIn ? (
              <div className="space-y-3">
                {clockInTime && clockOutTime && (
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 space-y-2 mb-2 text-xs">
                    <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                      <span className="text-blue-200 font-medium">Clocked In At</span>
                      <span className="font-bold">{clockInTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200 font-medium">Clocked Out At</span>
                      <span className="font-bold">{clockOutTime}</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setPendingAction('in')}
                  className="w-full bg-white text-[#0B4DA2] py-3 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 active:scale-95 text-sm"
                >
                  <LogIn size={20} />Clock In
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs">
                  <p className="text-blue-200 mb-1">Clocked In At</p>
                  <p className="text-xl font-bold">{clockInTime}</p>
                </div>
                <button
                  onClick={() => setPendingAction('out')}
                  className="w-full bg-[#EE5D50] text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2 active:scale-95 text-sm"
                >
                  <LogOutIcon size={20} />Clock Out
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1B254B] mb-4 text-lg">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Broadcast Notification', icon: Bell, action: 'admin-notifications' },
                { label: 'View All Requests', icon: FileText, action: 'admin-requests' },
                { label: 'Attendance Report', icon: Calendar, action: 'admin-attendance' },
                { label: 'Department Analytics', icon: BarChart3, action: 'admin-analytics' },
                { label: 'Manage Users', icon: Users, action: 'admin-users' },
                { label: 'Training Management', icon: GraduationCap, action: 'admin-training' },
                { label: 'Payroll Management', icon: IndianRupee, action: 'admin-payroll' },
                { label: 'Announcements', icon: Award, action: 'admin-announcements' }
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => onNavigate(item.action)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors text-left group"
                >
                  <div className="bg-[#F4F7FE] p-2 rounded-lg group-hover:bg-[#0B4DA2] transition-colors">
                    <item.icon size={18} className="text-[#0B4DA2] group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-bold text-[#1B254B]">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Department Overview */}
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <h3 className="font-bold text-[#1B254B] mb-4 text-lg">Department Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentStats.map((dept, idx) => (
            <div
              key={idx}
              className="p-4 border-l-4 bg-gray-50 rounded-r-xl hover:shadow-md transition-all cursor-pointer"
              style={{ borderColor: dept.color.replace('bg-', '') }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-[#1B254B]">{dept.name}</h4>
                <span className={`w-3 h-3 rounded-full ${dept.color}`}></span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <p className="text-gray-400">Employees</p>
                  <p className="font-bold text-[#1B254B]">{dept.employees}</p>
                </div>
                <div>
                  <p className="text-gray-400">Attendance</p>
                  <p className="font-bold text-green-600">{dept.attendance}%</p>
                </div>
                <div>
                  <p className="text-gray-400">Budget</p>
                  <p className="font-bold text-[#1B254B]">{dept.budget}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Success Notifications */}
      {showClockInSuccess && (
        <div className="fixed top-24 right-6 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-4 duration-300 z-50 flex items-center gap-3">
          <CheckCircle size={24} />
          <div>
            <p className="font-bold">Clock In Successful!</p>
            <p className="text-sm text-green-100">Started at {clockInTime}</p>
          </div>
        </div>
      )}

      {showClockOutSuccess && (
        <div className="fixed top-24 right-6 bg-blue-500 text-white px-6 py-4 rounded-2xl shadow-2xl animate-in slide-in-from-right-4 duration-300 z-50 flex items-center gap-3">
          <CheckCircle size={24} />
          <div>
            <p className="font-bold">Clock Out Successful!</p>
            <p className="text-sm text-blue-100">Have a great day!</p>
          </div>
        </div>
      )}
      {/* Confirmation modal removed - inline confirmation handles it */}
    </div>
  );
};