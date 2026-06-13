import React from 'react';
import { BarChart3 } from 'lucide-react';

export const SuperAdminAnalyticsPage = () => {
  const cards = [
    { title: 'Company Attendance', value: '96.2%', note: 'Last 30 days' },
    { title: 'Requests Processed', value: '12,487', note: 'This year' },
    { title: 'Training Completion', value: '88%', note: 'Mandatory courses' },
    { title: 'Resource Utilization', value: '74%', note: 'Across departments' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#1B254B]">System-Wide Analytics</h2>
        <p className="text-xs text-gray-500">Company-wide attendance, requests, training and utilization metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#F4F7FE] flex items-center justify-center"><BarChart3 className="text-[#0B4DA2]" /></div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{c.title}</span>
            </div>
            <div className="text-3xl font-bold text-[#1B254B]">{c.value}</div>
            <p className="text-xs text-gray-500 mt-1">{c.note}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div className="h-48 bg-[#F4F7FE] rounded-2xl border border-dashed flex items-center justify-center text-sm text-gray-500">Charts placeholder (plug into Firestore later)</div>
      </div>
    </div>
  );
};
