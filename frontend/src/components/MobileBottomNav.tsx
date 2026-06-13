import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, User, FileText, GraduationCap, HelpCircle } from 'lucide-react';

const navItems = [
  { id: 1, name: 'Dashboard', icon: LayoutDashboard, path: '/employee/dashboard' },
  { id: 2, name: 'Requests', icon: FileText, path: '/employee/requests' },
  { id: 3, name: 'Profile', icon: User, path: '/employee/profile' },
  { id: 4, name: 'Training', icon: GraduationCap, path: '/employee/training' },
  { id: 5, name: 'Support', icon: HelpCircle, path: '/employee/support' },
];

export function MobileBottomNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 bg-white z-30 shadow-lg"
      style={{ borderTop: '1px solid var(--smg-border)' }}
      aria-label="Mobile bottom navigation"
    >
      <ul className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <li key={item.id} className="flex-1">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center h-full gap-1 rounded-xl transition-all ${
                  isActive ? '' : 'text-gray-400'
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--smg-royal)' : undefined,
              })}
              aria-label={item.name}
            >
              {({ isActive }) => (
                <>
                  <div className={`p-1 rounded-xl transition-all ${isActive ? 'scale-110' : ''}`}>
                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-xs ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.name}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}