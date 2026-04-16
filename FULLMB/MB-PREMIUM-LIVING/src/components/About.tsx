import { motion } from "motion/react";
import { IMAGES } from "../constants";
import { useSiteSettings } from "../hooks/useSiteSettings";
export default function About() {
  const siteSettings = useSiteSettings();
  const luxuryImage = siteSettings?.images?.luxuryDetails || IMAGES.presentation;
  return (
    <section className="py-32 px-6 md:px-12 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative"
        >
          <img
            src={luxuryImage}
            alt="Luxury Details"
            className="w-full aspect-[4/5] object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-10 -right-10 hidden lg:block w-64 h-80 bg-surface-container-low p-8 border-l-2 border-secondary">
            <p className="font-headline text-3xl text-secondary leading-tight">
              L'Excellence Architecturale
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="text-secondary font-label text-[10px] tracking-[0.3em] uppercase mb-6">
            Introduction
          </p>
          <h2 className="font-headline text-4xl md:text-5xl mb-10 leading-snug text-on-surface">
            Un sanctuaire urbain redéfini par le prestige.
          </h2>
          <div className="space-y-6 text-on-surface-variant leading-relaxed text-lg font-light">
            <p>
              MB Prestige Living incarne une nouvelle ère de l'hospitalité à Cotonou. Nos résidences sont conçues pour ceux qui ne font aucun compromis entre le confort absolu et l'élégance intemporelle.
            </p>
            <p>
              Situé au cœur stratégique de la ville, chaque espace est une ode au raffinement, mariant des matériaux nobles à une technologie de pointe pour une expérience résidentielle inégalée.
            </p>
          </div>
          <div className="mt-12 flex gap-12">
            <div>
              <span className="block text-3xl font-headline text-secondary">24/7</span>
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                Service Concierge
              </span>
            </div>
            <div>
              <span className="block text-3xl font-headline text-secondary">100%</span>
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                Confidentialité
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
