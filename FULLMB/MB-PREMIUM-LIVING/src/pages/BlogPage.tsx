import { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Tag, ArrowRight, Search } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useSiteSettings } from "../hooks/useSiteSettings";
import { useArticles } from "../hooks/useArticles";
import { normalizeImageUrl } from "../services/api";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const siteSettings = useSiteSettings();
  const { articles, loading } = useArticles();
  const siteImages = siteSettings?.images ?? { heroBlog: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80" };
  const DEFAULT_ARTICLE_IMAGE = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80";

  // Convertir les articles en format compatible
  const BLOG_POSTS = articles.map(article => ({
    id: article.id,
    slug: article.slug,
    title: article.titre_fr,
    excerpt: article.excerpt_fr || article.contenu_fr?.substring(0, 150) || '',
    image: normalizeImageUrl(article.image_url) || DEFAULT_ARTICLE_IMAGE,
    date: article.publie_le ? new Date(article.publie_le).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Récent',
    author: "Staff MB",
    category: article.categorie || "Blog",
    tags: [article.categorie || "Blog"]
  }));

  const categories = ["Tous", ...new Set(articles.map(a => a.categorie || "Blog"))];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const categoryMatch = activeCategory === "Tous" || post.category === activeCategory;
    const searchMatch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="pb-20 overflow-x-hidden">
        {/* Luxury Hero Section */}
        <section className="relative min-h-[60vh] md:h-[70vh] lg:min-h-screen flex items-center justify-center overflow-hidden mb-12 md:mb-20 pt-32 md:pt-40">
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={siteImages.heroBlog || "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80"} 
              className="w-full h-full object-cover opacity-40"
              alt="Blog Hero"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-surface via-surface/20 to-surface"></div>
          </motion.div>

          <div className="relative z-10 text-center px-6 w-full mt-8 md:mt-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="font-headline text-4xl md:text-8xl lg:text-7xl xl:text-8xl mb-6 md:mb-8 leading-tight">Inspirations</h1>
              <p className="max-w-2xl mx-auto text-on-surface-variant font-light text-base md:text-xl px-4 mb-8">
                Découvrez nos guides exclusifs et conseils pour un séjour d'exception à Cotonou.
              </p>
              <div className="max-w-xl mx-auto relative px-4">
                <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <input 
                  type="text"
                  placeholder="Rechercher un article..."
                  className="w-full bg-surface-container-low/50 backdrop-blur-md border border-white/10 rounded-full py-4 pl-12 pr-6 text-sm focus:outline-none focus:border-secondary transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all border ${
                  activeCategory === cat 
                    ? "bg-secondary border-secondary text-white" 
                    : "border-white/10 text-on-surface-variant hover:border-secondary/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="inline-block w-12 h-12 border-4 border-secondary/30 border-t-secondary rounded-full"
              />
              <p className="mt-4 text-on-surface-variant">Chargement des articles...</p>
            </div>
          ) : (
            <>
              {/* Blog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPosts.map((post, i) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group flex flex-col bg-surface-container-low rounded-3xl overflow-hidden border border-white/5 hover:border-secondary/30 transition-all"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = DEFAULT_ARTICLE_IMAGE;
                    }}
                  />
                  {post.category && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-secondary text-white text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full">
                        {post.category}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <h2 className="font-headline text-2xl mb-4 group-hover:text-secondary transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-on-surface-variant font-light text-sm mb-8 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                    <div className="flex gap-2">
                      {post.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[9px] text-on-surface-variant/60 flex items-center gap-1">
                          <Tag size={10} /> {tag}
                        </span>
                      ))}
                    </div>
                    <Link 
                      to={`/blog/${post.slug}`}
                      className="text-secondary flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold group/btn"
                    >
                      Lire la suite
                      <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-on-surface-variant font-light italic">Aucun article ne correspond à votre recherche.</p>
            </div>
          )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
