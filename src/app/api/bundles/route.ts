
// Example API route: src/app/api/bundles/route.ts
import { supabaseAdmin } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import type { DataBundle } from '@/lib/types'; // Assuming your type definition

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('DataBundles') // Ensure table name matches your SQL schema
      .select('*')
      .eq('is_active', true) // Example: only fetch active bundles
      .order('price', { ascending: true }); // Example: order by price

    if (error) {
      console.error('Supabase error fetching bundles:', error);
      throw error;
    }

    // Map Supabase data to your DataBundle type if necessary, or ensure types_db.ts is accurate
    const bundles: DataBundle[] = data.map(item => ({
        id: item.id,
        name: item.name,
        dataAmount: item.data_amount, // snake_case from DB to camelCase in type
        price: item.price,
        validityPeriodDays: item.validity_period_days,
        isActive: item.is_active ?? true, // Handle potential null from DB
        description: item.description || undefined,
    }));

    return NextResponse.json(bundles);

  } catch (error: any) {
    console.error('API /bundles error:', error);
    return NextResponse.json({ error: 'Failed to fetch data bundles', details: error.message }, { status: 500 });
  }
}
