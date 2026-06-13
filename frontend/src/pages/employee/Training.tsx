import React, { useEffect, useState } from 'react';
import { getTrainings, enrollTraining } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { GraduationCap, Calendar, Clock, User, CheckCircle, Loader2 } from 'lucide-react';

export function Training() {
  const { user } = useAuth();
  const [trainings, setTrainings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const data = await getTrainings();
        setTrainings(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching trainings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrainings();
  }, []);

  const handleEnroll = async (trainingId: string) => {
    if (!user?.id) return;
    try {
      await enrollTraining(trainingId, user.id);
      const data = await getTrainings();
      setTrainings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Enroll error:', err);
    }
  };

  const completedTrainings = trainings.filter((t: any) =>
    t.completedUsers?.some((u: any) => (u._id || u) === user?.id)
  );
  const upcomingTrainings = trainings.filter((t: any) =>
    !t.completedUsers?.some((u: any) => (u._id || u) === user?.id)
  );
  const enrolledCount = trainings.filter((t: any) =>
    t.enrolledUsers?.some((u: any) => (u._id || u) === user?.id)
  ).length;
  const totalHours = completedTrainings.reduce((sum: number, t: any) => {
    const hrs = parseInt(t.duration) || 0;
    return sum + hrs;
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--smg-royal)' }} />
        <span className="ml-3 text-gray-500">Loading trainings...</span>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div>
        <h1 style={{ color: 'var(--smg-dark)' }}>Training & Development</h1>
        <p className="text-gray-600 mt-1">Your learning journey and upcoming sessions</p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E3F2FD' }}>
              <GraduationCap size={24} style={{ color: 'var(--smg-royal)' }} />
            </div>
          </div>
          <h3 className="text-2xl mb-1" style={{ color: 'var(--smg-dark)' }}>{totalHours}</h3>
          <p className="text-sm text-gray-600">Hours Completed</p>
          <p className="text-xs text-gray-500 mt-1">All Time</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#E8F5E9' }}>
              <CheckCircle size={24} style={{ color: 'var(--smg-success)' }} />
            </div>
          </div>
          <h3 className="text-2xl mb-1" style={{ color: 'var(--smg-dark)' }}>{completedTrainings.length}</h3>
          <p className="text-sm text-gray-600">Courses Completed</p>
          <p className="text-xs text-gray-500 mt-1">All Time</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FFF3E0' }}>
              <Calendar size={24} style={{ color: 'var(--smg-warning)' }} />
            </div>
          </div>
          <h3 className="text-2xl mb-1" style={{ color: 'var(--smg-dark)' }}>{enrolledCount}</h3>
          <p className="text-sm text-gray-600">Currently Enrolled</p>
          <p className="text-xs text-gray-500 mt-1">Active</p>
        </div>
      </div>

      {/* Upcoming Training Sessions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 style={{ color: 'var(--smg-dark)' }}>Upcoming Training Sessions</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {upcomingTrainings.length === 0 && (
            <div className="p-6 text-center text-gray-400">No upcoming training sessions</div>
          )}
          {upcomingTrainings.map((training: any) => (
            <div key={training._id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#E3F2FD' }}>
                      <GraduationCap size={24} style={{ color: 'var(--smg-royal)' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 style={{ color: 'var(--smg-dark)' }}>{training.title}</h4>
                        {training.mandatory && (
                          <span className="text-xs px-2 py-1 rounded whitespace-nowrap" style={{ backgroundColor: '#FFEBEE', color: '#ef4444' }}>Mandatory</span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} className="text-gray-400" />
                          <span>{training.date ? new Date(training.date).toLocaleDateString('en-IN') : '-'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={16} className="text-gray-400" />
                          <span>{training.duration || '-'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={16} className="text-gray-400" />
                          <span>{training.instructor || '-'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleEnroll(training._id)}
                  className="px-6 py-2 rounded-lg text-white hover:opacity-90 transition-opacity whitespace-nowrap"
                  style={{ backgroundColor: 'var(--smg-royal)' }}
                >
                  {training.enrolledUsers?.some((u: any) => (u._id || u) === user?.id) ? 'Enrolled ✓' : 'Enroll Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Courses */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 style={{ color: 'var(--smg-dark)' }}>Completed Courses</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {completedTrainings.length === 0 && <p className="text-sm text-gray-400">No completed courses yet</p>}
            {completedTrainings.map((course: any) => (
              <div key={course._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  <CheckCircle size={20} style={{ color: 'var(--smg-success)' }} />
                  <div>
                    <h4 className="text-sm" style={{ color: 'var(--smg-dark)' }}>{course.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {course.date ? new Date(course.date).toLocaleDateString('en-IN') : '-'} • {course.duration || '-'}
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 text-sm rounded-lg border border-gray-200 hover:bg-white transition-colors" style={{ color: 'var(--smg-royal)' }}>
                  View Certificate
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
