import { API_BASE_URL, apiFetch } from './api';

const MAX_IMAGE_UPLOAD_SIZE = 10 * 1024 * 1024; // 10MB

export interface UploadResult {
  success: boolean;
  url?: string;
  path?: string;
  type?: string;
  error?: string;
  message?: string;
}

export async function uploadSiteImage(
  file: File,
  type: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> {
  if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
    return {
      success: false,
      error: 'Le fichier est trop volumineux. Taille maximale autorisée : 10 Mo.',
    };
  }

  return new Promise((resolve) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });

    xhr.addEventListener('load', () => {
      try {
        const result = JSON.parse(xhr.responseText);

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(result);
        } else {
          const message = result.message || result.error ||
            (result.messages?.image ? result.messages.image.join(', ') : undefined) ||
            JSON.stringify(result.messages || result);
          resolve({
            success: false,
            error: message || 'Upload failed'
          });
        }
      } catch (error) {
        resolve({
          success: false,
          error: 'Erreur de réponse du serveur'
        });
      }
    });

    xhr.addEventListener('error', () => {
      resolve({
        success: false,
        error: 'Erreur réseau lors de l\'upload'
      });
    });

    xhr.addEventListener('abort', () => {
      resolve({
        success: false,
        error: 'Upload annulé'
      });
    });

    xhr.open('POST', `${API_BASE_URL}/api/site-images/upload`);
    xhr.withCredentials = true;
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.send(formData);
  });
}

export async function deleteSiteImage(path: string): Promise<boolean> {
  try {
    await apiFetch('/site-images/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ path })
    });
    return true;
  } catch (error) {
    console.error('Delete failed:', error);
    return false;
  }
}