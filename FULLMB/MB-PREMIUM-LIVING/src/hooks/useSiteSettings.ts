import { useEffect, useState } from 'react';
import { loadLocalSiteSettings, subscribeSiteSettingsUpdates, SiteSettings } from '../services/siteSettings';

export function useSiteSettings() {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(() => loadLocalSiteSettings());

  useEffect(() => {
    const unsubscribe = subscribeSiteSettingsUpdates((settings) => {
      setSiteSettings(settings);
    });

    return unsubscribe;
  }, []);

  return siteSettings;
}
