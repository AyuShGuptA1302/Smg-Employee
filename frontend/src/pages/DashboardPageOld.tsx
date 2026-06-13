import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Clock,
  Calendar,
  Coffee,
  BookOpen,
  Zap,
  DollarSign,
  Truck,
  Mail,
  LifeBuoy,
  Heart,
  LogOut,
  MapPin,
  Video,
  Phone,
  Link as LinkIcon,
  Users,
  Award,
  PlayCircle,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Monitor,
  Keyboard,
  Mouse,
  Smartphone,
  UtensilsCrossed
} from 'lucide-react';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

// ── Default / fallback data ──────────────────────────────────────────────────
const defaultDashStats = {
  trainingHours: 0,
  leaveBalance: 0,
  pendingRequests: 0,
};

const defaultMeetings = [];

const defaultKeyContacts = [];

const defaultRecentRequests = [];

const defaultUpcomingTraining = [];

const defaultNotifications = [];

const defaultMyAssets = [];
// ────────────────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon: Icon, colorClass, subtext, onClick }) => {
  const iconColor = colorClass.split(' ').find(c => c.startsWith('text-')) || colorClass;

  return (
    <button
      onClick={onClick}
      className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group cursor-pointer w-full text-left active:scale-95"
    >
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform bg-gray-100">
        {Icon && <Icon size={24} className={iconColor} />}
      </div>
      <h3 className="text-2xl font-bold text-[#1B254B] mb-1">{value}</h3>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
      {subtext && <p className="text-[10px] text-gray-400 mt-1">{subtext}</p>}
    </button>
  );
};

