// Finance Portal - Complete with team-provided components
import { useState, useEffect, useMemo } from 'react';
import { getDeptStore, saveDeptStore } from '../../services/api';

// ============ DEFAULT DATA ============
const financeBudget = [
    { id: 'BUD-2025', department: 'Operations', allocated: 6500000, spent: 4200000 },
    { id: 'BUD-2025-FIN', department: 'Finance', allocated: 3500000, spent: 1850000 },
];

const financeExpenses = [
    { id: 'EXP-0001', desc: 'Office supplies', amount: 12000, date: '2025-12-20', status: 'Approved' },
    { id: 'EXP-0002', desc: 'Travel', amount: 54000, date: '2025-12-18', status: 'Pending' },
];

const financeInvoices = [
    { id: 'INV-1001', vendor: 'Alpha Corp', amount: 230000, due: '2025-01-10', status: 'Open' },
    { id: 'INV-1002', vendor: 'Beta Ltd', amount: 480000, due: '2025-01-05', status: 'Paid' },
];

const financePayroll = [
    { id: 'PAY-DEC-2025', cycle: 'Dec 2025', employees: 138, total: 7835000, status: 'Processed' },
];

const financeApprovals = [
    { id: 'APR-001', item: 'Budget Increase - Ops', requester: 'R. Sharma', status: 'Pending' },
];

const financeVendors = [
    { id: 'VND-ALPHA', name: 'Alpha Corp', category: 'IT' },
    { id: 'VND-BETA', name: 'Beta Ltd', category: 'Logistics' },
];

const financePurchaseOrders = [
    { id: 'PO-5001', vendor: 'Alpha Corp', amount: 150000, date: '2025-12-01', status: 'Dispatched' },
];

// ============ HOOKS ============
function useDataStore(key: string, initialData?: any[]) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        getDeptStore(key).then(res => {
            if (mounted && res && Array.isArray(res)) {
                setData(res);
            }
        }).catch(err => console.error(err))
        .finally(() => { if(mounted) setLoading(false); });
        return () => { mounted = false; };
    }, [key]);

    const api = useMemo(() => ({
        async add(item: any) {
            setLoading(true);
            let newData: any[] = [];
            setData((prev: any[]) => {
                newData = [...prev, item];
                return newData;
            });
            await new Promise(r => setTimeout(r, 0));
            await saveDeptStore(key, newData);
            setLoading(false);
            return item;
        },
        async update(matchFn: (it: any) => boolean, updater: (it: any) => any) {
            setLoading(true);
            let newData: any[] = [];
            setData((prev: any[]) => {
                newData = prev.map(it => (matchFn(it) ? { ...it, ...updater(it) } : it));
                return newData;
            });
            await new Promise(r => setTimeout(r, 0));
            await saveDeptStore(key, newData);
            setLoading(false);
        },
        async remove(matchFn: (it: any) => boolean) {
            setLoading(true);
            let newData: any[] = [];
            setData((prev: any[]) => {
                newData = prev.filter(it => !matchFn(it));
                return newData;
            });
            await new Promise(r => setTimeout(r, 0));
            await saveDeptStore(key, newData);
            setLoading(false);
        },
    }), [key]);

    return { data, setData, api, loading };
}

function useSearch(source: any[], fields: string[], query: string) {
    return useMemo(() => {
        if (!query) return source;
        const q = query.toLowerCase();
        return source.filter(item =>
            fields.some(f => String(item[f] ?? '').toLowerCase().includes(q))
        );
    }, [source, fields, query]);
}

function useSort(source: any[], field: string, dir = 'asc') {
    return useMemo(() => {
        if (!field) return source;
        const sorted = [...source].sort((a, b) => {
            const av = a[field];
            const bv = b[field];
            if (typeof av === 'number' && typeof bv === 'number') {
                return av - bv;
            }
            return String(av).localeCompare(String(bv));
        });
        return dir === 'desc' ? sorted.reverse() : sorted;
    }, [source, field, dir]);
}

