import React, { useEffect, useState, useMemo } from 'react';
import { SummaryCard } from '../../components/SummaryCard';
import { QuickActions } from '../../components/QuickActions';
import { RequestsTable } from '../../components/RequestsTable';
import { useAuth } from '../../context/AuthContext';
import { getDashboardData, getTrainings, getDocuments } from '../../services/api';
import { Calendar, Package, Users, FileText, Clock, Bell, CreditCard, Loader2 } from 'lucide-react';

// Time-based greeting
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
}

export function Dashboard() {
  const { user } = useAuth();
  const [dashData, setDashData] = useState<any>(null);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const fetchData = async () => {
      try {
        const [dash, train] = await Promise.all([
          getDashboardData(user.id),
          getTrainings(),
        ]);
        setDashData(dash);
        setTrainings(Array.isArray(train) ? train : []);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--smg-royal)' }} />
        <span className="ml-3 text-gray-500">Loading dashboard...</span>
      </div>
    );
  }

  const summaryStats = [
    { id: '1', title: 'Leave Balance', value: dashData?.leaveBalance ?? 0, icon: Calendar, color: '#3b82f6', trend: 'Available days' },
    { id: '2', title: 'Pending Requests', value: dashData?.pendingRequests ?? 0, icon: Clock, color: '#f59e0b', trend: 'Awaiting approval' },
    { id: '3', title: 'Training Enrolled', value: dashData?.trainingEnrolled ?? 0, icon: Package, color: '#10b981', trend: 'Active courses' },
    { id: '4', title: 'Notifications', value: dashData?.unreadNotifications ?? 0, icon: Bell, color: '#ef4444', trend: 'Unread' },
  ];

  const quickActions = [
    { id: '1', label: 'Apply Leave', icon: Calendar, path: '/leaves' },
    { id: '2', label: 'My Documents', icon: FileText, path: '/documents' },
    { id: '3', label: 'View Payslip', icon: CreditCard, path: '/payroll' },
    { id: '4', label: 'My Requests', icon: Clock, path: '/requests' },
  ];

  const recentRequests = (dashData?.recentRequests || []).map((r: any) => ({
    id: r._id || r.id,
    type: r.type || 'Request',
    date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '-',
    status: r.status || 'Pending',
    description: r.reason || r.type || '',
  }));

  const upcomingTraining = trainings.slice(0, 3).map((t: any) => ({
    id: t._id,
    title: t.title,
    date: t.date ? new Date(t.date).toLocaleDateString('en-IN') : '-',
    duration: t.duration || '-',
    instructor: t.instructor || '-',
    mandatory: t.mandatory || false,
  }));

  const myAssets = (dashData?.user?.assets || []).slice(0, 4).map((a: any, i: number) => ({
    id: a._id || `asset-${i}`,
    name: a.name || a.assetName || 'Asset',
    type: a.type || a.category || 'Equipment',
    condition: a.condition || 'Good',
  }));

  const teamContacts = (dashData?.meetings || []).slice(0, 3).map((m: any) => ({
    id: m._id,
    name: m.organizer?.name || 'Team Member',
    designation: m.title || 'Meeting',
    avatar: m.organizer?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.organizer?.name || 'T')}&background=0B4DA2&color=fff`,
  }));

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Welcome Section */}
      <div className="mb-2">
        <div className="flex items-center gap-3 mb-2">
          <h1 style={{ color: 'var(--smg-dark)' }}>
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Employee'} 👋
          </h1>
        </div>
        <p className="text-gray-500">Here&apos;s what&apos;s happening with your account today.</p>
      </div>

      {/* Summary Cards */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
        <div className="flex lg:grid lg:grid-cols-4 gap-4 lg:gap-6">
          {summaryStats.map((stat) => (
            <SummaryCard key={stat.id} {...stat} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions actions={quickActions} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RequestsTable requests={recentRequests.slice(0, 5)} />
        </div>

        <div className="space-y-6">
          {/* Upcoming Training */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: 'var(--smg-border)' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'var(--smg-light-blue)' }}>
                  <Calendar size={20} style={{ color: 'var(--smg-royal)' }} strokeWidth={2.5} />
                </div>
                <h3 style={{ color: 'var(--smg-dark)' }}>Upcoming Training</h3>
              </div>
            </div>
            <div className="space-y-3">
              {upcomingTraining.length === 0 && <p className="text-sm text-gray-400">No upcoming trainings</p>}
              {upcomingTraining.map((training) => (
                <div key={training.id} className="p-4 bg-gray-50 rounded-xl border hover:shadow-md transition-all cursor-pointer group" style={{ borderColor: 'var(--smg-border)' }}>
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium group-hover:text-blue-600 transition-colors" style={{ color: 'var(--smg-dark)' }}>{training.title}</h4>
                    {training.mandatory && (
                      <span className="text-xs px-2 py-1 rounded-lg font-medium whitespace-nowrap" style={{ backgroundColor: '#FEF2F2', color: '#ef4444' }}>Required</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{training.date}</p>
                  <p className="text-xs text-gray-500">{training.duration} • {training.instructor}</p>
                </div>
              ))}
            </div>
          </div>

          {/* My Assets */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: 'var(--smg-border)' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#F3E5F5' }}>
                  <Package size={20} style={{ color: '#9333ea' }} strokeWidth={2.5} />
                </div>
                <h3 style={{ color: 'var(--smg-dark)' }}>My Assets</h3>
              </div>
            </div>
            <div className="space-y-2">
              {myAssets.length === 0 && <p className="text-sm text-gray-400">No assets assigned</p>}
              {myAssets.map((asset: any) => (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <div>
                    <h4 className="text-sm font-medium" style={{ color: 'var(--smg-dark)' }}>{asset.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{asset.type}</p>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-lg font-medium" style={{ backgroundColor: '#ECFDF5', color: '#10b981' }}>{asset.condition}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team Contacts */}
          <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: 'var(--smg-border)' }}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
                  <Users size={20} style={{ color: '#10b981' }} strokeWidth={2.5} />
                </div>
                <h3 style={{ color: 'var(--smg-dark)' }}>Key Contacts</h3>
              </div>
            </div>
            <div className="space-y-3">
              {teamContacts.length === 0 && <p className="text-sm text-gray-400">No contacts available</p>}
              {teamContacts.map((contact: any) => (
                <div key={contact.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <img src={contact.avatar} alt={contact.name} className="w-11 h-11 rounded-xl object-cover" style={{ border: '2px solid var(--smg-light-blue)' }} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate" style={{ color: 'var(--smg-dark)' }}>{contact.name}</h4>
                    <p className="text-xs text-gray-500 truncate">{contact.designation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}