const RecentRequestsCard = ({ requests, onNewRequest }) => (
  <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
    <div className="flex justify-between items-center mb-4">
      <h3 className="font-bold text-[#1B254B] text-lg">Recent Requests</h3>
      <button
        onClick={onNewRequest}
        className="text-xs font-bold text-[#0B4DA2] hover:underline flex items-center gap-1"
      >
        + New Request
      </button>
    </div>
    <div className="space-y-3">
      {requests.map((req, i) => (
        <div key={req.id || i} className="flex items-start justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-[#1B254B] text-sm">{req.type}</h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${req.status === 'Approved' ? 'bg-green-100 text-green-700' :
                req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  req.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                }`}>
                {req.status}
              </span>
            </div>
            <p className="text-xs text-gray-600">{req.desc}</p>
            <p className="text-[10px] text-gray-400 mt-1">{req.date}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const UpcomingTrainingCard = ({ training }) => (
  <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
    <h3 className="font-bold text-[#1B254B] mb-4 text-lg">Upcoming Training</h3>
    <div className="space-y-3">
      {training.map((t) => (
        <div key={t.id} className="flex items-start gap-3 p-3 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100">
          <div className="bg-[#0B4DA2] p-2 rounded-lg text-white">
            <BookOpen size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-[#1B254B] text-sm">{t.title}</h4>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><Calendar size={10} /> {t.date}</span>
              <span className="flex items-center gap-1"><Clock size={10} /> {t.duration}</span>
            </div>
            {t.type === 'Required' && (
              <span className="inline-block mt-2 text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded">
                Mandatory
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MyAssetsCard = ({ assets }) => (
  <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
    <h3 className="font-bold text-[#1B254B] mb-4 text-lg">My Assets</h3>
    <div className="space-y-3">
      {assets.map((asset, idx) => {
        const AssetIcon = asset.icon; // ← fix: store in a capitalised variable so React treats it as a component
        return (
          <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg text-[#0B4DA2]">
                {AssetIcon ? <AssetIcon size={18} /> : null}
              </div>
              <div>
                <p className="font-bold text-[#1B254B] text-sm">{asset.name}</p>
                <p className="text-[10px] text-gray-400">{asset.type}</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded ${asset.status === 'Excellent' ? 'bg-green-100 text-green-700' :
              asset.status === 'Good' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
              {asset.status}
            </span>
          </div>
        );
      })}
    </div>
  </div>
);

const KeyContactsCard = ({ contacts, reportingManager }) => (
  <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
    <h3 className="font-bold text-[#1B254B] mb-4 text-lg">Key Contacts</h3>
    <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
      <p className="text-xs text-gray-500 mb-1">Reporting Manager</p>
      <p className="font-bold text-[#1B254B]">{reportingManager}</p>
    </div>
    <div className="space-y-2">
      {contacts.map((contact, idx) => (
        <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div>
            <p className="font-bold text-[#1B254B] text-sm">{contact.name}</p>
            <p className="text-[10px] text-gray-400">{contact.role}</p>
          </div>
          <div className="flex gap-2">
            <button className="p-1.5 bg-blue-50 text-[#0B4DA2] rounded-lg hover:bg-blue-100">
              <Phone size={12} />
            </button>
            <button className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100">
              <Mail size={12} />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const TodaysMeetingsCard = ({ meetings }) => (
  <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
    <h3 className="font-bold text-[#1B254B] mb-4 text-lg">Today's Meetings</h3>
    <div className="space-y-3">
      {meetings.map((meeting, idx) => (
        <div key={idx} className="p-4 border-l-4 border-[#0B4DA2] bg-blue-50 rounded-r-xl group hover:shadow-md transition-all">
          <h4 className="font-bold text-[#1B254B] mb-2">{meeting.title}</h4>
          <div className="flex flex-wrap gap-3 text-[10px] text-gray-500 mb-2">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {meeting.time} • {meeting.duration}
            </span>
            <span className="flex items-center gap-1">
              {meeting.link ? <Video size={12} /> : <MapPin size={12} />}
              {meeting.type}
            </span>
          </div>
          {meeting.link ? (
            <a
              href={`https://${meeting.link}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#0B4DA2] font-bold hover:underline flex items-center gap-1 group-hover:gap-2 transition-all"
            >
              <LinkIcon size={12} />
              Join Meeting
            </a>
          ) : (
            <div className="text-xs text-gray-600 font-medium flex items-center gap-1">
              <MapPin size={12} className="text-[#0B4DA2]" />
              Venue: {meeting.type}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export const DashboardPageOld = ({ data, onNavigate }) => {
  const greeting = getGreeting();
  const [isClockedIn, setIsClockedIn] = useState(true);

  // ── Resolve all data from props, falling back to safe defaults ─────────────
  const dashStats        = data.stats           || defaultDashStats;
  const meetings         = data.meetings         || defaultMeetings;
  const keyContacts      = data.keyContacts      || defaultKeyContacts;
  const recentRequests   = data.recentRequests   || defaultRecentRequests;
  const upcomingTraining = data.upcomingTraining || defaultUpcomingTraining;
  const notifications    = data.notifications    || defaultNotifications;
  const myAssets         = data.myAssets         || defaultMyAssets;
  // ──────────────────────────────────────────────────────────────────────────

  const handleClockIn = () => {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    alert(`Clocked In at ${currentTime}`);
    setIsClockedIn(true);
  };

  const handleClockOut = () => {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    alert(`Clocked Out at ${currentTime}`);
    setIsClockedIn(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl shadow-blue-900/30 relative overflow-hidden flex flex-col justify-center min-h-[220px] group">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-20 w-40 h-40 bg-[#87CEEB] rounded-full blur-3xl animate-pulse delay-700"></div>
          </div>

          <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
            <div className="absolute top-8 right-8 w-32 h-0.5 bg-white rotate-45"></div>
            <div className="absolute top-8 right-44 w-24 h-0.5 bg-white rotate-45"></div>
            <div className="absolute top-8 right-72 w-16 h-0.5 bg-white rotate-45"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4 gap-6">
              <div className="shrink-0 animate-in slide-in-from-left duration-500">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
                  <img
                    src={data.user.avatar || "https://via.placeholder.com/150"}
                    alt={data.user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2 animate-in slide-in-from-left duration-500">
                  {greeting},<br />
                  <span className="text-4xl bg-gradient-to-r from-white to-[#87CEEB] bg-clip-text text-transparent">
                    {data.user.name.split(' ')[0]}!
                  </span>
                </h2>
                <div className="flex items-center gap-2 mb-4 animate-in slide-in-from-left duration-700">
                  <span className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 flex items-center gap-1 hover:bg-white/20 transition-all">
                    <Briefcase size={12} />
                    {data.user.designation || 'Senior Technician'}
                  </span>
                  <span className="bg-[#05CD99]/20 px-3 py-1.5 rounded-full text-xs font-bold text-[#05CD99] border border-[#05CD99]/30 flex items-center gap-1 animate-pulse">
                    <div className="w-1.5 h-1.5 bg-[#05CD99] rounded-full"></div>
                    Active
                  </span>
                  <span className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold border border-white/20 flex items-center gap-1">
                    <Clock size={12} />
                    On Time
                  </span>
                </div>
              </div>

              <div className="hidden md:flex flex-row gap-2 animate-in slide-in-from-right duration-700">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center min-w-[120px]">
                  <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wide">This Month</p>
                  <p className="text-xl font-bold">{dashStats.trainingHours}h</p>
                  <p className="text-[10px] text-blue-200">Training</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center min-w-[120px]">
                  <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wide">Available</p>
                  <p className="text-xl font-bold">{dashStats.leaveBalance}</p>
                  <p className="text-[10px] text-blue-200">Leave Days</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 animate-in slide-in-from-bottom duration-700 hover:bg-white/15 transition-all mt-2">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2">
                  <div className="space-y-1.5">
                    <div>
                      <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wide mb-0.5">Employee ID</p>
                      <p className="text-sm font-bold text-white">{data.user.employeeId || data.user.empId || 'SMG-EMP-001'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wide mb-0.5">Department</p>
                      <p className="text-sm font-bold text-white">{data.user.department || data.user.dept || 'Engineering'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wide mb-0.5">Designation</p>
                      <p className="text-sm font-bold text-white">{data.user.designation || data.user.role || 'Senior Engineer'}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div>
                      <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wide mb-0.5">Email</p>
                      <p className="text-xs font-medium text-white truncate">{data.user.email || 'employee@smg.com'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wide mb-0.5">Phone</p>
                      <p className="text-sm font-bold text-white">{data.user.phone || '+91 98765 43210'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wide mb-0.5">Joining Date</p>
                      <p className="text-sm font-bold text-white">{data.user.joiningDate || data.user.dateOfJoining || '15 Jan 2020'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-12 translate-y-12 group-hover:scale-110 transition-transform duration-700">
            <Briefcase size={240} strokeWidth={1} />
          </div>

          <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 left-1/4 w-1.5 h-1.5 bg-[#87CEEB]/40 rounded-full animate-ping delay-500"></div>
          <div className="absolute bottom-1/4 right-1/3 w-1 h-1 bg-white/40 rounded-full animate-ping delay-1000"></div>
        </div>

        {/* Leave Details Card */}
        <div className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-[#1B254B] text-lg">Leave Details</h3>
            <button
              onClick={() => onNavigate('my-attendance')}
              className="text-xs font-bold text-[#0B4DA2] hover:underline"
            >
              View Attendance →
            </button>
          </div>

          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#E5E7EB" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#042A5B" strokeWidth="12" strokeDasharray="100.53 251.33" strokeDashoffset="0" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#0B4DA2" strokeWidth="12" strokeDasharray="25.13 251.33" strokeDashoffset="-100.53" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#87CEEB" strokeWidth="12" strokeDasharray="100.53 251.33" strokeDashoffset="-125.66" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#5DADE2" strokeWidth="12" strokeDasharray="100.53 251.33" strokeDashoffset="-226.19" />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-600 mb-3">Used leaves</h4>
            {[
              { label: 'General Leave', used: 4, total: 10, color: '#042A5B', pct: '40%' },
              { label: 'Medical Leave', used: 1, total: 10, color: '#0B4DA2', pct: '10%' },
              { label: 'Work From Home', used: 4, total: 10, color: '#87CEEB', pct: '40%' },
              { label: 'Half-Day Leave', used: 4, total: 10, color: '#5DADE2', pct: '40%' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-600">{item.label}</span>
                  <span className="text-xs font-bold text-gray-800">{item.used} of {item.total}</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: item.pct, backgroundColor: item.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Leave Bal"
          value={dashStats.leaveBalance}
          icon={Calendar}
          colorClass="text-[#0B4DA2] bg-[#0B4DA2]"
          subtext="Days Remaining"
          onClick={() => onNavigate('leaves')}
        />
        <StatCard
          label="Canteen"
          value="50"
          icon={UtensilsCrossed}
          colorClass="text-[#EE5D50] bg-[#EE5D50]"
          subtext="Coupons Requested"
          onClick={() => onNavigate('canteen')}
        />
        <StatCard
          label="Training"
          value={dashStats.trainingHours}
          icon={BookOpen}
          colorClass="text-[#05CD99] bg-[#05CD99]"
          subtext="Hours Completed"
          onClick={() => onNavigate('training')}
        />
        <StatCard
          label="Pending"
          value={dashStats.pendingRequests}
          icon={Clock}
          colorClass="text-[#FFB547] bg-[#FFB547]"
          subtext="Requests"
          onClick={() => onNavigate('general-requests')}
        />
      </div>

      <div>
        <h3 className="text-lg font-bold text-[#1B254B] mb-4 flex items-center gap-2">
          <Zap size={20} className="text-[#FFB547]" /> Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { label: "Leave", icon: Calendar, action: 'leaves' },
            { label: "Gate Pass", icon: LogOut, action: 'gate-pass' },
            { label: "Payroll", icon: DollarSign, action: 'payroll' },
            { label: "Projects", icon: Briefcase, action: 'projects' },
            { label: "Transport", icon: Truck, action: 'transport' },
            { label: "Mail", icon: Mail, action: 'mail' },
            { label: "Support", icon: LifeBuoy, action: 'general-requests' },
            { label: "Welfare", icon: Heart, action: 'welfare' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => item.action === 'mail' ? alert("Opening Outlook...") : onNavigate(item.action)}
              className="flex flex-col items-center justify-center p-3 bg-white rounded-[20px] border border-gray-100 hover:border-[#0B4DA2]/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group active:scale-95"
            >
              <div className="bg-[#F4F7FE] p-2.5 rounded-2xl mb-2 group-hover:bg-[#0B4DA2] group-hover:text-white text-[#0B4DA2] transition-colors shadow-sm">
                <item.icon size={20} />
              </div>
              <span className="text-[10px] font-bold text-[#1B254B] group-hover:text-[#0B4DA2] transition-colors">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TodaysMeetingsCard meetings={meetings} />
        <KeyContactsCard contacts={keyContacts} reportingManager={data.user.reportingTo} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <RecentRequestsCard requests={recentRequests} onNewRequest={() => onNavigate('leaves')} />
          <UpcomingTrainingCard training={upcomingTraining} />
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-[#1B254B] text-lg">Notifications</h3>
              <button
                onClick={() => onNavigate('notifications')}
                className="text-xs font-bold text-[#0B4DA2] hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-4">
              {notifications.map((n, i) => (
                <div key={i} className="flex gap-3 items-start pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="w-2 h-2 mt-1.5 bg-[#0B4DA2] rounded-full shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600 leading-tight">{n.text}</p>
                    <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <MyAssetsCard assets={myAssets} />
        </div>
      </div>
    </div>
  );
};
