import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronDown } from 'lucide-react';
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

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileDrawer({ isOpen, onClose }: MobileDrawerProps) {
  const [openDropdowns, setOpenDropdowns] = useState<string[]>(['projects', 'attendance']);

  const toggleDropdown = (id: string) => {
    setOpenDropdowns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: 0 }}
        exit={{ x: -280 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 left-0 h-full w-72 bg-white z-50 lg:hidden shadow-2xl"
        role="dialog"
        aria-label="Mobile navigation"
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(135deg, var(--smg-royal) 0%, var(--smg-dark) 100%)' }}>
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h3 className="text-sm" style={{ color: 'var(--smg-dark)' }}>SMG Scooters Pvt Ltd</h3>
              <p className="text-xs text-gray-400">Admin Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={20} style={{ color: 'var(--smg-dark)' }} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="overflow-y-auto h-[calc(100vh-64px)] py-4 px-3 custom-scrollbar">
          <ul className="space-y-1">
            {navigationItems.map((item) => (
              <li key={item.id}>
                {/* Menu item with dropdown */}
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.id)}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                        openDropdowns.includes(item.id)
                          ? 'bg-blue-50 text-[#0B4DA2]'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      aria-expanded={openDropdowns.includes(item.id)}
                      aria-label={item.name}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={20} strokeWidth={2.5} />
                        <span className="text-sm font-medium">{item.name}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: openDropdowns.includes(item.id) ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown size={16} />
                      </motion.div>
                    </button>

                    {/* Dropdown menu with animation */}
                    <AnimatePresence>
                      {openDropdowns.includes(item.id) && (
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
                                onClick={onClose}
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
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
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
                    <item.icon size={20} strokeWidth={2.5} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </motion.aside>
    </>
  );
}
