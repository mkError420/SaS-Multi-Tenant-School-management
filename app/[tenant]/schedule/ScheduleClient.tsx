'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addScheduleAction, updateScheduleAction, deleteScheduleAction } from './actions';
import type { ScheduleItem } from '../../../lib/school';
import type { Tenant } from '../../../lib/tenant';

export default function ScheduleClient({
  schedule,
  tenant,
}: {
  schedule: ScheduleItem[];
  tenant: Tenant;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(null);
  const [form, setForm] = useState({ day: '', title: '', time: '', teacher: '', room: '' });

  const handleOpenAdd = () => {
    setEditingSchedule(null);
    setForm({ day: 'Monday', title: '', time: '', teacher: '', room: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ScheduleItem) => {
    setEditingSchedule(item);
    setForm({ day: item.day, title: item.title, time: item.time, teacher: item.teacher, room: item.room });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (editingSchedule) {
        const res = await updateScheduleAction(tenant.slug, editingSchedule.id, form);
        if (res.success) {
          setIsModalOpen(false);
          router.refresh();
        } else {
          alert(res.error);
        }
      } else {
        const res = await addScheduleAction(tenant.slug, form);
        if (res.success) {
          setIsModalOpen(false);
          router.refresh();
        } else {
          alert(res.error);
        }
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this schedule item?')) {
      startTransition(async () => {
        await deleteScheduleAction(tenant.slug, id);
        router.refresh();
      });
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Class scheduling</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Weekly schedule</h1>
            <p className="mt-2 text-slate-400">Plan classes and room assignments for teachers and students at {tenant.name}.</p>
          </div>
          <button onClick={handleOpenAdd} className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-400">
            + Add schedule
          </button>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Day</th>
                <th className="px-6 py-4 font-medium">Time</th>
                <th className="px-6 py-4 font-medium">Class/Subject</th>
                <th className="px-6 py-4 font-medium">Teacher</th>
                <th className="px-6 py-4 font-medium">Room</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {schedule.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/50 transition">
                  <td className="px-6 py-4 font-medium text-white">{item.day}</td>
                  <td className="px-6 py-4">{item.time}</td>
                  <td className="px-6 py-4">{item.title}</td>
                  <td className="px-6 py-4">{item.teacher}</td>
                  <td className="px-6 py-4">{item.room}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleOpenEdit(item)} disabled={isPending} className="mr-3 text-xs font-medium text-sky-400 hover:text-sky-300 disabled:opacity-50">Edit</button>
                    <button onClick={() => handleDelete(item.id)} disabled={isPending} className="text-red-400 hover:text-red-300 disabled:opacity-50 text-xs font-medium">Delete</button>
                  </td>
                </tr>
              ))}
              {schedule.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500">No schedule found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">{editingSchedule ? 'Edit Schedule Item' : 'Add New Schedule Item'}</h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Day</span>
                  <select required value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none">
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Time</span>
                  <input required type="text" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. 09:00 - 10:00" />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-semibold text-slate-200">Class/Subject</span>
                <input required type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. Mathematics" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Teacher</span>
                  <input required type="text" value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. Mr. Brooks" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Room</span>
                  <input required type="text" value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. Room 101" />
                </label>
              </div>
              <div className="pt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isPending} className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isPending} className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50">{isPending ? 'Saving...' : 'Save Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}