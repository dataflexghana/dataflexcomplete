import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import type { User as AppUser } from '@/lib/types';
import type { Database } from '@/lib/types_db';

type UserTableRow = Database['public']['Tables']['Users']['Row'];

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    console.log('📥 Login attempt with:', { email, password });

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    // 🔄 Fetch user with matching email and password
    const { data: dbUser, error: fetchError } = await supabaseAdmin
      .from('users') // ← all lowercase
      .select('*')
      .eq('email', email)
      .eq('password', password) // ✅ match plain-text password column
      .eq('role', 'admin')
      .single();

    if (fetchError || !dbUser) {
      console.error('❌ Supabase fetch error or user not found:', fetchError);
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const typedDbUser = dbUser as UserTableRow;

    const appUser: AppUser = {
      id: typedDbUser.id.toString(),
      name: typedDbUser.name,
      email: typedDbUser.email,
      phoneNumber: typedDbUser.phone_number || undefined,
      role: typedDbUser.role as AppUser['role'],
      status: typedDbUser.status as AppUser['status'] || undefined,
      subscriptionStatus: typedDbUser.subscription_status as AppUser['subscriptionStatus'] || undefined,
      subscriptionExpiryDate: typedDbUser.subscription_expiry_date,
      isApproved: typedDbUser.is_approved || false,
      commissionBalance: typedDbUser.commission_balance || 0,
      lastDismissedGlobalMessageId: typedDbUser.last_dismissed_global_message_id || undefined,
    };

    const token = jwt.sign(
      {
        userId: appUser.id,
        email: appUser.email,
        role: appUser.role,
        name: appUser.name,
      },
      process.env.JWT_SECRET!,
      { expiresIn: '1d' }
    );

    console.log('✅ Login successful. AppUser:', appUser);
    console.log('🪙 JWT Token:', token);

    const response = NextResponse.json({ user: appUser });

    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: false, // ✅ keep false for local dev
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
  } catch (error: any) {
    console.error('🔥 Login API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during login.' }, { status: 500 });
  }
}
