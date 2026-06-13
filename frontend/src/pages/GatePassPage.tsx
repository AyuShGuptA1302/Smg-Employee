import { useState, useEffect, useCallback } from 'react';
import { LogOut, Calendar, Clock, FileText, CheckCircle, XCircle, Upload, AlertCircle, Download, Search, Ban, Eye, RefreshCw, Printer, X, Filter, TrendingUp } from 'lucide-react';

interface GatePassHistory {
    id: string;
    passId: string;
    type: string;
    date: string;
    exitTime: string;
    returnTime: string;
    reason: string;
    status: 'Approved' | 'Pending' | 'Rejected' | 'Completed';
    approver?: string;
    createdAt?: string;
}

interface GatePassStats {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    completed: number;
    lastPassDate: string | null;
}

export const GatePassPage = () => {
    const handleDownload = (id: string) => {
        window.open(`http://localhost:5000/api/pdf/gatepass/${id}`, '_blank');
    };
    const [gatePassType, setGatePassType] = useState('Official Work Outside');
    const [exitDate, setExitDate] = useState('');
    const [exitTime, setExitTime] = useState('');
    const [expectedReturnTime, setExpectedReturnTime] = useState('');
    const [reason, setReason] = useState('');
    const [confirmRules, setConfirmRules] = useState(false);
    const [supportingDocument, setSupportingDocument] = useState<File | null>(null);
    const [gatePassHistory, setGatePassHistory] = useState<any[]>([]);
    const [stats, setStats] = useState<GatePassStats>({ total: 0, approved: 0, pending: 0, rejected: 0, completed: 0, lastPassDate: null });
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [selectedPass, setSelectedPass] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchHistory = useCallback(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) return;
        fetch(`http://localhost:5000/api/gatepasses/${userId}`)
            .then(res => res.ok ? res.json() : [])
            .then(data => {
                setGatePassHistory(data.map((gp: any) => ({
                    id: gp._id,
                    passId: gp.passId || '-',
                    type: gp.type || '-',
                    date: gp.date ? new Date(gp.date).toLocaleDateString() : '-',
                    exitTime: gp.outTime || '-',
                    returnTime: gp.inTime || '--',
                    reason: gp.reason || '-',
                    status: gp.status || 'Pending',
                    approver: gp.approver || '',
                    createdAt: gp.createdAt || ''
                })));
            })
            .catch(console.error);
        fetch(`http://localhost:5000/api/gatepasses/${userId}/stats`)
            .then(res => res.ok ? res.json() : null)
            .then(data => { if (data) setStats(data); })
            .catch(console.error);
    }, []);

    useEffect(() => {
        fetchHistory();
        const interval = setInterval(fetchHistory, 30000);
        return () => clearInterval(interval);
    }, [fetchHistory]);

    const handleCancelPass = (passId: string) => {
        if (!confirm('Are you sure you want to cancel this gate pass?')) return;
        fetch(`http://localhost:5000/api/gatepasses/${passId}/cancel`, { method: 'PUT' })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(() => { showToast('Gate pass cancelled successfully', 'info'); fetchHistory(); })
            .catch(() => showToast('Failed to cancel gate pass', 'error'));
    };

    const filteredHistory = gatePassHistory.filter(p => {
        const matchesSearch = searchQuery === '' || p.passId.toLowerCase().includes(searchQuery.toLowerCase()) || p.reason.toLowerCase().includes(searchQuery.toLowerCase()) || p.type.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = statusFilter === 'all' || p.status === statusFilter;
        return matchesSearch && matchesFilter;
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            // Check file size (Max 2 MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('File size must be less than 2 MB');
                return;
            }
            setSupportingDocument(file);
        }
    };

    const handleSubmit = () => {
        const errors: Record<string, string> = {};
        if (!exitDate) errors.exitDate = 'Exit date is required';
        if (!exitTime) errors.exitTime = 'Exit time is required';
        if (!expectedReturnTime) errors.expectedReturnTime = 'Return time is required';
        if (!reason.trim()) errors.reason = 'Reason is required';
        if (!confirmRules) errors.confirmRules = 'You must accept the rules';
        if (exitTime && expectedReturnTime && exitTime >= expectedReturnTime) errors.expectedReturnTime = 'Return time must be after exit time';
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) return;

        const userId = localStorage.getItem('userId');
        if (!userId) { showToast('User not logged in', 'error'); return; }

        const mapType = (t: string) => {
            if (t === 'Official Work Outside') return 'Official';
            if (t === 'Medical Emergency') return 'Medical';
            if (t === 'Family Emergency') return 'Emergency';
            return 'Personal';
        };

        setIsSubmitting(true);
        fetch('http://localhost:5000/api/gatepasses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userId, type: mapType(gatePassType), date: exitDate, outTime: exitTime, inTime: expectedReturnTime, reason, status: 'Pending' })
        })
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(newGP => {
            showToast(`Gate Pass ${newGP.passId} submitted successfully!`, 'success');
            fetchHistory();
            setExitDate(''); setExitTime(''); setExpectedReturnTime(''); setReason(''); setConfirmRules(false); setSupportingDocument(null); setFormErrors({});
        })
        .catch(() => showToast('Failed to submit Gate Pass', 'error'))
        .finally(() => setIsSubmitting(false));
    };

    const handleCancel = () => {
        setExitDate('');
        setExitTime('');
        setExpectedReturnTime('');
        setReason('');
        setConfirmRules(false);
        setSupportingDocument(null);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Approved':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approved</span>
                    </span>
                );
            case 'Rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Rejected</span>
                    </span>
                );
            case 'Pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Pending</span>
                    </span>
                );
            case 'Completed':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Completed</span>
                    </span>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-2xl shadow-2xl text-white font-semibold flex items-center gap-3 animate-in slide-in-from-right duration-300 ${toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'}`}>
                    {toast.type === 'success' ? <CheckCircle size={20} /> : toast.type === 'error' ? <XCircle size={20} /> : <AlertCircle size={20} />}
                    {toast.message}
                    <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70"><X size={16} /></button>
                </div>
            )}
            <div className="space-y-6">
                {/* Gradient Banner */}
                <div className="bg-gradient-to-br from-[#042A5B] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl">
                                <LogOut className="w-8 h-8" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Gate Pass</h1>
                                <p className="text-white/80 text-lg mt-1">Request permission to leave office premises</p>
                            </div>
                        </div>
                        <button onClick={fetchHistory} className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/20 transition-all" title="Refresh"><RefreshCw size={20} /></button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                        { label: 'Total', value: stats.total, icon: <FileText size={20} />, color: 'from-blue-500 to-blue-600' },
                        { label: 'Approved', value: stats.approved, icon: <CheckCircle size={20} />, color: 'from-green-500 to-green-600' },
                        { label: 'Pending', value: stats.pending, icon: <Clock size={20} />, color: 'from-yellow-500 to-yellow-600' },
                        { label: 'Rejected', value: stats.rejected, icon: <XCircle size={20} />, color: 'from-red-500 to-red-600' },
                        { label: 'Completed', value: stats.completed, icon: <TrendingUp size={20} />, color: 'from-purple-500 to-purple-600' }
                    ].map(card => (
                        <div key={card.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-white`}>{card.icon}</div>
                                <span className="text-2xl font-bold text-[#1B254B]">{card.value}</span>
                            </div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Gate Pass Form */}
                <div className="bg-white rounded-[30px] p-8 shadow-xl border border-gray-200">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] rounded-xl flex items-center justify-center">
                            <FileText className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800">Request Gate Pass</h3>
                    </div>

                    <div className="space-y-6">
                        {/* Type Dropdown */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Type *</label>
                            <select
                                value={gatePassType}
                                onChange={(e) => setGatePassType(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-[#0B4DA2] focus:ring-2 focus:ring-[#0B4DA2]/20 outline-none transition-all bg-white"
                            >
                                <option>Official Work Outside</option>
                                <option>Personal Work</option>
                                <option>Medical Emergency</option>
                                <option>Family Emergency</option>
                                <option>Early Exit</option>
                            </select>
                        </div>

                        {/* Date and Time Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Exit Date *</label>
                                <input
                                    type="date"
                                    value={exitDate}
                                    onChange={(e) => setExitDate(e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${formErrors.exitDate ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-[#0B4DA2] focus:ring-[#0B4DA2]/20'} focus:ring-2`}
                                />
                                {formErrors.exitDate && <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.exitDate}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Exit Time *</label>
                                <input
                                    type="time"
                                    value={exitTime}
                                    onChange={(e) => setExitTime(e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${formErrors.exitTime ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-[#0B4DA2] focus:ring-[#0B4DA2]/20'} focus:ring-2`}
                                />
                                {formErrors.exitTime && <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.exitTime}</p>}
                            </div>
                            <div>
                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Expected Return Time *</label>
                                <input
                                    type="time"
                                    value={expectedReturnTime}
                                    onChange={(e) => setExpectedReturnTime(e.target.value)}
                                    className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all ${formErrors.expectedReturnTime ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-[#0B4DA2] focus:ring-[#0B4DA2]/20'} focus:ring-2`}
                                />
                                {formErrors.expectedReturnTime && <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.expectedReturnTime}</p>}
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Reason For Exit *</label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows={4}
                                className={`w-full px-4 py-3 border-2 rounded-xl outline-none transition-all resize-none ${formErrors.reason ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:border-[#0B4DA2] focus:ring-[#0B4DA2]/20'} focus:ring-2`}
                                placeholder="Explain the purpose of leaving the office..."
                            />
                            {formErrors.reason && <p className="text-xs text-red-500 mt-1 font-semibold">{formErrors.reason}</p>}
                        </div>

                        {/* Supporting Documents */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 mb-2 block">Supporting Documents (Optional)</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#0B4DA2] transition-all">
                                <input
                                    type="file"
                                    id="file-upload"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="hidden"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer flex flex-col items-center gap-2"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#0B4DA2]/10 to-[#042A5B]/10 rounded-xl flex items-center justify-center">
                                        <Upload className="w-6 h-6 text-[#0B4DA2]" />
                                    </div>
                                    {supportingDocument ? (
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{supportingDocument.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {(supportingDocument.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">Choose File</p>
                                            <p className="text-xs text-gray-500 mt-1">For official work only</p>
                                        </div>
                                    )}
                                </label>
                                <p className="text-xs text-gray-400 mt-2">
                                    Allowed Formats: PDF, JPG, PNG | Max Size: 2 MB
                                </p>
                            </div>
                        </div>

                        {/* Confirmation Checkbox */}
                        <div className={`p-5 rounded-xl border-2 transition-all ${formErrors.confirmRules ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={confirmRules}
                                    onChange={(e) => setConfirmRules(e.target.checked)}
                                    className="w-5 h-5 mt-0.5 text-[#0B4DA2] border-gray-300 rounded focus:ring-[#0B4DA2] cursor-pointer"
                                />
                                <span className="text-sm text-gray-800 font-medium leading-relaxed">
                                    I confirm I will return on time and follow company rules.
                                </span>
                            </label>
                            {formErrors.confirmRules && <p className="text-xs text-red-500 mt-1.5 font-semibold">{formErrors.confirmRules}</p>}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                onClick={handleCancel}
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-white border-2 border-gray-400 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-500 transition-all font-semibold shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-gradient-to-br from-[#042A5B] to-[#0B4DA2] text-white rounded-xl hover:shadow-lg transition-all font-semibold shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none active:scale-95 flex items-center gap-2"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Gate Pass History */}
                <div className="bg-white rounded-[30px] p-8 shadow-xl border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">Gate Pass History</h3>
                        </div>

                        {/* Search and Filter Controls */}
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by ID or reason..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:border-[#0B4DA2] focus:ring-2 focus:ring-[#0B4DA2]/20 outline-none transition-all text-sm"
                                />
                            </div>
                            <div className="relative w-full sm:w-44">
                                <Filter className="absolute left-3 top-3.5 text-gray-400 w-4 h-4" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-300 rounded-xl focus:border-[#0B4DA2] focus:ring-2 focus:ring-[#0B4DA2]/20 outline-none transition-all text-sm bg-white"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Rejected">Rejected</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Table / Empty State */}
                    {filteredHistory.length === 0 ? (
                        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-2xl">
                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-semibold">No gate passes found</p>
                            <p className="text-xs text-gray-400 mt-1">Try adjusting your filters or submit a new request</p>
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-2xl border-2 border-gray-300 shadow-md">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] text-white">
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-white/20">
                                                Pass ID
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-white/20">
                                                Type
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-white/20">
                                                Date
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-white/20">
                                                Exit Time
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-white/20">
                                                Return Time
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider border-r-2 border-white/20">
                                                Reason
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredHistory.map((pass, index) => (
                                            <tr
                                                key={pass.id}
                                                className={`hover:bg-blue-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-[#0B4DA2] font-bold text-sm">{pass.passId}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{pass.type}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-gray-900 font-medium">{pass.date}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-gray-700">{pass.exitTime}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-gray-700">{pass.returnTime}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-gray-700 line-clamp-1">{pass.reason}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center justify-start">
                                                        {getStatusBadge(pass.status)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => setSelectedPass(pass)}
                                                            className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-gray-900 hover:underline"
                                                            title="View details"
                                                        >
                                                            <Eye size={14} /> Details
                                                        </button>
                                                        {pass.status === 'Approved' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleDownload(pass.id)}
                                                                    className="flex items-center gap-1 text-xs font-bold text-[#0B4DA2] hover:underline"
                                                                    title="Download PDF"
                                                                >
                                                                    <Download size={14} /> PDF
                                                                </button>
                                                                <button
                                                                    onClick={() => window.print()}
                                                                    className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:underline"
                                                                    title="Print pass"
                                                                >
                                                                    <Printer size={14} /> Print
                                                                </button>
                                                            </>
                                                        )}
                                                        {pass.status === 'Pending' && (
                                                            <button
                                                                onClick={() => handleCancelPass(pass.id)}
                                                                className="flex items-center gap-1 text-xs font-bold text-red-600 hover:underline"
                                                                title="Cancel request"
                                                            >
                                                                <Ban size={14} /> Cancel
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Pass Detail Modal */}
            {selectedPass && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#042A5B] to-[#0B4DA2] p-6 text-white flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold uppercase tracking-wider opacity-75">Gate Pass Details</span>
                                <h4 className="text-xl font-bold mt-1">{selectedPass.passId}</h4>
                            </div>
                            <button onClick={() => setSelectedPass(null)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Type</span>
                                    <p className="font-semibold text-gray-800 mt-1">{selectedPass.type}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</span>
                                    <div className="mt-1">{getStatusBadge(selectedPass.status)}</div>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date</span>
                                    <p className="font-semibold text-gray-800 mt-1">{selectedPass.date}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Exit / Return</span>
                                    <p className="font-semibold text-gray-800 mt-1 text-sm">{selectedPass.exitTime} - {selectedPass.returnTime}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Reason for Exit</span>
                                <p className="text-gray-700 mt-1 text-sm leading-relaxed">{selectedPass.reason}</p>
                            </div>

                            {/* Timeline Activity View */}
                            <div className="space-y-4">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Activity Timeline</span>
                                <div className="relative pl-6 border-l-2 border-blue-100 space-y-4">
                                    <div className="relative">
                                        <div className="absolute -left-[31px] top-1 w-4.5 h-4.5 bg-blue-600 rounded-full border-4 border-white"></div>
                                        <p className="text-sm font-semibold text-gray-800">Submitted Request</p>
                                        <p className="text-xs text-gray-400">{selectedPass.createdAt ? new Date(selectedPass.createdAt).toLocaleString('en-IN') : selectedPass.date}</p>
                                    </div>
                                    <div className="relative">
                                        <div className={`absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full border-4 border-white ${selectedPass.status === 'Pending' ? 'bg-yellow-500 animate-pulse' : selectedPass.status === 'Approved' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {selectedPass.status === 'Pending' ? 'Awaiting Approval' : selectedPass.status === 'Approved' ? `Approved by ${selectedPass.approver || 'Admin'}` : 'Request Rejected / Cancelled'}
                                        </p>
                                        <p className="text-xs text-gray-400">Status updated to {selectedPass.status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 p-6 flex justify-end gap-3 border-t border-gray-100">
                            {selectedPass.status === 'Pending' && (
                                <button
                                    onClick={() => { handleCancelPass(selectedPass.id); setSelectedPass(null); }}
                                    className="px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 text-sm font-bold transition-all flex items-center gap-1.5"
                                >
                                    <Ban size={16} /> Cancel Pass
                                </button>
                            )}
                            {selectedPass.status === 'Approved' && (
                                <>
                                    <button
                                        onClick={() => handleDownload(selectedPass.id)}
                                        className="px-5 py-2.5 bg-[#0B4DA2] text-white rounded-xl hover:shadow-md text-sm font-bold transition-all flex items-center gap-1.5"
                                    >
                                        <Download size={16} /> Download
                                    </button>
                                    <button
                                        onClick={() => window.print()}
                                        className="px-5 py-2.5 bg-purple-50 text-purple-600 rounded-xl hover:bg-purple-100 text-sm font-bold transition-all flex items-center gap-1.5"
                                    >
                                        <Printer size={16} /> Print
                                    </button>
                                </>
                            )}
                            <button onClick={() => setSelectedPass(null)} className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 text-sm font-bold transition-all">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
