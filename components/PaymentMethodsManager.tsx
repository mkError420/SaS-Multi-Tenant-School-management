'use client';

import { useState, useEffect } from 'react';

type PaymentMethod = {
  id: string;
  paymentOption: string;
  paymentNumber: string;
  isActive: boolean;
};

export default function PaymentMethodsManager() {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ paymentOption: '', paymentNumber: '' });

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    setLoading(true);
    const res = await fetch('/api/super-admin/payment-methods');
    if (res.ok) {
      const data = await res.json();
      setMethods(data.methods || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/super-admin/payment-methods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ paymentOption: '', paymentNumber: '' });
    fetchMethods();
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await fetch(`/api/super-admin/payment-methods/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !currentStatus })
    });
    fetchMethods();
  };

  const deleteMethod = async (id: string) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      await fetch(`/api/super-admin/payment-methods/${id}`, { method: 'DELETE' });
      fetchMethods();
    }
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft sm:p-8">
      <div>
        <h2 className="text-2xl font-semibold text-white">Manual Payment Systems</h2>
        <p className="mt-2 text-sm text-slate-400">Configure manual payment options for new subscriptions.</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2 rounded-2xl bg-slate-950 p-6">
        <label className="block text-sm text-slate-300">
          Payment Option (e.g. bKash, Rocket, Bank)
          <input required type="text" value={form.paymentOption} onChange={e => setForm({...form, paymentOption: e.target.value})} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 focus:border-sky-500 focus:outline-none" />
        </label>
        <label className="block text-sm text-slate-300">
          Payment Number
          <input required type="text" value={form.paymentNumber} onChange={e => setForm({...form, paymentNumber: e.target.value})} className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 focus:border-sky-500 focus:outline-none" />
        </label>
        <div className="sm:col-span-2 text-right mt-2">
          <button type="submit" className="rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">Add Payment Option</button>
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {loading ? <p className="text-sm text-slate-500">Loading options...</p> : methods.length === 0 ? <p className="text-sm text-slate-500">No payment options found.</p> : null}
        {methods.map((method) => (
          <div key={method.id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div>
              <p className="font-semibold text-white">{method.paymentOption}</p>
              <p className="mt-1 text-sm text-slate-400">{method.paymentNumber}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => toggleActive(method.id, method.isActive)} className={`rounded-xl px-4 py-2 text-xs font-semibold ${method.isActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-400'}`}>
                {method.isActive ? 'Active' : 'Disabled'}
              </button>
              <button onClick={() => deleteMethod(method.id)} className="rounded-xl border border-rose-900 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/20">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}