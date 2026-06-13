import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  User,
  FileText,
  FolderOpen,
  Receipt,
  GraduationCap,
  Calendar,
  Briefcase,
  Heart,
  Lightbulb,
  BookOpen,
  Megaphone,
  Bell,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Coffee,
  Home,
  Bus,
  Shirt,
  Smartphone,
  Package,
  ClipboardList,
  CalendarCheck,
  Eye,
} from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  icon: React.ElementType;
  path?: string;
  subItems?: {
    id: string;
    name: string;
    icon: React.ElementType;
    path: string;
  }[];
}

const navigationItems: MenuItem[] = [
  { 
    id: 'dashboard', 
    name: 'Dashboard', 
    icon: LayoutDashboard, 
    path: '/employee/dashboard' 
  },
  {
    id: 'projects',
    name: 'Projects & Work',
    icon: Briefcase,
    subItems: [
      { id: 'service-catalog', name: 'Service Catalog', icon: ClipboardList, path: '/employee/service-catalog' },
      { id: 'canteen', name: 'Canteen', icon: Coffee, path: '/employee/canteen' },
      { id: 'guest-house', name: 'Guest House', icon: Home, path: '/employee/guest-house' },
      { id: 'transport', name: 'Transport', icon: Bus, path: '/employee/transport' },
      { id: 'uniform', name: 'Uniform', icon: Shirt, path: '/employee/uniform' },
      { id: 'sim-allocation', name: 'SIM Allocation', icon: Smartphone, path: '/employee/sim-allocation' },
      { id: 'asset-requests', name: 'Asset Requests', icon: Package, path: '/employee/asset-requests' },
      { id: 'general-requests', name: 'General Requests', icon: FileText, path: '/employee/requests' },
    ],
  },
  {
    id: 'attendance',
    name: 'Attendance',
    icon: Calendar,
    subItems: [
      { id: 'leaves', name: 'Leaves', icon: CalendarCheck, path: '/employee/leaves' },
      { id: 'my-attendance', name: 'My Attendance View', icon: Eye, path: '/employee/attendance' },
    ],
  },
  { 
    id: 'payroll', 
    name: 'Payroll', 
    icon: Receipt, 
    path: '/employee/payslips' 
  },
  { 
    id: 'training', 
    name: 'Training', 
    icon: GraduationCap, 
    path: '/employee/training' 
  },
  { 
    id: 'documents', 
    name: 'My Documents', 
    icon: FolderOpen, 
    path: '/employee/documents' 
  },
  { 
    id: 'profile', 
    name: 'Profile', 
    icon: User, 
    path: '/employee/profile' 
  },
  { 
    id: 'welfare', 
    name: 'Employee Welfare', 
    icon: Heart, 
    path: '/employee/welfare' 
  },
  { 
    id: 'imagine', 
    name: 'SMG Imagine', 
    icon: Lightbulb, 
    path: '/employee/imagine' 
  },
  { 
    id: 'policies', 
    name: 'Policies', 
    icon: BookOpen, 
    path: '/employee/policies' 
  },
  { 
    id: 'announcements', 
    name: 'Announcements', 
    icon: Megaphone, 
    path: '/employee/announcements' 
  },
  { 
    id: 'notifications', 
    name: 'Notifications', 
    icon: Bell, 
    path: '/employee/notifications' 
  },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse }: SidebarProps) {
  const [openDropdowns, setOpenDropdowns] = useState<string[]>(['projects', 'attendance']);

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <aside
      className={`hidden lg:flex flex-col h-screen bg-white transition-all duration-300 shadow-lg ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
      style={{ borderRight: '1px solid var(--smg-border)' }}
      aria-label="Main navigation"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-center px-4" style={{ borderBottom: '1px solid var(--smg-border)' }}>
        {isCollapsed ? (
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, var(--smg-royal) 0%, var(--smg-dark) 100%)' }}>
            <span className="text-white font-bold text-lg">S</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, var(--smg-royal) 0%, var(--smg-dark) 100%)' }}>
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h3 className="text-sm" style={{ color: 'var(--smg-dark)' }}>SMG Scooters Pvt Ltd</h3>
              <p className="text-xs text-gray-400">Admin Portal</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar">
        <ul className="space-y-1">
          {navigationItems.map((item) => (
            <li key={item.id}>
              {/* Menu item with dropdown */}
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => !isCollapsed && toggleDropdown(item.id)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all group ${
                      openDropdowns.includes(item.id)
                        ? 'bg-blue-50 text-[#0B4DA2]'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    aria-expanded={openDropdowns.includes(item.id)}
                    aria-label={item.name}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon 
                        size={20} 
                        strokeWidth={2.5} 
                        className={isCollapsed ? 'mx-auto' : ''} 
                      />
                      {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <motion.div
                        animate={{ rotate: openDropdowns.includes(item.id) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    )}
                  </button>

                  {/* Dropdown menu with animation */}
                  <AnimatePresence>
                    {openDropdowns.includes(item.id) && !isCollapsed && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="mt-1 ml-4 space-y-1 overflow-hidden"
                      >
                        {item.subItems.map((subItem) => (
                          <motion.li
                            key={subItem.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <NavLink
                              to={subItem.path}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
                                  isActive
                                    ? 'bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] text-white shadow-md'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-[#0B4DA2]'
                                }`
                              }
                              aria-label={subItem.name}
                            >
                              <subItem.icon size={16} strokeWidth={2.5} />
                              <span>{subItem.name}</span>
                            </NavLink>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Direct link without dropdown */
                <NavLink
                  to={item.path!}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                      isActive
                        ? 'text-white shadow-lg'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#0B4DA2]'
                    }`
                  }
                  style={({ isActive }) => ({
                    background: isActive ? 'linear-gradient(135deg, var(--smg-royal) 0%, var(--smg-dark) 100%)' : 'transparent',
                  })}
                  aria-label={item.name}
                >
                  <item.icon size={20} strokeWidth={2.5} className={isCollapsed ? 'mx-auto' : ''} />
                  {!isCollapsed && <span className="text-sm font-medium">{item.name}</span>}
                </NavLink>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer - Company Info */}
      {!isCollapsed && (
        <div className="px-4 py-3" style={{ borderTop: '1px solid var(--smg-border)' }}>
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-xl p-3">
            <p className="text-xs text-gray-600 mb-1">Powered by</p>
            <p className="text-sm text-[#0B4DA2]">SMG Scooters Pvt Ltd</p>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={onToggleCollapse}
        className="h-14 flex items-center justify-center hover:bg-gray-50 transition-colors"
        style={{ borderTop: '1px solid var(--smg-border)' }}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight size={20} style={{ color: 'var(--smg-royal)' }} />
        ) : (
          <div className="flex items-center gap-2" style={{ color: 'var(--smg-royal)' }}>
            <ChevronLeft size={20} />
            <span className="text-sm font-medium">Collapse</span>
          </div>
        )}
      </button>
    </aside>
  );
}
