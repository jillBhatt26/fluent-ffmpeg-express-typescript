import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_PROJECT_API_KEY, SUPABASE_PROJECT_URL } from './env.config';

const supabase: SupabaseClient = createClient(
    SUPABASE_PROJECT_URL,
    SUPABASE_PROJECT_API_KEY
);

export { supabase };
