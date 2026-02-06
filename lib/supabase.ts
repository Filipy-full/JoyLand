import { createClient } from '@supabase/supabase-js'


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
if (typeof window !== 'undefined') {
	// Só loga no client
	console.log('SUPABASE_URL:', supabaseUrl);
	console.log('SUPABASE_ANON_KEY:', supabaseAnonKey);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
