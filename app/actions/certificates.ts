'use server';

import { createClient } from '@/app/utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { Certificate, Document } from '../types/Database';

export async function certificatesLoadUser(id: string): Promise<Certificate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('certificate').select('*').eq('user', id);
  if (error) throw new Error(error.message);
  return data || [];
}

export async function certificateUpdate(id: string, data: Partial<Certificate>) {
  const supabase = await createClient();
  const { data: created, error } = await supabase
    .from('certificate')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return created;
}
