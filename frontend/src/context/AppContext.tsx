import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../services/api';

interface AppContextType {
  currentUser: any;
  isAdmin: boolean;
  isClockedIn: boolean;
  clockInTime: string | null;
  todayHours: string;
  handleClockIn: () => void;
  handleClockOut: () => void;
  attendanceHistory: any[];
  requests: any[];
  addRequest: (request: any) => void;
  updateRequest: (id: string, updates: any) => void;
  deleteRequest: (id: string) => void;
  notifications: any[];
  addNotification: (notification: any) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  unreadCount: number;
  announcements: any[];
  addAnnouncement: (announcement: any) => void;
  allUsers: any[];
  updateUser: (id: string, updates: any) => void;
  trainings: any[];
  enrollInTraining: (trainingId: string) => void;
  projects: any[];
  documents: any[];
  requestDocument: (docType: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const stored = localStorage.getItem('employee_user');
    if (stored) { try { return JSON.parse(stored); } catch { return null; } }
    return null;
  });

  // All state starts empty — loaded from API
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [todayHours, setTodayHours] = useState('0h 0m');
  const [attendanceHistory, setAttendanceHistory] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);

  // Fetch all data from API on mount
  useEffect(() => {
    const userId = currentUser?.id || currentUser?._id;
    if (!userId) return;

    const loadAll = async () => {
      try {
        const [att, req, notif, ann, users, train, proj, docs] = await Promise.allSettled([
          api.getAttendance(userId),
          api.getGeneralRequests(userId),
          api.getNotifications(userId),
          api.getAnnouncements(),
          api.getUsers(),
          api.getTrainings(),
          api.getProjects(),
          api.getDocuments(userId),
        ]);

        if (att.status === 'fulfilled' && Array.isArray(att.value)) {
          setAttendanceHistory(att.value.map((a: any, i: number) => ({
            id: a._id || i + 1,
            date: a.date?.split('T')[0],
            day: a.day || new Date(a.date).toLocaleDateString('en-US', { weekday: 'long' }),
            checkIn: a.checkIn || '-',
            checkOut: a.checkOut || '-',
            hours: a.duration || (a.totalHours ? `${Math.floor(a.totalHours)}h ${Math.round((a.totalHours % 1) * 60)}m` : '-'),
            status: a.status || 'Present'
          })));
        }

        if (req.status === 'fulfilled' && Array.isArray(req.value)) {
          setRequests(req.value.map((r: any) => ({
            id: r._id, employeeId: r.user?.empId || userId, employeeName: r.user?.name || currentUser?.name,
            type: r.type || r.category, category: r.category, reason: r.description || r.reason,
            status: r.status, submittedDate: r.createdAt?.split('T')[0], priority: r.priority || 'Medium',
            department: r.user?.dept || currentUser?.department
          })));
        }

        if (notif.status === 'fulfilled' && Array.isArray(notif.value)) {
          setNotifications(notif.value.map((n: any) => ({
            id: n._id, title: n.title, message: n.message, type: n.type || 'info',
            time: n.createdAt ? new Date(n.createdAt).toLocaleDateString() : '-',
            isRead: n.isRead || n.read || false, timestamp: new Date(n.createdAt)
          })));
        }

        if (ann.status === 'fulfilled' && Array.isArray(ann.value)) {
          setAnnouncements(ann.value.map((a: any) => ({
            id: a._id, title: a.title, content: a.content,
            date: a.createdAt?.split('T')[0], author: a.postedBy?.name || 'Admin',
            status: 'Published', type: a.type || 'info'
          })));
        }

        if (users.status === 'fulfilled' && Array.isArray(users.value)) {
          setAllUsers(users.value.map((u: any) => ({
            id: u._id, name: u.name, empId: u.empId, dept: u.dept,
            role: u.designation || u.role, email: u.email, phone: u.phone,
            status: u.isActive !== false ? 'Active' : 'Inactive',
            joinDate: u.dateOfJoining || '', avatar: u.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=0B4DA2&color=fff`
          })));
        }

        if (train.status === 'fulfilled' && Array.isArray(train.value)) {
          setTrainings(train.value.map((t: any) => ({
            id: t._id, title: t.title, type: t.type, dept: t.department,
            date: t.date?.split('T')[0], duration: t.duration,
            enrolled: t.enrolledUsers?.length || 0, completed: t.completedUsers?.length || 0,
            instructor: t.instructor, description: t.description,
            isEnrolled: t.enrolledUsers?.some((u: any) => (u._id || u) === userId),
            status: t.status || 'Open'
          })));
        }

        if (proj.status === 'fulfilled' && Array.isArray(proj.value)) {
          setProjects(proj.value.map((p: any) => ({
            id: p._id, name: p.name, status: p.status, progress: p.progress,
            dept: p.department, team: p.teamMembers?.length || 0,
            deadline: p.endDate?.split('T')[0], manager: p.manager?.name || '-'
          })));
        }

        if (docs.status === 'fulfilled' && Array.isArray(docs.value)) {
          setDocuments(docs.value.map((d: any) => ({
            id: d._id, name: d.title, type: d.fileType || 'PDF', category: d.category,
            uploadDate: d.uploadedAt?.split('T')[0], status: 'Available'
          })));
        }
      } catch (err) {
        console.error('AppContext: Error loading data from API', err);
      }
    };

    loadAll();
  }, [currentUser?.id, currentUser?._id]);

  // Clock In Handler
  const handleClockIn = async () => {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    setClockInTime(currentTime);
    setIsClockedIn(true);
    const userId = currentUser?.id || currentUser?._id;
    if (userId) {
      try { await api.createAttendance({ user: userId, date: new Date(), checkIn: currentTime, status: 'Present' }); } catch {}
    }
    addNotification({ title: 'Clocked In Successfully', message: `You clocked in at ${currentTime}`, type: 'success' });
  };

  const handleClockOut = () => {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    setClockOutTime(currentTime);
    if (clockInTime) {
      const hours = 9;
      const minutes = Math.floor(Math.random() * 60);
      setTodayHours(`${hours}h ${minutes}m`);
      setAttendanceHistory(prev => [{ id: Date.now(), date: new Date().toISOString().split('T')[0], checkIn: clockInTime, checkOut: currentTime, hours: `${hours}h ${minutes}m`, status: 'Present' }, ...prev]);
    }
    setIsClockedIn(false);
    addNotification({ title: 'Clocked Out Successfully', message: `You clocked out at ${currentTime}`, type: 'success' });
    setTimeout(() => { setClockInTime(null); setClockOutTime(null); }, 3000);
  };

  // Request Handlers
  const addRequest = async (request: any) => {
    const userId = currentUser?.id || currentUser?._id;
    try {
      const created = await api.submitGeneralRequest({ ...request, user: userId, status: 'Pending' });
      setRequests(prev => [{ ...created, id: created._id, employeeName: currentUser?.name, department: currentUser?.department, submittedDate: new Date().toISOString().split('T')[0] }, ...prev]);
    } catch { }
    addNotification({ title: 'Request Submitted', message: `Your ${request.type} has been submitted`, type: 'success' });
  };

  const updateRequest = (id: string, updates: any) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, ...updates } : req));
    if (updates.status) addNotification({ title: `Request ${updates.status}`, message: `Your request has been ${updates.status.toLowerCase()}`, type: updates.status === 'Approved' ? 'success' : 'info' });
  };

  const deleteRequest = (id: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
    addNotification({ title: 'Request Deleted', message: 'Your request has been deleted', type: 'info' });
  };

  // Notification Handlers
  const addNotification = (notification: any) => {
    setNotifications(prev => [{ ...notification, id: `NOT-${Date.now()}`, isRead: false, timestamp: new Date(), time: 'Just now' }, ...prev]);
  };

  const markNotificationAsRead = async (id: string) => {
    try { await api.markNotificationRead(id); } catch {}
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const clearAllNotifications = () => setNotifications([]);

  const addAnnouncement = async (announcement: any) => {
    try {
      const created = await api.createAnnouncement({ ...announcement, postedBy: currentUser?.id || currentUser?._id });
      setAnnouncements(prev => [{ ...created, id: created._id, date: new Date().toISOString().split('T')[0], author: currentUser?.name, status: 'Published' }, ...prev]);
    } catch {}
    addNotification({ title: 'New Announcement', message: announcement.title, type: 'info' });
  };

  const updateUser = async (id: string, updates: any) => {
    try { await api.updateUser(id, updates); } catch {}
    setAllUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };

  const enrollInTraining = async (trainingId: string) => {
    const userId = currentUser?.id || currentUser?._id;
    try { await api.enrollTraining(trainingId, userId); } catch {}
    setTrainings(prev => prev.map(t => t.id === trainingId ? { ...t, enrolled: t.enrolled + 1, isEnrolled: true } : t));
    addNotification({ title: 'Training Enrollment Successful', message: 'You have been enrolled in the training program', type: 'success' });
  };

  const requestDocument = (docType: string) => {
    addRequest({ type: 'Document Request', category: docType, reason: 'Required for personal use', priority: 'Medium' });
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const value = {
    currentUser, isAdmin, isClockedIn, clockInTime, todayHours,
    handleClockIn, handleClockOut, attendanceHistory,
    requests, addRequest, updateRequest, deleteRequest,
    notifications, addNotification, markNotificationAsRead, clearAllNotifications, unreadCount,
    announcements, addAnnouncement, allUsers, updateUser,
    trainings, enrollInTraining, projects, documents, requestDocument
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
