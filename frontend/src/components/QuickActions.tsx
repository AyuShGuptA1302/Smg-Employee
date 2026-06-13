import React from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';

const colorMap = {
  blue: { bg: '#E3F2FD', icon: '#0B4DA2', hover: '#BBDEFB' },
  green: { bg: '#E8F5E9', icon: '#10b981', hover: '#C8E6C9' },
  orange: { bg: '#FFF3E0', icon: '#f59e0b', hover: '#FFE0B2' },
  purple: { bg: '#F3E5F5', icon: '#9333ea', hover: '#E1BEE7' },
  indigo: { bg: '#E8EAF6', icon: '#4F46E5', hover: '#C5CAE9' },
  red: { bg: '#FFEBEE', icon: '#ef4444', hover: '#FFCDD2' },
};

interface Action {
  id: number;
  title: string;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'indigo' | 'red';
  route?: string;
}

interface QuickActionsProps {
  actions: Action[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  const navigate = useNavigate();

  const handleActionClick = (route?: string) => {
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm" style={{ borderColor: 'var(--smg-border)' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 style={{ color: 'var(--smg-dark)' }}>
          Quick Actions
        </h3>
        <p className="text-xs text-gray-500">Shortcuts to common tasks</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action) => {
          const IconComponent = (Icons as any)[action.icon] || Icons.Activity;
          const colors = colorMap[action.color] || colorMap.blue;

          return (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.route)}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl hover:shadow-lg transition-all group relative overflow-hidden"
              style={{ backgroundColor: colors.bg }}
              aria-label={action.title}
            >
              {/* Hover effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: `linear-gradient(135deg, ${colors.icon}15 0%, ${colors.icon}05 100%)` }} />
              
              <div className="relative">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white shadow-sm group-hover:scale-110 transition-transform"
                  style={{ color: colors.icon }}
                >
                  <IconComponent size={26} strokeWidth={2.5} />
                </div>
              </div>
              <span className="text-xs text-center font-medium relative" style={{ color: 'var(--smg-dark)' }}>
                {action.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}