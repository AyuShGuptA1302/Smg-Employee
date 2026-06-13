import React, { useState, useEffect } from 'react';
import { RequestsTable } from '../../components/RequestsTable';
import { getGeneralRequests, submitGeneralRequest } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, Filter, Loader2 } from 'lucide-react';

export function Requests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  useEffect(() => {
    if (!user?.id) return;
    const fetchRequests = async () => {
      try {
        const data = await getGeneralRequests(user.id);
        setRequests(Array.isArray(data) ? data.map((r: any) => ({
          id: r._id || r.id,
          type: r.type || 'Request',
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '-',
          status: r.status || 'Pending',
          description: r.description || r.reason || '',
        })) : []);
      } catch (err) {
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user?.id]);

  const handleNewRequest = async (type: string) => {
    try {
      await submitGeneralRequest({
        user: user?.id,
        type,
        description: `New ${type} request`,
        status: 'Pending',
      });
      // Refresh
      const data = await getGeneralRequests(user!.id);
      setRequests(Array.isArray(data) ? data.map((r: any) => ({
        id: r._id || r.id,
        type: r.type || 'Request',
        date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '-',
        status: r.status || 'Pending',
        description: r.description || r.reason || '',
      })) : []);
      setShowNewRequestModal(false);
    } catch (err) {
      console.error('Error creating request:', err);
    }
  };

  const filteredRequests =
    filterStatus === 'All'
      ? requests
      : requests.filter((req) => req.status === filterStatus);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--smg-royal)' }} />
        <span className="ml-3 text-gray-500">Loading requests...</span>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ color: 'var(--smg-dark)' }}>My Requests</h1>
          <p className="text-gray-600 mt-1">Track and manage your requests</p>
        </div>
        <button
          onClick={() => setShowNewRequestModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
          style={{ backgroundColor: 'var(--smg-royal)' }}
        >
          <Plus size={18} />
          New Request
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} style={{ color: 'var(--smg-royal)' }} />
          <h3 className="text-sm" style={{ color: 'var(--smg-dark)' }}>Filter by Status</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', 'Approved', 'Pending', 'In Progress', 'Rejected'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filterStatus === status ? 'text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              style={{ backgroundColor: filterStatus === status ? 'var(--smg-royal)' : undefined }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Table */}
      <RequestsTable requests={filteredRequests} showViewButton />

      {/* New Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="mb-4" style={{ color: 'var(--smg-dark)' }}>Create New Request</h3>
            <p className="text-sm text-gray-600 mb-6">Select the type of request you want to create:</p>
            <div className="space-y-2">
              {['Leave Application', 'Reimbursement', 'Asset Request', 'Certificate Request'].map((type) => (
                <button
                  key={type}
                  className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  onClick={() => handleNewRequest(type)}
                >
                  {type}
                </button>
              ))}
            </div>
            <button onClick={() => setShowNewRequestModal(false)} className="w-full mt-4 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
