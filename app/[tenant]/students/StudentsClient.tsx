'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addStudentAction, updateStudentAction, deleteStudentAction } from '../student-actions';
import type { Student } from '../../../lib/school';
import type { Tenant } from '../../../lib/tenant';

export default function StudentsClient({
  students,
  tenant,
}: {
  students: Student[];
  tenant: Tenant;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [form, setForm] = useState({ name: '', grade: '', status: 'Active', enrolled: new Date().toISOString().split('T')[0], guardianName: '', guardianPhone: '', address: '' });
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setForm({ name: '', grade: '', status: 'Active', enrolled: new Date().toISOString().split('T')[0], guardianName: '', guardianPhone: '', address: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setForm({ name: student.name, grade: student.grade, status: student.status, enrolled: student.enrolled, guardianName: student.guardianName || '', guardianPhone: student.guardianPhone || '', address: student.address || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      if (editingStudent) {
        updateStudentAction(tenant.slug, editingStudent.id, form.name, form.grade, form.status, form.enrolled, form.guardianName, form.guardianPhone, form.address).then(() => {
          setIsModalOpen(false);
          router.refresh();
        });
      } else {
        addStudentAction(tenant.slug, form.name, form.grade, form.status, form.enrolled, form.guardianName, form.guardianPhone, form.address).then(() => {
          setIsModalOpen(false);
          router.refresh();
        });
      }
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this student record?')) {
      startTransition(() => {
        deleteStudentAction(tenant.slug, id).then(() => {
          router.refresh();
        });
      });
    }
  };

  const filteredStudents = students.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.grade.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Main Table Section */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Student Records</p>
            <h1 className="mt-3 text-3xl font-semibold text-white">Student Management</h1>
            <p className="mt-2 text-slate-400">Manage all student enrollments, grades, and statuses.</p>
          </div>
          <button onClick={handleOpenAdd} className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            + Add Student
          </button>
        </div>

        <div className="mt-6">
          <input
            type="text"
            placeholder="Search by name or grade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-sm rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
          />
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-slate-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Student Name</th>
                  <th className="px-6 py-4 font-medium">Grade/Class</th>
                  <th className="px-6 py-4 font-medium">Enrollment Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b border-slate-800 last:border-none hover:bg-slate-900/50 transition">
                    <td className="px-6 py-4 font-medium text-white">
                      {student.name}
                      {student.guardianName && (
                        <div className="mt-1 text-xs font-normal text-slate-500">Guardian: {student.guardianName}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-300">{student.grade}</td>
                    <td className="px-6 py-4 text-slate-300">{student.enrolled}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${student.status.toLowerCase() === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => handleOpenEdit(student)} disabled={isPending} className="mr-3 text-xs font-medium text-sky-400 hover:text-sky-300 disabled:opacity-50">Edit</button>
                      <button onClick={() => handleDelete(student.id)} disabled={isPending} className="text-red-400 hover:text-red-300 disabled:opacity-50 text-xs font-medium">Delete</button>
                    </td>
                  </tr>
                ))}
                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">No students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add/Edit Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">{editingStudent ? 'Edit Student' : 'Add New Student'}</h2>
                <p className="mt-1 text-sm text-slate-400">{editingStudent ? 'Update student details.' : 'Enroll a new student.'}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-200">Student Name</span>
                <input required type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. John Doe" />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Guardian Name</span>
                  <input required type="text" value={form.guardianName} onChange={(e) => setForm({ ...form, guardianName: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. Jane Doe" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Guardian Phone</span>
                  <input required type="text" value={form.guardianPhone} onChange={(e) => setForm({ ...form, guardianPhone: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. +8801700000000" />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-200">Address</span>
                <input required type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. 123 Main St, City" />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Grade/Class</span>
                  <input required type="text" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" placeholder="e.g. 10th Grade" />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-slate-200">Status</span>
                  <select required value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="On leave">On leave</option>
                    <option value="Graduated">Graduated</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-slate-200">Enrollment Date</span>
                <input required type="date" value={form.enrolled} onChange={(e) => setForm({ ...form, enrolled: e.target.value })} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white focus:border-sky-500 focus:outline-none" />
              </label>

              <div className="pt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} disabled={isPending} className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-900 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isPending} className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-50">{isPending ? 'Saving...' : 'Save Student'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}