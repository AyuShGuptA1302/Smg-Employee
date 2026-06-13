import React, { useEffect, useMemo, useState } from 'react';
import {
  UserPlus,
  ShieldCheck,
  Search,
  Eye,
  Edit,
  Save,
  X,
  Ban,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Loader2,
  FileText,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '../../components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { getUsers, getGeneralRequests, createEmployee, updateUser, changePassword, parseResume } from '../../services/api';

type User = {
  id: string;
  name: string;
  role: 'Employee' | 'Admin' | 'Super Admin';
  department: string;
  status: 'Active' | 'Inactive';
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  reportingManager?: string;
};

type Request = {
  id: string;
  userId: string;
  type: string;
  description: string;
  date: string;
  status: 'Approved' | 'Pending' | 'In Progress' | 'Rejected';
  approver: string;
  denialReason?: string;
};

type Issue = {
  id: string;
  userId: string;
  requestId: string;
  title: string;
  status: 'Open' | 'Resolved';
  createdAt: string;
  deniedBy: string;
  reason: string;
  resolutionNote?: string;
  resolvedAt?: string;
};

export const SuperAdminUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(Array.isArray(data) ? data.map((u: any) => ({
          id: u.empId || u._id,
          name: u.name,
          role: u.role || 'Employee',
          department: u.dept || u.department || '',
          status: u.status || 'Active',
          email: u.email,
          phone: u.phone || '',
          location: u.location || '',
          joinDate: u.joinDate || '',
          reportingManager: u.reportingManager || '',
        })) : []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const [query, setQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'profile' | 'employeeId' | 'name'>('name');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailMode, setDetailMode] = useState<'view' | 'edit'>('view');
  const [activeTab, setActiveTab] = useState<'profile' | 'requests' | 'issues'>('profile');
  const [isEdit, setIsEdit] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [isCreate, setIsCreate] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [generatedCreds, setGeneratedCreds] = useState<{ email: string; password: string; message: string; emailPreviewUrl?: string } | null>(null);
  const [changePwdOpen, setChangePwdOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [isParsingResume, setIsParsingResume] = useState(false);

  const [requestsByUser, setRequestsByUser] = useState<Record<string, Request[]>>({});
  const [issuesByUser, setIssuesByUser] = useState<Record<string, Issue[]>>({});

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      if (searchBy === 'employeeId') return u.id.toLowerCase().includes(q);
      if (searchBy === 'profile') return u.role.toLowerCase().includes(q) || u.department.toLowerCase().includes(q);
      // name
      return u.name.toLowerCase().includes(q);
    });
  }, [users, query, searchBy]);

  const openUser = async (u: User, tab: 'profile' | 'requests' | 'issues' = 'profile', mode: 'view' | 'edit' = 'view') => {
    setSelectedUser(u);
    setActiveTab(tab);
    setDetailMode(mode);
    setIsEdit(mode === 'edit');
    setEditForm(u);
    setIsCreate(false);
    if (!requestsByUser[u.id]) {
      try {
        const data = await getGeneralRequests(u.id);
        const reqs: Request[] = (Array.isArray(data) ? data : []).map((r: any, idx: number) => ({
          id: r._id || `${u.id}-REQ${idx + 1}`,
          userId: u.id,
          type: r.type || 'Request',
          description: r.description || r.reason || '',
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : '-',
          status: r.status || 'Pending',
          approver: u.reportingManager || 'HR Team',
        }));
        setRequestsByUser((prev) => ({ ...prev, [u.id]: reqs }));
      } catch (err) {
        console.error('Error fetching requests:', err);
        setRequestsByUser((prev) => ({ ...prev, [u.id]: [] }));
      }
    }
    if (!issuesByUser[u.id]) {
      setIssuesByUser((prev) => ({ ...prev, [u.id]: [] }));
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingResume(true);
    setFormError(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const res = await parseResume(formData);
      if (res.success && res.data) {
        setEditForm((prev) => ({
          ...prev,
          name: res.data.name || prev.name,
          email: res.data.email || prev.email,
          phone: res.data.phone || prev.phone,
          location: res.data.location || prev.location,
          department: res.data.suggestedDepartment || prev.department,
        }));
        // Optional: show a small success message or just let the form populate
      }
    } catch (err: any) {
      setFormError('Failed to parse resume: ' + err.message);
    } finally {
      setIsParsingResume(false);
    }
  };

  const saveUserEdits = async () => {
    setFormError(null);
    if (!editForm.name || !editForm.email || !editForm.department || !(editForm.role as User['role'])) {
      setFormError('Please fill Name, Email, Department and Role.');
      return;
    }
    try {
      if (isCreate) {
        // Prepare data matching backend model structure
        const dataToSubmit = {
          name: editForm.name,
          email: editForm.email,
          dept: editForm.department,
          role: editForm.role || 'employee',
          designation: editForm.role || 'Employee', // fallback
          phone: editForm.phone || '',
          location: editForm.location || '',
          reportingTo: editForm.reportingManager || '',
          dateOfJoining: editForm.joinDate || new Date().toISOString().slice(0, 10),
        };
        const newDbUser = await createEmployee(dataToSubmit);
        
        // Show credentials dialog
        setGeneratedCreds({
          email: newDbUser.email,
          password: newDbUser.generatedPassword,
          message: newDbUser.message,
          emailPreviewUrl: newDbUser.emailPreviewUrl
        });

        const newUser: User = {
          id: newDbUser.empId || newDbUser._id,
          name: newDbUser.name,
          role: (newDbUser.role as User['role']) || 'Employee',
          department: newDbUser.dept,
          status: 'Active',
          email: newDbUser.email,
          phone: newDbUser.phone || '',
          location: newDbUser.location || '',
          joinDate: newDbUser.dateOfJoining || '',
          reportingManager: newDbUser.reportingTo || '',
        };
        setUsers((prev) => [newUser, ...prev]);
        setRequestsByUser((prev) => ({ ...prev, [newUser.id]: [] }));
        setIssuesByUser((prev) => ({ ...prev, [newUser.id]: [] }));
        setSelectedUser(newUser);
        setDetailMode('view');
        setIsEdit(false);
        setIsCreate(false);
      } else {
        if (!selectedUser) return;
        const mongoId = (await getUsers()).find((u:any) => u.empId === selectedUser.id || u._id === selectedUser.id)?._id;
        if(mongoId) {
           await updateUser(mongoId, {
              name: editForm.name,
              email: editForm.email,
              dept: editForm.department,
              role: editForm.role,
              phone: editForm.phone,
              location: editForm.location,
              reportingTo: editForm.reportingManager,
              dateOfJoining: editForm.joinDate
           });
        }

        setUsers((prev) => prev.map((u) => (u.id === selectedUser.id ? { ...u, ...(editForm as User) } : u)));
        const updated = { ...selectedUser, ...(editForm as User) } as User;
        setSelectedUser(updated);
        setIsEdit(false);
        setDetailMode('view');
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to save user');
    }
  };

  const toggleActive = async (u: User) => {
    try {
      const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
      const mongoId = (await getUsers()).find((dbU:any) => dbU.empId === u.id || dbU._id === u.id)?._id;
      if (mongoId) {
         await updateUser(mongoId, { isActive: newStatus === 'Active' });
      }
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: newStatus } : x)));
      if (selectedUser?.id === u.id) setSelectedUser({ ...u, status: newStatus });
    } catch(e) {
      console.error(e);
    }
  };

  const handlePasswordChange = async () => {
    if(!selectedUser) return;
    try {
        const mongoId = (await getUsers()).find((dbU:any) => dbU.empId === selectedUser.id || dbU._id === selectedUser.id)?._id;
        if(mongoId && newPassword.length >= 6) {
           await changePassword(mongoId, { newPassword });
           setChangePwdOpen(false);
           setNewPassword('');
           alert('Password updated successfully');
        } else {
           alert('Password must be at least 6 characters');
        }
    } catch(e: any) {
       alert(e.message || 'Failed to change password');
    }
  };

  const [denyDialog, setDenyDialog] = useState<{ open: boolean; userId?: string; request?: Request; reason: string }>(
    { open: false, reason: '' }
  );

  const approveRequest = (userId: string, reqId: string) => {
    setRequestsByUser((prev) => ({
      ...prev,
      [userId]: prev[userId].map((r) => (r.id === reqId ? { ...r, status: 'Approved' } : r)),
    }));
  };

  const rejectRequest = (userId: string, req: Request, reason: string) => {
    setRequestsByUser((prev) => ({
      ...prev,
      [userId]: prev[userId].map((r) => (r.id === req.id ? { ...r, status: 'Rejected', denialReason: reason } : r)),
    }));

    const newIssue: Issue = {
      id: `${userId}-ISS-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      userId,
      requestId: req.id,
      title: `Request ${req.id} denied`,
      status: 'Open',
      createdAt: new Date().toISOString().slice(0, 10),
      deniedBy: 'Super Admin',
      reason,
    };
    setIssuesByUser((prev) => ({ ...prev, [userId]: [newIssue, ...(prev[userId] || [])] }));
  };

  const resolveIssue = (userId: string, issueId: string, note: string) => {
    setIssuesByUser((prev) => ({
      ...prev,
      [userId]: prev[userId].map((i) =>
        i.id === issueId ? { ...i, status: 'Resolved', resolutionNote: note, resolvedAt: new Date().toISOString().slice(0, 10) } : i
      ),
    }));
  };

  const backToList = () => {
    setSelectedUser(null);
    setDetailMode('view');
    setActiveTab('profile');
    setIsEdit(false);
    setIsCreate(false);
    setFormError(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        {selectedUser ? (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button onClick={backToList} className="px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm font-bold">← Back</button>
              <div>
                <h2 className="text-xl font-bold text-[#1B254B]">{isCreate ? 'Create User' : detailMode === 'edit' ? 'Edit User' : 'User Profile'}</h2>
                <p className="text-xs text-gray-500">{isCreate ? 'New user details' : `${selectedUser.name} • ${selectedUser.id}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isCreate && (
                <span className={`px-2 py-1 rounded-lg text-xs ${selectedUser.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>{selectedUser.status}</span>
              )}
              {detailMode === 'view' && !isCreate ? (
                <button className="px-3 py-2 rounded-lg border text-sm font-bold" onClick={() => { setDetailMode('edit'); setIsEdit(true); }}>
                  Edit
                </button>
              ) : (
                !isCreate && (<button className="px-3 py-2 rounded-lg border text-sm font-bold" onClick={() => { setDetailMode('view'); setIsEdit(false); }}>
                  View
                </button>)
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-xl font-bold text-[#1B254B]">User Management</h2>
              <p className="text-xs text-gray-500">Search by profile/role or employee ID, manage requests and issues</p>
            </div>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <div className="flex items-center bg-[#F4F7FE] rounded-lg px-3 py-2 border w-full max-w-md">
                <Search size={16} className="text-gray-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search by ${searchBy === 'employeeId' ? 'Employee ID' : searchBy === 'profile' ? 'Profile/Role' : 'Name'}`}
                  className="bg-transparent outline-none ml-2 text-sm w-full"
                />
                <select
                  className="ml-2 text-xs bg-white border rounded-md px-2 py-1"
                  value={searchBy}
                  onChange={(e) => setSearchBy(e.target.value as any)}
                  aria-label="Search By"
                >
                  <option value="name">Name</option>
                  <option value="profile">Profile / Role</option>
                  <option value="employeeId">Employee ID</option>
                </select>
              </div>
              <button
                className="bg-[#0B4DA2] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 whitespace-nowrap"
                onClick={() => {
                  setIsCreate(true);
                  setDetailMode('edit');
                  setIsEdit(true);
                  const draft: User = {
                    id: '',
                    name: '',
                    role: 'Employee',
                    department: '',
                    status: 'Active',
                    email: '',
                    phone: '',
                    location: '',
                    joinDate: new Date().toISOString().slice(0, 10),
                    reportingManager: '',
                  };
                  setSelectedUser(draft);
                  setEditForm(draft);
                  setActiveTab('profile');
                }}
              >
                <UserPlus size={16} /> Create User
              </button>
            </div>
          </div>
        )}
      </div>
      {!selectedUser && (
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F4F7FE]">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Department</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-bold text-[#0B4DA2]">{u.id}</td>
                  <td className="px-6 py-3 text-sm text-[#1B254B]">{u.name}</td>
                  <td className="px-6 py-3 text-sm">{u.role}</td>
                  <td className="px-6 py-3 text-sm">{u.department}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-2 py-1 rounded-lg text-xs ${u.status === 'Active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'}`}>{u.status}</span>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <button
                      className="text-[#0B4DA2] font-bold text-xs hover:underline mr-3 flex items-center gap-1"
                      onClick={() => openUser(u, 'profile', 'view')}
                    >
                      <Eye size={14} /> View
                    </button>
                    <button
                      className="text-[#0B4DA2] font-bold text-xs hover:underline mr-3 flex items-center gap-1"
                      onClick={() => openUser(u, 'profile', 'edit')}
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button
                      className="text-[#EE5D50] font-bold text-xs hover:underline flex items-center gap-1"
                      onClick={() => toggleActive(u)}
                    >
                      <Ban size={14} />
                      {u.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-gray-500">No users match the search.</div>
          )}
        </div>
      )}

      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <h3 className="font-bold text-[#1B254B] mb-3">Role-Based Access</h3>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
          <ShieldCheck className="text-[#0B4DA2]" />
          <p className="text-sm text-gray-600">Employees can access only their data. Admins manage their departments. Super Admins have full system access.</p>
        </div>
      </div>

      {/* User Details Inline View */}
      {selectedUser && (
        <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 p-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="mt-2">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="mt-4">
              {isCreate && (
                <div className="mb-6 p-4 bg-gradient-to-r from-[#F4F7FE] to-white rounded-xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-[#0B4DA2] font-bold text-sm flex items-center gap-2"><FileText size={16}/> AI Resume Parser</h4>
                    <p className="text-xs text-gray-500 mt-1">Upload the candidate's resume to automatically extract and fill their details.</p>
                  </div>
                  <div>
                    <input type="file" id="resume-upload" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
                    <label htmlFor="resume-upload" className="cursor-pointer bg-white border border-[#0B4DA2] text-[#0B4DA2] px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#F4F7FE] transition">
                      {isParsingResume ? <><Loader2 size={16} className="animate-spin" /> Parsing...</> : 'Upload Resume'}
                    </label>
                  </div>
                </div>
              )}

              {formError && (
                <div className="mb-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{formError}</div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Employee ID</label>
                  <input
                    disabled
                    value={editForm.id || ''}
                    className={`w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1 border-transparent opacity-70`}
                    placeholder="Auto-generated by system (e.g. SMG-2024-001)"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Name</label>
                  <input
                    disabled={detailMode !== 'edit'}
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    className={`w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1 ${detailMode === 'edit' ? 'border-[#0B4DA2]' : 'border-transparent'}`}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Email</label>
                  <input
                    disabled={detailMode !== 'edit'}
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    className={`w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1 ${detailMode === 'edit' ? 'border-[#0B4DA2]' : 'border-transparent'}`}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Phone</label>
                  <input
                    disabled={detailMode !== 'edit'}
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                    className={`w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1 ${detailMode === 'edit' ? 'border-[#0B4DA2]' : 'border-transparent'}`}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Location</label>
                  <input
                    disabled={detailMode !== 'edit'}
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, location: e.target.value }))}
                    className={`w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1 ${detailMode === 'edit' ? 'border-[#0B4DA2]' : 'border-transparent'}`}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Department</label>
                  <input
                    disabled={detailMode !== 'edit'}
                    value={editForm.department || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, department: e.target.value }))}
                    className={`w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1 ${detailMode === 'edit' ? 'border-[#0B4DA2]' : 'border-transparent'}`}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Role</label>
                  <select
                    disabled={detailMode !== 'edit'}
                    value={editForm.role || selectedUser.role}
                    onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value as User['role'] }))}
                    className={`w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1 ${detailMode === 'edit' ? 'border-[#0B4DA2]' : 'border-transparent'}`}
                  >
                    <option>Employee</option>
                    <option>Admin</option>
                    <option>Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Reporting Manager</label>
                  <input
                    disabled={detailMode !== 'edit'}
                    value={editForm.reportingManager || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, reportingManager: e.target.value }))}
                    className={`w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1 ${detailMode === 'edit' ? 'border-[#0B4DA2]' : 'border-transparent'}`}
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Join Date</label>
                  <input
                    type="date"
                    disabled={detailMode !== 'edit'}
                    value={editForm.joinDate || ''}
                    onChange={(e) => setEditForm((f) => ({ ...f, joinDate: e.target.value }))}
                    className={`w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1 ${detailMode === 'edit' ? 'border-[#0B4DA2]' : 'border-transparent'}`}
                  />
                </div>
              </div>

              <div className="flex justify-between gap-2 mt-6">
                <button onClick={backToList} className="px-4 py-2 rounded-lg border">Back</button>
                <div className="flex gap-2">
                  {!isCreate && detailMode === 'view' && (
                    <button className="px-4 py-2 rounded-lg border text-[#0B4DA2] font-semibold hover:bg-[#F4F7FE]" onClick={() => setChangePwdOpen(true)}>
                      Change Password
                    </button>
                  )}
                  {detailMode === 'edit' ? (
                    <>
                      <button className="px-4 py-2 rounded-lg border flex items-center gap-2" onClick={isCreate ? backToList : () => { setIsEdit(false); setDetailMode('view'); }}>
                        <X size={16} /> Cancel
                      </button>
                      <button className="px-4 py-2 rounded-lg bg-[#0B4DA2] text-white flex items-center gap-2" onClick={saveUserEdits}>
                        <Save size={16} /> Save Changes
                      </button>
                    </>
                  ) : (
                    <button className="px-4 py-2 rounded-lg border flex items-center gap-2" onClick={() => { setDetailMode('edit'); setIsEdit(true); }}>
                      <Edit size={16} /> Edit Details
                    </button>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Requests Tab */}
            <TabsContent value="requests" className="mt-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#F4F7FE]">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Request ID</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Type</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Description</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Date</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(requestsByUser[selectedUser.id] || []).map((r) => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-bold text-[#0B4DA2]">{r.id}</td>
                        <td className="px-4 py-2 text-sm">{r.type}</td>
                        <td className="px-4 py-2 text-sm text-gray-700">{r.description}</td>
                        <td className="px-4 py-2 text-sm text-gray-500">{r.date}</td>
                        <td className="px-4 py-2 text-sm">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs ${r.status === 'Approved'
                                ? 'bg-green-50 text-green-600'
                                : r.status === 'Rejected'
                                  ? 'bg-red-50 text-red-600'
                                  : r.status === 'Pending'
                                    ? 'bg-yellow-50 text-yellow-700'
                                    : 'bg-blue-50 text-blue-700'
                              }`}
                          >
                            {r.status}
                          </span>
                          {r.status === 'Rejected' && r.denialReason && (
                            <div className="text-xs text-gray-500 mt-1">Reason: {r.denialReason}</div>
                          )}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <div className="flex items-center gap-2">
                            {r.status !== 'Approved' && (
                              <button
                                className="px-2 py-1 rounded-md bg-green-600 text-white text-xs flex items-center gap-1"
                                onClick={() => approveRequest(selectedUser.id, r.id)}
                              >
                                <CheckCircle size={14} /> Approve
                              </button>
                            )}
                            {r.status !== 'Rejected' && (
                              <button
                                className="px-2 py-1 rounded-md bg-red-600 text-white text-xs flex items-center gap-1"
                                onClick={() => setDenyDialog({ open: true, userId: selectedUser.id, request: r, reason: '' })}
                              >
                                <AlertTriangle size={14} /> Deny
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Issues Tab */}
            <TabsContent value="issues" className="mt-4">
              <div className="space-y-3">
                {(issuesByUser[selectedUser.id] || []).length === 0 && (
                  <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-xl">No issues for this user.</div>
                )}
                {(issuesByUser[selectedUser.id] || []).map((iss) => (
                  <div key={iss.id} className="p-4 rounded-xl border bg-white flex items-start gap-3">
                    <MessageSquare className="text-[#0B4DA2] mt-0.5" size={18} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-[#1B254B]">{iss.title}</div>
                        <span className={`px-2 py-1 rounded-lg text-xs ${iss.status === 'Open' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-600'}`}>{iss.status}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Raised: {iss.createdAt} • Request: {iss.requestId} • By: {iss.deniedBy}</div>
                      <div className="text-sm text-gray-700 mt-2">Reason: {iss.reason}</div>

                      {iss.status === 'Open' ? (
                        <IssueResolveForm
                          onResolve={(note) => resolveIssue(selectedUser.id, iss.id, note)}
                        />
                      ) : (
                        <div className="text-xs text-gray-600 mt-2">Resolution: {iss.resolutionNote} • {iss.resolvedAt}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Deny Request Mini Dialog */}
      {denyDialog.open && (
        <Dialog open={denyDialog.open}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#1B254B] flex items-center gap-2">
                <AlertTriangle size={18} className="text-red-600" /> Deny Request
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="text-sm text-gray-600">Provide a reason for denial of <span className="font-semibold text-[#0B4DA2]">{denyDialog.request?.id}</span>.</div>
              <textarea
                rows={4}
                value={denyDialog.reason}
                onChange={(e) => setDenyDialog((d) => ({ ...d, reason: e.target.value }))}
                className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2"
                placeholder="Reason for denial"
              />
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <button className="px-4 py-2 rounded-lg border" onClick={() => setDenyDialog({ open: false, reason: '' })}>Cancel</button>
                </DialogClose>
                <DialogClose asChild>
                  <button
                    className="px-4 py-2 rounded-lg bg-red-600 text-white disabled:opacity-50"
                    disabled={!denyDialog.reason.trim()}
                    onClick={() => {
                      if (denyDialog.userId && denyDialog.request) {
                        rejectRequest(denyDialog.userId, denyDialog.request, denyDialog.reason.trim());
                      }
                      setDenyDialog({ open: false, reason: '' });
                      setActiveTab('issues');
                    }}
                  >
                    Deny Request
                  </button>
                </DialogClose>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Generated Credentials Dialog */}
      {generatedCreds && (
        <Dialog open={!!generatedCreds}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#1B254B] flex items-center gap-2">
                <CheckCircle size={18} className="text-green-600" /> Employee Created
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="p-4 bg-green-50 text-green-800 rounded-lg border border-green-200">
                <p className="font-semibold">{generatedCreds.message}</p>
                <p className="text-sm mt-2">The system has generated a secure welcome email containing these credentials and sent it to the employee's provided address.</p>
              </div>
              <div className="bg-[#F4F7FE] p-4 rounded-xl border border-gray-200">
                <div className="text-sm text-gray-500">Email</div>
                <div className="font-bold text-[#1B254B] font-mono select-all mb-3">{generatedCreds.email}</div>
                <div className="text-sm text-gray-500">Temporary Password</div>
                <div className="font-bold text-[#1B254B] font-mono select-all">{generatedCreds.password}</div>
              </div>
              <div className="flex justify-between items-center pt-2">
                {generatedCreds.emailPreviewUrl ? (
                    <a href={generatedCreds.emailPreviewUrl} target="_blank" rel="noreferrer" className="text-sm text-[#0B4DA2] hover:underline font-semibold">
                        View Email Preview ↗
                    </a>
                ) : <div/>}
                <button className="px-4 py-2 rounded-lg bg-[#0B4DA2] text-white font-bold" onClick={() => setGeneratedCreds(null)}>Done</button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Change Password Dialog */}
      {changePwdOpen && (
        <Dialog open={changePwdOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[#1B254B]">Change User Password</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="text-sm text-gray-600">Enter a new password for <span className="font-semibold text-[#0B4DA2]">{selectedUser?.name}</span>. The user will be notified.</div>
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2"
                placeholder="New password (min 6 chars)"
              />
              <div className="flex justify-end gap-2 mt-4">
                <button className="px-4 py-2 rounded-lg border" onClick={() => { setChangePwdOpen(false); setNewPassword(''); }}>Cancel</button>
                <button
                  className="px-4 py-2 rounded-lg bg-[#0B4DA2] text-white disabled:opacity-50"
                  disabled={newPassword.length < 6}
                  onClick={handlePasswordChange}
                >
                  Update Password
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
};

function IssueResolveForm({ onResolve }: { onResolve: (note: string) => void }) {
  const [note, setNote] = useState('');
  return (
    <div className="mt-3 bg-gray-50 rounded-lg p-3">
      <label className="text-xs text-gray-500">Resolution Note</label>
      <textarea
        rows={3}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full bg-white border rounded-lg px-3 py-2 mt-1"
        placeholder="Describe how this issue was resolved"
      />
      <div className="flex justify-end mt-2">
        <button
          className="px-3 py-1.5 rounded-md bg-[#0B4DA2] text-white text-xs disabled:opacity-50"
          disabled={!note.trim()}
          onClick={() => onResolve(note.trim())}
        >
          Mark Resolved
        </button>
      </div>
    </div>
  );
}
