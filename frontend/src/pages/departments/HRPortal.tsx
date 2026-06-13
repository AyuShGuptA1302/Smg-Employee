// HR Portal - Complete with team-provided components
import { useState, useEffect, useMemo, useRef } from 'react';
import { parseResume, createEmployee, getUsers, getAdminRequests, getTrainings, getAnnouncements, updateUser, approveRequest, rejectRequest } from '../../services/api';

// ============ HOOKS ============
function useDataStore(key: string) {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let mounted = true;
        const fetchData = async () => {
            setLoading(true);
            try {
                let res;
                if (key === 'hr:users') res = await getUsers();
                else if (key === 'hr:requests') res = await getAdminRequests();
                else if (key === 'hr:trainings') res = await getTrainings();
                else if (key === 'hr:announcements') res = await getAnnouncements();
                
                if (mounted && res) {
                    if (key === 'hr:users') {
                        setData(res.map((u: any) => ({
                            id: u.empId || u._id,
                            _id: u._id,
                            name: u.name,
                            dept: u.dept,
                            role: u.role,
                            contact: u.phone || '-',
                            salary: u.salary || '-',
                            status: u.isActive ? 'Active' : 'Inactive'
                        })));
                    } else if (key === 'hr:requests') {
                         setData(res.map((r: any) => ({
                             id: r._id,
                             type: r.type,
                             employee: r.user?.name || 'Unknown User',
                             date: new Date(r.createdAt).toLocaleDateString(),
                             days: r.duration || 1,
                             status: r.status,
                             reason: r.reason || r.description || '-'
                         })));
                    } else if (key === 'hr:trainings') {
                        setData(res.map((t: any) => ({
                            id: t._id,
                            name: t.title,
                            trainer: t.instructor || 'Internal',
                            date: new Date(t.date || t.createdAt).toLocaleDateString(),
                            participants: (t.enrolledUsers || []).length,
                            status: 'Scheduled'
                        })));
                    } else if (key === 'hr:announcements') {
                        setData(res.map((a: any) => ({
                            id: a._id,
                            title: a.title,
                            date: new Date(a.date || a.createdAt).toLocaleDateString(),
                            content: a.content || a.message
                        })));
                    }
                }
            } catch (err) { console.error('Failed to fetch', key, err); }
            finally { if (mounted) setLoading(false); }
        };
        fetchData();
        return () => { mounted = false; };
    }, [key]);

    const api = useMemo(() => ({
        async add(item: any) {
            setData((prev: any[]) => [item, ...prev]);
            return item;
        },
        async update(matchFn: (it: any) => boolean, updater: (it: any) => any) {
            setData((prev: any[]) => prev.map(it => (matchFn(it) ? { ...it, ...updater(it) } : it)));
        },
        async remove(matchFn: (it: any) => boolean) {
            setData((prev: any[]) => prev.filter(it => !matchFn(it)));
        },
    }), []);

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

// ============ COMPONENTS ============
function StatCard({ title, value, subtitle, badge, onClick }: any) {
    return (
        <div onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default', background: '#fff', borderRadius: 16, padding: 20 }}>
            <div>
                <div style={{ fontWeight: 700, fontSize: 24 }}>{value}</div>
                <div style={{ color: '#666', fontSize: 14 }}>{title}</div>
            </div>
            {badge && <span style={{ background: badge.type === 'warning' ? '#fef3c7' : '#dcfce7', color: badge.type === 'warning' ? '#b45309' : '#15803d', padding: '4px 8px', borderRadius: 4, fontSize: 12, marginTop: 8, display: 'inline-block' }}>{badge.label}</span>}
            {subtitle && <div style={{ color: '#666', marginTop: 8 }}>{subtitle}</div>}
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
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#0B4DA2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>HR</div>
                    <div><div style={{ fontWeight: 600 }}>HR Manager</div><div style={{ fontSize: 12, color: '#666' }}>Admin</div></div>
                </div>
            </div>
        </div>
    );
}

