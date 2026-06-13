import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  X, 
  Users, 
  Award, 
  TrendingUp, 
  AlertCircle, 
  Edit, 
  Download,
  Mail,
  Phone
} from 'lucide-react';

export const AdminProjectsPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    { 
      id: 1, 
      name: 'New Scooter Model Development', 
      status: 'On Track', 
      progress: 75, 
      dept: 'R&D', 
      team: 25, 
      deadline: '2025-03-15',
      manager: 'Vikram Singh',
      budget: '₹2,50,00,000',
      spent: '₹1,87,50,000',
      description: 'Development of next-generation electric scooter with advanced battery technology and smart features',
      startDate: '2024-06-01',
      priority: 'High',
      teamMembers: [
        { name: 'Vikram Singh', role: 'Project Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram', email: 'vikram.singh@smg.com' },
        { name: 'Amit Patel', role: 'Lead Engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit', email: 'amit.patel@smg.com' },
        { name: 'Priya Sharma', role: 'Quality Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', email: 'priya.sharma@smg.com' },
        { name: 'Rajesh Kumar', role: 'Production Coordinator', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh', email: 'rajesh.kumar@smg.com' }
      ],
      assets: [
        { name: 'CAD Software Licenses', type: 'Software', quantity: 10, status: 'Active' },
        { name: 'Prototype Testing Equipment', type: 'Hardware', quantity: 5, status: 'Active' },
        { name: 'Development Lab - Block A', type: 'Facility', quantity: 1, status: 'Reserved' },
        { name: 'Battery Testing Units', type: 'Equipment', quantity: 8, status: 'Active' }
      ],
      milestones: [
        { name: 'Design Phase', status: 'Completed', date: '2024-08-30', completion: 100 },
        { name: 'Prototype Development', status: 'Completed', date: '2024-11-15', completion: 100 },
        { name: 'Testing & Validation', status: 'In Progress', date: '2025-01-30', completion: 60 },
        { name: 'Production Setup', status: 'Pending', date: '2025-03-15', completion: 0 }
      ],
      recentUpdates: [
        { date: '2024-12-10', update: 'Completed battery life testing - exceeding targets by 15%' },
        { date: '2024-12-08', update: 'Design review approved by stakeholders' },
        { date: '2024-12-05', update: 'First prototype completed successfully' }
      ]
    },
    { 
      id: 2, 
      name: 'Factory Automation Phase 2', 
      status: 'At Risk', 
      progress: 45, 
      dept: 'Production', 
      team: 18, 
      deadline: '2025-01-30',
      manager: 'Rohit Verma',
      budget: '₹1,80,00,000',
      spent: '₹1,25,00,000',
      description: 'Implementation of automated assembly lines and robotic systems for increased efficiency',
      startDate: '2024-08-01',
      priority: 'Critical',
      teamMembers: [
        { name: 'Rohit Verma', role: 'Production Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rohit', email: 'rohit.verma@smg.com' },
        { name: 'Anita Desai', role: 'Automation Specialist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita', email: 'anita.desai@smg.com' },
        { name: 'Suresh Reddy', role: 'Budget Controller', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh', email: 'suresh.reddy@smg.com' }
      ],
      assets: [
        { name: 'Robotic Arms', type: 'Equipment', quantity: 6, status: 'In Transit' },
        { name: 'PLC Controllers', type: 'Hardware', quantity: 12, status: 'Active' },
        { name: 'Assembly Line Sensors', type: 'Equipment', quantity: 50, status: 'Ordered' }
      ],
      milestones: [
        { name: 'Equipment Procurement', status: 'Completed', date: '2024-09-30', completion: 100 },
        { name: 'Installation Phase 1', status: 'In Progress', date: '2024-12-15', completion: 70 },
        { name: 'System Integration', status: 'Pending', date: '2025-01-15', completion: 0 },
        { name: 'Final Testing', status: 'Pending', date: '2025-01-30', completion: 0 }
      ],
      recentUpdates: [
        { date: '2024-12-11', update: 'Equipment delivery delayed by 2 weeks - updating timeline' },
        { date: '2024-12-09', update: 'Phase 1 installation 70% complete' },
        { date: '2024-12-06', update: 'Additional budget approved for expedited shipping' }
      ]
    },
    { 
      id: 3, 
      name: 'Quality Management System Upgrade', 
      status: 'On Track', 
      progress: 90, 
      dept: 'Quality Control', 
      team: 12, 
      deadline: '2024-12-30',
      manager: 'Priya Sharma',
      budget: '₹75,00,000',
      spent: '₹68,50,000',
      description: 'Upgrade to ISO 9001:2015 compliant quality management system with digital tracking',
      startDate: '2024-09-01',
      priority: 'Medium',
      teamMembers: [
        { name: 'Priya Sharma', role: 'QC Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya', email: 'priya.sharma@smg.com' },
        { name: 'Meena Iyer', role: 'IT Specialist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Meena', email: 'meena.iyer@smg.com' },
        { name: 'Kavita Joshi', role: 'Compliance Officer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita', email: 'kavita.joshi@smg.com' }
      ],
      assets: [
        { name: 'QMS Software Suite', type: 'Software', quantity: 1, status: 'Active' },
        { name: 'Digital Inspection Tools', type: 'Equipment', quantity: 15, status: 'Active' },
        { name: 'Training Modules', type: 'Digital Asset', quantity: 8, status: 'Active' }
      ],
      milestones: [
        { name: 'System Selection', status: 'Completed', date: '2024-09-15', completion: 100 },
        { name: 'Implementation', status: 'Completed', date: '2024-11-30', completion: 100 },
        { name: 'Staff Training', status: 'In Progress', date: '2024-12-20', completion: 95 },
        { name: 'Final Audit', status: 'Pending', date: '2024-12-30', completion: 0 }
      ],
      recentUpdates: [
        { date: '2024-12-12', update: 'Final training session scheduled for Dec 18' },
        { date: '2024-12-10', update: 'System running smoothly - no major issues reported' },
        { date: '2024-12-07', update: '95% of staff completed training modules' }
      ]
    },
    { 
      id: 4, 
      name: 'Marketing Campaign Q1 2025', 
      status: 'Delayed', 
      progress: 30, 
      dept: 'Sales & Marketing', 
      team: 15, 
      deadline: '2025-01-15',
      manager: 'Sneha Gupta',
      budget: '₹1,20,00,000',
      spent: '₹42,00,000',
      description: 'Multi-channel marketing campaign for new product launch across digital and traditional media',
      startDate: '2024-10-01',
      priority: 'High',
      teamMembers: [
        { name: 'Sneha Gupta', role: 'Marketing Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha', email: 'sneha.gupta@smg.com' },
        { name: 'Amit Patel', role: 'Digital Marketing', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amit', email: 'amit.patel@smg.com' }
      ],
      assets: [
        { name: 'Marketing Automation Software', type: 'Software', quantity: 1, status: 'Active' },
        { name: 'Content Creation Suite', type: 'Software', quantity: 5, status: 'Active' },
        { name: 'Advertising Budget', type: 'Budget', quantity: 1, status: 'Allocated' }
      ],
      milestones: [
        { name: 'Campaign Strategy', status: 'Completed', date: '2024-10-30', completion: 100 },
        { name: 'Content Creation', status: 'In Progress', date: '2024-12-15', completion: 50 },
        { name: 'Media Buying', status: 'Pending', date: '2025-01-05', completion: 0 },
        { name: 'Campaign Launch', status: 'Pending', date: '2025-01-15', completion: 0 }
      ],
      recentUpdates: [
        { date: '2024-12-11', update: 'Content creation behind schedule - reassigning resources' },
        { date: '2024-12-08', update: 'Creative review meeting rescheduled' },
        { date: '2024-12-05', update: 'First draft of campaign materials submitted' }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] rounded-[30px] p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 p-4 rounded-2xl"><Briefcase size={32} /></div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Project Listing</h1>
              <p className="text-blue-100">View and manage all organizational projects</p>
            </div>
          </div>
          <button className="bg-white text-[#0B4DA2] px-5 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center gap-2">
            <Plus size={18} />
            New Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-[#1B254B]">23</p>
          <p className="text-xs text-gray-600">Active Projects</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-green-600">18</p>
          <p className="text-xs text-gray-600">On Track</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-yellow-600">3</p>
          <p className="text-xs text-gray-600">At Risk</p>
        </div>
        <div className="bg-white p-5 rounded-[20px] shadow-sm border border-gray-100 text-center">
          <p className="text-2xl font-bold text-red-600">2</p>
          <p className="text-xs text-gray-600">Delayed</p>
        </div>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-6 rounded-[20px] shadow-sm border border-gray-100 hover:shadow-lg transition-all cursor-pointer" onClick={() => setSelectedProject(project)}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-[#1B254B]">{project.name}</h3>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                    project.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                    project.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {project.priority}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{project.description}</p>
                <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                  <span>Department: {project.dept}</span>
                  <span>•</span>
                  <span>Manager: {project.manager}</span>
                  <span>•</span>
                  <span>Team Size: {project.team}</span>
                  <span>•</span>
                  <span>Deadline: {project.deadline}</span>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                project.status === 'On Track' ? 'bg-green-100 text-green-700' :
                project.status === 'At Risk' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {project.status}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex-1 bg-gray-200 h-3 rounded-full overflow-hidden">
                  <div className={`h-full ${project.progress >= 70 ? 'bg-green-500' : project.progress >= 40 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${project.progress}%` }}></div>
                </div>
                <span className="text-sm font-bold text-[#1B254B]">{project.progress}%</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Budget: {project.budget}</span>
                <span>Spent: {project.spent}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelectedProject(null)}>
          <div className="bg-white rounded-[24px] max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-4" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-br from-[#042A5B] via-[#063A75] to-[#0B4DA2] p-6 rounded-t-[24px] text-white z-10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      selectedProject.status === 'On Track' ? 'bg-green-500 text-white' :
                      selectedProject.status === 'At Risk' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {selectedProject.status}
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      selectedProject.priority === 'Critical' ? 'bg-red-500 text-white' :
                      selectedProject.priority === 'High' ? 'bg-orange-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {selectedProject.priority} Priority
                    </span>
                  </div>
                  <p className="text-blue-100 text-sm mb-3">{selectedProject.description}</p>
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-blue-200">Manager:</span>
                      <span className="ml-2 font-bold">{selectedProject.manager}</span>
                    </div>
                    <div>
                      <span className="text-blue-200">Department:</span>
                      <span className="ml-2 font-bold">{selectedProject.dept}</span>
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
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        asset.status === 'Active' ? 'bg-green-100 text-green-700' :
                        asset.status === 'Reserved' ? 'bg-blue-100 text-blue-700' :
                        asset.status === 'In Transit' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {asset.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-[#0B4DA2]" />
                  Project Milestones
                </h3>
                <div className="space-y-3">
                  {selectedProject.milestones.map((milestone, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            milestone.status === 'Completed' ? 'bg-green-500' :
                            milestone.status === 'In Progress' ? 'bg-blue-500' :
                            'bg-gray-300'
                          }`}></div>
                          <div>
                            <p className="font-bold text-[#1B254B] text-sm">{milestone.name}</p>
                            <p className="text-xs text-gray-500">Target: {milestone.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                            milestone.status === 'Completed' ? 'bg-green-100 text-green-700' :
                            milestone.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {milestone.status}
                          </span>
                          <span className="text-sm font-bold text-[#1B254B]">{milestone.completion}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                        <div className={`h-full ${
                          milestone.status === 'Completed' ? 'bg-green-500' :
                          milestone.status === 'In Progress' ? 'bg-blue-500' :
                          'bg-gray-300'
                        }`} style={{ width: `${milestone.completion}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Updates */}
              <div className="bg-gray-50 p-5 rounded-xl">
                <h3 className="font-bold text-[#1B254B] mb-4 flex items-center gap-2">
                  <AlertCircle size={20} className="text-[#0B4DA2]" />
                  Recent Updates
                </h3>
                <div className="space-y-3">
                  {selectedProject.recentUpdates.map((update, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border-l-4 border-[#0B4DA2]">
                      <p className="text-xs text-gray-500 mb-1">{update.date}</p>
                      <p className="text-sm text-[#1B254B]">{update.update}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200 rounded-b-[24px] flex gap-3">
              <button className="flex-1 bg-[#0B4DA2] text-white py-3 rounded-xl font-bold hover:bg-[#042A5B] transition-colors flex items-center justify-center gap-2">
                <Edit size={18} />
                Edit Project
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
