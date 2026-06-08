'use client';

import { useState, useTransition } from 'react';
import type { ClassSchedule, Teacher } from '../lib/school';
import { addClassAction, editClassAction, removeClassAction } from '../app/[tenant]/class-actions';
import { useRouter } from 'next/navigation';

type Props = {
  tenantSlug: string;
  initialClasses: ClassSchedule[];
  teachers: Teacher[];
};

export default function ClassesManager({ tenantSlug, initialClasses, teachers }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();
  
  const [form, setForm] = useState({ title: '', day: 'Monday', time: '', room: '', teacher: '' });

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await addClassAction(tenantSlug, form.title, form.day, form.time, form.room, form.teacher);
      if (res.success) {
        setIsCreating(false);
        setForm({ title: '', day: 'Monday', time: '', room: '', teacher: '' });
        router.refresh(); 
      } else {
        alert(res.error);
      }
    });
  };

  const handleEditClass = (cls: ClassSchedule) => {
    setEditingId(cls.id);
    setForm({ title: cls.title, day: cls.day, time: cls.time, room: cls.room, teacher: cls.teacher });
  };

  const handleSaveClass = (id: string) => {
    startTransition(async () => {
      const res = await editClassAction(tenantSlug, id, form.title, form.day, form.time, form.room, form.teacher);
      if (res.success) {
        setEditingId(null);
        setForm({ title: '', day: 'Monday', time: '', room: '', teacher: '' });
        router.refresh();
      } else {
        alert(res.error);
      }
    });
  };

  const handleDeleteClass = (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    startTransition(async () => {
      const res = await removeClassAction(tenantSlug, id);
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
          <h2 className="text-xl font-semibold text-white">Class Schedules</h2>
          <p className="mt-1 text-sm text-slate-400">Manage all class routines and assignments.</p>
        </div>
        <button onClick={() => { setIsCreating(!isCreating); setEditingId(null); setForm({ title: '', day: 'Monday', time: '', room: '', teacher: '' }); }} className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">
          {isCreating ? 'Cancel' : 'Add Class'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleAddClass} className="mb-6 rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
          <h3 className="text-lg font-semibold text-white">Create New Class</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Title / Subject</span>
              <input required type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. Algebra II" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Day</span>
              <select required value={form.day} onChange={e => setForm({...form, day: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Time</span>
              <input required type="text" value={form.time} onChange={e => setForm({...form, time: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. 09:00 AM" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Room</span>
              <input required type="text" value={form.room} onChange={e => setForm({...form, room: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. Room 201" />
            </label>
            <label className="block sm:col-span-2 lg:col-span-1">
              <span className="text-xs font-semibold text-slate-300">Teacher</span>
              <select required value={form.teacher} onChange={e => setForm({...form, teacher: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none">
                <option value="">Select Teacher...</option>
                {teachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </label>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={isPending} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">Add Class</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-900 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Class / Subject</th>
              <th className="px-4 py-3 font-medium">Day</th>
              <th className="px-4 py-3 font-medium">Time</th>
              <th className="px-4 py-3 font-medium">Room</th>
              <th className="px-4 py-3 font-medium">Teacher</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {initialClasses.map((cls) => (
              <tr key={cls.id} className="transition hover:bg-slate-900/50">
                {editingId === cls.id ? (
                  <>
                    <td className="px-4 py-3"><input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full min-w-[120px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" /></td>
                    <td className="px-4 py-3">
                      <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="w-full min-w-[100px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none">
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3"><input type="text" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full min-w-[100px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" /></td>
                    <td className="px-4 py-3"><input type="text" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} className="w-full min-w-[100px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" /></td>
                    <td className="px-4 py-3">
                      <select required value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} className="w-full min-w-[100px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none">
                        <option value="">Select...</option>
                        {teachers.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => handleSaveClass(cls.id)} disabled={isPending} className="rounded-lg bg-sky-500 px-3 py-1 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50">Save</button>
                      <button onClick={() => setEditingId(null)} disabled={isPending} className="rounded-lg border border-slate-600 px-3 py-1 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 font-semibold text-white">{cls.title}</td>
                    <td className="px-4 py-3">{cls.day}</td>
                    <td className="px-4 py-3">{cls.time}</td>
                    <td className="px-4 py-3">{cls.room}</td>
                    <td className="px-4 py-3">{cls.teacher}</td>
                    <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                      <button onClick={() => handleEditClass(cls)} className="text-sky-400 hover:text-sky-300">Edit</button>
                      <button onClick={() => handleDeleteClass(cls.id)} className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {initialClasses.length === 0 && <tr><td colSpan={6} className="py-6 text-center text-slate-500">No classes found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}