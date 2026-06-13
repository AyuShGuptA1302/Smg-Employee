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
  MoreVertical,
  X,
  Mail,
  Phone,
  Award,
  TrendingUp,
  IndianRupee,
  Edit,
  Download,
  Target,
  FileText,
  Activity
} from 'lucide-react';

export const ProjectsPage = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    {
      id: 1,
      name: 'Assembly Line Optimization',
      status: 'In Progress',
      progress: 65,
      team: 8,
      deadline: '2024-12-30',
      priority: 'High',
      tasksSummary: { total: 24, completed: 16 },
      description: 'Optimization of assembly line processes to improve efficiency and reduce production time by 20%',
      startDate: '2024-11-01',
      manager: 'Priya Sharma',
      department: 'Assembly',
      budget: '₹15,00,000',
      spent: '₹9,75,000',
      myRole: 'Senior Technician',
      teamMembers: [
        { name: 'Priya Sharma', role: 'Project Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', email: 'priya.sharma@smg.com', phone: '+91 98765 43211' },
        { name: 'Rohit Sharma', role: 'Senior Technician', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit', email: 'rohit.sharma@smg.com', phone: '+91 98765 43210' },
        { name: 'Amit Patel', role: 'Lead Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit', email: 'amit.patel@smg.com', phone: '+91 98765 43212' },
        { name: 'Vikram Singh', role: 'Quality Analyst', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram', email: 'vikram.singh@smg.com', phone: '+91 98765 43214' }
      ],
      milestones: [
        { name: 'Initial Assessment', status: 'Completed', date: '2024-11-10', completion: 100, description: 'Completed analysis of current processes' },
        { name: 'Design Phase', status: 'Completed', date: '2024-11-25', completion: 100, description: 'New workflow designed and approved' },
        { name: 'Implementation', status: 'In Progress', date: '2024-12-20', completion: 65, description: 'Rolling out new processes across assembly lines' },
        { name: 'Testing & Validation', status: 'Pending', date: '2024-12-28', completion: 0, description: 'Final testing and quality checks' }
      ],
      assets: [
        { name: 'Assembly Line Equipment', type: 'Machinery', quantity: 5, status: 'Active' },
        { name: 'Quality Testing Tools', type: 'Equipment', quantity: 12, status: 'Active' },
        { name: 'Project Management Software', type: 'Software', quantity: 1, status: 'Active' },
        { name: 'Safety Equipment', type: 'PPE', quantity: 20, status: 'Active' }
      ],
      recentUpdates: [
        { date: '2024-12-11', update: 'Line 3 optimization completed ahead of schedule', author: 'Priya Sharma' },
        { date: '2024-12-09', update: 'Training session conducted for assembly team', author: 'Rohit Sharma' },
        { date: '2024-12-07', update: 'New workflow documentation finalized', author: 'Amit Patel' }
      ],
      tasks: [
        { id: 1, name: 'Process Analysis', status: 'Completed', assignee: 'Amit Patel', dueDate: '2024-11-15' },
        { id: 2, name: 'Workflow Design', status: 'Completed', assignee: 'Priya Sharma', dueDate: '2024-11-25' },
        { id: 3, name: 'Line 1 Implementation', status: 'Completed', assignee: 'Rohit Sharma', dueDate: '2024-12-05' },
        { id: 4, name: 'Line 2 Implementation', status: 'Completed', assignee: 'Rohit Sharma', dueDate: '2024-12-10' },
        { id: 5, name: 'Line 3 Implementation', status: 'In Progress', assignee: 'Rohit Sharma', dueDate: '2024-12-18' },
        { id: 6, name: 'Quality Testing', status: 'Pending', assignee: 'Vikram Singh', dueDate: '2024-12-28' }
      ]
    },
    {
      id: 2,
      name: 'Quality Control Enhancement',
      status: 'In Progress',
      progress: 45,
      team: 5,
      deadline: '2024-12-25',
      priority: 'Medium',
      tasksSummary: { total: 18, completed: 8 },
      description: 'Implementation of advanced quality control measures and automated inspection systems',
      startDate: '2024-10-15',
      manager: 'Vikram Singh',
      department: 'Quality Control',
      budget: '₹12,00,000',
      spent: '₹5,40,000',
      myRole: 'Team Member',
      teamMembers: [
        { name: 'Vikram Singh', role: 'QC Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram', email: 'vikram.singh@smg.com', phone: '+91 98765 43214' },
        { name: 'Priya Sharma', role: 'Quality Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', email: 'priya.sharma@smg.com', phone: '+91 98765 43211' },
        { name: 'Meena Iyer', role: 'IT Specialist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meena', email: 'meena.iyer@smg.com', phone: '+91 98765 43219' }
      ],
      milestones: [
        { name: 'System Selection', status: 'Completed', date: '2024-10-30', completion: 100, description: 'Selected automated inspection system' },
        { name: 'Installation', status: 'In Progress', date: '2024-12-15', completion: 60, description: 'Installing inspection equipment' },
        { name: 'Staff Training', status: 'Pending', date: '2024-12-20', completion: 0, description: 'Training staff on new systems' },
        { name: 'Go Live', status: 'Pending', date: '2024-12-25', completion: 0, description: 'Full system implementation' }
      ],
      assets: [
        { name: 'Automated Inspection System', type: 'Equipment', quantity: 3, status: 'In Transit' },
        { name: 'QC Software Suite', type: 'Software', quantity: 1, status: 'Active' },
        { name: 'Testing Equipment', type: 'Tools', quantity: 15, status: 'Active' }
      ],
      recentUpdates: [
        { date: '2024-12-10', update: 'Equipment delivery scheduled for Dec 15', author: 'Vikram Singh' },
        { date: '2024-12-08', update: 'Staff training schedule finalized', author: 'Priya Sharma' },
        { date: '2024-12-05', update: 'Installation site preparation completed', author: 'Meena Iyer' }
      ],
      tasks: []
    },
    {
      id: 3,
      name: 'Safety Protocol Update',
      status: 'Completed',
      progress: 100,
      team: 6,
      deadline: '2024-12-10',
      priority: 'High',
      tasksSummary: { total: 12, completed: 12 },
      description: 'Complete overhaul of workplace safety protocols and emergency response procedures',
      startDate: '2024-09-01',
      manager: 'Rohit Verma',
      department: 'Production',
      budget: '₹8,00,000',
      spent: '₹7,85,000',
      myRole: 'Safety Coordinator',
      teamMembers: [
        { name: 'Rohit Verma', role: 'Production Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RohitV', email: 'rohit.verma@smg.com', phone: '+91 98765 43216' },
        { name: 'Kavita Joshi', role: 'HR Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita', email: 'kavita.joshi@smg.com', phone: '+91 98765 43217' }
      ],
      milestones: [
        { name: 'Protocol Review', status: 'Completed', date: '2024-09-20', completion: 100, description: 'Reviewed existing protocols' },
        { name: 'New Protocol Design', status: 'Completed', date: '2024-10-15', completion: 100, description: 'Designed updated protocols' },
        { name: 'Staff Training', status: 'Completed', date: '2024-11-30', completion: 100, description: 'Trained all staff members' },
        { name: 'Implementation', status: 'Completed', date: '2024-12-10', completion: 100, description: 'Full rollout completed' }
      ],
      assets: [
        { name: 'Safety Equipment', type: 'PPE', quantity: 50, status: 'Active' },
        { name: 'Emergency Response Kits', type: 'Equipment', quantity: 10, status: 'Active' },
        { name: 'Training Materials', type: 'Documentation', quantity: 1, status: 'Active' }
      ],
      recentUpdates: [
        { date: '2024-12-10', update: 'Project successfully completed', author: 'Rohit Verma' },
        { date: '2024-12-08', update: 'Final safety audit passed with excellent rating', author: 'Kavita Joshi' },
        { date: '2024-12-05', update: 'All staff training sessions completed', author: 'Rohit Verma' }
      ],
      tasks: []
    },
    {
      id: 4,
      name: 'Inventory Management System',
      status: 'Planning',
      progress: 15,
      team: 4,
      deadline: '2025-01-15',
      priority: 'Low',
      tasksSummary: { total: 20, completed: 3 },
      description: 'Digital transformation of inventory tracking and warehouse management processes',
      startDate: '2024-12-01',
      manager: 'Suresh Reddy',
      department: 'Logistics',
      budget: '₹20,00,000',
      spent: '₹2,00,000',
      myRole: 'Observer',
      teamMembers: [
        { name: 'Suresh Reddy', role: 'Logistics Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh', email: 'suresh.reddy@smg.com', phone: '+91 98765 43218' },
        { name: 'Meena Iyer', role: 'IT Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meena', email: 'meena.iyer@smg.com', phone: '+91 98765 43219' }
      ],
      milestones: [
        { name: 'Requirements Gathering', status: 'In Progress', date: '2024-12-15', completion: 40, description: 'Collecting system requirements' },
        { name: 'Vendor Selection', status: 'Pending', date: '2024-12-28', completion: 0, description: 'Selecting software vendor' },
        { name: 'System Setup', status: 'Pending', date: '2025-01-10', completion: 0, description: 'System installation and configuration' },
        { name: 'Go Live', status: 'Pending', date: '2025-01-15', completion: 0, description: 'System deployment' }
      ],
      assets: [
        { name: 'Barcode Scanners', type: 'Equipment', quantity: 20, status: 'Ordered' },
        { name: 'Inventory Software License', type: 'Software', quantity: 1, status: 'Pending' }
      ],
      recentUpdates: [
        { date: '2024-12-10', update: 'Initial requirements document drafted', author: 'Suresh Reddy' },
        { date: '2024-12-05', update: 'Budget approved by management', author: 'Suresh Reddy' }
      ],
      tasks: []
    }
  ];

  const filteredProjects = filterStatus === 'all'
    ? projects
    : projects.filter(p => p.status.toLowerCase() === filterStatus);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'bg-[#05CD99] text-white';
      case 'In Progress': return 'bg-[#0B4DA2] text-white';
      case 'Planning': return 'bg-[#FFB547] text-white';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
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
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${filterStatus === status
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
          <div
            key={project.id}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer hover:border-[#0B4DA2] hover:-translate-y-1"
            onClick={() => setSelectedProject(project)}
          >
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
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  alert('Project Options');
                }}
              >
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
                <p className="font-bold text-[#1B254B]">{project.tasksSummary.completed}/{project.tasksSummary.total}</p>
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

      {/* Detailed Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectedProject(null)}>
          <div className="bg-white rounded-[24px] max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] p-6 rounded-t-[24px] text-white z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedProject.status === 'Completed' ? 'bg-green-500 text-white' :
                        selectedProject.status === 'In Progress' ? 'bg-blue-500 text-white' :
                          'bg-yellow-500 text-white'
                      }`}>
                      {selectedProject.status}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedProject.priority === 'High' ? 'bg-red-500 text-white' :
                        selectedProject.priority === 'Medium' ? 'bg-orange-500 text-white' :
                          'bg-green-500 text-white'
                      }`}>
                      {selectedProject.priority} Priority
                    </span>
                  </div>
                  <p className="text-blue-100 text-sm mb-3">{selectedProject.description}</p>
                  <div className="flex gap-6 text-sm flex-wrap">
                    <div>
                      <span className="text-blue-200">Manager:</span>
                      <span className="ml-2 font-bold">{selectedProject.manager}</span>
                    </div>
                    <div>
                      <span className="text-blue-200">Department:</span>
                      <span className="ml-2 font-bold">{selectedProject.department}</span>
                    </div>
                    <div>
                      <span className="text-blue-200">My Role:</span>
                      <span className="ml-2 font-bold">{selectedProject.myRole}</span>
                    </div>
                    <div>
                      <span className="text-blue-200">Timeline:</span>
                      <span className="ml-2 font-bold">{selectedProject.startDate} to {selectedProject.deadline}</span>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedProject(null)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold">Overall Progress</span>
                  <span className="text-xl font-bold">{selectedProject.progress}%</span>
                </div>
                <div className="w-full bg-white/20 h-4 rounded-full overflow-hidden">
                  <div className="bg-white h-full rounded-full transition-all" style={{ width: `${selectedProject.progress}%` }}></div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Budget Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <p className="text-xs text-blue-600 font-bold mb-1">Total Budget</p>
                  <p className="text-2xl font-bold text-[#1B254B]">{selectedProject.budget}</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl border border-orange-200">
                  <p className="text-xs text-orange-600 font-bold mb-1">Amount Spent</p>
                  <p className="text-2xl font-bold text-[#1B254B]">{selectedProject.spent}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                  <p className="text-xs text-green-600 font-bold mb-1">Remaining</p>
                  <p className="text-2xl font-bold text-[#1B254B]">
                    ₹{(parseInt(selectedProject.budget.replace(/[₹,]/g, '')) - parseInt(selectedProject.spent.replace(/[₹,]/g, ''))).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              {/* Team Members */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                  <Users size={20} className="text-[#0B4DA2]" />
                  Team Members ({selectedProject.teamMembers.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProject.teamMembers.map((member, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl flex items-center gap-3 border border-gray-200">
                      <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full border-2 border-blue-200" />
                      <div className="flex-1">
                        <p className="font-bold text-[#1B254B] text-sm">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.role}</p>
                        <p className="text-xs text-blue-600">{member.email}</p>
                      </div>
                      <div className="flex gap-1">
                        <button className="p-2 bg-blue-50 text-[#0B4DA2] rounded-lg hover:bg-blue-100 transition-colors" title="Email">
                          <Mail size={14} />
                        </button>
                        <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Call">
                          <Phone size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                  <Target size={20} className="text-[#0B4DA2]" />
                  Project Milestones
                </h3>
                <div className="space-y-3">
                  {selectedProject.milestones.map((milestone, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${milestone.status === 'Completed' ? 'bg-green-500' :
                              milestone.status === 'In Progress' ? 'bg-blue-500' :
                                'bg-gray-300'
                            }`}></div>
                          <div className="flex-1">
                            <p className="font-bold text-[#1B254B] text-sm">{milestone.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{milestone.description}</p>
                            <p className="text-xs text-gray-400 mt-1">Target: {milestone.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${milestone.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              milestone.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {milestone.status}
                          </span>
                          <span className="text-sm font-bold text-[#1B254B]">{milestone.completion}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${milestone.status === 'Completed' ? 'bg-green-500' :
                            milestone.status === 'In Progress' ? 'bg-blue-500' :
                              'bg-gray-300'
                          }`} style={{ width: `${milestone.completion}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assets Assigned */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                  <Award size={20} className="text-[#0B4DA2]" />
                  Assets Assigned ({selectedProject.assets.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedProject.assets.map((asset, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl flex items-center justify-between border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Briefcase size={18} className="text-[#0B4DA2]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1B254B] text-sm">{asset.name}</p>
                          <p className="text-xs text-gray-500">{asset.type} • Qty: {asset.quantity}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${asset.status === 'Active' ? 'bg-green-100 text-green-700' :
                          asset.status === 'In Transit' ? 'bg-yellow-100 text-yellow-700' :
                            asset.status === 'Ordered' ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-100 text-blue-700'
                        }`}>
                        {asset.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Updates */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                  <Activity size={20} className="text-[#0B4DA2]" />
                  Recent Updates
                </h3>
                <div className="space-y-3">
                  {selectedProject.recentUpdates.map((update, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border-l-4 border-[#0B4DA2]">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm text-[#1B254B] mb-1">{update.update}</p>
                          <p className="text-xs text-gray-500">By {update.author}</p>
                        </div>
                        <p className="text-xs text-gray-400 ml-4">{update.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Task Breakdown (if available) */}
              {selectedProject.tasks && selectedProject.tasks.length > 0 && (
                <div className="bg-gray-50 p-5 rounded-xl">
                  <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-[#0B4DA2]" />
                    Task Breakdown ({selectedProject.tasks.filter(t => t.status === 'Completed').length}/{selectedProject.tasks.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedProject.tasks.map((task) => (
                      <div key={task.id} className="bg-white p-3 rounded-xl flex items-center justify-between border border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${task.status === 'Completed' ? 'bg-green-500' :
                              task.status === 'In Progress' ? 'bg-blue-500' :
                                'bg-gray-300'
                            }`}></div>
                          <div>
                            <p className="font-bold text-[#1B254B] text-sm">{task.name}</p>
                            <p className="text-xs text-gray-500">Assigned to: {task.assignee}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">{task.dueDate}</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded ${task.status === 'Completed' ? 'bg-green-100 text-green-700' :
                              task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {task.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 rounded-b-[24px] flex gap-3">
              <button className="flex-1 bg-[#0B4DA2] text-white py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors flex items-center justify-center gap-2">
                <FileText size={18} />
                View Documents
              </button>
              <button className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <Download size={18} />
                Download Report
              </button>
              <button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors" onClick={() => setSelectedProject(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
