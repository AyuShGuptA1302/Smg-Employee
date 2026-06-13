// Events Portal - Complete with team-provided components
import { useState, useEffect, useMemo } from 'react';
import { getDeptStore, saveDeptStore } from '../../services/api';
import { NavLink, useNavigate } from 'react-router-dom';

// ============ DEFAULT DATA ============
const eventEvents = [
    { id: 'E001', name: 'Annual Townhall', date: '2025-01-15', location: 'Auditorium', status: 'Upcoming' },
    { id: 'E002', name: 'Safety Training', date: '2025-12-28', location: 'Training Room A', status: 'Open' },
];

const eventRegistrations = [
    { id: 'REG1001', eventId: 'E002', attendee: 'Priya Verma', email: 'priya.verma@example.com', status: 'Confirmed' },
    { id: 'REG1002', eventId: 'E002', attendee: 'Mohit Gupta', email: 'mohit.g@example.com', status: 'Pending' },
];

const eventSponsors = [
    { id: 'SP001', name: 'Alpha Corp', tier: 'Gold' },
    { id: 'SP002', name: 'Beta Ltd', tier: 'Silver' },
];

const eventVenues = [
    { id: 'V001', name: 'Auditorium', capacity: 500 },
    { id: 'V002', name: 'Training Room A', capacity: 60 },
];

const eventVolunteers = [
    { id: 'VOL01', name: 'Nisha', role: 'Usher' },
    { id: 'VOL02', name: 'Karan', role: 'Logistics' },
];

const eventFeedback = [
    { id: 'F001', eventId: 'E001', rating: 4, comment: 'Great session!' },
];

const eventSchedule = [
    { id: 'SCH-001', eventId: 'E001', title: 'Opening Remarks', start: '2025-01-15T09:00:00', end: '2025-01-15T09:30:00' },
    { id: 'SCH-002', eventId: 'E001', title: 'Q&A', start: '2025-01-15T11:00:00', end: '2025-01-15T11:30:00' },
    { id: 'SCH-003', eventId: 'E002', title: 'Safety Basics', start: '2025-12-28T10:00:00', end: '2025-12-28T11:00:00' },
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

// ============ COMPONENTS ============
function StatCard({ title, value, subtitle, badge, onClick }: any) {
    return (
        <div className="card kpi" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>{value}</div>
                <div className="label">{title}</div>
            </div>
            {badge && <span className={`badge ${badge.type}`}>{badge.label}</span>}
            {subtitle && <div style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>{subtitle}</div>}
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
        <div className="topbar">
            <div className="clock">{dateStr} · {dayStr}</div>
            <div className="search"><input placeholder="Search pages, actions..." /></div>
            <div className="actions">
                <span>✉️</span>
                <span>🔔</span>
            </div>
            <div className="avatar">
                <div className="pic" />
                <div className="meta">
                    <span className="name">Event Manager</span>
                    <span className="role">Admin</span>
                </div>
            </div>
        </div>
    );
}

function Sidebar({ activeTab, onTabChange, onLogout }: { activeTab: string; onTabChange: (tab: string) => void; onLogout: () => void }) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
        { id: 'events', label: 'Events', icon: '🎟️' },
        { id: 'registrations', label: 'Registrations', icon: '📝' },
        { id: 'schedule', label: 'Schedule', icon: '🗓️' },
        { id: 'venues', label: 'Venues', icon: '📍' },
        { id: 'sponsors', label: 'Sponsors', icon: '🤝' },
        { id: 'volunteers', label: 'Volunteers', icon: '🧑‍🤝‍🧑' },
        { id: 'feedback', label: 'Feedback', icon: '💬' },
        { id: 'analytics', label: 'Analytics', icon: '📊' },
    ];

    return (
        <aside className="sidebar">
            <div className="brand">
                <img src="/Company Logo.jpg" alt="SMG" style={{ width: '100%', height: 'auto', marginBottom: 16 }} />
                <div>
                    <div style={{ fontWeight: 700 }}>SMG Events Portal</div>
                    <small style={{ opacity: 0.8 }}>Event Management</small>
                </div>
            </div>

            <div className="section-title">Event Management</div>
            {menuItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                    style={{ border: 'none', background: activeTab === item.id ? 'var(--primary)' : 'transparent', color: activeTab === item.id ? '#fff' : 'inherit', textAlign: 'left', width: '100%', padding: '12px 16px', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}
                >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                </button>
            ))}

            <div className="spacer" style={{ flex: 1 }} />
            <button onClick={onLogout} className="signout nav-item" style={{ border: 'none', background: 'transparent', textAlign: 'left', padding: '12px 16px', cursor: 'pointer' }}>↪ Sign Out</button>
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
    return (
        <div>
            <div className="hero">
                <div className="title">Event Portal · Overview</div>
            </div>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <StatCard title="Upcoming Events" value={eventEvents.filter(e => e.status === 'Upcoming').length} onClick={() => onTabChange('events')} />
                <StatCard title="Open Registrations" value={eventRegistrations.filter(r => r.status === 'Pending').length} onClick={() => onTabChange('registrations')} />
                <StatCard title="Total Attendees" value={eventRegistrations.length} />
            </div>
        </div>
    );
}

