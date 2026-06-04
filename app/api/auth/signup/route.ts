import { NextResponse } from 'next/server';
import { signUpUser } from '../../../../lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, tenantSlug, role } = body;

  if (!email || !password || !tenantSlug) {
    return NextResponse.json({ error: 'Email, password, and tenant slug are required.' }, { status: 400 });
  }

  try {
    const user = await signUpUser(email, password, tenantSlug, role || 'admin');
    return NextResponse.json({ message: 'User registered successfully.', user: { email: user.email, tenantSlug: user.tenantSlug, role: user.role } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Registration failed.' }, { status: 500 });
  }
}
