'use server';

import { createClient } from '@/app/utils/supabase/server';
import { Client, User } from '../types/Database';

export async function clientInvite(clientData: Partial<Client>, userData: Partial<User>) {
  const supabase = await createClient();

  //CLIENT
  const { data: client, error: clientError } = await supabase
    .from('client')
    .insert(clientData)
    .select()
    .single();
  if (clientError) throw new Error(clientError.message);

  //USER
  const { data: user, error: userError } = await supabase
    .from('user')
    .insert(userData)
    .select()
    .single();
  if (userError) throw new Error(userError.message);

  return user;
}

export async function clientSignup(email: string, password: string) {
  const supabase = await createClient();

  //REGISTRIEREN
  const { data: created, error } = await supabase.auth.signUp({ email, password });
  if (error) throw new Error(error.message);

  //ANMELDEN
  const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
  if (signInError) throw new Error(signInError.message);

  return data;
}

export async function clientCreateProfile(data: Partial<User>, clientData: Partial<Client>) {
  const supabase = await createClient();

  const { data: created, error } = await supabase.from('user').insert(data).select().single();
  const { data: client, error: clientError } = await supabase
    .from('client')
    .insert(clientData)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return created;
}

export async function clientsLoadAll(): Promise<User[]> {
  const supabase = await createClient();

  const { data: created, error } = await supabase
    .from('user')
    .select('*')
    .eq('user_role', 'client');

  if (error) throw new Error(error.message);

  return created;
}

export async function clientLoadSingle(id: string): Promise<Client> {
  const supabase = await createClient();

  const { data: created, error } = await supabase.from('client').select('*').eq('id', id).single();

  if (error) throw new Error(error.message);

  return created;
}

export async function clientsLoadAgency(id: string): Promise<User[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('user').select('*').eq('bearbeiter', id);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function clientLookup(id: string): Promise<User> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('user').select('*').eq('id', id).single();

  if (error) throw new Error(error.message);

  return data;
}

export async function clientLookupFromUser(id: string): Promise<Client> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('client').select('*').eq('user', id).single();

  if (error) throw new Error(error.message);

  return data;
}

export async function clientUpdate(data: Partial<Client>, id: string) {
  const supabase = await createClient();

  const { data: created, error } = await supabase.from('client').update(data).eq('id', id).select();

  if (error) throw new Error(error.message);

  return created;
}
