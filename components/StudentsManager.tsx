'use client';

import { useState, useTransition } from 'react';
import type { Student } from '../lib/school';
import { addStudentAction, editStudentAction, removeStudentAction } from '../app/[tenant]/student-actions';
import { useRouter } from 'next/navigation';

type Props = {
  tenantSlug: string;
  initialStudents: Student[];
};

export default function StudentsManager({ tenantSlug, initialStudents }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();
  
  const [form, setForm] = useState({ name: '', grade: '', status: 'Active', enrolled: new Date().toISOString().slice(0, 10), guardianName: '', guardianPhone: '', address: '' });

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await addStudentAction(tenantSlug, form.name, form.grade, form.status, form.enrolled, form.guardianName, form.guardianPhone, form.address);
      if (res.success) {
        setIsCreating(false);
        setForm({ name: '', grade: '', status: 'Active', enrolled: new Date().toISOString().slice(0, 10), guardianName: '', guardianPhone: '', address: '' });
        router.refresh(); 
      } else {
        alert(res.error);
      }
    });
  };

  const handleEditStudent = (s: Student) => {
    setEditingId(s.id);
    setForm({ name: s.name, grade: s.grade, status: s.status, enrolled: s.enrolled, guardianName: s.guardianName || '', guardianPhone: s.guardianPhone || '', address: s.address || '' });
  };

  const handleSaveStudent = (id: string) => {
    startTransition(async () => {
      const res = await editStudentAction(tenantSlug, id, form.name, form.grade, form.status, form.enrolled, form.guardianName, form.guardianPhone, form.address);
      if (res.success) {
        setEditingId(null);
        setForm({ name: '', grade: '', status: 'Active', enrolled: new Date().toISOString().slice(0, 10), guardianName: '', guardianPhone: '', address: '' });
        router.refresh();
      } else {
        alert(res.error);
      }
    });
  };

  const handleDeleteStudent = (id: string) => {
    if (!confirm('Are you sure you want to remove this student?')) return;
    startTransition(async () => {
      const res = await removeStudentAction(tenantSlug, id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error);
      }
    });
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6">
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Student Records</h2>
          <p className="mt-1 text-sm text-slate-400">Manage enrolled students and their information.</p>
        </div>
        <button onClick={() => { setIsCreating(!isCreating); setEditingId(null); setForm({ name: '', grade: '', status: 'Active', enrolled: new Date().toISOString().slice(0, 10), guardianName: '', guardianPhone: '', address: '' }); }} className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">
          {isCreating ? 'Cancel' : 'Add Student'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleAddStudent} className="mb-6 rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
          <h3 className="text-lg font-semibold text-white">Add New Student</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Name</span>
              <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. John Doe" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Grade / Class</span>
              <input required type="text" value={form.grade} onChange={e => setForm({...form, grade: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. 7" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Enrolled Date</span>
              <input required type="date" value={form.enrolled} onChange={e => setForm({...form, enrolled: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Status</span>
              <select required value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none">
                <option value="Active">Active</option>
                <option value="On leave">On leave</option>
                <option value="Graduated">Graduated</option>
                <option value="Transferred">Transferred</option>
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Guardian Name</span>
              <input type="text" value={form.guardianName} onChange={e => setForm({...form, guardianName: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. Jane Doe" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Guardian Phone</span>
              <input type="text" value={form.guardianPhone} onChange={e => setForm({...form, guardianPhone: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. +8801700000000" />
            </label>
            <label className="block sm:col-span-2 lg:col-span-3">
              <span className="text-xs font-semibold text-slate-300">Address</span>
              <input type="text" value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. 123 Main St, City" />
            </label>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={isPending} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">Add Student</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-900 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Grade</th>
              <th className="px-4 py-3 font-medium">Guardian Info</th>
              <th className="px-4 py-3 font-medium">Enrolled</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {initialStudents.map((s) => (
              <tr key={s.id} className="transition hover:bg-slate-900/50">
                {editingId === s.id ? (
                  <>
                    <td className="px-4 py-3">
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full min-w-[120px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none mb-2" placeholder="Student Name" />
                      <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full min-w-[120px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="Address" />
                    </td>
                    <td className="px-4 py-3 align-top"><input type="text" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="w-full min-w-[60px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 align-top">
                      <input type="text" value={form.guardianName} onChange={(e) => setForm({ ...form, guardianName: e.target.value })} className="w-full min-w-[100px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none mb-2" placeholder="Name" />
                      <input type="text" value={form.guardianPhone} onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })} className="w-full min-w-[100px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="Phone" />
                    </td>
                    <td className="px-4 py-3 align-top"><input type="date" value={form.enrolled} onChange={(e) => setForm({ ...form, enrolled: e.target.value })} className="w-full min-w-[120px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" /></td>
                    <td className="px-4 py-3 align-top">
                      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full min-w-[100px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none">
                        <option value="Active">Active</option>
                        <option value="On leave">On leave</option>
                        <option value="Graduated">Graduated</option>
                        <option value="Transferred">Transferred</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap align-top">
                      <button onClick={() => handleSaveStudent(s.id)} disabled={isPending} className="rounded-lg bg-sky-500 px-3 py-1 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50">Save</button>
                      <button onClick={() => setEditingId(null)} disabled={isPending} className="rounded-lg border border-slate-600 px-3 py-1 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{s.name}</p>
                      {s.address && <p className="text-xs text-slate-500">{s.address}</p>}
                    </td>
                    <td className="px-4 py-3">{s.grade}</td>
                    <td className="px-4 py-3">
                      {s.guardianName ? <p className="text-white">{s.guardianName}</p> : <p className="text-slate-500 italic text-xs">No info</p>}
                      {s.guardianPhone && <p className="text-xs text-sky-400">{s.guardianPhone}</p>}
                    </td>
                    <td className="px-4 py-3">{s.enrolled}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${s.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                      <button onClick={() => handleEditStudent(s)} className="text-sky-400 hover:text-sky-300">Edit</button>
                      <button onClick={() => handleDeleteStudent(s.id)} className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {initialStudents.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-slate-500">No students found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}