import React, { useState, useEffect } from 'react';
import { Users, BarChart3, Settings, Megaphone, Bell, FolderOpen, FileText, Building2, IndianRupee, GraduationCap, Briefcase, Activity, Calendar, LogIn, LogOut as LogOutIcon, Clock } from 'lucide-react';

export const SuperAdminDashboard = ({ onNavigate }) => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<'in' | 'out' | null>(null);

  const handleClockIn = () => {
    const t = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    setClockInTime(t);
    setClockOutTime(null);
    setIsClockedIn(true);
  };
  const handleClockOut = () => {
    const t = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    setClockOutTime(t);
    setIsClockedIn(false);
  };

  const [stats, setStats] = useState<any>({
    employees: 0,
    monthlyPayroll: '₹0',
    activeProjects: 0,
    departments: 0,
    pendingRequests: 0,
    trainings: 0,
    systemHealth: { database: 'Checking...', apiStatus: 'Checking...', emailService: 'Checking...' }
  });

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setStats({
            employees: data.stats.totalEmployees,
            monthlyPayroll: data.stats.monthlyPayroll,
            activeProjects: data.stats.activeProjects,
            departments: data.stats.departmentCount,
            pendingRequests: data.stats.pendingRequests,
            trainings: data.stats.completedTraining,
            systemHealth: data.systemHealth
          });
        }
      })
      .catch(console.error);
  }, []);

  const Stat = ({ icon: Icon, label, value, onClick }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 w-full text-left active:scale-95">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-2xl bg-[#F4F7FE] flex items-center justify-center"><Icon size={24} className="text-[#0B4DA2]" /></div>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-3xl font-bold text-[#1B254B]">{value}</div>
    </button>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <h2 className="text-4xl font-bold mb-2">Super Admin Dashboard</h2>
            <p className="text-blue-100 text-lg">Company-wide control, analytics and configuration</p>
            <div className="flex items-center gap-3 mt-4">
              <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/20">🔧 System Settings</span>
              <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/20">🔔 {stats.pendingRequests} Pending</span>
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat icon={Users} label="Total Employees" value={stats.employees} onClick={() => onNavigate('super-users')} />
        <Stat icon={IndianRupee} label="Monthly Payroll" value={stats.monthlyPayroll} onClick={() => onNavigate('super-reports')} />
        <Stat icon={Briefcase} label="Active Projects" value={stats.activeProjects} onClick={() => onNavigate('super-analytics')} />
        <Stat icon={Activity} label="Departments" value={stats.departments} onClick={() => onNavigate('super-departments')} />
      </div>

      {/* Quick Actions & Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#1B254B] mb-4 text-lg">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { label: 'Manage Users', icon: Users, action: 'super-users' },
              { label: 'Departments', icon: Settings, action: 'super-departments' },
              { label: 'All Requests', icon: FileText, action: 'super-requests' },
              { label: 'Analytics', icon: BarChart3, action: 'super-analytics' },
              { label: 'Announcements', icon: Megaphone, action: 'super-announcements' },
              { label: 'Notifications', icon: Bell, action: 'super-notifications' },
              { label: 'System Settings', icon: Settings, action: 'super-settings' },
              { label: 'Reports & Export', icon: FolderOpen, action: 'super-reports' }
            ].map((item, idx) => (
              <button key={idx} onClick={() => onNavigate(item.action)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-colors text-left group">
                <div className="bg-[#F4F7FE] p-2 rounded-lg group-hover:bg-[#0B4DA2] transition-colors">
                  <item.icon size={18} className="text-[#0B4DA2] group-hover:text-white transition-colors" />
                </div>
                <span className="text-sm font-bold text-[#1B254B]">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] p-6 rounded-[24px] shadow-lg text-white">
            <div className="flex items-center gap-2 mb-4"><Calendar size={20} /><h3 className="font-bold text-lg">Attendance</h3></div>
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
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 space-y-2 mb-2">
                    <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                      <span className="text-xs text-blue-200 font-medium">Clocked In At</span>
                      <span className="text-sm font-bold">{clockInTime}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-blue-200 font-medium">Clocked Out At</span>
                      <span className="text-sm font-bold">{clockOutTime}</span>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setPendingAction('in')}
                  className="w-full bg-white text-[#0B4DA2] py-3 rounded-xl font-bold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <LogIn size={20} />Clock In
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
                  <p className="text-xs text-blue-200 mb-1">Clocked In At</p>
                  <p className="text-xl font-bold">{clockInTime}</p>
                </div>
                <button
                  onClick={() => setPendingAction('out')}
                  className="w-full bg-[#EE5D50] text-white py-3 rounded-xl font-bold hover:bg-red-600 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <LogOutIcon size={20} />Clock Out
                </button>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1B254B] mb-3 text-lg">System Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${stats.systemHealth?.database === 'Connected' ? 'bg-green-500' : 'bg-red-500'}`}></div><span className="text-sm font-bold text-gray-700">Database</span></div>
                <span className="text-xs text-gray-500">{stats.systemHealth?.database || 'Checking...'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${stats.systemHealth?.apiStatus === 'Healthy' ? 'bg-green-500' : 'bg-yellow-500'}`}></div><span className="text-sm font-bold text-gray-700">API Status</span></div>
                <span className="text-xs text-gray-500">{stats.systemHealth?.apiStatus || 'Checking...'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2"><div className={`w-2 h-2 rounded-full ${stats.systemHealth?.emailService === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></div><span className="text-sm font-bold text-gray-700">Email SMTP</span></div>
                <span className="text-xs text-gray-500">{stats.systemHealth?.emailService || 'Checking...'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation modal removed - inline confirmation handles it */}
    </div>
  );
};
