
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types_db';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// IMPORTANT: This service_role key should ONLY be used on the server-side (API routes).
// It bypasses Row Level Security. Ensure it's not exposed to the client.
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL for server client");
}
if (!supabaseServiceKey) {
  throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY for server client. Ensure this is set in your .env.local and deployment environment.");
}

// This client is for server-side (API routes) use.
// It uses the service_role key, which has admin-like privileges and bypasses RLS.
// Use with extreme caution.
export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  }
});
