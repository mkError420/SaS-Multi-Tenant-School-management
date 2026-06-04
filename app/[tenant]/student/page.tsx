import { notFound } from 'next/navigation';
import { getTenantBySlug } from '../../../lib/tenant';
import { getStudentPortalData, StudentPortalData } from '../../../lib/school';

type Props = {
  params: {
    tenant: string;
  };
};

export default async function StudentPage({ params }: Props) {
  const tenant = await getTenantBySlug(params.tenant);
  if (!tenant) {
    notFound();
  }

  const portal: StudentPortalData = await getStudentPortalData(params.tenant);

  return (
    <section className="space-y-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Student portal</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Student ID {portal.studentId}</h1>
        <p className="mt-2 text-slate-400">View grades, attendance, and fee status for your student profile.</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-3xl bg-slate-950 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Class</p>
          <p className="mt-3 text-lg font-semibold text-white">{portal.className}</p>
          <p className="mt-1 text-slate-400">Section {portal.section}</p>
        </div>
        <div className="rounded-3xl bg-slate-950 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Attendance</p>
          <p className="mt-3 text-lg font-semibold text-white">{portal.attendancePct}%</p>
        </div>
        <div className="rounded-3xl bg-slate-950 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Fee paid</p>
          <p className="mt-3 text-lg font-semibold text-white">${portal.feeStatus.paid}</p>
        </div>
        <div className="rounded-3xl bg-slate-950 p-6">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Fee due</p>
          <p className="mt-3 text-lg font-semibold text-white">${portal.feeStatus.due}</p>
        </div>
      </div>

      <div className="rounded-3xl bg-slate-950 p-6">
        <h2 className="text-xl font-semibold text-white">Recent results</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {portal.results.map((result: { subject: string; score: string; grade: string }) => (
            <div key={result.subject} className="rounded-3xl bg-slate-900 p-4">
              <p className="text-sm text-slate-400">{result.subject}</p>
              <div className="mt-2 flex items-center justify-between gap-4">
                <p className="text-lg font-semibold text-white">{result.score}</p>
                <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">{result.grade}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
