import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Signed out successfully.' });
  response.cookies.set({
    name: 'schoolspace_user',
    value: '',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return response;
}
