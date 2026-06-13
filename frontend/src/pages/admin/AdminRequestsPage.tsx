import React, { useState, useEffect } from 'react';
import {
  FileText,
  Filter,
  Search,
  Download,
  Check,
  X,
  MessageSquare,
  Calendar,
  User,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Printer
} from 'lucide-react';

interface AdminRequestsPageProps {
  onNavigate: (page: string) => void;
}

export const AdminRequestsPage = ({ onNavigate }: AdminRequestsPageProps) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [comment, setComment] = useState('');

  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/admin/requests')
      .then(res => res.ok ? res.json() : [])
      .then(data => setRequests(data))
      .catch(console.error);
  }, []);

  const filteredRequests = requests.filter(req => {
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'pending' && req.status === 'Pending') ||
      (selectedFilter === 'approved' && req.status === 'Approved') ||
      (selectedFilter === 'rejected' && req.status === 'Rejected');

    const matchesSearch =
      searchQuery === '' ||
      req.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.type.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleApprove = (req) => {
    let endpoint = '';
    if (req.type === 'Leave Request') endpoint = `/api/leaves/${req.id}/approve`;
    else if (req.type === 'Gate Pass') endpoint = `/api/gatepasses/${req.id}/approve`;
    else endpoint = `/api/requests/${req.id}/approve`;

    fetch(`${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    }).then(() => {
      setRequests(requests.map(r => r.id === req.id ? { ...r, status: 'Approved' } : r));
      setSelectedRequest(null);
    }).catch(console.error);
  };

  const handleReject = (req) => {
    setShowCommentModal(true);
  };

  const handleRejectWithComment = () => {
    if (comment.trim() && selectedRequest) {
      let endpoint = '';
      if (selectedRequest.type === 'Leave Request') endpoint = `/api/leaves/${selectedRequest.id}/reject`;
      else if (selectedRequest.type === 'Gate Pass') endpoint = `/api/gatepasses/${selectedRequest.id}/reject`;
      else endpoint = `/api/requests/${selectedRequest.id}/reject`;

      fetch(`${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: comment })
      }).then(() => {
        setRequests(requests.map(r => r.id === selectedRequest.id ? { ...r, status: 'Rejected', rejectionReason: comment } : r));
        setShowCommentModal(false);
        setComment('');
        setSelectedRequest(null);
      }).catch(console.error);
    }
  };

  const handleDownloadPDF = (req) => {
    if (req.type === 'Leave Request') {
      window.open(`/api/pdf/leave/${req.id}`, '_blank');
    } else if (req.type === 'Gate Pass') {
      window.open(`/api/pdf/gatepass/${req.id}`, '_blank');
    } else {
      alert(`No PDF available for ${req.type}`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'Rejected':
        return <XCircle className="text-red-600" size={20} />;
      default:
        return <AlertCircle className="text-yellow-600" size={20} />;
    }
  };

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;
  const rejectedCount = requests.filter(r => r.status === 'Rejected').length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Request Management</h1>
            <p className="text-blue-100">Review, approve, and manage all employee requests</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
              <p className="text-xs text-blue-200 mb-1">Pending</p>
              <p className="text-2xl font-bold">{pendingCount}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-xl border border-white/20">
              <p className="text-xs text-blue-200 mb-1">Approved</p>
              <p className="text-2xl font-bold">{approvedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-[24px] p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-400" />
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'all'
                  ? 'bg-[#0B4DA2] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({requests.length})
            </button>
            <button
              onClick={() => setSelectedFilter('pending')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'pending'
                  ? 'bg-[#0B4DA2] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setSelectedFilter('approved')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'approved'
                  ? 'bg-[#0B4DA2] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              onClick={() => setSelectedFilter('rejected')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedFilter === 'rejected'
                  ? 'bg-[#0B4DA2] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>
          <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2 w-64">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm ml-2 w-full"
            />
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Request ID</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Employee</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Department</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Priority</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="text-left p-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <span className="text-sm font-bold text-[#0B4DA2]">{req.id}</span>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-bold text-[#1B254B]">{req.employee}</p>
                      <p className="text-xs text-gray-400">{req.empId}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-700">{req.type}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-700">{req.department}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-xs text-gray-500">{new Date(req.submittedOn).toLocaleDateString()}</span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded ${
                        req.priority === 'High'
                          ? 'bg-red-100 text-red-700'
                          : req.priority === 'Medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {req.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(req.status)}
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          req.status === 'Approved'
                            ? 'bg-green-100 text-green-700'
                            : req.status === 'Rejected'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="p-2 bg-blue-50 text-[#0B4DA2] rounded-lg hover:bg-blue-100 transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      {req.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              handleApprove(req);
                            }}
                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                            title="Approve"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRequest(req);
                              handleReject(req);
                            }}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Reject"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDownloadPDF(req)}
                        className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Download PDF"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && !showCommentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#1B254B]">Request Details</h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Request ID</p>
                  <p className="font-bold text-[#0B4DA2]">{selectedRequest.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded ${
                      selectedRequest.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : selectedRequest.status === 'Rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {selectedRequest.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Employee Name</p>
                  <p className="font-bold text-[#1B254B]">{selectedRequest.employee}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Employee ID</p>
                  <p className="font-bold text-[#1B254B]">{selectedRequest.empId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Department</p>
                  <p className="font-bold text-[#1B254B]">{selectedRequest.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Request Type</p>
                  <p className="font-bold text-[#1B254B]">{selectedRequest.type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Priority</p>
                  <span
                    className={`inline-block text-xs font-bold px-3 py-1 rounded ${
                      selectedRequest.priority === 'High'
                        ? 'bg-red-100 text-red-700'
                        : selectedRequest.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {selectedRequest.priority}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Submitted On</p>
                  <p className="font-bold text-[#1B254B]">{new Date(selectedRequest.submittedOn).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Reason</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRequest.reason}</p>
              </div>

              {selectedRequest.fromDate && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">From Date</p>
                    <p className="font-bold text-[#1B254B]">{selectedRequest.fromDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">To Date</p>
                    <p className="font-bold text-[#1B254B]">{selectedRequest.toDate}</p>
                  </div>
                </div>
              )}

              {selectedRequest.approvedBy && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Approved By</p>
                  <p className="font-bold text-green-600">{selectedRequest.approvedBy} on {selectedRequest.approvedOn}</p>
                </div>
              )}

              {selectedRequest.rejectedBy && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Rejected By</p>
                  <p className="font-bold text-red-600">{selectedRequest.rejectedBy} on {selectedRequest.rejectedOn}</p>
                  <p className="text-sm text-gray-700 bg-red-50 p-3 rounded-lg mt-2">{selectedRequest.rejectionReason}</p>
                </div>
              )}

              {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Attachments</p>
                  <div className="space-y-2">
                    {selectedRequest.documents.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <span className="text-sm text-gray-700">{doc}</span>
                        <button className="text-[#0B4DA2] hover:underline text-xs font-bold">Download</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              {selectedRequest.status === 'Pending' && (
                <>
                  <button
                    onClick={() => handleApprove(selectedRequest)}
                    className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    Approve Request
                  </button>
                  <button
                    onClick={() => handleReject(selectedRequest)}
                    className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    Reject Request
                  </button>
                </>
              )}
              <button
                onClick={() => handleDownloadPDF(selectedRequest)}
                className="flex-1 bg-[#0B4DA2] text-white py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Comment Modal */}
      {showCommentModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-[24px] max-w-md w-full shadow-2xl animate-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-[#1B254B]">Rejection Reason</h3>
            </div>
            <div className="p-6">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                className="w-full h-32 p-3 border border-gray-200 rounded-xl resize-none focus:border-[#0B4DA2] focus:ring-2 focus:ring-blue-100 outline-none"
              />
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => {
                  setShowCommentModal(false);
                  setComment('');
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectWithComment}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
