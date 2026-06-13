import React, { useState } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header
      className="h-16 flex items-center justify-between px-4 lg:px-6 bg-white sticky top-0 z-30 shadow-sm"
      style={{ borderBottom: '1px solid var(--smg-border)' }}
    >
      {/* Left: Mobile menu + Search */}
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} style={{ color: 'var(--smg-dark)' }} />
        </button>

        <div className="hidden md:flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5 flex-1 max-w-md border border-gray-100">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 text-sm placeholder:text-gray-400"
            aria-label="Search"
          />
          <kbd className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded text-xs text-gray-500">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-3">
        {/* Mobile search */}
        <button className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors" aria-label="Search">
          <Search size={20} style={{ color: 'var(--smg-dark)' }} />
        </button>

        {/* Notifications */}
        <button
          className="relative p-2.5 hover:bg-gray-100 rounded-xl transition-colors"
          aria-label="Notifications"
        >
          <Bell size={20} style={{ color: 'var(--smg-dark)' }} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: 'var(--smg-danger)' }}
          />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3 pl-3 ml-3" style={{ borderLeft: '1px solid var(--smg-border)' }}>
          <div className="hidden sm:block text-right">
            <p className="text-sm" style={{ color: 'var(--smg-dark)' }}>
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-gray-500">{user?.designation || 'Employee'}</p>
          </div>
          <div className="relative">
            <img
              src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
              alt={user?.name || 'User'}
              className="w-10 h-10 rounded-xl object-cover"
              style={{ border: '2px solid var(--smg-light-blue)' }}
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
}