'use server';

import { createClient } from '@/app/utils/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { Document } from '../types/Database';

const getServiceClient = () =>
  createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

export async function imageUpload(file: File, user: string) {
  const supabase = getServiceClient();

  const extension = file.type === 'png' ? 'jpg' : 'webp';
  const filePath = `${user}/profilbild.${extension}`;

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: storageError } = await supabase.storage
    .from('uploads')
    .upload(filePath, buffer, { contentType: file.type, upsert: true });

  if (storageError) throw new Error(storageError.message);

  const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filePath);

  return `${urlData.publicUrl}?t=${Date.now()}`;
}
