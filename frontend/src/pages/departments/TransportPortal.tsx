import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Bus,
  Car,
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
  LogOut,
  Filter,
  Clock,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Plane,
  MapPin,
  Fuel
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

// Simple toast replacement for notifications
const toast = {
  success: (msg: string) => console.log('Success:', msg),
  error: (msg: string) => console.log('Error:', msg),
  info: (msg: string) => console.log('Info:', msg)
};

interface TransportRequest {
  id: string;
  type: 'bus' | 'parking' | 'transport' | 'trip';
  employeeId: string;
  employeeName: string;
  department: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
  details: any;
}

// Get dynamic greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export function TransportPortal() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showBusPassDialog, setShowBusPassDialog] = useState(false);
  const [showParkingDialog, setShowParkingDialog] = useState(false);
  const [showTripDialog, setShowTripDialog] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
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

  const [requests, setRequests] = useState<TransportRequest[]>([
    {
      id: 'TR001',
      type: 'bus',
      employeeId: 'SMG-2024-042',
      employeeName: 'Rohit Sharma',
      department: 'Assembly',
      requestDate: '2025-01-15',
      status: 'pending',
      details: {
        route: 'Noida Sector 62 - SMG Plant',
        pickupPoint: 'Noida Sector 62 Metro',
        shift: 'General (9:00 - 18:00)'
      }
    },
    {
      id: 'TR002',
      type: 'parking',
      employeeId: 'SMG-2024-025',
      employeeName: 'Priya Sharma',
      department: 'HR',
      requestDate: '2025-01-14',
      status: 'pending',
      details: {
        vehicleType: 'Car',
        vehicleNumber: 'DL 01 AB 1234',
        parkingType: 'Covered'
      }
    },
    {
      id: 'TR003',
      type: 'trip',
      employeeId: 'SMG-2024-018',
      employeeName: 'Amit Singh',
      department: 'Marketing',
      requestDate: '2025-01-13',
      status: 'approved',
      details: {
        destination: 'Mumbai',
        purpose: 'Client Meeting',
        departureDate: '2025-01-20',
        returnDate: '2025-01-22',
        travelMode: 'Flight'
      }
    }
  ]);

  const notifications = [
    { id: 1, message: 'New bus pass request from Rohit Sharma', time: '5 mins ago', type: 'request', read: false },
    { id: 2, message: 'Parking sticker P-089 expired', time: '1 hour ago', type: 'alert', read: false },
    { id: 3, message: 'Trip request TR003 approved', time: '2 hours ago', type: 'success', read: true }
  ];

  const stats = {
    activeBusPasses: 156,
    parkingStickers: 89,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    tripsThisMonth: 24
  };

  const handleApprove = (requestId: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'approved' as const } : req
      )
    );
    toast.success('Request approved successfully');
  };

  const handleReject = (requestId: string) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: 'rejected' as const } : req
      )
    );
    toast.success('Request rejected');
  };

  const handleApproveBusPass = () => {
    toast.success('Bus pass approved and issued');
    setShowBusPassDialog(false);
  };

  const handleApproveParking = () => {
    toast.success('Parking sticker approved and issued');
    setShowParkingDialog(false);
  };

  const handleApproveTrip = () => {
    toast.success('Trip request approved');
    setShowTripDialog(false);
  };

  const handleLogout = () => {
    toast.success('Logging out...');
    setTimeout(() => {
      window.location.href = '/departments';
    }, 1000);
  };

  const sidebarMenuItems = [
    { icon: Home, label: 'Dashboard', value: 'overview' },
    { icon: Bus, label: 'Bus Passes', value: 'bus' },
    { icon: Car, label: 'Parking', value: 'parking' },
    { icon: Plane, label: 'Trip Requests', value: 'trips' },
    { icon: FileText, label: 'History', value: 'history' },
    { icon: BarChart3, label: 'Analytics', value: 'analytics' },
    { icon: Settings, label: 'Settings', value: 'settings' }
  ];

  const StatCard = ({ icon: Icon, label, value, subtext, change, colorClass, onClick }: any) => (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -4 }}
      className="bg-white p-6 rounded-[24px] shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer w-full text-left border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${colorClass}`}>
          <Icon size={28} className="text-white" />
        </div>
        {change !== undefined && (
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
              <img src="/Company Logo.jpg" alt="SMG Logo" className="w-full h-auto" />
              <div className="text-center">
                <h2 className="text-[#1B254B] font-bold">Transport Portal</h2>
                <p className="text-xs text-gray-500">Fleet & Mobility</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img src="/Company Logo.jpg" alt="SMG" className="w-10 h-10 object-contain" />
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
              <h1 className="text-2xl font-bold text-[#1B254B]">{greeting}, Transport Desk 🚌</h1>
              <p className="text-sm text-gray-500 mt-1">Manage bus passes, parking & trips</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search anything..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80 border-gray-200"
                />
              </div>
              <div className="relative">
                <Button
                  onClick={() => setShowNotifications(!showNotifications)}
                  variant="outline"
                  className="relative border-gray-200 hover:bg-gray-50"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold animate-pulse">
                    {notifications.filter(n => !n.read).length}
                  </span>
                </Button>
                {showNotifications && (
                  <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-[#0B4DA2] to-[#042A5B]">
                      <h3 className="font-bold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                          <p className="text-sm text-gray-800">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-100">
                      <button
                        onClick={() => { setActiveTab('settings'); setShowNotifications(false); }}
                        className="w-full text-center text-sm text-[#0B4DA2] font-bold hover:underline"
                      >
                        View All Notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Button
                onClick={() => setActiveTab('settings')}
                variant="outline"
                className="border-gray-200 hover:bg-gray-50"
              >
                <Settings className="w-4 h-4" />
              </Button>
              <div
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] flex items-center justify-center text-white text-sm font-bold">
                  TD
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-[#1B254B]">Transport Desk</p>
                  <p className="text-xs text-gray-500">P&A Admin</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              onClick={() => setShowBusPassDialog(true)}
              className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90 text-white shadow-lg shadow-blue-500/30"
            >
              <Bus className="w-4 h-4 mr-2" />
              Approve Bus Pass
            </Button>
            <Button
              onClick={() => setShowParkingDialog(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 text-white shadow-lg shadow-emerald-500/30"
            >
              <Car className="w-4 h-4 mr-2" />
              Issue Parking Sticker
            </Button>
            <Button
              onClick={() => setShowTripDialog(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:opacity-90 text-white shadow-lg shadow-purple-500/30"
            >
              <Plane className="w-4 h-4 mr-2" />
              Approve Trip
            </Button>
            <Button
              variant="outline"
              className="border-gray-200 hover:bg-gray-50"
              onClick={() => toast.info('Generating transport report...')}
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
              icon={Bus}
              label="Active Bus Passes"
              value={stats.activeBusPasses.toString()}
              subtext="Employee commute"
              change={8}
              colorClass="bg-gradient-to-br from-[#0B4DA2] to-[#042A5B]"
              onClick={() => setActiveTab('bus')}
            />
            <StatCard
              icon={Car}
              label="Parking Stickers"
              value={stats.parkingStickers.toString()}
              subtext="Issued this month"
              change={5}
              colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
              onClick={() => setActiveTab('parking')}
            />
            <StatCard
              icon={Clock}
              label="Pending Requests"
              value={stats.pendingRequests.toString()}
              subtext="Awaiting approval"
              change={-3}
              colorClass="bg-gradient-to-br from-orange-500 to-orange-600"
              onClick={() => setActiveTab('overview')}
            />
            <StatCard
              icon={Plane}
              label="Trips This Month"
              value={stats.tripsThisMonth.toString()}
              subtext="Business travel"
              change={6}
              colorClass="bg-gradient-to-br from-purple-500 to-purple-600"
              onClick={() => setActiveTab('trips')}
            />
          </div>

          {/* Content based on activeTab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-6 border-gray-100 shadow-md">
                  <h3 className="text-[#1B254B] font-bold text-lg mb-4">Pending Requests</h3>
                  <div className="space-y-3">
                    {requests.filter(r => r.status === 'pending').map((request) => (
                      <div key={request.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center text-xs font-bold">
                              {request.employeeName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#1B254B]">{request.employeeName}</p>
                              <p className="text-xs text-gray-500">{request.department} • {request.type.toUpperCase()}</p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                            {request.status}
                          </Badge>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            onClick={() => handleApprove(request.id)}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleReject(request.id)}
                            size="sm"
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    ))}
                    {requests.filter(r => r.status === 'pending').length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                        <p>No pending requests</p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
              <div>
                <Card className="p-6 border-gray-100 shadow-md">
                  <h3 className="text-[#1B254B] font-bold mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 text-sm">Bus Routes Active</span>
                      <span className="text-[#1B254B] font-bold">8</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 text-sm">Vehicles in Fleet</span>
                      <span className="text-[#1B254B] font-bold">24</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 text-sm">Parking Spots</span>
                      <span className="text-[#1B254B] font-bold">150</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600 text-sm">Monthly Fuel Cost</span>
                      <span className="text-emerald-600 font-bold">₹2.4L</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'bus' && (
            <Card className="p-6 border-gray-100 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#1B254B]">Bus Pass Requests</h2>
                <Button onClick={() => setShowBusPassDialog(true)} className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B]">
                  <Plus className="w-4 h-4 mr-2" />
                  New Bus Pass
                </Button>
              </div>
              <div className="space-y-4">
                {requests.filter(r => r.type === 'bus').map((request) => (
                  <div key={request.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center font-bold">
                          {request.employeeName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-[#1B254B] font-bold">{request.employeeName}</h4>
                          <p className="text-sm text-gray-500">{request.employeeId} • {request.department}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${request.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                          request.status === 'rejected' ? 'bg-red-50 text-red-600' :
                            'bg-yellow-50 text-yellow-600'
                        }`}>
                        {request.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">Route</p>
                        <p className="text-sm font-bold text-[#1B254B]">{request.details?.route}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">Pickup Point</p>
                        <p className="text-sm font-bold text-[#1B254B]">{request.details?.pickupPoint}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">Shift</p>
                        <p className="text-sm font-bold text-[#1B254B]">{request.details?.shift}</p>
                      </div>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <Button onClick={() => handleApprove(request.id)} className="bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button onClick={() => handleReject(request.id)} variant="outline" className="border-red-200 text-red-600">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'parking' && (
            <Card className="p-6 border-gray-100 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#1B254B]">Parking Requests</h2>
                <Button onClick={() => setShowParkingDialog(true)} className="bg-gradient-to-r from-emerald-500 to-emerald-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Parking Sticker
                </Button>
              </div>
              <div className="space-y-4">
                {requests.filter(r => r.type === 'parking').map((request) => (
                  <div key={request.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center font-bold">
                          {request.employeeName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-[#1B254B] font-bold">{request.employeeName}</h4>
                          <p className="text-sm text-gray-500">{request.employeeId} • {request.department}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${request.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                          request.status === 'rejected' ? 'bg-red-50 text-red-600' :
                            'bg-yellow-50 text-yellow-600'
                        }`}>
                        {request.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">Vehicle Type</p>
                        <p className="text-sm font-bold text-[#1B254B]">{request.details?.vehicleType}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">Vehicle Number</p>
                        <p className="text-sm font-bold text-[#1B254B]">{request.details?.vehicleNumber}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">Parking Type</p>
                        <p className="text-sm font-bold text-[#1B254B]">{request.details?.parkingType}</p>
                      </div>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <Button onClick={() => handleApprove(request.id)} className="bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button onClick={() => handleReject(request.id)} variant="outline" className="border-red-200 text-red-600">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'trips' && (
            <Card className="p-6 border-gray-100 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#1B254B]">Trip Requests</h2>
                <Button onClick={() => setShowTripDialog(true)} className="bg-gradient-to-r from-purple-500 to-purple-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Trip Request
                </Button>
              </div>
              <div className="space-y-4">
                {requests.filter(r => r.type === 'trip').map((request) => (
                  <div key={request.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white flex items-center justify-center font-bold">
                          {request.employeeName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-[#1B254B] font-bold">{request.employeeName}</h4>
                          <p className="text-sm text-gray-500">{request.employeeId} • {request.department}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={`${request.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                          request.status === 'rejected' ? 'bg-red-50 text-red-600' :
                            'bg-yellow-50 text-yellow-600'
                        }`}>
                        {request.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">Destination</p>
                        <p className="text-sm font-bold text-[#1B254B]">{request.details?.destination}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">Purpose</p>
                        <p className="text-sm font-bold text-[#1B254B]">{request.details?.purpose}</p>
                      </div>
                      <div className="p-3 bg-white rounded-lg">
                        <p className="text-xs text-gray-500">Travel Mode</p>
                        <p className="text-sm font-bold text-[#1B254B]">{request.details?.travelMode}</p>
                      </div>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <Button onClick={() => handleApprove(request.id)} className="bg-emerald-600 hover:bg-emerald-700">
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button onClick={() => handleReject(request.id)} variant="outline" className="border-red-200 text-red-600">
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'history' && (
            <Card className="p-6 border-gray-100 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#1B254B]">Request History</h2>
                <Button variant="outline" onClick={() => toast.info('Exporting history...')}>
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
              <div className="space-y-3">
                {requests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center text-xs font-bold">
                        {request.employeeName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1B254B]">{request.employeeName}</p>
                        <p className="text-xs text-gray-500">{request.type.toUpperCase()} • {request.requestDate}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={`${request.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                        request.status === 'rejected' ? 'bg-red-50 text-red-600' :
                          'bg-yellow-50 text-yellow-600'
                      }`}>
                      {request.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#1B254B]">Transport Analytics</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 border-gray-100 shadow-md">
                  <h3 className="text-[#1B254B] font-bold mb-4">Bus Pass Distribution</h3>
                  <div className="space-y-4">
                    {[
                      { route: 'Noida Sector 62 Route', count: 45, color: 'bg-blue-500' },
                      { route: 'Greater Noida Route', count: 38, color: 'bg-emerald-500' },
                      { route: 'Ghaziabad Route', count: 32, color: 'bg-purple-500' },
                      { route: 'Delhi Route', count: 28, color: 'bg-orange-500' }
                    ].map((item) => (
                      <div key={item.route}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{item.route}</span>
                          <span className="text-[#1B254B] font-bold">{item.count} passes</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color}`} style={{ width: `${(item.count / 50) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-6 border-gray-100 shadow-md">
                  <h3 className="text-[#1B254B] font-bold mb-4">Monthly Expenses</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Fuel className="w-5 h-5 text-orange-500" />
                        <span className="text-gray-600">Fuel Costs</span>
                      </div>
                      <span className="text-[#1B254B] font-bold">₹2,45,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bus className="w-5 h-5 text-blue-500" />
                        <span className="text-gray-600">Bus Maintenance</span>
                      </div>
                      <span className="text-[#1B254B] font-bold">₹85,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Plane className="w-5 h-5 text-purple-500" />
                        <span className="text-gray-600">Trip Expenses</span>
                      </div>
                      <span className="text-[#1B254B] font-bold">₹1,20,000</span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-bold">Total Monthly</span>
                        <span className="text-emerald-600 font-bold text-xl">₹4,50,000</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-[#1B254B]">Settings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 border-gray-100 shadow-md">
                  <h3 className="text-[#1B254B] font-bold mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'New Request Alerts', enabled: true },
                      { label: 'Approval Notifications', enabled: true },
                      { label: 'Expiry Reminders', enabled: true },
                      { label: 'Email Notifications', enabled: false }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">{item.label}</span>
                        <button
                          className={`w-12 h-6 rounded-full transition-colors ${item.enabled ? 'bg-[#0B4DA2]' : 'bg-gray-300'}`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${item.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
                <Card className="p-6 border-gray-100 shadow-md">
                  <h3 className="text-[#1B254B] font-bold mb-4">System Settings</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Label className="text-sm text-gray-600">Default Bus Pass Validity</Label>
                      <Select defaultValue="1year">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6months">6 Months</SelectItem>
                          <SelectItem value="1year">1 Year</SelectItem>
                          <SelectItem value="2years">2 Years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <Label className="text-sm text-gray-600">Parking Sticker Validity</Label>
                      <Select defaultValue="1year">
                        <SelectTrigger className="mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6months">6 Months</SelectItem>
                          <SelectItem value="1year">1 Year</SelectItem>
                          <SelectItem value="permanent">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={showBusPassDialog} onOpenChange={setShowBusPassDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Bus Pass</DialogTitle>
            <DialogDescription>Review and approve bus facility pass request</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Employee ID</Label>
              <Input placeholder="SMG-2024-XXX" />
            </div>
            <div className="space-y-2">
              <Label>Route</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="route1">Noida Sector 62 - Plant</SelectItem>
                  <SelectItem value="route2">Greater Noida - Plant</SelectItem>
                  <SelectItem value="route3">Ghaziabad - Plant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pickup Point</Label>
              <Input placeholder="Enter pickup location" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowBusPassDialog(false)}>Cancel</Button>
            <Button onClick={handleApproveBusPass} className="bg-green-600 hover:bg-green-700">
              Approve & Issue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showParkingDialog} onOpenChange={setShowParkingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Parking Sticker</DialogTitle>
            <DialogDescription>Approve and issue new parking sticker</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employee ID</Label>
                <Input placeholder="SMG-2024-XXX" />
              </div>
              <div className="space-y-2">
                <Label>Vehicle Number</Label>
                <Input placeholder="DL 01 AB 1234" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Parking Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select parking type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="covered">Covered Parking</SelectItem>
                  <SelectItem value="open">Open Parking</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sticker Number</Label>
              <Input placeholder="P-XXX" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowParkingDialog(false)}>Cancel</Button>
            <Button onClick={handleApproveParking} className="bg-green-600 hover:bg-green-700">
              Approve & Issue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showTripDialog} onOpenChange={setShowTripDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Approve Trip Request</DialogTitle>
            <DialogDescription>Review and approve trip/tour request</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employee ID</Label>
                <Input placeholder="SMG-2024-XXX" />
              </div>
              <div className="space-y-2">
                <Label>Destination</Label>
                <Input placeholder="Enter destination" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Departure Date</Label>
                <Input type="date" />
              </div>
              <div className="space-y-2">
                <Label>Return Date</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Purpose</Label>
              <Input placeholder="Business purpose" />
            </div>
            <div className="space-y-2">
              <Label>Travel Mode</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select travel mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flight">Flight</SelectItem>
                  <SelectItem value="train">Train</SelectItem>
                  <SelectItem value="car">Car</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowTripDialog(false)}>Cancel</Button>
            <Button onClick={handleApproveTrip} className="bg-green-600 hover:bg-green-700">
              Approve Trip
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}