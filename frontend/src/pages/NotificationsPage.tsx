import React, { useState, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, Filter, Clock, Calendar, AlertCircle, Info, CheckCircle, Loader2 } from 'lucide-react';
import { getNotifications, markNotificationRead } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const NotificationsPage = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const fetchNotifications = async () => {
    if (!user?.id) return;
    try {
      const data = await getNotifications(user.id);
      setNotifications(Array.isArray(data) ? data.map((n: any) => ({
        id: n._id,
        type: n.type || 'info',
        title: n.title || 'Notification',
        message: n.message || '',
        time: getRelativeTime(n.createdAt),
        date: n.createdAt ? new Date(n.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-',
        read: n.isRead || false,
      })) : []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [user?.id]);

  function getRelativeTime(dateStr: string): string {
    if (!dateStr) return '-';
    const now = new Date();
    const then = new Date(dateStr);
    const diffMs = now.getTime() - then.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin} min ago`;
    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? 's' : ''} ago`;
    const diffDay = Math.floor(diffHr / 24);
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDay / 7)} week${Math.floor(diffDay / 7) > 1 ? 's' : ''} ago`;
  }

  const handleMarkRead = async (notifId: string) => {
    try {
      await markNotificationRead(notifId);
      setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await Promise.all(notifications.filter(n => !n.read).map(n => markNotificationRead(n.id)));
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  const handleDismiss = (notifId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notifId));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="text-green-600" size={20} />;
      case 'warning': return <AlertCircle className="text-yellow-600" size={20} />;
      default: return <Info className="text-blue-600" size={20} />;
    }
  };

  const getTypeClass = (type: string) => {
    switch(type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  const filteredNotifications = selectedFilter === 'all' 
    ? notifications 
    : selectedFilter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications.filter(n => n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--smg-royal)' }} />
        <span className="ml-3 text-gray-500">Loading notifications...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-blue-100">Stay updated with all your important alerts</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20">
            <p className="text-xs text-blue-200 mb-1">Unread</p>
            <p className="text-3xl font-bold">{unreadCount}</p>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${ selectedFilter === 'all'
                  ? 'bg-[#0B4DA2] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setSelectedFilter('unread')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'unread'
                  ? 'bg-[#0B4DA2] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setSelectedFilter('read')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'read'
                  ? 'bg-[#0B4DA2] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Read ({notifications.length - unreadCount})
            </button>
          </div>
          <div className="flex gap-2">
            <button onClick={handleMarkAllRead} className="px-4 py-2 rounded-xl text-xs font-bold bg-green-50 text-green-600 hover:bg-green-100 transition-all flex items-center gap-1">
              <CheckCheck size={14} />
              Mark All Read
            </button>
            <button onClick={handleClearAll} className="px-4 py-2 rounded-xl text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-all flex items-center gap-1">
              <Trash2 size={14} />
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-[20px] p-5 shadow-sm border transition-all hover:shadow-md ${
              notification.read ? 'border-gray-100' : 'border-[#0B4DA2]/30 bg-blue-50/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${getTypeClass(notification.type)}`}>
                {getTypeIcon(notification.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-[#1B254B] flex items-center gap-2">
                      {notification.title}
                      {!notification.read && (
                        <span className="w-2 h-2 bg-[#0B4DA2] rounded-full"></span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  </div>
                  <button onClick={() => handleDismiss(notification.id)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                    <X size={16} className="text-gray-400" />
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={12} />
                    {notification.time}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar size={12} />
                    {notification.date}
                  </span>
                  {!notification.read && (
                    <button onClick={() => handleMarkRead(notification.id)} className="ml-auto text-xs font-bold text-[#0B4DA2] hover:underline flex items-center gap-1">
                      <Check size={12} />
                      Mark as Read
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredNotifications.length === 0 && (
        <div className="bg-white rounded-[24px] p-12 text-center shadow-sm border border-gray-100">
          <Bell size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-[#1B254B] mb-2">No Notifications</h3>
          <p className="text-gray-500">You're all caught up! No {selectedFilter !== 'all' ? selectedFilter : ''} notifications to show.</p>
        </div>
      )}
    </div>
  );
};
