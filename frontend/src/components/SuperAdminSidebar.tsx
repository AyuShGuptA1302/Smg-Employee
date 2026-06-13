import React from 'react';
import { LayoutDashboard, Users, Settings, FileText, BarChart3, Megaphone, Bell, FolderOpen, LogOut } from 'lucide-react';

interface SuperAdminSidebarProps {
    activePage: string;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

export const SuperAdminSidebar = ({ activePage, onNavigate, onLogout }: SuperAdminSidebarProps) => {
    const menuGroups = [
        {
            title: 'SUPER ADMIN',
            items: [
                { id: 'super-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                { id: 'super-users', icon: Users, label: 'Users' },
                { id: 'super-departments', icon: Settings, label: 'Departments' },
                { id: 'super-requests', icon: FileText, label: 'All Requests' },
                { id: 'super-analytics', icon: BarChart3, label: 'Analytics' },
            ],
        },
        {
            title: 'SYSTEM',
            items: [
                { id: 'super-announcements', icon: Megaphone, label: 'Announcements' },
                { id: 'super-notifications', icon: Bell, label: 'Notifications' },
                { id: 'super-settings', icon: Settings, label: 'Settings' },
                { id: 'super-reports', icon: FolderOpen, label: 'Reports & Export' },
            ],
        },
    ];

    return (
        <aside className="hidden lg:flex w-[80px] hover:w-[260px] bg-[#042A5B] flex-col h-screen fixed left-0 top-0 z-50 border-r border-[#0B4DA2]/30 transition-all duration-300 group shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-[#0B4DA2]/30 flex items-center gap-3 overflow-hidden whitespace-nowrap shrink-0">
                <div className="w-8 h-8 bg-[#0B4DA2] rounded-xl flex items-center justify-center font-bold text-white shadow-lg shrink-0 text-sm">SMG</div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h2 className="text-white font-bold tracking-wide text-sm">SMG Scooters</h2>
                    <p className="text-[10px] text-[#87CEEB] tracking-widest font-bold opacity-80">SUPER ADMIN</p>
                </div>
            </div>

            <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto scrollbar-hide">
                {menuGroups.map((group, idx) => (
                    <div key={idx}>
                        <p className="px-3 text-[10px] font-bold text-[#87CEEB]/60 uppercase tracking-wider mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">{group.title}</p>
                        <div className="space-y-1">
                            {group.items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => onNavigate(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${activePage === item.id
                                            ? 'bg-[#0B4DA2] text-white shadow-lg'
                                            : 'text-[#87CEEB] hover:bg-[#0B4DA2]/20'
                                        }`}
                                >
                                    <div className="shrink-0 flex justify-center w-6">
                                        <item.icon size={20} />
                                    </div>
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap text-sm font-bold flex-1 text-left">
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>

            <div className="p-4 border-t border-[#0B4DA2]/30 shrink-0">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#EE5D50] hover:bg-[#EE5D50]/10 transition-all duration-200 font-bold"
                >
                    <div className="shrink-0 flex justify-center w-6"><LogOut size={20} /></div>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};
