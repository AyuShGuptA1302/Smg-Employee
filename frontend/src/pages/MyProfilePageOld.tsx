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
  Upload,
  X,
  Save,
  Clock
} from 'lucide-react';

export const MyProfilePageOld = ({ user: initialUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    bloodGroup: '',
    address: '',
    emergencyContact: ''
  });
  const [hasPendingRequest, setHasPendingRequest] = useState(false);
  const [pendingRequestDetails, setPendingRequestDetails] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchPendingRequest = () => {
    const userId = localStorage.getItem('userId') || initialUser._id;
    if (!userId) return;
    fetch(`/api/requests/${userId}`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const pending = data.find((r: any) => r.type && r.type.startsWith('Profile Update') && r.status === 'Pending');
        if (pending) {
          setHasPendingRequest(true);
          setPendingRequestDetails(pending);
        } else {
          setHasPendingRequest(false);
          setPendingRequestDetails(null);
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId') || initialUser._id;
    if (!userId) return;
    
    fetch(`/api/user/${userId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) {
          const u = {
            ...data,
            education: data.education || [],
            certifications: data.certifications || [],
            skills: data.skills || [],
            languages: data.languages || []
          };
          setUser(u);
          setFormData({
            name: u.name || '',
            email: u.email || '',
            phone: u.phone || '',
            dateOfBirth: u.dateOfBirth || '',
            bloodGroup: u.bloodGroup || '',
            address: u.address || '',
            emergencyContact: u.emergencyContact || ''
          });
        }
      })
      .catch(console.error);

    fetchPendingRequest();
  }, [initialUser._id]);

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      dateOfBirth: user.dateOfBirth || '',
      bloodGroup: user.bloodGroup || '',
      address: user.address || '',
      emergencyContact: user.emergencyContact || ''
    });
    setIsEditing(false);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleSubmitRequest = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setErrorMessage('Name and Email are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem('userId') || initialUser._id;
      const changedFields: Record<string, string> = {};
      const fieldsToCompare = ['name', 'email', 'phone', 'dateOfBirth', 'bloodGroup', 'address', 'emergencyContact'] as const;
      
      fieldsToCompare.forEach(field => {
        if (formData[field] !== (user[field] || '')) {
          changedFields[field] = formData[field];
        }
      });

      if (Object.keys(changedFields).length === 0) {
        setErrorMessage('No changes detected.');
        setIsSubmitting(false);
        return;
      }

      const res = await fetch('/api/profile-update-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          fields: changedFields,
          requesterRole: user.role
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit request.');
      }

      const isAdminUser = user.role === 'admin' || user.role === 'superadmin';
      setSuccessMessage(isAdminUser
        ? 'Profile update request submitted to Super Admin for approval!'
        : 'Profile update request submitted to HR successfully!');
      setIsEditing(false);
      fetchPendingRequest();
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            {isEditing ? (
              <>
                <button 
                  onClick={handleSubmitRequest}
                  disabled={isSubmitting}
                  className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-green-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  <Save size={16} />
                  Submit Request
                </button>
                <button 
                  onClick={handleCancel}
                  className="bg-white text-gray-700 border border-gray-200 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-50 transition-all active:scale-95"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  disabled={hasPendingRequest}
                  className="bg-white text-[#0B4DA2] px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit2 size={16} />
                  Edit Profile
                </button>
                <button 
                  className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 border border-white/20 hover:bg-white/20 transition-all active:scale-95"
                  onClick={async () => {
                    const userId = localStorage.getItem('userId') || initialUser._id;
                    const empId = user.empId || userId;
                    try {
                      const res = await fetch(`/api/user/${userId}/export-profile`);
                      if (!res.ok) {
                        const errData = await res.json().catch(() => ({}));
                        throw new Error(errData.message || 'Failed to generate PDF');
                      }
                      const blob = await res.blob();
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `SMG_Profile_${empId}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    } catch (err: any) {
                      const msg = err.message || '';
                      if (msg.includes('User not found')) {
                        alert('Your session is stale (database was recently reset). Please sign out and sign back in to download your profile PDF successfully.');
                      } else {
                        alert(`PDF export failed: ${msg || 'Please try again.'}`);
                      }
                    }
                  }}
                >
                  <Download size={16} />
                  Export
                </button>
              </>
            )}
          </div>
        </div>
      </div>


      {hasPendingRequest && (
        <div className="bg-blue-50 border border-blue-200 text-[#0B4DA2] p-4 rounded-2xl flex items-center gap-3 animate-in fade-in">
          <Clock size={20} className="shrink-0 text-[#0B4DA2]" />
          <div>
            <p className="font-bold text-sm">Profile Update Request Under Review</p>
            <p className="text-xs text-[#0B4DA2]/80 mt-0.5">
              You submitted a request to update your profile on {new Date(pendingRequestDetails.createdAt).toLocaleDateString()}.
              {' '}Changes will reflect once approved by {(user.role === 'admin' || user.role === 'superadmin') ? 'Super Admin' : 'HR'}.
            </p>
            {pendingRequestDetails.type && (
              <p className="text-xs font-bold text-[#0B4DA2] mt-1">{pendingRequestDetails.type}</p>
            )}
          </div>
        </div>
      )}

      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-ping shrink-0" />
          <p className="font-bold text-sm">{successMessage}</p>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in">
          <span className="w-2 h-2 bg-red-500 rounded-full shrink-0" />
          <p className="font-bold text-sm">{errorMessage}</p>
        </div>
      )}

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
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-[#1B254B] focus:outline-none focus:border-[#0B4DA2] font-bold"
                  />
                ) : (
                  <p className="font-bold text-[#1B254B]">{user.name}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Employee ID</label>
                <p className="font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg text-sm">{user.empId}</p>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-[#1B254B] focus:outline-none focus:border-[#0B4DA2] font-bold"
                  />
                ) : (
                  <p className="font-bold text-[#0B4DA2] text-sm flex items-center gap-2">
                    <Mail size={14} />
                    {user.email}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Phone Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-[#1B254B] focus:outline-none focus:border-[#0B4DA2] font-bold"
                  />
                ) : (
                  <p className="font-bold text-[#1B254B] flex items-center gap-2">
                    <Phone size={14} />
                    {user.phone}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Date of Birth</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-[#1B254B] focus:outline-none focus:border-[#0B4DA2] font-bold"
                    placeholder="DD-MM-YYYY"
                  />
                ) : (
                  <p className="font-bold text-[#1B254B] flex items-center gap-2">
                    <Calendar size={14} />
                    {user.dateOfBirth}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Blood Group</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-[#1B254B] focus:outline-none focus:border-[#0B4DA2] font-bold"
                  />
                ) : (
                  <p className="font-bold text-[#1B254B] flex items-center gap-2">
                    <Heart size={14} className="text-red-500" />
                    {user.bloodGroup}
                  </p>
                )}
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide">Address</label>
                {isEditing ? (
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-[#1B254B] focus:outline-none focus:border-[#0B4DA2] font-bold"
                    rows={2}
                  />
                ) : (
                  <p className="font-bold text-[#1B254B] flex items-start gap-2">
                    <MapPin size={14} className="mt-1 shrink-0" />
                    {user.address}
                  </p>
                )}
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
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                    className="w-full px-3 py-1.5 border border-red-200 rounded-lg text-sm text-[#1B254B] focus:outline-none focus:border-red-500 bg-white font-bold"
                  />
                ) : (
                  <p className="font-bold text-[#1B254B] flex items-center gap-2">
                    <Phone size={14} className="text-red-500" />
                    {user.emergencyContact}
                  </p>
                )}
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
