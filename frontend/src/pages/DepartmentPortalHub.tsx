import { useState } from 'react';
import { motion } from 'motion/react';
import {
  Building2,
  Coffee,
  Users,
  IndianRupee,
  Clock,
  Calendar,
  Shield,
  Wrench,
  Package,
  TrendingUp,
  Bus,
  Smartphone,
  Shirt,
  Home,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  LogOut
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';

// Use text-based logo instead of image (Figma asset not available)
const SMGLogo = () => (
  <div className="flex items-center justify-center h-20">
    <span className="text-4xl font-extrabold text-[#0B4DA2]">SMG</span>
  </div>
);

import { CanteenPortal } from './departments/CanteenPortal';

import { TransportPortal } from './departments/TransportPortal';
import { FinancePortal } from './departments/FinancePortal';
import { ReceptionPortal } from './departments/ReceptionPortal';
import { HRPortal } from './departments/HRPortal';
import { TimeOfficePortal } from './departments/TimeOfficePortal';
import { SimPortal } from './departments/SimPortal';
import { UniformPortal } from './departments/UniformPortal';
import { GuesthousePortal } from './departments/GuesthousePortal';
import { EventsPortal } from './departments/EventsPortal';
import { AssemblyPortal } from './departments/AssemblyPortal';
import { TechnicianPortal } from './departments/TechnicianPortal';

type DepartmentType =
  | 'reception'
  | 'hr'
  | 'finance'
  | 'time-office'
  | 'canteen'
  | 'events'
  | 'hod'
  | 'technician'
  | 'assembly'
  | 'marketing'
  | 'transport'
  | 'sim'
  | 'uniform'
  | 'guesthouse';

interface Department {
  id: DepartmentType;
  name: string;
  email: string;
  password: string;
  icon: any;
  color: string;
  description: string;
}

const departments: Department[] = [
  {
    id: 'reception',
    name: 'Reception',
    email: 'reception@smg',
    password: 'reception',
    icon: Building2,
    color: 'from-blue-500 to-blue-600',
    description: 'Visitor management & front desk operations'
  },
  {
    id: 'hr',
    name: 'Human Resource',
    email: 'hr@smg',
    password: 'hr',
    icon: Users,
    color: 'from-purple-500 to-purple-600',
    description: 'Employee management & recruitment'
  },
  {
    id: 'finance',
    name: 'Finance',
    email: 'finance@smg',
    password: 'finance',
    icon: IndianRupee,
    color: 'from-green-500 to-green-600',
    description: 'Payroll, loans & asset management'
  },
  {
    id: 'time-office',
    name: 'Time Office',
    email: 'timeoffice@smg',
    password: 'timeoffice',
    icon: Clock,
    color: 'from-orange-500 to-orange-600',
    description: 'Attendance & shift management'
  },
  {
    id: 'canteen',
    name: 'Canteen',
    email: 'canteen@smg',
    password: 'canteen',
    icon: Coffee,
    color: 'from-amber-500 to-amber-600',
    description: 'Coupon sales & meal management'
  },
  {
    id: 'events',
    name: 'Events',
    email: 'events@smg',
    password: 'events',
    icon: Calendar,
    color: 'from-pink-500 to-pink-600',
    description: 'Event planning & coordination'
  },
  {
    id: 'technician',
    name: 'Technician',
    email: 'technician@smg',
    password: 'technician',
    icon: Wrench,
    color: 'from-gray-500 to-gray-600',
    description: 'Equipment maintenance & repairs'
  },
  {
    id: 'assembly',
    name: 'Assembly',
    email: 'assembly@smg',
    password: 'assembly',
    icon: Package,
    color: 'from-teal-500 to-teal-600',
    description: 'Production & assembly operations'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    email: 'marketing@smg',
    password: 'marketing',
    icon: TrendingUp,
    color: 'from-red-500 to-red-600',
    description: 'Campaigns & market analysis'
  },
  {
    id: 'transport',
    name: 'P&A (Transport)',
    email: 'transport@smg',
    password: 'transport',
    icon: Bus,
    color: 'from-cyan-500 to-cyan-600',
    description: 'Bus, parking & trip management'
  },
  {
    id: 'sim',
    name: 'P&A (SIM)',
    email: 'sim@smg',
    password: 'sim',
    icon: Smartphone,
    color: 'from-violet-500 to-violet-600',
    description: 'SIM card allocation & management'
  },
  {
    id: 'uniform',
    name: 'P&A (Uniform)',
    email: 'uniform@smg',
    password: 'uniform',
    icon: Shirt,
    color: 'from-lime-500 to-lime-600',
    description: 'Uniform distribution & stock'
  },
  {
    id: 'guesthouse',
    name: 'P&A (Guest House)',
    email: 'guesthouse@smg',
    password: 'guesthouse',
    icon: Home,
    color: 'from-emerald-500 to-emerald-600',
    description: 'Guest house bookings & management'
  }
];

export function DepartmentPortalHub() {
  const [activeDepartment, setActiveDepartment] = useState<DepartmentType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleDepartmentSelect = (deptId: DepartmentType) => {
    setActiveDepartment(deptId);
    setIsLoggedIn(false);
    setLoginId('');
    setLoginPassword('');
    setLoginError('');
  };

  const handleLogout = () => {
    setActiveDepartment(null);
    setIsLoggedIn(false);
    setLoginId('');
    setLoginPassword('');
    setLoginError('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const dept = departments.find(d => d.id === activeDepartment);
    if (!dept) return;
    // Department credential validation
    if (loginId.trim() === dept.email && loginPassword === dept.password) {
      setIsLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid User ID or Password');
    }
  };

  // Render login form first if department selected but not logged in
  if (activeDepartment && !isLoggedIn) {
    const dept = departments.find(d => d.id === activeDepartment);
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0B4DA2] via-[#042A5B] to-[#0B4DA2] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/10 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10"
        >
          {/* Company Logo */}
          <div className="flex justify-center mb-4">
            <img
              src="/Company Logo.jpg"
              alt="SMG Logo"
              className="h-16 w-auto object-contain"
            />
          </div>

          {/* Portal Name */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-[#1B254B]">{dept?.name}</h2>
            <p className="text-gray-500 text-sm mt-1">{dept?.description}</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  className="pl-12 pr-4 w-full border-2 border-gray-200 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-[#0B4DA2] focus:border-[#0B4DA2] transition-all text-base"
                  placeholder="Enter your ID"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="pl-12 pr-12 w-full border-2 border-gray-200 rounded-xl py-3 focus:outline-none focus:ring-2 focus:ring-[#0B4DA2] focus:border-[#0B4DA2] transition-all text-base"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {loginError && (
              <p className="text-red-500 text-sm text-center bg-red-50 py-2 rounded-lg">{loginError}</p>
            )}

            {/* Extra spacing before Sign In button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:from-[#0A3C8A] hover:to-[#031B3A] text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-base"
              >
                Sign In
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </form>

          {/* Back Button */}
          <button
            onClick={handleLogout}
            className="mt-6 w-full flex items-center justify-center text-sm text-gray-500 hover:text-[#0B4DA2] transition-colors py-2 rounded-lg hover:bg-gray-50"
          >
            <LogOut className="mr-2 w-4 h-4" /> Back to Departments
          </button>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">Contact IT Support for access issues</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render department-specific portal after login
  if (activeDepartment && isLoggedIn) {
    return (
      <div>
        {/* Render specific department portal */}
        {activeDepartment === 'reception' && <ReceptionPortal />}
        {activeDepartment === 'hr' && <HRPortal />}
        {activeDepartment === 'finance' && <FinancePortal />}
        {activeDepartment === 'time-office' && <TimeOfficePortal />}
        {activeDepartment === 'canteen' && <CanteenPortal />}
        {activeDepartment === 'transport' && <TransportPortal />}
        {activeDepartment === 'sim' && <SimPortal />}
        {activeDepartment === 'uniform' && <UniformPortal />}
        {activeDepartment === 'guesthouse' && <GuesthousePortal />}
        {activeDepartment === 'events' && <EventsPortal />}
        {activeDepartment === 'assembly' && <AssemblyPortal />}
        {activeDepartment === 'technician' && <TechnicianPortal />}

        {/* Placeholder for other portals */}
        {!['reception', 'hr', 'finance', 'time-office', 'canteen', 'transport', 'sim', 'uniform', 'guesthouse', 'events', 'assembly', 'technician'].includes(activeDepartment) && (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#1B254B] mb-4">
                {departments.find(d => d.id === activeDepartment)?.name} Portal
              </h2>
              <p className="text-gray-600 mb-6">Coming Soon...</p>
              <Button
                onClick={handleLogout}
                className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }


  // Login screen - CU-IMS style with SMG blue theme
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B4DA2] via-[#042A5B] to-[#0B4DA2] relative overflow-hidden">
      {/* Animated Background Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white/10 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.3, 0.1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Header with Logo */}
      <div className="relative z-10 pt-8 pb-6">
        <motion.div
          className="flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Company Logo */}
          <div className="bg-white rounded-2xl px-8 py-4 shadow-2xl mb-6 flex items-center gap-4">
            <img
              src="/Company Logo.jpg"
              alt="SMG Logo"
              className="h-16 w-auto object-contain"
            />
            <div className="border-l-2 border-gray-200 pl-4">
              <span className="text-3xl font-extrabold text-[#0B4DA2] block">SMG Scooters</span>
              <span className="text-sm font-medium text-gray-500">Pvt. Ltd.</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-2">
            Department Portals
          </h1>
          <p className="text-white/80 text-lg">Select your department to continue</p>
        </motion.div>
      </div>

      {/* Department Cards Grid */}
      <div className="relative z-10 px-4 md:px-6 lg:px-8 pb-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col hover:shadow-2xl transition-shadow duration-300">
                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${dept.color} flex items-center justify-center shadow-lg`}>
                        <dept.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#1B254B] text-center mb-3">
                      {dept.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-500 text-sm text-center flex-1 leading-relaxed">
                      {dept.description}
                    </p>

                    {/* Login Button */}
                    <div className="mt-4">
                      <Button
                        onClick={() => handleDepartmentSelect(dept.id)}
                        className="w-full bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] hover:from-[#0A3C8A] hover:to-[#031B3A] text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        Login Now
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 py-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-white/60 text-sm">
            © 2025 SMG Scooters Pvt Ltd. All rights reserved.
          </p>
          <p className="text-white/40 text-xs mt-2">
            Contact IT Support for access issues
          </p>
        </motion.div>
      </div>
    </div>
  );
}