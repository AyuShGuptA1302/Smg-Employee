import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Phone, MapPin, Calendar, Briefcase, User as UserIcon, Edit2, Save, X } from 'lucide-react';

export function Profile() {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 style={{ color: 'var(--smg-dark)' }}>My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--smg-royal)' }}
          >
            <Edit2 size={18} />
            <span className="hidden sm:inline">Edit Profile</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex flex-col items-center text-center">
              <img
                src={user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'}
                alt={user?.name || 'User'}
                className="w-32 h-32 rounded-full border-4 mb-4"
                style={{ borderColor: 'var(--smg-royal)' }}
              />
              <h2 style={{ color: 'var(--smg-dark)' }}>{user?.name}</h2>
              <p className="text-gray-600 mt-1">{user?.designation}</p>
              <p className="text-sm text-gray-500 mt-1">{user?.department}</p>

              <div className="mt-6 w-full space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <UserIcon size={18} style={{ color: 'var(--smg-royal)' }} />
                  <div className="text-left flex-1">
                    <p className="text-xs text-gray-500">Employee ID</p>
                    <p className="text-sm" style={{ color: 'var(--smg-dark)' }}>
                      {user?.id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar size={18} style={{ color: 'var(--smg-royal)' }} />
                  <div className="text-left flex-1">
                    <p className="text-xs text-gray-500">Joined</p>
                    <p className="text-sm" style={{ color: 'var(--smg-dark)' }}>
                      {user?.joinDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Briefcase size={18} style={{ color: 'var(--smg-royal)' }} />
                  <div className="text-left flex-1">
                    <p className="text-xs text-gray-500">Reports To</p>
                    <p className="text-sm" style={{ color: 'var(--smg-dark)' }}>
                      {user?.reportingManager}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="mb-6" style={{ color: 'var(--smg-dark)' }}>
              Personal Information
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--smg-dark)' }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--smg-dark)' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--smg-dark)' }}>
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm mb-2" style={{ color: 'var(--smg-dark)' }}>
                    Location
                  </label>
                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:text-gray-600"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 rounded-lg text-white hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: 'var(--smg-royal)' }}
                  >
                    <Save size={18} />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
