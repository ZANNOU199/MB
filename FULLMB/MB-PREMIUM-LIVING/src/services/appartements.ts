import { apiFetch, API_BASE_URL } from './api';

export type Appartement = {
  id: number;
  slug: string;
  titre_fr: string;
  titre_en: string;
  description_fr?: string;
  description_en?: string;
  capacite?: number;
  prix_nuit?: number;
  statut?: string;
  smoobu_id?: string;
  type?: string;
  equipements?: Record<string, string>[];
  photos?: string[];
  created_at?: string;
  updated_at?: string;
};

export async function fetchAppartements(): Promise<Appartement[]> {
  try {
    return await apiFetch<Appartement[]>('/api/appartements');
  } catch (error) {
    console.error('Failed to fetch appartements:', error);
    return [];
  }
}

export async function fetchAppartement(id: number): Promise<Appartement | null> {
  try {
    return await apiFetch<Appartement>(`/api/appartements/${id}`);
  } catch (error) {
    console.error(`Failed to fetch appartement ${id}:`, error);
    return null;
  }
}

export async function createAppartement(data: Partial<Appartement> & { photos?: File[] }): Promise<Appartement> {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'photos' && Array.isArray(value)) {
      value.forEach((file) => {
        if (typeof File !== 'undefined' && file instanceof File) {
          formData.append('photos[]', file);
        }
      });
    } else if (Array.isArray(value)) {
      if (key === 'equipements') {
        (value as Record<string, string>[]).forEach((v) =>
          formData.append('equipements[]', JSON.stringify(v))
        );
      } else if (value.length > 0 && typeof value[0] === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.join(','));
      }
    } else if (value !== undefined && value !== null) {
      formData.append(key, value as any);
    }
  });
  return await apiFetch<Appartement>('/api/appartements', {
    method: 'POST',
    body: formData,
  });
}

export async function updateAppartement(id: number, data: Partial<Appartement> & { photos?: File[] }): Promise<Appartement> {
  const formData = new FormData();
  // Champs requis à toujours envoyer
  const requiredFields: (keyof Appartement)[] = ['slug', 'titre_fr', 'titre_en'];
  requiredFields.forEach((field) => {
    const value = data[field];
    if (!value) {
      throw new Error(`Le champ requis ${field} est manquant ou vide.`);
    }
    formData.append(field, value as string);
  });
  // Ajoute les autres champs (hors photos et requis déjà ajoutés)
  Object.entries(data).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      !requiredFields.includes(key as keyof Appartement) &&
      key !== 'photos' &&
      key !== 'photos_to_keep'
    ) {
      if (Array.isArray(value)) {
        if (key === 'equipements') {
          (value as Record<string, string>[]).forEach((v) =>
            formData.append('equipements[]', JSON.stringify(v))
          );
        } else if (value.length > 0 && typeof value[0] === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          if (value.length > 0) {
            formData.append(key, value.join(','));
          }
        }
      } else {
        formData.append(key, value as any);
      }
    }
  });
  // Ajoute la liste des URLs à garder (photos_to_keep)
  if (data.photos && Array.isArray(data.photos)) {
    data.photos.forEach((photo) => {
      if (typeof photo === 'string') {
        formData.append('photos_to_keep[]', photo);
      }
    });
  }
  // Ajoute les fichiers images réels
  if (data.photos && Array.isArray(data.photos)) {
    data.photos.forEach((file) => {
      // Vérifie que file est bien un objet File ou Blob (pour navigateur)
      if (file && typeof file === 'object' && 'size' in file && 'type' in file) {
        formData.append('photos[]', file as Blob);
      }
    });
  }
  formData.append('_method', 'PUT'); // Pour Laravel, méthode PUT via POST
  return await fetch(`${API_BASE_URL}/api/appartements/${id}`, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
    credentials: 'include',
  }).then(async (response) => {
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${text}`);
    }
    return response.json() as Promise<Appartement>;
  });
}

export async function deleteAppartement(id: number): Promise<void> {
  await apiFetch(`/api/appartements/${id}`, { method: 'DELETE' });
}
