import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase, 
  User, 
  Edit2,
  Award,
  BookOpen,
  Globe,
  Heart,
  Shield,
  Download,
  Upload
} from 'lucide-react';

export const MyProfilePageOld = ({ user: initialUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(initialUser);

  useEffect(() => {
    const userId = localStorage.getItem('userId') || initialUser._id;
    if (!userId) return;
    
    fetch(`http://localhost:5000/api/user/${userId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          setUser({
            ...data,
            education: data.education || [],
            certifications: data.certifications || [],
            skills: data.skills || [],
            languages: data.languages || []
          });
        }
      })
      .catch(console.error);
  }, [initialUser._id]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Card with Photo */}
      <div className="bg-gradient-to-br from-[#042A5B] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-32 h-32 rounded-[24px] border-4 border-white/20 shadow-xl"
            />
            <button className="absolute bottom-2 right-2 bg-white text-[#0B4DA2] p-2 rounded-lg shadow-lg hover:bg-blue-50 transition-all active:scale-95">
              <Upload size={16} />
            </button>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
            <p className="text-blue-100 mb-4">{user.role} • {user.dept} Department</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border border-white/20">
                {user.empId}
              </span>
              <span className="bg-[#05CD99]/20 px-3 py-1 rounded-full text-xs font-bold text-[#05CD99] border border-[#05CD99]/20">
                Active Employee
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-[#0B4DA2] px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-all active:scale-95"
            >
              <Edit2 size={16} />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            <button className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 border border-white/20 hover:bg-white/20 transition-all active:scale-95">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1B254B] text-lg mb-4 flex items-center gap-2">
              <User size={20} className="text-[#0B4DA2]" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                <p className="font-bold text-[#1B254B]">{user.name}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Employee ID</label>
                <p className="font-bold text-[#1B254B]">{user.empId}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
                <p className="font-bold text-[#0B4DA2] text-sm flex items-center gap-2">
                  <Mail size={14} />
                  {user.email}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Phone Number</label>
                <p className="font-bold text-[#1B254B] flex items-center gap-2">
                  <Phone size={14} />
                  {user.phone}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Date of Birth</label>
                <p className="font-bold text-[#1B254B] flex items-center gap-2">
                  <Calendar size={14} />
                  {user.dateOfBirth}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Blood Group</label>
                <p className="font-bold text-[#1B254B] flex items-center gap-2">
                  <Heart size={14} className="text-red-500" />
                  {user.bloodGroup}
                </p>
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Address</label>
                <p className="font-bold text-[#1B254B] flex items-start gap-2">
                  <MapPin size={14} className="mt-1 shrink-0" />
                  {user.address}
                </p>
              </div>
            </div>
          </div>

          {/* Employment Details */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1B254B] text-lg mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-[#0B4DA2]" />
              Employment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Designation</label>
                <p className="font-bold text-[#1B254B]">{user.role}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Department</label>
                <p className="font-bold text-[#1B254B]">{user.dept}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Reporting Manager</label>
                <p className="font-bold text-[#1B254B]">{user.reportingTo}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Date of Joining</label>
                <p className="font-bold text-[#1B254B]">{user.dateOfJoining}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Shift</label>
                <p className="font-bold text-[#1B254B]">{user.shift}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Employment Type</label>
                <p className="font-bold text-[#1B254B]">Full-Time Permanent</p>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1B254B] text-lg mb-4 flex items-center gap-2">
              <BookOpen size={20} className="text-[#0B4DA2]" />
              Education
            </h3>
            <div className="space-y-4">
              {user.education.map((edu, idx) => (
                <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-white rounded-xl border border-blue-100">
                  <h4 className="font-bold text-[#1B254B] mb-1">{edu.degree}</h4>
                  <p className="text-sm text-gray-600 mb-1">{edu.institution}</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span className="font-bold">{edu.year}</span>
                    <span>•</span>
                    <span className="font-bold text-[#05CD99]">{edu.grade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Emergency Contact */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1B254B] text-lg mb-4 flex items-center gap-2">
              <Shield size={20} className="text-red-500" />
              Emergency Contact
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-xl border border-red-100">
                <p className="text-xs text-gray-500 mb-1">Emergency Number</p>
                <p className="font-bold text-[#1B254B] flex items-center gap-2">
                  <Phone size={14} className="text-red-500" />
                  {user.emergencyContact}
                </p>
              </div>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1B254B] text-lg mb-4 flex items-center gap-2">
              <Award size={20} className="text-[#FFB547]" />
              Certifications
            </h3>
            <div className="space-y-3">
              {user.certifications.map((cert, idx) => (
                <div key={idx} className="p-3 bg-gradient-to-r from-yellow-50 to-white rounded-xl border border-yellow-100">
                  <h4 className="font-bold text-[#1B254B] text-sm mb-1">{cert.name}</h4>
                  <p className="text-xs text-gray-600">{cert.issuer}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{cert.year}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1B254B] text-lg mb-4">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="bg-[#F4F7FE] text-[#0B4DA2] px-3 py-1.5 rounded-lg text-xs font-bold border border-blue-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <h3 className="font-bold text-[#1B254B] text-lg mb-4 flex items-center gap-2">
              <Globe size={20} className="text-[#0B4DA2]" />
              Languages
            </h3>
            <div className="space-y-2">
              {user.languages.map((lang, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#0B4DA2] rounded-full"></div>
                  <p className="text-sm font-bold text-[#1B254B]">{lang}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
