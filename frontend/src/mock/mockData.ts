// Mock data for Employee Dashboard with Indian dummy data

export const currentUser = {
  id: 'EMP001',
  name: 'Rajesh Kumar',
  email: 'rajesh.kumar@company.com',
  phone: '+91 98765 43210',
  designation: 'Senior Software Engineer',
  department: 'Technology',
  location: 'Bangalore',
  joinDate: '2020-01-15',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
  reportingManager: 'Priya Sharma',
};

export const summaryStats = [
  {
    id: 1,
    title: 'Leave Balance',
    value: '12',
    subtitle: 'Days Available',
    trend: '+2 from last month',
    trendUp: true,
    icon: 'Calendar',
    color: 'blue' as const,
  },
  {
    id: 2,
    title: 'Pending Requests',
    value: '3',
    subtitle: 'Awaiting Approval',
    trend: '-1 from last week',
    trendUp: false,
    icon: 'Clock',
    color: 'orange' as const,
  },
  {
    id: 3,
    title: 'Training Hours',
    value: '24',
    subtitle: 'This Quarter',
    trend: '+8 hrs completed',
    trendUp: true,
    icon: 'GraduationCap',
    color: 'green' as const,
  },
  {
    id: 4,
    title: 'Assets Assigned',
    value: '5',
    subtitle: 'Active Items',
    trend: 'All verified',
    trendUp: true,
    icon: 'Package',
    color: 'purple' as const,
  },
];

export const recentRequests = [
  {
    id: 'REQ001',
    type: 'Leave Application',
    description: 'Annual Leave - Diwali Vacation',
    date: '2024-12-01',
    status: 'Approved',
    approver: 'Priya Sharma',
  },
  {
    id: 'REQ002',
    type: 'Reimbursement',
    description: 'Travel Expense - Client Visit Mumbai',
    date: '2024-11-28',
    status: 'Pending',
    approver: 'Amit Patel',
  },
  {
    id: 'REQ003',
    type: 'Asset Request',
    description: 'New Laptop - MacBook Pro',
    date: '2024-11-25',
    status: 'In Progress',
    approver: 'IT Admin',
  },
  {
    id: 'REQ004',
    type: 'Certificate Request',
    description: 'Experience Certificate',
    date: '2024-11-20',
    status: 'Approved',
    approver: 'HR Team',
  },
  {
    id: 'REQ005',
    type: 'Leave Application',
    description: 'Sick Leave',
    date: '2024-11-15',
    status: 'Rejected',
    approver: 'Priya Sharma',
  },
];

export const upcomingTraining = [
  {
    id: 'TRN001',
    title: 'React Advanced Patterns',
    date: '2024-12-10',
    duration: '4 hours',
    instructor: 'Vikram Singh',
    mandatory: true,
  },
  {
    id: 'TRN002',
    title: 'AWS Cloud Fundamentals',
    date: '2024-12-15',
    duration: '8 hours',
    instructor: 'Sneha Reddy',
    mandatory: false,
  },
  {
    id: 'TRN003',
    title: 'Agile & Scrum Workshop',
    date: '2024-12-20',
    duration: '6 hours',
    instructor: 'Arjun Mehta',
    mandatory: true,
  },
];

export const assignedAssets = [
  {
    id: 'AST001',
    name: 'Dell Latitude 5520',
    type: 'Laptop',
    serialNumber: 'DL789456123',
    assignedDate: '2020-01-20',
    condition: 'Good',
  },
  {
    id: 'AST002',
    name: 'iPhone 13 Pro',
    type: 'Mobile',
    serialNumber: 'IP987654321',
    assignedDate: '2022-03-15',
    condition: 'Excellent',
  },
  {
    id: 'AST003',
    name: 'Dell Monitor 24"',
    type: 'Monitor',
    serialNumber: 'DM456789012',
    assignedDate: '2020-01-20',
    condition: 'Good',
  },
  {
    id: 'AST004',
    name: 'Logitech MX Keys',
    type: 'Keyboard',
    serialNumber: 'LK123456789',
    assignedDate: '2021-06-10',
    condition: 'Fair',
  },
  {
    id: 'AST005',
    name: 'Jabra Headset',
    type: 'Headset',
    serialNumber: 'JH345678901',
    assignedDate: '2020-08-05',
    condition: 'Good',
  },
];

export const teamContacts = [
  {
    id: 1,
    name: 'Priya Sharma',
    designation: 'Engineering Manager',
    email: 'priya.sharma@company.com',
    phone: '+91 98765 11111',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  },
  {
    id: 2,
    name: 'Amit Patel',
    designation: 'Finance Manager',
    email: 'amit.patel@company.com',
    phone: '+91 98765 22222',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit',
  },
  {
    id: 3,
    name: 'Sneha Reddy',
    designation: 'HR Manager',
    email: 'sneha.reddy@company.com',
    phone: '+91 98765 33333',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha',
  },
  {
    id: 4,
    name: 'Vikram Singh',
    designation: 'Training Lead',
    email: 'vikram.singh@company.com',
    phone: '+91 98765 44444',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram',
  },
];

export const documents = [
  {
    id: 'DOC001',
    name: 'Offer Letter',
    type: 'PDF',
    size: '245 KB',
    uploadDate: '2020-01-10',
    category: 'Onboarding',
  },
  {
    id: 'DOC002',
    name: 'ID Proof - Aadhaar',
    type: 'PDF',
    size: '180 KB',
    uploadDate: '2020-01-12',
    category: 'Identity',
  },
  {
    id: 'DOC003',
    name: 'PAN Card',
    type: 'PDF',
    size: '120 KB',
    uploadDate: '2020-01-12',
    category: 'Tax Documents',
  },
  {
    id: 'DOC004',
    name: 'Education Certificate',
    type: 'PDF',
    size: '520 KB',
    uploadDate: '2020-01-14',
    category: 'Certificates',
  },
  {
    id: 'DOC005',
    name: 'Payslip - Nov 2024',
    type: 'PDF',
    size: '95 KB',
    uploadDate: '2024-12-01',
    category: 'Payslips',
  },
];

export const attendanceData = [
  { date: '2024-12-01', checkIn: '09:15 AM', checkOut: '06:30 PM', hours: '9.25', status: 'Present' },
  { date: '2024-12-02', checkIn: '09:00 AM', checkOut: '06:15 PM', hours: '9.25', status: 'Present' },
  { date: '2024-12-03', checkIn: '09:30 AM', checkOut: '06:45 PM', hours: '9.25', status: 'Present' },
  { date: '2024-12-04', checkIn: '09:10 AM', checkOut: '06:20 PM', hours: '9.17', status: 'Present' },
  { date: '2024-12-05', checkIn: '09:05 AM', checkOut: '06:10 PM', hours: '9.08', status: 'Present' },
];

export const quickActions = [
  { id: 1, title: 'Apply Leave', icon: 'CalendarDays', color: 'blue' as const, route: '/employee/requests' },
  { id: 2, title: 'Submit Expense', icon: 'Receipt', color: 'green' as const, route: '/employee/requests' },
  { id: 3, title: 'View Payslip', icon: 'FileText', color: 'purple' as const, route: '/employee/documents' },
  { id: 4, title: 'Update Profile', icon: 'User', color: 'orange' as const, route: '/employee/profile' },
  { id: 5, title: 'Training Portal', icon: 'BookOpen', color: 'indigo' as const, route: '/employee/training' },
  { id: 6, title: 'Raise Ticket', icon: 'HelpCircle', color: 'red' as const, route: '/employee/support' },
];
