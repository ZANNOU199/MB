import { apiFetch } from './api';

export type Tarif = {
  id: number;
  appartement_id: number;
  date_debut: string;
  date_fin?: string;
  prix_nuit?: number;
  type?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export async function fetchTarifs(): Promise<Tarif[]> {
  try {
    return await apiFetch<Tarif[]>('/api/tarifs');
  } catch (error) {
    console.error('Failed to fetch tarifs:', error);
    return [];
  }
}

export async function fetchTarif(id: number): Promise<Tarif | null> {
  try {
    return await apiFetch<Tarif>(`/api/tarifs/${id}`);
  } catch (error) {
    console.error(`Failed to fetch tarif ${id}:`, error);
    return null;
  }
}

export async function createTarif(data: Partial<Tarif>): Promise<Tarif> {
  return await apiFetch<Tarif>('/api/tarifs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateTarif(id: number, data: Partial<Tarif>): Promise<Tarif> {
  return await apiFetch<Tarif>(`/api/tarifs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteTarif(id: number): Promise<void> {
  await apiFetch(`/api/tarifs/${id}`, { method: 'DELETE' });
}
