import React, { useState } from 'react';
import { Bus, MapPin, Clock, Calendar, Users, CheckCircle, AlertCircle } from 'lucide-react';

export const TransportPage = () => {
  const routes = [
    { id: 1, name: 'Route A - Noida Sector 62', timing: '8:00 AM - 6:00 PM', capacity: '45 seats', available: 12, status: 'Active' },
    { id: 2, name: 'Route B - Greater Noida', timing: '7:30 AM - 5:30 PM', capacity: '45 seats', available: 5, status: 'Active' },
    { id: 3, name: 'Route C - Delhi NCR', timing: '9:00 AM - 7:00 PM', capacity: '45 seats', available: 0, status: 'Full' },
    { id: 4, name: 'Route D - Ghaziabad', timing: '8:30 AM - 6:30 PM', capacity: '45 seats', available: 18, status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-white mb-2 flex items-center gap-3"><Bus size={32} /> Transport Service</h1>
        <p className="text-[#87CEEB] opacity-90">Book and manage your office transportation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <Bus className="text-[#0B4DA2] mb-3" size={28} />
          <h4 className="text-[#1B254B] mb-1">Total Routes</h4>
          <p className="text-3xl font-bold text-[#0B4DA2]">{routes.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <CheckCircle className="text-[#05CD99] mb-3" size={28} />
          <h4 className="text-[#1B254B] mb-1">Your Route</h4>
          <p className="text-xl font-bold text-[#1B254B]">Route A</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <Clock className="text-[#FFB547] mb-3" size={28} />
          <h4 className="text-[#1B254B] mb-1">Pick-up Time</h4>
          <p className="text-xl font-bold text-[#1B254B]">8:15 AM</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-6">Available Routes</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {routes.map(route => (
            <div key={route.id} className="border-2 border-gray-100 rounded-xl p-6 hover:border-[#0B4DA2] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="text-[#1B254B] font-bold mb-2">{route.name}</h4>
                  <div className="space-y-2 text-sm text-[#A3AED0]">
                    <p className="flex items-center gap-2"><Clock size={16} /> {route.timing}</p>
                    <p className="flex items-center gap-2"><Users size={16} /> {route.capacity}</p>
                    <p className="flex items-center gap-2">
                      <MapPin size={16} /> 
                      {route.available > 0 ? `${route.available} seats available` : 'Fully Booked'}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                  route.status === 'Active' ? 'bg-green-50 text-[#05CD99]' : 'bg-red-50 text-[#EE5D50]'
                }`}>
                  {route.status}
                </span>
              </div>
              <button 
                disabled={route.available === 0}
                className={`w-full py-3 rounded-xl font-bold transition-colors ${
                  route.available > 0 
                    ? 'bg-[#0B4DA2] text-white hover:bg-[#042A5B]' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {route.available > 0 ? 'Request Seat' : 'Not Available'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-4">My Transport Requests</h3>
        <div className="space-y-3">
          {[
            { id: 'TR001', route: 'Route A - Noida Sector 62', date: 'Ongoing', status: 'Approved' },
            { id: 'TR002', route: 'Route B - Greater Noida', date: 'Nov 2024', status: 'Completed' },
          ].map(request => (
            <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-[#1B254B]">{request.route}</p>
                <p className="text-sm text-[#A3AED0] mt-1">{request.date}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-lg ${
                request.status === 'Approved' ? 'bg-green-50 text-[#05CD99]' : 'bg-blue-50 text-[#0B4DA2]'
              }`}>
                {request.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
