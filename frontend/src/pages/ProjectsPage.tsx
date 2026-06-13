import React, { useState } from 'react';
import { 
  Briefcase, 
  Clock, 
  Users, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Filter,
  Search,
  Plus,
  MoreVertical
} from 'lucide-react';

export const ProjectsPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');

  const projects = [
    { 
      id: 1, 
      name: 'Assembly Line Optimization', 
      status: 'In Progress', 
      progress: 65, 
      team: 8, 
      deadline: '2024-12-30',
      priority: 'High',
      tasks: { total: 24, completed: 16 }
    },
    { 
      id: 2, 
      name: 'Quality Control Enhancement', 
      status: 'In Progress', 
      progress: 45, 
      team: 5, 
      deadline: '2024-12-25',
      priority: 'Medium',
      tasks: { total: 18, completed: 8 }
    },
    { 
      id: 3, 
      name: 'Safety Protocol Update', 
      status: 'Completed', 
      progress: 100, 
      team: 6, 
      deadline: '2024-12-10',
      priority: 'High',
      tasks: { total: 12, completed: 12 }
    },
    { 
      id: 4, 
      name: 'Inventory Management System', 
      status: 'Planning', 
      progress: 15, 
      team: 4, 
      deadline: '2025-01-15',
      priority: 'Low',
      tasks: { total: 20, completed: 3 }
    }
  ];

  const filteredProjects = filterStatus === 'all' 
    ? projects 
    : projects.filter(p => p.status.toLowerCase() === filterStatus);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'bg-[#05CD99] text-white';
      case 'In Progress': return 'bg-[#0B4DA2] text-white';
      case 'Planning': return 'bg-[#FFB547] text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-[#EE5D50] bg-red-50';
      case 'Medium': return 'text-[#FFB547] bg-orange-50';
      case 'Low': return 'text-[#05CD99] bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white mb-2">Projects & Work</h1>
            <p className="text-[#87CEEB] opacity-90">Manage and track your project assignments</p>
          </div>
          <button className="bg-white text-[#0B4DA2] px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center gap-2">
            <Plus size={20} /> New Project
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Briefcase className="text-[#0B4DA2]" size={24} />
            <span className="text-2xl font-bold text-[#1B254B]">{projects.length}</span>
          </div>
          <p className="text-sm text-[#A3AED0]">Total Projects</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <Clock className="text-[#FFB547]" size={24} />
            <span className="text-2xl font-bold text-[#1B254B]">
              {projects.filter(p => p.status === 'In Progress').length}
            </span>
          </div>
          <p className="text-sm text-[#A3AED0]">In Progress</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="text-[#05CD99]" size={24} />
            <span className="text-2xl font-bold text-[#1B254B]">
              {projects.filter(p => p.status === 'Completed').length}
            </span>
          </div>
          <p className="text-sm text-[#A3AED0]">Completed</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="text-[#EE5D50]" size={24} />
            <span className="text-2xl font-bold text-[#1B254B]">
              {projects.filter(p => p.priority === 'High').length}
            </span>
          </div>
          <p className="text-sm text-[#A3AED0]">High Priority</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A3AED0]" size={20} />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#0B4DA2] outline-none transition-colors"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'completed', 'in progress', 'planning'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                  filterStatus === status
                    ? 'bg-[#0B4DA2] text-white'
                    : 'bg-gray-100 text-[#A3AED0] hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-[#1B254B] mb-2">{project.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getPriorityColor(project.priority)}`}>
                    {project.priority} Priority
                  </span>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical size={20} className="text-[#A3AED0]" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#A3AED0]">Progress</span>
                <span className="text-sm font-bold text-[#1B254B]">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#0B4DA2] to-[#042A5B] h-2 rounded-full transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-[#A3AED0] mb-1">
                  <Users size={16} />
                  <span className="text-xs">Team</span>
                </div>
                <p className="font-bold text-[#1B254B]">{project.team}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-[#A3AED0] mb-1">
                  <CheckCircle size={16} />
                  <span className="text-xs">Tasks</span>
                </div>
                <p className="font-bold text-[#1B254B]">{project.tasks.completed}/{project.tasks.total}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-[#A3AED0] mb-1">
                  <Calendar size={16} />
                  <span className="text-xs">Deadline</span>
                </div>
                <p className="font-bold text-[#1B254B] text-xs">{new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
