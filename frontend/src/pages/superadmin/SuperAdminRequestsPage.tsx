import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, Shield, User, ChevronDown, ChevronUp, Loader2, RefreshCw } from 'lucide-react';

interface AdminProfileRequest {
  _id: string;
  reqId: string;
  type: string;
  description: string;
  fields: Record<string, string>;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  user?: {
    name?: string;
    empId?: string;
    dept?: string;
    email?: string;
  };
}

const fieldLabels: Record<string, string> = {
  name: 'Full Name',
  email: 'Email Address',
  phone: 'Mobile Number',
  dateOfBirth: 'Date of Birth',
  bloodGroup: 'Blood Group',
  address: 'Address',
  emergencyContact: 'Emergency Contact',
};

export const SuperAdminRequestsPage = () => {
  const [requests, setRequests] = useState<AdminProfileRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [processing, setProcessing] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin-profile-requests');
      if (res.ok) {
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch admin profile requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id: string, status: 'Approved' | 'Rejected') => {
    setProcessing(id);
    try {
      const res = await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRequests(prev => prev.map(r => r._id === id ? { ...r, status } : r));
        showToast(`Request ${status === 'Approved' ? 'approved' : 'rejected'} successfully.`, 'success');
      } else {
        showToast('Failed to update request status.', 'error');
      }
    } catch {
      showToast('Network error. Please try again.', 'error');
    } finally {
      setProcessing(null);
    }
  };

  const pending = requests.filter(r => r.status === 'Pending');
  const decided = requests.filter(r => r.status !== 'Pending');

  const RequestCard = ({ req }: { req: AdminProfileRequest }) => {
    const isExpanded = expandedId === req._id;
    const isProcessing = processing === req._id;
    const fields = req.fields || {};

    return (
      <div className={`bg-white rounded-[20px] border shadow-sm overflow-hidden transition-all duration-200 ${
        req.status === 'Pending' ? 'border-yellow-200' :
        req.status === 'Approved' ? 'border-green-200' : 'border-red-200'
      }`}>
        {/* Header Row */}
        <div
          className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setExpandedId(isExpanded ? null : req._id)}
        >
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#F4F7FE] flex items-center justify-center shrink-0">
              <Shield size={20} className="text-[#0B4DA2]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[#1B254B] text-sm">{req.reqId}</span>
                <span className="text-xs text-gray-400">•</span>
                <span className="font-semibold text-[#0B4DA2] text-sm">{req.type}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                <User size={12} />
                <span>{req.user?.name || 'Admin'}</span>
                {req.user?.empId && <><span>•</span><span>{req.user.empId}</span></>}
                {req.user?.dept && <><span>•</span><span>{req.user.dept}</span></>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-xs text-gray-400">
              {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
              req.status === 'Approved' ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>
              {req.status === 'Pending' ? '⏳ Pending' : req.status === 'Approved' ? '✅ Approved' : '❌ Rejected'}
            </span>
            {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
          </div>
        </div>

        {/* Expanded Detail */}
        {isExpanded && (
          <div className="px-5 pb-5 border-t border-gray-100 bg-[#FAFBFF] animate-in slide-in-from-top-2 duration-200">
            <div className="mt-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Requested Changes</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(fields).map(([key, value]) => (
                  <div key={key} className="bg-white p-3 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-400 font-medium mb-1">
                      {fieldLabels[key] || key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p className="text-sm font-bold text-[#1B254B]">{String(value)}</p>
                  </div>
                ))}
              </div>

              {req.status === 'Pending' && (
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => handleAction(req._id, 'Approved')}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0B4DA2] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-[#042A5B] transition-all active:scale-95 disabled:opacity-60"
                  >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(req._id, 'Rejected')}
                    disabled={isProcessing}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#EE5D50] text-white py-2.5 rounded-xl font-bold text-sm hover:bg-red-600 transition-all active:scale-95 disabled:opacity-60"
                  >
                    {isProcessing ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-2xl text-white font-bold text-sm flex items-center gap-2 animate-in slide-in-from-right-4 duration-300 ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        }`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Page Header */}
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Admin Profile Requests</h2>
              <p className="text-blue-100">Review and approve profile update requests submitted by Admins</p>
              <div className="flex items-center gap-3 mt-4">
                <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/20">
                  ⏳ {pending.length} Pending
                </span>
                <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold border border-white/20">
                  📋 {requests.length} Total
                </span>
              </div>
            </div>
            <button
              onClick={fetchRequests}
              className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48 bg-white rounded-[24px] shadow-sm border border-gray-100">
          <Loader2 className="animate-spin text-[#0B4DA2]" size={32} />
          <span className="ml-3 text-gray-500 font-medium">Loading requests...</span>
        </div>
      ) : (
        <>
          {/* Pending Requests */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={18} className="text-yellow-500" />
              <h3 className="font-bold text-[#1B254B]">Pending Approval ({pending.length})</h3>
            </div>
            {pending.length === 0 ? (
              <div className="bg-white rounded-[20px] p-8 text-center border border-gray-100 shadow-sm">
                <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
                <p className="font-bold text-[#1B254B]">All caught up!</p>
                <p className="text-sm text-gray-500 mt-1">No pending admin profile requests.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pending.map(req => <RequestCard key={req._id} req={req} />)}
              </div>
            )}
          </div>

          {/* Decided Requests */}
          {decided.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Shield size={18} className="text-gray-400" />
                <h3 className="font-bold text-[#1B254B]">Decided ({decided.length})</h3>
              </div>
              <div className="space-y-3">
                {decided.map(req => <RequestCard key={req._id} req={req} />)}
              </div>
            </div>
          )}

          {requests.length === 0 && !loading && (
            <div className="bg-white rounded-[20px] p-10 text-center border border-gray-100 shadow-sm">
              <Shield size={48} className="text-gray-200 mx-auto mb-3" />
              <p className="font-bold text-[#1B254B] text-lg">No Admin Profile Requests</p>
              <p className="text-sm text-gray-400 mt-1">Admin profile update requests will appear here for your approval.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
