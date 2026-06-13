import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User,
  Award,
  PlayCircle,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Download,
  ExternalLink,
  Filter,
  Search
} from 'lucide-react';

const UpcomingTrainingCard = ({ training, onEnroll }) => (
  <div className="bg-white p-5 rounded-[20px] border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className="flex justify-between items-start mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h4 className="font-bold text-[#1B254B]">{training.title}</h4>
          {training.mandatory && (
            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded font-bold">
              Mandatory
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {training.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {training.duration}
          </span>
          <span className="flex items-center gap-1">
            <User size={12} />
            {training.instructor}
          </span>
        </div>
      </div>
    </div>
    <div className="flex gap-2">
      <button 
        onClick={() => onEnroll(training)}
        className="flex-1 bg-[#042A5B] text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-[#0B4DA2] transition-colors active:scale-95"
      >
        <PlayCircle size={14} />
        Enroll Now
      </button>
      <button className="px-3 bg-[#F4F7FE] text-[#0B4DA2] rounded-lg hover:bg-blue-100 transition-colors">
        <ExternalLink size={14} />
      </button>
    </div>
  </div>
);

const CompletedTrainingCard = ({ training }) => (
  <div className="bg-white p-4 rounded-[20px] border border-gray-100">
    <div className="flex items-start gap-3">
      <div className="bg-green-100 p-2 rounded-lg shrink-0">
        <CheckCircle size={20} className="text-green-600" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-[#1B254B] mb-1">{training.title}</h4>
        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            Completed: {training.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {training.duration}
          </span>
        </div>
        <button className="text-xs font-bold text-[#0B4DA2] hover:underline flex items-center gap-1">
          <Download size={12} />
          Download Certificate
        </button>
      </div>
    </div>
  </div>
);

export const TrainingPageOld = ({ user }) => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [trainingData, setTrainingData] = useState({ upcoming: [], completed: [] });

  useEffect(() => {
    const userId = localStorage.getItem('userId') || user._id;
    if (!userId) return;
    
    fetch('/api/trainings')
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        const now = new Date();
        const formatted = data.map(t => ({
          id: t._id,
          title: t.title,
          mandatory: t.mandatory,
          date: new Date(t.date).toLocaleDateString(),
          duration: `${t.duration} hours`,
          instructor: t.instructor || 'TBD',
          rawDate: new Date(t.date),
          enrolled: t.enrolledUsers?.includes(userId)
        }));

        setTrainingData({
          upcoming: formatted.filter(t => t.rawDate >= now),
          completed: formatted.filter(t => t.rawDate < now && t.enrolled)
        });
      })
      .catch(console.error);
  }, [user._id]);

  const handleEnroll = (training) => {
    const userId = localStorage.getItem('userId') || user._id;
    if (!userId) return;

    fetch(`/api/trainings/${training.id}/enroll`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    })
    .then(res => res.ok ? res.json() : Promise.reject())
    .then(() => {
      alert(`Successfully enrolled in: ${training.title}`);
      // Refresh logic or update state
      setTrainingData(prev => ({
        ...prev,
        upcoming: prev.upcoming.map(t => t.id === training.id ? { ...t, enrolled: true } : t)
      }));
    })
    .catch(console.error);
  };

  const totalCompleted = trainingData.completed.length;
  const totalUpcoming = trainingData.upcoming.length;
  const mandatoryCount = trainingData.upcoming.filter(t => t.mandatory && !t.enrolled).length;
  const totalHours = trainingData.completed.reduce((sum, t) => sum + parseInt(t.duration), 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#042A5B] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl">
              <BookOpen size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Training & Development</h1>
              <p className="text-blue-100 text-sm">{user.name} • Learning Dashboard</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-xs text-blue-100 mb-1">Completed</p>
              <p className="text-2xl font-bold">{totalCompleted}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-xs text-blue-100 mb-1">Upcoming</p>
              <p className="text-2xl font-bold">{totalUpcoming}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-xs text-blue-100 mb-1">Total Hours</p>
              <p className="text-2xl font-bold">{totalHours}h</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
              <p className="text-xs text-blue-100 mb-1">Mandatory</p>
              <p className="text-2xl font-bold">{mandatoryCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-green-100 p-3 rounded-2xl">
              <Award size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Certifications</p>
              <p className="text-2xl font-bold text-[#1B254B]">{user.certifications.length}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Professional certifications earned</p>
        </div>

        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-100 p-3 rounded-2xl">
              <TrendingUp size={24} className="text-[#0B4DA2]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Progress</p>
              <p className="text-2xl font-bold text-[#1B254B]">85%</p>
            </div>
          </div>
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
            <div className="bg-[#0B4DA2] w-[85%] h-full rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[24px] shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-yellow-100 p-3 rounded-2xl">
              <AlertCircle size={24} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Pending</p>
              <p className="text-2xl font-bold text-[#1B254B]">{mandatoryCount}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Mandatory trainings to complete</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100">
        {/* Tabs */}
        <div className="border-b border-gray-100 p-6 pb-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'upcoming'
                    ? 'bg-[#042A5B] text-white'
                    : 'bg-[#F4F7FE] text-gray-600 hover:bg-gray-200'
                }`}
              >
                Upcoming ({totalUpcoming})
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  activeTab === 'completed'
                    ? 'bg-[#042A5B] text-white'
                    : 'bg-[#F4F7FE] text-gray-600 hover:bg-gray-200'
                }`}
              >
                Completed ({totalCompleted})
              </button>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search training..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-[#F4F7FE] rounded-xl text-sm outline-none border border-transparent focus:border-[#0B4DA2]/30 transition-colors"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                <Filter size={16} /> Filter
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'upcoming' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {trainingData.upcoming.map((training) => (
                <UpcomingTrainingCard
                  key={training.id}
                  training={training}
                  onEnroll={handleEnroll}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {trainingData.completed.map((training) => (
                <CompletedTrainingCard key={training.id} training={training} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Learning Path */}
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <h3 className="font-bold text-[#1B254B] text-lg mb-4 flex items-center gap-2">
          <Award size={20} className="text-[#FFB547]" />
          Recommended Learning Path
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            "Advanced Manufacturing",
            "Leadership Skills",
            "Quality Control",
            "Safety Management"
          ].map((path, idx) => (
            <div key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100 hover:shadow-md transition-all cursor-pointer">
              <BookOpen size={24} className="text-[#0B4DA2] mb-2" />
              <h4 className="font-bold text-[#1B254B] text-sm mb-1">{path}</h4>
              <p className="text-xs text-gray-500 mb-3">4 courses • 16 hours</p>
              <button className="text-xs font-bold text-[#0B4DA2] hover:underline">
                Explore Path →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
