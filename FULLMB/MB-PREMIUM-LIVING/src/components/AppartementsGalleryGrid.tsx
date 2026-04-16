import { motion } from "motion/react";
import { useAppartements } from '../hooks/useAppartements';

// Permet d'afficher toutes les photos ou seulement les n premières
export default function AppartementsGalleryGrid({ limit }: { limit?: number }) {
  const { appartements } = useAppartements();
  // Récupère toutes les photos des appartements
  let appartementPhotos = (appartements ?? []).flatMap((apt) => Array.isArray(apt.photos) ? apt.photos : []);
  if (limit) {
    appartementPhotos = appartementPhotos.slice(0, limit);
  }
  // Applique le même pattern de taille que la galerie d'accueil
  const sizes = [
    'large', // 0
    'tall',  // 1
    'wide',  // 2
    'small', // 3
    'small', // 4
    'wide',  // 5
    'small', // 6
    'small', // 7
    'wide',  // 8
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[250px] grid-flow-dense">
      {appartementPhotos.map((src, i) => {
        const size = sizes[i] || 'small';
        return (
          <motion.div
            key={i}
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
              src={src}
              alt={"Appartement"}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        );
      })}
    </div>
  );
}
