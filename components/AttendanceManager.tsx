'use client';

import { useState, useTransition } from 'react';
import type { AttendanceRecord, Student } from '../lib/school';
import { addAttendanceAction, editAttendanceAction, removeAttendanceAction } from '../app/[tenant]/attendance-actions';
import { useRouter } from 'next/navigation';

type Props = {
  tenantSlug: string;
  initialRecords: AttendanceRecord[];
  students: Student[];
};

export default function AttendanceManager({ tenantSlug, initialRecords, students }: Props) {
  const [isPending, startTransition] = useTransition();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();
  
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({ studentId: '', studentName: '', date: today, status: 'Present' });

  const handleStudentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const student = students.find(s => s.id === selectedId);
    setForm({ ...form, studentId: selectedId, studentName: student ? student.name : '' });
  };

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await addAttendanceAction(tenantSlug, form.studentId, form.studentName, form.date, form.status);
      if (res.success) {
        setIsCreating(false);
        setForm({ studentId: '', studentName: '', date: today, status: 'Present' });
        router.refresh(); 
      } else {
        alert(res.error);
      }
    });
  };

  const handleEditRecord = (r: AttendanceRecord) => {
    setEditingId(r.id);
    setForm({ studentId: r.studentId, studentName: r.studentName, date: r.date, status: r.status });
  };

  const handleSaveRecord = (id: string) => {
    startTransition(async () => {
      const res = await editAttendanceAction(tenantSlug, id, form.studentId, form.studentName, form.date, form.status);
      if (res.success) {
        setEditingId(null);
        setForm({ studentId: '', studentName: '', date: today, status: 'Present' });
        router.refresh();
      } else {
        alert(res.error);
      }
    });
  };

  const handleDeleteRecord = (id: string) => {
    if (!confirm('Are you sure you want to remove this attendance record?')) return;
    startTransition(async () => {
      const res = await removeAttendanceAction(tenantSlug, id);
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
          <h2 className="text-xl font-semibold text-white">Attendance Records</h2>
          <p className="mt-1 text-sm text-slate-400">Track and manage student daily attendance.</p>
        </div>
        <button onClick={() => { setIsCreating(!isCreating); setEditingId(null); setForm({ studentId: '', studentName: '', date: today, status: 'Present' }); }} className="rounded-lg bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400">
          {isCreating ? 'Cancel' : 'Record Attendance'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleAddRecord} className="mb-6 rounded-2xl border border-slate-800 bg-slate-950 p-5 space-y-4">
          <h3 className="text-lg font-semibold text-white">Add Attendance Record</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Date</span>
              <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none" />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Student</span>
              <select required value={form.studentId} onChange={handleStudentChange} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none">
                <option value="">Select Student...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} (Grade: {s.grade})</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-slate-300">Status</span>
              <select required value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none">
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
                <option value="Excused">Excused</option>
              </select>
            </label>
          </div>
          <div className="flex justify-end pt-2">
            <button type="submit" disabled={isPending || !form.studentId} className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50">Save Record</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="border-b border-slate-800 bg-slate-900 text-slate-400">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Student Name</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {initialRecords.map((r) => (
              <tr key={r.id} className="transition hover:bg-slate-900/50">
                {editingId === r.id ? (
                  <>
                    <td className="px-4 py-3"><input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full min-w-[120px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none" /></td>
                    <td className="px-4 py-3"><select required value={form.studentId} onChange={handleStudentChange} className="w-full min-w-[150px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none"><option value={r.studentId}>{r.studentName}</option>{students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></td>
                    <td className="px-4 py-3"><select required value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full min-w-[100px] rounded-lg border border-slate-600 bg-slate-900 px-3 py-1 text-sm text-white focus:border-sky-500 focus:outline-none"><option value="Present">Present</option><option value="Absent">Absent</option><option value="Late">Late</option><option value="Excused">Excused</option></select></td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => handleSaveRecord(r.id)} disabled={isPending} className="rounded-lg bg-sky-500 px-3 py-1 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50">Save</button>
                      <button onClick={() => setEditingId(null)} disabled={isPending} className="rounded-lg border border-slate-600 px-3 py-1 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50">Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-semibold text-white">{r.studentName}</td>
                    <td className="px-4 py-3"><span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${r.status === 'Present' ? 'bg-emerald-500/10 text-emerald-400' : r.status === 'Absent' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>{r.status}</span></td>
                    <td className="px-4 py-3 text-right space-x-3 whitespace-nowrap">
                      <button onClick={() => handleEditRecord(r)} className="text-sky-400 hover:text-sky-300">Edit</button>
                      <button onClick={() => handleDeleteRecord(r.id)} className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {initialRecords.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-slate-500">No attendance records found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}