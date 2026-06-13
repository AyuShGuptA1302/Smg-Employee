import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Coffee,
  Ticket,
  UserPlus,
  UserCheck,
  TrendingUp,
  IndianRupee,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Calendar,
  Filter,
  Download,
  Search,
  Eye,
  Edit,
  Bell,
  User,
  Settings,
  Home,
  FileText,
  ShoppingCart,
  Package,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Activity,
  BarChart3,
  DollarSign,
  CreditCard,
  History,
  Star,
  Send,
  LogOut
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

import logo from 'figma:asset/7ef5cbbf7f7fd6bbcf30128158bd641f40437597.png';

import { generateCanteenOrdersPDF } from '../../utils/pdfExport';

// Get dynamic greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

interface CouponRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: 'employee' | 'guest';
  quantity: number;
  amount: number;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  guestName?: string;
  guestPurpose?: string;
  serveTime?: string;
}

interface CouponIssuance {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  couponNumbers: string[];
  quantity: number;
  amount: number;
  issueDate: string;
  validTill: string;
  paymentStatus: 'paid' | 'pending';
}

interface Sale {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  quantity: number;
  amount: number;
  saleDate: string;
  paymentMethod: 'cash' | 'salary-deduction' | 'online';
  status: 'completed' | 'pending';
}

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image?: string;
}

