import { getSubscriptionPlans } from '../../lib/school';
import OnboardingClient from './OnboardingClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const plans = await getSubscriptionPlans();
  return (
    <main className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-white">Order Subscription</h1>
        <p className="mt-2 text-slate-400">Fill up the form below to order your school management system.</p>
      </div>
      <Suspense fallback={<div className="text-slate-400">Loading form...</div>}>
        <OnboardingClient plans={plans} />
      </Suspense>
    </main>
  );
}