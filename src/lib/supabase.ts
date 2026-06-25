import { createClient } from '@supabase/supabase-js';
import type { Client, ProgressGoal } from '../types/client';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client operations
export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('date_added', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function addClient(client: Omit<Client, 'id' | 'created_at' | 'updated_at'>): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .insert([client])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateClient(id: string, updates: Partial<Client>): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase
    .from('clients')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Progress tracking operations
export async function getProgressGoal(month: string): Promise<ProgressGoal | null> {
  const { data, error } = await supabase
    .from('progress_tracking')
    .select('*')
    .eq('month', month)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data || null;
}

export async function createProgressGoal(goal: Omit<ProgressGoal, 'id' | 'created_at' | 'updated_at'>): Promise<ProgressGoal> {
  const { data, error } = await supabase
    .from('progress_tracking')
    .insert([goal])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateProgressGoal(id: string, updates: Partial<ProgressGoal>): Promise<ProgressGoal> {
  const { data, error } = await supabase
    .from('progress_tracking')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
