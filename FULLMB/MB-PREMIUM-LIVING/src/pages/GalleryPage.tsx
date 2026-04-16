import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { IMAGES } from "../constants";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSiteSettings } from "../hooks/useSiteSettings";
import FeaturedGalleryGrid from "../components/FeaturedGalleryGrid";
// import supprimé car déjà présent plus haut
import { fetchFeaturedGalleryImages, FeaturedGalleryImage } from "../services/featuredGallery";
import { fetchAppartements, Appartement } from "../services/appartements";

const ALL_IMAGES = [
  // Studio
  { src: IMAGES.studio, category: "Studio Exécutif", type: "Salons" },
  { src: "https://picsum.photos/seed/studio1/1200/800", category: "Studio Exécutif", type: "Chambres" },
  { src: "https://picsum.photos/seed/studio2/1200/800", category: "Studio Exécutif", type: "Cuisines" },
  { src: "https://picsum.photos/seed/studio-bath/1200/800", category: "Studio Exécutif", type: "Douches" },
  
  // Suite
  { src: IMAGES.suite, category: "Suite Prestige", type: "Salons" },
  { src: "https://picsum.photos/seed/suite1/1200/800", category: "Suite Prestige", type: "Chambres" },
  { src: "https://picsum.photos/seed/suite2/1200/800", category: "Suite Prestige", type: "Cuisines" },
  { src: "https://picsum.photos/seed/suite-bath/1200/800", category: "Suite Prestige", type: "Douches" },
  
  // Penthouse
  { src: IMAGES.penthouse, category: "The Penthouse", type: "Salons" },
  { src: "https://picsum.photos/seed/pent1/1200/800", category: "The Penthouse", type: "Chambres" },
  { src: "https://picsum.photos/seed/pent2/1200/800", category: "The Penthouse", type: "Cuisines" },
  { src: "https://picsum.photos/seed/pent-bath/1200/800", category: "The Penthouse", type: "Douches" },
  
  // Reassigned Lifestyle images to apartments
  { src: IMAGES.gallery1, category: "The Penthouse", type: "Salons" },
  { src: IMAGES.gallery2, category: "Suite Prestige", type: "Salons" },
  { src: IMAGES.gallery3, category: "Studio Exécutif", type: "Chambres" },
  { src: IMAGES.hero, category: "The Penthouse", type: "Salons" },
  { src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80", category: "Suite Prestige", type: "Cuisines" },
  { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80", category: "Studio Exécutif", type: "Chambres" },
  { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80", category: "The Penthouse", type: "Salons" },
  { src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80", category: "Suite Prestige", type: "Chambres" },
  { src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80", category: "The Penthouse", type: "Salons" },
];

// Les catégories seront générées dynamiquement à partir des titres des appartements
const TYPES = ["Tous", "Salons", "Chambres", "Cuisines", "Douches"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [activeType, setActiveType] = useState("Tous");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const siteSettings = useSiteSettings();
  const siteImages = siteSettings?.images ?? { heroGallery: IMAGES.gallery3 };

  // Nouveaux états pour featured images et appartements
  const [galleryImages, setGalleryImages] = useState<FeaturedGalleryImage[]>([]);
  const [appartements, setAppartements] = useState<Appartement[]>([]);
  const [categories, setCategories] = useState<string[]>(["Tous"]);

  useEffect(() => {
    Promise.all([fetchFeaturedGalleryImages(), fetchAppartements()])
      .then(([images, apps]) => {
        setGalleryImages(images);
        setAppartements(apps);
        // Extraire les titres uniques des appartements liés aux images
        const ids = new Set(images.map(img => img.appartement_id));
        const noms = apps.filter(app => ids.has(app.id)).map(app => app.titre_fr);
        setCategories(["Tous", ...Array.from(new Set(noms))]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="pb-20 overflow-x-hidden">
        {/* Luxury Hero Section */}
        <section className="relative min-h-[50vh] md:h-[60vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden mb-12 md:mb-20 pt-32 md:pt-40">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={siteImages.heroGallery || IMAGES.gallery3} 
              className="w-full h-full object-cover opacity-40"
              alt="Gallery Hero"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/20 to-surface"></div>
          </motion.div>

          <div className="relative z-10 text-center px-6 mt-8 md:mt-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-headline text-4xl md:text-8xl lg:text-7xl xl:text-8xl mb-4 md:mb-6 leading-tight">Galerie Prestige</h1>
              <p className="max-w-2xl mx-auto text-on-surface-variant font-light text-base md:text-xl px-4">
                Explorez chaque recoin de nos résidences à travers notre collection complète de photographies haute définition.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Filters */}
          <div className="space-y-8 mb-12">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-4">Par Résidence</p>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setPage(1);
                    }}
                    className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${
                      activeCategory === cat 
                        ? "bg-secondary border-secondary text-white" 
                        : "border-white/10 text-on-surface-variant hover:border-secondary/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-secondary font-bold mb-4">Par Ambiance</p>
              <div className="flex flex-wrap gap-2">
                {TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${
                      activeType === type 
                        ? "bg-on-surface border-on-surface text-surface" 
                        : "border-white/10 text-on-surface-variant hover:border-on-surface/50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grille d'images galerie à la une filtrée */}
          <FeaturedGalleryGrid
            images={
              activeCategory === "Tous"
                ? galleryImages
                : galleryImages.filter(img => {
                    const app = appartements.find(a => a.id === img.appartement_id);
                    // robust: match trimmed and case-insensitive
                    return app && app.titre_fr.trim().toLowerCase() === activeCategory.trim().toLowerCase();
                  })
            }
            page={page}
            perPage={9}
            onPageChange={setPage}
          />
        </div>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-12"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors">
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              src={selectedImage}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
