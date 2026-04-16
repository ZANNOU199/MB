import { apiFetch } from './api';

export type Paiement = {
  id: number;
  reservation_id: number;
  amount: number;
  payment_method: string;
  payment_date: string;
  status: string;
  transaction_id?: string;
  created_at?: string;
  updated_at?: string;
};

export async function fetchPaiements(): Promise<Paiement[]> {
  try {
    return await apiFetch<Paiement[]>('/api/paiements');
  } catch (error) {
    console.error('Failed to fetch paiements:', error);
    return [];
  }
}

export async function updatePaiementStatus(id: number, status: string): Promise<Paiement> {
  return await apiFetch<Paiement>(`/api/paiements/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
}
