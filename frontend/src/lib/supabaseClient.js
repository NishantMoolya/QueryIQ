import { createClient } from '@supabase/supabase-js';

// these should be public anon keys, safe for client use
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a single reusable instance for the entire app
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
