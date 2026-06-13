import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Home,
  Plus,
  CheckCircle,
  XCircle,
  Search,
  Download,
  Eye,
  Bell,
  User,
  Settings,
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
  Calendar,
  IndianRupee,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Building
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { toast } from 'sonner@2.0.3';

import { generateGenericListPDF } from '../../utils/pdfExport';

import logo from 'figma:asset/7ef5cbbf7f7fd6bbcf30128158bd641f40437597.png';

// Get dynamic greeting based on time
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

interface GuesthouseBooking {
  id: string;
  guestName: string;
  company: string;
  designation: string;
  phone: string;
  email: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  roomType: string;
  requestedBy: string;
  department: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'checked-in' | 'checked-out';
  approvedBy?: string;
  approvalDate?: string;
  roomNumber?: string;
  totalAmount?: number;
}

interface Room {
  id: string;
  roomNumber: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  amenities: string[];
  status: 'available' | 'occupied' | 'maintenance';
  currentGuest?: string;
}

export function GuesthousePortal() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewBookingDialog, setShowNewBookingDialog] = useState(false);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<GuesthouseBooking | null>(null);
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

  const [bookings, setBookings] = useState<GuesthouseBooking[]>([
    {
      id: 'GH001',
      guestName: 'Mr. Anil Kapoor',
      company: 'Global Manufacturing Ltd',
      designation: 'CEO',
      phone: '+91 98765 11111',
      email: 'anil@globalmanuf.com',
      checkInDate: '2024-12-20',
      checkOutDate: '2024-12-22',
      numberOfGuests: 2,
      roomType: 'Deluxe Suite',
      requestedBy: 'Suresh Kumar (MD)',
      department: 'Management',
      purpose: 'Business Partnership Discussion',
      status: 'pending'
    },
    {
      id: 'GH002',
      guestName: 'Ms. Meera Patel',
      company: 'Tech Innovations Inc',
      designation: 'Director - Operations',
      phone: '+91 98765 22222',
      email: 'meera@techinnovations.com',
      checkInDate: '2024-12-21',
      checkOutDate: '2024-12-23',
      numberOfGuests: 1,
      roomType: 'Executive Room',
      requestedBy: 'Ramesh Singh (IT HOD)',
      department: 'IT',
      purpose: 'Technology Infrastructure Review',
      status: 'approved',
      approvedBy: 'Admin Manager',
      approvalDate: '2024-12-18',
      roomNumber: '101',
      totalAmount: 6000
    },
    {
      id: 'GH003',
      guestName: 'Mr. Vikram Singh',
      company: 'ABC Industries',
      designation: 'General Manager',
      phone: '+91 98765 33333',
      email: 'vikram@abcindustries.com',
      checkInDate: '2024-12-15',
      checkOutDate: '2024-12-17',
      numberOfGuests: 3,
      roomType: 'Family Suite',
      requestedBy: 'Anjali Desai (CFO)',
      department: 'Finance',
      purpose: 'Financial Audit and Review',
      status: 'checked-out',
      approvedBy: 'Admin Manager',
      approvalDate: '2024-12-14',
      roomNumber: '205',
      totalAmount: 12000
    }
  ]);

  const [rooms, setRooms] = useState<Room[]>([
    {
      id: 'R001',
      roomNumber: '101',
      roomType: 'Executive Room',
      capacity: 2,
      pricePerNight: 3000,
      amenities: ['AC', 'TV', 'WiFi', 'Mini Fridge', 'Attached Bathroom'],
      status: 'occupied',
      currentGuest: 'Ms. Meera Patel'
    },
    {
      id: 'R002',
      roomNumber: '102',
      roomType: 'Executive Room',
      capacity: 2,
      pricePerNight: 3000,
      amenities: ['AC', 'TV', 'WiFi', 'Mini Fridge', 'Attached Bathroom'],
      status: 'available'
    },
    {
      id: 'R003',
      roomNumber: '201',
      roomType: 'Deluxe Suite',
      capacity: 3,
      pricePerNight: 5000,
      amenities: ['AC', 'TV', 'WiFi', 'Mini Fridge', 'Sofa', 'Work Desk', 'Attached Bathroom'],
      status: 'available'
    },
    {
      id: 'R004',
      roomNumber: '202',
      roomType: 'Deluxe Suite',
      capacity: 3,
      pricePerNight: 5000,
      amenities: ['AC', 'TV', 'WiFi', 'Mini Fridge', 'Sofa', 'Work Desk', 'Attached Bathroom'],
      status: 'maintenance'
    },
    {
      id: 'R005',
      roomNumber: '205',
      roomType: 'Family Suite',
      capacity: 4,
      pricePerNight: 6000,
      amenities: ['AC', 'TV', 'WiFi', 'Mini Fridge', 'Dining Area', 'Two Bedrooms', 'Two Bathrooms'],
      status: 'available'
    },
    {
      id: 'R006',
      roomNumber: '301',
      roomType: 'Standard Room',
      capacity: 2,
      pricePerNight: 2000,
      amenities: ['AC', 'TV', 'WiFi', 'Attached Bathroom'],
      status: 'available'
    }
  ]);

  const notifications = [
    {
      id: 'N001',
      type: 'booking',
      message: 'New booking request from Management for Mr. Anil Kapoor',
      time: '15 mins ago',
      read: false,
      priority: 'high'
    },
    {
      id: 'N002',
      type: 'alert',
      message: 'Room 202 under maintenance - Expected completion: Dec 25',
      time: '1 hour ago',
      read: false,
      priority: 'medium'
    },
    {
      id: 'N003',
      type: 'info',
      message: 'Guest checkout reminder: Mr. Vikram Singh - Room 205',
      time: '3 hours ago',
      read: true,
      priority: 'low'
    }
  ];

  const guesthouseProfile = {
    name: 'SMG Guest House',
    email: 'guesthouse@smg.com',
    phone: '+91 120 1234567',
    extension: 'Ext: 500',
    address: 'SMG Campus, Sector 10, Noida',
    totalRooms: rooms.length,
    availableRooms: rooms.filter(r => r.status === 'available').length,
    occupiedRooms: rooms.filter(r => r.status === 'occupied').length,
    pendingBookings: bookings.filter(b => b.status === 'pending').length,
    monthlyRevenue: 145000
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

  const handleApproveBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? {
          ...b,
          status: 'approved' as const,
          approvedBy: 'Admin Manager',
          approvalDate: new Date().toISOString().split('T')[0],
          totalAmount: 5000 // Calculated amount
        } : b
      )
    );
    toast.success('Guest house booking approved successfully');
  };

  const handleRejectBooking = (bookingId: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, status: 'rejected' as const } : b
      )
    );
    toast.error('Guest house booking rejected');
  };

  const handleCheckIn = (bookingId: string, roomNumber: string) => {
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, status: 'checked-in' as const, roomNumber } : b
      )
    );
    setRooms(prev =>
      prev.map(r =>
        r.roomNumber === roomNumber ? { ...r, status: 'occupied' as const } : r
      )
    );
    toast.success(`Guest checked in to Room ${roomNumber}`);
  };

  const handleCheckOut = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking?.roomNumber) {
      setRooms(prev =>
        prev.map(r =>
          r.roomNumber === booking.roomNumber ? { ...r, status: 'available' as const, currentGuest: undefined } : r
        )
      );
    }
    setBookings(prev =>
      prev.map(b =>
        b.id === bookingId ? { ...b, status: 'checked-out' as const } : b
      )
    );
    toast.success('Guest checked out successfully');
  };

  const handleViewDetails = (booking: GuesthouseBooking) => {
    setSelectedBooking(booking);
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
    { icon: Clock, label: 'Pending Bookings', value: 'bookings' },
    { icon: Building, label: 'Rooms', value: 'rooms' },
    { icon: Activity, label: 'Active Guests', value: 'active' },
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
        <div className="p-6 border-b border-gray-200">
          {!sidebarCollapsed ? (
            <div className="flex flex-col gap-3">
              <img src={logo} alt="SMG Logo" className="w-full h-auto" />
              <div className="text-center">
                <h2 className="text-[#1B254B] font-bold">P&A (Guest House) Portal</h2>
                <p className="text-xs text-gray-500">Booking Management</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <img src={logo} alt="SMG" className="w-10 h-10 object-contain" />
            </div>
          )}
        </div>

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
        <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#1B254B]">{greeting}, Guest House 👋</h1>
              <p className="text-sm text-gray-500 mt-1">Guest house bookings & room management</p>
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
              onClick={() => setShowNewBookingDialog(true)}
              className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90 shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Booking Request
            </Button>
            <Button
              onClick={() => setShowCheckInDialog(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 shadow-lg shadow-emerald-500/30"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Check-In Guest
            </Button>
            <Button
              variant="outline"
              className="border-gray-200 hover:bg-gray-50"
              onClick={() => toast.info('Generating guest house report...')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Building}
              label="Total Rooms"
              value={guesthouseProfile.totalRooms.toString()}
              subtext="All room types"
              change={0}
              colorClass="bg-gradient-to-br from-[#0B4DA2] to-[#042A5B]"
              onClick={() => setActiveTab('rooms')}
            />
            <StatCard
              icon={Home}
              label="Available Rooms"
              value={guesthouseProfile.availableRooms.toString()}
              subtext="Ready for booking"
              change={-12}
              colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
              onClick={() => setActiveTab('rooms')}
            />
            <StatCard
              icon={Clock}
              label="Pending Bookings"
              value={guesthouseProfile.pendingBookings.toString()}
              subtext="Awaiting approval"
              change={8}
              colorClass="bg-gradient-to-br from-purple-500 to-purple-600"
              onClick={() => setActiveTab('bookings')}
            />
            <StatCard
              icon={IndianRupee}
              label="Monthly Revenue"
              value={`₹${guesthouseProfile.monthlyRevenue.toLocaleString()}`}
              subtext="This month"
              change={15}
              colorClass="bg-gradient-to-br from-orange-500 to-orange-600"
              onClick={() => setActiveTab('analytics')}
            />
          </div>

          {/* Content Tabs */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="p-6 border-gray-100 shadow-md">
                  <h3 className="text-[#1B254B] font-bold text-lg mb-4">Recent Bookings</h3>
                  <div className="space-y-3">
                    {bookings.slice(0, 5).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                        onClick={() => handleViewDetails(booking)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center text-xs font-bold">
                            {booking.guestName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1B254B]">{booking.guestName}</p>
                            <p className="text-xs text-gray-500">{booking.company} • {booking.roomType}</p>
                          </div>
                        </div>
                        <Badge variant={
                          booking.status === 'approved' || booking.status === 'checked-in' ? 'default' :
                            booking.status === 'pending' ? 'secondary' :
                              booking.status === 'checked-out' ? 'outline' :
                                'destructive'
                        } className="text-xs">
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
              <div>
                <Card className="p-6 border-gray-100 shadow-md">
                  <h3 className="text-[#1B254B] font-bold mb-4">Room Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Available</span>
                      <span className="text-emerald-600 font-bold">{guesthouseProfile.availableRooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Occupied</span>
                      <span className="text-blue-600 font-bold">{guesthouseProfile.occupiedRooms}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Maintenance</span>
                      <span className="text-orange-600 font-bold">{rooms.filter(r => r.status === 'maintenance').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Total Rooms</span>
                      <span className="text-[#1B254B] font-bold">{guesthouseProfile.totalRooms}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1B254B]">Guest House Bookings</h2>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px] bg-white border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bookings</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {bookings.map((booking) => (
                <Card key={booking.id} className="p-6 border-gray-100 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center font-bold">
                          {booking.guestName.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[#1B254B] font-bold">{booking.guestName}</h4>
                            <Badge variant="outline" className={`text-xs ${booking.status === 'approved' || booking.status === 'checked-in' ? 'bg-emerald-50 text-emerald-600' :
                                booking.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                  booking.status === 'checked-out' ? 'bg-gray-50 text-gray-600' :
                                    'bg-yellow-50 text-yellow-600'
                              }`}>
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{booking.designation} at {booking.company}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Check-In</p>
                          <p className="text-sm text-[#1B254B] font-bold">{booking.checkInDate}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Check-Out</p>
                          <p className="text-sm text-[#1B254B] font-bold">{booking.checkOutDate}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Room Type</p>
                          <p className="text-sm text-[#1B254B] font-bold">{booking.roomType}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Guests</p>
                          <p className="text-sm text-[#1B254B] font-bold">{booking.numberOfGuests}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                        <p className="text-xs text-gray-600 mb-1 font-bold uppercase tracking-wide">Purpose of Visit</p>
                        <p className="text-sm text-[#1B254B]">{booking.purpose}</p>
                      </div>

                      {booking.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleApproveBooking(booking.id)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Approve Booking
                          </Button>
                          <Button
                            onClick={() => handleRejectBooking(booking.id)}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {booking.status === 'checked-in' && (
                        <Button
                          onClick={() => handleCheckOut(booking.id)}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Check Out Guest
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#1B254B]">Room Management</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search rooms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80 border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <Card key={room.id} className={`p-6 border-gray-100 hover:shadow-lg transition-all ${room.status === 'occupied' ? 'border-blue-200 bg-blue-50/30' :
                      room.status === 'maintenance' ? 'border-orange-200 bg-orange-50/30' :
                        'border-emerald-200 bg-emerald-50/30'
                    }`}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-[#1B254B] font-bold text-lg">Room {room.roomNumber}</h4>
                        <p className="text-sm text-gray-500">{room.roomType}</p>
                      </div>
                      <Badge variant="outline" className={`${room.status === 'available' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                          room.status === 'occupied' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                            'bg-orange-50 text-orange-600 border-orange-200'
                        }`}>
                        {room.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Capacity</span>
                        <span className="text-[#1B254B] font-bold">{room.capacity} persons</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Price/Night</span>
                        <span className="text-emerald-600 font-bold">₹{room.pricePerNight.toLocaleString()}</span>
                      </div>
                      {room.currentGuest && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Current Guest</span>
                          <span className="text-blue-600 font-bold text-xs">{room.currentGuest}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-gray-50 rounded-lg mb-4">
                      <p className="text-xs text-gray-600 mb-2 font-bold uppercase tracking-wide">Amenities</p>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map((amenity, idx) => (
                          <span key={idx} className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-700">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={showNewBookingDialog} onOpenChange={setShowNewBookingDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Guest House Booking</DialogTitle>
            <DialogDescription>
              Submit a new booking request for a guest
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            toast.success('Booking request submitted successfully');
            setShowNewBookingDialog(false);
          }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guestName">Guest Name</Label>
                <Input id="guestName" name="guestName" required />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" name="company" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="checkInDate">Check-In Date</Label>
                <Input id="checkInDate" name="checkInDate" type="date" required />
              </div>
              <div>
                <Label htmlFor="checkOutDate">Check-Out Date</Label>
                <Input id="checkOutDate" name="checkOutDate" type="date" required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numberOfGuests">Number of Guests</Label>
                <Input id="numberOfGuests" name="numberOfGuests" type="number" min="1" required />
              </div>
              <div>
                <Label htmlFor="roomType">Room Type</Label>
                <Select name="roomType" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard Room">Standard Room</SelectItem>
                    <SelectItem value="Executive Room">Executive Room</SelectItem>
                    <SelectItem value="Deluxe Suite">Deluxe Suite</SelectItem>
                    <SelectItem value="Family Suite">Family Suite</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="purpose">Purpose of Visit</Label>
              <Textarea id="purpose" name="purpose" rows={3} required />
            </div>
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => setShowNewBookingDialog(false)}>
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

      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guest House Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Guest House Name</Label>
              <p className="text-[#1B254B] font-bold">{guesthouseProfile.name}</p>
            </div>
            <div>
              <Label>Email</Label>
              <p className="text-[#1B254B]">{guesthouseProfile.email}</p>
            </div>
            <div>
              <Label>Phone</Label>
              <p className="text-[#1B254B]">{guesthouseProfile.phone}</p>
            </div>
            <div>
              <Label>Address</Label>
              <p className="text-[#1B254B]">{guesthouseProfile.address}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                <p className="text-sm text-[#1B254B]">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
