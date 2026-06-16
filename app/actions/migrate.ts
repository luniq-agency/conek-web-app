'use server';

import { createClient } from '@/app/utils/supabase/server';

export async function registerBubbleUser(email: string, password: string) {
  const supabase = await createClient();

  const { data: signupData, error: signupError } = await supabase.auth.signUp({ email, password });
  if (signupError) throw new Error(signupError.message);

  const { data: userProfile, error: userError } = await supabase
    .from('user')
    .update({ user_uuid: signupData.user?.id })
    .eq('email', email)
    .select()
    .single();
  if (userError) throw new Error(userError.message);

  if (userProfile.user_role === 'client') {
    const { data: clientProfile, error: clientError } = await supabase
      .from('client')
      .update({ user_id: signupData.user?.id, user: userProfile.id })
      .eq('email', email)
      .select()
      .single();
    if (clientError) throw new Error(clientError.message);
  }

  return signupData;
}
