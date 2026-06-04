import { NextResponse } from 'next/server';
import { updateTenantStatus } from '../../../../../../lib/tenant';

export async function PATCH(request: Request, { params }: { params: { tenant: string } }) {
  const body = await request.json();
  const { status } = body;

  if (!status || !['active', 'pending', 'suspended'].includes(status)) {
    return NextResponse.json({ error: 'Status must be active, pending, or suspended.' }, { status: 400 });
  }

  const success = await updateTenantStatus(params.tenant, status as 'active' | 'pending' | 'suspended');

  if (!success) {
    return NextResponse.json({ error: 'Tenant not found or status update failed.' }, { status: 404 });
  }

  return NextResponse.json({ status });
}
