import { motion } from "motion/react";
import { MessageSquare } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-32 px-6 md:px-12 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <h2 className="font-headline text-5xl mb-10 leading-tight">
              Planifiez votre séjour d'exception.
            </h2>
            <p className="text-on-surface-variant font-light text-lg mb-12">
              Nos conseillers sont à votre disposition pour personnaliser chaque détail de votre réservation.
            </p>
            <a
              href="https://wa.me/22900000000"
              className="inline-flex items-center gap-6 group"
            >
              <div className="w-16 h-16 rounded-full border border-secondary flex items-center justify-center group-hover:bg-secondary transition-all duration-500">
                <MessageSquare className="text-secondary group-hover:text-on-primary" />
              </div>
              <div>
                <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant">
                  Réponse immédiate
                </span>
                <span className="text-xl font-headline text-secondary">
                  Contact WhatsApp
                </span>
              </div>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="bg-surface-container p-12"
          >
            <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-2">
                  Nom Complet
                </label>
                <input
                  type="text"
                  className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary transition-colors text-on-surface font-light py-4"
                />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary transition-colors text-on-surface font-light py-4"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-2">
                    Dates
                  </label>
                  <input
                    type="text"
                    placeholder="Du .. au .."
                    className="w-full bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-secondary transition-colors text-on-surface font-light py-4"
                  />
                </div>
              </div>
              <button className="w-full bg-secondary text-white py-6 uppercase tracking-[0.4em] text-xs font-bold hover:opacity-90 transition-all mt-8">
                Réserver votre séjour maintenant
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
