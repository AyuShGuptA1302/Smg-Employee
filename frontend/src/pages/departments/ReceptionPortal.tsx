import { useState, useEffect, useMemo, useRef } from 'react';
import { motion } from 'motion/react';
import { getDeptStore, saveDeptStore } from '../../services/api';
import { 
  Building2, 
  UserPlus, 
  Users, 
  Clock, 
  CheckCircle,
  XCircle,
  Plus,
  Search,
  Download,
  Eye,
  Bell,
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  FileText,
  Package,
  Car,
  AlertCircle,
  TrendingUp,
  Filter,
  Edit,
  Trash2,
  History,
  Activity,
  BarChart3,
  UserCheck,
  ArrowUp,
  ArrowDown,
  Printer,
  Share2,
  Home,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Key,
  Shield,
  Briefcase,
  GraduationCap,
  Building,
  Lock,
  Unlock,
  UserCog,
  Send
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

import { generateVisitorLogPDF } from '../../utils/pdfExport';

interface Visitor {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  visitingPerson: string;
  department: string;
  purpose: string;
  checkInTime: string;
  checkOutTime?: string;
  status: 'waiting' | 'approved' | 'in-meeting' | 'checked-out' | 'rejected';
  visitorType: 'vendor' | 'client' | 'candidate' | 'guest' | 'courier' | 'corporate' | 'interview' | 'government';
  date: string;
  idProof: string;
  idProofNumber: string;
  vehicleNumber?: string;
  badgeNumber?: string;
  photoUrl?: string;
  temperature?: string;
  materialsBrought?: string;
  escortedBy?: string;
  remarks?: string;
}

interface CorporateGuest {
  id: string;
  guestName: string;
  company: string;
  designation: string;
  phone: string;
  email: string;
  visitingPerson: string;
  department: string;
  hodName: string;
  purpose: string;
  visitDate: string;
  visitTime: string;
  numberOfGuests: number;
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  approvalDate?: string;
}

interface InterviewCandidate {
  id: string;
  candidateName: string;
  phone: string;
  email: string;
  position: string;
  department: string;
  interviewDate: string;
  interviewTime: string;
  interviewerName: string;
  hrName: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  resume?: string;
  requestedBy: string;
}

interface GovernmentOfficial {
  id: string;
  officialName: string;
  designation: string;
  ministry: string;
  phone: string;
  email: string;
  visitingPerson: string;
  department: string;
  purpose: string;
  visitDate: string;
  visitTime: string;
  numberOfOfficials: number;
  securityClearance: 'pending' | 'approved' | 'rejected';
  status: 'pending' | 'approved' | 'rejected';
  requestedBy: string;
  hodName: string;
}

interface KeyInfo {
  id: string;
  keyNumber: string;
  location: string;
  keyType: string;
  issuedTo?: string;
  issuedDate?: string;
  returnDate?: string;
  status: 'available' | 'issued' | 'lost';
  authorizedBy?: string;
}

interface KeyPerson {
  id: string;
  name: string;
  designation: string;
  department: string;
  phone: string;
  email: string;
  photoUrl?: string;
  accessLevel: 'high' | 'medium' | 'low';
  specialInstructions?: string;
  emergencyContact?: string;
}

interface Notification {
  id: string;
  type: 'visitor' | 'approval' | 'alert' | 'info' | 'corporate' | 'interview' | 'government' | 'key';
  message: string;
  time: string;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
}

const initialVisitors: Visitor[] = [
  {
    id: 'V001',
    name: 'Rajesh Kumar',
    company: 'Tech Solutions Pvt Ltd',
    phone: '+91 98765 43210',
    email: 'rajesh@techsolutions.com',
    visitingPerson: 'Amit Patel',
    department: 'IT',
    purpose: 'Software Demo and Technical Discussion',
    checkInTime: '10:30 AM',
    status: 'in-meeting',
    visitorType: 'vendor',
    date: '2024-12-17',
    idProof: 'Aadhaar Card',
    idProofNumber: 'XXXX-XXXX-5678',
    vehicleNumber: 'DL 01 AB 1234',
    badgeNumber: 'B-042',
    temperature: '98.2°F',
    materialsBrought: 'Laptop, Demo Materials',
    escortedBy: 'Amit Patel'
  },
  {
    id: 'V002',
    name: 'Priya Sharma',
    company: 'HR Consultants',
    phone: '+91 98765 43211',
    email: 'priya@hrconsultants.com',
    visitingPerson: 'Sneha Reddy',
    department: 'HR',
    purpose: 'Interview for Senior Manager Position',
    checkInTime: '11:00 AM',
    status: 'waiting',
    visitorType: 'candidate',
    date: '2024-12-17',
    idProof: 'PAN Card',
    idProofNumber: 'ABCDE1234F',
    badgeNumber: 'B-043',
    temperature: '98.0°F',
    materialsBrought: 'Resume, Certificates'
  },
  {
    id: 'V003',
    name: 'Vikram Singh',
    company: 'ABC Industries',
    phone: '+91 98765 43212',
    email: 'vikram@abcindustries.com',
    visitingPerson: 'Rohit Sharma',
    department: 'Assembly',
    purpose: 'Client Meeting - Quality Review',
    checkInTime: '09:00 AM',
    checkOutTime: '10:30 AM',
    status: 'checked-out',
    visitorType: 'client',
    date: '2024-12-17',
    idProof: 'Driving License',
    idProofNumber: 'DL-1234567890',
    vehicleNumber: 'DL 02 CD 5678',
    badgeNumber: 'B-041',
    temperature: '98.4°F',
    materialsBrought: 'Documents',
    escortedBy: 'Rohit Sharma',
    remarks: 'Quality inspection completed successfully'
  }
];

const initialCorporateGuests: CorporateGuest[] = [
  {
    id: 'CG001',
    guestName: 'Mr. Anil Kapoor',
    company: 'Global Manufacturing Ltd',
    designation: 'CEO',
    phone: '+91 98765 11111',
    email: 'anil.kapoor@globalmanuf.com',
    visitingPerson: 'Managing Director',
    department: 'Management',
    hodName: 'Mr. Suresh Kumar (MD)',
    purpose: 'Business Partnership Discussion',
    visitDate: '2024-12-20',
    visitTime: '2:00 PM',
    numberOfGuests: 3,
    status: 'pending',
    requestedBy: 'Management Office'
  },
  {
    id: 'CG002',
    guestName: 'Ms. Meera Patel',
    company: 'Tech Innovations Inc',
    designation: 'Director - Operations',
    phone: '+91 98765 22222',
    email: 'meera@techinnovations.com',
    visitingPerson: 'IT Head',
    department: 'IT',
    hodName: 'Mr. Ramesh Singh (IT HOD)',
    purpose: 'Technology Infrastructure Review',
    visitDate: '2024-12-21',
    visitTime: '11:00 AM',
    numberOfGuests: 2,
    status: 'approved',
    requestedBy: 'IT Department',
    approvalDate: '2024-12-18'
  }
];

const initialInterviewCandidates: InterviewCandidate[] = [
  {
    id: 'IC001',
    candidateName: 'Rahul Verma',
    phone: '+91 98765 33333',
    email: 'rahul.verma@email.com',
    position: 'Senior Software Engineer',
    department: 'IT',
    interviewDate: '2024-12-19',
    interviewTime: '10:00 AM',
    interviewerName: 'Mr. Amit Patel',
    hrName: 'Ms. Sneha Reddy',
    status: 'pending',
    requestedBy: 'HR Department'
  },
  {
    id: 'IC002',
    candidateName: 'Kavita Sharma',
    phone: '+91 98765 44444',
    email: 'kavita.sharma@email.com',
    position: 'HR Manager',
    department: 'HR',
    interviewDate: '2024-12-20',
    interviewTime: '3:00 PM',
    interviewerName: 'Ms. Priya Gupta',
    hrName: 'Ms. Sneha Reddy',
    status: 'approved',
    requestedBy: 'HR Department'
  }
];

const initialGovernmentOfficials: GovernmentOfficial[] = [
  {
    id: 'GO001',
    officialName: 'Mr. Rajesh Khanna',
    designation: 'Joint Secretary',
    ministry: 'Ministry of Commerce & Industry',
    phone: '+91 98765 55555',
    email: 'rajesh.khanna@gov.in',
    visitingPerson: 'Managing Director',
    department: 'Management',
    purpose: 'Industrial Compliance Inspection',
    visitDate: '2024-12-22',
    visitTime: '11:00 AM',
    numberOfOfficials: 5,
    securityClearance: 'pending',
    status: 'pending',
    requestedBy: 'Management Office',
    hodName: 'Managing Director'
  }
];

const initialKeys: KeyInfo[] = [
  {
    id: 'K001',
    keyNumber: 'MR-101',
    location: 'Main Conference Room',
    keyType: 'Room Key',
    status: 'available'
  },
  {
    id: 'K002',
    keyNumber: 'SR-201',
    location: 'Server Room',
    keyType: 'High Security',
    issuedTo: 'Amit Patel',
    issuedDate: '2024-12-18',
    status: 'issued',
    authorizedBy: 'IT Head'
  },
  {
    id: 'K003',
    keyNumber: 'ST-301',
    location: 'Storage Room 3',
    keyType: 'Storage',
    status: 'available'
  }
];

const initialKeyPersons: KeyPerson[] = [
  {
    id: 'KP001',
    name: 'Mr. Suresh Kumar',
    designation: 'Managing Director',
    department: 'Management',
    phone: '+91 98765 00001',
    email: 'md@smg.com',
    accessLevel: 'high',
    specialInstructions: 'Always escort to MD office directly. Immediate priority.',
    emergencyContact: '+91 98765 00002'
  },
  {
    id: 'KP002',
    name: 'Ms. Anjali Desai',
    designation: 'Chief Financial Officer',
    department: 'Finance',
    phone: '+91 98765 00003',
    email: 'cfo@smg.com',
    accessLevel: 'high',
    specialInstructions: 'Notify Finance team upon arrival.',
    emergencyContact: '+91 98765 00004'
  },
  {
    id: 'KP003',
    name: 'Mr. Ramesh Singh',
    designation: 'IT Head',
    department: 'IT',
    phone: '+91 98765 00005',
    email: 'ithead@smg.com',
    accessLevel: 'medium',
    specialInstructions: 'Has server room access. Verify ID always.'
  }
];

const initialNotifications: Notification[] = [
  {
    id: 'N001',
    type: 'corporate',
    message: 'New corporate guest approval request from Management',
    time: '5 mins ago',
    read: false,
    priority: 'high'
  },
  {
    id: 'N002',
    type: 'interview',
    message: 'Interview candidate scheduled for tomorrow - Rahul Verma',
    time: '15 mins ago',
    read: false,
    priority: 'medium'
  },
  {
    id: 'N003',
    type: 'government',
    message: 'Government official visit pending security clearance',
    time: '1 hour ago',
    read: false,
    priority: 'high'
  },
  {
    id: 'N004',
    type: 'key',
    message: 'Server room key issued to Amit Patel',
    time: '2 hours ago',
    read: true,
    priority: 'low'
  }
];

function useDataStore(key: string, initialData?: any[]) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const dataRef = useRef<any[]>([]);

    useEffect(() => {
        dataRef.current = data;
    }, [data]);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getDeptStore(key).then(res => {
            if (mounted) {
                if (res && Array.isArray(res) && res.length > 0) {
                    setData(res);
                } else if (initialData) {
                    setData(initialData);
                    saveDeptStore(key, initialData);
                }
            }
        }).catch(err => console.error(err))
        .finally(() => { if(mounted) setLoading(false); });
        return () => { mounted = false; };
    }, [key]);

    const api = useMemo(() => ({
        async add(item: any) {
            setLoading(true);
            const newData = [item, ...dataRef.current];
            setData(newData);
            await saveDeptStore(key, newData);
            setLoading(false);
            return item;
        },
        async addEnd(item: any) {
            setLoading(true);
            const newData = [...dataRef.current, item];
            setData(newData);
            await saveDeptStore(key, newData);
            setLoading(false);
            return item;
        },
        async update(matchFn: (it: any) => boolean, updater: (it: any) => any) {
            setLoading(true);
            const newData = dataRef.current.map(it => (matchFn(it) ? { ...it, ...updater(it) } : it));
            setData(newData);
            await saveDeptStore(key, newData);
            setLoading(false);
        },
        async remove(matchFn: (it: any) => boolean) {
            setLoading(true);
            const newData = dataRef.current.filter(it => !matchFn(it));
            setData(newData);
            await saveDeptStore(key, newData);
            setLoading(false);
        },
    }), [key]);

    return { data, setData, api, loading };
}