export function CanteenPortal() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewSaleDialog, setShowNewSaleDialog] = useState(false);
  const [showIssueDialog, setShowIssueDialog] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<CouponRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [greeting, setGreeting] = useState(getGreeting());

  // Update greeting every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Default data for coupon requests
  const [couponRequests, setCouponRequests] = useState<CouponRequest[]>([
    {
      id: 'CR001',
      employeeId: 'SMG-2024-001',
      employeeName: 'Rahul Kumar',
      department: 'Assembly',
      type: 'employee',
      quantity: 20,
      amount: 1000,
      requestDate: '2024-01-15',
      status: 'pending',
      serveTime: '01:45 PM'
    },
    {
      id: 'CR002',
      employeeId: 'SMG-2024-025',
      employeeName: 'Priya Sharma',
      department: 'HR',
      type: 'guest',
      quantity: 5,
      amount: 250,
      requestDate: '2024-01-14',
      status: 'pending',
      guestName: 'Mr. John Smith',
      guestPurpose: 'Vendor Meeting',
      serveTime: '12:45 PM'
    },
    {
      id: 'CR003',
      employeeId: 'SMG-2024-042',
      employeeName: 'Amit Singh',
      department: 'IT',
      type: 'employee',
      quantity: 15,
      amount: 750,
      requestDate: '2024-01-14',
      status: 'approved',
      serveTime: '12:30 PM'
    }
  ]);

  // Default data for issued coupons
  const [issuedCoupons, setIssuedCoupons] = useState<CouponIssuance[]>([
    {
      id: 'CI001',
      employeeId: 'SMG-2024-042',
      employeeName: 'Rohit Sharma',
      department: 'Assembly',
      couponNumbers: ['C001', 'C002', 'C003', 'C004', 'C005'],
      quantity: 5,
      amount: 250,
      issueDate: '2024-01-10',
      validTill: '2024-01-31',
      paymentStatus: 'paid'
    },
    {
      id: 'CI002',
      employeeId: 'SMG-2024-018',
      employeeName: 'Neha Patel',
      department: 'HR',
      couponNumbers: ['C006', 'C007', 'C008', 'C009', 'C010'],
      quantity: 5,
      amount: 250,
      issueDate: '2024-01-12',
      validTill: '2024-01-31',
      paymentStatus: 'pending'
    }
  ]);

  // Default data for sales
  const [sales, setSales] = useState<Sale[]>([
    {
      id: 'S001',
      employeeId: 'SMG-2024-001',
      employeeName: 'Rahul Kumar',
      department: 'Assembly',
      quantity: 10,
      amount: 500,
      saleDate: '2024-01-15',
      paymentMethod: 'salary-deduction',
      status: 'completed'
    }
  ]);

  // Top selling items
  const topItems: MenuItem[] = [
    { id: 'M001', name: 'Dal Makhani', category: 'Main Course', price: 60, quantity: 165 },
    { id: 'M002', name: 'Paneer Butter Masala', category: 'Main Course', price: 80, quantity: 142 },
    { id: 'M003', name: 'Samosa', category: 'Snacks', price: 15, quantity: 107 },
    { id: 'M004', name: 'Masala Dosa', category: 'Breakfast', price: 50, quantity: 89 }
  ];

  const handleApproveRequest = (requestId: string) => {
    setCouponRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'approved' as const } : req
      )
    );
    const request = couponRequests.find(r => r.id === requestId);
    if (request?.type === 'guest') {
      toast.success(`Guest coupon request approved for ${request.guestName}`);
    } else {
      toast.success('Coupon request approved');
    }
  };

  const handleRejectRequest = (requestId: string) => {
    setCouponRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      )
    );
    toast.error('Coupon request rejected');
  };

  const handleNewSale = (formData: any) => {
    const newSale: Sale = {
      id: `S${String(sales.length + 1).padStart(3, '0')}`,
      employeeId: formData.employeeId,
      employeeName: formData.employeeName,
      department: formData.department,
      quantity: parseInt(formData.quantity),
      amount: parseInt(formData.amount),
      saleDate: new Date().toISOString().split('T')[0],
      paymentMethod: formData.paymentMethod,
      status: 'completed'
    };
    setSales(prev => [newSale, ...prev]);
    toast.success('Coupon sale recorded. Finance department has been notified.');
    setShowNewSaleDialog(false);
  };

  const handleIssueCoupon = (formData: any) => {
    const newIssuance: CouponIssuance = {
      id: `CI${String(issuedCoupons.length + 1).padStart(3, '0')}`,
      employeeId: formData.employeeId,
      employeeName: formData.employeeName,
      department: formData.department,
      couponNumbers: formData.couponNumbers.split(',').map((n: string) => n.trim()),
      quantity: parseInt(formData.quantity),
      amount: parseInt(formData.quantity) * 50,
      issueDate: new Date().toISOString().split('T')[0],
      validTill: formData.validTill,
      paymentStatus: 'pending'
    };
    setIssuedCoupons(prev => [newIssuance, ...prev]);
    toast.success(`Coupons issued to ${formData.employeeName}`);
    setShowIssueDialog(false);
  };

  const handleViewDetails = (request: CouponRequest) => {
    setSelectedRequest(request);
    setShowDetailsDialog(true);
  };

  const sidebarMenuItems = [
    { icon: Home, label: 'Dashboard', value: 'overview' },
    { icon: ShoppingCart, label: 'Coupon Sales', value: 'sales' },
    { icon: FileText, label: 'Requests', value: 'requests' },
    { icon: Ticket, label: 'Issued Coupons', value: 'issued' },
    { icon: BarChart3, label: 'Analytics', value: 'analytics' },
    { icon: Settings, label: 'Settings', value: 'settings' }
  ];

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

  // Calculate stats
  const totalCouponsIssued = issuedCoupons.reduce((sum, c) => sum + c.quantity, 0);
  const totalRevenue = sales.reduce((sum, s) => sum + s.amount, 0);
  const pendingRequests = couponRequests.filter(r => r.status === 'pending').length;
  const todaySales = sales.filter(s => s.saleDate === new Date().toISOString().split('T')[0]).length;

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
                <h2 className="text-[#1B254B] font-bold">Canteen Portal</h2>
                <p className="text-xs text-gray-500">Food & Coupons</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img src={logo} alt="SMG" className="w-10 h-10 object-contain" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
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
            onClick={() => {
              toast.success('Logging out...');
              setTimeout(() => window.location.reload(), 1000);
            }}
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
              <h1 className="text-2xl font-bold text-[#1B254B]">{greeting}, Canteen Desk 🍽️</h1>
              <p className="text-sm text-gray-500 mt-1">Manage coupons, sales & approvals</p>
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
                variant="outline"
                className="relative border-gray-200 hover:bg-gray-50"
                onClick={() => setShowNotificationsDialog(true)}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0B4DA2] text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {pendingRequests}
                </span>
              </Button>
              <Button
                variant="outline"
                className="border-gray-200 hover:bg-gray-50"
                onClick={() => setShowProfileDialog(true)}
              >
                <User className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => setShowNewSaleDialog(true)}
              className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90 text-white shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Coupon Sale
            </Button>
            <Button
              onClick={() => setShowIssueDialog(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 text-white shadow-lg shadow-emerald-500/30"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Issue Coupons
            </Button>
            <Button
              variant="outline"
              className="border-gray-200 hover:bg-gray-50"
              onClick={() => {
                const exportData = requests.map(req => ({
                  id: req.id,
                  employeeName: req.employeeName,
                  items: `${req.quantity} coupons`,
                  amount: req.amount,
                  date: req.requestDate,
                  status: req.status
                }));
                generateCanteenOrdersPDF(exportData);
                toast.success('Generating PDF report...');
              }}
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
              icon={Ticket}
              label="Total Coupons Issued"
              value={totalCouponsIssued.toString()}
              subtext="This month"
              change={12}
              colorClass="bg-gradient-to-br from-[#0B4DA2] to-[#042A5B]"
              onClick={() => setActiveTab('issued')}
            />
            <StatCard
              icon={IndianRupee}
              label="Revenue (This Month)"
              value={`₹${totalRevenue.toLocaleString()}`}
              subtext="From coupon sales"
              change={8}
              colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
              onClick={() => setActiveTab('sales')}
            />
            <StatCard
              icon={Users}
              label="Active Employees"
              value="248"
              subtext="Using canteen service"
              change={5}
              colorClass="bg-gradient-to-br from-purple-500 to-purple-600"
              onClick={() => setActiveTab('analytics')}
            />
            <StatCard
              icon={Clock}
              label="Pending Requests"
              value={pendingRequests.toString()}
              subtext="Awaiting approval"
              change={-3}
              colorClass="bg-gradient-to-br from-[#0B4DA2] to-[#042A5B]"
              onClick={() => setActiveTab('requests')}
            />
          </div>

          {/* Content Tabs */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Orders/Sales List */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="bg-white border-gray-100 p-6 shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[#1B254B] text-lg font-bold">Recent Coupon Sales</h3>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="recent">
                        <SelectTrigger className="w-[120px] bg-white border-gray-200 text-[#1B254B] text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="recent">Recent</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">This Week</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-200 hover:bg-gray-50 text-[#1B254B]"
                        onClick={() => setActiveTab('sales')}
                      >
                        See all sales
                      </Button>
                    </div>
                  </div>

                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 rounded-lg mb-3 text-xs font-bold text-gray-600 uppercase tracking-wide">
                    <div className="col-span-3">Employee Name</div>
                    <div className="col-span-2">Order ID</div>
                    <div className="col-span-2">Amount</div>
                    <div className="col-span-2">Payment</div>
                    <div className="col-span-2">Serve Time</div>
                    <div className="col-span-1">Status</div>
                  </div>

                  {/* Table Rows */}
                  <div className="space-y-2">
                    {couponRequests.slice(0, 5).map((request, index) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleViewDetails(request)}
                        className="grid grid-cols-12 gap-4 px-4 py-4 bg-white hover:bg-blue-50 rounded-lg cursor-pointer transition-all border border-gray-100 hover:border-[#0B4DA2]/30 shadow-sm"
                      >
                        <div className="col-span-3 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center text-xs font-bold">
                            {request.employeeName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[#1B254B] text-sm font-bold">{request.employeeName}</p>
                            <p className="text-gray-500 text-xs">{request.department}</p>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center">
                          <span className="text-gray-600 text-sm">{request.id}</span>
                        </div>
                        <div className="col-span-2 flex items-center">
                          <span className="text-[#1B254B] font-bold text-sm">₹{request.amount}</span>
                        </div>
                        <div className="col-span-2 flex items-center">
                          <Badge variant="outline" className={`text-xs border-0 ${request.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                              'bg-blue-500/20 text-blue-400'
                            }`}>
                            {request.status === 'approved' ? 'Paid' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="col-span-2 flex items-center">
                          <span className="text-gray-600 text-sm">{request.serveTime || 'N/A'}</span>
                        </div>
                        <div className="col-span-1 flex items-center">
                          <div className={`w-2 h-2 rounded-full ${request.status === 'approved' ? 'bg-emerald-400' :
                              request.status === 'pending' ? 'bg-blue-400' :
                                'bg-gray-400'
                            }`} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>

                {/* Sales Overview */}
                <div className="grid grid-cols-2 gap-6">
                  <Card className="bg-white border-gray-100 p-6 shadow-md">
                    <h3 className="text-[#1B254B] font-bold mb-4">Sales Overview</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 font-bold">Sales Value</span>
                          <span className="text-[#1B254B] font-bold">₹9,551</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            transition={{ duration: 1 }}
                            className="h-full bg-gradient-to-r from-[#0B4DA2] to-[#042A5B]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 mt-6">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">In process</span>
                          <span className="text-[#1B254B] font-bold">191</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">Ready to serve</span>
                          <span className="text-[#1B254B] font-bold">63</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">Complete</span>
                          <span className="text-[#1B254B] font-bold">119</span>
                        </div>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-white border-gray-100 p-6 shadow-md">
                    <h3 className="text-[#1B254B] font-bold mb-4">Order Summary</h3>
                    <div className="space-y-4">
                      <div className="text-center py-4">
                        <p className="text-5xl font-bold text-[#1B254B] mb-2">289</p>
                        <p className="text-gray-600 text-sm">Total Orders Today</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-emerald-600">119</p>
                          <p className="text-xs text-gray-600 mt-1">Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#0B4DA2]">191</p>
                          <p className="text-xs text-gray-600 mt-1">In Progress</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Right Sidebar - Top Sell & Recent Reviews */}
              <div className="space-y-6">
                {/* Top Sell Items */}
                <Card className="bg-white border-gray-100 p-6 shadow-md">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[#1B254B] font-bold">Top Sell</h3>
                    <Select defaultValue="today">
                      <SelectTrigger className="w-[100px] bg-white border-gray-200 text-[#1B254B] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">Week</SelectItem>
                        <SelectItem value="month">Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    {topItems.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg shadow-sm">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] flex items-center justify-center">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[#1B254B] text-sm font-bold">{item.name}</p>
                          <p className="text-gray-600 text-xs">Qty. {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#1B254B] font-bold">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recent Review */}
                <Card className="bg-white border-gray-100 p-6 shadow-md">
                  <h3 className="text-[#1B254B] font-bold mb-4">Recent Review</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold">
                          SM
                        </div>
                        <div>
                          <p className="text-[#1B254B] text-sm font-bold">Sneha Mia</p>
                          <div className="flex gap-0.5 mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star key={star} className="w-3 h-3 fill-[#87CEEB] text-[#87CEEB]" />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 text-xs mt-2">
                        Food was good and freshly prepared. Dal Makhani was too much tasty with roti.
                      </p>
                      <p className="text-gray-500 text-xs mt-2">Reviewed by Sabella Mia</p>
                    </div>
                  </div>
                </Card>

                {/* Today's Summary */}
                <Card className="bg-white border-gray-100 p-6 shadow-md">
                  <h3 className="text-[#1B254B] font-bold mb-4">Today's Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">Coupons Sold</p>
                          <p className="text-[#1B254B] font-bold">169</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] flex items-center justify-center">
                          <IndianRupee className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">Revenue</p>
                          <p className="text-[#1B254B] font-bold">₹8,450</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">Guest Requests</p>
                          <p className="text-[#1B254B] font-bold">8</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'sales' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search sales..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-gray-200"
                  />
                </div>
                <Input type="date" className="w-[180px] bg-white border-gray-200" />
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px] bg-white border-gray-200">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sales</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {sales.map((sale) => (
                  <Card key={sale.id} className="bg-white border-gray-100 p-6 hover:border-[#0B4DA2]/50 transition-all shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center font-bold">
                          {sale.employeeName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-gray-900 font-bold">{sale.employeeName}</h4>
                          <p className="text-gray-600 text-sm">{sale.employeeId} • {sale.department}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-gray-600 text-xs">Quantity</p>
                          <p className="text-gray-900 font-bold">{sale.quantity} coupons</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs">Amount</p>
                          <p className="text-gray-900 font-bold">₹{sale.amount}</p>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Payment</p>
                          <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                            {sale.paymentMethod}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-slate-400 text-xs">Date</p>
                          <p className="text-slate-300 text-sm">{sale.saleDate}</p>
                        </div>
                        <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-0">
                          {sale.status}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search requests..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white border-gray-200"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px] bg-[#1E293B] border-slate-700 text-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                {couponRequests.map((request) => (
                  <Card key={request.id} className="bg-[#1E293B] border-slate-700/50 p-6 hover:border-blue-500/50 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#0B4DA2]/20 text-blue-400 flex items-center justify-center text-lg font-bold">
                            {request.employeeName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-gray-900 font-bold">{request.employeeName}</h4>
                              <Badge variant="outline" className={`text-xs border-0 ${request.type === 'employee' ? 'bg-blue-500/20 text-blue-600' : 'bg-purple-500/20 text-purple-600'
                                }`}>
                                {request.type}
                              </Badge>
                              <Badge variant="outline" className={`text-xs border-0 ${request.status === 'approved' ? 'bg-emerald-500/20 text-emerald-600' :
                                  request.status === 'rejected' ? 'bg-red-500/20 text-red-600' :
                                    'bg-[#0B4DA2]/20 text-blue-600'
                                }`}>
                                {request.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm">{request.employeeId} • {request.department}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="p-3 bg-blue-50 rounded-xl">
                            <p className="text-xs text-gray-600 mb-1 font-bold uppercase tracking-wide">Quantity</p>
                            <p className="text-gray-900 font-bold">{request.quantity} coupons</p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-xl">
                            <p className="text-xs text-gray-600 mb-1 font-bold uppercase tracking-wide">Amount</p>
                            <p className="text-gray-900 font-bold">₹{request.amount}</p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-xl">
                            <p className="text-xs text-gray-600 mb-1 font-bold uppercase tracking-wide">Request Date</p>
                            <p className="text-gray-900 font-bold">{request.requestDate}</p>
                          </div>
                          <div className="p-3 bg-blue-50 rounded-xl">
                            <p className="text-xs text-gray-600 mb-1 font-bold uppercase tracking-wide">Serve Time</p>
                            <p className="text-gray-900 font-bold">{request.serveTime || 'N/A'}</p>
                          </div>
                        </div>

                        {request.type === 'guest' && (
                          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                            <p className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">Guest Details</p>
                            <p className="text-gray-900 font-bold mb-1">{request.guestName}</p>
                            <p className="text-gray-600 text-sm">Purpose: {request.guestPurpose}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-2 pt-4 border-t border-slate-700/50">
                        <Button
                          onClick={() => handleApproveRequest(request.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve {request.type === 'guest' && 'Guest '}Request
                        </Button>
                        <Button
                          onClick={() => handleRejectRequest(request.id)}
                          variant="outline"
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => handleViewDetails(request)}
                          variant="outline"
                          className="border-slate-700 hover:bg-slate-700/50 text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'issued' && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search issued coupons..."
                    className="pl-10 bg-[#1E293B] border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>
                <Button variant="outline" className="border-gray-200 hover:bg-gray-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>

              <div className="space-y-4">
                {issuedCoupons.map((coupon) => (
                  <Card key={coupon.id} className="bg-white border-gray-100 p-6 hover:border-[#0B4DA2]/50 transition-all shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg font-bold">
                            {coupon.employeeName.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-gray-900 font-bold mb-1">{coupon.employeeName}</h4>
                            <p className="text-slate-400 text-sm">{coupon.employeeId} • {coupon.department}</p>
                          </div>
                          <Badge variant="outline" className={`ml-2 text-xs border-0 ${coupon.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                            }`}>
                            {coupon.paymentStatus}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                          <div className="p-3 bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] rounded-xl shadow-lg">
                            <p className="text-xs text-white/70 mb-1 font-bold uppercase tracking-wide">Quantity</p>
                            <p className="text-white font-bold">{coupon.quantity} coupons</p>
                          </div>
                          <div className="p-3 bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] rounded-xl shadow-lg">
                            <p className="text-xs text-white/70 mb-1 font-bold uppercase tracking-wide">Amount</p>
                            <p className="text-white font-bold">₹{coupon.amount}</p>
                          </div>
                          <div className="p-3 bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] rounded-xl shadow-lg">
                            <p className="text-xs text-white/70 mb-1 font-bold uppercase tracking-wide">Issue Date</p>
                            <p className="text-white font-bold">{coupon.issueDate}</p>
                          </div>
                          <div className="p-3 bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] rounded-xl shadow-lg">
                            <p className="text-xs text-white/70 mb-1 font-bold uppercase tracking-wide">Valid Till</p>
                            <p className="text-white font-bold">{coupon.validTill}</p>
                          </div>
                          <div className="p-3 bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] rounded-xl shadow-lg">
                            <p className="text-xs text-white/70 mb-1 font-bold uppercase tracking-wide">Coupon #s</p>
                            <p className="text-white font-bold text-xs">{coupon.couponNumbers.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-gray-900 font-bold">This Week</h3>
                      <p className="text-xs text-gray-600">Total Sales</p>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-gray-900 mb-2">₹45,620</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-emerald-600 flex items-center gap-1 font-bold">
                      <ArrowUp className="w-4 h-4" />
                      12%
                    </span>
                    <span className="text-gray-600">from last week</span>
                  </div>
                </Card>

                <Card className="bg-[#1E293B] border-slate-700/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Ticket className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Coupons Issued</h3>
                      <p className="text-xs text-slate-400">This Month</p>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-white mb-2">1,245</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-emerald-400 flex items-center gap-1 font-bold">
                      <ArrowUp className="w-4 h-4" />
                      8%
                    </span>
                    <span className="text-slate-400">from last month</span>
                  </div>
                </Card>

                <Card className="bg-[#1E293B] border-slate-700/50 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold">Avg. Per Employee</h3>
                      <p className="text-xs text-slate-400">Monthly Spending</p>
                    </div>
                  </div>
                  <p className="text-4xl font-bold text-white mb-2">₹850</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400">Average amount</span>
                  </div>
                </Card>
              </div>

              <Card className="bg-[#1E293B] border-slate-700/50 p-6">
                <h3 className="text-white font-bold mb-4">Department-wise Usage</h3>
                <div className="space-y-3">
                  {[
                    { dept: 'Assembly', amount: 18500, percentage: 40 },
                    { dept: 'IT', amount: 12300, percentage: 30 },
                    { dept: 'HR', amount: 9200, percentage: 20 },
                    { dept: 'Finance', amount: 5620, percentage: 10 }
                  ].map((dept, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm text-slate-300 w-32 font-bold">{dept.dept}</span>
                      <div className="flex-1 h-8 bg-[#0F172A] rounded-lg overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${dept.percentage}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                          className="h-full bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] flex items-center px-3"
                        >
                          <span className="text-white text-sm font-bold">₹{dept.amount}</span>
                        </motion.div>
                      </div>
                      <span className="text-sm text-slate-400 w-16 text-right">{dept.percentage}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card className="bg-[#1E293B] border-slate-700/50 p-6">
                <h3 className="text-white font-bold mb-4">Canteen Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0F172A] rounded-xl">
                    <p className="text-sm text-slate-400 mb-2">Coupon Price</p>
                    <p className="text-2xl font-bold text-white">₹50</p>
                  </div>
                  <div className="p-4 bg-[#0F172A] rounded-xl">
                    <p className="text-sm text-slate-400 mb-2">Operating Hours</p>
                    <p className="text-white font-bold">8:00 AM - 6:00 PM</p>
                  </div>
                  <div className="p-4 bg-[#0F172A] rounded-xl">
                    <p className="text-sm text-slate-400 mb-2">Monthly Budget</p>
                    <p className="text-2xl font-bold text-white">₹2,50,000</p>
                  </div>
                  <div className="p-4 bg-[#0F172A] rounded-xl">
                    <p className="text-sm text-slate-400 mb-2">Guest Coupon Limit</p>
                    <p className="text-2xl font-bold text-white">10/day</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#1E293B] border-slate-700/50 p-6">
                <h3 className="text-white font-bold mb-4">Meal Timings</h3>
                <div className="space-y-3">
                  {[
                    { meal: 'Breakfast', timing: '8:00 AM - 10:00 AM' },
                    { meal: 'Lunch', timing: '12:00 PM - 2:00 PM' },
                    { meal: 'Snacks', timing: '4:00 PM - 5:00 PM' }
                  ].map((schedule, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl">
                      <span className="text-sm font-bold text-white">{schedule.meal}</span>
                      <span className="text-sm text-slate-400">{schedule.timing}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* New Sale Dialog */}
      <Dialog open={showNewSaleDialog} onOpenChange={setShowNewSaleDialog}>
        <DialogContent className="max-w-2xl bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-white">Record New Coupon Sale</DialogTitle>
            <DialogDescription className="text-slate-400">
              Record a new coupon sale. Finance department will be notified automatically.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleNewSale({
              employeeId: formData.get('employeeId'),
              employeeName: formData.get('employeeName'),
              department: formData.get('department'),
              quantity: formData.get('quantity'),
              amount: formData.get('amount'),
              paymentMethod: formData.get('paymentMethod')
            });
          }}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-bold">Employee ID *</Label>
                  <Input name="employeeId" placeholder="SMG-2024-XXX" required className="bg-[#0F172A] border-slate-700 text-white placeholder:text-slate-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-bold">Employee Name *</Label>
                  <Input name="employeeName" placeholder="Enter name" required className="bg-[#0F172A] border-slate-700 text-white placeholder:text-slate-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-bold">Department *</Label>
                  <Select name="department" required>
                    <SelectTrigger className="bg-[#0F172A] border-slate-700 text-white">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assembly">Assembly</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-bold">Quantity *</Label>
                  <Input name="quantity" type="number" placeholder="Number of coupons" required className="bg-[#0F172A] border-slate-700 text-white placeholder:text-slate-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-bold">Amount (₹) *</Label>
                  <Input name="amount" type="number" placeholder="Total amount" required className="bg-[#0F172A] border-slate-700 text-white placeholder:text-slate-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-bold">Payment Method *</Label>
                  <Select name="paymentMethod" required>
                    <SelectTrigger className="bg-[#0F172A] border-slate-700 text-white">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="salary-deduction">Salary Deduction</SelectItem>
                      <SelectItem value="online">Online Payment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
              <Button type="button" variant="outline" onClick={() => setShowNewSaleDialog(false)} className="border-slate-700 hover:bg-slate-700/50 text-white">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 text-white">
                <Send className="w-4 h-4 mr-2" />
                Record Sale & Notify Finance
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Issue Coupon Dialog */}
      <Dialog open={showIssueDialog} onOpenChange={setShowIssueDialog}>
        <DialogContent className="max-w-2xl bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-white">Issue New Coupons</DialogTitle>
            <DialogDescription className="text-slate-400">
              Issue coupons to an employee
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleIssueCoupon({
              employeeId: formData.get('employeeId'),
              employeeName: formData.get('employeeName'),
              department: formData.get('department'),
              quantity: formData.get('quantity'),
              validTill: formData.get('validTill'),
              couponNumbers: formData.get('couponNumbers')
            });
          }}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-bold">Employee ID *</Label>
                  <Input name="employeeId" placeholder="SMG-2024-XXX" required className="bg-[#0F172A] border-slate-700 text-white placeholder:text-slate-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-bold">Employee Name *</Label>
                  <Input name="employeeName" placeholder="Enter name" required className="bg-[#0F172A] border-slate-700 text-white placeholder:text-slate-500" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-white font-bold">Department *</Label>
                  <Select name="department" required>
                    <SelectTrigger className="bg-[#0F172A] border-slate-700 text-white">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Assembly">Assembly</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-bold">Quantity *</Label>
                  <Input name="quantity" type="number" placeholder="Count" required className="bg-[#0F172A] border-slate-700 text-white placeholder:text-slate-500" />
                </div>
                <div className="space-y-2">
                  <Label className="text-white font-bold">Valid Till *</Label>
                  <Input name="validTill" type="date" required className="bg-[#0F172A] border-slate-700 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white font-bold">Coupon Numbers (comma separated) *</Label>
                <Input name="couponNumbers" placeholder="C001, C002, C003..." required className="bg-[#0F172A] border-slate-700 text-white placeholder:text-slate-500" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
              <Button type="button" variant="outline" onClick={() => setShowIssueDialog(false)} className="border-slate-700 hover:bg-slate-700/50 text-white">
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90 text-white">
                <Ticket className="w-4 h-4 mr-2" />
                Issue Coupons
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-white">Request Details</DialogTitle>
            <DialogDescription className="text-slate-400">Complete information about the coupon request</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[#0B4DA2]/20 to-[#042A5B]/20 rounded-xl border border-[#0B4DA2]/30">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center text-2xl font-bold">
                  {selectedRequest.employeeName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{selectedRequest.employeeName}</h3>
                  <p className="text-slate-400">{selectedRequest.employeeId} • {selectedRequest.department}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline" className={`text-xs border-0 ${selectedRequest.type === 'employee' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                      {selectedRequest.type}
                    </Badge>
                    <Badge variant="outline" className={`text-xs border-0 ${selectedRequest.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400' :
                        selectedRequest.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-blue-500/20 text-blue-400'
                      }`}>
                      {selectedRequest.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-[#0F172A] border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-wide">Quantity</p>
                  <p className="text-white font-bold">{selectedRequest.quantity} coupons</p>
                </Card>
                <Card className="p-4 bg-[#0F172A] border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-wide">Amount</p>
                  <p className="text-white font-bold">₹{selectedRequest.amount}</p>
                </Card>
                <Card className="p-4 bg-[#0F172A] border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-wide">Request Date</p>
                  <p className="text-white font-bold">{selectedRequest.requestDate}</p>
                </Card>
                <Card className="p-4 bg-[#0F172A] border-slate-700/50">
                  <p className="text-xs text-slate-400 mb-2 font-bold uppercase tracking-wide">Serve Time</p>
                  <p className="text-white font-bold">{selectedRequest.serveTime || 'N/A'}</p>
                </Card>
              </div>

              {selectedRequest.type === 'guest' && (
                <Card className="p-4 bg-[#0B4DA2]/10 border-[#0B4DA2]/30">
                  <p className="text-xs text-slate-400 mb-3 font-bold uppercase tracking-wide">Guest Information</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-slate-400">Guest Name</p>
                      <p className="text-white font-bold">{selectedRequest.guestName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Purpose of Visit</p>
                      <p className="text-white font-bold">{selectedRequest.guestPurpose}</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
          <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)} className="border-slate-700 hover:bg-slate-700/50 text-white">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notifications Dialog */}
      <Dialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog}>
        <DialogContent className="max-w-2xl bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1B254B] flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              Notifications
            </DialogTitle>
            <DialogDescription>
              Recent updates and pending requests for your review
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4 max-h-[500px] overflow-y-auto">
            {couponRequests.filter(r => r.status === 'pending').map((request) => (
              <div key={request.id} className="p-4 bg-blue-50 rounded-xl border border-[#0B4DA2]/20 hover:border-[#0B4DA2]/40 transition-all">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center font-bold flex-shrink-0">
                    {request.employeeName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[#1B254B]">{request.employeeName}</p>
                    <p className="text-sm text-gray-600">
                      {request.type === 'guest' ? `Guest coupon request for ${request.guestName}` : 'Employee coupon request'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{request.requestDate}</p>
                  </div>
                  <Badge className="bg-[#87CEEB] text-[#042A5B] hover:bg-[#87CEEB]/80">
                    {request.quantity} coupons
                  </Badge>
                </div>
              </div>
            ))}
            {couponRequests.filter(r => r.status === 'pending').length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500">No pending notifications</p>
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => setShowNotificationsDialog(false)}
              className="flex-1 bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-2xl bg-white border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#1B254B] flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              Canteen Portal Profile
            </DialogTitle>
            <DialogDescription>
              Manage your canteen portal account and preferences
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            <div className="flex items-center gap-4 p-6 bg-gradient-to-r from-[#0B4DA2]/10 to-[#042A5B]/10 rounded-xl border border-[#0B4DA2]/20">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center text-3xl font-bold">
                C
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#1B254B]">Canteen Manager</h3>
                <p className="text-sm text-gray-600">canteen@smg</p>
                <Badge className="mt-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                  Active
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-white border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Total Coupons Issued</p>
                <p className="text-2xl font-bold text-[#1B254B]">{totalCouponsIssued}</p>
              </Card>
              <Card className="p-4 bg-white border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Total Revenue</p>
                <p className="text-2xl font-bold text-[#1B254B]">₹{totalRevenue.toLocaleString()}</p>
              </Card>
              <Card className="p-4 bg-white border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Pending Requests</p>
                <p className="text-2xl font-bold text-[#1B254B]">{pendingRequests}</p>
              </Card>
              <Card className="p-4 bg-white border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Today's Sales</p>
                <p className="text-2xl font-bold text-[#1B254B]">{todaySales}</p>
              </Card>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-[#1B254B]">Portal Information</h4>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Department</span>
                  <span className="text-sm font-bold text-[#1B254B]">Canteen Management</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Portal Type</span>
                  <span className="text-sm font-bold text-[#1B254B]">Department Portal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Access Level</span>
                  <span className="text-sm font-bold text-[#1B254B]">Manager</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="text-sm font-bold text-[#1B254B]">Today, {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => setShowProfileDialog(false)}
              variant="outline"
              className="flex-1 border-gray-200"
            >
              Close
            </Button>
            <Button
              onClick={() => {
                toast.success('Settings saved successfully!');
                setShowProfileDialog(false);
              }}
              className="flex-1 bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90 text-white"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
