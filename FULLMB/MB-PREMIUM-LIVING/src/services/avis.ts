import { apiFetch } from './api';

export type Avis = {
  id: number;
  reservation_id: number;
  client_id: number;
  note?: number;
  commentaire?: string;
  statut?: string;
  reponse_admin?: string;
  publie_le?: string;
  created_at?: string;
  updated_at?: string;
  client?: { nom: string; prenom: string };
  reservation?: { appartement_id: number };
};

export async function fetchAvis(): Promise<Avis[]> {
  try {
    return await apiFetch<Avis[]>('/api/avis');
  } catch (error) {
    console.error('Failed to fetch avis:', error);
    return [];
  }
}

export async function fetchAvisItem(id: number): Promise<Avis | null> {
  try {
    return await apiFetch<Avis>(`/api/avis/${id}`);
  } catch (error) {
    console.error(`Failed to fetch avis ${id}:`, error);
    return null;
  }
}

export async function createAvis(data: Partial<Avis>): Promise<Avis> {
  return await apiFetch<Avis>('/api/avis', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateAvis(id: number, data: Partial<Avis>): Promise<Avis> {
  return await apiFetch<Avis>(`/api/avis/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteAvis(id: number): Promise<void> {
  await apiFetch(`/api/avis/${id}`, { method: 'DELETE' });
}
