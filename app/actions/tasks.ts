'use server';

import { createClient } from '@/app/utils/supabase/server';
import { Task, TaskUpdate, User } from '../types/Database';
import { notificationCreate } from './notification';

export async function taskClose(id: string) {
  const supabase = await createClient();

  const { data: created, error } = await supabase
    .from('task')
    .update({ status: 'closed' })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return created;
}
export async function taskCreate(data: Partial<Task>) {
  const supabase = await createClient();

  const { data: created, error } = await supabase.from('task').insert(data).select().single();

  if (error) throw new Error(error.message);

  return created;
}

export async function taskLoad(id: string): Promise<Task> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('task').select('*').eq('id', id).single();

  if (error) throw new Error(error.message);

  return data;
}

export async function tasksLoadAll(): Promise<Task[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('task').select('*');

  if (error) throw new Error(error.message);
  return data || [];
}

export async function tasksLoadUser(id: string): Promise<Task[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('task').select('*').eq('user', id);

  if (error) throw new Error(error.message);

  return data || [];
}

export async function taskTransfer(id: string, target: string, user: string): Promise<Task> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('task')
    .update({ assignee: target })
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);

  return data;
}

export async function taskUpdateCreate(data: Partial<TaskUpdate>) {
  const supabase = await createClient();

  const { data: created, error } = await supabase
    .from('task_update')
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);

  return created;
}

export async function taskUpdatesLoad(id: string): Promise<TaskUpdate[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.from('task_update').select('*').eq('task', id);

  if (error) throw new Error(error.message);
  return data || [];
}
