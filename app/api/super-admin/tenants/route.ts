import { NextResponse } from 'next/server';
import { getAllTenants } from '../../../../lib/tenant';

export async function GET() {
  try {
    const tenants = await getAllTenants();
    return NextResponse.json({ tenants });
  } catch (error) {
    console.error('Failed to load super-admin tenants:', error);
    return NextResponse.json({ error: 'Failed to load tenants.' }, { status: 500 });
  }
}
