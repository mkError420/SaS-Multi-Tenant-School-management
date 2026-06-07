import { NextResponse } from 'next/server';
import { onboardTenant } from '../../../lib/school';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, city, description, plan, adminEmail, adminPassword, phone, authorityName } = body;

    if (!name || !slug || !adminEmail || !adminPassword || !phone || !authorityName) {
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
      phone,
      authorityName,
    });

    return NextResponse.json(tenant, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}