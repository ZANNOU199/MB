

import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import FeaturedGalleryGrid from "./FeaturedGalleryGrid";

function Gallery() {
  return (
    <section id="gallery" className="py-32 bg-surface px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <p className="text-secondary font-label text-[10px] tracking-[0.3em] uppercase mb-4">
              Galerie
            </p>
            <h2 className="font-headline text-4xl md:text-5xl text-on-surface">
              L'Expérience Lifestyle
            </h2>
          </div>
          <p className="max-w-md text-on-surface-variant font-light">
            Plongez dans l'atmosphère unique de nos résidences à travers une sélection d'instants et de détails d'exception.
          </p>
        </div>

        <FeaturedGalleryGrid limit={9} />

        <div className="mt-16 text-center">
          <Link 
            to="/galerie"
            className="inline-flex items-center gap-4 px-10 py-5 bg-secondary text-white text-[10px] uppercase tracking-[0.3em] font-bold hover:opacity-90 transition-all group"
          >
            Voir toute la galerie
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Gallery;
