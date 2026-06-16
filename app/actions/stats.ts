import { createClient } from '@/app/utils/supabase/server';

export interface Registration {
  month: string;
  count: number;
}

export async function registrationsLoadMonthly(): Promise<Registration[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('monthly_client_registrations').select('*');

  if (error || !data) return [];
  return data;
}
