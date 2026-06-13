import React from 'react';
import { Settings } from 'lucide-react';

export const SuperAdminSettingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-[#1B254B]">System Settings</h2>
        <p className="text-xs text-gray-500">Configure approval workflows, security policies and catalogs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#1B254B] mb-3">Approval Workflows</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <label className="flex items-center gap-3"><input type="checkbox" className="rounded" /> Enable multi-level approvals</label>
            <label className="flex items-center gap-3"><input type="checkbox" className="rounded" /> Require comments on rejection</label>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
          <h3 className="font-bold text-[#1B254B] mb-3">Security Policies</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <label className="flex items-center gap-3"><input type="checkbox" className="rounded" /> Enforce strong passwords</label>
            <label className="flex items-center gap-3"><input type="checkbox" className="rounded" /> Two-factor authentication</label>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 md:col-span-2">
          <h3 className="font-bold text-[#1B254B] mb-3">Service Catalogs</h3>
          <p className="text-sm text-gray-600">Manage canteen, transport, SIM, uniform and welfare services.</p>
          <button className="mt-3 bg-[#0B4DA2] text-white px-4 py-2 rounded-xl font-bold">Open Catalog Manager</button>
        </div>
      </div>
    </div>
  );
};
