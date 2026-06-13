import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

interface AppContextType {
  // User Data
  currentUser: any;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;
  
  // Attendance
  isClockedIn: boolean;
  clockInTime: string | null;
  todayHours: string;
  handleClockIn: () => void;
  handleClockOut: () => void;
  attendanceHistory: any[];
  
  // Leave Management
  leaveBalance: any;
  leaveRequests: any[];
  applyLeave: (leave: any) => void;
  cancelLeave: (id: string) => void;
  
  // Requests
  requests: any[];
  addRequest: (request: any) => void;
  updateRequest: (id: string, updates: any) => void;
  deleteRequest: (id: string) => void;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string, reason: string) => void;
  
  // Notifications
  notifications: any[];
  addNotification: (notification: any) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
  
  // Announcements
  announcements: any[];
  addAnnouncement: (announcement: any) => void;
  deleteAnnouncement: (id: string) => void;
  
  // Users (for admin)
  allUsers: any[];
  updateUser: (id: string, updates: any) => void;
  addUser: (user: any) => void;
  deleteUser: (id: string) => void;
  
  // Training
  trainings: any[];
  enrollInTraining: (trainingId: string) => void;
  addTraining: (training: any) => void;
  updateTraining: (id: string, updates: any) => void;
  deleteTraining: (id: string) => void;
  
  // Projects
  projects: any[];
  addProject: (project: any) => void;
  updateProject: (id: string, updates: any) => void;
  deleteProject: (id: string) => void;
  
  // Documents
  documents: any[];
  requestDocument: (docType: string) => void;
  uploadDocument: (document: any) => void;
  deleteDocument: (id: string) => void;
  
  // Canteen
  canteenBalance: string;
  canteenOrders: any[];
  placeCanteenOrder: (order: any) => void;
  addCanteenBalance: (amount: number) => void;
  
  // Guest House
  guestHouseBookings: any[];
  bookGuestHouse: (booking: any) => void;
  cancelGuestHouseBooking: (id: string) => void;
  
  // Transport
  transportRequests: any[];
  requestTransport: (request: any) => void;
  cancelTransportRequest: (id: string) => void;
  
  // Uniform
  uniformRequests: any[];
  requestUniform: (request: any) => void;
  
  // Assets
  myAssets: any[];
  assetRequests: any[];
  requestAsset: (asset: any) => void;
  
  // Payroll
  payslips: any[];
  generatePayslip: (month: string) => void;
  
  // SIM Allocation
  simCards: any[];
  requestSIM: (request: any) => void;
  
  // General Requests
  generalRequests: any[];
  submitGeneralRequest: (request: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const stored = localStorage.getItem('employee_user');
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  });

  // Fetch live data from backend on mount
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    const API = 'http://localhost:5000/api';
    const fetchSafe = async (url: string) => {
      try { const r = await fetch(url); return r.ok ? r.json() : null; } catch { return null; }
    };
    (async () => {
      const [att, lv, gp, pr, tr, doc, proj, ann, notif, dept] = await Promise.all([
        fetchSafe(`${API}/attendance/${userId}`),
        fetchSafe(`${API}/leaves/${userId}`),
        fetchSafe(`${API}/gatepasses/${userId}`),
        fetchSafe(`${API}/payroll/${userId}`),
        fetchSafe(`${API}/trainings`),
        fetchSafe(`${API}/documents/${userId}`),
        fetchSafe(`${API}/projects`),
        fetchSafe(`${API}/announcements`),
        fetchSafe(`${API}/notifications/${userId}`),
        fetchSafe(`${API}/departments`)
      ]);
      if (att) setAttendanceHistory(att.map((a: any, i: number) => ({
        id: a._id || i+1, date: a.date?.split('T')[0], day: new Date(a.date).toLocaleDateString('en-US',{weekday:'long'}),
        checkIn: a.checkIn, checkOut: a.checkOut, hours: a.totalHours ? `${Math.floor(a.totalHours)}h ${Math.round((a.totalHours%1)*60)}m` : '-', status: a.status
      })));
      if (lv) setLeaveRequests(lv.map((l: any) => ({
        id: l._id, type: l.type, startDate: l.from?.split('T')[0], endDate: l.to?.split('T')[0], days: l.days, reason: l.reason, status: l.status, appliedDate: l.createdAt?.split('T')[0]
      })));
      if (pr) setPayslips(pr.map((p: any) => ({
        id: p._id, month: p.month, basicSalary: `₹${p.basicSalary?.toLocaleString('en-IN')}`, hra: `₹${p.hra?.toLocaleString('en-IN')}`, allowances: `₹${p.allowances?.toLocaleString('en-IN')}`,
        deductions: `₹${p.totalDeductions?.toLocaleString('en-IN')}`, netSalary: `₹${p.netSalary?.toLocaleString('en-IN')}`, status: p.status, _id: p._id
      })));
      if (tr) setTrainings(tr.map((t: any) => ({
        id: t._id, title: t.title, type: t.type, dept: t.department, date: t.startDate?.split('T')[0], duration: t.duration,
        enrolled: t.enrolledUsers?.length||0, completed: t.completedUsers?.length||0, capacity: t.capacity, instructor: t.instructor, description: t.description, isEnrolled: false, location: t.location, status: t.status
      })));
      if (doc) setDocuments(doc.map((d: any) => ({
        id: d._id, title: d.title, name: d.title, type: d.fileType||'PDF', category: d.category, size: d.fileSize, uploadDate: d.uploadedAt?.split('T')[0], date: d.uploadedAt?.split('T')[0], status: 'Available'
      })));
      if (proj) setProjects(proj.map((p: any) => ({
        id: p._id, name: p.name, status: p.status, progress: p.progress, dept: p.department, team: p.teamMembers?.length||0, deadline: p.endDate?.split('T')[0], manager: p.manager?.name||'-', budget: p.budget
      })));
      if (ann) setAnnouncements(ann.map((a: any) => ({
        id: a._id, title: a.title, content: a.content, date: a.createdAt?.split('T')[0], author: a.postedBy?.name||'Admin', status: 'Published', type: a.type, priority: a.priority
      })));
      if (notif) setNotifications(notif.map((n: any) => ({
        id: n._id, title: n.title, message: n.message, type: n.type, time: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '-', isRead: n.read, timestamp: new Date(n.createdAt)
      })));
    })();
  }, []);
  
  // Attendance State
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [todayHours, setTodayHours] = useState('0h 0m');
  const [attendanceHistory, setAttendanceHistory] = useState([
    { id: 1, date: '2024-12-11', day: 'Wednesday', checkIn: '09:00 AM', checkOut: '06:15 PM', hours: '9h 15m', status: 'Present' },
    { id: 2, date: '2024-12-10', day: 'Tuesday', checkIn: '08:55 AM', checkOut: '06:00 PM', hours: '9h 5m', status: 'Present' },
    { id: 3, date: '2024-12-09', day: 'Monday', checkIn: '09:10 AM', checkOut: '06:20 PM', hours: '9h 10m', status: 'Present' },
    { id: 4, date: '2024-12-06', day: 'Friday', checkIn: '09:05 AM', checkOut: '06:10 PM', hours: '9h 5m', status: 'Present' },
    { id: 5, date: '2024-12-05', day: 'Thursday', checkIn: '-', checkOut: '-', hours: '-', status: 'Leave' }
  ]);
  
  // Leave Management
  const [leaveBalance, setLeaveBalance] = useState({
    casual: { total: 12, used: 5, remaining: 7 },
    sick: { total: 7, used: 2, remaining: 5 },
    earned: { total: 15, used: 8, remaining: 7 },
    privilege: { total: 10, used: 3, remaining: 7 }
  });
  
  const [leaveRequests, setLeaveRequests] = useState([
    { id: 'LV001', type: 'Casual Leave', startDate: '2024-12-20', endDate: '2024-12-22', days: 3, reason: 'Family function', status: 'Approved', appliedDate: '2024-12-10' },
    { id: 'LV002', type: 'Sick Leave', startDate: '2024-12-15', endDate: '2024-12-15', days: 1, reason: 'Medical checkup', status: 'Pending', appliedDate: '2024-12-12' }
  ]);
  
  // Requests State
  const [requests, setRequests] = useState([
    {
      id: 'REQ001',
      employeeId: 'EMP1001',
      employeeName: 'Rohit Sharma',
      type: 'Leave Request',
      category: 'Casual Leave',
      startDate: '2024-12-20',
      endDate: '2024-12-22',
      days: 3,
      reason: 'Family function',
      status: 'Pending',
      submittedDate: '2024-12-10',
      priority: 'Medium',
      department: 'Assembly'
    },
    {
      id: 'REQ002',
      employeeId: 'EMP1001',
      employeeName: 'Rohit Sharma',
      type: 'Document Request',
      category: 'Experience Certificate',
      reason: 'Personal requirement',
      status: 'Approved',
      submittedDate: '2024-12-05',
      approvedDate: '2024-12-06',
      priority: 'Low',
      department: 'Assembly'
    },
    {
      id: 'REQ003',
      employeeId: 'EMP1025',
      employeeName: 'Priya Sharma',
      type: 'Asset Request',
      category: 'Laptop',
      reason: 'Current laptop outdated',
      status: 'In Progress',
      submittedDate: '2024-12-08',
      priority: 'High',
      department: 'Quality Control'
    }
  ]);
  
  // Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 'NOT001',
      title: 'Leave Request Approved',
      message: 'Your leave request for Dec 15-17 has been approved',
      type: 'success',
      time: '2 hours ago',
      isRead: false,
      timestamp: new Date(Date.now() - 7200000)
    },
    {
      id: 'NOT002',
      title: 'New Training Available',
      message: 'Safety Training Program - Registration open',
      type: 'info',
      time: '5 hours ago',
      isRead: false,
      timestamp: new Date(Date.now() - 18000000)
    },
    {
      id: 'NOT003',
      title: 'Payslip Generated',
      message: 'Your payslip for November 2024 is ready',
      type: 'info',
      time: '1 day ago',
      isRead: true,
      timestamp: new Date(Date.now() - 86400000)
    }
  ]);
  
  // Announcements State
  const [announcements, setAnnouncements] = useState([
    {
      id: 'ANN001',
      title: 'Holiday Announcement - Christmas',
      content: 'Company will remain closed on Dec 25th for Christmas. Wishing everyone happy holidays!',
      date: '2024-12-10',
      author: 'HR Team',
      status: 'Published',
      type: 'Holiday',
      priority: 'High'
    },
    {
      id: 'ANN002',
      title: 'New Work from Home Policy',
      content: 'Updated Work from Home policy is now available on the portal. Please review the new guidelines.',
      date: '2024-12-07',
      author: 'Admin',
      status: 'Published',
      type: 'Policy',
      priority: 'Medium'
    },
    {
      id: 'ANN003',
      title: 'Annual Day Celebration',
      content: 'Save the date! Annual day celebration on Jan 15, 2025. More details to follow.',
      date: '2024-12-05',
      author: 'Events Team',
      status: 'Published',
      type: 'Event',
      priority: 'Medium'
    }
  ]);
  
  // All Users (loaded from API)
  const [allUsers, setAllUsers] = useState<any[]>([]);

  // Load users from API
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await api.getUsers();
        if (Array.isArray(data)) {
          setAllUsers(data.map((u: any) => ({
            id: u._id, name: u.name, empId: u.empId, dept: u.dept,
            role: u.designation || u.role, email: u.email, phone: u.phone,
            status: u.isActive !== false ? 'Active' : 'Inactive',
            joinDate: u.dateOfJoining || '',
            avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=0B4DA2&color=fff`
          })));
        }
      } catch (err) { console.error('Failed to load users:', err); }
    };
    loadUsers();
  }, []);
  
  // Training State
  const [trainings, setTrainings] = useState([
    { 
      id: 'TRN001', 
      title: 'Safety Training Program', 
      type: 'Mandatory', 
      dept: 'Production', 
      date: '2024-12-15', 
      duration: '4 hours', 
      enrolled: 45, 
      completed: 12, 
      capacity: 50,
      instructor: 'Vikram Singh',
      description: 'Comprehensive safety training for production floor',
      isEnrolled: false,
      location: 'Training Hall A',
      status: 'Open'
    },
    { 
      id: 'TRN002', 
      title: 'Quality Control Standards', 
      type: 'Mandatory', 
      dept: 'Quality Control', 
      date: '2024-12-18', 
      duration: '6 hours', 
      enrolled: 25, 
      completed: 25, 
      capacity: 30,
      instructor: 'Priya Sharma',
      description: 'Quality standards and inspection procedures',
      isEnrolled: true,
      location: 'Online',
      status: 'Open'
    },
    { 
      id: 'TRN003', 
      title: 'Advanced Excel Skills', 
      type: 'Optional', 
      dept: 'All', 
      date: '2024-12-20', 
      duration: '8 hours', 
      enrolled: 78, 
      completed: 45, 
      capacity: 100,
      instructor: 'Sneha Gupta',
      description: 'Excel formulas, pivot tables, and data analysis',
      isEnrolled: false,
      location: 'Training Hall B',
      status: 'Open'
    }
  ]);
  
  // Projects State
  const [projects, setProjects] = useState([
    { id: 'PRJ001', name: 'New Scooter Model Development', status: 'On Track', progress: 75, dept: 'R&D', team: 25, deadline: '2025-03-15', manager: 'Vikram Singh', budget: '₹2,50,00,000' },
    { id: 'PRJ002', name: 'Factory Automation Phase 2', status: 'At Risk', progress: 45, dept: 'Production', team: 18, deadline: '2025-01-30', manager: 'Rohit Verma', budget: '₹1,80,00,000' },
    { id: 'PRJ003', name: 'Quality Management System Upgrade', status: 'On Track', progress: 90, dept: 'Quality Control', team: 12, deadline: '2024-12-30', manager: 'Priya Sharma', budget: '₹75,00,000' }
  ]);
  
  // Documents State
  const [documents, setDocuments] = useState([
    { id: 'DOC001', title: 'Employment Contract', name: 'Employment Contract', type: 'PDF', category: 'Contract', size: '245 KB', uploadDate: '2020-01-10', date: '2020-01-10', status: 'Available' },
    { id: 'DOC002', title: 'Pay Slip - November 2024', name: 'Pay Slip - November 2024', type: 'PDF', category: 'Payroll', size: '98 KB', uploadDate: '2024-12-01', date: '2024-12-01', status: 'Available' },
    { id: 'DOC003', title: 'Tax Documents - FY 2023-24', name: 'Tax Documents - FY 2023-24', type: 'PDF', category: 'Tax Documents', size: '210 KB', uploadDate: '2024-04-15', date: '2024-04-15', status: 'Available' },
    { id: 'DOC004', title: 'Performance Review - 2023', name: 'Performance Review - 2023', type: 'PDF', category: 'Review', size: '156 KB', uploadDate: '2024-01-20', date: '2024-01-20', status: 'Available' },
    { id: 'DOC005', title: 'Offer Letter', name: 'Offer Letter', type: 'PDF', category: 'Onboarding', size: '180 KB', uploadDate: '2020-01-10', date: '2020-01-10', status: 'Available' },
    { id: 'DOC006', title: 'ID Proof - Aadhaar', name: 'ID Proof - Aadhaar', type: 'PDF', category: 'Identity', size: '165 KB', uploadDate: '2020-01-12', date: '2020-01-12', status: 'Available' }
  ]);
  
  // Canteen State
  const [canteenBalance, setCanteenBalance] = useState('₹450');
  const [canteenOrders, setCanteenOrders] = useState([
    { id: 'CO001', date: '2024-12-12', items: ['Veg Thali', 'Tea'], amount: '₹85', status: 'Completed' },
    { id: 'CO002', date: '2024-12-11', items: ['Sandwich', 'Coffee'], amount: '₹65', status: 'Completed' }
  ]);
  
  // Guest House State
  const [guestHouseBookings, setGuestHouseBookings] = useState([
    { id: 'GH001', roomType: 'Deluxe Room', checkIn: '2024-12-20', checkOut: '2024-12-22', guests: 2, status: 'Confirmed', amount: '₹3,500' },
    { id: 'GH002', roomType: 'Standard Room', checkIn: '2024-12-15', checkOut: '2024-12-16', guests: 1, status: 'Completed', amount: '₹1,200' }
  ]);
  
  // Transport State
  const [transportRequests, setTransportRequests] = useState([
    { id: 'TR001', from: 'Noida Plant', to: 'Delhi Airport', date: '2024-12-18', time: '10:00 AM', passengers: 2, status: 'Approved', vehicleType: 'Sedan' },
    { id: 'TR002', from: 'Office', to: 'Client Site', date: '2024-12-20', time: '02:00 PM', passengers: 4, status: 'Pending', vehicleType: 'SUV' }
  ]);
  
  // Uniform State
  const [uniformRequests, setUniformRequests] = useState([
    { id: 'UN001', items: [{ item: 'Shirt', size: 'L', quantity: 2 }, { item: 'Pants', size: '32', quantity: 2 }], requestDate: '2024-12-05', status: 'Delivered', deliveryDate: '2024-12-10' },
    { id: 'UN002', items: [{ item: 'Safety Shoes', size: '9', quantity: 1 }], requestDate: '2024-12-12', status: 'Processing', deliveryDate: null }
  ]);
  
  // Assets State
  const [myAssets, setMyAssets] = useState([
    { id: 'AST001', name: 'Dell Latitude 5520', type: 'Laptop', serialNumber: 'DL5520-2024-042', assignedDate: '2020-01-15', status: 'Good', condition: 'Good' },
    { id: 'AST002', name: 'iPhone 13 Pro', type: 'Mobile', serialNumber: 'IP13P-2023-156', assignedDate: '2023-03-20', status: 'Excellent', condition: 'Excellent' },
    { id: 'AST003', name: 'Dell Monitor 24"', type: 'Monitor', serialNumber: 'DM24-2020-089', assignedDate: '2020-01-15', status: 'Good', condition: 'Good' },
    { id: 'AST004', name: 'Logitech MX Keys', type: 'Keyboard', serialNumber: 'LMX-2021-234', assignedDate: '2021-06-10', status: 'Fair', condition: 'Fair' }
  ]);
  
  const [assetRequests, setAssetRequests] = useState([
    { id: 'AR001', assetType: 'Laptop', reason: 'Current laptop is outdated', status: 'In Progress', requestDate: '2024-12-08', priority: 'High' },
    { id: 'AR002', assetType: 'Headset', reason: 'Required for calls', status: 'Approved', requestDate: '2024-12-05', priority: 'Medium' }
  ]);
  
  // Payroll State
  const [payslips, setPayslips] = useState([
    { id: 'PS001', month: 'November 2024', basicSalary: '₹35,000', hra: '₹12,000', allowances: '₹8,000', deductions: '₹5,500', netSalary: '₹49,500', status: 'Available' },
    { id: 'PS002', month: 'October 2024', basicSalary: '₹35,000', hra: '₹12,000', allowances: '₹8,000', deductions: '₹5,200', netSalary: '₹49,800', status: 'Available' }
  ]);
  
  // SIM Cards State
  const [simCards, setSimCards] = useState([
    { id: 'SIM001', number: '+91 98765 99999', carrier: 'Airtel', plan: 'Corporate Plan - Unlimited', status: 'Active', assignedDate: '2020-02-01' }
  ]);
  
  // General Requests State
  const [generalRequests, setGeneralRequests] = useState([
    { id: 'GR001', subject: 'Parking Space Request', description: 'Need parking space for new vehicle', status: 'Pending', submittedDate: '2024-12-10', category: 'Facility' },
    { id: 'GR002', subject: 'ID Card Replacement', description: 'Lost ID card, need replacement', status: 'Approved', submittedDate: '2024-12-05', category: 'Administration' }
  ]);
  
  // Clock In/Out Handlers
  const handleClockIn = () => {
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    setClockInTime(currentTime);
    setIsClockedIn(true);
    
    addNotification({
      title: 'Clocked In Successfully',
      message: `You clocked in at ${currentTime}`,
      type: 'success',
      time: 'Just now'
    });
  };
  
  const handleClockOut = () => {
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
    setClockOutTime(currentTime);
    
    if (clockInTime) {
      const hours = 9;
      const minutes = Math.floor(Math.random() * 60);
      const hoursWorked = `${hours}h ${minutes}m`;
      setTodayHours(hoursWorked);
      
      const today = new Date();
      const newAttendance = {
        id: attendanceHistory.length + 1,
        date: today.toISOString().split('T')[0],
        day: today.toLocaleDateString('en-US', { weekday: 'long' }),
        checkIn: clockInTime,
        checkOut: currentTime,
        hours: hoursWorked,
        status: 'Present'
      };
      setAttendanceHistory([newAttendance, ...attendanceHistory]);
      
      addNotification({
        title: 'Clocked Out Successfully',
        message: `You clocked out at ${currentTime}. Total hours: ${hoursWorked}`,
        type: 'success',
        time: 'Just now'
      });
    }
    
    setIsClockedIn(false);
    setTimeout(() => {
      setClockInTime(null);
      setClockOutTime(null);
    }, 3000);
  };
  
  // Leave Management Handlers
  const applyLeave = (leave) => {
    const newLeave = {
      ...leave,
      id: `LV${String(leaveRequests.length + 1).padStart(3, '0')}`,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setLeaveRequests([newLeave, ...leaveRequests]);
    
    // Also add to requests
    addRequest({
      type: 'Leave Request',
      category: leave.type,
      startDate: leave.startDate,
      endDate: leave.endDate,
      days: leave.days,
      reason: leave.reason,
      priority: 'Medium'
    });
    
    addNotification({
      title: 'Leave Application Submitted',
      message: `Your ${leave.type} application has been submitted`,
      type: 'success',
      time: 'Just now'
    });
  };
  
  const cancelLeave = (id) => {
    setLeaveRequests(leaveRequests.filter(leave => leave.id !== id));
    
    addNotification({
      title: 'Leave Request Cancelled',
      message: 'Your leave request has been cancelled',
      type: 'info',
      time: 'Just now'
    });
  };
  
  // Request Handlers
  const addRequest = (request) => {
    const newRequest = {
      ...request,
      id: `REQ${String(requests.length + 1).padStart(3, '0')}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      department: currentUser.department,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setRequests([newRequest, ...requests]);
    
    addNotification({
      title: 'Request Submitted',
      message: `Your ${request.type} has been submitted successfully`,
      type: 'success',
      time: 'Just now'
    });
  };
  
  const updateRequest = (id, updates) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, ...updates } : req
    ));
    
    if (updates.status) {
      addNotification({
        title: `Request ${updates.status}`,
        message: `Your request has been ${updates.status.toLowerCase()}`,
        type: updates.status === 'Approved' ? 'success' : updates.status === 'Rejected' ? 'error' : 'info',
        time: 'Just now'
      });
    }
  };
  
  const deleteRequest = (id) => {
    setRequests(requests.filter(req => req.id !== id));
    
    addNotification({
      title: 'Request Deleted',
      message: 'Your request has been deleted',
      type: 'info',
      time: 'Just now'
    });
  };
  
  const approveRequest = (id) => {
    updateRequest(id, { 
      status: 'Approved', 
      approvedDate: new Date().toISOString().split('T')[0] 
    });
  };
  
  const rejectRequest = (id, reason) => {
    updateRequest(id, { 
      status: 'Rejected', 
      rejectedDate: new Date().toISOString().split('T')[0],
      rejectionReason: reason
    });
  };
  
  // Notification Handlers
  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: `NOT${String(notifications.length + 1).padStart(3, '0')}`,
      isRead: false,
      timestamp: new Date()
    };
    setNotifications([newNotification, ...notifications]);
  };
  
  const markNotificationAsRead = (id) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };
  
  // Announcement Handlers
  const addAnnouncement = (announcement) => {
    const newAnnouncement = {
      ...announcement,
      id: `ANN${String(announcements.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      author: isAdmin ? 'Admin' : currentUser.name,
      status: 'Published'
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    
    addNotification({
      title: 'New Announcement',
      message: announcement.title,
      type: 'info',
      time: 'Just now'
    });
  };
  
  const deleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter(ann => ann.id !== id));
  };
  
  // User Management Handlers
  const updateUser = (id, updates) => {
    setAllUsers(allUsers.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
  };
  
  const addUser = (user) => {
    const newUser = {
      ...user,
      id: `EMP${String(allUsers.length + 1001)}`,
      empId: `SMG-${new Date().getFullYear()}-${String(allUsers.length + 1).padStart(3, '0')}`,
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
    };
    setAllUsers([...allUsers, newUser]);
    
    addNotification({
      title: 'New User Added',
      message: `${user.name} has been added to the system`,
      type: 'success',
      time: 'Just now'
    });
  };
  
  const deleteUser = (id) => {
    setAllUsers(allUsers.filter(user => user.id !== id));
  };
  
  // Training Handlers
  const enrollInTraining = (trainingId) => {
    setTrainings(trainings.map(training => 
      training.id === trainingId 
        ? { ...training, enrolled: training.enrolled + 1, isEnrolled: true }
        : training
    ));
    
    addNotification({
      title: 'Training Enrollment Successful',
      message: 'You have been enrolled in the training program',
      type: 'success',
      time: 'Just now'
    });
  };
  
  const addTraining = (training) => {
    const newTraining = {
      ...training,
      id: `TRN${String(trainings.length + 1).padStart(3, '0')}`,
      enrolled: 0,
      completed: 0,
      isEnrolled: false,
      status: 'Open'
    };
    setTrainings([...trainings, newTraining]);
  };
  
  const updateTraining = (id, updates) => {
    setTrainings(trainings.map(training => 
      training.id === id ? { ...training, ...updates } : training
    ));
  };
  
  const deleteTraining = (id) => {
    setTrainings(trainings.filter(training => training.id !== id));
  };
  
  // Project Handlers
  const addProject = (project) => {
    const newProject = {
      ...project,
      id: `PRJ${String(projects.length + 1).padStart(3, '0')}`,
      progress: 0,
      status: 'Planning'
    };
    setProjects([...projects, newProject]);
  };
  
  const updateProject = (id, updates) => {
    setProjects(projects.map(project => 
      project.id === id ? { ...project, ...updates } : project
    ));
  };
  
  const deleteProject = (id) => {
    setProjects(projects.filter(project => project.id !== id));
  };
  
  // Document Handlers
  const requestDocument = (docType) => {
    addRequest({
      type: 'Document Request',
      category: docType,
      reason: 'Required for personal use',
      priority: 'Medium'
    });
  };
  
  const uploadDocument = (document) => {
    const newDocument = {
      ...document,
      id: `DOC${String(documents.length + 1).padStart(3, '0')}`,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Available'
    };
    setDocuments([...documents, newDocument]);
  };
  
  const deleteDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };
  
  // Canteen Handlers
  const placeCanteenOrder = (order) => {
    const newOrder = {
      ...order,
      id: `CO${String(canteenOrders.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setCanteenOrders([newOrder, ...canteenOrders]);
    
    // Deduct from balance
    const currentBalance = parseInt(canteenBalance.replace(/[₹,]/g, ''));
    const orderAmount = parseInt(order.amount.replace(/[₹,]/g, ''));
    setCanteenBalance(`₹${currentBalance - orderAmount}`);
    
    addNotification({
      title: 'Order Placed',
      message: `Your canteen order has been placed successfully`,
      type: 'success',
      time: 'Just now'
    });
  };
  
  const addCanteenBalance = (amount) => {
    const currentBalance = parseInt(canteenBalance.replace(/[₹,]/g, ''));
    setCanteenBalance(`₹${currentBalance + amount}`);
    
    addNotification({
      title: 'Balance Added',
      message: `₹${amount} has been added to your canteen wallet`,
      type: 'success',
      time: 'Just now'
    });
  };
  
  // Guest House Handlers
  const bookGuestHouse = (booking) => {
    const newBooking = {
      ...booking,
      id: `GH${String(guestHouseBookings.length + 1).padStart(3, '0')}`,
      status: 'Confirmed'
    };
    setGuestHouseBookings([newBooking, ...guestHouseBookings]);
    
    addNotification({
      title: 'Booking Confirmed',
      message: `Your guest house booking has been confirmed`,
      type: 'success',
      time: 'Just now'
    });
  };
  
  const cancelGuestHouseBooking = (id) => {
    setGuestHouseBookings(guestHouseBookings.map(booking =>
      booking.id === id ? { ...booking, status: 'Cancelled' } : booking
    ));
    
    addNotification({
      title: 'Booking Cancelled',
      message: 'Your guest house booking has been cancelled',
      type: 'info',
      time: 'Just now'
    });
  };
  
  // Transport Handlers
  const requestTransport = (request) => {
    const newRequest = {
      ...request,
      id: `TR${String(transportRequests.length + 1).padStart(3, '0')}`,
      status: 'Pending'
    };
    setTransportRequests([newRequest, ...transportRequests]);
    
    addNotification({
      title: 'Transport Request Submitted',
      message: 'Your transport request has been submitted',
      type: 'success',
      time: 'Just now'
    });
  };
  
  const cancelTransportRequest = (id) => {
    setTransportRequests(transportRequests.map(req =>
      req.id === id ? { ...req, status: 'Cancelled' } : req
    ));
  };
  
  // Uniform Handlers
  const requestUniform = (request) => {
    const newRequest = {
      ...request,
      id: `UN${String(uniformRequests.length + 1).padStart(3, '0')}`,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Processing',
      deliveryDate: null
    };
    setUniformRequests([newRequest, ...uniformRequests]);
    
    addNotification({
      title: 'Uniform Request Submitted',
      message: 'Your uniform request has been submitted',
      type: 'success',
      time: 'Just now'
    });
  };
  
  // Asset Handlers
  const requestAsset = (asset) => {
    const newRequest = {
      ...asset,
      id: `AR${String(assetRequests.length + 1).padStart(3, '0')}`,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setAssetRequests([newRequest, ...assetRequests]);
    
    addRequest({
      type: 'Asset Request',
      category: asset.assetType,
      reason: asset.reason,
      priority: asset.priority || 'Medium'
    });
  };
  
  // Payroll Handlers
  const generatePayslip = (month) => {
    const newPayslip = {
      id: `PS${String(payslips.length + 1).padStart(3, '0')}`,
      month: month,
      basicSalary: '₹35,000',
      hra: '₹12,000',
      allowances: '₹8,000',
      deductions: '₹5,500',
      netSalary: '₹49,500',
      status: 'Available'
    };
    setPayslips([newPayslip, ...payslips]);
  };
  
  // SIM Handlers
  const requestSIM = (request) => {
    addRequest({
      type: 'SIM Card Request',
      category: request.carrier || 'Corporate SIM',
      reason: request.reason,
      priority: 'Medium'
    });
  };
  
  // General Request Handlers
  const submitGeneralRequest = (request) => {
    const newRequest = {
      ...request,
      id: `GR${String(generalRequests.length + 1).padStart(3, '0')}`,
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    setGeneralRequests([newRequest, ...generalRequests]);
    
    addRequest({
      type: 'General Request',
      category: request.category,
      reason: request.description,
      priority: request.priority || 'Medium'
    });
  };
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const value = {
    currentUser,
    isAdmin,
    setIsAdmin,
    isClockedIn,
    clockInTime,
    todayHours,
    handleClockIn,
    handleClockOut,
    attendanceHistory,
    leaveBalance,
    leaveRequests,
    applyLeave,
    cancelLeave,
    requests,
    addRequest,
    updateRequest,
    deleteRequest,
    approveRequest,
    rejectRequest,
    notifications,
    addNotification,
    markNotificationAsRead,
    clearAllNotifications,
    unreadCount,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    allUsers,
    updateUser,
    addUser,
    deleteUser,
    trainings,
    enrollInTraining,
    addTraining,
    updateTraining,
    deleteTraining,
    projects,
    addProject,
    updateProject,
    deleteProject,
    documents,
    requestDocument,
    uploadDocument,
    deleteDocument,
    canteenBalance,
    canteenOrders,
    placeCanteenOrder,
    addCanteenBalance,
    guestHouseBookings,
    bookGuestHouse,
    cancelGuestHouseBooking,
    transportRequests,
    requestTransport,
    cancelTransportRequest,
    uniformRequests,
    requestUniform,
    myAssets,
    assetRequests,
    requestAsset,
    payslips,
    generatePayslip,
    simCards,
    requestSIM,
    generalRequests,
    submitGeneralRequest
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
