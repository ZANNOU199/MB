// Récupérer un article par son slug
export async function fetchArticleBySlug(slug: string): Promise<ArticleBlog | null> {
  try {
    const article = await apiFetch<ArticleBlog>(`/api/articles-blog/slug/${slug}`);
    return article;
  } catch (error) {
    return null;
  }
}
import { API_BASE_URL, apiFetch, normalizeImageUrl } from './api';

export type ArticleBlog = {
  id: number;
  slug: string;
  titre_fr: string;
  titre_en?: string;
  contenu_fr?: string;
  contenu_en?: string;
  categorie?: string;
  image_url?: string;
  publie_le?: string;
  statut?: string;
  excerpt_fr?: string;
  excerpt_en?: string;
  created_at?: string;
  updated_at?: string;
};

export async function fetchArticles(): Promise<ArticleBlog[]> {
  try {
    const articles = await apiFetch<ArticleBlog[]>('/api/articles-blog');
    return articles.map(article => ({
      ...article,
      image_url: normalizeImageUrl(article.image_url),
    }));
  } catch (error) {
    console.error('Failed to fetch articles blog:', error);
    return [];
  }
}

export async function fetchArticle(id: number): Promise<ArticleBlog | null> {
  try {
    return await apiFetch<ArticleBlog>(`/api/articles-blog/${id}`);
  } catch (error) {
    console.error(`Failed to fetch article ${id}:`, error);
    return null;
  }
}

export async function createArticle(data: Partial<ArticleBlog> & { image?: File }): Promise<ArticleBlog> {
  const formData = new FormData();
  // Ajoute tous les champs dans le FormData
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'image') {
        formData.append('image_url', value as File); // Laravel attend image_url
      } else {
        formData.append(key, value as string);
      }
    }
  });
  const response = await fetch(`${API_BASE_URL}/api/articles-blog`, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<ArticleBlog>;
}

export async function updateArticle(id: number, data: Partial<ArticleBlog> & { image?: File }): Promise<ArticleBlog> {
  const formData = new FormData();
  // Champs requis à toujours envoyer
  const requiredFields = ['slug', 'titre_fr'];
  requiredFields.forEach((field) => {
    if (!data[field]) {
      throw new Error(`Le champ requis ${field} est manquant ou vide.`);
    }
    formData.append(field, data[field] as string);
  });
  // Ajoute les autres champs (hors image, image_url et requis déjà ajoutés)
  Object.entries(data).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      !requiredFields.includes(key) &&
      key !== 'image' &&
      key !== 'image_url' // ne pas envoyer l'URL existante
    ) {
      formData.append(key, value as string);
    }
  });
  // Image : n’envoie image_url que si nouvelle image
  if (data.image) {
    formData.append('image_url', data.image);
  }
  formData.append('_method', 'PUT'); // Pour Laravel, méthode PUT via POST
  const response = await fetch(`${API_BASE_URL}/api/articles-blog/${id}`, {
    method: 'POST',
    body: formData,
    headers: {
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json() as Promise<ArticleBlog>;
}

export async function deleteArticle(id: number): Promise<void> {
  await apiFetch(`/api/articles-blog/${id}`, { method: 'DELETE' });
}