function EventsView() {
    const { data, api } = useDataStore('event:events', eventEvents);
    const [query, setQuery] = useState('');
    const [createOpen, setCreateOpen] = useState(false);
    const [sortBy, setSortBy] = useState('date');
    const [sortDir, setSortDir] = useState('asc');

    const filtered = useSearch(data, ['name', 'location', 'status'], query);
    const events = useSort(filtered, sortBy, sortDir);

    const removeEvent = async (id: string) => {
        await api.remove((e: any) => e.id === id);
    };

    const onCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const name = String(form.get('name') || '').trim();
        const location = String(form.get('location') || '').trim();
        const date = String(form.get('date') || '').trim();
        const status = String(form.get('status') || '').trim() || 'Upcoming';
        if (!name || !date) return;
        const id = `E${Math.floor(100 + Math.random() * 900)}`;
        await api.add({ id, name, location, date, status });
        setCreateOpen(false);
        e.currentTarget.reset();
    };

    return (
        <div>
            <div className="hero">
                <div className="title">Event Management</div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input placeholder="Search events..." value={query} onChange={e => setQuery(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <button className="btn" onClick={() => setCreateOpen(true)} style={{ background: 'var(--primary)', color: '#fff', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>+ Create Event</button>
                </div>
            </div>
            <div className="card" style={{ marginTop: 16, background: '#fff', borderRadius: 16, padding: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <th style={{ textAlign: 'left', padding: 12 }}>Event</th>
                            <th style={{ textAlign: 'left', padding: 12 }}>Date</th>
                            <th style={{ textAlign: 'left', padding: 12 }}>Location</th>
                            <th style={{ textAlign: 'left', padding: 12 }}>Status</th>
                            <th style={{ textAlign: 'left', padding: 12 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((ev: any) => (
                            <tr key={ev.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: 12 }}>{ev.name}</td>
                                <td style={{ padding: 12 }}>{ev.date}</td>
                                <td style={{ padding: 12 }}>{ev.location}</td>
                                <td style={{ padding: 12 }}><span style={{ background: ev.status === 'Upcoming' ? '#dcfce7' : '#fef3c7', color: ev.status === 'Upcoming' ? '#15803d' : '#b45309', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{ev.status}</span></td>
                                <td style={{ padding: 12 }}><button onClick={() => removeEvent(ev.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>🗑️</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal open={createOpen} title="Create Event" onClose={() => setCreateOpen(false)}>
                <form onSubmit={onCreate} style={{ display: 'grid', gap: 12 }}>
                    <label style={{ fontWeight: 600 }}>Name</label>
                    <input name="name" placeholder="Annual Townhall" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <label style={{ fontWeight: 600 }}>Date</label>
                    <input name="date" type="date" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <label style={{ fontWeight: 600 }}>Location</label>
                    <input name="location" placeholder="Auditorium" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
                    <label style={{ fontWeight: 600 }}>Status</label>
                    <select name="status" style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }}>
                        <option>Upcoming</option>
                        <option>Open</option>
                        <option>Closed</option>
                    </select>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                        <button type="submit" style={{ background: 'var(--primary)', color: '#fff', padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>Save</button>
                        <button type="button" onClick={() => setCreateOpen(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #ddd', cursor: 'pointer' }}>Cancel</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

function RegistrationsView() {
    const { data, api } = useDataStore('event:registrations', eventRegistrations);
    const [query, setQuery] = useState('');
    const filtered = useSearch(data, ['attendee', 'email', 'status'], query);

    const approve = async (id: string) => {
        await api.update((r: any) => r.id === id, () => ({ status: 'Confirmed' }));
    };
    const remove = async (id: string) => {
        await api.remove((r: any) => r.id === id);
    };

    return (
        <div>
            <div className="hero">
                <div className="title">Registrations</div>
                <input placeholder="Search..." value={query} onChange={e => setQuery(e.target.value)} style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #ddd' }} />
            </div>
            <div className="card" style={{ marginTop: 16, background: '#fff', borderRadius: 16, padding: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <th style={{ textAlign: 'left', padding: 12 }}>Attendee</th>
                            <th style={{ textAlign: 'left', padding: 12 }}>Email</th>
                            <th style={{ textAlign: 'left', padding: 12 }}>Event</th>
                            <th style={{ textAlign: 'left', padding: 12 }}>Status</th>
                            <th style={{ textAlign: 'left', padding: 12 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((r: any) => (
                            <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: 12 }}>{r.attendee}</td>
                                <td style={{ padding: 12 }}>{r.email}</td>
                                <td style={{ padding: 12 }}>{eventEvents.find(e => e.id === r.eventId)?.name || r.eventId}</td>
                                <td style={{ padding: 12 }}><span style={{ background: r.status === 'Confirmed' ? '#dcfce7' : '#fef3c7', color: r.status === 'Confirmed' ? '#15803d' : '#b45309', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{r.status}</span></td>
                                <td style={{ padding: 12 }}>
                                    {r.status !== 'Confirmed' && <button onClick={() => approve(r.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✅</button>}
                                    <button onClick={() => remove(r.id)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function VenuesView() {
    const { data } = useDataStore('event:venues', eventVenues);
    return (
        <div>
            <div className="hero"><div className="title">Venues</div></div>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {data.map((v: any) => (
                    <div key={v.id} style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
                        <h3 style={{ margin: 0 }}>{v.name}</h3>
                        <p style={{ color: '#666', margin: '8px 0 0' }}>Capacity: {v.capacity}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function SponsorsView() {
    const { data } = useDataStore('event:sponsors', eventSponsors);
    return (
        <div>
            <div className="hero"><div className="title">Sponsors</div></div>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {data.map((s: any) => (
                    <div key={s.id} style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
                        <h3 style={{ margin: 0 }}>{s.name}</h3>
                        <span style={{ background: s.tier === 'Gold' ? '#fef3c7' : '#e0e7ff', color: s.tier === 'Gold' ? '#b45309' : '#4338ca', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>{s.tier}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function VolunteersView() {
    const { data } = useDataStore('event:volunteers', eventVolunteers);
    return (
        <div>
            <div className="hero"><div className="title">Volunteers</div></div>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {data.map((v: any) => (
                    <div key={v.id} style={{ background: '#fff', borderRadius: 16, padding: 20 }}>
                        <h3 style={{ margin: 0 }}>{v.name}</h3>
                        <p style={{ color: '#666', margin: '8px 0 0' }}>{v.role}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FeedbackView() {
    const { data } = useDataStore('event:feedback', eventFeedback);
    return (
        <div>
            <div className="hero"><div className="title">Feedback</div></div>
            <div style={{ marginTop: 16 }}>
                {data.map((f: any) => (
                    <div key={f.id} style={{ background: '#fff', borderRadius: 16, padding: 20, marginBottom: 12 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span>{'⭐'.repeat(f.rating)}</span>
                            <span style={{ color: '#666' }}>({f.rating}/5)</span>
                        </div>
                        <p style={{ margin: '8px 0 0' }}>{f.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ScheduleView() {
    const { data } = useDataStore('event:schedule', eventSchedule);
    return (
        <div>
            <div className="hero"><div className="title">Schedule</div></div>
            <div className="card" style={{ marginTop: 16, background: '#fff', borderRadius: 16, padding: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <th style={{ textAlign: 'left', padding: 12 }}>Event</th>
                            <th style={{ textAlign: 'left', padding: 12 }}>Title</th>
                            <th style={{ textAlign: 'left', padding: 12 }}>Start</th>
                            <th style={{ textAlign: 'left', padding: 12 }}>End</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((s: any) => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: 12 }}>{eventEvents.find(e => e.id === s.eventId)?.name || s.eventId}</td>
                                <td style={{ padding: 12 }}>{s.title}</td>
                                <td style={{ padding: 12 }}>{new Date(s.start).toLocaleString()}</td>
                                <td style={{ padding: 12 }}>{new Date(s.end).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function AnalyticsView() {
    return (
        <div>
            <div className="hero"><div className="title">Analytics</div></div>
            <div style={{ marginTop: 16, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                <StatCard title="Total Events" value={eventEvents.length} />
                <StatCard title="Total Registrations" value={eventRegistrations.length} />
                <StatCard title="Confirmed" value={eventRegistrations.filter(r => r.status === 'Confirmed').length} />
            </div>
        </div>
    );
}

// ============ MAIN PORTAL ============
export function EventsPortal() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = () => {
        window.location.reload();
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <Dashboard onTabChange={setActiveTab} />;
            case 'events': return <EventsView />;
            case 'registrations': return <RegistrationsView />;
            case 'schedule': return <ScheduleView />;
            case 'venues': return <VenuesView />;
            case 'sponsors': return <SponsorsView />;
            case 'volunteers': return <VolunteersView />;
            case 'feedback': return <FeedbackView />;
            case 'analytics': return <AnalyticsView />;
            default: return <Dashboard onTabChange={setActiveTab} />;
        }
    };

    return (
        <div className="app-shell" style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout} />
            <div className="content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Topbar />
                <main className="page" style={{ flex: 1, padding: 24, overflowY: 'auto' }}>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
