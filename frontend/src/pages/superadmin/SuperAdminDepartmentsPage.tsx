import React, { useMemo, useState } from 'react';
import { Building2, Plus, Settings, Save, X, Search, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../../components/ui/dialog';

export const SuperAdminDepartmentsPage = () => {
  const [departments, setDepartments] = useState<Array<Department>>([
    { id: 'D-01', name: 'Production', managers: 8, employees: 450, head: 'A. Kumar', costCenter: 'CC-P01', location: 'Plant-1', defaultShift: 'General', active: true },
    { id: 'D-02', name: 'Quality Control', managers: 4, employees: 125, head: 'P. Singh', costCenter: 'CC-QC2', location: 'Plant-1', defaultShift: 'General', active: true },
    { id: 'D-03', name: 'Engineering', managers: 6, employees: 200, head: 'R. Mehta', costCenter: 'CC-ENG', location: 'HQ', defaultShift: 'General', active: true },
    { id: 'D-04', name: 'Sales & Marketing', managers: 3, employees: 180, head: 'S. Rao', costCenter: 'CC-SM', location: 'HQ', defaultShift: 'General', active: true },
  ]);

  type Department = {
    id: string;
    name: string;
    managers: number;
    employees: number;
    head?: string;
    costCenter?: string;
    location?: string;
    defaultShift?: string;
    active?: boolean;
  };

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<Partial<Department>>({ active: true, defaultShift: 'General' });
  const [addError, setAddError] = useState<string | null>(null);

  const [cfgOpen, setCfgOpen] = useState(false);
  const [cfgForm, setCfgForm] = useState<Department | null>(null);
  const [cfgError, setCfgError] = useState<string | null>(null);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const [delOpen, setDelOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<Department | null>(null);

  const nextDeptId = useMemo(() => {
    const nums = departments
      .map((d) => /D-(\d+)/.exec(d.id)?.[1])
      .filter(Boolean)
      .map((n) => parseInt(n as string, 10));
    const next = (nums.length ? Math.max(...(nums as number[])) : 0) + 1;
    return `D-${String(next).padStart(2, '0')}`;
  }, [departments]);

  const openConfigure = (d: Department) => {
    setCfgForm({ ...d });
    setCfgError(null);
    setCfgOpen(true);
  };

  const saveNewDepartment = () => {
    setAddError(null);
    if (!addForm.name) {
      setAddError('Please enter a department name.');
      return;
    }
    const id = (addForm.id as string) || nextDeptId;
    if (departments.some((d) => d.id.toLowerCase() === id.toLowerCase())) {
      setAddError('Department ID already exists. Choose a different ID.');
      return;
    }
    const dept: Department = {
      id,
      name: addForm.name as string,
      managers: Number(addForm.managers) || 0,
      employees: Number(addForm.employees) || 0,
      head: addForm.head || '',
      costCenter: addForm.costCenter || '',
      location: addForm.location || '',
      defaultShift: addForm.defaultShift || 'General',
      active: addForm.active ?? true,
    };
    setDepartments((prev) => [dept, ...prev]);
    setAddForm({ active: true, defaultShift: 'General' });
    setAddOpen(false);
  };

  const saveConfig = () => {
    setCfgError(null);
    if (!cfgForm) return;
    if (!cfgForm.name) {
      setCfgError('Department name is required.');
      return;
    }
    setDepartments((prev) => prev.map((d) => (d.id === cfgForm.id ? { ...cfgForm } : d)));
    setCfgOpen(false);
  };

  const filteredDepartments = useMemo(() => {
    const q = query.trim().toLowerCase();
    return departments.filter((d) => {
      const matchesText = !q || d.name.toLowerCase().includes(q) || d.id.toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && d.active !== false) ||
        (statusFilter === 'inactive' && d.active === false);
      return matchesText && matchesStatus;
    });
  }, [departments, query, statusFilter]);

  // Removed disable/enable toggle action as requested

  const confirmDelete = (d: Department) => {
    setDeptToDelete(d);
    setDelOpen(true);
  };

  const deleteDepartment = () => {
    if (!deptToDelete) return;
    setDepartments((prev) => prev.filter((x) => x.id !== deptToDelete.id));
    setDelOpen(false);
    setDeptToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-[#1B254B]">Departments</h2>
            <p className="text-xs text-gray-500">Manage department structure and assignments</p>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center bg-[#F4F7FE] rounded-lg px-3 py-2 border w-[260px]">
              <Search size={16} className="text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or ID"
                className="bg-transparent outline-none ml-2 text-sm w-full"
              />
            </div>
            <select
              className="text-xs bg-white border rounded-md px-2 py-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <button
              className="bg-[#0B4DA2] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2"
              onClick={() => setAddOpen(true)}
            >
              <Plus size={16} /> Add Department
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDepartments.map(d => (
          <div key={d.id} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#F4F7FE] flex items-center justify-center"><Building2 className="text-[#0B4DA2]" /></div>
              <div>
                <h4 className="font-bold text-[#1B254B]">{d.name}</h4>
                <p className="text-xs text-gray-500">ID: {d.id}</p>
              </div>
              <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${d.active !== false ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                {d.active !== false ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div><p className="text-gray-400">Managers</p><p className="font-bold text-[#1B254B]">{d.managers}</p></div>
              <div><p className="text-gray-400">Employees</p><p className="font-bold text-[#1B254B]">{d.employees}</p></div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-3">
                  <button className="text-[#0B4DA2] font-bold text-xs flex items-center gap-1" onClick={() => openConfigure(d)}><Settings size={14} /> Configure</button>
                  <button className="text-[#EE5D50] font-bold text-xs flex items-center gap-1" onClick={() => confirmDelete(d)}>
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Dialog */}
      <Dialog open={addOpen} onOpenChange={(o) => { if (!o) setAddOpen(false); }}>
        <DialogContent className="w-[520px] max-w-[92vw]">
          <DialogHeader>
            <DialogTitle className="text-[#1B254B]">Add Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {addError && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{addError}</div>}
            <div>
              <label className="text-xs text-gray-500">Department ID</label>
              <input
                value={(addForm.id as string) ?? ''}
                onChange={(e) => setAddForm((f) => ({ ...f, id: e.target.value }))}
                placeholder={`${nextDeptId} (auto if blank)`}
                className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Name</label>
              <input
                value={addForm.name || ''}
                onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Managers</label>
                <input
                  type="number"
                  value={addForm.managers as number | undefined || 0}
                  onChange={(e) => setAddForm((f) => ({ ...f, managers: Number(e.target.value) }))}
                  className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Employees</label>
                <input
                  type="number"
                  value={addForm.employees as number | undefined || 0}
                  onChange={(e) => setAddForm((f) => ({ ...f, employees: Number(e.target.value) }))}
                  className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Head of Department</label>
                <input
                  value={addForm.head || ''}
                  onChange={(e) => setAddForm((f) => ({ ...f, head: e.target.value }))}
                  className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Cost Center</label>
                <input
                  value={addForm.costCenter || ''}
                  onChange={(e) => setAddForm((f) => ({ ...f, costCenter: e.target.value }))}
                  className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Location</label>
                <input
                  value={addForm.location || ''}
                  onChange={(e) => setAddForm((f) => ({ ...f, location: e.target.value }))}
                  className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1"
                />
              </div>
              <div>
                <label className="text-xs text-gray-500">Default Shift</label>
                <select
                  value={addForm.defaultShift || 'General'}
                  onChange={(e) => setAddForm((f) => ({ ...f, defaultShift: e.target.value }))}
                  className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1"
                >
                  <option>General</option>
                  <option>Shift A</option>
                  <option>Shift B</option>
                  <option>Shift C</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <button className="px-4 py-2 rounded-lg border flex items-center gap-2"><X size={16} /> Cancel</button>
              </DialogClose>
              <button className="px-4 py-2 rounded-lg bg-[#0B4DA2] text-white flex items-center gap-2" onClick={saveNewDepartment}><Save size={16} /> Save</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Configure Department Dialog */}
      <Dialog open={cfgOpen} onOpenChange={(o) => { if (!o) setCfgOpen(false); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#1B254B]">Configure Department</DialogTitle>
          </DialogHeader>
          {cfgForm && (
            <div className="space-y-3 mt-2">
              {cfgError && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{cfgError}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Department ID</label>
                  <input value={cfgForm.id} disabled className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Name</label>
                  <input value={cfgForm.name}
                    onChange={(e) => setCfgForm((f) => ({ ...f!, name: e.target.value }))}
                    className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Managers</label>
                  <input type="number" value={cfgForm.managers}
                    onChange={(e) => setCfgForm((f) => ({ ...f!, managers: Number(e.target.value) }))}
                    className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Employees</label>
                  <input type="number" value={cfgForm.employees}
                    onChange={(e) => setCfgForm((f) => ({ ...f!, employees: Number(e.target.value) }))}
                    className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Head of Department</label>
                  <input value={cfgForm.head || ''}
                    onChange={(e) => setCfgForm((f) => ({ ...f!, head: e.target.value }))}
                    className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Cost Center</label>
                  <input value={cfgForm.costCenter || ''}
                    onChange={(e) => setCfgForm((f) => ({ ...f!, costCenter: e.target.value }))}
                    className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">Location</label>
                  <input value={cfgForm.location || ''}
                    onChange={(e) => setCfgForm((f) => ({ ...f!, location: e.target.value }))}
                    className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Default Shift</label>
                  <select value={cfgForm.defaultShift || 'General'}
                    onChange={(e) => setCfgForm((f) => ({ ...f!, defaultShift: e.target.value }))}
                    className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1">
                    <option>General</option>
                    <option>Shift A</option>
                    <option>Shift B</option>
                    <option>Shift C</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input id="dept-active" type="checkbox" checked={!!cfgForm.active} onChange={(e) => setCfgForm((f) => ({ ...f!, active: e.target.checked }))} />
                <label htmlFor="dept-active" className="text-sm text-gray-600">Active</label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <DialogClose asChild>
                  <button className="px-4 py-2 rounded-lg border flex items-center gap-2"><X size={16} /> Close</button>
                </DialogClose>
                <button className="px-4 py-2 rounded-lg bg-[#0B4DA2] text-white flex items-center gap-2" onClick={saveConfig}><Save size={16} /> Save Changes</button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={delOpen} onOpenChange={(o) => { if (!o) setDelOpen(false); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#1B254B]">Delete Department</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            <p className="text-sm text-gray-700">Are you sure you want to delete <span className="font-semibold">{deptToDelete?.name}</span> ({deptToDelete?.id})? This action cannot be undone.</p>
            <div className="flex justify-end gap-2 pt-1">
              <DialogClose asChild>
                <button className="px-4 py-2 rounded-lg border flex items-center gap-2"><X size={16} /> Cancel</button>
              </DialogClose>
              <DialogClose asChild>
                <button className="px-4 py-2 rounded-lg bg-[#EE5D50] text-white flex items-center gap-2" onClick={deleteDepartment}><Trash2 size={16} /> Delete</button>
              </DialogClose>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
