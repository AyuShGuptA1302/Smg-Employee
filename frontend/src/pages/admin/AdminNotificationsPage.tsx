import React, { useState } from 'react';
import {
  Bell,
  Send,
  Users,
  Filter,
  Calendar,
  AlertCircle,
  Info,
  CheckCircle,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';

interface AdminNotificationsPageProps {
  onNavigate: (page: string) => void;
}

export const AdminNotificationsPage = ({ onNavigate }: AdminNotificationsPageProps) => {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('info');
  const [targetAudience, setTargetAudience] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const sentNotifications = [
    {
      id: 1,
      title: 'Holiday Announcement',
      message: 'Company will remain closed on Dec 25th for Christmas',
      type: 'info',
      sentTo: 'All Employees',
      sentOn: '2024-12-10 10:30 AM',
      recipients: 1247
    },
    {
      id: 2,
      title: 'Urgent: Safety Training',
      message: 'Mandatory safety training session scheduled for all production staff',
      type: 'warning',
      sentTo: 'Production Department',
      sentOn: '2024-12-09 02:15 PM',
      recipients: 450
    },
    {
      id: 3,
      title: 'Payroll Update',
      message: 'December salary will be credited on 28th Dec instead of 30th',
      type: 'success',
      sentTo: 'All Employees',
      sentOn: '2024-12-08 09:00 AM',
      recipients: 1247
    },
    {
      id: 4,
      title: 'New Policy Released',
      message: 'Updated Work from Home policy is now available in the policy section',
      type: 'info',
      sentTo: 'All Employees',
      sentOn: '2024-12-07 11:45 AM',
      recipients: 1247
    }
  ];

  const departments = [
    'Production',
    'Quality Control',
    'Engineering',
    'Sales & Marketing',
    'Administration',
    'R&D',
    'HR',
    'Finance',
    'IT',
    'Logistics',
    'Procurement',
    'Maintenance'
  ];

  const handleBroadcast = () => {
    if (notificationTitle.trim() && notificationMessage.trim()) {
      alert(`Broadcasting notification to ${targetAudience === 'all' ? 'All Employees' : selectedDepartment}`);
      setShowBroadcastModal(false);
      setNotificationTitle('');
      setNotificationMessage('');
      setNotificationType('info');
      setTargetAudience('all');
      setSelectedDepartment('');
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-600" size={20} />;
      default:
        return <Info className="text-blue-600" size={20} />;
    }
  };

  const getTypeClass = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notification Center</h1>
            <p className="text-blue-100">Broadcast announcements and manage employee notifications</p>
          </div>
          <button
            onClick={() => setShowBroadcastModal(true)}
            className="bg-white text-[#0B4DA2] px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-lg"
          >
            <Send size={18} />
            Broadcast Notification
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Bell size={24} className="text-[#0B4DA2]" />
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
          </div>
          <p className="text-2xl font-bold text-[#1B254B]">24</p>
          <p className="text-xs text-gray-500">Total Sent Today</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Users size={24} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-[#1B254B]">1,247</p>
          <p className="text-xs text-gray-500">Total Recipients</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Eye size={24} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-[#1B254B]">98.5%</p>
          <p className="text-xs text-gray-500">Read Rate</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Calendar size={24} className="text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-[#1B254B]">156</p>
          <p className="text-xs text-gray-500">This Month</p>
        </div>
      </div>

      {/* Sent Notifications */}
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-[#1B254B] text-lg">Sent Notifications</h3>
          <div className="flex gap-2">
            <button className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              All
            </button>
            <button className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              Today
            </button>
            <button className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              This Week
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {sentNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-5 rounded-xl border transition-all ${getTypeClass(notification.type)}`}
            >
              <div className="flex items-start gap-4">
                <div className="bg-white p-3 rounded-xl shadow-sm">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-[#1B254B] mb-1">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-white rounded-lg transition-colors">
                        <Edit size={16} className="text-gray-400" />
                      </button>
                      <button className="p-2 hover:bg-white rounded-lg transition-colors">
                        <Trash2 size={16} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Users size={12} />
                      {notification.recipients} Recipients
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} />
                      {notification.sentOn}
                    </span>
                    <span className="text-xs font-bold text-[#0B4DA2] bg-white px-2 py-1 rounded">
                      {notification.sentTo}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Broadcast Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] max-w-2xl w-full shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#1B254B]">Broadcast Notification</h3>
                <button
                  onClick={() => {
                    setShowBroadcastModal(false);
                    setNotificationTitle('');
                    setNotificationMessage('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Notification Type */}
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-2">Notification Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setNotificationType('info')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      notificationType === 'info'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Info size={20} className="text-blue-600 mx-auto mb-1" />
                    <p className="text-xs font-bold text-center">Info</p>
                  </button>
                  <button
                    onClick={() => setNotificationType('success')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      notificationType === 'success'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <CheckCircle size={20} className="text-green-600 mx-auto mb-1" />
                    <p className="text-xs font-bold text-center">Success</p>
                  </button>
                  <button
                    onClick={() => setNotificationType('warning')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      notificationType === 'warning'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-yellow-300'
                    }`}
                  >
                    <AlertCircle size={20} className="text-yellow-600 mx-auto mb-1" />
                    <p className="text-xs font-bold text-center">Warning</p>
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-2">Title</label>
                <input
                  type="text"
                  value={notificationTitle}
                  onChange={(e) => setNotificationTitle(e.target.value)}
                  placeholder="Enter notification title..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#0B4DA2] focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-2">Message</label>
                <textarea
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  placeholder="Enter notification message..."
                  className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:border-[#0B4DA2] focus:ring-2 focus:ring-blue-100 outline-none"
                />
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-bold text-[#1B254B] mb-2">Target Audience</label>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    onClick={() => setTargetAudience('all')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      targetAudience === 'all'
                        ? 'border-[#0B4DA2] bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Users size={20} className="text-[#0B4DA2] mx-auto mb-1" />
                    <p className="text-xs font-bold text-center">All Employees</p>
                    <p className="text-[10px] text-gray-500 text-center">1,247 employees</p>
                  </button>
                  <button
                    onClick={() => setTargetAudience('department')}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      targetAudience === 'department'
                        ? 'border-[#0B4DA2] bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Filter size={20} className="text-[#0B4DA2] mx-auto mb-1" />
                    <p className="text-xs font-bold text-center">Specific Department</p>
                    <p className="text-[10px] text-gray-500 text-center">Select department</p>
                  </button>
                </div>

                {targetAudience === 'department' && (
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#0B4DA2] focus:ring-2 focus:ring-blue-100 outline-none"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept, idx) => (
                      <option key={idx} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowBroadcastModal(false);
                  setNotificationTitle('');
                  setNotificationMessage('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBroadcast}
                className="flex-1 bg-[#0B4DA2] text-white py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors flex items-center justify-center gap-2"
              >
                <Send size={18} />
                Broadcast Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
