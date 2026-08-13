import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://qjhrlqpsfzaycoaekwqh.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_c0x3S20RA_xIVMed3cPpFQ_kO1XXul6';

export const supabase = createClient(supabaseUrl, supabaseKey);
