import { NextResponse } from 'next/server';
import { signInUser } from '../../../../lib/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body;

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
  }

  try {
    const user = await signInUser(email, password);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    const response = NextResponse.json({ message: 'Authentication successful.', user: { email: user.email, tenantSlug: user.tenantSlug, role: user.role } });
    response.cookies.set({
      name: 'schoolspace_user',
      value: JSON.stringify({ email: user.email, tenantSlug: user.tenantSlug, role: user.role }),
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Authentication failed.' }, { status: 500 });
  }
}
