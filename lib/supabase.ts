// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface AuditRecord {
  id: string;
  form_data: object;
  result: object;
  ai_summary: string;
  created_at: string;
}

export interface LeadRecord {
  id?: string;
  audit_id: string;
  email: string;
  company?: string;
  role?: string;
  is_high_savings: boolean;
  created_at?: string;
}