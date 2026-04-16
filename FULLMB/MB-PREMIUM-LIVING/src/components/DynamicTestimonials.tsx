import { useAvis } from "../hooks/useAvis";
import { motion } from "motion/react";
import { Quote, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import Testimonials from "./Testimonials";

export default function DynamicTestimonials() {
  const { avis, loading, error } = useAvis();

  if (loading) {
    return <Testimonials />;
  }

  if (error || avis.length === 0) {
    return <Testimonials />;
  }

  const featuredAvis = avis.filter(a => a.statut === 'publie').slice(0, 2);

  return (
    <section className="relative py-32 px-6 md:px-12 overflow-hidden">
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
          {(featuredAvis.length > 0 ? featuredAvis : avis.slice(0, 2)).map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="bg-surface-container-low/40 backdrop-blur-md p-10 rounded-[2rem] border border-white/10 relative group hover:border-secondary/30 transition-all"
            >
              <Quote className="absolute top-8 right-10 text-secondary/10" size={48} />
              
              <div className="flex text-secondary gap-1 mb-6">
                {[...Array(Math.round(review.note || 5))].map((_, idx) => (
                  <Star key={idx} size={14} fill="currentColor" />
                ))}
              </div>

              <p className="text-on-surface-variant font-light leading-relaxed mb-8 text-lg italic">
                "{review.commentaire}"
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div>
                  <h4 className="font-headline text-lg flex items-center gap-2 text-on-surface">
                    {review.client?.nom} {review.client?.prenom}
                    <CheckCircle2 size={14} className="text-secondary" />
                  </h4>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
