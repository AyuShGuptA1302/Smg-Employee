import React from 'react';
import * as Icons from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const colorMap = {
  blue: { bg: '#E3F2FD', icon: '#0B4DA2' },
  green: { bg: '#E8F5E9', icon: '#10b981' },
  orange: { bg: '#FFF3E0', icon: '#f59e0b' },
  purple: { bg: '#F3E5F5', icon: '#9333ea' },
};

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: string;
  trendUp?: boolean;
  icon: string;
  color?: 'blue' | 'green' | 'orange' | 'purple';
}

export function SummaryCard({ title, value, subtitle, trend, trendUp, icon, color = 'blue' }: SummaryCardProps) {
  const IconComponent = (Icons as any)[icon] || Icons.Activity;
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-2xl p-6 border hover:shadow-xl transition-all min-w-[280px] relative overflow-hidden group" style={{ borderColor: 'var(--smg-border)' }}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10 transition-opacity group-hover:opacity-20" style={{ backgroundColor: colors.icon }} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm"
            style={{ backgroundColor: colors.bg }}
          >
            <IconComponent size={26} style={{ color: colors.icon }} strokeWidth={2.5} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-500 uppercase tracking-wide">{title}</p>
          <h3 className="text-4xl" style={{ color: 'var(--smg-dark)' }}>
            {value}
          </h3>
          <p className="text-sm text-gray-600">{subtitle}</p>
        </div>

        {trend && (
          <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--smg-border)' }}>
            <div className="flex items-center gap-2">
              {trendUp ? (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ backgroundColor: '#ECFDF5' }}>
                  <TrendingUp size={14} style={{ color: 'var(--smg-success)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--smg-success)' }}>
                    {trend}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ backgroundColor: '#FEF2F2' }}>
                  <TrendingDown size={14} style={{ color: 'var(--smg-danger)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--smg-danger)' }}>
                    {trend}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}