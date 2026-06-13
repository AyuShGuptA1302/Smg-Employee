import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Briefcase, Award, Edit, Save, X } from 'lucide-react';

export const ProfilePage = ({ userData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <img src={userData.avatar} alt={userData.name} className="w-24 h-24 rounded-2xl border-4 border-white/20" />
            <div>
              <h1 className="text-white mb-2">{userData.name}</h1>
              <p className="text-[#87CEEB] opacity-90">{userData.role} • {userData.dept}</p>
              <p className="text-sm text-white/70 mt-1">Employee ID: {userData.empId}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white text-[#0B4DA2] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            {isEditing ? <><X size={20} /> Cancel</> : <><Edit size={20} /> Edit Profile</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-[#1B254B] mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-[#A3AED0] mb-2 block">Full Name</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm text-[#A3AED0] mb-2 block">Email Address</label>
                <input 
                  type="email" 
                  disabled={!isEditing}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm text-[#A3AED0] mb-2 block">Phone Number</label>
                <input 
                  type="tel" 
                  disabled={!isEditing}
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none disabled:bg-gray-50"
                />
              </div>
              <div>
                <label className="text-sm text-[#A3AED0] mb-2 block">Date of Birth</label>
                <input 
                  type="text" 
                  disabled={!isEditing}
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none disabled:bg-gray-50"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-[#A3AED0] mb-2 block">Address</label>
                <textarea 
                  disabled={!isEditing}
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none disabled:bg-gray-50"
                />
              </div>
            </div>
            {isEditing && (
              <button className="mt-6 bg-[#0B4DA2] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors flex items-center gap-2">
                <Save size={20} /> Save Changes
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-[#1B254B] mb-6">Employment Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Briefcase className="text-[#0B4DA2] mt-1" size={20} />
                <div>
                  <p className="text-sm text-[#A3AED0]">Department</p>
                  <p className="font-bold text-[#1B254B]">{userData.dept}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="text-[#0B4DA2] mt-1" size={20} />
                <div>
                  <p className="text-sm text-[#A3AED0]">Date of Joining</p>
                  <p className="font-bold text-[#1B254B]">{userData.dateOfJoining}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="text-[#0B4DA2] mt-1" size={20} />
                <div>
                  <p className="text-sm text-[#A3AED0]">Reporting To</p>
                  <p className="font-bold text-[#1B254B]">{userData.reportingTo}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Award className="text-[#0B4DA2] mt-1" size={20} />
                <div>
                  <p className="text-sm text-[#A3AED0]">Shift Timing</p>
                  <p className="font-bold text-[#1B254B]">{userData.shift}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-[#1B254B] mb-6">Education</h3>
            <div className="space-y-4">
              {userData.education.map((edu, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                  <p className="font-bold text-[#1B254B]">{edu.degree}</p>
                  <p className="text-sm text-[#A3AED0]">{edu.institution} • {edu.year}</p>
                  <p className="text-sm text-[#0B4DA2] mt-1">Grade: {edu.grade}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-[#1B254B] mb-6">Quick Stats</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-[#0B4DA2] mb-1">Leave Balance</p>
                <p className="text-2xl font-bold text-[#0B4DA2]">12 Days</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl">
                <p className="text-sm text-[#05CD99] mb-1">Attendance</p>
                <p className="text-2xl font-bold text-[#05CD99]">95%</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-xl">
                <p className="text-sm text-[#FFB547] mb-1">Training Hours</p>
                <p className="text-2xl font-bold text-[#FFB547]">24 Hrs</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-[#1B254B] mb-6">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill, idx) => (
                <span key={idx} className="px-3 py-2 bg-blue-50 text-[#0B4DA2] text-sm font-bold rounded-lg">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-[#1B254B] mb-6">Certifications</h3>
            <div className="space-y-3">
              {userData.certifications.map((cert, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-xl">
                  <p className="font-bold text-[#1B254B] text-sm">{cert.name}</p>
                  <p className="text-xs text-[#A3AED0] mt-1">{cert.issuer} • {cert.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
