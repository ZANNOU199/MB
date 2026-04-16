import { apiFetch } from './api';

export type FeaturedGalleryImage = {
  id: number;
  appartement_id: number;
  photo_url: string;
  display_order: number;
  appartement?: {
    id: number;
    titre_fr: string;
    photos: string[];
  };
};

// Récupère la sélection des 9 images à la une
export async function fetchFeaturedGalleryImages(): Promise<FeaturedGalleryImage[]> {
  return apiFetch<FeaturedGalleryImage[]>('/api/featured-gallery-images');
}

// Met à jour la sélection (remplace tout)
export async function updateFeaturedGalleryImages(images: Array<{
  appartement_id: number;
  photo_url: string;
  display_order: number;
}>): Promise<void> {
  await apiFetch('/api/featured-gallery-images', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ images }),
  });
}
