import { NextResponse } from 'next/server';
import { onboardTenant } from '../../../lib/school';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, slug, city, description, plan, adminEmail, adminPassword } = body;

  if (!name || !slug || !city || !description || !plan || !adminEmail || !adminPassword) {
    return NextResponse.json({ error: 'All onboarding fields are required.' }, { status: 400 });
  }

  try {
    const tenant = await onboardTenant({ name, slug, city, description, plan, adminEmail, adminPassword });
    return NextResponse.json({ message: 'Tenant created successfully.', tenant });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Onboarding failed.' }, { status: 500 });
  }
}
