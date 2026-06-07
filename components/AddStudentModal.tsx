'use client';

import { useMemo, useState } from 'react';

export type AddStudentPayload = {
  name: string;
  grade: string;
  status?: string;
  enrolled?: string;
  guardianName?: string;
  guardianPhone?: string;
  address?: string;
};

type Props = {
  tenantSlug: string;
};

function todayISODate() {
  // YYYY-MM-DD
  return new Date().toISOString().slice(0, 10);
}

export default function AddStudentModal({ tenantSlug, ...props }: Props) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [status, setStatus] = useState('Active');
  const [enrolled, setEnrolled] = useState(() => todayISODate());
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [address, setAddress] = useState('');

  const canSubmit = useMemo(() => name.trim().length > 0 && grade.trim().length > 0, [name, grade]);

  const submit = async () => {
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/tenants/${tenantSlug}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          {
            name: name.trim(),
            grade: grade.trim(),
            status: status?.trim() || 'Active',
            enrolled: enrolled?.trim() || todayISODate(),
            guardianName: guardianName.trim(),
            guardianPhone: guardianPhone.trim(),
            address: address.trim(),
          } satisfies AddStudentPayload,
        ),
      });

      const text = await res.text();
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        // ignore
      }

      if (!res.ok) {
        throw new Error(data?.error || 'Failed to add student.');
      }

      setOpen(false);
      // reset form lightly
      setName('');
      setGrade('');
      setStatus('Active');
      setEnrolled(todayISODate());
      setGuardianName('');
      setGuardianPhone('');
      setAddress('');

      // Trigger refresh from client (avoid passing function props from Server -> Client)
      window.location.reload();
    } catch (e) {
      setError((e as Error).message || 'Failed to add student.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError(null);
        }}
        className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
      >
        Add student
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Student management</p>
                <h2 className="mt-3 text-2xl font-semibold text-white">Add new student</h2>
                <p className="mt-2 text-sm text-slate-400">Add the student to {tenantSlug} roster.</p>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 grid gap-4">
              {error ? <p className="text-sm text-rose-400">{error}</p> : null}

              <label className="grid gap-2 text-sm text-slate-300">
                Student name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                Guardian Name
                <input
                  value={guardianName}
                  onChange={(e) => setGuardianName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                Guardian Phone
                <input
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder="e.g. +8801700000000"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                Address
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 123 Main St, City"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                Grade
                <input
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. 7"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                Status
                <input
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="Active / On leave"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none"
                />
              </label>

              <label className="grid gap-2 text-sm text-slate-300">
                Enrolled date
                <input
                  type="date"
                  value={enrolled}
                  onChange={(e) => setEnrolled(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 focus:border-sky-500 focus:outline-none"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={submitting}
                className="rounded-2xl border border-slate-700 bg-slate-950 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-500 hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={submit}
                disabled={!canSubmit || submitting}
                className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Adding…' : 'Add student'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
