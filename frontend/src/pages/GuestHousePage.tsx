import React, { useState } from 'react';
import { Home, Calendar, MapPin, Users, Star, Clock, CheckCircle } from 'lucide-react';

export const GuestHousePage = () => {
  const [selectedDates, setSelectedDates] = useState({ checkIn: '', checkOut: '' });

  const guestHouses = [
    { id: 1, name: 'Executive Suite', location: 'Noida Sector 62', capacity: 2, price: 1200, rating: 4.5, amenities: ['WiFi', 'AC', 'TV', 'Breakfast'], available: true },
    { id: 2, name: 'Deluxe Room', location: 'Greater Noida', capacity: 3, price: 800, rating: 4.3, amenities: ['WiFi', 'AC', 'TV'], available: true },
    { id: 3, name: 'Standard Room', location: 'Noida Sector 18', capacity: 2, price: 600, rating: 4.0, amenities: ['WiFi', 'Fan'], available: false },
    { id: 4, name: 'Family Suite', location: 'Noida Sector 62', capacity: 4, price: 1500, rating: 4.7, amenities: ['WiFi', 'AC', 'TV', 'Breakfast', 'Kitchenette'], available: true },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-white mb-2 flex items-center gap-3"><Home size={32} /> Guest House Booking</h1>
        <p className="text-[#87CEEB] opacity-90">Reserve comfortable accommodations for official visits</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-4">Search Availability</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-[#A3AED0] mb-2 block">Check-in</label>
            <input type="date" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none" 
              value={selectedDates.checkIn} onChange={(e) => setSelectedDates({...selectedDates, checkIn: e.target.value})} />
          </div>
          <div>
            <label className="text-sm text-[#A3AED0] mb-2 block">Check-out</label>
            <input type="date" className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none"
              value={selectedDates.checkOut} onChange={(e) => setSelectedDates({...selectedDates, checkOut: e.target.value})} />
          </div>
          <div>
            <label className="text-sm text-[#A3AED0] mb-2 block">Guests</label>
            <select className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none">
              <option>1 Guest</option>
              <option>2 Guests</option>
              <option>3 Guests</option>
              <option>4+ Guests</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full bg-[#0B4DA2] text-white py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {guestHouses.map(house => (
          <div key={house.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-[#1B254B] mb-1">{house.name}</h3>
                <div className="flex items-center gap-3 text-sm text-[#A3AED0]">
                  <span className="flex items-center gap-1"><MapPin size={14} /> {house.location}</span>
                  <span className="flex items-center gap-1"><Users size={14} /> {house.capacity} Guests</span>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-bold text-yellow-700">{house.rating}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {house.amenities.map((amenity, idx) => (
                <span key={idx} className="px-3 py-1 bg-blue-50 text-[#0B4DA2] text-xs font-bold rounded-lg">
                  {amenity}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div>
                <p className="text-sm text-[#A3AED0]">Per Night</p>
                <p className="text-2xl font-bold text-[#0B4DA2]">₹{house.price}</p>
              </div>
              <button 
                disabled={!house.available}
                className={`px-6 py-3 rounded-xl font-bold transition-colors ${
                  house.available 
                    ? 'bg-[#0B4DA2] text-white hover:bg-[#042A5B]' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {house.available ? 'Book Now' : 'Not Available'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-[#1B254B] mb-4 flex items-center gap-2"><Clock size={20} /> My Bookings</h3>
        <div className="space-y-3">
          {[
            { id: 'BK001', room: 'Executive Suite', dates: 'Dec 20-22, 2024', status: 'Confirmed', amount: 2400 },
            { id: 'BK002', room: 'Deluxe Room', dates: 'Nov 15-16, 2024', status: 'Completed', amount: 800 },
          ].map(booking => (
            <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-bold text-[#1B254B]">{booking.room}</p>
                <p className="text-sm text-[#A3AED0] flex items-center gap-1 mt-1">
                  <Calendar size={14} /> {booking.dates}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-[#1B254B]">₹{booking.amount}</p>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                  booking.status === 'Confirmed' ? 'bg-blue-50 text-[#0B4DA2]' : 'bg-green-50 text-[#05CD99]'
                }`}>
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
