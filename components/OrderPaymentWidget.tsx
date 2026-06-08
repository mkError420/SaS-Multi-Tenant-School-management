'use client';

import { useEffect, useState } from 'react';

type PaymentMethod = {
  id: string;
  paymentOption: string;
  paymentNumber: string;
};

export default function OrderPaymentWidget({ supportPhone, supportEmail }: { supportPhone: string; supportEmail: string }) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/payment-methods')
      .then(res => res.json())
      .then(data => {
        setMethods(data.methods || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <h3 className="text-xl font-semibold text-white">Manual Payment</h3>
        <p className="mt-2 text-sm text-slate-400">Please manually send your subscription fee to one of the following numbers to complete your order.</p>
        
        {loading ? (
          <p className="mt-4 text-sm text-slate-500 animate-pulse">Loading secure payment methods...</p>
        ) : methods.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {methods.map(m => (
              <div key={m.id} className="rounded-2xl border border-slate-700 bg-slate-950 p-5">
                <p className="font-semibold text-sky-400">{m.paymentOption}</p>
                <p className="mt-3 text-sm text-white"><span className="text-slate-500">Number:</span> {m.paymentNumber}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-xl text-slate-500">
            <h2 className='text-pink-600 font-bold'>B-kash: <span className='text-white font-semibold'>01854-718767</span> <span className='text-gray-500 text-sm'>(Send Money Only)</span></h2>
            <h2 className='text-yellow-700 font-bold'>Nagad: <span className='text-white font-semibold'>01854-718767</span> <span className='text-gray-500 text-sm'>(Send Money Only)</span></h2> 
            <h2 className='text-purple-700 font-bold'>Rocket: <span className='text-white font-semibold'>01572-491828</span> <span className='text-gray-500 text-sm'>(Send Money Only)</span></h2>
          </p>
        )}
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-soft">
        <h3 className="text-lg font-semibold text-white">Need Help?</h3>
        <p className="mt-2 text-sm leading-6 text-slate-400">Contact our support team if you face any issues during the payment process.</p>
        <p className="mt-4 text-sm font-medium text-slate-300">Phone: <a href={`tel:${supportPhone}`} className="text-sky-400 hover:text-sky-300">{supportPhone}</a></p>
        <p className="mt-2 text-sm font-medium text-slate-300">Email: <a href={`mailto:${supportEmail}`} className="text-sky-400 hover:text-sky-300">{supportEmail}</a></p>
      </div>
    </div>
  );
}