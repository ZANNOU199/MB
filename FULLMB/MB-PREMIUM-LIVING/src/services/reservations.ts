import { apiFetch } from './api';

export type Reservation = {
  id: number;
  appartement_id: number;
  client_id: number;
  date_arrivee: string;
  date_depart: string;
  nombre_personnes?: number;
  montant_total?: number;
  statut?: string;
  smoobu_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

export async function fetchReservations(): Promise<Reservation[]> {
  try {
    return await apiFetch<Reservation[]>('/api/reservations');
  } catch (error) {
    console.error('Failed to fetch reservations:', error);
    return [];
  }
}

export async function fetchReservation(id: number): Promise<Reservation | null> {
  try {
    return await apiFetch<Reservation>(`/api/reservations/${id}`);
  } catch (error) {
    console.error(`Failed to fetch reservation ${id}:`, error);
    return null;
  }
}

export async function createReservation(data: Partial<Reservation>): Promise<Reservation> {
  return await apiFetch<Reservation>('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateReservation(id: number, data: Partial<Reservation>): Promise<Reservation> {
  return await apiFetch<Reservation>(`/api/reservations/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteReservation(id: number): Promise<void> {
  await apiFetch(`/api/reservations/${id}`, { method: 'DELETE' });
}
