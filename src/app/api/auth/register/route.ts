
import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { name, email, phoneNumber, password } = await request.json();

    if (!name || !email || !phoneNumber || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    // Add more validation for email and phone number format if needed

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('users') // Ensure table name matches your SQL schema
      .select('email')
      .eq('email', email)
      .maybeSingle(); // Use maybeSingle to avoid error if no user found

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116: no rows found, which is good here
        console.error('Supabase check user error:', checkError);
        throw checkError;
    }
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert({
        name,
        email,
        phone_number: phoneNumber,
        password_hash: hashedPassword,
        role: 'agent',
        status: 'pending',
        subscription_status: 'none',
        is_approved: false,
        commission_balance: 0,
        // created_at and updated_at should be handled by database defaults/triggers
      })
      .select('id, name, email, role, status') // Select only non-sensitive fields
      .single();

    if (insertError) {
      console.error('Supabase insert user error:', insertError);
      return NextResponse.json({ error: 'Failed to register user', details: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Registration successful. Awaiting admin approval.', user: newUser }, { status: 201 });

  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred during registration.' }, { status: 500 });
  }
}
