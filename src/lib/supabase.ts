import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wxgnicuupyoorvqddgmd.supabase.co';
const supabaseAnonKey = 'sb_publishable_Mx5jj2SR5Qr6jJm0esq4lQ_HIrny8cN';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
