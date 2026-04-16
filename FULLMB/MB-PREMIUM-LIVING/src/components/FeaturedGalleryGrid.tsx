import { useEffect, useState } from "react";
import { fetchFeaturedGalleryImages, FeaturedGalleryImage } from "../services/featuredGallery";
import { motion } from "motion/react";

// On accepte maintenant une prop images pour afficher une liste filtrée
export default function FeaturedGalleryGrid({ images, limit, page = 1, perPage = 12, onPageChange }: {
  images?: FeaturedGalleryImage[],
  limit?: number,
  page?: number,
  perPage?: number,
  onPageChange?: (page: number) => void
}) {
  const [internalImages, setInternalImages] = useState<FeaturedGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (images) {
      setInternalImages(images);
      setLoading(false);
      setError(null);
    } else {
      setLoading(true);
      fetchFeaturedGalleryImages()
        .then((imgs) => setInternalImages(imgs))
        .catch((e) => setError(e.message))
        .finally(() => setLoading(false));
    }
  }, [images]);

  if (loading) return <div>Chargement…</div>;
  if (error) return <div className="text-red-500">Erreur : {error}</div>;

  let displayedImages = internalImages;
  let showPagination = true;
  if (typeof limit === 'number') {
    displayedImages = internalImages.slice(0, limit);
    showPagination = false;
  } else {
    const total = internalImages.length;
    const totalPages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage;
    const end = start + perPage;
    displayedImages = internalImages.slice(start, end);
    showPagination = totalPages > 1;
  }

  // Même pattern de taille que la galerie d'accueil
  const sizes = [
    'large', 'tall', 'wide', 'small', 'small', 'wide', 'small', 'small', 'wide',
  ];

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px] grid-flow-dense">
        {displayedImages.map((img, i) => {
          const size = sizes[i % sizes.length] || 'small';
          return (
            <motion.div
              key={img.id || `${img.appartement_id}:${img.photo_url}`}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
              className={`group relative overflow-hidden rounded-2xl bg-surface-container-low ${
                size === "large" ? "col-span-2 row-span-2" :
                size === "tall" ? "col-span-1 row-span-2" :
                size === "wide" ? "col-span-2 row-span-1" :
                "col-span-1 row-span-1"
              }`}
            >
              <img
                src={img.photo_url}
                alt={img.appartement?.titre_fr || "Appartement"}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          );
        })}
      </div>
      {/* Pagination controls uniquement si pas de limit */}
      {showPagination && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            className="px-3 py-1 rounded bg-surface-container-low text-on-surface-variant disabled:opacity-40"
            onClick={() => onPageChange && onPageChange(page - 1)}
            disabled={page === 1}
          >
            Précédent
          </button>
          {Array.from({ length: Math.ceil(internalImages.length / perPage) }, (_, i) => (
            <button
              key={i + 1}
              className={`px-3 py-1 rounded ${page === i + 1 ? "bg-secondary text-white" : "bg-surface-container-low text-on-surface-variant"}`}
              onClick={() => onPageChange && onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-surface-container-low text-on-surface-variant disabled:opacity-40"
            onClick={() => onPageChange && onPageChange(page + 1)}
            disabled={page === Math.ceil(internalImages.length / perPage)}
          >
            Suivant
          </button>
        </div>
      )}
    </>
  );
}
