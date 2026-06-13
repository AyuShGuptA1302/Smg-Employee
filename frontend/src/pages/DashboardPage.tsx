import React from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Award,
  AlertCircle,
  CheckCircle,
  FileText,
  Users,
  DollarSign,
  Activity,
  ArrowRight
} from 'lucide-react';

const THEME = {
  colors: {
    royal: '#0B4DA2',
    navy: '#042A5B',
    accent: '#87CEEB',
    success: '#05CD99',
    warning: '#FFB547',
    danger: '#EE5D50'
  }
};

export const DashboardPage = ({ userData }) => {
  const stats = [
    { label: 'Leave Balance', value: '12 Days', icon: Calendar, color: THEME.colors.royal, trend: '+2' },
    { label: 'Pending Requests', value: '5', icon: FileText, color: THEME.colors.warning, trend: '-1' },
    { label: 'Training Hours', value: '24 Hrs', icon: Award, color: THEME.colors.success, trend: '+8' },
    { label: 'Attendance', value: '95%', icon: CheckCircle, color: THEME.colors.accent, trend: '+3%' }
  ];

  const recentActivity = [
    { id: 1, type: 'Leave Approved', desc: 'Annual Leave - Diwali Vacation', time: '2 hours ago', status: 'success' },
    { id: 2, type: 'Training Assigned', desc: 'React Advanced Patterns', time: '5 hours ago', status: 'info' },
    { id: 3, type: 'Payslip Generated', desc: 'October 2023 Salary', time: '1 day ago', status: 'success' },
    { id: 4, type: 'Request Pending', desc: 'Laptop Upgrade Request', time: '2 days ago', status: 'warning' }
  ];

  const upcomingEvents = [
    { id: 1, title: 'Team Meeting', date: 'Dec 15, 2024', time: '10:00 AM', type: 'Meeting' },
    { id: 2, title: 'React Training', date: 'Dec 18, 2024', time: '2:00 PM', type: 'Training' },
    { id: 3, title: 'Performance Review', date: 'Dec 20, 2024', time: '11:00 AM', type: 'Review' }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white mb-2">Welcome back, {userData.name}! 👋</h1>
            <p className="text-[#87CEEB] opacity-90">Here's what's happening with your account today.</p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
              <p className="text-sm text-[#87CEEB] mb-1">Current Time</p>
              <p className="text-2xl font-bold">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br from-[${stat.color}] to-[${stat.color}]/80`}>
                <stat.icon className="text-white" size={24} />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                {stat.trend}
              </span>
            </div>
            <h3 className="text-[#1B254B] mb-1">{stat.value}</h3>
            <p className="text-sm text-[#A3AED0]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1B254B]">Recent Activity</h3>
            <button className="text-[#0B4DA2] text-sm font-bold hover:text-[#042A5B] transition-colors flex items-center gap-1">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.status === 'success' ? 'bg-[#05CD99]' :
                  activity.status === 'warning' ? 'bg-[#FFB547]' :
                  'bg-[#87CEEB]'
                }`} />
                <div className="flex-1">
                  <p className="font-bold text-[#1B254B] text-sm">{activity.type}</p>
                  <p className="text-sm text-[#A3AED0]">{activity.desc}</p>
                  <p className="text-xs text-[#A3AED0] mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1B254B]">Upcoming Events</h3>
            <button className="text-[#0B4DA2] text-sm font-bold hover:text-[#042A5B] transition-colors flex items-center gap-1">
              Calendar <ArrowRight size={16} />
            </button>
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-100 hover:border-[#0B4DA2] transition-all">
                <div className="w-14 h-14 bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] rounded-xl flex flex-col items-center justify-center text-white shrink-0">
                  <span className="text-xs font-bold">{event.date.split(' ')[1]}</span>
                  <span className="text-[10px] text-[#87CEEB]">{event.date.split(' ')[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#1B254B]">{event.title}</p>
                  <p className="text-sm text-[#A3AED0] flex items-center gap-1 mt-1">
                    <Clock size={14} /> {event.time}
                  </p>
                </div>
                <span className="text-xs font-bold text-[#0B4DA2] bg-blue-50 px-3 py-1 rounded-lg">
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-6 rounded-xl bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white hover:shadow-xl transition-all text-center">
            <Calendar className="mx-auto mb-3" size={28} />
            <p className="font-bold text-sm">Apply Leave</p>
          </button>
          <button className="p-6 rounded-xl bg-gradient-to-br from-[#05CD99] to-[#05CD99]/80 text-white hover:shadow-xl transition-all text-center">
            <FileText className="mx-auto mb-3" size={28} />
            <p className="font-bold text-sm">View Payslip</p>
          </button>
          <button className="p-6 rounded-xl bg-gradient-to-br from-[#FFB547] to-[#FFB547]/80 text-white hover:shadow-xl transition-all text-center">
            <Award className="mx-auto mb-3" size={28} />
            <p className="font-bold text-sm">My Training</p>
          </button>
          <button className="p-6 rounded-xl bg-gradient-to-br from-[#87CEEB] to-[#87CEEB]/80 text-white hover:shadow-xl transition-all text-center">
            <Users className="mx-auto mb-3" size={28} />
            <p className="font-bold text-sm">Team Directory</p>
          </button>
        </div>
      </div>
    </div>
  );
};
