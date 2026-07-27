import { createClient } from '@supabase/supabase-js';

const env = (import.meta as unknown as { env?: Record<string, string> }).env || {};

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const isSupabaseConfigured = Boolean(
  env.VITE_SUPABASE_URL &&
  env.VITE_SUPABASE_ANON_KEY &&
  !env.VITE_SUPABASE_URL.includes('placeholder')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export function getSupabaseStatus() {
  return {
    configured: isSupabaseConfigured,
    url: isSupabaseConfigured ? supabaseUrl : 'Local Demo Storage Mode (Add VITE_SUPABASE_URL to connect)',
    status: isSupabaseConfigured ? 'Connected to Supabase Cloud' : 'Running Offline-First Mode',
  };
}
