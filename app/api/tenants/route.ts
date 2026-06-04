import { NextResponse } from 'next/server';
import { getAllTenants } from '../../../lib/tenant';

export async function GET() {
  const tenants = await getAllTenants();
  return NextResponse.json(tenants);
}
