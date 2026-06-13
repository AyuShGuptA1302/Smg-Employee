import React from 'react';
import { Bell, Send } from 'lucide-react';

export const SuperAdminNotificationsPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#1B254B]">Broadcast Notifications</h2>
        <p className="text-xs text-gray-500">Send company-wide announcements and targeted messages</p>
      </div>

      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="text-sm text-gray-600">Audience</label>
          <select className="w-full mt-1 px-3 py-2 border rounded-xl bg-[#F4F7FE]">
            <option>All Employees</option>
            <option>Admins only</option>
            <option>By Department</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-gray-600">Title</label>
          <input className="w-full mt-1 px-3 py-2 border rounded-xl bg-[#F4F7FE]" placeholder="Notification title" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Message</label>
          <textarea className="w-full mt-1 px-3 py-2 border rounded-xl bg-[#F4F7FE]" rows={5} placeholder="Write your message" />
        </div>
        <button className="bg-[#0B4DA2] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"><Bell size={16} /> <Send size={16} /> Send Notification</button>
      </div>
    </div>
  );
};
