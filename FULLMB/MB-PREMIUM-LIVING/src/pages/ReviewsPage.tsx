import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Quote, CheckCircle2, User, MessageSquare } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { useAvis } from "../hooks/useAvis";

export default function ReviewsPage() {
  const [filter, setFilter] = useState("Tous");
  const siteSettings = useSiteSettings();
  const { avis, loading } = useAvis();
  const siteImages = siteSettings?.images ?? { heroReviews: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80" };

  const REVIEWS = avis.filter(a => a.statut !== 'rejete').map(a => ({
    id: a.id,
    name: a.client?.nom || 'Anonyme',
    location: a.reservation?.appartement_id ? `Apartment ${a.reservation.appartement_id}` : 'Inconnu',
    rating: Math.round(a.note || 5),
    comment: a.commentaire || '',
    date: a.publie_le ? new Date(a.publie_le).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long' }) : 'Récent',
    verified: true
  }));

  const filteredReviews = filter === "Tous" 
    ? REVIEWS 
    : REVIEWS;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="pb-20 overflow-x-hidden">
        {/* Luxury Hero Section */}
        <section className="relative min-h-[60vh] md:h-[60vh] lg:min-h-screen flex items-center justify-center overflow-hidden mb-12 md:mb-20 pt-32 md:pt-40">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={siteImages.heroReviews || "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80"} 
              className="w-full h-full object-cover opacity-40"
              alt="Reviews Hero"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/20 to-surface"></div>
          </motion.div>

          <div className="relative z-10 text-center px-6 w-full mt-8 md:mt-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-7xl mx-auto"
            >
              <h1 className="font-headline text-4xl md:text-8xl lg:text-7xl xl:text-8xl mb-4 md:mb-6 leading-tight">Avis Clients</h1>
              <p className="max-w-2xl mx-auto text-on-surface-variant font-light text-base md:text-xl px-4 mb-12">
                Découvrez les expériences vécues par nos hôtes au sein de MB Prestige Living.
              </p>
              
              <div className="flex items-center justify-center gap-4 bg-surface-container-low/50 backdrop-blur-md p-4 md:p-6 rounded-3xl border border-white/10 max-w-sm mx-auto">
                <div className="text-center px-4 border-r border-white/10">
                  <p className="text-2xl md:text-3xl font-headline text-secondary">
                    {REVIEWS.length > 0 ? (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1) : '5'}
                  </p>
                  <div className="flex text-secondary gap-0.5 my-1 justify-center">
                    {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                  </div>
                  <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-on-surface-variant">Note Moyenne</p>
                </div>
                <div className="text-center px-4">
                  <p className="text-2xl md:text-3xl font-headline text-on-surface">{REVIEWS.length}</p>
                  <div className="flex text-secondary justify-center gap-0.5 my-1">
                    <CheckCircle2 size={14} />
                  </div>
                  <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-on-surface-variant">Avis Vérifiés</p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {loading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block w-12 h-12 border-4 border-secondary/30 border-t-secondary rounded-full"
              />
              <p className="mt-4 text-on-surface-variant">Chargement des avis...</p>
            </div>
          ) : (
            <>
              {/* Filters */}
              <div className="flex flex-wrap gap-3 mb-12">
                {["Tous"].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${
                      filter === cat 
                        ? "bg-secondary border-secondary text-white" 
                        : "border-white/10 text-on-surface-variant hover:border-secondary/50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Reviews Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((review, i) => (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="bg-surface-container-low p-10 rounded-[2rem] border border-white/5 relative group"
                >
                  <Quote className="absolute top-8 right-10 text-secondary/10 group-hover:text-secondary/20 transition-colors" size={64} />
                  
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                      <User size={28} />
                    </div>
                    <div>
                      <h3 className="font-headline text-xl flex items-center gap-2">
                        {review.name}
                        {review.verified && <CheckCircle2 size={16} className="text-secondary" />}
                      </h3>
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">{review.location}</p>
                    </div>
                  </div>

                  <div className="flex text-secondary gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        size={14} 
                        fill={i < review.rating ? "currentColor" : "none"} 
                        className={i < review.rating ? "" : "text-on-surface-variant/30"}
                      />
                    ))}
                  </div>

                  <p className="text-on-surface-variant font-light leading-relaxed mb-8 text-lg italic">
                    "{review.comment}"
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-secondary font-bold">
                      <MessageSquare size={14} />
                      {review.location}
                    </div>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant/60">{review.date}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
