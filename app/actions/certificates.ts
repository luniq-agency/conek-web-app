'use server';

import { createClient } from '@/app/utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { Certificate, Document } from '../types/Database';

const getServiceClient = () =>
  createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export async function certificateCreate(file: File, id: string, data: Partial<Certificate>, year: string) {
  const supabase = getServiceClient();
  const filePath = `${id}/${year}/zertifikat.pfx`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: storageError } = await supabase.storage
    .from('uploads')
    .upload(filePath, buffer, { contentType: file.type, upsert: true });

  if (storageError) throw new Error(storageError.message);

  const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filePath);

  const { data: created, error } = await supabase
    .from('certificate')
    .insert( {...data, file: urlData.publicUrl})
    .select()
    .single();

  if (error) throw new Error(error.message);
  return created;
}

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
