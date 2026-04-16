import { useArticles } from "../hooks/useArticles";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { normalizeImageUrl } from "../services/api";

const DEFAULT_ARTICLE_IMAGE = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80";

export default function DynamicBlog() {
  const { articles, loading, error } = useArticles();

  if (loading) {
    return (
      <section className="py-24 px-6 md:px-12 bg-surface">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="inline-block w-12 h-12 border-4 border-secondary/30 border-t-secondary rounded-full"
          />
          <p className="mt-4 text-on-surface-variant">Chargement des articles...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-24 px-6 md:px-12 bg-surface">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-500">Erreur: {error}</p>
        </div>
      </section>
    );
  }

  const featuredArticles = articles.slice(0, 3);

  return (
    <section className="py-24 px-6 md:px-12 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <p className="text-secondary font-label text-[10px] tracking-[0.3em] uppercase mb-4">
              Blog
            </p>
            <h2 className="font-headline text-4xl md:text-5xl text-on-surface">
              Articles Récents
            </h2>
          </div>
          <Link 
            to="/blog"
            className="text-secondary flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold group"
          >
            Voir tous les articles
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredArticles.map((article, i) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-2xl h-64 mb-6">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={normalizeImageUrl(article.image_url) ?? DEFAULT_ARTICLE_IMAGE}
                  alt={article.titre_fr}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    target.src = DEFAULT_ARTICLE_IMAGE;
                  }}
                />
              </div>
              
              <div className="space-y-4">
                {article.categorie && (
                  <p className="text-secondary text-[10px] uppercase tracking-widest font-bold">
                    {article.categorie}
                  </p>
                )}
                
                <h3 className="font-headline text-2xl group-hover:text-secondary transition-colors">
                  {article.titre_fr}
                </h3>
                
                {article.excerpt_fr && (
                  <p className="text-on-surface-variant font-light line-clamp-2">
                    {article.excerpt_fr}
                  </p>
                )}
                
                {article.publie_le && (
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                    {new Date(article.publie_le).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
