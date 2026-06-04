import { notFound } from 'next/navigation';
import { getTenantBySlug } from '../../../lib/tenant';
import { getTenantStudents } from '../../../lib/school';

type Props = {
  params: {
    tenant: string;
  };
};

export default async function StudentsPage({ params }: Props) {
  const tenant = await getTenantBySlug(params.tenant);
  if (!tenant) {
    notFound();
  }

  const students = await getTenantStudents(params.tenant);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Student management</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Class roster</h1>
          <p className="mt-2 text-slate-400">Monitor student enrollment and active student status for {tenant.name}.</p>
        </div>
        <button className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
          Add student
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Grade</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Enrolled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {students.map((student) => (
              <tr key={student.id} className="border-b border-slate-800 last:border-none">
                <td className="px-6 py-4 text-slate-100">{student.name}</td>
                <td className="px-6 py-4 text-slate-300">{student.grade}</td>
                <td className="px-6 py-4 text-slate-300">{student.status}</td>
                <td className="px-6 py-4 text-slate-300">{student.enrolled}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
