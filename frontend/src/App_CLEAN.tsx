import React, { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProfilePage } from './pages/ProfilePage';
import { CanteenPage } from './pages/CanteenPage';
import { GuestHousePage } from './pages/GuestHousePage';
import { TransportPage } from './pages/TransportPage';
import { LeavesPage } from './pages/LeavesPage';
import { 
  UniformPage, 
  SIMAllocationPage, 
  AssetRequestsPage, 
  GeneralRequestsPage,
  MyAttendancePage,
  PayrollPage,
  TrainingPage,
  DocumentsPage,
  WelfarePage,
  ImaginePage,
  PoliciesPage,
  AnnouncementsPage,
  NotificationsPage
} from './pages/OtherPages';
import { 
  LayoutDashboard, 
  Briefcase, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search, 
  ChevronRight,
  ChevronDown,
  Heart,
  ShoppingBag,
  Settings,
  Coffee,
  MapPin,
  Mail,
  Bus,
  Shirt,
  Package,
  Calendar,
  Eye,
  FolderOpen,
  Lightbulb,
  BookOpen,
  Megaphone,
  Home,
  Smartphone,
  FileText,
  User
} from 'lucide-react';

const INITIAL_DATA = {
  user: {
    name: "Rohit Sharma",
    role: "Senior Technician",
    empId: "SMG-2024-042",
    dept: "Assembly",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit&backgroundColor=b6e3f4",
    email: "rohit.sharma@smg-scooters.com",
    shift: "General (9:00 - 18:00)",
    reportingTo: "Priya Sharma",
    phone: "+91 98765 43210",
    emergencyContact: "+91 98765 43211",
    dateOfBirth: "15-Aug-1992",
    dateOfJoining: "10-Jan-2020",
    bloodGroup: "O+",
    address: "Flat 402, Green Valley Apartments, Sector 12, Noida, UP - 201301",
    education: [
      { degree: "B.Tech in Mechanical Engineering", institution: "Delhi Technical University", year: "2010-2014", grade: "8.2 CGPA" },
      { degree: "Senior Secondary (XII)", institution: "DAV Public School", year: "2010", grade: "88%" }
    ],
    certifications: [
      { name: "Six Sigma Green Belt", issuer: "ASQ", year: "2021" },
      { name: "Industrial Safety", issuer: "NSCI", year: "2020" },
      { name: "Quality Management", issuer: "ISO", year: "2019" }
    ],
    skills: ["Assembly Line Operations", "Quality Control", "Safety Compliance", "Technical Documentation", "Team Leadership"],
    languages: ["Hindi (Native)", "English (Fluent)", "Punjabi (Conversational)"]
  }
};

