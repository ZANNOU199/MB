import { apiFetch } from './api';

export type Disponibilite = {
  id: number;
  appartement_id: number;
  date_debut: string;
  date_fin: string;
  source?: string;
  bloque?: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export async function fetchDisponibilites(): Promise<Disponibilite[]> {
  try {
    return await apiFetch<Disponibilite[]>('/api/disponibilites');
  } catch (error) {
    console.error('Failed to fetch disponibilites:', error);
    return [];
  }
}

export async function fetchDisponibilite(id: number): Promise<Disponibilite | null> {
  try {
    return await apiFetch<Disponibilite>(`/api/disponibilites/${id}`);
  } catch (error) {
    console.error(`Failed to fetch disponibilite ${id}:`, error);
    return null;
  }
}

export async function createDisponibilite(data: Partial<Disponibilite>): Promise<Disponibilite> {
  return await apiFetch<Disponibilite>('/api/disponibilites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateDisponibilite(id: number, data: Partial<Disponibilite>): Promise<Disponibilite> {
  return await apiFetch<Disponibilite>(`/api/disponibilites/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteDisponibilite(id: number): Promise<void> {
  await apiFetch(`/api/disponibilites/${id}`, { method: 'DELETE' });
}
