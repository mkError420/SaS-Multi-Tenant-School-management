'use server';

import { signInUser } from '../../lib/auth';
import { cookies } from 'next/headers';

export type LoginResponse = 
  | { success: true; user: { id: string; email: string; role: string; tenantSlug: string } }
  | { error: string };

export async function loginAction(email: string, password: string): Promise<LoginResponse> {
  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    const user = await signInUser(email, password);

    if (!user) {
      return { error: 'Invalid email or password.' };
    }

    // Remove sensitive data (passwordHash) and non-serializable Mongo _id
    const safeUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantSlug: user.tenantSlug,
    };

    cookies().set('schoolspace_user', JSON.stringify(safeUser), {
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true, user: safeUser };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Internal server error' };
  }
}