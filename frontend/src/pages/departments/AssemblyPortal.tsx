import { useState } from 'react';
import { motion } from 'motion/react';
import {
    Package,
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
    Wrench,
    ClipboardList,
    AlertTriangle,
    TrendingUp,
    Home,
    ChevronLeft,
    ChevronRight,
    BarChart3,
    History,
    Activity,
    Cog
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';

import { triggerGlobalNotification } from '../../services/api';

interface ProductionOrder {
    id: string;
    productName: string;
    quantity: number;
    status: 'pending' | 'in-progress' | 'completed' | 'on-hold';
    assignedTo: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
    completedUnits: number;
}

interface QualityCheck {
    id: string;
    orderId: string;
    inspector: string;
    result: 'pass' | 'fail' | 'pending';
    notes: string;
    date: string;
    batchNumber: string;
}

export function AssemblyPortal() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showNewOrderDialog, setShowNewOrderDialog] = useState(false);
    const [showQualityDialog, setShowQualityDialog] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const notifications = [
        { id: 1, title: 'Order PO001 50% Complete', message: 'SMG E-Scooter Model X batch is halfway done', time: '10 min ago', type: 'info' },
        { id: 2, title: 'Quality Check Required', message: 'Batch B-46 awaiting QC inspection', time: '25 min ago', type: 'warning' },
        { id: 3, title: 'Line C Maintenance', message: 'Assembly Line C scheduled for maintenance', time: '1 hour ago', type: 'critical' },
        { id: 4, title: 'Order Completed', message: 'PO003 - SMG E-Bike Pro completed successfully', time: '2 hours ago', type: 'success' }
    ];

    const [orders, setOrders] = useState<ProductionOrder[]>([
        {
            id: 'PO001',
            productName: 'SMG E-Scooter Model X',
            quantity: 50,
            status: 'in-progress',
            assignedTo: 'Assembly Line A',
            dueDate: '2025-01-20',
            priority: 'high',
            completedUnits: 25
        },
        {
            id: 'PO002',
            productName: 'SMG E-Scooter Model Y',
            quantity: 30,
            status: 'pending',
            assignedTo: 'Assembly Line B',
            dueDate: '2025-01-25',
            priority: 'medium',
            completedUnits: 0
        },
        {
            id: 'PO003',
            productName: 'SMG E-Bike Pro',
            quantity: 20,
            status: 'completed',
            assignedTo: 'Assembly Line A',
            dueDate: '2025-01-15',
            priority: 'low',
            completedUnits: 20
        }
    ]);

    const [qualityChecks, setQualityChecks] = useState<QualityCheck[]>([
        { id: 'QC001', orderId: 'PO001', inspector: 'Vikram Singh', result: 'pass', notes: 'All units passed', date: '2025-01-12', batchNumber: 'B-45' },
        { id: 'QC002', orderId: 'PO002', inspector: 'Priya Sharma', result: 'pending', notes: 'Awaiting inspection', date: '2025-01-14', batchNumber: 'B-46' },
        { id: 'QC003', orderId: 'PO001', inspector: 'Rajesh Kumar', result: 'fail', notes: 'Minor defects found in wiring', date: '2025-01-13', batchNumber: 'B-44' }
    ]);

    const [newOrder, setNewOrder] = useState({
        productName: '',
        quantity: '',
        assignedTo: '',
        dueDate: '',
        priority: 'medium'
    });

    const stats = [
        { title: 'Active Orders', value: orders.filter(o => o.status === 'in-progress').length.toString(), icon: ClipboardList, color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { title: 'Units Completed', value: orders.reduce((sum, o) => sum + o.completedUnits, 0).toString(), icon: Package, color: 'text-green-600', bgColor: 'bg-green-100' },
        { title: 'Pending QC', value: qualityChecks.filter(q => q.result === 'pending').length.toString(), icon: AlertTriangle, color: 'text-orange-600', bgColor: 'bg-orange-100' },
        { title: 'QC Pass Rate', value: `${Math.round((qualityChecks.filter(q => q.result === 'pass').length / qualityChecks.length) * 100)}%`, icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-100' }
    ];

    const sidebarMenuItems = [
        { icon: Home, label: 'Dashboard', value: 'dashboard' },
        { icon: ClipboardList, label: 'Production Orders', value: 'orders' },
        { icon: CheckCircle, label: 'Quality Control', value: 'quality' },
        { icon: Cog, label: 'Assembly Lines', value: 'lines' },
        { icon: History, label: 'History', value: 'history' },
        { icon: BarChart3, label: 'Analytics', value: 'analytics' },
        { icon: Settings, label: 'Settings', value: 'settings' }
    ];

    const handleCreateOrder = () => {
        if (newOrder.productName && newOrder.quantity) {
            const orderId = `PO${String(orders.length + 1).padStart(3, '0')}`;
            const order: ProductionOrder = {
                id: orderId,
                productName: newOrder.productName,
                quantity: parseInt(newOrder.quantity),
                status: 'pending',
                assignedTo: newOrder.assignedTo || 'Unassigned',
                dueDate: newOrder.dueDate || new Date().toISOString().split('T')[0],
                priority: newOrder.priority as 'low' | 'medium' | 'high',
                completedUnits: 0
            };
            setOrders([order, ...orders]);
            setNewOrder({ productName: '', quantity: '', assignedTo: '', dueDate: '', priority: 'medium' });
            setShowNewOrderDialog(false);
            triggerGlobalNotification('Assembly', `New production order ${orderId} for ${order.productName} has been created and assigned to ${order.assignedTo}.`, 'info');
            alert('Production order created successfully!');
        }
    };

    const handleUpdateStatus = (orderId: string, newStatus: ProductionOrder['status']) => {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        alert(`Order ${orderId} status updated to ${newStatus}`);
    };

    const handleLogout = () => {
        window.location.reload();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'in-progress': return 'bg-blue-100 text-blue-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'on-hold': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getQCResultColor = (result: string) => {
        switch (result) {
            case 'pass': return 'bg-green-100 text-green-800';
            case 'fail': return 'bg-red-100 text-red-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
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

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="p-6 bg-white border-0 shadow-lg">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Assembly Lines Status</h3>
                                <div className="space-y-3">
                                    {[
                                        { line: 'Assembly Line A', status: 'Active', units: 25, efficiency: '96%' },
                                        { line: 'Assembly Line B', status: 'Active', units: 18, efficiency: '92%' },
                                        { line: 'Assembly Line C', status: 'Maintenance', units: 0, efficiency: '-' }
                                    ].map((line, index) => (
                                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <div>
                                                <p className="font-medium text-gray-900">{line.line}</p>
                                                <p className="text-sm text-gray-600">{line.units} units today • {line.efficiency} efficiency</p>
                                            </div>
                                            <Badge className={line.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                                                {line.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-6 bg-white border-0 shadow-lg">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Quality Checks</h3>
                                <div className="space-y-3">
                                    {qualityChecks.slice(0, 3).map((check) => (
                                        <div key={check.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <div>
                                                <p className="font-medium text-gray-900">Batch {check.batchNumber}</p>
                                                <p className="text-sm text-gray-600">{check.inspector} • {check.date}</p>
                                            </div>
                                            <Badge className={getQCResultColor(check.result)}>
                                                {check.result.toUpperCase()}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                );

            case 'orders':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search orders..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button onClick={() => setShowNewOrderDialog(true)} className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B]">
                                <Plus className="w-4 h-4 mr-2" />
                                New Order
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {orders.filter(o => o.productName.toLowerCase().includes(searchQuery.toLowerCase())).map((order) => (
                                <Card key={order.id} className="p-6 bg-white border-0 shadow-lg">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(order.priority)}`}></div>
                                            <h4 className="font-bold text-gray-900">{order.productName}</h4>
                                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                                        </div>
                                        <span className="text-sm text-gray-500">{order.id}</span>
                                    </div>

                                    <div className="mb-4">
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-gray-600">Progress</span>
                                            <span className="font-medium">{order.completedUnits}/{order.quantity} units</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] h-2 rounded-full transition-all"
                                                style={{ width: `${(order.completedUnits / order.quantity) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                                        <div>
                                            <p className="text-gray-500">Assigned To</p>
                                            <p className="font-medium">{order.assignedTo}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Due Date</p>
                                            <p className="font-medium">{order.dueDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Priority</p>
                                            <p className="font-medium capitalize">{order.priority}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Quantity</p>
                                            <p className="font-medium">{order.quantity} units</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4 border-t">
                                        {order.status === 'pending' && (
                                            <Button onClick={() => handleUpdateStatus(order.id, 'in-progress')} className="bg-blue-600 hover:bg-blue-700">
                                                Start Production
                                            </Button>
                                        )}
                                        {order.status === 'in-progress' && (
                                            <>
                                                <Button onClick={() => handleUpdateStatus(order.id, 'completed')} className="bg-green-600 hover:bg-green-700">
                                                    <CheckCircle className="w-4 h-4 mr-2" />
                                                    Mark Complete
                                                </Button>
                                                <Button onClick={() => handleUpdateStatus(order.id, 'on-hold')} variant="outline" className="border-orange-500 text-orange-600">
                                                    Put On Hold
                                                </Button>
                                            </>
                                        )}
                                        {order.status === 'on-hold' && (
                                            <Button onClick={() => handleUpdateStatus(order.id, 'in-progress')} className="bg-blue-600 hover:bg-blue-700">
                                                Resume Production
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 'quality':
                return (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Quality Control Inspections</h3>
                            <Button onClick={() => setShowQualityDialog(true)} className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B]">
                                <Plus className="w-4 h-4 mr-2" />
                                Add QC Check
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {qualityChecks.map((check) => (
                                <Card key={check.id} className="p-6 bg-white border-0 shadow-lg">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-bold text-gray-900">QC #{check.id}</h4>
                                            <Badge className={getQCResultColor(check.result)}>
                                                {check.result.toUpperCase()}
                                            </Badge>
                                        </div>
                                        <span className="text-sm text-gray-500">Batch {check.batchNumber}</span>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                                        <div>
                                            <p className="text-gray-500">Order ID</p>
                                            <p className="font-medium">{check.orderId}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Inspector</p>
                                            <p className="font-medium">{check.inspector}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Date</p>
                                            <p className="font-medium">{check.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Notes</p>
                                            <p className="font-medium">{check.notes}</p>
                                        </div>
                                    </div>

                                    {check.result === 'pending' && (
                                        <div className="flex gap-2 pt-4 border-t">
                                            <Button
                                                onClick={() => {
                                                    setQualityChecks(qualityChecks.map(q => q.id === check.id ? { ...q, result: 'pass' as const } : q));
                                                    alert('Quality check marked as PASS');
                                                }}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />
                                                Mark Pass
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setQualityChecks(qualityChecks.map(q => q.id === check.id ? { ...q, result: 'fail' as const } : q));
                                                    alert('Quality check marked as FAIL');
                                                }}
                                                variant="outline"
                                                className="border-red-500 text-red-600 hover:bg-red-50"
                                            >
                                                <XCircle className="w-4 h-4 mr-2" />
                                                Mark Fail
                                            </Button>
                                        </div>
                                    )}
                                </Card>
                            ))}
                        </div>
                    </div>
                );

            case 'lines':
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">Assembly Lines Management</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { id: 'LINE-A', name: 'Assembly Line A', status: 'Active', workers: 12, capacity: '50 units/day', efficiency: '96%', currentOrder: 'PO001' },
                                { id: 'LINE-B', name: 'Assembly Line B', status: 'Active', workers: 10, capacity: '40 units/day', efficiency: '92%', currentOrder: 'PO002' },
                                { id: 'LINE-C', name: 'Assembly Line C', status: 'Maintenance', workers: 0, capacity: '45 units/day', efficiency: '-', currentOrder: '-' }
                            ].map((line) => (
                                <Card key={line.id} className="p-6 bg-white border-0 shadow-lg">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] flex items-center justify-center">
                                            <Cog className="w-6 h-6 text-white" />
                                        </div>
                                        <Badge className={line.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
                                            {line.status}
                                        </Badge>
                                    </div>
                                    <h4 className="font-bold text-gray-900 mb-1">{line.name}</h4>
                                    <p className="text-sm text-gray-500 mb-4">{line.id}</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Workers</span>
                                            <span className="font-medium">{line.workers}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Capacity</span>
                                            <span className="font-medium">{line.capacity}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Efficiency</span>
                                            <span className="font-medium">{line.efficiency}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Current Order</span>
                                            <span className="font-medium">{line.currentOrder}</span>
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
                            <h3 className="text-lg font-bold text-gray-900">Production History</h3>
                            <Button variant="outline" className="gap-2">
                                <Download className="w-4 h-4" />
                                Export Report
                            </Button>
                        </div>
                        <Card className="p-6 bg-white border-0 shadow-lg">
                            <div className="space-y-4">
                                {[
                                    { id: 'PO-H001', product: 'SMG E-Scooter Model X', quantity: 100, date: '2025-01-10', line: 'Assembly Line A', status: 'Completed' },
                                    { id: 'PO-H002', product: 'SMG E-Bike Pro', quantity: 50, date: '2025-01-08', line: 'Assembly Line B', status: 'Completed' },
                                    { id: 'PO-H003', product: 'SMG E-Scooter Model Y', quantity: 75, date: '2025-01-05', line: 'Assembly Line A', status: 'Completed' },
                                    { id: 'PO-H004', product: 'SMG E-Scooter Model Z', quantity: 60, date: '2025-01-03', line: 'Assembly Line C', status: 'Completed' },
                                    { id: 'PO-H005', product: 'SMG E-Bike Standard', quantity: 40, date: '2024-12-28', line: 'Assembly Line B', status: 'Completed' }
                                ].map((item, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0B4DA2] to-[#042A5B] flex items-center justify-center">
                                                <History className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{item.product}</p>
                                                <p className="text-sm text-gray-600">{item.line} • {item.quantity} units</p>
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
                                { title: 'Total Units Produced', value: '1,245', change: '+15%', color: 'text-blue-600' },
                                { title: 'Avg Production Time', value: '4.2h', change: '-12%', color: 'text-green-600' },
                                { title: 'Defect Rate', value: '2.1%', change: '-8%', color: 'text-purple-600' },
                                { title: 'Line Utilization', value: '87%', change: '+5%', color: 'text-orange-600' }
                            ].map((stat, index) => (
                                <Card key={index} className="p-6 bg-white border-0 shadow-lg">
                                    <p className="text-gray-600 text-sm mb-1">{stat.title}</p>
                                    <div className="flex items-end justify-between">
                                        <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
                                        <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') && stat.title.includes('Defect') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-green-600' : 'text-red-600'}`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="p-6 bg-white border-0 shadow-lg">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Production by Product</h3>
                                <div className="space-y-4">
                                    {[
                                        { product: 'E-Scooter Model X', units: 450, percentage: 36, color: 'bg-blue-500' },
                                        { product: 'E-Scooter Model Y', units: 380, percentage: 30, color: 'bg-green-500' },
                                        { product: 'E-Bike Pro', units: 280, percentage: 22, color: 'bg-purple-500' },
                                        { product: 'E-Bike Standard', units: 135, percentage: 12, color: 'bg-orange-500' }
                                    ].map((item, index) => (
                                        <div key={index} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="font-medium text-gray-900">{item.product}</span>
                                                <span className="text-gray-600">{item.units} units ({item.percentage}%)</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.percentage}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card className="p-6 bg-white border-0 shadow-lg">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Assembly Line Performance</h3>
                                <div className="space-y-4">
                                    {[
                                        { line: 'Assembly Line A', efficiency: 96, units: 520, uptime: '98%' },
                                        { line: 'Assembly Line B', efficiency: 92, units: 445, uptime: '95%' },
                                        { line: 'Assembly Line C', efficiency: 88, units: 280, uptime: '90%' }
                                    ].map((line, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] flex items-center justify-center">
                                                    <span className="text-white font-bold text-sm">{line.line.split(' ')[2]}</span>
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{line.line}</p>
                                                    <p className="text-sm text-gray-600">{line.units} units • {line.uptime} uptime</p>
                                                </div>
                                            </div>
                                            <Badge className="bg-blue-100 text-blue-800">{line.efficiency}% eff</Badge>
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
                                    { label: 'Order completion notifications', enabled: true },
                                    { label: 'Quality check alerts', enabled: true },
                                    { label: 'Daily production reports', enabled: false },
                                    { label: 'Line maintenance reminders', enabled: true }
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
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Production Settings</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Default Assembly Line</Label>
                                    <Select defaultValue="line-a">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="line-a">Assembly Line A</SelectItem>
                                            <SelectItem value="line-b">Assembly Line B</SelectItem>
                                            <SelectItem value="line-c">Assembly Line C</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Auto-schedule Orders</Label>
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
                                <h2 className="text-[#1B254B] font-bold">Assembly Portal</h2>
                                <p className="text-xs text-gray-500">Production Management</p>
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
                            <p className="text-gray-500 text-sm">Manage production orders and quality control</p>
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
                                    <span className="text-white text-sm font-bold">A</span>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Assembly Lead</p>
                                    <p className="text-xs text-gray-500">Production Team</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto">
                    {renderContent()}
                </div>
            </div>

            {/* New Order Dialog */}
            <Dialog open={showNewOrderDialog} onOpenChange={setShowNewOrderDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Production Order</DialogTitle>
                        <DialogDescription>Enter details for the new production order</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Product Name</Label>
                            <Input
                                placeholder="e.g., SMG E-Scooter Model X"
                                value={newOrder.productName}
                                onChange={(e) => setNewOrder({ ...newOrder, productName: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Quantity</Label>
                                <Input
                                    type="number"
                                    placeholder="50"
                                    value={newOrder.quantity}
                                    onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Due Date</Label>
                                <Input
                                    type="date"
                                    value={newOrder.dueDate}
                                    onChange={(e) => setNewOrder({ ...newOrder, dueDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Assign To</Label>
                            <Select value={newOrder.assignedTo} onValueChange={(v) => setNewOrder({ ...newOrder, assignedTo: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select assembly line" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Assembly Line A">Assembly Line A</SelectItem>
                                    <SelectItem value="Assembly Line B">Assembly Line B</SelectItem>
                                    <SelectItem value="Assembly Line C">Assembly Line C</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Priority</Label>
                            <Select value={newOrder.priority} onValueChange={(v) => setNewOrder({ ...newOrder, priority: v })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowNewOrderDialog(false)}>Cancel</Button>
                        <Button onClick={handleCreateOrder} className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B]">
                            Create Order
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Quality Check Dialog */}
            <Dialog open={showQualityDialog} onOpenChange={setShowQualityDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Quality Check</DialogTitle>
                        <DialogDescription>Record a new quality control inspection</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Order ID</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select order" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {orders.map(o => (
                                            <SelectItem key={o.id} value={o.id}>{o.id} - {o.productName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Batch Number</Label>
                                <Input placeholder="e.g., B-47" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Inspector</Label>
                            <Input placeholder="Inspector name" />
                        </div>
                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea placeholder="Quality check notes..." />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setShowQualityDialog(false)}>Cancel</Button>
                        <Button
                            onClick={() => {
                                const check: QualityCheck = {
                                    id: `QC${String(qualityChecks.length + 1).padStart(3, '0')}`,
                                    orderId: 'PO001',
                                    inspector: 'Quality Team',
                                    result: 'pending',
                                    notes: 'New quality check',
                                    date: new Date().toISOString().split('T')[0],
                                    batchNumber: `B-${qualityChecks.length + 44}`
                                };
                                setQualityChecks([check, ...qualityChecks]);
                                setShowQualityDialog(false);
                                alert('Quality check added!');
                            }}
                            className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B]"
                        >
                            Add Check
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
