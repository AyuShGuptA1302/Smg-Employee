import React, { useMemo, useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '../../components/ui/dialog';

export const SuperAdminAnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([
    { id: 'AN-01', title: 'Holiday Calendar 2026', date: '2025-12-15', audience: 'All Employees' },
    { id: 'AN-02', title: 'New Safety Policy', date: '2025-12-10', audience: 'Production' },
  ]);

  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState<{ id?: string; title?: string; audience?: string; date?: string }>({ audience: 'All Employees', date: new Date().toISOString().slice(0, 10) });
  const [addError, setAddError] = useState<string | null>(null);

  const nextAnnId = useMemo(() => {
    const nums = announcements
      .map(a => /AN-(\d+)/.exec(a.id)?.[1])
      .filter(Boolean)
      .map(n => parseInt(n as string, 10));
    const next = (nums.length ? Math.max(...(nums as number[])) : 0) + 1;
    return `AN-${String(next).padStart(2, '0')}`;
  }, [announcements]);

  const saveAnnouncement = () => {
    setAddError(null);
    if (!addForm.title || !addForm.title.trim()) {
      setAddError('Please enter a title.');
      return;
    }
    const id = (addForm.id as string) || nextAnnId;
    if (announcements.some(a => a.id.toLowerCase() === id.toLowerCase())) {
      setAddError('Announcement ID already exists.');
      return;
    }
    const ann = {
      id,
      title: addForm.title.trim(),
      audience: addForm.audience || 'All Employees',
      date: addForm.date || new Date().toISOString().slice(0, 10),
    };
    setAnnouncements(prev => [ann, ...prev]);
    setAddForm({ audience: 'All Employees', date: new Date().toISOString().slice(0, 10) });
    setAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1B254B]">Manage Announcements</h2>
            <p className="text-xs text-gray-500">Create and publish company-wide announcements</p>
          </div>
          <button className="bg-[#0B4DA2] text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2" onClick={() => setAddOpen(true)}><Plus size={16} /> New Announcement</button>
        </div>
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#F4F7FE]">
            <tr>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Audience</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.map(a => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-bold text-[#0B4DA2]">{a.id}</td>
                <td className="px-6 py-3 text-sm text-[#1B254B]">{a.title}</td>
                <td className="px-6 py-3 text-sm">{a.audience}</td>
                <td className="px-6 py-3 text-sm">{a.date}</td>
                <td className="px-6 py-3 text-sm"><button className="text-[#0B4DA2] font-bold text-xs hover:underline mr-3">Edit</button><button className="text-[#EE5D50] font-bold text-xs hover:underline">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Announcement Dialog */}
      <Dialog open={addOpen} onOpenChange={(o) => { if (!o) setAddOpen(false); }}>
        <DialogContent className="w-[520px] max-w-[92vw]">
          <DialogHeader>
            <DialogTitle className="text-[#1B254B]">Add Announcement</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 mt-2">
            {addError && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{addError}</div>}
            <div>
              <label className="text-xs text-gray-500">Announcement ID</label>
              <input
                value={(addForm.id as string) ?? ''}
                onChange={(e) => setAddForm((f) => ({ ...f, id: e.target.value }))}
                placeholder={`${nextAnnId} (auto if blank)`}
                className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500">Title</label>
              <input
                value={addForm.title || ''}
                onChange={(e) => setAddForm((f) => ({ ...f, title: e.target.value }))}
                className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500">Audience</label>
                <select
                  value={addForm.audience || 'All Employees'}
                  onChange={(e) => setAddForm((f) => ({ ...f, audience: e.target.value }))}
                  className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1"
                >
                  <option>All Employees</option>
                  <option>Production</option>
                  <option>Quality Control</option>
                  <option>Engineering</option>
                  <option>Sales & Marketing</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500">Date</label>
                <input
                  type="date"
                  value={addForm.date || new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setAddForm((f) => ({ ...f, date: e.target.value }))}
                  className="w-full bg-[#F4F7FE] border rounded-lg px-3 py-2 mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <DialogClose asChild>
                <button className="px-4 py-2 rounded-lg border flex items-center gap-2"><X size={16} /> Cancel</button>
              </DialogClose>
              <button className="px-4 py-2 rounded-lg bg-[#0B4DA2] text-white flex items-center gap-2" onClick={saveAnnouncement}><Save size={16} /> Save</button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
