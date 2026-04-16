import { useState } from "react";
import { motion } from "motion/react";
import { Quote, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { IMAGES } from "../constants";
import { useSiteSettings } from "../hooks/useSiteSettings";

const FEATURED_REVIEWS = [
  {
    name: "Sophie Laurent",
    location: "Paris, France",
    rating: 5,
    comment: "Un séjour absolument parfait dans le Penthouse. La vue est à couper le souffle et le service de conciergerie a été d'une aide précieuse.",
    apartment: "The Penthouse"
  },
  {
    name: "Marc-Antoine Petit",
    location: "Lyon, France",
    rating: 5,
    comment: "La Suite Prestige est d'un confort exceptionnel. Tout est pensé dans les moindres détails, du linge de lit à la machine à café.",
    apartment: "Suite Prestige"
  }
];

export default function Testimonials() {
  const siteSettings = useSiteSettings();
  const siteImages = siteSettings?.images ?? { testimonials: IMAGES.gallery2 };

  return (
    <section className="relative py-32 px-6 md:px-12 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.img
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={siteImages.testimonials || IMAGES.gallery2}
          alt="Testimonials background"
          className="w-full h-full object-cover opacity-30"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/80 to-surface"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <p className="text-secondary font-label text-[10px] tracking-[0.3em] uppercase mb-4">
              Témoignages
            </p>
            <h2 className="font-headline text-4xl md:text-5xl text-on-surface">
              Ce que disent nos hôtes
            </h2>
          </div>
          <Link 
            to="/avis"
            className="text-secondary flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold group"
          >
            Voir tous les avis
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURED_REVIEWS.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-surface-container-low/40 backdrop-blur-md p-10 rounded-[2rem] border border-white/10 relative group hover:border-secondary/30 transition-all"
            >
              <Quote className="absolute top-8 right-10 text-secondary/10" size={48} />
              
              <div className="flex text-secondary gap-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>

              <p className="text-on-surface-variant font-light leading-relaxed mb-8 text-lg italic">
                "{review.comment}"
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div>
                  <h4 className="font-headline text-lg flex items-center gap-2 text-on-surface">
                    {review.name}
                    <CheckCircle2 size={14} className="text-secondary" />
                  </h4>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">{review.location}</p>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-secondary font-bold">{review.apartment}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
