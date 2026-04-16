
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchArticleBySlug, ArticleBlog } from "../services/articlesBlog";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft, Calendar, User, Facebook, Twitter, Linkedin, Tag } from "lucide-react";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [post, setPost] = useState<ArticleBlog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchArticleBySlug(slug)
      .then(article => setPost(article))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
  }
  if (!post) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-headline mb-4">Article non trouvé</h1>
          <Link to="/blog" className="text-secondary uppercase tracking-widest font-bold">Retour au blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      
      <main className="pt-32 pb-20">
        <article className="max-w-4xl mx-auto px-6">
          {/* Header */}
          <div className="mb-12">
            <Link to="/blog" className="inline-flex items-center gap-2 text-secondary text-[10px] uppercase tracking-[0.3em] font-bold mb-8 hover:gap-4 transition-all">
              <ArrowLeft size={14} />
              Retour au blog
            </Link>
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-secondary text-white text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full">
                {post.categorie || "Blog"}
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest flex items-center gap-1.5">
                <Calendar size={12} /> {post.publie_le ? new Date(post.publie_le).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Récent'}
              </span>
            </div>
            <h1 className="font-headline text-4xl md:text-6xl mb-8 leading-tight">{post.titre_fr}</h1>
            <div className="flex items-center justify-between py-6 border-y border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Écrit par</p>
                  <p className="font-bold text-sm">Staff MB</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant hidden md:block">Partager</p>
                <div className="flex gap-2">
                  <button className="p-2 rounded-full bg-surface-container-low hover:bg-secondary hover:text-white transition-all"><Facebook size={16} /></button>
                  <button className="p-2 rounded-full bg-surface-container-low hover:bg-secondary hover:text-white transition-all"><Twitter size={16} /></button>
                  <button className="p-2 rounded-full bg-surface-container-low hover:bg-secondary hover:text-white transition-all"><Linkedin size={16} /></button>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="aspect-video rounded-[2rem] overflow-hidden mb-16 shadow-2xl">
            <img 
              src={post.image_url}
              alt={post.titre_fr}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none mb-16">
            <div 
              className="font-light text-on-surface-variant leading-relaxed space-y-6"
              dangerouslySetInnerHTML={{ __html: post.contenu_fr || "" }}
            />
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-8 border-t border-white/5">
            {post.categorie && (
              <span className="flex items-center gap-1.5 px-4 py-2 bg-surface-container-low rounded-full text-[10px] uppercase tracking-widest text-on-surface-variant">
                <Tag size={12} /> {post.categorie}
              </span>
            )}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
