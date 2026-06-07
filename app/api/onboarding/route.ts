import { NextResponse } from 'next/server';
import { onboardTenant } from '../../../lib/school';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, city, description, plan, adminEmail, adminPassword } = body;

    if (!name || !slug || !adminEmail || !adminPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const tenant = await onboardTenant({
      name,
      slug,
      city,
      description,
      plan,
      adminEmail,
      adminPassword,
    });

    return NextResponse.json(tenant, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}