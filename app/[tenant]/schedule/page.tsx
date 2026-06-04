import { notFound } from 'next/navigation';
import { getTenantBySlug } from '../../../lib/tenant';
import { getTenantSchedule } from '../../../lib/school';

type Props = {
  params: {
    tenant: string;
  };
};

export default async function SchedulePage({ params }: Props) {
  const tenant = await getTenantBySlug(params.tenant);
  if (!tenant) {
    notFound();
  }

  const schedule = await getTenantSchedule(params.tenant);

  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Class scheduling</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">Weekly schedule</h1>
          <p className="mt-2 text-slate-400">Plan classes and room assignments for teachers and students at {tenant.name}.</p>
        </div>
        <button className="rounded-2xl bg-violet-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-violet-400">
          Add schedule
        </button>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {schedule.map((item) => (
          <div key={item.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-slate-500">{item.day}</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{item.title}</h2>
              </div>
              <span className="rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-300">{item.time}</span>
            </div>
            <div className="mt-4 space-y-2 text-slate-300">
              <p>{item.teacher}</p>
              <p>{item.room}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
