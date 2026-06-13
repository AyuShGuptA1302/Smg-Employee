import React from 'react';
import { RequestsTable } from '../../components/RequestsTable';

export const SuperAdminRequestsPage = () => {
  const requests = [
    { id: 'REQ-001', type: 'Leave', description: 'Annual leave 5 days', date: '2025-12-14', status: 'Pending', approver: 'HR Admin' },
    { id: 'REQ-002', type: 'Asset', description: 'Laptop replacement', date: '2025-12-12', status: 'Approved', approver: 'IT Admin' },
    { id: 'REQ-003', type: 'Transport', description: 'Airport pickup', date: '2025-12-11', status: 'In Progress', approver: 'Ops Admin' },
    { id: 'REQ-004', type: 'Document', description: 'Experience certificate', date: '2025-12-10', status: 'Rejected', approver: 'HR Admin' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#1B254B]">All Requests</h2>
        <p className="text-xs text-gray-500">Company-wide request oversight and audit trail</p>
      </div>
      <RequestsTable requests={requests} showViewButton />
    </div>
  );
};
