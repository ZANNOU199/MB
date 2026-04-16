import { apiFetch } from './api';

export type SiteTheme = {
  primary: string;
  secondary: string;
  surface: string;
  onSurface: string;
  surfaceVariant: string;
  onSurfaceVariant: string;
  buttonText: string;
};

export type SiteSeo = {
  title: string;
  description: string;
  keywords: string;
};

export type SiteImages = Record<string, string>;

export type SiteSettings = {
  theme: SiteTheme;
  seo: SiteSeo;
  images: SiteImages;
};

const STORAGE_KEY = 'site-settings';
const EVENT_NAME = 'site-settings-updated';

export function loadLocalSiteSettings(): SiteSettings | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SiteSettings;
  } catch {
    return null;
  }
}

export function dispatchSiteSettingsUpdate(settings: SiteSettings): void {
  const event = new CustomEvent<SiteSettings>(EVENT_NAME, { detail: settings });
  window.dispatchEvent(event as Event);
}

export function saveLocalSiteSettings(settings: SiteSettings): SiteSettings {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  dispatchSiteSettingsUpdate(settings);
  return settings;
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  try {
    const settings = await apiFetch<SiteSettings>('/api/site-settings');
    return saveLocalSiteSettings(settings);
  } catch (error) {
    console.warn('Unable to fetch site settings from backend:', error);
    return loadLocalSiteSettings();
  }
}

export async function saveSiteSettings(settings: SiteSettings): Promise<SiteSettings> {
  const updated = await apiFetch<SiteSettings>('/api/site-settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  return saveLocalSiteSettings(updated);
}

export function subscribeSiteSettingsUpdates(callback: (settings: SiteSettings | null) => void): () => void {
  const handleUpdate = (event: Event) => {
    const custom = event as CustomEvent<SiteSettings>;
    callback(custom.detail);
  };

  const handleStorage = () => callback(loadLocalSiteSettings());

  window.addEventListener(EVENT_NAME, handleUpdate as EventListener);
  window.addEventListener('storage', handleStorage);

  return () => {
    window.removeEventListener(EVENT_NAME, handleUpdate as EventListener);
    window.removeEventListener('storage', handleStorage);
  };
}
