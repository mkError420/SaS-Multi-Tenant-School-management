import { notFound } from 'next/navigation';
import { getTenantBySlug } from '../../../lib/tenant';
import { getTenantTeachers } from '../../../lib/school';

type Props = {
  params: {
    tenant: string;
  };
};

export default async function TeachersPage({ params }: Props) {
  const tenant = await getTenantBySlug(params.tenant);
  if (!tenant) {
    notFound();
  }

  const teachers = await getTenantTeachers(params.tenant);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Teacher management</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Staff directory</h1>
          <p className="mt-2 text-slate-400">View teacher assignments and contact data for the {tenant.name} staff.</p>
        </div>
        <button className="rounded-2xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
          Add teacher
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
        <table className="min-w-full divide-y divide-slate-800 text-sm text-left">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-6 py-4">Teacher</th>
              <th className="px-6 py-4">Subject</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="border-b border-slate-800 last:border-none">
                <td className="px-6 py-4 text-slate-100">{teacher.name}</td>
                <td className="px-6 py-4 text-slate-300">{teacher.subject}</td>
                <td className="px-6 py-4 text-slate-300">{teacher.email}</td>
                <td className="px-6 py-4 text-slate-300">{teacher.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
