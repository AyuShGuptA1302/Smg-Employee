import React, { useState, useEffect } from 'react';
import { Shirt, Smartphone, Package, FileText, Eye, Receipt, GraduationCap, FolderOpen, Heart, Lightbulb, BookOpen, Megaphone, Bell, Download, PlusCircle, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContextEnhanced';
import { getUniformRequests, requestUniform } from '../services/api';

// Simple page template
const SimplePage = ({ icon: Icon, title, description, children }) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] rounded-2xl p-8 text-white shadow-xl">
      <h1 className="text-white mb-2 flex items-center gap-3"><Icon size={32} /> {title}</h1>
      <p className="text-[#87CEEB] opacity-90">{description}</p>
    </div>
    {children}
  </div>
);

export const UniformPage = () => {
  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [itemType, setItemType] = useState('Work Shirt - Blue');
  const [size, setSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');

  const userId = localStorage.getItem('userId');

  const fetchRequests = () => {
    if (!userId) return;
    setIsFetching(true);
    getUniformRequests(userId)
      .then((data) => setRequestsList(data))
      .catch((err) => console.error('Error fetching uniform requests:', err))
      .finally(() => setIsFetching(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      alert('User not logged in');
      return;
    }

    setIsSubmitting(true);
    requestUniform({
      user: userId,
      items: [{ name: itemType, size, quantity: Number(quantity) }],
      reason,
      status: 'Pending'
    })
      .then(() => {
        alert('Uniform request submitted successfully!');
        setItemType('Work Shirt - Blue');
        setSize('M');
        setQuantity(1);
        setReason('');
        setShowForm(false);
        fetchRequests();
      })
      .catch((err: any) => {
        console.error('Error submitting request:', err);
        alert(err.message || 'Failed to submit request');
      })
      .finally(() => setIsSubmitting(false));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{status}</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            <span>{status}</span>
          </span>
        );
      case 'Dispatched':
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>{status}</span>
          </span>
        );
    }
  };

  const availableUniforms = [
    { name: 'Work Shirt - Blue', category: 'Apparel', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    { name: 'Work Pants', category: 'Apparel', sizes: ['30', '32', '34', '36', '38'] },
    { name: 'Safety Vest', category: 'Safety Wear', sizes: ['Free Size'] },
    { name: 'Lab Coat', category: 'Specialized', sizes: ['S', 'M', 'L', 'XL'] },
    { name: 'Safety Shoes', category: 'Footwear', sizes: ['7', '8', '9', '10', '11'] },
    { name: 'Safety Gloves', category: 'Handwear', sizes: ['S', 'M', 'L'] }
  ];

  return (
    <SimplePage icon={Shirt} title="Uniform Requests" description="Request and manage your official work uniforms">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Quick Actions / Form */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-[#1B254B] mb-4">Request Option</h3>
            {!showForm ? (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">Need a new uniform, size replacement, or safety gear? Create a formal request here.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity text-sm flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Request Uniform
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Item Name *</label>
                  <select
                    value={itemType}
                    onChange={(e) => {
                      setItemType(e.target.value);
                      const selectedItemDetails = availableUniforms.find(u => u.name === e.target.value);
                      if (selectedItemDetails) {
                        setSize(selectedItemDetails.sizes[0]);
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none bg-white text-sm"
                  >
                    {availableUniforms.map((item) => (
                      <option key={item.name} value={item.name}>{item.name} ({item.category})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Size *</label>
                    <select
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none bg-white text-sm"
                    >
                      {(availableUniforms.find(u => u.name === itemType)?.sizes || ['M']).map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1 block">Quantity *</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none bg-white text-sm"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">Reason / Justification *</label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm resize-none"
                    placeholder="E.g., New joiner, damaged uniform, size issue..."
                    required
                  ></textarea>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !reason}
                    className="flex-1 bg-[#0B4DA2] text-white py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-[#1B254B] font-bold mb-3">Available Catalog</h3>
            <div className="space-y-3">
              {availableUniforms.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100/50 transition-colors">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-[#0B4DA2]">
                    <Shirt size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#1B254B]">{item.name}</h4>
                    <p className="text-xs text-[#A3AED0]">Sizes: {item.sizes.join(', ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Requests History */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] rounded-xl flex items-center justify-center">
              <Shirt className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1B254B]">Requisition History</h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] text-white text-xs font-bold uppercase tracking-wider">
                  <th className="px-4 py-3.5">Request ID</th>
                  <th className="px-4 py-3.5">Item Details</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Created At</th>
                  <th className="px-4 py-3.5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {requestsList.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 font-mono font-bold text-[#0B4DA2] whitespace-nowrap">{req.requestId}</td>
                    <td className="px-4 py-4">
                      {req.items?.map((item: any, i: number) => (
                        <div key={i} className="font-medium text-[#1B254B]">
                          {item.name || item.itemType} (Size: {item.size}, Qty: {item.quantity})
                        </div>
                      ))}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(req.status)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-500 text-xs">
                      {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <button
                        onClick={() => window.open(`http://localhost:5000/api/pdf/uniform/${req._id}`, '_blank')}
                        className="flex items-center gap-1.5 bg-[#0B4DA2]/10 text-[#0B4DA2] px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#0B4DA2] hover:text-white transition-colors"
                      >
                        <Download size={14} /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
                {requestsList.length === 0 && !isFetching && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-400">
                      No uniform requests submitted yet.
                    </td>
                  </tr>
                )}
                {isFetching && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-400 animate-pulse">
                      Loading requisitions...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SimplePage>
  );
};

export const SIMAllocationPage = () => (
  <SimplePage icon={Smartphone} title="SIM Allocation" description="Request official SIM cards for business use">
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-[#1B254B] mb-4">SIM Card Plans</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { name: 'Basic Plan', data: '2GB/day', calls: 'Unlimited', price: 'Free' },
          { name: 'Premium Plan', data: '5GB/day', calls: 'Unlimited', price: 'Free' },
        ].map((plan, idx) => (
          <div key={idx} className="border-2 border-gray-100 rounded-xl p-6 hover:border-[#0B4DA2] transition-all">
            <h4 className="font-bold text-[#1B254B] mb-3">{plan.name}</h4>
            <div className="space-y-2 mb-4 text-sm text-[#A3AED0]">
              <p>Data: {plan.data}</p>
              <p>Calls: {plan.calls}</p>
              <p className="font-bold text-[#0B4DA2]">Price: {plan.price}</p>
            </div>
            <button className="w-full bg-[#0B4DA2] text-white py-2 rounded-lg font-bold hover:bg-[#042A5B] transition-colors">
              Request SIM
            </button>
          </div>
        ))}
      </div>
    </div>
  </SimplePage>
);

export const AssetRequestsPage = () => (
  <SimplePage icon={Package} title="Asset Requests" description="Request IT and office assets">
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-[#1B254B] mb-4">Request New Asset</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-[#A3AED0] mb-2 block">Asset Type</label>
          <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none">
            <option>Laptop</option>
            <option>Monitor</option>
            <option>Keyboard</option>
            <option>Mouse</option>
            <option>Headset</option>
          </select>
        </div>
        <div>
          <label className="text-sm text-[#A3AED0] mb-2 block">Priority</label>
          <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none">
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-[#A3AED0] mb-2 block">Justification</label>
          <textarea rows={3} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none" placeholder="Explain why you need this asset..."></textarea>
        </div>
      </div>
      <button className="mt-4 bg-[#0B4DA2] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors">
        Submit Request
      </button>
    </div>
  </SimplePage>
);

export const GeneralRequestsPage = () => {
  const [category, setCategory] = useState('Facilities');
  const [priority, setPriority] = useState('Medium');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [generatedId, setGeneratedId] = useState('');
  const [requestsList, setRequestsList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate a new complaint ID
  const generateNewId = () => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    setGeneratedId(`CMP-2026-${randomNum}`);
  };

  useEffect(() => {
    generateNewId();
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    fetch(`http://localhost:5000/api/general-requests/${userId}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setRequestsList(data))
      .catch((err) => console.error('Error fetching general requests:', err));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description) {
      alert('Please fill out all fields');
      return;
    }
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User is not logged in');
      return;
    }

    setIsSubmitting(true);
    fetch('http://localhost:5000/api/general-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: userId,
        reqId: generatedId,
        category,
        subject,
        description,
        priority,
        status: 'Pending'
      })
    })
      .then((res) => {
        if (res.ok) {
          alert('Request submitted successfully!');
          setSubject('');
          setDescription('');
          generateNewId();
          fetchRequests();
        } else {
          alert('Failed to submit request');
        }
      })
      .catch((err) => {
        console.error('Error submitting request:', err);
        alert('Server connection failed');
      })
      .finally(() => setIsSubmitting(false));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Resolved':
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>{status}</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            <span>{status}</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            <span>{status}</span>
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            <span>{status}</span>
          </span>
        );
    }
  };

  const getPriorityBadge = (prio: string) => {
    switch (prio) {
      case 'High':
        return <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">High</span>;
      case 'Medium':
        return <span className="text-xs font-bold text-yellow-600 bg-yellow-50 px-2.5 py-1 rounded-lg border border-yellow-200">Medium</span>;
      case 'Low':
      default:
        return <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">Low</span>;
    }
  };

  return (
    <SimplePage icon={FileText} title="General Requests" description="Submit general workplace requests and grievances">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Create Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] rounded-xl flex items-center justify-center">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1B254B]">New Request</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Auto-generated Complaint ID (Read-only) */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Auto-Generated Complaint ID</label>
              <div className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl font-mono text-sm text-[#0B4DA2] font-bold">
                {generatedId}
              </div>
            </div>

            {/* Category selection */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none bg-white text-sm"
              >
                <option>Facilities</option>
                <option>IT Support</option>
                <option>HR Query</option>
                <option>Other</option>
              </select>
            </div>

            {/* Priority selection */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Priority *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none bg-white text-sm"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Subject *</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm"
                placeholder="Brief summary of issue..."
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold text-gray-500 mb-1 block">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none text-sm resize-none"
                placeholder="Describe your request in detail..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !subject || !description}
              className="w-full bg-[#0B4DA2] text-white py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Right Side: Request History */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1B254B]">Request History</h3>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-100">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] text-white text-xs font-bold uppercase tracking-wider">
                  <th className="px-4 py-3.5">ID</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Subject</th>
                  <th className="px-4 py-3.5">Priority</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {requestsList.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 font-mono font-bold text-[#0B4DA2] whitespace-nowrap">{req.reqId}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-700">{req.category}</td>
                    <td className="px-4 py-4 font-medium text-[#1B254B]">{req.subject}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{getPriorityBadge(req.priority)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(req.status)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-gray-500 text-xs">
                      {new Date(req.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
                {requestsList.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                      No general requests or complaints submitted yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SimplePage>
  );
};

export const MyAttendancePage = () => (
  <SimplePage icon={Eye} title="My Attendance View" description="View your attendance records and patterns">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[
        { label: 'Present Days', value: '22', color: '#05CD99' },
        { label: 'Absent Days', value: '1', color: '#EE5D50' },
        { label: 'Late Arrivals', value: '3', color: '#FFB547' },
        { label: 'Overtime Hours', value: '12', color: '#0B4DA2' },
      ].map((stat, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <p className="text-sm text-[#A3AED0] mb-2">{stat.label}</p>
          <p className="text-4xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
        </div>
      ))}
    </div>
  </SimplePage>
);

export const PayrollPage = () => {
  const { payslips } = useApp();
  const handleDownload = (payslipId: string) => {
    window.open(`http://localhost:5000/api/pdf/payslip/${payslipId}`, '_blank');
  };
  return (
    <SimplePage icon={Receipt} title="Payroll & Salary" description="View your salary details and download payslips">
      <div className="space-y-4">
        {payslips.map((slip, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#1B254B] font-bold">{slip.month}</h3>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${slip.status === 'Paid' ? 'bg-green-50 text-[#05CD99]' : 'bg-yellow-50 text-yellow-600'}`}>
                  {slip.status}
                </span>
                {slip._id && (
                  <button onClick={() => handleDownload(slip._id)} className="flex items-center gap-2 bg-[#0B4DA2] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#042A5B] transition-colors text-sm">
                    <FileText size={16} /> Download PDF
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span className="text-[#A3AED0]">Basic Salary</span><span className="font-bold text-[#1B254B]">{slip.basicSalary}</span></div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span className="text-[#A3AED0]">HRA</span><span className="font-bold text-[#1B254B]">{slip.hra}</span></div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span className="text-[#A3AED0]">Allowances</span><span className="font-bold text-[#1B254B]">{slip.allowances}</span></div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-xl"><span className="text-[#A3AED0]">Deductions</span><span className="font-bold text-[#EE5D50]">-{slip.deductions}</span></div>
                <div className="flex justify-between p-3 bg-green-50 rounded-xl border-2 border-green-200"><span className="font-bold text-[#05CD99]">Net Salary</span><span className="font-bold text-[#05CD99] text-xl">{slip.netSalary}</span></div>
              </div>
            </div>
          </div>
        ))}
        {payslips.length === 0 && <div className="bg-white rounded-2xl p-8 shadow-lg text-center text-gray-400">No payslips available</div>}
      </div>
    </SimplePage>
  );
};

export const TrainingPage = () => (
  <SimplePage icon={GraduationCap} title="Training & Development" description="Explore and enroll in training programs">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[
        { title: 'React Advanced Patterns', type: 'Required', date: 'Dec 18, 2024', duration: '4 hours', status: 'Enrolled' },
        { title: 'AWS Cloud Fundamentals', type: 'Optional', date: 'Dec 25, 2024', duration: '8 hours', status: 'Available' },
      ].map((course, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <h4 className="font-bold text-[#1B254B]">{course.title}</h4>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${course.type === 'Required' ? 'bg-red-50 text-[#EE5D50]' : 'bg-blue-50 text-[#0B4DA2]'}`}>
              {course.type}
            </span>
          </div>
          <div className="space-y-2 text-sm text-[#A3AED0] mb-4">
            <p>Date: {course.date}</p>
            <p>Duration: {course.duration}</p>
          </div>
          <button className={`w-full py-2 rounded-lg font-bold transition-colors ${course.status === 'Enrolled' ? 'bg-gray-200 text-gray-600 cursor-not-allowed' : 'bg-[#0B4DA2] text-white hover:bg-[#042A5B]'}`}>
            {course.status}
          </button>
        </div>
      ))}
    </div>
  </SimplePage>
);

export const DocumentsPage = () => (
  <SimplePage icon={FolderOpen} title="My Documents" description="Access and manage your documents">
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="space-y-3">
        {[
          { name: 'Offer Letter', category: 'Onboarding', date: 'Jan 10, 2020', size: '245 KB' },
          { name: 'ID Proof - Aadhaar', category: 'Identity', date: 'Jan 12, 2020', size: '180 KB' },
          { name: 'PAN Card', category: 'Tax Documents', date: 'Jan 12, 2020', size: '120 KB' },
        ].map((doc, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <FolderOpen className="text-[#0B4DA2]" size={24} />
              <div>
                <p className="font-bold text-[#1B254B]">{doc.name}</p>
                <p className="text-sm text-[#A3AED0]">{doc.category} • {doc.size}</p>
              </div>
            </div>
            <p className="text-sm text-[#A3AED0]">{doc.date}</p>
          </div>
        ))}
      </div>
    </div>
  </SimplePage>
);

export const WelfarePage = () => (
  <SimplePage icon={Heart} title="Employee Welfare" description="Health and wellness programs for employees">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {['Health Insurance', 'Wellness Programs', 'Emergency Support'].map((item, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
          <Heart size={48} className="mx-auto mb-3 text-[#0B4DA2]" />
          <h4 className="font-bold text-[#1B254B] mb-2">{item}</h4>
          <button className="w-full bg-[#0B4DA2] text-white py-2 rounded-lg font-bold hover:bg-[#042A5B] transition-colors mt-3">
            Learn More
          </button>
        </div>
      ))}
    </div>
  </SimplePage>
);

export const ImaginePage = () => (
  <SimplePage icon={Lightbulb} title="SMG Imagine" description="Innovation and ideas platform">
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="text-[#1B254B] mb-4">Submit Your Idea</h3>
      <div className="space-y-4">
        <input type="text" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none" placeholder="Idea Title" />
        <textarea rows={4} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none" placeholder="Describe your innovative idea..."></textarea>
        <button className="bg-[#0B4DA2] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors">
          Submit Idea
        </button>
      </div>
    </div>
  </SimplePage>
);

export const PoliciesPage = () => (
  <SimplePage icon={BookOpen} title="Company Policies" description="Access company policies and guidelines">
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['Code of Conduct', 'Leave Policy', 'IT Security Policy', 'HR Policies'].map((policy, idx) => (
          <div key={idx} className="border-2 border-gray-100 rounded-xl p-6 hover:border-[#0B4DA2] transition-all">
            <BookOpen className="text-[#0B4DA2] mb-3" size={32} />
            <h4 className="font-bold text-[#1B254B] mb-2">{policy}</h4>
            <button className="text-[#0B4DA2] font-bold text-sm hover:underline">View Policy →</button>
          </div>
        ))}
      </div>
    </div>
  </SimplePage>
);

export const AnnouncementsPage = () => (
  <SimplePage icon={Megaphone} title="Announcements" description="Latest company announcements and updates">
    <div className="space-y-4">
      {[
        { title: 'Holiday Announcement - Diwali 2024', date: 'Dec 10, 2024', priority: 'High' },
        { title: 'New Cafeteria Menu Launch', date: 'Dec 5, 2024', priority: 'Medium' },
        { title: 'Safety Drill - December', date: 'Dec 1, 2024', priority: 'High' },
      ].map((announcement, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-bold text-[#1B254B] mb-2">{announcement.title}</h4>
              <p className="text-sm text-[#A3AED0]">{announcement.date}</p>
            </div>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${announcement.priority === 'High' ? 'bg-red-50 text-[#EE5D50]' : 'bg-orange-50 text-[#FFB547]'}`}>
              {announcement.priority}
            </span>
          </div>
        </div>
      ))}
    </div>
  </SimplePage>
);

export const NotificationsPage = () => (
  <SimplePage icon={Bell} title="Notifications" description="All your notifications in one place">
    <div className="space-y-3">
      {[
        { title: 'Leave Approved', message: 'Your leave request has been approved', time: '2 hours ago', type: 'success' },
        { title: 'New Training Assigned', message: 'React Advanced Patterns training assigned', time: '5 hours ago', type: 'info' },
        { title: 'Payslip Available', message: 'October 2023 payslip is ready', time: '1 day ago', type: 'info' },
      ].map((notification, idx) => (
        <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-start gap-4">
            <div className={`w-2 h-2 rounded-full mt-2 ${notification.type === 'success' ? 'bg-[#05CD99]' : 'bg-[#0B4DA2]'}`} />
            <div className="flex-1">
              <h4 className="font-bold text-[#1B254B] mb-1">{notification.title}</h4>
              <p className="text-sm text-[#A3AED0]">{notification.message}</p>
              <p className="text-xs text-[#A3AED0] mt-2">{notification.time}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </SimplePage>
);
