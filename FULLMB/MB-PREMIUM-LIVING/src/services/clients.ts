import { apiFetch } from './api';

export type Client = {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  nationalite?: string;
  consentement_rgpd?: boolean;
  consentement_rgpd_at?: string;
  created_at?: string;
  updated_at?: string;
};

export async function fetchClients(): Promise<Client[]> {
  try {
    return await apiFetch<Client[]>('/api/clients');
  } catch (error) {
    console.error('Failed to fetch clients:', error);
    return [];
  }
}

export async function fetchClient(id: number): Promise<Client | null> {
  try {
    return await apiFetch<Client>(`/api/clients/${id}`);
  } catch (error) {
    console.error(`Failed to fetch client ${id}:`, error);
    return null;
  }
}

export async function createClient(data: Partial<Client>): Promise<Client> {
  return await apiFetch<Client>('/api/clients', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateClient(id: number, data: Partial<Client>): Promise<Client> {
  return await apiFetch<Client>(`/api/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteClient(id: number): Promise<void> {
  await apiFetch(`/api/clients/${id}`, { method: 'DELETE' });
}
