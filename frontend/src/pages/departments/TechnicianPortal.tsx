import { useState } from 'react';
import { motion } from 'motion/react';
import {
    Wrench,
    Plus,
    CheckCircle,
    XCircle,
    Search,
    Download,
    Bell,
    Settings,
    LogOut,
    Calendar,
    Clock,
    Users,
    AlertTriangle,
    TrendingUp,
    Filter,
    ClipboardList,
    Activity,
    BarChart3,
    History,
    Home,
    ChevronLeft,
    ChevronRight,
    Package,
    Zap,
    FileText
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';

interface MaintenanceRequest {
    id: string;
    equipmentName: string;
    equipmentId: string;
    department: string;
    issueType: 'breakdown' | 'preventive' | 'repair' | 'inspection';
    priority: 'low' | 'medium' | 'high' | 'critical';
    status: 'pending' | 'assigned' | 'in-progress' | 'completed' | 'on-hold';
    reportedBy: string;
    reportedDate: string;
    assignedTo?: string;
    description: string;
    estimatedTime?: string;
}

interface Equipment {
    id: string;
    name: string;
    type: string;
    location: string;
    status: 'operational' | 'maintenance' | 'repair' | 'decommissioned';
    lastService: string;
    nextService: string;
}

export function TechnicianPortal() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showNewRequestDialog, setShowNewRequestDialog] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const notifications = [
        { id: 1, title: 'Critical: CNC Machine A1 Down', message: 'Urgent maintenance required for CNC Machine A1', time: '5 min ago', type: 'critical' },
        { id: 2, title: 'New Request Assigned', message: 'Conveyor Belt B2 repair assigned to you', time: '15 min ago', type: 'info' },
        { id: 3, title: 'Service Reminder', message: 'Packaging Machine C1 scheduled for preventive maintenance', time: '1 hour ago', type: 'warning' },
        { id: 4, title: 'Request Completed', message: 'Motor Assembly Unit repair completed successfully', time: '2 hours ago', type: 'success' }
    ];

    const [requests, setRequests] = useState<MaintenanceRequest[]>([
        {
            id: 'MR001',
            equipmentName: 'CNC Machine A1',
            equipmentId: 'CNC-001',
            department: 'Assembly',
            issueType: 'breakdown',
            priority: 'critical',
            status: 'pending',
            reportedBy: 'Rohit Sharma',
            reportedDate: '2025-01-15',
            description: 'Machine not starting, power issue suspected'
        },
        {
            id: 'MR002',
            equipmentName: 'Conveyor Belt B2',
            equipmentId: 'CONV-002',
            department: 'Production',
            issueType: 'repair',
            priority: 'high',
            status: 'in-progress',
            reportedBy: 'Amit Kumar',
            reportedDate: '2025-01-14',
            assignedTo: 'Vikram Singh',
            description: 'Belt slipping, needs replacement',
            estimatedTime: '4 hours'
        },
        {
            id: 'MR003',
            equipmentName: 'Packaging Machine C1',
            equipmentId: 'PKG-001',
            department: 'Packaging',
            issueType: 'preventive',
            priority: 'medium',
            status: 'completed',
            reportedBy: 'Priya Patel',
            reportedDate: '2025-01-10',
            assignedTo: 'Rajesh Kumar',
            description: 'Monthly preventive maintenance'
        }
    ]);

    const [equipment] = useState<Equipment[]>([
        { id: 'CNC-001', name: 'CNC Machine A1', type: 'CNC', location: 'Assembly Hall A', status: 'maintenance', lastService: '2024-12-15', nextService: '2025-03-15' },
        { id: 'CONV-002', name: 'Conveyor Belt B2', type: 'Conveyor', location: 'Production Line B', status: 'repair', lastService: '2024-11-20', nextService: '2025-02-20' },
        { id: 'PKG-001', name: 'Packaging Machine C1', type: 'Packaging', location: 'Packaging Zone C', status: 'operational', lastService: '2025-01-10', nextService: '2025-04-10' },
        { id: 'WLD-003', name: 'Welding Station D3', type: 'Welding', location: 'Welding Bay D', status: 'operational', lastService: '2024-12-01', nextService: '2025-03-01' }
    ]);

    const [newRequest, setNewRequest] = useState({
        equipmentName: '',
        equipmentId: '',
        department: '',
        issueType: 'repair',
        priority: 'medium',
        description: ''
    });

    const stats = [
        { title: 'Pending Requests', value: requests.filter(r => r.status === 'pending').length.toString(), icon: ClipboardList, color: 'text-orange-600', bgColor: 'bg-orange-100' },
        { title: 'In Progress', value: requests.filter(r => r.status === 'in-progress').length.toString(), icon: Activity, color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { title: 'Completed Today', value: requests.filter(r => r.status === 'completed').length.toString(), icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
        { title: 'Equipment Issues', value: equipment.filter(e => e.status !== 'operational').length.toString(), icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-100' }
    ];

    const sidebarMenuItems = [
        { icon: Home, label: 'Dashboard', value: 'dashboard' },
        { icon: ClipboardList, label: 'Requests', value: 'requests' },
        { icon: Package, label: 'Equipment', value: 'equipment' },
        { icon: History, label: 'History', value: 'history' },
        { icon: BarChart3, label: 'Analytics', value: 'analytics' },
        { icon: Settings, label: 'Settings', value: 'settings' }
    ];

    const handleCreateRequest = () => {
        if (newRequest.equipmentName && newRequest.description) {
            const request: MaintenanceRequest = {
                id: `MR${String(requests.length + 1).padStart(3, '0')}`,
                equipmentName: newRequest.equipmentName,
                equipmentId: newRequest.equipmentId || 'N/A',
                department: newRequest.department || 'General',
                issueType: newRequest.issueType as MaintenanceRequest['issueType'],
                priority: newRequest.priority as MaintenanceRequest['priority'],
                status: 'pending',
                reportedBy: 'Current User',
                reportedDate: new Date().toISOString().split('T')[0],
                description: newRequest.description
            };
            setRequests([request, ...requests]);
            setNewRequest({ equipmentName: '', equipmentId: '', department: '', issueType: 'repair', priority: 'medium', description: '' });
            setShowNewRequestDialog(false);
            alert('Maintenance request created successfully!');
        }
    };

    const handleAssignRequest = (requestId: string) => {
        setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'assigned' as const, assignedTo: 'Vikram Singh' } : r));
        alert(`Request ${requestId} assigned to Vikram Singh`);
    };

    const handleStartWork = (requestId: string) => {
        setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'in-progress' as const } : r));
        alert(`Work started on request ${requestId}`);
    };

    const handleCompleteRequest = (requestId: string) => {
        setRequests(requests.map(r => r.id === requestId ? { ...r, status: 'completed' as const } : r));
        alert(`Request ${requestId} marked as completed`);
    };

    const handleLogout = () => {
        window.location.reload();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'assigned': return 'bg-purple-100 text-purple-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'on-hold': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'critical': return 'bg-red-500 text-white';
            case 'high': return 'bg-orange-500 text-white';
            case 'medium': return 'bg-yellow-500 text-white';
            case 'low': return 'bg-green-500 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={stat.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <Card className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                                                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                                            </div>
                                            <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        <Card className="p-6 bg-white border-0 shadow-lg">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Maintenance Requests</h3>
                            <div className="space-y-4">
                                {requests.slice(0, 5).map((request) => (
                                    <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getPriorityColor(request.priority)}`}>
                                                <Wrench className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{request.equipmentName}</p>
                                                <p className="text-sm text-gray-600">{request.description.slice(0, 50)}...</p>
                                            </div>
                                        </div>
                                        <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );

            case 'requests':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search requests..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={() => setShowNewRequestDialog(true)} className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B]">
                                <Plus className="w-4 h-4 mr-2" />
                                New Request
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {requests.filter(r => r.equipmentName.toLowerCase().includes(searchQuery.toLowerCase())).map((request) => (
                                <Card key={request.id} className="p-6 bg-white border-0 shadow-lg">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Badge className={getPriorityColor(request.priority)}>{request.priority.toUpperCase()}</Badge>
                                            <h4 className="font-bold text-gray-900">{request.equipmentName}</h4>
                                            <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                                        </div>
                                        <span className="text-sm text-gray-500">{request.id}</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">{request.description}</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                                        <div>
                                            <p className="text-gray-500">Equipment ID</p>
                                            <p className="font-medium">{request.equipmentId}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Department</p>
                                            <p className="font-medium">{request.department}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Reported By</p>
                                            <p className="font-medium">{request.reportedBy}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Date</p>
                                            <p className="font-medium">{request.reportedDate}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-4 border-t">
                                        {request.status === 'pending' && (
                                            <Button onClick={() => handleAssignRequest(request.id)} className="bg-purple-600 hover:bg-purple-700">
                                                Assign Technician
                                            </Button>
                                        )}
                                        {request.status === 'assigned' && (
                                            <Button onClick={() => handleStartWork(request.id)} className="bg-blue-600 hover:bg-blue-700">
                                                Start Work
                                            </Button>
                                        )}
                                        {request.status === 'in-progress' && (
                                            <Button onClick={() => handleCompleteRequest(request.id)} className="bg-green-600 hover:bg-green-700">
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Mark Complete
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 'equipment':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {equipment.map((equip) => (
                                <Card key={equip.id} className="p-6 bg-white border-0 shadow-lg">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                                            <Package className="w-6 h-6 text-white" />
                                        </div>
                                        <Badge className={
                                            equip.status === 'operational' ? 'bg-green-100 text-green-800' :
                                                equip.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                                                    equip.status === 'repair' ? 'bg-red-100 text-red-800' :
                                                        'bg-gray-100 text-gray-800'
                                        }>
                                            {equip.status}
                                        </Badge>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">{equip.name}</h4>
                                    <p className="text-sm text-gray-500 mb-4">{equip.id} • {equip.type}</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Location</span>
                                            <span className="font-medium">{equip.location}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Last Service</span>
                                            <span className="font-medium">{equip.lastService}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Next Service</span>
                                            <span className="font-medium">{equip.nextService}</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 'history':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Maintenance History</h3>
                            <Button variant="outline" className="gap-2">
                                <Download className="w-4 h-4" />
                                Export Report
                            </Button>
                        </div>
                        <Card className="p-6 bg-white border-0 shadow-lg">
                            <div className="space-y-4">
                                {[
                                    { id: 'MR-H001', equipment: 'CNC Machine A1', type: 'Repair', date: '2025-01-10', technician: 'Vikram Singh', duration: '3 hours', status: 'Completed' },
                                    { id: 'MR-H002', equipment: 'Conveyor Belt B2', type: 'Preventive', date: '2025-01-08', technician: 'Rajesh Kumar', duration: '2 hours', status: 'Completed' },
                                    { id: 'MR-H003', equipment: 'Welding Station D3', type: 'Inspection', date: '2025-01-05', technician: 'Amit Patel', duration: '1 hour', status: 'Completed' },
                                    { id: 'MR-H004', equipment: 'Packaging Machine C1', type: 'Breakdown', date: '2025-01-03', technician: 'Vikram Singh', duration: '5 hours', status: 'Completed' },
                                    { id: 'MR-H005', equipment: 'CNC Machine A2', type: 'Preventive', date: '2024-12-28', technician: 'Rajesh Kumar', duration: '2 hours', status: 'Completed' }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] flex items-center justify-center">
                                                <History className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.equipment}</p>
                                                <p className="text-sm text-gray-600">{item.type} • {item.technician} • {item.duration}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <Badge className="bg-green-100 text-green-800">{item.status}</Badge>
                                            <p className="text-sm text-gray-500 mt-1">{item.date}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>
                );

            case 'analytics':
                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: 'Total Requests', value: '156', change: '+12%', color: 'text-blue-600', bgColor: 'bg-blue-100' },
                                { title: 'Avg Response Time', value: '2.5h', change: '-18%', color: 'text-green-600', bgColor: 'bg-green-100' },
                                { title: 'First-Time Fix Rate', value: '87%', change: '+5%', color: 'text-purple-600', bgColor: 'bg-purple-100' },
                                { title: 'Equipment Uptime', value: '94.2%', change: '+2%', color: 'text-orange-600', bgColor: 'bg-orange-100' }
                            ].map((stat, index) => (
                                <Card key={index} className="p-6 bg-white border-0 shadow-lg">
                                    <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                                    <div className="flex items-end justify-between">
                                        <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                                        <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="p-6 bg-white border-0 shadow-lg">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Request Types Distribution</h3>
                                <div className="space-y-4">
                                    {[
                                        { type: 'Breakdown', count: 45, percentage: 29, color: 'bg-red-500' },
                                        { type: 'Repair', count: 52, percentage: 33, color: 'bg-orange-500' },
                                        { type: 'Preventive', count: 38, percentage: 24, color: 'bg-blue-500' },
                                        { type: 'Inspection', count: 21, percentage: 14, color: 'bg-green-500' }
                                    ].map((item, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-gray-900">{item.type}</span>
                                                <span className="text-gray-600">{item.count} ({item.percentage}%)</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-6 bg-white border-0 shadow-lg">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Technician Performance</h3>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Vikram Singh', completed: 42, avgTime: '2.1h', rating: '4.8' },
                                        { name: 'Rajesh Kumar', completed: 38, avgTime: '2.4h', rating: '4.6' },
                                        { name: 'Amit Patel', completed: 35, avgTime: '2.8h', rating: '4.5' },
                                        { name: 'Suresh Verma', completed: 28, avgTime: '3.1h', rating: '4.3' }
                                    ].map((tech, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm">{tech.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{tech.name}</p>
                                                    <p className="text-sm text-gray-600">{tech.completed} jobs • Avg {tech.avgTime}</p>
                                                </div>
                                            </div>
                                            <Badge className="bg-yellow-100 text-yellow-800">⭐ {tech.rating}</Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                );

            case 'settings':
                return (
                    <div className="space-y-6">
                        <Card className="p-6 bg-white border-0 shadow-lg">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Notification Settings</h3>
                            <div className="space-y-4">
                                {[
                                    { label: 'Email notifications for new requests', enabled: true },
                                    { label: 'Push notifications for urgent issues', enabled: true },
                                    { label: 'Daily summary reports', enabled: false },
                                    { label: 'Equipment service reminders', enabled: true }
                                ].map((setting, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <span className="text-gray-900">{setting.label}</span>
                                        <button
                                            className={`w-12 h-6 rounded-full transition-colors ${setting.enabled ? 'bg-[#0B4DA2]' : 'bg-gray-300'}`}
                                            onClick={() => alert(`Toggle ${setting.label}`)}
                                        >
                                            <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${setting.enabled ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="p-6 bg-white border-0 shadow-lg">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">System Preferences</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Default Priority</Label>
                                    <Select defaultValue="medium">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Auto-assign Requests</Label>
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
                            <Button className="mt-4 bg-gradient-to-r from-[#0B4DA2] to-[#042A5B]" onClick={() => alert('Settings saved!')}>
                                Save Changes
                            </Button>
                        </Card>
                    </div>
                );

            default:
                return (
                    <div className="flex items-center justify-center h-64">
                        <p className="text-gray-500">This section is under development</p>
                    </div>
                );
        }
    };

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
                            <div className="w-full h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-gray-200">
                                <img src="/Company Logo.jpg" alt="SMG Logo" className="h-14 w-auto object-contain" />
                            </div>
                            <div className="text-center">
                                <h2 className="text-[#1B254B] font-bold">Technician Portal</h2>
                                <p className="text-xs text-gray-500">Maintenance Management</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <img src="/Company Logo.jpg" alt="SMG Logo" className="w-10 h-10 object-contain rounded-lg" />
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

            <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-white border-b border-gray-200 px-8 py-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-[#1B254B]">
                                {sidebarMenuItems.find(item => item.value === activeTab)?.label || 'Dashboard'}
                            </h1>
                            <p className="text-gray-500 text-sm">Manage equipment maintenance and repairs</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <Bell className="w-6 h-6" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                </button>
                                {showNotifications && (
                                    <div className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                                        <div className="p-4 border-b border-gray-200">
                                            <h3 className="font-bold text-gray-900">Notifications</h3>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {notifications.map((notif) => (
                                                <div key={notif.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-2 h-2 rounded-full mt-2 ${notif.type === 'critical' ? 'bg-red-500' : notif.type === 'warning' ? 'bg-yellow-500' : notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 text-sm">{notif.title}</p>
                                                            <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                                                            <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 border-t border-gray-200">
                                            <button
                                                onClick={() => { setShowNotifications(false); setActiveTab('settings'); }}
                                                className="w-full text-center text-sm text-blue-600 font-medium hover:text-blue-800"
                                            >
                                                View All Notifications
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <button onClick={() => setActiveTab('settings')} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Settings className="w-6 h-6" />
                            </button>
                            <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => setActiveTab('settings')}>
                                <div className="w-8 h-8 bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">T</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Technician</p>
                                    <p className="text-xs text-gray-500">Maintenance Team</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>

            <Dialog open={showNewRequestDialog} onOpenChange={setShowNewRequestDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Maintenance Request</DialogTitle>
                        <DialogDescription>Submit a new maintenance request</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Equipment Name</Label>
                                <Input
                                    placeholder="e.g., CNC Machine A1"
                                    value={newRequest.equipmentName}
                                    onChange={(e) => setNewRequest({ ...newRequest, equipmentName: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Equipment ID</Label>
                                <Input
                                    placeholder="e.g., CNC-001"
                                    value={newRequest.equipmentId}
                                    onChange={(e) => setNewRequest({ ...newRequest, equipmentId: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Department</Label>
                                <Select value={newRequest.department} onValueChange={(v) => setNewRequest({ ...newRequest, department: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Assembly">Assembly</SelectItem>
                                        <SelectItem value="Production">Production</SelectItem>
                                        <SelectItem value="Packaging">Packaging</SelectItem>
                                        <SelectItem value="Quality">Quality</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select value={newRequest.priority} onValueChange={(v) => setNewRequest({ ...newRequest, priority: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Issue Type</Label>
                            <Select value={newRequest.issueType} onValueChange={(v) => setNewRequest({ ...newRequest, issueType: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="breakdown">Breakdown</SelectItem>
                                    <SelectItem value="repair">Repair</SelectItem>
                                    <SelectItem value="preventive">Preventive Maintenance</SelectItem>
                                    <SelectItem value="inspection">Inspection</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                placeholder="Describe the issue..."
                                value={newRequest.description}
                                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowNewRequestDialog(false)}>Cancel</Button>
                        <Button onClick={handleCreateRequest} className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B]">
                            Create Request
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
