import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Smartphone,
  Plus,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Eye,
  Bell,
  User,
  Settings,
  Home,
  FileText,
  Activity,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ArrowUp,
  ArrowDown,
  Clock,
  Users,
  Package,
  Send,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner@2.0.3';

import { generateGenericListPDF } from '../../utils/pdfExport';

import logo from 'figma:asset/7ef5cbbf7f7fd6bbcf30128158bd641f40437597.png';

interface SimRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  requestType: 'new' | 'replacement' | 'upgrade';
  connectionType: 'prepaid' | 'postpaid';
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'issued';
  approvedBy?: string;
  approvalDate?: string;
  justification: string;
}

interface SimIssueRecord {
  id: string;
  simNumber: string;
  mobileNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  provider: string;
  plan: string;
  monthlyRental: number;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface Notification {
  id: string;
  type: 'request' | 'approval' | 'alert' | 'info';
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

// Get dynamic greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export function SimPortal() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SimRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());

  // Update greeting every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const [simRequests, setSimRequests] = useState<SimRequest[]>([
    {
      id: 'SR001',
      employeeId: 'SMG-2024-042',
      employeeName: 'Rajesh Kumar',
      department: 'IT',
      designation: 'Senior Software Engineer',
      requestType: 'new',
      connectionType: 'postpaid',
      requestDate: '2024-12-15',
      status: 'pending',
      justification: 'Required for on-call support and client communication'
    },
    {
      id: 'SR002',
      employeeId: 'SMG-2024-025',
      employeeName: 'Priya Sharma',
      department: 'Sales',
      designation: 'Sales Manager',
      requestType: 'replacement',
      connectionType: 'postpaid',
      requestDate: '2024-12-14',
      status: 'approved',
      approvedBy: 'HR Manager',
      approvalDate: '2024-12-15',
      justification: 'Previous SIM card lost, need replacement for field work'
    },
    {
      id: 'SR003',
      employeeId: 'SMG-2024-089',
      employeeName: 'Amit Patel',
      department: 'Marketing',
      designation: 'Marketing Executive',
      requestType: 'new',
      connectionType: 'prepaid',
      requestDate: '2024-12-13',
      status: 'issued',
      approvedBy: 'HR Head',
      approvalDate: '2024-12-14',
      justification: 'Marketing campaigns and client outreach'
    }
  ]);

  const [simRecords, setSimRecords] = useState<SimIssueRecord[]>([
    {
      id: 'SIM001',
      simNumber: '8991101234567890',
      mobileNumber: '+91 98765 43210',
      employeeId: 'SMG-2024-089',
      employeeName: 'Amit Patel',
      department: 'Marketing',
      provider: 'Airtel',
      plan: 'Business Plan - Unlimited',
      monthlyRental: 599,
      issueDate: '2024-12-15',
      expiryDate: '2025-12-15',
      status: 'active'
    },
    {
      id: 'SIM002',
      simNumber: '8991101234567891',
      mobileNumber: '+91 98765 43211',
      employeeId: 'SMG-2024-025',
      employeeName: 'Priya Sharma',
      department: 'Sales',
      provider: 'Jio',
      plan: 'Corporate Plan - 2GB/day',
      monthlyRental: 449,
      issueDate: '2024-11-20',
      expiryDate: '2025-11-20',
      status: 'active'
    },
    {
      id: 'SIM003',
      simNumber: '8991101234567892',
      mobileNumber: '+91 98765 43212',
      employeeId: 'SMG-2024-042',
      employeeName: 'Rajesh Kumar',
      department: 'IT',
      provider: 'VI',
      plan: 'Professional Plan - 1.5GB/day',
      monthlyRental: 399,
      issueDate: '2024-10-10',
      expiryDate: '2025-10-10',
      status: 'active'
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'N001',
      type: 'request',
      message: 'New SIM request from Rajesh Kumar (IT Department)',
      time: '5 mins ago',
      read: false,
      priority: 'high'
    },
    {
      id: 'N002',
      type: 'alert',
      message: '3 SIM cards expiring in next 30 days',
      time: '1 hour ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 'N003',
      type: 'approval',
      message: 'SIM request SR002 approved by HR Manager',
      time: '2 hours ago',
      read: true,
      priority: 'low'
    }
  ]);

  const simProfile = {
    name: 'SIM Management Desk',
    email: 'sim@smg.com',
    phone: '+91 120 1234567',
    extension: 'Ext: 300',
    department: 'Personnel & Administration',
    totalSimsIssued: 156,
    activeConnections: 142,
    pendingRequests: simRequests.filter(r => r.status === 'pending').length,
    monthlyExpense: 67458
  };

  const StatCard = ({ icon: Icon, label, value, subtext, change, colorClass, onClick }) => (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-[24px] shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer w-full text-left border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${colorClass}`}>
          <Icon size={28} className="text-white" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg ${change > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
            }`}>
            {change > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      <h3 className="text-3xl font-bold text-[#1B254B] mb-1">{value}</h3>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{label}</p>
      {subtext && <p className="text-xs text-gray-500 mt-2">{subtext}</p>}
    </motion.button>
  );

  const handleApproveRequest = (requestId: string) => {
    setSimRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'approved' as const, approvedBy: 'System Admin', approvalDate: new Date().toISOString().split('T')[0] } : req
      )
    );
    toast.success('SIM request approved successfully');
  };

  const handleRejectRequest = (requestId: string) => {
    setSimRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      )
    );
    toast.error('SIM request rejected');
  };

  const handleIssueSim = (formData: any) => {
    const newRecord: SimIssueRecord = {
      id: `SIM${String(simRecords.length + 1).padStart(3, '0')}`,
      simNumber: formData.simNumber,
      mobileNumber: formData.mobileNumber,
      employeeId: formData.employeeId,
      employeeName: formData.employeeName,
      department: formData.department,
      provider: formData.provider,
      plan: formData.plan,
      monthlyRental: parseInt(formData.monthlyRental),
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate,
      status: 'active'
    };
    setSimRecords(prev => [newRecord, ...prev]);

    // Update the request status
    setSimRequests(prev =>
      prev.map(req =>
        req.employeeId === formData.employeeId && req.status === 'approved'
          ? { ...req, status: 'issued' as const }
          : req
      )
    );

    toast.success(`SIM card ${formData.simNumber} issued to ${formData.employeeName} successfully`);
    setShowIssueDialog(false);
  };

  const handleViewDetails = (request: SimRequest) => {
    setSelectedRequest(request);
    setShowDetailsDialog(true);
  };

  const handleLogout = () => {
    toast.success('Logging out...');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const sidebarMenuItems = [
    { icon: Home, label: 'Dashboard', value: 'overview' },
    { icon: Clock, label: 'Pending Requests', value: 'requests' },
    { icon: Package, label: 'SIM Records', value: 'records' },
    { icon: Activity, label: 'Issue SIM', value: 'issue' },
    { icon: BarChart3, label: 'Analytics', value: 'analytics' },
    { icon: Settings, label: 'Settings', value: 'settings' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex">
      {/* Sidebar */}
      <motion.div
        className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300 shadow-lg`}
        animate={{ width: sidebarCollapsed ? 80 : 256 }}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          {!sidebarCollapsed ? (
            <div className="flex flex-col gap-3">
              <img src={logo} alt="SMG Logo" className="w-full h-auto" />
              <div className="text-center">
                <h2 className="text-[#1B254B] font-bold">P&A (SIM) Portal</h2>
                <p className="text-xs text-gray-500">SIM Management</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img src={logo} alt="SMG" className="w-10 h-10 object-contain" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {sidebarMenuItems.map((item) => (
            <button
              key={item.value}
              onClick={() => setActiveTab(item.value)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.value
                ? 'bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] text-white shadow-lg shadow-blue-500/30'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && <span className="text-sm font-bold">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Sidebar Toggle & Logout */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
          >
            {sidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!sidebarCollapsed && <span className="text-sm font-bold">Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="text-sm font-bold">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1B254B]">{greeting}, SIM Desk 👋</h1>
              <p className="text-sm text-gray-500 mt-1">SIM card allocation & management</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search anything..."
                  className="pl-10 w-80 border-gray-200"
                />
              </div>
              <Button
                onClick={() => setShowNotificationsDialog(true)}
                variant="outline"
                className="relative border-gray-200 hover:bg-gray-50"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <Button
                onClick={() => setShowProfileDialog(true)}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50"
              >
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => setShowNewRequestDialog(true)}
              className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90 shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              New SIM Request
            </Button>
            <Button
              onClick={() => setShowIssueDialog(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 shadow-lg shadow-emerald-500/30"
            >
              <Package className="w-4 h-4 mr-2" />
              Issue SIM Card
            </Button>
            <Button
              variant="outline"
              className="border-gray-200 hover:bg-gray-50"
              onClick={() => toast.info('Generating SIM report...')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Package}
              label="Total SIM Cards"
              value={simProfile.totalSimsIssued.toString()}
              subtext="Active connections"
              change={8}
              colorClass="bg-gradient-to-br from-[#0B4DA2] to-[#042A5B]"
              onClick={() => setActiveTab('records')}
            />
            <StatCard
              icon={Clock}
              label="Pending Requests"
              value={simProfile.pendingRequests.toString()}
              subtext="Awaiting approval"
              change={12}
              colorClass="bg-gradient-to-br from-purple-500 to-purple-600"
              onClick={() => setActiveTab('requests')}
            />
            <StatCard
              icon={Activity}
              label="Active SIMs"
              value={simProfile.activeConnections.toString()}
              subtext="Currently in use"
              change={5}
              colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
              onClick={() => setActiveTab('records')}
            />
            <StatCard
              icon={FileText}
              label="Monthly Cost"
              value={`₹${simProfile.monthlyExpense.toLocaleString()}`}
              subtext="Rental expenses"
              change={-3}
              colorClass="bg-gradient-to-br from-orange-500 to-orange-600"
              onClick={() => setActiveTab('analytics')}
            />
          </div>

          {/* Content Tabs */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-6 border-gray-100 shadow-md">
                  <h3 className="text-[#1B254B] font-bold text-lg mb-4">Recent Requests</h3>
                  <div className="space-y-3">
                    {simRequests.slice(0, 5).map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                        onClick={() => handleViewDetails(request)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center text-xs font-bold">
                            {request.employeeName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1B254B]">{request.employeeName}</p>
                            <p className="text-xs text-gray-500">{request.department} • {request.requestType}</p>
                          </div>
                        </div>
                        <Badge variant={
                          request.status === 'approved' ? 'default' :
                            request.status === 'pending' ? 'secondary' :
                              request.status === 'issued' ? 'outline' :
                                'destructive'
                        } className="text-xs">
                          {request.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              <div>
                <Card className="p-6 border-gray-100 shadow-md">
                  <h3 className="text-[#1B254B] font-bold mb-4">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">New Requests</span>
                      <span className="text-[#1B254B] font-bold">{simRequests.filter(r => r.status === 'pending').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Issued This Month</span>
                      <span className="text-[#1B254B] font-bold">{simRequests.filter(r => r.status === 'issued').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Active Providers</span>
                      <span className="text-[#1B254B] font-bold">3</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1B254B]">SIM Requests</h2>
                <div className="flex gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[180px] bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Requests</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {simRequests.map((request) => (
                <Card key={request.id} className="p-6 border-gray-100 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center font-bold">
                          {request.employeeName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[#1B254B] font-bold">{request.employeeName}</h4>
                            <Badge variant="outline" className={`text-xs ${request.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                              request.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                request.status === 'issued' ? 'bg-blue-50 text-blue-600' :
                                  'bg-yellow-50 text-yellow-600'
                              }`}>
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{request.employeeId} • {request.department}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Request Type</p>
                          <p className="text-sm text-[#1B254B] font-bold capitalize">{request.requestType}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Connection Type</p>
                          <p className="text-sm text-[#1B254B] font-bold capitalize">{request.connectionType}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Request Date</p>
                          <p className="text-sm text-[#1B254B] font-bold">{request.requestDate}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Designation</p>
                          <p className="text-sm text-[#1B254B] font-bold">{request.designation}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                        <p className="text-xs text-gray-600 mb-1 font-bold uppercase tracking-wide">Justification</p>
                        <p className="text-sm text-[#1B254B]">{request.justification}</p>
                      </div>

                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApproveRequest(request.id)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Request
                          </Button>
                          <Button
                            onClick={() => handleRejectRequest(request.id)}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'records' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1B254B]">SIM Issue Records</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80 border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {simRecords.map((record) => (
                  <Card key={record.id} className="p-6 border-gray-100 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center">
                        <Smartphone className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[#1B254B] font-bold">{record.employeeName}</h4>
                          <Badge variant="outline" className={`text-xs ${record.status === 'active' ? 'bg-emerald-50 text-emerald-600' :
                            record.status === 'suspended' ? 'bg-yellow-50 text-yellow-600' :
                              'bg-red-50 text-red-600'
                            }`}>
                            {record.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{record.employeeId} • {record.department}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Mobile Number</span>
                        <span className="text-[#1B254B] font-bold">{record.mobileNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">SIM Number</span>
                        <span className="text-[#1B254B] font-bold">{record.simNumber}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Provider</span>
                        <span className="text-[#1B254B] font-bold">{record.provider}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Plan</span>
                        <span className="text-[#1B254B] font-bold">{record.plan}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Monthly Rental</span>
                        <span className="text-emerald-600 font-bold">₹{record.monthlyRental}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Issue Date</span>
                        <span className="text-[#1B254B]">{record.issueDate}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Expiry Date</span>
                        <span className="text-[#1B254B]">{record.expiryDate}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1B254B]">SIM Analytics & Insights</h2>
                <Button
                  variant="outline"
                  className="border-gray-200"
                  onClick={() => toast.info('Generating analytics report...')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Analytics
                </Button>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="p-4 border-l-4 border-[#0B4DA2] bg-gradient-to-br from-blue-50 to-white">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="w-8 h-8 text-[#0B4DA2]" />
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#1B254B]">{simProfile.totalSimsIssued}</p>
                      <p className="text-xs text-gray-500">Total SIMs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                    <ArrowUp size={12} />
                    8% vs last month
                  </div>
                </Card>

                <Card className="p-4 border-l-4 border-purple-500 bg-gradient-to-br from-purple-50 to-white">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 text-purple-500" />
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#1B254B]">{simRequests.filter(r => r.status === 'pending').length}</p>
                      <p className="text-xs text-gray-500">Pending</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                    <ArrowUp size={12} />
                    12% vs last week
                  </div>
                </Card>

                <Card className="p-4 border-l-4 border-emerald-500 bg-gradient-to-br from-emerald-50 to-white">
                  <div className="flex items-center justify-between mb-2">
                    <Activity className="w-8 h-8 text-emerald-500" />
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#1B254B]">{simProfile.activeConnections}</p>
                      <p className="text-xs text-gray-500">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                    <ArrowUp size={12} />
                    5% vs last month
                  </div>
                </Card>

                <Card className="p-4 border-l-4 border-orange-500 bg-gradient-to-br from-orange-50 to-white">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="w-8 h-8 text-orange-500" />
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#1B254B]">₹{simProfile.monthlyExpense.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">Monthly Cost</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-red-600 text-xs font-bold">
                    <ArrowDown size={12} />
                    3% vs last month
                  </div>
                </Card>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6 border-gray-100">
                  <h3 className="text-[#1B254B] font-bold text-lg mb-4">Request Status Distribution</h3>
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Approved</span>
                        <span className="text-[#1B254B] font-bold">{simRequests.filter(r => r.status === 'approved').length} ({((simRequests.filter(r => r.status === 'approved').length / simRequests.length) * 100).toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${(simRequests.filter(r => r.status === 'approved').length / simRequests.length) * 100}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Pending</span>
                        <span className="text-[#1B254B] font-bold">{simRequests.filter(r => r.status === 'pending').length} ({((simRequests.filter(r => r.status === 'pending').length / simRequests.length) * 100).toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${(simRequests.filter(r => r.status === 'pending').length / simRequests.length) * 100}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Issued</span>
                        <span className="text-[#1B254B] font-bold">{simRequests.filter(r => r.status === 'issued').length} ({((simRequests.filter(r => r.status === 'issued').length / simRequests.length) * 100).toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0B4DA2]" style={{ width: `${(simRequests.filter(r => r.status === 'issued').length / simRequests.length) * 100}%` }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rejected</span>
                        <span className="text-[#1B254B] font-bold">{simRequests.filter(r => r.status === 'rejected').length} ({((simRequests.filter(r => r.status === 'rejected').length / simRequests.length) * 100).toFixed(1)}%)</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500" style={{ width: `${(simRequests.filter(r => r.status === 'rejected').length / simRequests.length) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-gray-100">
                  <h3 className="text-[#1B254B] font-bold text-lg mb-4">Top Departments by SIM Usage</h3>
                  <div className="space-y-3">
                    {['Engineering', 'Sales', 'Operations', 'HR', 'Finance'].map((dept, idx) => {
                      const count = simRecords.filter(r => r.department.toLowerCase().includes(dept.toLowerCase())).length;
                      const percentage = (count / simRecords.length) * 100;
                      return (
                        <div key={dept} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{dept}</span>
                            <span className="text-[#1B254B] font-bold">{count} SIMs</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${idx === 0 ? 'bg-[#0B4DA2]' : idx === 1 ? 'bg-purple-500' : idx === 2 ? 'bg-emerald-500' : idx === 3 ? 'bg-orange-500' : 'bg-blue-400'}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* Provider Analytics */}
              <Card className="p-6 border-gray-100">
                <h3 className="text-[#1B254B] font-bold text-lg mb-4">Provider Distribution</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['Airtel', 'Jio', 'VI', 'BSNL'].map((provider) => {
                    const count = simRecords.filter(r => r.provider === provider).length;
                    const totalCost = simRecords.filter(r => r.provider === provider).reduce((sum, r) => sum + r.monthlyRental, 0);
                    return (
                      <div key={provider} className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] flex items-center justify-center text-white font-bold">
                            {count}
                          </div>
                          <div>
                            <p className="text-[#1B254B] font-bold">{provider}</p>
                            <p className="text-xs text-gray-500">SIM Cards</p>
                          </div>
                        </div>
                        <div className="pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">Monthly Cost</p>
                          <p className="text-lg font-bold text-emerald-600">₹{totalCost.toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Monthly Trends */}
              <Card className="p-6 border-gray-100">
                <h3 className="text-[#1B254B] font-bold text-lg mb-4">Monthly Issuance Trends</h3>
                <div className="flex items-end justify-between h-64 gap-2">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, idx) => {
                    const height = Math.random() * 80 + 20; // Random height for demo
                    const value = Math.floor(height / 5);
                    return (
                      <div key={month} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative flex-1 w-full flex items-end">
                          <div
                            className="w-full bg-gradient-to-t from-[#0B4DA2] to-[#042A5B] rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative group"
                            style={{ height: `${height}%` }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              {value} SIMs
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 font-medium">{month}</p>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1B254B]">SIM Portal Settings</h2>
                <Button
                  className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B]"
                  onClick={() => toast.success('Settings saved successfully!')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  {/* General Settings */}
                  <Card className="p-6 border-gray-100">
                    <h3 className="text-[#1B254B] font-bold text-lg mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      General Settings
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="deptName">Department Name</Label>
                        <Input id="deptName" defaultValue={simProfile.name} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="deptEmail">Contact Email</Label>
                        <Input id="deptEmail" type="email" defaultValue={simProfile.email} className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="deptPhone">Contact Phone</Label>
                        <Input id="deptPhone" type="tel" defaultValue={simProfile.phone} className="mt-1" />
                      </div>
                    </div>
                  </Card>

                  {/* Approval Settings */}
                  <Card className="p-6 border-gray-100">
                    <h3 className="text-[#1B254B] font-bold text-lg mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Approval Settings
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-bold text-[#1B254B]">Auto-approve requests</p>
                          <p className="text-xs text-gray-500">Automatically approve SIM requests from verified employees</p>
                        </div>
                        <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-bold text-[#1B254B]">Email notifications</p>
                          <p className="text-xs text-gray-500">Send email notifications for new requests</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-bold text-[#1B254B]">SMS alerts</p>
                          <p className="text-xs text-gray-500">Send SMS alerts for urgent approvals</p>
                        </div>
                        <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300" />
                      </div>
                    </div>
                  </Card>

                  {/* Provider Settings */}
                  <Card className="p-6 border-gray-100">
                    <h3 className="text-[#1B254B] font-bold text-lg mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Preferred Providers
                    </h3>
                    <div className="space-y-3">
                      {['Airtel', 'Jio', 'VI', 'BSNL'].map((provider) => (
                        <div key={provider} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" defaultChecked={provider !== 'BSNL'} className="w-5 h-5 rounded border-gray-300" />
                            <div>
                              <p className="font-bold text-[#1B254B]">{provider}</p>
                              <p className="text-xs text-gray-500">Active provider</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Quick Info Sidebar */}
                <div className="space-y-6">
                  <Card className="p-6 border-gray-100 bg-gradient-to-br from-blue-50 to-white">
                    <h3 className="text-[#1B254B] font-bold mb-4">Portal Information</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Total SIMs Issued</p>
                        <p className="text-2xl font-bold text-[#1B254B]">{simProfile.totalSimsIssued}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Active Connections</p>
                        <p className="text-2xl font-bold text-emerald-600">{simProfile.activeConnections}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Pending Requests</p>
                        <p className="text-2xl font-bold text-purple-600">{simProfile.pendingRequests}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Monthly Expense</p>
                        <p className="text-2xl font-bold text-orange-600">₹{simProfile.monthlyExpense.toLocaleString()}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border-gray-100">
                    <h3 className="text-[#1B254B] font-bold mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Exporting data...')}>
                        <Download className="w-4 h-4 mr-2" />
                        Export All Data
                      </Button>
                      <Button variant="outline" className="w-full justify-start" onClick={() => toast.info('Generating report...')}>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start text-red-600 hover:bg-red-50" onClick={() => toast.warning('Cleared cache')}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Clear Cache
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      {/* New Request Dialog */}
      <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New SIM Card Request</DialogTitle>
            <DialogDescription>
              Submit a new SIM card request for an employee
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const newRequest: SimRequest = {
              id: `SR${String(simRequests.length + 1).padStart(3, '0')}`,
              employeeId: formData.get('employeeId') as string,
              employeeName: formData.get('employeeName') as string,
              department: formData.get('department') as string,
              designation: formData.get('designation') as string,
              requestType: formData.get('requestType') as 'new' | 'replacement' | 'upgrade',
              connectionType: formData.get('connectionType') as 'prepaid' | 'postpaid',
              requestDate: new Date().toISOString().split('T')[0],
              status: 'pending',
              justification: formData.get('justification') as string
            };
            setSimRequests(prev => [newRequest, ...prev]);
            toast.success('SIM request submitted successfully');
            setShowNewRequestDialog(false);
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" name="employeeId" required />
              </div>
              <div>
                <Label htmlFor="employeeName">Employee Name</Label>
                <Input id="employeeName" name="employeeName" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" name="department" required />
              </div>
              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" name="designation" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="requestType">Request Type</Label>
                <Select name="requestType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New SIM</SelectItem>
                    <SelectItem value="replacement">Replacement</SelectItem>
                    <SelectItem value="upgrade">Upgrade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="connectionType">Connection Type</Label>
                <Select name="connectionType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prepaid">Prepaid</SelectItem>
                    <SelectItem value="postpaid">Postpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="justification">Justification</Label>
              <Textarea id="justification" name="justification" rows={3} required />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowNewRequestDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B]">
                <Send className="w-4 h-4 mr-2" />
                Submit Request
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Issue SIM Dialog */}
      <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Issue SIM Card</DialogTitle>
            <DialogDescription>
              Issue a new SIM card to an approved employee
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleIssueSim(Object.fromEntries(formData));
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input id="employeeId" name="employeeId" required />
              </div>
              <div>
                <Label htmlFor="employeeName">Employee Name</Label>
                <Input id="employeeName" name="employeeName" required />
              </div>
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input id="department" name="department" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="simNumber">SIM Number</Label>
                <Input id="simNumber" name="simNumber" placeholder="8991101234567890" required />
              </div>
              <div>
                <Label htmlFor="mobileNumber">Mobile Number</Label>
                <Input id="mobileNumber" name="mobileNumber" placeholder="+91 98765 43210" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provider">Provider</Label>
                <Select name="provider" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Airtel">Airtel</SelectItem>
                    <SelectItem value="Jio">Jio</SelectItem>
                    <SelectItem value="VI">VI (Vodafone Idea)</SelectItem>
                    <SelectItem value="BSNL">BSNL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="plan">Plan</Label>
                <Input id="plan" name="plan" placeholder="Business Plan - Unlimited" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="monthlyRental">Monthly Rental (₹)</Label>
                <Input id="monthlyRental" name="monthlyRental" type="number" required />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input id="expiryDate" name="expiryDate" type="date" required />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => setShowIssueDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-emerald-600">
                <Package className="w-4 h-4 mr-2" />
                Issue SIM Card
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Department Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Department Name</Label>
              <p className="text-[#1B254B] font-bold">{simProfile.name}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-[#1B254B]">{simProfile.email}</p>
            </div>
            <div>
              <Label>Phone</Label>
              <p className="text-[#1B254B]">{simProfile.phone}</p>
            </div>
            <div>
              <Label>Total SIMs Issued</Label>
              <p className="text-[#1B254B] font-bold">{simProfile.totalSimsIssued}</p>
            </div>
            <div>
              <Label>Active Connections</Label>
              <p className="text-emerald-600 font-bold">{simProfile.activeConnections}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border ${notification.read ? 'bg-gray-50 border-gray-100' : 'bg-blue-50 border-blue-100'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <Bell className={`w-5 h-5 mt-0.5 ${notification.read ? 'text-gray-400' : 'text-blue-500'
                    }`} />
                  <div className="flex-1">
                    <p className="text-sm text-[#1B254B]">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
