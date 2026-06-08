import { getSubscriptionPlans, getPlatformSettings } from '../../lib/school';
import OnboardingClient from './OnboardingClient';
import OrderPaymentWidget from '../../components/OrderPaymentWidget';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const plans = await getSubscriptionPlans();
  const settings = await getPlatformSettings();
  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-white">Order Subscription</h1>
            <p className="mt-2 text-slate-400">Fill up the form below to order your school management system.</p>
          </div>
          <Suspense fallback={<div className="text-slate-400">Loading form...</div>}>
            <OnboardingClient plans={plans} />
          </Suspense>
        </div>
        
        <div>
          <OrderPaymentWidget supportPhone={settings.supportPhone} supportEmail={settings.supportEmail} />
        </div>
      </div>
    </main>
  );
}