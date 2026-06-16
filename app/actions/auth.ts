'use server';

import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function login(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) throw new Error(error.message);

  const { data: userData } = await supabase
    .from('user')
    .select('user_role')
    .eq('user_uuid', data.user.id)
    .single();

  if (!userData) {
    redirect('/onboarding');
  }

  switch (userData.user_role) {
    case 'admin':
      redirect('/admin');
    case 'client':
      redirect('/dashboard');
    default:
      redirect('/onboarding');
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