export function ReceptionPortal() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showNewVisitorDialog, setShowNewVisitorDialog] = useState(false);
  const [showVisitorDetailsDialog, setShowVisitorDetailsDialog] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showNotificationsDialog, setShowNotificationsDialog] = useState(false);
  const [showCorporateGuestDialog, setShowCorporateGuestDialog] = useState(false);
  const [showInterviewCandidateDialog, setShowInterviewCandidateDialog] = useState(false);
  const [showGovernmentOfficialDialog, setShowGovernmentOfficialDialog] = useState(false);
  const [showKeyInfoDialog, setShowKeyInfoDialog] = useState(false);
  const [showKeyPersonDialog, setShowKeyPersonDialog] = useState(false);
  const [showIssueKeyDialog, setShowIssueKeyDialog] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [visitorTypeFilter, setVisitorTypeFilter] = useState<string>('all');
  const [newVisitorForm, setNewVisitorForm] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    visitingPerson: '',
    department: '',
    purpose: '',
    visitorType: 'guest' as Visitor['visitorType'],
    idProof: '',
    idProofNumber: '',
    vehicleNumber: '',
    materialsBrought: ''
  });
  const [selectedKey, setSelectedKey] = useState<KeyInfo | null>(null);
  const [issueKeyForm, setIssueKeyForm] = useState({
    keyNumber: '',
    issuedTo: '',
    authorizedBy: ''
  });
  
  const [corporateGuestForm, setCorporateGuestForm] = useState({
    guestName: '',
    company: '',
    designation: '',
    phone: '',
    email: '',
    visitingPerson: '',
    department: 'Management',
    hodName: '',
    purpose: '',
    visitDate: new Date().toISOString().split('T')[0],
    visitTime: '12:00 PM',
    numberOfGuests: 1,
    requestedBy: 'Reception'
  });

  const [interviewCandidateForm, setInterviewCandidateForm] = useState({
    candidateName: '',
    phone: '',
    email: '',
    position: '',
    department: 'IT',
    interviewDate: new Date().toISOString().split('T')[0],
    interviewTime: '10:00 AM',
    interviewerName: '',
    hrName: '',
    requestedBy: 'Reception'
  });

  const [governmentOfficialForm, setGovernmentOfficialForm] = useState({
    officialName: '',
    designation: '',
    ministry: '',
    phone: '',
    email: '',
    visitingPerson: '',
    department: 'Management',
    purpose: '',
    visitDate: new Date().toISOString().split('T')[0],
    visitTime: '11:00 AM',
    numberOfOfficials: 1,
    hodName: '',
    requestedBy: 'Reception'
  });  // Synchronized database stores
  const [keyPersonForm, setKeyPersonForm] = useState({
    name: '',
    designation: '',
    department: '',
    phone: '',
    email: '',
    accessLevel: 'medium' as 'high' | 'medium' | 'low',
    specialInstructions: '',
    emergencyContact: ''
  });

  const [showEditNoteDialog, setShowEditNoteDialog] = useState(false);
  const [selectedKeyPerson, setSelectedKeyPerson] = useState<any | null>(null);
  const [editNoteForm, setEditNoteForm] = useState('');

  const { data: visitors, setData: setVisitors, api: visitorsApi } = useDataStore('reception:visitors', initialVisitors);
  const { data: corporateGuests, setData: setCorporateGuests, api: corporateGuestsApi } = useDataStore('reception:corporateGuests', initialCorporateGuests);
  const { data: interviewCandidates, setData: setInterviewCandidates, api: interviewCandidatesApi } = useDataStore('reception:interviewCandidates', initialInterviewCandidates);
  const { data: governmentOfficials, setData: setGovernmentOfficials, api: governmentOfficialsApi } = useDataStore('reception:governmentOfficials', initialGovernmentOfficials);
  const { data: keys, setData: setKeys, api: keysApi } = useDataStore('reception:keys', initialKeys);
  const { data: keyPersons, setData: setKeyPersons, api: keyPersonsApi } = useDataStore('reception:keyPersons', initialKeyPersons);
  const { data: notifications, setData: setNotifications, api: notificationsApi } = useDataStore('reception:notifications', initialNotifications);
  const receptionProfile = {
    name: 'Reception Desk',
    email: 'reception@smg.com',
    phone: '+91 120 1234567',
    extension: 'Ext: 100',
    shift: 'General (8:00 AM - 6:00 PM)',
    location: 'Main Entrance, Ground Floor',
    assignedStaff: ['Anjali Verma', 'Rahul Gupta', 'Neha Sharma', 'Suresh Kumar'],
    supervisor: 'Kavita Desai',
    responsibilities: [
      'Visitor Management & Screening',
      'Front Desk Operations',
      'Call Management & Routing',
      'Badge Issuance & Tracking',
      'Courier Handling & Distribution',
      'Emergency Coordination',
      'Access Control Management',
      'Visitor Log Maintenance'
    ]
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
          <div className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg ${
            change > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
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

  const handleCheckIn = (formData: any) => {
    const newVisitor: Visitor = {
      id: `V${String(visitors.length + 1).padStart(3, '0')}`,
      ...formData,
      checkInTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status: 'waiting' as const,
      date: new Date().toISOString().split('T')[0],
      badgeNumber: `B-${String(Math.floor(Math.random() * 100) + 40).padStart(3, '0')}`,
      temperature: '98.2°F'
    };
    visitorsApi.add(newVisitor);
    toast.success(`Visitor ${formData.name} checked in successfully! Badge: ${newVisitor.badgeNumber}`);
    setShowNewVisitorDialog(false);
  };

  const handleAddCorporateGuest = () => {
    const newGuest = {
      id: `CG${String(corporateGuests.length + 1).padStart(3, '0')}`,
      ...corporateGuestForm,
      status: 'approved' as const
    };
    corporateGuestsApi.add(newGuest);
    toast.success(`Corporate Guest ${newGuest.guestName} registered successfully`);
    setShowCorporateGuestDialog(false);
  };

  const handleAddInterviewCandidate = () => {
    const newCandidate = {
      id: `IC${String(interviewCandidates.length + 1).padStart(3, '0')}`,
      ...interviewCandidateForm,
      status: 'approved' as const
    };
    interviewCandidatesApi.add(newCandidate);
    toast.success(`Interview Candidate ${newCandidate.candidateName} registered successfully`);
    setShowInterviewCandidateDialog(false);
  };

  const handleAddGovernmentOfficial = () => {
    const newOfficial = {
      id: `GO${String(governmentOfficials.length + 1).padStart(3, '0')}`,
      ...governmentOfficialForm,
      securityClearance: 'approved' as const,
      status: 'approved' as const
    };
    governmentOfficialsApi.add(newOfficial);
    toast.success(`Government Official ${newOfficial.officialName} registered successfully`);
    setShowGovernmentOfficialDialog(false);
  };

  const handleAddKeyPerson = () => {
    const newPerson = {
      id: `KP${String(keyPersons.length + 1).padStart(3, '0')}`,
      ...keyPersonForm
    };
    keyPersonsApi.add(newPerson);
    toast.success(`Key Person ${newPerson.name} added successfully`);
    setShowKeyPersonDialog(false);
  };

  const handleSaveNote = () => {
    if (!selectedKeyPerson) return;
    keyPersonsApi.update(
      kp => kp.id === selectedKeyPerson.id,
      () => ({ specialInstructions: editNoteForm })
    );
    toast.success(`Special instructions for ${selectedKeyPerson.name} updated`);
    setShowEditNoteDialog(false);
  };

  const handleApprove = (visitorId: string) => {
    visitorsApi.update(v => v.id === visitorId, () => ({ status: 'in-meeting' as const }));
    const visitor = visitors.find(v => v.id === visitorId);
    toast.success(`${visitor?.name} approved and moved to meeting area`);
  };

  const handleCheckOut = (visitorId: string) => {
    visitorsApi.update(v => v.id === visitorId, () => ({ 
      status: 'checked-out' as const,
      checkOutTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }));
    const visitor = visitors.find(v => v.id === visitorId);
    toast.success(`${visitor?.name} checked out successfully. Badge ${visitor?.badgeNumber} collected.`);
  };

  const handleReject = (visitorId: string) => {
    visitorsApi.update(v => v.id === visitorId, () => ({ status: 'rejected' as const }));
    const visitor = visitors.find(v => v.id === visitorId);
    toast.error(`Visitor request for ${visitor?.name} has been rejected`);
  };

  const handleViewDetails = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setShowVisitorDetailsDialog(true);
  };

  const handleApproveCorporateGuest = (guestId: string) => {
    corporateGuestsApi.update(g => g.id === guestId, () => ({ status: 'approved' as const, approvalDate: new Date().toISOString().split('T')[0] }));
    toast.success('Corporate guest request approved');
  };

  const handleRejectCorporateGuest = (guestId: string) => {
    corporateGuestsApi.update(g => g.id === guestId, () => ({ status: 'rejected' as const }));
    toast.error('Corporate guest request rejected');
  };

  const handleApproveInterviewCandidate = (candidateId: string) => {
    interviewCandidatesApi.update(c => c.id === candidateId, () => ({ status: 'approved' as const }));
    toast.success('Interview candidate approved');
  };

  const handleRejectInterviewCandidate = (candidateId: string) => {
    interviewCandidatesApi.update(c => c.id === candidateId, () => ({ status: 'rejected' as const }));
    toast.error('Interview candidate rejected');
  };

  const handleApproveGovernmentOfficial = (officialId: string) => {
    governmentOfficialsApi.update(o => o.id === officialId, () => ({ status: 'approved' as const, securityClearance: 'approved' as const }));
    toast.success('Government official visit approved with security clearance');
  };

  const handleRejectGovernmentOfficial = (officialId: string) => {
    governmentOfficialsApi.update(o => o.id === officialId, () => ({ status: 'rejected' as const, securityClearance: 'rejected' as const }));
    toast.error('Government official visit rejected');
  };

  const handleIssueKey = (formData: any) => {
    keysApi.update(
      k => k.keyNumber === formData.keyNumber,
      () => ({
        issuedTo: formData.issuedTo,
        issuedDate: new Date().toISOString().split('T')[0],
        status: 'issued' as const,
        authorizedBy: formData.authorizedBy
      })
    );
    toast.success(`Key ${formData.keyNumber} issued to ${formData.issuedTo}`);
    setShowIssueKeyDialog(false);
  };

  const handleReturnKey = (keyId: string) => {
    keysApi.update(
      k => k.id === keyId,
      () => ({
        issuedTo: undefined,
        issuedDate: undefined,
        returnDate: new Date().toISOString().split('T')[0],
        status: 'available' as const,
        authorizedBy: undefined
      })
    );
    toast.success('Key returned successfully');
  };

  const markNotificationAsRead = (notificationId: string) => {
    notificationsApi.update(n => n.id === notificationId, () => ({ read: true }));
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
    { icon: Users, label: 'Active Visitors', value: 'active' },
    { icon: Briefcase, label: 'Corporate Guests', value: 'corporate' },
    { icon: GraduationCap, label: 'Interview Candidates', value: 'interview' },
    { icon: Shield, label: 'Government Officials', value: 'government' },
    { icon: Key, label: 'Keys Management', value: 'keys' },
    { icon: UserCog, label: 'Key Persons', value: 'keypersons' },
    { icon: History, label: 'History', value: 'history' },
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
                <h2 className="text-[#1B254B] font-bold">Reception Portal</h2>
                <p className="text-xs text-gray-500">Visitor Management</p>
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
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.value
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1B254B]">{getGreeting()}, Reception Desk</h1>
              <p className="text-sm text-gray-500 mt-1">Visitor management & front desk operations</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search visitors, departments, keys..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-72 border-gray-200"
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
              onClick={() => setShowNewVisitorDialog(true)}
              className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90 shadow-lg shadow-blue-500/30"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Visitor Check-In
            </Button>
            <Button 
              onClick={() => setShowCorporateGuestDialog(true)}
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:opacity-90 shadow-lg shadow-purple-500/30"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Corporate Guest
            </Button>
            <Button 
              onClick={() => setShowInterviewCandidateDialog(true)}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 shadow-lg shadow-emerald-500/30"
            >
              <GraduationCap className="w-4 h-4 mr-2" />
              Interview Candidate
            </Button>
            <Button 
              onClick={() => setShowGovernmentOfficialDialog(true)}
              className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90 shadow-lg shadow-blue-500/30"
            >
              <Shield className="w-4 h-4 mr-2" />
              Government Official
            </Button>
            <Button 
              variant="outline"
              className="border-gray-200 hover:bg-gray-50"
              onClick={() => {
                generateVisitorLogPDF(visitors);
                toast.success('Generating PDF...');
              }}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print Log
            </Button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={Users}
              label="Active Visitors"
              value={visitors.filter(v => v.status !== 'checked-out' && v.status !== 'rejected').length.toString()}
              subtext={`${visitors.filter(v => v.status === 'waiting').length} waiting, ${visitors.filter(v => v.status === 'in-meeting').length} in meeting`}
              change={12}
              colorClass="bg-gradient-to-br from-[#0B4DA2] to-[#042A5B]"
              onClick={() => setActiveTab('active')}
            />
            <StatCard
              icon={Briefcase}
              label="Corporate Guests"
              value={corporateGuests.filter(g => g.status === 'pending').length.toString()}
              subtext={`${corporateGuests.filter(g => g.status === 'approved').length} approved`}
              change={5}
              colorClass="bg-gradient-to-br from-purple-500 to-purple-600"
              onClick={() => setActiveTab('corporate')}
            />
            <StatCard
              icon={GraduationCap}
              label="Interview Candidates"
              value={interviewCandidates.filter(c => c.status === 'pending').length.toString()}
              subtext={`${interviewCandidates.filter(c => c.status === 'approved').length} approved`}
              change={8}
              colorClass="bg-gradient-to-br from-emerald-500 to-emerald-600"
              onClick={() => setActiveTab('interview')}
            />
            <StatCard
              icon={Shield}
              label="Government Officials"
              value={governmentOfficials.filter(o => o.status === 'pending').length.toString()}
              subtext="Security clearance pending"
              change={-2}
              colorClass="bg-gradient-to-br from-[#0B4DA2] to-[#042A5B]"
              onClick={() => setActiveTab('government')}
            />
          </div>

          {/* Rest of the content will continue in the next part... */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main activity section - would continue here */}
              <div className="lg:col-span-2">
                <Card className="p-6 border-gray-100 shadow-md">
                  <h3 className="text-[#1B254B] font-bold text-lg mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {visitors
                      .filter(v => {
                        if (!searchQuery.trim()) return true;
                        const query = searchQuery.toLowerCase();
                        return (
                          v.name.toLowerCase().includes(query) ||
                          v.company.toLowerCase().includes(query) ||
                          v.visitingPerson.toLowerCase().includes(query) ||
                          (v.badgeNumber && v.badgeNumber.toLowerCase().includes(query)) ||
                          v.visitorType.toLowerCase().includes(query)
                        );
                      })
                      .slice(0, 5)
                      .map((visitor) => (
                      <div key={visitor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                        onClick={() => handleViewDetails(visitor)}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            visitor.visitorType === 'client' ? 'bg-blue-100 text-blue-600' :
                            visitor.visitorType === 'vendor' ? 'bg-purple-100 text-purple-600' :
                            visitor.visitorType === 'candidate' ? 'bg-green-100 text-green-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1B254B]">{visitor.name}</p>
                            <p className="text-xs text-gray-500">{visitor.company}</p>
                          </div>
                        </div>
                        <Badge variant={
                          visitor.status === 'in-meeting' ? 'default' :
                          visitor.status === 'waiting' ? 'secondary' :
                          visitor.status === 'checked-out' ? 'outline' :
                          'destructive'
                        } className="text-xs">
                          {visitor.status}
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
                      <span className="text-gray-600 text-sm">Active Keys</span>
                      <span className="text-[#1B254B] font-bold">{keys.filter(k => k.status === 'issued').length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Key Persons</span>
                      <span className="text-[#1B254B] font-bold">{keyPersons.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Pending Approvals</span>
                      <span className="text-[#1B254B] font-bold">
                        {corporateGuests.filter(g => g.status === 'pending').length + 
                         interviewCandidates.filter(c => c.status === 'pending').length +
                         governmentOfficials.filter(o => o.status === 'pending').length}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'corporate' && (
            <div className="space-y-4">
              <div className="space-y-4">
                {corporateGuests
                  .filter(guest => {
                    if (!searchQuery.trim()) return true;
                    const query = searchQuery.toLowerCase();
                    return (
                      guest.guestName.toLowerCase().includes(query) ||
                      guest.company.toLowerCase().includes(query) ||
                      guest.designation.toLowerCase().includes(query) ||
                      guest.visitingPerson.toLowerCase().includes(query) ||
                      guest.purpose.toLowerCase().includes(query) ||
                      guest.department.toLowerCase().includes(query)
                    );
                  })
                  .map((guest) => (
                  <Card key={guest.id} className="p-6 border-gray-100 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                            <Briefcase className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-[#1B254B] font-bold">{guest.guestName}</h4>
                              <Badge variant="outline" className={`text-xs ${
                                guest.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                                guest.status === 'rejected' ? 'bg-red-50 text-red-600' :
                                'bg-blue-50 text-blue-600'
                              }`}>
                                {guest.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">{guest.designation} at {guest.company}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Visit Date</p>
                            <p className="text-sm text-[#1B254B] font-bold">{guest.visitDate}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Visit Time</p>
                            <p className="text-sm text-[#1B254B] font-bold">{guest.visitTime}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">No. of Guests</p>
                            <p className="text-sm text-[#1B254B] font-bold">{guest.numberOfGuests}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-xl">
                            <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">HOD/Manager</p>
                            <p className="text-sm text-[#1B254B] font-bold">{guest.hodName}</p>
                          </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <p className="text-xs text-gray-600 mb-1 font-bold uppercase tracking-wide">Purpose of Visit</p>
                          <p className="text-sm text-[#1B254B]">{guest.purpose}</p>
                        </div>
                      </div>
                    </div>

                    {guest.status === 'pending' && (
                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        <Button 
                          onClick={() => handleApproveCorporateGuest(guest.id)}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve Corporate Guest
                        </Button>
                        <Button 
                          onClick={() => handleRejectCorporateGuest(guest.id)}
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'interview' && (
            <div className="space-y-4">
              {interviewCandidates
                .filter(candidate => {
                  if (!searchQuery.trim()) return true;
                  const query = searchQuery.toLowerCase();
                  return (
                    candidate.candidateName.toLowerCase().includes(query) ||
                    candidate.position.toLowerCase().includes(query) ||
                    candidate.department.toLowerCase().includes(query) ||
                    candidate.interviewerName.toLowerCase().includes(query) ||
                    candidate.hrName.toLowerCase().includes(query)
                  );
                })
                .map((candidate) => (
                <Card key={candidate.id} className="p-6 border-gray-100 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <GraduationCap className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[#1B254B] font-bold">{candidate.candidateName}</h4>
                            <Badge variant="outline" className={`text-xs ${
                              candidate.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                              candidate.status === 'rejected' ? 'bg-red-50 text-red-600' :
                              'bg-blue-50 text-blue-600'
                            }`}>
                              {candidate.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">Applying for: {candidate.position}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Interview Date</p>
                          <p className="text-sm text-[#1B254B] font-bold">{candidate.interviewDate}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Interview Time</p>
                          <p className="text-sm text-[#1B254B] font-bold">{candidate.interviewTime}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Interviewer</p>
                          <p className="text-sm text-[#1B254B] font-bold">{candidate.interviewerName}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">HR Contact</p>
                          <p className="text-sm text-[#1B254B] font-bold">{candidate.hrName}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {candidate.status === 'pending' && (
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <Button 
                        onClick={() => handleApproveInterviewCandidate(candidate.id)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve Interview
                      </Button>
                      <Button 
                        onClick={() => handleRejectInterviewCandidate(candidate.id)}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'government' && (
            <div className="space-y-4">
              {governmentOfficials
                .filter(official => {
                  if (!searchQuery.trim()) return true;
                  const query = searchQuery.toLowerCase();
                  return (
                    official.officialName.toLowerCase().includes(query) ||
                    official.designation.toLowerCase().includes(query) ||
                    official.ministry.toLowerCase().includes(query) ||
                    official.visitingPerson.toLowerCase().includes(query) ||
                    official.purpose.toLowerCase().includes(query) ||
                    official.department.toLowerCase().includes(query)
                  );
                })
                .map((official) => (
                <Card key={official.id} className="p-6 border-gray-100 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                          <Shield className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[#1B254B] font-bold">{official.officialName}</h4>
                            <Badge variant="outline" className={`text-xs ${
                              official.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                              official.status === 'rejected' ? 'bg-red-50 text-red-600' :
                              'bg-orange-50 text-orange-600'
                            }`}>
                              {official.status}
                            </Badge>
                            <Badge variant="outline" className={`text-xs ${
                              official.securityClearance === 'approved' ? 'bg-green-50 text-green-600' :
                              official.securityClearance === 'rejected' ? 'bg-red-50 text-red-600' :
                              'bg-yellow-50 text-yellow-600'
                            }`}>
                              Security: {official.securityClearance}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500">{official.designation}, {official.ministry}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Visit Date</p>
                          <p className="text-sm text-[#1B254B] font-bold">{official.visitDate}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Visit Time</p>
                          <p className="text-sm text-[#1B254B] font-bold">{official.visitTime}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">No. of Officials</p>
                          <p className="text-sm text-[#1B254B] font-bold">{official.numberOfOfficials}</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-500 mb-1 font-bold uppercase tracking-wide">Requested By</p>
                          <p className="text-sm text-[#1B254B] font-bold">{official.hodName}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <p className="text-xs text-gray-600 mb-1 font-bold uppercase tracking-wide">Purpose of Visit</p>
                        <p className="text-sm text-[#1B254B]">{official.purpose}</p>
                      </div>
                    </div>
                  </div>

                  {official.status === 'pending' && (
                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                      <Button 
                        onClick={() => handleApproveGovernmentOfficial(official.id)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve with Security Clearance
                      </Button>
                      <Button 
                        onClick={() => handleRejectGovernmentOfficial(official.id)}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button 
                  onClick={() => setShowIssueKeyDialog(true)}
                  className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90"
                >
                  <Key className="w-4 h-4 mr-2" />
                  Issue Key
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {keys
                  .filter(key => {
                    if (!searchQuery.trim()) return true;
                    const query = searchQuery.toLowerCase();
                    return (
                      key.keyNumber.toLowerCase().includes(query) ||
                      key.location.toLowerCase().includes(query) ||
                      key.keyType.toLowerCase().includes(query) ||
                      (key.issuedTo && key.issuedTo.toLowerCase().includes(query)) ||
                      (key.authorizedBy && key.authorizedBy.toLowerCase().includes(query))
                    );
                  })
                  .map((key) => (
                  <Card key={key.id} className="p-6 border-gray-100 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        key.status === 'available' ? 'bg-emerald-100 text-emerald-600' :
                        key.status === 'issued' ? 'bg-orange-100 text-orange-600' :
                        'bg-red-100 text-red-600'
                      }`}>
                        {key.status === 'available' ? <Unlock className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                      </div>
                      <Badge variant="outline" className={`text-xs ${
                        key.status === 'available' ? 'bg-emerald-50 text-emerald-600' :
                        key.status === 'issued' ? 'bg-orange-50 text-orange-600' :
                        'bg-red-50 text-red-600'
                      }`}>
                        {key.status}
                      </Badge>
                    </div>
                    
                    <h4 className="text-[#1B254B] font-bold mb-1">{key.keyNumber}</h4>
                    <p className="text-sm text-gray-500 mb-3">{key.location}</p>
                    <p className="text-xs text-gray-400 mb-3">Type: {key.keyType}</p>
                    
                    {key.issuedTo && (
                      <div className="p-3 bg-gray-50 rounded-lg mb-3">
                        <p className="text-xs text-gray-500 mb-1">Issued To</p>
                        <p className="text-sm text-[#1B254B] font-bold">{key.issuedTo}</p>
                        <p className="text-xs text-gray-400 mt-1">On: {key.issuedDate}</p>
                      </div>
                    )}
                    
                    {key.status === 'issued' && (
                      <Button 
                        onClick={() => handleReturnKey(key.id)}
                        variant="outline"
                        size="sm"
                        className="w-full border-gray-200"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Returned
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'keypersons' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button 
                  onClick={() => setShowKeyPersonDialog(true)}
                  className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90"
                >
                  <UserCog className="w-4 h-4 mr-2" />
                  Add Key Person
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {keyPersons
                  .filter(person => {
                    if (!searchQuery.trim()) return true;
                    const query = searchQuery.toLowerCase();
                    return (
                      person.name.toLowerCase().includes(query) ||
                      person.designation.toLowerCase().includes(query) ||
                      person.department.toLowerCase().includes(query) ||
                      (person.specialInstructions && person.specialInstructions.toLowerCase().includes(query))
                    );
                  })
                  .map((person) => (
                  <Card key={person.id} className="p-6 border-gray-100 hover:shadow-lg transition-all">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center text-2xl font-bold">
                        {person.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[#1B254B] font-bold">{person.name}</h4>
                          <Badge variant="outline" className={`text-xs ${
                            person.accessLevel === 'high' ? 'bg-red-50 text-red-600' :
                            person.accessLevel === 'medium' ? 'bg-orange-50 text-orange-600' :
                            'bg-blue-50 text-blue-600'
                          }`}>
                            {person.accessLevel} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500">{person.designation}</p>
                        <p className="text-xs text-gray-400">{person.department}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{person.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{person.email}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100 mt-3">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-xs text-gray-600 font-bold uppercase tracking-wide">Special Instructions / Notes</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-6 h-6 hover:bg-yellow-100 text-gray-500 hover:text-gray-700"
                          onClick={() => {
                            setSelectedKeyPerson(person);
                            setEditNoteForm(person.specialInstructions || '');
                            setShowEditNoteDialog(true);
                          }}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                      <p className="text-sm text-[#1B254B]">
                        {person.specialInstructions || <span className="text-gray-400 italic">No instructions specified. Click edit to add notes.</span>}
                      </p>
                    </div>

                    {person.emergencyContact && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg">
                        <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Emergency Contact</p>
                        <p className="text-sm text-red-600 font-bold">{person.emergencyContact}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'active' && (
            <div className="space-y-6">
              {/* Filters */}
              <Card className="p-6 border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Status Filter</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="waiting">Waiting</SelectItem>
                        <SelectItem value="in-meeting">In Meeting</SelectItem>
                        <SelectItem value="checked-out">Checked Out</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Visitor Type</Label>
                    <Select value={visitorTypeFilter} onValueChange={setVisitorTypeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="vendor">Vendor</SelectItem>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="candidate">Candidate</SelectItem>
                        <SelectItem value="guest">Guest</SelectItem>
                        <SelectItem value="courier">Courier</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setStatusFilter('all');
                        setVisitorTypeFilter('all');
                        toast.info('Filters cleared');
                      }}
                      className="w-full"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Active Visitors Grid */}
              <div className="space-y-4">
                 {visitors
                   .filter(v => statusFilter === 'all' || v.status === statusFilter)
                   .filter(v => visitorTypeFilter === 'all' || v.visitorType === visitorTypeFilter)
                   .filter(v => {
                     if (!searchQuery.trim()) return true;
                     const query = searchQuery.toLowerCase();
                     return (
                       v.name.toLowerCase().includes(query) ||
                       v.company.toLowerCase().includes(query) ||
                       v.visitingPerson.toLowerCase().includes(query) ||
                       (v.badgeNumber && v.badgeNumber.toLowerCase().includes(query)) ||
                       v.visitorType.toLowerCase().includes(query)
                     );
                   })
                   .map((visitor) => (
                    <Card key={visitor.id} className="p-6 border-gray-100 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold ${
                            visitor.visitorType === 'client' ? 'bg-blue-100 text-blue-600' :
                            visitor.visitorType === 'vendor' ? 'bg-purple-100 text-purple-600' :
                            visitor.visitorType === 'candidate' ? 'bg-green-100 text-green-600' :
                            visitor.visitorType === 'courier' ? 'bg-orange-100 text-orange-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {visitor.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-[#1B254B] font-bold text-lg">{visitor.name}</h4>
                              <Badge variant="outline" className={`text-xs ${
                                visitor.status === 'in-meeting' ? 'bg-blue-50 text-blue-600' :
                                visitor.status === 'waiting' ? 'bg-yellow-50 text-yellow-600' :
                                visitor.status === 'checked-out' ? 'bg-gray-50 text-gray-600' :
                                'bg-red-50 text-red-600'
                              }`}>
                                {visitor.status}
                              </Badge>
                              {visitor.badgeNumber && (
                                <Badge variant="outline" className="text-xs bg-purple-50 text-purple-600">
                                  {visitor.badgeNumber}
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Company</p>
                                <p className="text-sm text-[#1B254B]">{visitor.company}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Visiting</p>
                                <p className="text-sm text-[#1B254B]">{visitor.visitingPerson}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Department</p>
                                <p className="text-sm text-[#1B254B]">{visitor.department}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Check-In</p>
                                <p className="text-sm text-[#1B254B]">{visitor.checkInTime}</p>
                              </div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Purpose</p>
                              <p className="text-sm text-[#1B254B]">{visitor.purpose}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4 border-t border-gray-100">
                        {visitor.status === 'waiting' && (
                          <>
                            <Button
                              onClick={() => handleApprove(visitor.id)}
                              className="bg-emerald-600 hover:bg-emerald-700"
                              size="sm"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve & Move to Meeting
                            </Button>
                            <Button
                              onClick={() => handleReject(visitor.id)}
                              variant="outline"
                              className="border-red-200 text-red-600 hover:bg-red-50"
                              size="sm"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </>
                        )}
                        {visitor.status === 'in-meeting' && (
                          <Button
                            onClick={() => handleCheckOut(visitor.id)}
                            className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90"
                            size="sm"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Check Out
                          </Button>
                        )}
                        <Button
                          onClick={() => handleViewDetails(visitor)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <Card className="p-6 border-gray-100">
                <h3 className="text-[#1B254B] font-bold text-lg mb-4">Visitor History</h3>
                <div className="space-y-3">
                  {visitors
                    .filter(v => v.status === 'checked-out')
                    .filter(v => {
                      if (!searchQuery.trim()) return true;
                      const query = searchQuery.toLowerCase();
                      return (
                        v.name.toLowerCase().includes(query) ||
                        v.company.toLowerCase().includes(query) ||
                        v.visitingPerson.toLowerCase().includes(query) ||
                        (v.badgeNumber && v.badgeNumber.toLowerCase().includes(query)) ||
                        v.visitorType.toLowerCase().includes(query)
                      );
                    })
                    .map((visitor) => (
                      <div key={visitor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                        onClick={() => handleViewDetails(visitor)}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                            <User className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-sm font-bold text-[#1B254B]">{visitor.name}</p>
                              <span className="text-xs text-gray-400">•</span>
                              <p className="text-xs text-gray-500">{visitor.company}</p>
                            </div>
                            <p className="text-xs text-gray-400">
                              {visitor.checkInTime} - {visitor.checkOutTime} • {visitor.date}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Completed
                        </Badge>
                      </div>
                    ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 border-gray-100">
                  <h3 className="text-[#1B254B] font-bold mb-4">Visitor Types</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Vendors</span>
                      <span className="text-[#1B254B] font-bold">
                        {visitors.filter(v => v.visitorType === 'vendor').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Clients</span>
                      <span className="text-[#1B254B] font-bold">
                        {visitors.filter(v => v.visitorType === 'client').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Candidates</span>
                      <span className="text-[#1B254B] font-bold">
                        {visitors.filter(v => v.visitorType === 'candidate').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Guests</span>
                      <span className="text-[#1B254B] font-bold">
                        {visitors.filter(v => v.visitorType === 'guest').length}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-gray-100">
                  <h3 className="text-[#1B254B] font-bold mb-4">Status Overview</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Waiting</span>
                      <span className="text-yellow-600 font-bold">
                        {visitors.filter(v => v.status === 'waiting').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">In Meeting</span>
                      <span className="text-blue-600 font-bold">
                        {visitors.filter(v => v.status === 'in-meeting').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Checked Out</span>
                      <span className="text-green-600 font-bold">
                        {visitors.filter(v => v.status === 'checked-out').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Rejected</span>
                      <span className="text-red-600 font-bold">
                        {visitors.filter(v => v.status === 'rejected').length}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 border-gray-100">
                  <h3 className="text-[#1B254B] font-bold mb-4">Approvals Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Corporate Guests</span>
                      <span className="text-purple-600 font-bold">
                        {corporateGuests.filter(g => g.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Interview Candidates</span>
                      <span className="text-emerald-600 font-bold">
                        {interviewCandidates.filter(c => c.status === 'pending').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Government Officials</span>
                      <span className="text-orange-600 font-bold">
                        {governmentOfficials.filter(o => o.status === 'pending').length}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card className="p-6 border-gray-100">
                <h3 className="text-[#1B254B] font-bold text-lg mb-4">Reception Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Operating Hours</Label>
                    <Input value="8:00 AM - 6:00 PM" disabled />
                  </div>
                  <div>
                    <Label>Badge Prefix</Label>
                    <Input value="B-" disabled />
                  </div>
                  <div>
                    <Label>Auto-Notification</Label>
                    <Select defaultValue="enabled">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="enabled">Enabled</SelectItem>
                        <SelectItem value="disabled">Disabled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Dialog: New Visitor Check-In */}
      <Dialog open={showNewVisitorDialog} onOpenChange={setShowNewVisitorDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>New Visitor Check-In</DialogTitle>
            <DialogDescription>Register a new visitor entry</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={newVisitorForm.name}
                  onChange={(e) => setNewVisitorForm({ ...newVisitorForm, name: e.target.value })}
                  placeholder="Enter visitor name"
                />
              </div>
              <div>
                <Label>Company *</Label>
                <Input
                  value={newVisitorForm.company}
                  onChange={(e) => setNewVisitorForm({ ...newVisitorForm, company: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Phone Number *</Label>
                <Input
                  value={newVisitorForm.phone}
                  onChange={(e) => setNewVisitorForm({ ...newVisitorForm, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={newVisitorForm.email}
                  onChange={(e) => setNewVisitorForm({ ...newVisitorForm, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Visiting Person *</Label>
                <Input
                  value={newVisitorForm.visitingPerson}
                  onChange={(e) => setNewVisitorForm({ ...newVisitorForm, visitingPerson: e.target.value })}
                  placeholder="Person to meet"
                />
              </div>
              <div>
                <Label>Department *</Label>
                <Select
                  value={newVisitorForm.department}
                  onValueChange={(value) => setNewVisitorForm({ ...newVisitorForm, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Assembly">Assembly</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Visitor Type *</Label>
              <Select
                value={newVisitorForm.visitorType}
                onValueChange={(value: any) => setNewVisitorForm({ ...newVisitorForm, visitorType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="candidate">Candidate</SelectItem>
                  <SelectItem value="guest">Guest</SelectItem>
                  <SelectItem value="courier">Courier</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Purpose of Visit *</Label>
              <Textarea
                value={newVisitorForm.purpose}
                onChange={(e) => setNewVisitorForm({ ...newVisitorForm, purpose: e.target.value })}
                placeholder="Describe the purpose of visit"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>ID Proof Type *</Label>
                <Select
                  value={newVisitorForm.idProof}
                  onValueChange={(value) => setNewVisitorForm({ ...newVisitorForm, idProof: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aadhaar Card">Aadhaar Card</SelectItem>
                    <SelectItem value="PAN Card">PAN Card</SelectItem>
                    <SelectItem value="Driving License">Driving License</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>ID Proof Number *</Label>
                <Input
                  value={newVisitorForm.idProofNumber}
                  onChange={(e) => setNewVisitorForm({ ...newVisitorForm, idProofNumber: e.target.value })}
                  placeholder="Enter ID number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Vehicle Number (if any)</Label>
                <Input
                  value={newVisitorForm.vehicleNumber}
                  onChange={(e) => setNewVisitorForm({ ...newVisitorForm, vehicleNumber: e.target.value })}
                  placeholder="DL 01 AB 1234"
                />
              </div>
              <div>
                <Label>Materials Brought</Label>
                <Input
                  value={newVisitorForm.materialsBrought}
                  onChange={(e) => setNewVisitorForm({ ...newVisitorForm, materialsBrought: e.target.value })}
                  placeholder="Laptop, documents, etc."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  if (!newVisitorForm.name || !newVisitorForm.company || !newVisitorForm.phone || 
                      !newVisitorForm.visitingPerson || !newVisitorForm.department || 
                      !newVisitorForm.purpose || !newVisitorForm.idProof || !newVisitorForm.idProofNumber) {
                    toast.error('Please fill all required fields');
                    return;
                  }
                  handleCheckIn(newVisitorForm);
                  setNewVisitorForm({
                    name: '',
                    company: '',
                    phone: '',
                    email: '',
                    visitingPerson: '',
                    department: '',
                    purpose: '',
                    visitorType: 'guest',
                    idProof: '',
                    idProofNumber: '',
                    vehicleNumber: '',
                    materialsBrought: ''
                  });
                }}
                className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Check-In Visitor
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewVisitorDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Visitor Details */}
      <Dialog open={showVisitorDetailsDialog} onOpenChange={setShowVisitorDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Visitor Details</DialogTitle>
            <DialogDescription>Complete information about the visitor</DialogDescription>
          </DialogHeader>
          {selectedVisitor && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center text-2xl font-bold">
                  {selectedVisitor.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1B254B]">{selectedVisitor.name}</h3>
                  <p className="text-sm text-gray-600">{selectedVisitor.company}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{selectedVisitor.status}</Badge>
                    <Badge variant="outline">{selectedVisitor.badgeNumber}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Phone</p>
                  <p className="text-sm text-[#1B254B]">{selectedVisitor.phone}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Email</p>
                  <p className="text-sm text-[#1B254B]">{selectedVisitor.email || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Visiting Person</p>
                  <p className="text-sm text-[#1B254B]">{selectedVisitor.visitingPerson}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Department</p>
                  <p className="text-sm text-[#1B254B]">{selectedVisitor.department}</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Purpose of Visit</p>
                <p className="text-sm text-[#1B254B]">{selectedVisitor.purpose}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Check-In Time</p>
                  <p className="text-sm text-[#1B254B]">{selectedVisitor.checkInTime}</p>
                </div>
                {selectedVisitor.checkOutTime && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Check-Out Time</p>
                    <p className="text-sm text-[#1B254B]">{selectedVisitor.checkOutTime}</p>
                  </div>
                )}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Temperature</p>
                  <p className="text-sm text-[#1B254B]">{selectedVisitor.temperature || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">ID Proof</p>
                  <p className="text-sm text-[#1B254B]">{selectedVisitor.idProof}</p>
                  <p className="text-xs text-gray-400 mt-1">{selectedVisitor.idProofNumber}</p>
                </div>
                {selectedVisitor.vehicleNumber && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Vehicle Number</p>
                    <p className="text-sm text-[#1B254B]">{selectedVisitor.vehicleNumber}</p>
                  </div>
                )}
              </div>

              {selectedVisitor.materialsBrought && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Materials Brought</p>
                  <p className="text-sm text-[#1B254B]">{selectedVisitor.materialsBrought}</p>
                </div>
              )}

              {selectedVisitor.remarks && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-1">Remarks</p>
                  <p className="text-sm text-[#1B254B]">{selectedVisitor.remarks}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog: Profile */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Reception Desk Profile</DialogTitle>
            <DialogDescription>Information and settings</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] text-white flex items-center justify-center">
                  <Building className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1B254B]">{receptionProfile.name}</h3>
                  <p className="text-sm text-gray-600">{receptionProfile.location}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Contact</p>
                  <p className="text-sm text-[#1B254B]">{receptionProfile.phone}</p>
                  <p className="text-xs text-gray-400">{receptionProfile.extension}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-1">Email</p>
                  <p className="text-sm text-[#1B254B]">{receptionProfile.email}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-2">Operating Shift</p>
              <p className="text-sm text-[#1B254B]">{receptionProfile.shift}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-2">Supervisor</p>
              <p className="text-sm text-[#1B254B]">{receptionProfile.supervisor}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wide mb-2">Assigned Staff</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {receptionProfile.assignedStaff.map((staff, idx) => (
                  <Badge key={idx} variant="outline">{staff}</Badge>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs text-gray-600 font-bold uppercase tracking-wide mb-2">Responsibilities</p>
              <ul className="space-y-1">
                {receptionProfile.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-sm text-[#1B254B] flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    {resp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Notifications */}
      <Dialog open={showNotificationsDialog} onOpenChange={setShowNotificationsDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>Recent alerts and updates</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markNotificationAsRead(notification.id)}
                className={`p-4 rounded-xl cursor-pointer transition-all ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50 border border-blue-100'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className={`text-xs ${
                    notification.priority === 'high' ? 'bg-red-50 text-red-600' :
                    notification.priority === 'medium' ? 'bg-orange-50 text-orange-600' :
                    'bg-blue-50 text-blue-600'
                  }`}>
                    {notification.type}
                  </Badge>
                  <span className="text-xs text-gray-400">{notification.time}</span>
                </div>
                <p className="text-sm text-[#1B254B]">{notification.message}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Issue Key */}
      <Dialog open={showIssueKeyDialog} onOpenChange={setShowIssueKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Key</DialogTitle>
            <DialogDescription>Assign a key to an employee</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Select Key *</Label>
              <Select
                value={issueKeyForm.keyNumber}
                onValueChange={(value) => setIssueKeyForm({ ...issueKeyForm, keyNumber: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose available key" />
                </SelectTrigger>
                <SelectContent>
                  {keys.filter(k => k.status === 'available').map(key => (
                    <SelectItem key={key.id} value={key.keyNumber}>
                      {key.keyNumber} - {key.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Issued To *</Label>
              <Input
                value={issueKeyForm.issuedTo}
                onChange={(e) => setIssueKeyForm({ ...issueKeyForm, issuedTo: e.target.value })}
                placeholder="Enter employee name"
              />
            </div>

            <div>
              <Label>Authorized By *</Label>
              <Input
                value={issueKeyForm.authorizedBy}
                onChange={(e) => setIssueKeyForm({ ...issueKeyForm, authorizedBy: e.target.value })}
                placeholder="Enter authorizer name"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  if (!issueKeyForm.keyNumber || !issueKeyForm.issuedTo || !issueKeyForm.authorizedBy) {
                    toast.error('Please fill all required fields');
                    return;
                  }
                  handleIssueKey(issueKeyForm);
                  setIssueKeyForm({ keyNumber: '', issuedTo: '', authorizedBy: '' });
                }}
                className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90"
              >
                <Key className="w-4 h-4 mr-2" />
                Issue Key
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowIssueKeyDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Corporate Guest Registration */}
      <Dialog open={showCorporateGuestDialog} onOpenChange={setShowCorporateGuestDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register Corporate Guest</DialogTitle>
            <DialogDescription>Add a new corporate guest entry</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Guest Name *</Label>
                <Input
                  value={corporateGuestForm.guestName}
                  onChange={(e) => setCorporateGuestForm({ ...corporateGuestForm, guestName: e.target.value })}
                  placeholder="Enter guest name"
                />
              </div>
              <div>
                <Label>Company *</Label>
                <Input
                  value={corporateGuestForm.company}
                  onChange={(e) => setCorporateGuestForm({ ...corporateGuestForm, company: e.target.value })}
                  placeholder="Enter company name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Designation *</Label>
                <Input
                  value={corporateGuestForm.designation}
                  onChange={(e) => setCorporateGuestForm({ ...corporateGuestForm, designation: e.target.value })}
                  placeholder="e.g. CEO, Director"
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input
                  value={corporateGuestForm.phone}
                  onChange={(e) => setCorporateGuestForm({ ...corporateGuestForm, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Email</Label>
                <Input
                  value={corporateGuestForm.email}
                  onChange={(e) => setCorporateGuestForm({ ...corporateGuestForm, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label>Person to Visit *</Label>
                <Input
                  value={corporateGuestForm.visitingPerson}
                  onChange={(e) => setCorporateGuestForm({ ...corporateGuestForm, visitingPerson: e.target.value })}
                  placeholder="Host name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Department *</Label>
                <Input
                  value={corporateGuestForm.department}
                  onChange={(e) => setCorporateGuestForm({ ...corporateGuestForm, department: e.target.value })}
                  placeholder="e.g. Management, IT"
                />
              </div>
              <div>
                <Label>HOD Name *</Label>
                <Input
                  value={corporateGuestForm.hodName}
                  onChange={(e) => setCorporateGuestForm({ ...corporateGuestForm, hodName: e.target.value })}
                  placeholder="HOD name"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-x-6 gap-y-5">
              <div>
                <Label>Visit Date *</Label>
                <Input
                  type="date"
                  value={corporateGuestForm.visitDate}
                  onChange={(e) => setCorporateGuestForm({ ...corporateGuestForm, visitDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Visit Time *</Label>
                <Input
                  value={corporateGuestForm.visitTime}
                  onChange={(e) => setCorporateGuestForm({ ...corporateGuestForm, visitTime: e.target.value })}
                  placeholder="e.g. 2:00 PM"
                />
              </div>
              <div>
                <Label>No. of Guests *</Label>
                <Input
                  type="number"
                  min={1}
                  value={corporateGuestForm.numberOfGuests}
                  onChange={(e) => setCorporateGuestForm({ ...corporateGuestForm, numberOfGuests: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div>
              <Label>Purpose of Visit *</Label>
              <Textarea
                value={corporateGuestForm.purpose}
                onChange={(e) => setCorporateGuestForm({ ...corporateGuestForm, purpose: e.target.value })}
                placeholder="Purpose of visit"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  if (!corporateGuestForm.guestName || !corporateGuestForm.company || !corporateGuestForm.designation ||
                      !corporateGuestForm.phone || !corporateGuestForm.visitingPerson || !corporateGuestForm.hodName ||
                      !corporateGuestForm.purpose) {
                    toast.error('Please fill all required fields');
                    return;
                  }
                  handleAddCorporateGuest();
                }}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:opacity-90 text-white"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Register Corporate Guest
              </Button>
              <Button variant="outline" onClick={() => setShowCorporateGuestDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Interview Candidate Registration */}
      <Dialog open={showInterviewCandidateDialog} onOpenChange={setShowInterviewCandidateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register Interview Candidate</DialogTitle>
            <DialogDescription>Add a new interview candidate entry</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Candidate Name *</Label>
                <Input
                  value={interviewCandidateForm.candidateName}
                  onChange={(e) => setInterviewCandidateForm({ ...interviewCandidateForm, candidateName: e.target.value })}
                  placeholder="Candidate full name"
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input
                  value={interviewCandidateForm.phone}
                  onChange={(e) => setInterviewCandidateForm({ ...interviewCandidateForm, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Email</Label>
                <Input
                  value={interviewCandidateForm.email}
                  onChange={(e) => setInterviewCandidateForm({ ...interviewCandidateForm, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <Label>Position Applied *</Label>
                <Input
                  value={interviewCandidateForm.position}
                  onChange={(e) => setInterviewCandidateForm({ ...interviewCandidateForm, position: e.target.value })}
                  placeholder="Job position"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Department *</Label>
                <Input
                  value={interviewCandidateForm.department}
                  onChange={(e) => setInterviewCandidateForm({ ...interviewCandidateForm, department: e.target.value })}
                  placeholder="e.g. IT, HR, QA"
                />
              </div>
              <div>
                <Label>Interviewer Name *</Label>
                <Input
                  value={interviewCandidateForm.interviewerName}
                  onChange={(e) => setInterviewCandidateForm({ ...interviewCandidateForm, interviewerName: e.target.value })}
                  placeholder="Interviewer name"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-x-6 gap-y-5">
              <div>
                <Label>Interview Date *</Label>
                <Input
                  type="date"
                  value={interviewCandidateForm.interviewDate}
                  onChange={(e) => setInterviewCandidateForm({ ...interviewCandidateForm, interviewDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Interview Time *</Label>
                <Input
                  value={interviewCandidateForm.interviewTime}
                  onChange={(e) => setInterviewCandidateForm({ ...interviewCandidateForm, interviewTime: e.target.value })}
                  placeholder="e.g. 10:00 AM"
                />
              </div>
              <div>
                <Label>HR Coordinator *</Label>
                <Input
                  value={interviewCandidateForm.hrName}
                  onChange={(e) => setInterviewCandidateForm({ ...interviewCandidateForm, hrName: e.target.value })}
                  placeholder="HR Name"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  if (!interviewCandidateForm.candidateName || !interviewCandidateForm.phone ||
                      !interviewCandidateForm.position || !interviewCandidateForm.department ||
                      !interviewCandidateForm.interviewerName || !interviewCandidateForm.hrName) {
                    toast.error('Please fill all required fields');
                    return;
                  }
                  handleAddInterviewCandidate();
                }}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:opacity-90 text-white"
              >
                <GraduationCap className="w-4 h-4 mr-2" />
                Register Candidate
              </Button>
              <Button variant="outline" onClick={() => setShowInterviewCandidateDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Government Official Registration */}
      <Dialog open={showGovernmentOfficialDialog} onOpenChange={setShowGovernmentOfficialDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register Government Official</DialogTitle>
            <DialogDescription>Add a new government official entry</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Official Name *</Label>
                <Input
                  value={governmentOfficialForm.officialName}
                  onChange={(e) => setGovernmentOfficialForm({ ...governmentOfficialForm, officialName: e.target.value })}
                  placeholder="Official full name"
                />
              </div>
              <div>
                <Label>Designation *</Label>
                <Input
                  value={governmentOfficialForm.designation}
                  onChange={(e) => setGovernmentOfficialForm({ ...governmentOfficialForm, designation: e.target.value })}
                  placeholder="e.g. Joint Secretary, Inspector"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Ministry/Department *</Label>
                <Input
                  value={governmentOfficialForm.ministry}
                  onChange={(e) => setGovernmentOfficialForm({ ...governmentOfficialForm, ministry: e.target.value })}
                  placeholder="e.g. Ministry of Industry"
                />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input
                  value={governmentOfficialForm.phone}
                  onChange={(e) => setGovernmentOfficialForm({ ...governmentOfficialForm, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Email</Label>
                <Input
                  value={governmentOfficialForm.email}
                  onChange={(e) => setGovernmentOfficialForm({ ...governmentOfficialForm, email: e.target.value })}
                  placeholder="email@gov.in"
                />
              </div>
              <div>
                <Label>Person to Visit *</Label>
                <Input
                  value={governmentOfficialForm.visitingPerson}
                  onChange={(e) => setGovernmentOfficialForm({ ...governmentOfficialForm, visitingPerson: e.target.value })}
                  placeholder="Host name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Department *</Label>
                <Input
                  value={governmentOfficialForm.department}
                  onChange={(e) => setGovernmentOfficialForm({ ...governmentOfficialForm, department: e.target.value })}
                  placeholder="Host department"
                />
              </div>
              <div>
                <Label>HOD/Manager *</Label>
                <Input
                  value={governmentOfficialForm.hodName}
                  onChange={(e) => setGovernmentOfficialForm({ ...governmentOfficialForm, hodName: e.target.value })}
                  placeholder="HOD name"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-x-6 gap-y-5">
              <div>
                <Label>Visit Date *</Label>
                <Input
                  type="date"
                  value={governmentOfficialForm.visitDate}
                  onChange={(e) => setGovernmentOfficialForm({ ...governmentOfficialForm, visitDate: e.target.value })}
                />
              </div>
              <div>
                <Label>Visit Time *</Label>
                <Input
                  value={governmentOfficialForm.visitTime}
                  onChange={(e) => setGovernmentOfficialForm({ ...governmentOfficialForm, visitTime: e.target.value })}
                  placeholder="e.g. 11:00 AM"
                />
              </div>
              <div>
                <Label>No. of Officials *</Label>
                <Input
                  type="number"
                  min={1}
                  value={governmentOfficialForm.numberOfOfficials}
                  onChange={(e) => setGovernmentOfficialForm({ ...governmentOfficialForm, numberOfOfficials: parseInt(e.target.value) || 1 })}
                />
              </div>
            </div>

            <div>
              <Label>Purpose of Visit *</Label>
              <Textarea
                value={governmentOfficialForm.purpose}
                onChange={(e) => setGovernmentOfficialForm({ ...governmentOfficialForm, purpose: e.target.value })}
                placeholder="Describe purpose of official visit"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  if (!governmentOfficialForm.officialName || !governmentOfficialForm.designation ||
                      !governmentOfficialForm.ministry || !governmentOfficialForm.phone ||
                      !governmentOfficialForm.visitingPerson || !governmentOfficialForm.hodName ||
                      !governmentOfficialForm.purpose) {
                    toast.error('Please fill all required fields');
                    return;
                  }
                  handleAddGovernmentOfficial();
                }}
                className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90 text-white"
              >
                <Shield className="w-4 h-4 mr-2" />
                Register Official
              </Button>
              <Button variant="outline" onClick={() => setShowGovernmentOfficialDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Add Key Person */}
      <Dialog open={showKeyPersonDialog} onOpenChange={setShowKeyPersonDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Key Representative</DialogTitle>
            <DialogDescription>Add a new representative authorized for keys</DialogDescription>
          </DialogHeader>
          <div className="space-y-5 mt-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Full Name *</Label>
                <Input
                  value={keyPersonForm.name}
                  onChange={(e) => setKeyPersonForm({ ...keyPersonForm, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label>Designation *</Label>
                <Input
                  value={keyPersonForm.designation}
                  onChange={(e) => setKeyPersonForm({ ...keyPersonForm, designation: e.target.value })}
                  placeholder="Designation"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Department *</Label>
                <Input
                  value={keyPersonForm.department}
                  onChange={(e) => setKeyPersonForm({ ...keyPersonForm, department: e.target.value })}
                  placeholder="Department"
                />
              </div>
              <div>
                <Label>Access Level *</Label>
                <Select
                  value={keyPersonForm.accessLevel}
                  onValueChange={(val: any) => setKeyPersonForm({ ...keyPersonForm, accessLevel: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <Label>Phone Number *</Label>
                <Input
                  value={keyPersonForm.phone}
                  onChange={(e) => setKeyPersonForm({ ...keyPersonForm, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={keyPersonForm.email}
                  onChange={(e) => setKeyPersonForm({ ...keyPersonForm, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div>
              <Label>Emergency Contact Number</Label>
              <Input
                value={keyPersonForm.emergencyContact}
                onChange={(e) => setKeyPersonForm({ ...keyPersonForm, emergencyContact: e.target.value })}
                placeholder="Emergency contact"
              />
            </div>

            <div>
              <Label>Special Instructions / Notes</Label>
              <Textarea
                value={keyPersonForm.specialInstructions}
                onChange={(e) => setKeyPersonForm({ ...keyPersonForm, specialInstructions: e.target.value })}
                placeholder="Notes or authorization instructions"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  if (!keyPersonForm.name || !keyPersonForm.designation || !keyPersonForm.department || !keyPersonForm.phone) {
                    toast.error('Please fill all required fields');
                    return;
                  }
                  handleAddKeyPerson();
                }}
                className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90 text-white"
              >
                <UserCog className="w-4 h-4 mr-2" />
                Add Key Person
              </Button>
              <Button variant="outline" onClick={() => setShowKeyPersonDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Edit Key Person Special Instructions */}
      <Dialog open={showEditNoteDialog} onOpenChange={setShowEditNoteDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Notes / Special Instructions</DialogTitle>
            <DialogDescription>
              Update special instructions for {selectedKeyPerson?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label>Special Instructions / Notes</Label>
              <Textarea
                value={editNoteForm}
                onChange={(e) => setEditNoteForm(e.target.value)}
                placeholder="Enter special instructions or notes..."
                rows={4}
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSaveNote}
                className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:opacity-90"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Notes
              </Button>
              <Button variant="outline" onClick={() => setShowEditNoteDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}