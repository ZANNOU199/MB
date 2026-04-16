import { useEffect, useState } from "react";
import { fetchAppartements, Appartement } from "../../services/appartements";
import {
  fetchFeaturedGalleryImages,
  updateFeaturedGalleryImages,
  FeaturedGalleryImage,
} from "../../services/featuredGallery";

// Utilitaire pour générer une clé unique pour chaque photo
function photoKey(appartementId: number, url: string) {
  return `${appartementId}:${url}`;
}

export default function FeaturedGalleryAdmin() {
  const [appartements, setAppartements] = useState<Appartement[]>([]);
  const [featured, setFeatured] = useState<FeaturedGalleryImage[]>([]);
  const [selected, setSelected] = useState<{
    appartement_id: number;
    photo_url: string;
    display_order: number;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charge tous les appartements et la sélection actuelle
  useEffect(() => {
    setLoading(true);
    Promise.all([fetchAppartements(), fetchFeaturedGalleryImages()])
      .then(([apps, feat]) => {
        setAppartements(apps);
        setFeatured(feat);
        setSelected(
          feat
            .sort((a, b) => a.display_order - b.display_order)
            .map((img) => ({
              appartement_id: img.appartement_id,
              photo_url: img.photo_url,
              display_order: img.display_order,
            }))
        );
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Ajoute une photo à la sélection (max 9)
  function addPhoto(appartement_id: number, photo_url: string) {
    if (selected.length >= 9) return;
    if (selected.find((s) => s.appartement_id === appartement_id && s.photo_url === photo_url)) return;
    setSelected([
      ...selected,
      {
        appartement_id,
        photo_url,
        display_order: selected.length + 1,
      },
    ]);
  }

  // Retire une photo de la sélection
  function removePhoto(appartement_id: number, photo_url: string) {
    setSelected(
      selected
        .filter((s) => !(s.appartement_id === appartement_id && s.photo_url === photo_url))
        .map((s, i) => ({ ...s, display_order: i + 1 }))
    );
  }

  // Réordonne la sélection (drag & drop simplifié)
  function movePhoto(from: number, to: number) {
    if (from === to) return;
    const arr = [...selected];
    const [moved] = arr.splice(from, 1);
    arr.splice(to, 0, moved);
    setSelected(arr.map((s, i) => ({ ...s, display_order: i + 1 })));
  }

  // Sauvegarde la sélection
  // Construit la liste complète à sauvegarder : 9 sélectionnées en premier, puis toutes les autres images de la galerie
  async function save() {
    setSaving(true);
    setError(null);
    try {
      // Toutes les images de tous les appartements (dans l'ordre d'affichage)
      const allImages: { appartement_id: number; photo_url: string }[] = appartements.flatMap(app =>
        (app.photos || []).map(url => ({ appartement_id: app.id, photo_url: url }))
      );
      // Images déjà sélectionnées (clé unique)
      const selectedKeys = selected.map(s => `${s.appartement_id}:${s.photo_url}`);
      // 9 sélectionnées en premier (ordre), puis toutes les autres images non sélectionnées
      const imagesToSave = [
        ...selected.map((s, i) => ({
          appartement_id: s.appartement_id,
          photo_url: s.photo_url,
          display_order: i + 1,
        })),
        ...allImages
          .filter(img => !selectedKeys.includes(`${img.appartement_id}:${img.photo_url}`))
          .map((img, i) => ({
            appartement_id: img.appartement_id,
            photo_url: img.photo_url,
            display_order: selected.length + i + 1,
          })),
      ];
      await updateFeaturedGalleryImages(imagesToSave);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Chargement…</div>;
  if (error) return <div className="text-red-500">Erreur : {error}</div>;

  // Photos déjà sélectionnées (pour éviter doublons)
  const selectedKeys = new Set(selected.map((s) => photoKey(s.appartement_id, s.photo_url)));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Sélection des 9 photos à la une</h2>
      <div className="mb-6">
        <div className="grid grid-cols-3 gap-4">
          {selected.map((s, i) => (
            <div key={photoKey(s.appartement_id, s.photo_url)} className="relative border rounded overflow-hidden">
              <img src={s.photo_url} alt="Sélectionnée" className="w-full h-32 object-cover" />
              <div className="absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">{i + 1}</div>
              <button
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                onClick={() => removePhoto(s.appartement_id, s.photo_url)}
                title="Retirer"
              >
                ×
              </button>
              {i > 0 && (
                <button
                  className="absolute bottom-1 left-1 bg-gray-700 text-white rounded px-2 py-1 text-xs"
                  onClick={() => movePhoto(i, i - 1)}
                  title="Monter"
                >↑</button>
              )}
              {i < selected.length - 1 && (
                <button
                  className="absolute bottom-1 right-1 bg-gray-700 text-white rounded px-2 py-1 text-xs"
                  onClick={() => movePhoto(i, i + 1)}
                  title="Descendre"
                >↓</button>
              )}
            </div>
          ))}
        </div>
        <button
          className="mt-4 px-6 py-2 bg-primary text-white rounded disabled:opacity-50"
          onClick={save}
          disabled={saving || selected.length !== 9}
        >
          {saving ? "Sauvegarde…" : "Enregistrer la sélection"}
        </button>
        {selected.length !== 9 && (
          <div className="text-sm text-orange-600 mt-2">Sélectionnez exactement 9 photos.</div>
        )}
      </div>
      <h3 className="text-lg font-semibold mb-2">Ajouter une photo</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {appartements.flatMap((app) =>
          (app.photos || []).map((url) => (
            <div key={photoKey(app.id, url)} className="relative border rounded overflow-hidden">
              <img src={url} alt={app.titre_fr} className="w-full h-24 object-cover" />
              <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                {app.titre_fr}
              </div>
              <button
                className="absolute top-1 right-1 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center disabled:opacity-50"
                onClick={() => addPhoto(app.id, url)}
                disabled={selectedKeys.has(photoKey(app.id, url)) || selected.length >= 9}
                title="Ajouter à la sélection"
              >
                +
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
