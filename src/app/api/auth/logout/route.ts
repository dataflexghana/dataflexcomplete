
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Logged out successfully' });
    
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'lax',
      path: '/',
      expires: new Date(0), // Expire the cookie immediately
    });

    return response;
  } catch (error: any) {
    console.error('Logout API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during logout.' }, { status: 500 });
  }
}
