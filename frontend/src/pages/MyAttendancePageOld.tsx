import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  CheckCircle, 
  Clock, 
  Calendar,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

export const MyAttendancePageOld = ({ logs, user }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full border-4 border-[#F4F7FE]" />
          <div>
            <h2 className="text-xl font-bold text-[#1B254B]">{user.name}</h2>
            <div className="flex gap-3 text-xs text-gray-500 mt-1">
              <span>{user.role}</span>
              <span>•</span>
              <span className="text-[#0B4DA2] font-bold">{user.empId}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors">
            View Details
          </button>
          <button className="px-4 py-2 bg-[#042A5B] text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#0B4DA2] transition-colors active:scale-95">
            <Plus size={16} /> Add Attendance
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {[
          { label: "Day off", val: "12", diff: "+12", bad: false },
          { label: "Late clock-in", val: "6", diff: "-2", bad: true },
          { label: "Late clock-out", val: "21", diff: "-12", bad: true },
          { label: "No clock-out", val: "2", diff: "+4", bad: true },
          { label: "Off time quota", val: "1", diff: "0", bad: false },
          { label: "Absent", val: "2", diff: "0", bad: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow">
            <p className="text-xs text-gray-400 font-bold mb-1">{stat.label}</p>
            <h3 className="text-2xl font-bold text-[#1B254B]">{stat.val}</h3>
            <p className={`text-[10px] font-bold mt-1 flex items-center justify-center gap-1 ${stat.bad ? 'text-[#EE5D50]' : 'text-[#05CD99]'}`}>
              {stat.bad ? <TrendingDown size={10} /> : <TrendingUp size={10} />}
              {stat.diff} <span className="text-gray-400 font-normal">vs last month</span>
            </p>
          </div>
        ))}
      </div>

      {/* Attendance Logs */}
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h3 className="font-bold text-[#1B254B] text-lg">December 2024</h3>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search" 
                className="pl-9 pr-4 py-2 bg-[#F4F7FE] rounded-xl text-sm outline-none border border-transparent focus:border-[#0B4DA2]/30 transition-colors" 
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
              <Filter size={16} /> All Status
            </button>
          </div>
        </div>

        {/* Attendance Timeline */}
        <div className="space-y-6">
          {logs.map((log) => (
            <div key={log.id} className="border-b border-gray-50 last:border-0 pb-6 last:pb-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                <h4 className="font-bold text-[#1B254B]">{log.day}, {log.date.split(' ')[1]}</h4>
                {log.isLeave ? (
                  <span className="text-[10px] bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <CheckCircle size={10}/> Requested day off
                  </span>
                ) : (
                  <button className="bg-[#042A5B] text-white text-[10px] px-3 py-1.5 rounded-lg flex items-center gap-1 font-bold hover:bg-[#0B4DA2] transition-colors active:scale-95">
                    <CheckCircle size={10} /> Approve
                  </button>
                )}
              </div>

              {!log.isLeave ? (
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  {/* Clock In */}
                  <div className="flex flex-col gap-1 w-24 shrink-0">
                    <span className="text-xs text-gray-400">Clock-in</span>
                    <span className="font-bold text-[#1B254B] text-sm">{log.checkIn}</span>
                  </div>
                  
                  {/* Timeline Visualization */}
                  <div className="flex-1 w-full relative group">
                    <div className="flex h-8 rounded-lg overflow-hidden w-full bg-gray-100 relative">
                      {log.segments.map((seg, idx) => (
                        <div 
                          key={idx} 
                          style={{ width: seg.width }} 
                          className={`${seg.color} h-full relative group/seg transition-all hover:opacity-80`}
                        >
                          <div className="opacity-0 group-hover/seg:opacity-100 absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap pointer-events-none z-10 transition-opacity">
                            {seg.type}
                          </div>
                        </div>
                      ))}
                    </div>
                    {/* Time Labels */}
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
                      <span>09:00</span>
                      <span>12:00</span>
                      <span>15:00</span>
                      <span>18:00</span>
                      <span>21:00</span>
                    </div>
                  </div>

                  {/* Clock Out */}
                  <div className="flex flex-col gap-1 w-24 shrink-0 text-right">
                    <span className="text-xs text-gray-400">Clock-out</span>
                    <span className="font-bold text-[#1B254B] text-sm">{log.checkOut}</span>
                  </div>

                  {/* Duration */}
                  <div className="flex flex-col gap-1 w-20 shrink-0 text-right">
                    <span className="text-xs text-gray-400">Duration</span>
                    <span className="font-bold text-[#1B254B] text-sm">{log.duration}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 w-full p-3 rounded-xl text-center text-yellow-700 text-sm font-bold">
                  On Leave - Requested Day Off
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 font-bold mb-3 uppercase tracking-wide">Timeline Legend</p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#0B4DA2] rounded"></div>
              <span className="text-xs text-gray-600">Work Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#05CD99] rounded"></div>
              <span className="text-xs text-gray-600">Break</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#FFB547] rounded"></div>
              <span className="text-xs text-gray-600">Overtime</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#EE5D50] rounded"></div>
              <span className="text-xs text-gray-600">Late/Absent</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