const Topbar = ({ user, onMobileMenu, onNavigate }) => (
  <header className="sticky top-0 z-30 bg-[#F4F7FE]/90 backdrop-blur-xl px-4 py-4 lg:px-8 flex justify-between items-center transition-all border-b border-white/50">
    <div className="flex items-center gap-4">
      <button onClick={onMobileMenu} className="lg:hidden p-2 text-[#042A5B] bg-white rounded-lg shadow-sm border border-gray-100"><Menu size={24} /></button>
      <div className="hidden md:block">
        <h2 className="text-[#1B254B] text-xl font-bold tracking-tight">Cloud Portal</h2>
        <p className="text-[#A3AED0] text-xs font-medium">Internal Employee System v2.0</p>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <div className="hidden sm:flex items-center bg-white rounded-full px-4 py-2 shadow-sm w-64 border border-transparent hover:border-[#0B4DA2]/30 transition-colors focus-within:border-[#0B4DA2]/50 focus-within:ring-2 focus-within:ring-[#0B4DA2]/10">
        <Search size={16} className="text-gray-400" />
        <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm ml-2 w-full text-[#1B254B] placeholder:text-gray-300" />
      </div>
      <button className="relative p-2.5 bg-white text-gray-400 hover:text-[#0B4DA2] rounded-full shadow-sm transition-colors group hover:shadow-md border border-gray-100" onClick={() => alert("Opening Mail...")} title="Work Mail">
        <Mail size={20} className="group-hover:rotate-12 transition-transform" />
      </button>
      <button onClick={() => onNavigate('notifications')} className="relative p-2.5 bg-white text-gray-400 hover:text-[#0B4DA2] rounded-full shadow-sm transition-colors group hover:shadow-md border border-gray-100">
        <Bell size={20} className="group-hover:rotate-12 transition-transform" />
        <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#EE5D50] rounded-full border-2 border-white"></span>
      </button>
      <div onClick={() => onNavigate('profile')} className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-full shadow-sm cursor-pointer hover:shadow-md transition-all border border-gray-100 hover:border-[#0B4DA2]/30 active:scale-95">
        <img src={user.avatar} alt="Profile" className="w-9 h-9 rounded-full border border-gray-200" />
        <div className="hidden lg:block text-left">
          <p className="text-sm font-bold text-[#1B254B] leading-tight">{user.name}</p>
          <p className="text-[10px] text-gray-400 font-medium">{user.role}</p>
        </div>
        <ChevronRight size={16} className="text-gray-300" />
      </div>
    </div>
  </header>
);

const Sidebar = ({ activePage, onNavigate, onLogout }) => {
  const [openDropdowns, setOpenDropdowns] = useState(['service-catalog', 'attendance']);

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const menuGroups = [
    {
      title: "Main",
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'projects', icon: Briefcase, label: 'Projects & Work' },
        { 
          id: 'service-catalog', 
          icon: ShoppingBag, 
          label: 'Service Catalog',
          hasDropdown: true,
          subItems: [
            { id: 'canteen', icon: Coffee, label: 'Canteen' },
            { id: 'guest-house', icon: Home, label: 'Guest House' },
            { id: 'transport', icon: Bus, label: 'Transport' },
            { id: 'uniform', icon: Shirt, label: 'Uniform' },
            { id: 'sim-allocation', icon: Smartphone, label: 'SIM Allocation' },
            { id: 'asset-requests', icon: Package, label: 'Asset Requests' },
            { id: 'general-requests', icon: FileText, label: 'General Requests' }
          ]
        },
        {
          id: 'attendance',
          icon: Calendar,
          label: 'Attendance',
          hasDropdown: true,
          subItems: [
            { id: 'leaves', icon: Calendar, label: 'Leaves' },
            { id: 'my-attendance', icon: Eye, label: 'My Attendance View' }
          ]
        }
      ]
    },
    {
      title: "Work & Pay",
      items: [
        { id: 'payroll', icon: FileText, label: 'Payroll & Salary' },
        { id: 'training', icon: BookOpen, label: 'Training' },
        { id: 'documents', icon: FolderOpen, label: 'My Documents' }
      ]
    },
    {
      title: "Personal & Info",
      items: [
        { id: 'profile', icon: User, label: 'My Profile' },
        { id: 'welfare', icon: Heart, label: 'Employee Welfare' },
        { id: 'imagine', icon: Lightbulb, label: 'SMG Imagine' },
        { id: 'policies', icon: BookOpen, label: 'Company Policies' },
        { id: 'announcements', icon: Megaphone, label: 'Announcements' }
      ]
    }
  ];

  return (
    <aside className="hidden lg:flex w-[80px] hover:w-[260px] bg-[#042A5B] flex-col h-screen fixed left-0 top-0 z-50 border-r border-[#0B4DA2]/30 transition-all duration-300 group shadow-2xl overflow-hidden">
      <div className="p-6 border-b border-[#0B4DA2]/30 flex items-center gap-3 overflow-hidden whitespace-nowrap shrink-0">
        <div className="w-8 h-8 bg-[#0B4DA2] rounded-xl flex items-center justify-center font-bold text-white shadow-lg shrink-0 text-sm">SMG</div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <h2 className="text-white font-bold tracking-wide text-sm">SMG Scooters</h2>
          <p className="text-[10px] text-[#87CEEB] tracking-widest font-bold opacity-80">EMPLOYEE PORTAL</p>
        </div>
      </div>
      
      <nav className="flex-1 px-3 py-6 space-y-6 overflow-y-auto scrollbar-hide">
        {menuGroups.map((group, idx) => (
          <div key={idx}>
            <p className="px-3 text-[10px] font-bold text-[#87CEEB]/60 uppercase tracking-wider mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">{group.title}</p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <div key={item.id}>
                  {/* Main menu item */}
                  <button
                    onClick={() => item.hasDropdown ? toggleDropdown(item.id) : onNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      activePage === item.id
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
                    {item.hasDropdown && (
                      <ChevronDown
                        size={16}
                        className={`opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                          openDropdowns.includes(item.id) ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Sub-items */}
                  {item.hasDropdown && openDropdowns.includes(item.id) && (
                    <div className="ml-9 mt-1 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {item.subItems.map((subItem) => (
                        <button
                          key={subItem.id}
                          onClick={() => onNavigate(subItem.id)}
                          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                            activePage === subItem.id
                              ? 'bg-[#0B4DA2]/50 text-white font-bold'
                              : 'text-[#87CEEB]/80 hover:bg-[#0B4DA2]/10 hover:text-[#87CEEB]'
                          }`}
                        >
                          <subItem.icon size={16} />
                          <span className="whitespace-nowrap">{subItem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'employee' | 'admin'>('employee');
  const [activePage, setActivePage] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogin = (role: 'employee' | 'admin') => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActivePage('dashboard');
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activePage) {
      // Main Pages
      case 'dashboard': return <DashboardPage userData={INITIAL_DATA.user} />;
      case 'projects': return <ProjectsPage />;
      case 'profile': return <ProfilePage userData={INITIAL_DATA.user} />;
      
      // Service Catalog Sub-items
      case 'canteen': return <CanteenPage />;
      case 'guest-house': return <GuestHousePage />;
      case 'transport': return <TransportPage />;
      case 'uniform': return <UniformPage />;
      case 'sim-allocation': return <SIMAllocationPage />;
      case 'asset-requests': return <AssetRequestsPage />;
      case 'general-requests': return <GeneralRequestsPage />;
      
      // Attendance Sub-items
      case 'leaves': return <LeavesPage />;
      case 'my-attendance': return <MyAttendancePage />;
      
      // Work & Pay Pages
      case 'payroll': return <PayrollPage />;
      case 'training': return <TrainingPage />;
      case 'documents': return <DocumentsPage />;
      
      // Personal & Info Pages
      case 'welfare': return <WelfarePage />;
      case 'imagine': return <ImaginePage />;
      case 'policies': return <PoliciesPage />;
      case 'announcements': return <AnnouncementsPage />;
      case 'notifications': return <NotificationsPage />;
      
      default: return (<div className="flex flex-col items-center justify-center h-[50vh] text-gray-400 animate-in fade-in"><Settings size={64} className="mb-4 text-[#0B4DA2] opacity-20" /><h2 className="text-xl font-bold text-[#1B254B]">Page Under Construction</h2><p className="text-sm text-[#A3AED0] mt-2">This page is being developed</p></div>);
    }
  };
  
  return (
    <div className="bg-[#F4F7FE] min-h-screen font-sans text-[#1B254B] selection:bg-[#0B4DA2] selection:text-white">
      <Sidebar activePage={activePage} onNavigate={setActivePage} onLogout={handleLogout} />
      <div className="lg:ml-[80px] min-h-screen flex flex-col transition-all duration-300">
        <Topbar user={INITIAL_DATA.user} onMobileMenu={() => setMobileMenuOpen(true)} onNavigate={setActivePage} />
        <main className="p-4 lg:p-6 w-full max-w-[1600px] mx-auto pb-24 lg:pb-8">{renderContent()}</main>
      </div>
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-[#1B254B]/60 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-white flex flex-col p-6 animate-in slide-in-from-left duration-300 shadow-2xl">
            <div className="flex justify-between items-center mb-8">
              <span className="text-2xl font-bold text-[#1B254B]">SMG Portal</span>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2 overflow-y-auto">
              {[
                {id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard},
                {id: 'projects', label: 'Projects', icon: Briefcase},
                {id: 'canteen', label: 'Canteen', icon: Coffee},
                {id: 'welfare', label: 'Welfare', icon: Heart}
              ].map(item => (
                <button 
                  key={item.id} 
                  className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-colors ${activePage === item.id ? 'bg-[#0B4DA2] text-white' : 'text-gray-500 hover:bg-[#F4F7FE]'}`} 
                  onClick={() => { setActivePage(item.id); setMobileMenuOpen(false); }}
                >
                  <item.icon size={20} />{item.label}
                </button>
              ))}
            </nav>
            <div className="mt-auto pt-6 border-t border-gray-100">
              <button onClick={handleLogout} className="flex items-center gap-2 text-[#EE5D50] font-bold w-full p-2 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
