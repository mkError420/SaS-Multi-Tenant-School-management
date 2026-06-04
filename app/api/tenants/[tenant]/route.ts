import { NextResponse } from 'next/server';
import { getTenantBySlug } from '../../../../lib/tenant';

export async function GET(
  _: Request,
  { params }: { params: { tenant: string } },
) {
  const tenant = await getTenantBySlug(params.tenant);
  if (!tenant) {
    return NextResponse.json({ error: 'Tenant not found' }, { status: 404 });
  }
  return NextResponse.json(tenant);
}