// ============ UTILITY ============
function formatCurrency(n: number) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
}

// ============ COMPONENTS ============
function StatCard({ title, value, subtitle, badge, onClick }: any) {
    return (
        <div className="card kpi" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', background: '#fff', borderRadius: 16, padding: 20 }}>
            <div>
                <div style={{ fontWeight: 700, fontSize: 24 }}>{value}</div>
                <div style={{ color: '#666', fontSize: 14 }}>{title}</div>
            </div>
            {badge && <span style={{ background: badge.type === 'warning' ? '#fef3c7' : '#dcfce7', color: badge.type === 'warning' ? '#b45309' : '#15803d', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{badge.label}</span>}
            {subtitle && <div style={{ marginLeft: 'auto', color: '#666' }}>{subtitle}</div>}
        </div>
    );
}

function Topbar() {
    const [now, setNow] = useState(new Date());
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(t);
    }, []);
    const dateStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dayStr = now.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: '2-digit' });

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', background: '#fff', borderBottom: '1px solid #eee' }}>
            <div style={{ fontWeight: 600 }}>{dateStr} · {dayStr}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <input placeholder="Search..." style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd', width: 200 }} />
                <span>✉️</span>
                <span>🔔</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0B4DA2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>FM</div>
                    <div><div style={{ fontWeight: 600 }}>Finance Manager</div><div style={{ fontSize: 12, color: '#666' }}>Admin</div></div>
                </div>
            </div>
        </div>
    );
}

function Sidebar({ activeTab, onTabChange, onLogout }: { activeTab: string; onTabChange: (tab: string) => void; onLogout: () => void }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
        { id: 'budget', label: 'Budget Overview', icon: '💰' },
        { id: 'approvals', label: 'Approvals', icon: '✅' },
        { id: 'invoices', label: 'Invoices', icon: '🧾' },
        { id: 'expenses', label: 'Expenses', icon: '💳' },
        { id: 'payroll', label: 'Payroll', icon: '🪙' },
        { id: 'reports', label: 'Reports', icon: '📄' },
        { id: 'vendors', label: 'Vendors', icon: '🏷️' },
        { id: 'purchaseorders', label: 'Purchase Orders', icon: '📦' },
    ];

    return (
        <aside style={{ width: 260, background: '#fff', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ padding: 20, borderBottom: '1px solid #eee' }}>
                <img src="/Company Logo.jpg" alt="SMG" style={{ width: '100%', height: 'auto', marginBottom: 16 }} />
                <div style={{ fontWeight: 700 }}>SMG Finance Portal</div>
                <small style={{ color: '#666' }}>Financial Management</small>
            </div>

            <nav style={{ flex: 1, padding: 12 }}>
                <div style={{ fontSize: 12, color: '#999', fontWeight: 600, padding: '8px 12px' }}>Finance</div>
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        style={{ border: 'none', background: activeTab === item.id ? '#0B4DA2' : 'transparent', color: activeTab === item.id ? '#fff' : '#333', textAlign: 'left', width: '100%', padding: '12px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div style={{ padding: 12, borderTop: '1px solid #eee' }}>
                <button onClick={onLogout} style={{ border: 'none', background: 'transparent', textAlign: 'left', padding: '12px 16px', cursor: 'pointer', width: '100%' }}>↪ Sign Out</button>
            </div>
        </aside>
    );
}

function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
    if (!open) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 400, maxWidth: 500 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ margin: 0 }}>{title}</h3>
                    <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 20 }}>×</button>
                </div>
                {children}
            </div>
        </div>
    );
}