function Sidebar({ activeTab, onTabChange, onLogout }: { activeTab: string; onTabChange: (tab: string) => void; onLogout: () => void }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
        { id: 'users', label: 'User Management', icon: '👤' },
        { id: 'requests', label: 'View Requests', icon: '📄' },
        { id: 'attendance', label: 'Attendance Admin', icon: '🗓️' },
        { id: 'training', label: 'Training Management', icon: '🎓' },
        { id: 'analytics', label: 'Department Analytics', icon: '📊' },
        { id: 'announcements', label: 'Announcements', icon: '📣' },
    ];

    return (
        <aside style={{ width: 260, background: '#fff', borderRight: '1px solid #eee', display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ padding: 20, borderBottom: '1px solid #eee' }}>
                <img src="/Company Logo.jpg" alt="SMG" style={{ width: '100%', height: 'auto', marginBottom: 16 }} />
                <div style={{ fontWeight: 700 }}>SMG HR Portal</div>
                <small style={{ color: '#666' }}>Human Resources</small>
            </div>

            <nav style={{ flex: 1, padding: 12 }}>
                <div style={{ fontSize: 12, color: '#999', fontWeight: 600, padding: '8px 12px' }}>Admin</div>
                {menuItems.slice(0, 4).map(item => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        style={{ border: 'none', background: activeTab === item.id ? '#0B4DA2' : 'transparent', color: activeTab === item.id ? '#fff' : '#333', textAlign: 'left', width: '100%', padding: '12px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
                <div style={{ fontSize: 12, color: '#999', fontWeight: 600, padding: '8px 12px', marginTop: 12 }}>Operations</div>
                {menuItems.slice(4).map(item => (
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
    const userData = useDataStore('hr:users').data;
    const requestData = useDataStore('hr:requests').data;
    const trainingData = useDataStore('hr:trainings').data;

    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>HR · Overview</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <StatCard title="Total Employees" value={userData.length} onClick={() => onTabChange('users')} />
                <StatCard title="Active" value={userData.filter((u: any) => u.status === 'Active').length} />
                <StatCard title="Pending Requests" value={requestData.filter((r: any) => r.status === 'Pending').length} badge={{ type: 'warning', label: 'Action Required' }} onClick={() => onTabChange('requests')} />
                <StatCard title="Trainings" value={trainingData.length} onClick={() => onTabChange('training')} />
            </div>
        </div>
    );
}

function UserManagementView() {
    const { data, api } = useDataStore('hr:users');
    const [query, setQuery] = useState('');
    const [createOpen, setCreateOpen] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const filtered = useSearch(data, ['name', 'dept', 'role', 'status'], query);

    const [formState, setFormState] = useState({ name: '', email: '', dept: '', role: '', contact: '', salary: '' });

    const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsParsing(true);
        try {
            const formData = new FormData();
            formData.append('resume', file);
            const res = await parseResume(formData);
            if (res.success && res.data) {
                setFormState(prev => ({
                    ...prev,
                    name: res.data.name || prev.name,
                    email: res.data.email || prev.email,
                    dept: res.data.suggestedDepartment || prev.dept,
                    role: res.data.suggestedRole || prev.role,
                    contact: res.data.phone || prev.contact
                    // Salary is intentionally omitted here so it must be added by the user manually
                }));
            }
        } catch (err) {
            alert('Failed to parse resume');
        } finally {
            setIsParsing(false);
        }
    };

    const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { name, email, dept, role, contact, salary } = formState;
        if (!name || !email || !dept) {
            alert('Name, Email, and Department are required.');
            return;
        }
        
        try {
            // Live API integration: Creates credentials and sends auto-email
            const newDbUser = await createEmployee({
                name, email, dept, role: role || 'employee', phone: contact, salary
            });
            
            // Still sync with local HR list for immediate display
            await api.add({ 
                id: newDbUser.empId || newDbUser._id, 
                name, dept, role, contact, salary, status: 'Active' 
            });
            
            setCreateOpen(false);
            setFormState({ name: '', email: '', dept: '', role: '', contact: '', salary: '' });
            alert(`Success! Account created for ${name}. An email has been sent to them with their secure login credentials.`);
        } catch (err: any) {
            alert(`Failed to create employee: ${err.message}`);
        }
    };

    const toggleStatus = async (id: string) => {
        try {
            const user = data.find((u: any) => u.id === id);
            if (user && user._id) {
                const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
                await updateUser(user._id, { isActive: newStatus === 'Active' });
                await api.update((u: any) => u.id === id, (u: any) => ({ status: newStatus }));
            }
        } catch (e) { alert('Failed to update status'); }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ margin: 0 }}>User Management</h2>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <button onClick={() => setCreateOpen(true)} style={{ background: '#0B4DA2', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>+ Add Employee</button>
                </div>
            </div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead><tr style={{ borderBottom: '1px solid #eee' }}>
                        <th style={{ textAlign: 'left', padding: 12 }}>ID</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Name</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Department</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Role</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Contact</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Salary</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Status</th>
                        <th style={{ textAlign: 'left', padding: 12 }}>Actions</th>
                    </tr></thead>
                    <tbody>
                        {filtered.map((u: any) => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: 12, color: '#0B4DA2', fontWeight: 600 }}>{u.id}</td>
                                <td style={{ padding: 12 }}>{u.name}</td>
                                <td style={{ padding: 12 }}>{u.dept}</td>
                                <td style={{ padding: 12 }}>{u.role}</td>
                                <td style={{ padding: 12 }}>{u.contact}</td>
                                <td style={{ padding: 12 }}>{u.salary || '-'}</td>
                                <td style={{ padding: 12 }}><span style={{ background: u.status === 'Active' ? '#dcfce7' : '#fee2e2', color: u.status === 'Active' ? '#15803d' : '#dc2626', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{u.status}</span></td>
                                <td style={{ padding: 12 }}>
                                    <button onClick={() => toggleStatus(u.id)} style={{ padding: '4px 8px', cursor: 'pointer', marginRight: 4 }}>{u.status === 'Active' ? 'Deactivate' : 'Activate'}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal open={createOpen} title="Add Employee" onClose={() => setCreateOpen(false)}>
                <div style={{ marginBottom: 16, padding: 12, background: '#F4F7FE', borderRadius: 8, border: '1px solid #cce3ff' }}>
                    <div style={{ fontWeight: 600, color: '#0B4DA2', marginBottom: 8, fontSize: 14 }}>🤖 AI Resume Auto-Fill</div>
                    <label style={{ display: 'inline-block', background: '#fff', border: '1px solid #0B4DA2', color: '#0B4DA2', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                        {isParsing ? 'Parsing Document...' : 'Upload PDF / DOCX'}
                        <input type="file" style={{ display: 'none' }} accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                    </label>
                </div>
                <form onSubmit={onCreate} style={{ display: 'grid', gap: 12 }}>
                    <label style={{ fontWeight: 600 }}>Name</label>
                    <input value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} placeholder="Full Name" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <label style={{ fontWeight: 600 }}>Email</label>
                    <input value={formState.email} type="email" onChange={e => setFormState({...formState, email: e.target.value})} placeholder="Email Address (Required)" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <label style={{ fontWeight: 600 }}>Department</label>
                    <input value={formState.dept} onChange={e => setFormState({...formState, dept: e.target.value})} placeholder="Department" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <label style={{ fontWeight: 600 }}>Role</label>
                    <input value={formState.role} onChange={e => setFormState({...formState, role: e.target.value})} placeholder="Role" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <label style={{ fontWeight: 600 }}>Contact</label>
                    <input value={formState.contact} onChange={e => setFormState({...formState, contact: e.target.value})} placeholder="+91 98765 43210" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <label style={{ fontWeight: 600 }}>Proposed Salary</label>
                    <input value={formState.salary} onChange={e => setFormState({...formState, salary: e.target.value})} placeholder="e.g. 12,00,000 INR" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button type="submit" style={{ background: '#0B4DA2', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer' }}>Save</button>
                        <button type="button" onClick={() => setCreateOpen(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

function RequestsView() {
    const { data, api } = useDataStore('hr:requests');
    const approve = async (id: string) => {
        try {
            await approveRequest(id);
            await api.update((r: any) => r.id === id, () => ({ status: 'Approved' }));
        } catch (e) { alert('Failed to approve request'); }
    };
    const reject = async (id: string) => {
        try {
            await rejectRequest(id, 'Rejected by HR');
            await api.update((r: any) => r.id === id, () => ({ status: 'Rejected' }));
        } catch (e) { alert('Failed to reject request'); }
    };

    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>View Requests</h2></div>
            <div style={{ background: '#fff', borderRadius: 16, padding: 16 }}>
                {data.map((r: any) => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottom: '1px solid #eee' }}>
                        <div>
                            <div style={{ fontWeight: 600 }}>{r.employee} - {r.type}</div>
                            <div style={{ color: '#666', fontSize: 14 }}>{r.date} ({r.days} days) - {r.reason}</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ background: r.status === 'Approved' ? '#dcfce7' : r.status === 'Rejected' ? '#fee2e2' : '#fef3c7', color: r.status === 'Approved' ? '#15803d' : r.status === 'Rejected' ? '#dc2626' : '#b45309', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{r.status}</span>
                            {r.status === 'Pending' && (
                                <>
                                    <button onClick={() => approve(r.id)} style={{ background: '#15803d', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>Approve</button>
                                    <button onClick={() => reject(r.id)} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>Reject</button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AttendanceView() {
    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Attendance Admin</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <StatCard title="Present Today" value="142" />
                <StatCard title="Absent" value="8" />
                <StatCard title="On Leave" value="12" />
                <StatCard title="WFH" value="6" />
            </div>
            <div style={{ marginTop: 24, background: '#fff', borderRadius: 16, padding: 20 }}>
                <h3>Today's Attendance Summary</h3>
                <p style={{ color: '#666' }}>Attendance data will be displayed here.</p>
            </div>
        </div>
    );
}

function TrainingView() {
    const { data } = useDataStore('hr:trainings');
    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Training Management</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {data.map((t: any) => (
                    <div key={t.id} style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
                        <h3 style={{ margin: 0 }}>{t.name}</h3>
                        <p style={{ color: '#666', margin: '8px 0' }}>Trainer: {t.trainer}</p>
                        <p style={{ color: '#666', margin: '4px 0' }}>Date: {t.date}</p>
                        <p style={{ color: '#666', margin: '4px 0' }}>Participants: {t.participants}</p>
                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{t.status}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function AnalyticsView() {
    const { data } = useDataStore('hr:users');
    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Department Analytics</h2></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <StatCard title="Total Headcount" value={data.length} />
                <StatCard title="Avg. Attendance" value="94%" />
                <StatCard title="Training Completion" value="87%" />
            </div>
            <div style={{ marginTop: 24, background: '#fff', borderRadius: 16, padding: 20 }}>
                <h3>Department Distribution</h3>
                <p style={{ color: '#666' }}>Analytics charts will be displayed here.</p>
            </div>
        </div>
    );
}

function AnnouncementsView() {
    const { data } = useDataStore('hr:announcements');
    return (
        <div>
            <div style={{ marginBottom: 24 }}><h2 style={{ margin: 0 }}>Announcements</h2></div>
            <div>
                {data.map((a: any) => (
                    <div key={a.id} style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>{a.title}</h3>
                            <span style={{ color: '#666', fontSize: 14 }}>{a.date}</span>
                        </div>
                        <p style={{ color: '#666', margin: '12px 0 0' }}>{a.content}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ============ MAIN PORTAL ============
export function HRPortal() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => {
        window.location.reload();
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard onTabChange={setActiveTab} />;
            case 'users': return <UserManagementView />;
            case 'requests': return <RequestsView />;
            case 'attendance': return <AttendanceView />;
            case 'training': return <TrainingView />;
            case 'analytics': return <AnalyticsView />;
            case 'announcements': return <AnnouncementsView />;
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
