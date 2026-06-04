import { notFound } from 'next/navigation';
import { getTenantBySlug } from '../../../lib/tenant';
import { getTeacherPortalData, TeacherPortalData } from '../../../lib/school';

type Props = {
  params: {
    tenant: string;
  };
};

export default async function TeacherPage({ params }: Props) {
  const tenant = await getTenantBySlug(params.tenant);
  if (!tenant) {
    notFound();
  }

  const portal: TeacherPortalData = await getTeacherPortalData(params.tenant);

  return (
    <section className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Teacher portal</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">{tenant.name} classroom tools</h1>
        <p className="mt-2 text-slate-400">Manage attendance, gradebooks, and homework assignments from a teacher-friendly portal.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-3xl bg-slate-950 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Attendance</p>
          <p className="mt-4 text-3xl font-semibold text-white">{portal.attendanceRate}</p>
          <p className="mt-2 text-slate-400">Today’s attendance rate for classes.</p>
        </div>
        <div className="rounded-3xl bg-slate-950 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Classes today</p>
          <p className="mt-4 text-3xl font-semibold text-white">{portal.classesToday}</p>
          <p className="mt-2 text-slate-400">Your teaching schedule for the day.</p>
        </div>
        <div className="rounded-3xl bg-slate-950 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Pending homework</p>
          <p className="mt-4 text-3xl font-semibold text-white">{portal.pendingHomework}</p>
          <p className="mt-2 text-slate-400">Assignments waiting for review or publication.</p>
        </div>
      </div>

      <div className="rounded-3xl bg-slate-950 p-6">
        <h2 className="text-xl font-semibold text-white">Gradebook entries</h2>
        <div className="mt-6 space-y-4">
          {portal.gradebookEntries.map((entry: { course: string; dueDate: string; status: string }) => (
            <div key={entry.course} className="rounded-3xl bg-slate-900 p-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-semibold text-white">{entry.course}</p>
                <span className="text-sm text-slate-400">{entry.status}</span>
              </div>
              <p className="mt-2 text-slate-300">Due {entry.dueDate}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
