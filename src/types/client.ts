export type ClientStatus = 'new' | 'contacted' | 'approved' | 'monthly_client';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  lat: number;
  lng: number;
  status: ClientStatus;
  notes: string;
  date_added: string;
  last_contact: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProgressGoal {
  id: string;
  month: string;
  contacts_goal: number;
  approvals_goal: number;
  new_clients_goal: number;
  monthly_clients_goal: number;
  contacts_count: number;
  approvals_count: number;
  new_clients_count: number;
  monthly_clients_count: number;
  created_at: string;
  updated_at: string;
}