// ============ PORTAL VIEWS ============
function Dashboard({ onTabChange }: { onTabChange: (tab: string) => void }) {
    const budgetData = useDataStore('finance:budget', financeBudget).data;
    const totals = useMemo(() => {
        const allocated = budgetData.reduce((s: number, b: any) => s + (b.allocated || 0), 0);
        const spent = budgetData.reduce((s: number, b: any) => s + (b.spent || 0), 0);
        return { allocated, spent };
    }, [budgetData]);

    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Finance · Overview</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <StatCard title="Total Budget" value={formatCurrency(totals.allocated)} onClick={() => onTabChange('budget')} />
                <StatCard title="Spent" value={formatCurrency(totals.spent)} onClick={() => onTabChange('expenses')} />
                <StatCard title="Pending Approvals" value={financeApprovals.filter(a => a.status === 'Pending').length} badge={{ type: 'warning', label: 'Action Required' }} onClick={() => onTabChange('approvals')} />
            </div>
        </div>
    );
}

function BudgetView() {
    const { data, api } = useDataStore('finance:budget', financeBudget);
    const budgets = useSort(data, 'department', 'asc');
    const totals = useMemo(() => {
        const allocated = data.reduce((s: number, b: any) => s + (b.allocated || 0), 0);
        const spent = data.reduce((s: number, b: any) => s + (b.spent || 0), 0);
        const pct = allocated ? Math.round((spent / allocated) * 100) : 0;
        return { allocated, spent, pct };
    }, [data]);

    const updateSpent = async (id: string, delta: number) => {
        await api.update((b: any) => b.id === id, (b: any) => ({ spent: Math.max(0, (b.spent || 0) + delta) }));
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Budget Overview</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                <StatCard title="Total Allocated" value={formatCurrency(totals.allocated)} />
                <StatCard title="Total Spent" value={formatCurrency(totals.spent)} subtitle={`${totals.pct}%`} />
                <StatCard title="Remaining" value={formatCurrency(totals.allocated - totals.spent)} />
            </div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ borderBottom: '1px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: 12 }}>Department</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Allocated</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Spent</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Actions</th>
                    </tr></thead>
                    <tbody>
                        {budgets.map((b: any) => (
                            <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: 12 }}>{b.department}</td>
                                <td style={{ padding: 12 }}>{formatCurrency(b.allocated)}</td>
                                <td style={{ padding: 12 }}>{formatCurrency(b.spent)}</td>
                                <td style={{ padding: 12 }}>
                                    <button onClick={() => updateSpent(b.id, 50000)} style={{ marginRight: 8, padding: '4px 8px', cursor: 'pointer' }}>+50k</button>
                                    <button onClick={() => updateSpent(b.id, -50000)} style={{ padding: '4px 8px', cursor: 'pointer' }}>-50k</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ExpensesView() {
    const { data, api } = useDataStore('finance:expenses', financeExpenses);
    const [query, setQuery] = useState('');
    const filtered = useSearch(data, ['desc', 'status'], query);
    const expenses = useSort(filtered, 'date', 'desc');

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ margin: 0 }}>Expenses</h2>
                <input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
            </div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ borderBottom: '1px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: 12 }}>ID</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Description</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Amount</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Date</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Status</th>
                    </tr></thead>
                    <tbody>
                        {expenses.map((e: any) => (
                            <tr key={e.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: 12, color: '#0B4DA2', fontWeight: 600 }}>{e.id}</td>
                                <td style={{ padding: 12 }}>{e.desc}</td>
                                <td style={{ padding: 12 }}>{formatCurrency(e.amount)}</td>
                                <td style={{ padding: 12 }}>{new Date(e.date).toLocaleDateString()}</td>
                                <td style={{ padding: 12 }}><span style={{ background: e.status === 'Approved' ? '#dcfce7' : '#fef3c7', color: e.status === 'Approved' ? '#15803d' : '#b45309', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{e.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function InvoicesView() {
    const { data } = useDataStore('finance:invoices', financeInvoices);
    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Invoices</h2></div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ borderBottom: '1px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: 12 }}>Invoice</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Vendor</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Amount</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Due</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Status</th>
                    </tr></thead>
                    <tbody>
                        {data.map((inv: any) => (
                            <tr key={inv.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: 12 }}>{inv.id}</td>
                                <td style={{ padding: 12 }}>{inv.vendor}</td>
                                <td style={{ padding: 12 }}>{formatCurrency(inv.amount)}</td>
                                <td style={{ padding: 12 }}>{inv.due}</td>
                                <td style={{ padding: 12 }}><span style={{ background: inv.status === 'Paid' ? '#dcfce7' : '#fef3c7', color: inv.status === 'Paid' ? '#15803d' : '#b45309', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{inv.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function PayrollView() {
    const { data } = useDataStore('finance:payroll', financePayroll);
    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Payroll</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {data.map((p: any) => (
                    <div key={p.id} style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
                        <h3 style={{ margin: 0 }}>{p.cycle}</h3>
                        <p style={{ color: '#666', margin: '8px 0' }}>{p.employees} Employees</p>
                        <p style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{formatCurrency(p.total)}</p>
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{p.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ApprovalsView() {
    const { data, api } = useDataStore('finance:approvals', financeApprovals);
    const approve = async (id: string) => {
        await api.update((a: any) => a.id === id, () => ({ status: 'Approved' }));
    };
    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Approvals</h2></div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 16 }}>
                {data.map((a: any) => (
                    <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottom: '1px solid #eee' }}>
                        <div>
                            <div style={{ fontWeight: 600 }}>{a.item}</div>
                            <div style={{ color: '#666', fontSize: 14 }}>Requester: {a.requester}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <span style={{ background: a.status === 'Approved' ? '#dcfce7' : '#fef3c7', color: a.status === 'Approved' ? '#15803d' : '#b45309', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{a.status}</span>
                            {a.status === 'Pending' && <button onClick={() => approve(a.id)} style={{ background: '#0B4DA2', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>Approve</button>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function VendorsView() {
    const { data } = useDataStore('finance:vendors', financeVendors);
    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Vendors</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {data.map((v: any) => (
                    <div key={v.id} style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
                        <h3 style={{ margin: 0 }}>{v.name}</h3>
                        <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{v.category}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function PurchaseOrdersView() {
    const { data } = useDataStore('finance:purchaseorders', financePurchaseOrders);
    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Purchase Orders</h2></div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ borderBottom: '1px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: 12 }}>PO #</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Vendor</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Amount</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Date</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Status</th>
                    </tr></thead>
                    <tbody>
                        {data.map((po: any) => (
                            <tr key={po.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: 12 }}>{po.id}</td>
                                <td style={{ padding: 12 }}>{po.vendor}</td>
                                <td style={{ padding: 12 }}>{formatCurrency(po.amount)}</td>
                                <td style={{ padding: 12 }}>{po.date}</td>
                                <td style={{ padding: 12 }}><span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{po.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function ReportsView() {
    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Reports</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <div style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
                    <h3>Monthly Spend Report</h3>
                    <p style={{ color: '#666' }}>Dec 2025</p>
                    <button style={{ background: '#0B4DA2', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>Download</button>
                </div>
                <div style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
                    <h3>Budget Summary</h3>
                    <p style={{ color: '#666' }}>Q4 2025</p>
                    <button style={{ background: '#0B4DA2', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>Download</button>
                </div>
            </div>
        </div>
    );
}

// ============ MAIN PORTAL ============
export function FinancePortal() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => {
        window.location.reload();
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard onTabChange={setActiveTab} />;
            case 'budget': return <BudgetView />;
            case 'expenses': return <ExpensesView />;
            case 'invoices': return <InvoicesView />;
            case 'payroll': return <PayrollView />;
            case 'approvals': return <ApprovalsView />;
            case 'vendors': return <VendorsView />;
            case 'purchaseorders': return <PurchaseOrdersView />;
            case 'reports': return <ReportsView />;
            default: return <Dashboard onTabChange={setActiveTab} />;
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Topbar />
                <main style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
