// supabaseClient.js
import 'dotenv/config'; // <-- ensures .env is loaded no matter who imports first
import { createClient } from '@supabase/supabase-js';

const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

if (!SUPABASE_URL) throw new Error('Missing SUPABASE_URL');
if (!SUPABASE_SERVICE_ROLE_KEY) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
