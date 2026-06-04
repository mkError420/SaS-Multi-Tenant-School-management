'use client';

import { useState } from 'react';

type Props = {
  slug: string;
  currentStatus: 'active' | 'pending' | 'suspended';
};

const statusLabels = {
  active: 'Active',
  pending: 'Pending',
  suspended: 'Suspended',
};

const statusClasses = {
  active: 'bg-emerald-500 text-slate-950',
  pending: 'bg-amber-500 text-slate-950',
  suspended: 'bg-rose-500 text-slate-950',
};

export default function TenantStatusButton({ slug, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleStatusChange = async (newStatus: 'active' | 'pending' | 'suspended') => {
    if (newStatus === status) return;
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/super-admin/tenants/${slug}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.error || 'Unable to update status.');
      } else {
        setStatus(newStatus);
        setMessage(`Status updated to ${statusLabels[newStatus]}.`);
      }
    } catch (error) {
      setMessage('Network error updating status.');
    }

    setLoading(false);
  };

  return (
    <div className="space-y-3 rounded-3xl border border-slate-800 bg-slate-950/80 p-4">
      <div className="flex items-center justify-between gap-4">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${statusClasses[status]}`}>
          {statusLabels[status]}
        </span>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-500">Tenant status</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {(['active', 'pending', 'suspended'] as const).map((option) => (
          <button
            key={option}
            disabled={loading}
            onClick={() => handleStatusChange(option)}
            className={`rounded-2xl px-3 py-2 text-xs font-semibold transition ${option === status ? 'bg-slate-200 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          >
            {statusLabels[option]}
          </button>
        ))}
      </div>
      {message ? <p className="text-xs text-slate-400">{message}</p> : null}
    </div>
  );
}
