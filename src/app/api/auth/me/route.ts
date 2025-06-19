
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '@/lib/supabase-server';
import type { User as AppUser } from '@/lib/types';
import type { Database } from '@/lib/types_db';

type UserTableRow = Database['public']['Tables']['Users']['Row'];

interface DecodedToken {
  userId: string; // Or number, depending on your Users table PK type
  email: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
}

export async function GET(request: NextRequest) {
  try {
    const tokenCookie = request.cookies.get('auth_token');

    if (!tokenCookie || !tokenCookie.value) {
      return NextResponse.json({ error: 'Not authenticated: No token' }, { status: 401 });
    }

    const token = tokenCookie.value;
    let decoded: DecodedToken;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    } catch (err) {
      console.error('JWT verification failed:', err);
      // Clear invalid cookie
      const clearCookieResponse = NextResponse.json({ error: 'Not authenticated: Invalid token' }, { status: 401 });
      clearCookieResponse.cookies.set('auth_token', '', { expires: new Date(0), path: '/' });
      return clearCookieResponse;
    }
    
    // User ID from token might be string or number. Adjust based on your Users table PK type.
    // Assuming User table id is integer for this example.
    const userIdAsNumber = parseInt(decoded.userId, 10);
    if (isNaN(userIdAsNumber)) {
        return NextResponse.json({ error: 'Invalid user ID in token' }, { status: 400 });
    }

    const { data: dbUser, error: fetchError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userIdAsNumber) // Use the correct type for 'id'
      .single();

    if (fetchError || !dbUser) {
      console.error('Me - Supabase fetch user error or user not found:', fetchError);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    const typedDbUser = dbUser as UserTableRow;

    // Construct the AppUser object
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

    return NextResponse.json({ user: appUser });

  } catch (error: any) {
    console.error('/api/auth/me error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
