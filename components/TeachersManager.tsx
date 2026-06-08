'use client';

import { useState, useTransition } from 'react';
import type { Teacher } from '../lib/school';
import { addTeacherAction, editTeacherAction, removeTeacherAction } from '../app/[tenant]/teacher-actions';
import { useRouter } from 'next/navigation';

type Props = {
  tenantSlug: string;
  initialTeachers: Teacher[];
};

export default function TeachersManager({ tenantSlug, initialTeachers }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();
  
  const [form, setForm] = useState({ name: '', subject: '', email: '', status: 'Available' });

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await addTeacherAction(tenantSlug, form.name, form.subject, form.email, form.status);
      if (res.success) {
        setIsCreating(false);
        setForm({ name: '', subject: '', email: '', status: 'Available' });
        router.refresh(); 
      } else {
        alert(res.error);
      }
    });
  };

  const handleEditTeacher = (t: Teacher) => {
    setEditingId(t.id);
    setForm({ name: t.name, subject: t.subject, email: t.email, status: t.status });
  };

  const handleSaveTeacher = (id: string) => {
    startTransition(async () => {
      const res = await editTeacherAction(tenantSlug, id, form.name, form.subject, form.email, form.status);
      if (res.success) {
        setEditingId(null);
        setForm({ name: '', subject: '', email: '', status: 'Available' });
        router.refresh();
      } else {
        alert(res.error);
      }
    });
  };

  const handleDeleteTeacher = (id: string) => {
    if (!confirm('Are you sure you want to remove this teacher?')) return;
    startTransition(async () => {
      const res = await removeTeacherAction(tenantSlug, id);
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
          <h2 className="text-xl font-semibold text-white">Teacher Staff</h2>
          <p className="mt-1 text-sm text-slate-400">Manage school teachers and their current status.</p>
        </div>
        <button onClick={() => { setIsCreating(!isCreating); setEditingId(null); setForm({ name: '', subject: '', email: '', status: 'Available' }); }} className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">
          {isCreating ? 'Cancel' : 'Add Teacher'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleAddTeacher} className="mb-6 rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
          <h3 className="text-lg font-semibold text-white">Add New Teacher</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Name</span>
              <input required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. Avery Brooks" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Subject</span>
              <input required type="text" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. Mathematics" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Email</span>
              <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. avery@school.com" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Status</span>
              <select required value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none">
                <option value="Available">Available</option>
                <option value="In class">In class</option>
                <option value="On leave">On leave</option>
              </select>
            </label>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={isPending} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">Add Teacher</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-900 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {initialTeachers.map((t) => (
              <tr key={t.id} className="transition hover:bg-slate-900/50">
                {editingId === t.id ? (
                  <>
                    <td className="px-4 py-3"><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full min-w-[120px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" /></td>
                    <td className="px-4 py-3"><input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full min-w-[100px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" /></td>
                    <td className="px-4 py-3"><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full min-w-[120px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" /></td>
                    <td className="px-4 py-3">
                      <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full min-w-[100px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none">
                        <option value="Available">Available</option>
                        <option value="In class">In class</option>
                        <option value="On leave">On leave</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => handleSaveTeacher(t.id)} disabled={isPending} className="rounded-lg bg-sky-500 px-3 py-1 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50">Save</button>
                      <button onClick={() => setEditingId(null)} disabled={isPending} className="rounded-lg border border-slate-600 px-3 py-1 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-semibold text-white">{t.name}</td>
                    <td className="px-4 py-3">{t.subject}</td>
                    <td className="px-4 py-3 text-sky-400">{t.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${t.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400' : t.status === 'In class' ? 'bg-sky-500/10 text-sky-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                      <button onClick={() => handleEditTeacher(t)} className="text-sky-400 hover:text-sky-300">Edit</button>
                      <button onClick={() => handleDeleteTeacher(t.id)} className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {initialTeachers.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-slate-500">No teachers found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}