import { motion } from "motion/react";
import { MapPin, Clock } from "lucide-react";
import { IMAGES } from "../constants";

export default function Location() {
  return (
    <section className="py-32 px-6 md:px-12 bg-surface">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-0 items-stretch border border-white/5">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="p-12 md:p-24 flex flex-col justify-center"
        >
          <p className="text-secondary font-label text-[10px] tracking-[0.3em] uppercase mb-6">
            Localisation
          </p>
          <h2 className="font-headline text-4xl mb-8 leading-tight">
            Au cœur de l'élégance béninoise.
          </h2>
          <p className="text-on-surface-variant font-light leading-relaxed mb-10">
            Situé dans le quartier le plus prisé de Cotonou, MB Prestige Living vous place à proximité immédiate des centres d'affaires, des ambassades et des meilleures tables de la capitale.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <MapPin size={20} className="text-secondary" />
              <span className="text-sm font-light tracking-wide">
                Quartier résidentiel, Cotonou, Bénin
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Clock size={20} className="text-secondary" />
              <span className="text-sm font-light tracking-wide">
                15 min de l'Aéroport International
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative h-[400px] md:h-auto overflow-hidden"
        >
          <img
            src={IMAGES.map}
            alt="Map of Cotonou"
            className="w-full h-full object-cover grayscale opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-secondary/10 mix-blend-overlay"></div>
        </motion.div>
      </div>
    </section>
  );
}
