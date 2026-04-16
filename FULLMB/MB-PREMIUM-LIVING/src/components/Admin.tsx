import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Save, RotateCcw, Palette, Globe, Image as ImageIcon, 
  Settings, Check, AlertCircle, LayoutDashboard, Users, 
  CalendarCheck, BarChart3, Bell, Search, Menu, X, 
  LogOut, ExternalLink, ShieldCheck, Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchSiteSettings, saveSiteSettings, SiteSettings } from "../services/siteSettings";
import { uploadSiteImage } from "../services/siteImages";

const DEFAULT_THEME = {
  primary: "#B8974A",
  secondary: "#C07055",
  surface: "#131313",
  onSurface: "#D4C9B4",
  surfaceVariant: "#353534",
  onSurfaceVariant: "#998f81",
};

const DEFAULT_SEO = {
  title: "MB Prestige Living | Luxe à Cotonou",
  description: "Découvrez l'excellence de l'hébergement haut de gamme à Cotonou. Studios, suites et penthouses de prestige pour vos séjours d'exception.",
  keywords: "luxe, cotonou, appartement, prestige, bénin, hébergement, voyage, business",
};

const DEFAULT_IMAGES = {
  logo: "/logo-mb.png",
  heroHome: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtZqPFxoHAv7gdOL2kboFlcS2MejPazTIEXdzNiCj5R2w0N6iacF39mZya6SezgDG4g_utcwicIq6JXWqE7LW3JXvuRT9z34IHNpNOd3F_Co1QeewzPWQ5LOczzYK6DPJ_pBmHS6Avduy8IDOl6b0Of0Ke80VJStdu2T0zYr5Cj4EQS1b0XGITrNWrNETpqRccKNZV18ruA7MVrIjjRs_n3uOWb-a6BB_cEsVR2HxLFl9KnrebXXFv2nCGZ_f0VElUyhp_AswSlko_",
  heroGallery: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLsDFUMeiSJrqxN3cahUmQAA7faoktitH4JWO9COq1wM7RXqDQ5u8g1v6OAQ4OrnZuJWGGSVbr6BLDnigmRnpHQ6HxKSrkyW_O56Ofpp3bGA5MAR2tQwH9HHpJQp2xzzbAd_WmPuvuzWTKYlYnNbGAlckrvJjULUJ4aaaJUcWrJRkHioU0-C1xERtKeiSAQNtp1PdvbxllHe-tUqjOi6N-lBNsOtV0NU_l22lQ2HNE3A9HHOGP2cnqUiO76dtQKypNMysgFXUQkoQj",
  heroBlog: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80",
  heroReviews: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80",
  testimonials: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZi_lifkDQ1mz1lAv36la9HouGHqIPhZegwU71lzVY0skTII13hAStM7QJWWJbHgXn2eaX9_atoxr00Vu8VNMIb3FeR4Eg45C_3vaW5T2kowP3uo7tL2IJBiQMHYjVqDYPwcedRL2G4jkKwSJK3-PXEEkBEIFECD2G3WzonrvUgOIQPipHYIOY2tqOlBKg1NsKVmxtLqp47MNN2KTp__BjyYwbJPiFGlmKtxOL-23NsJwlzwi5doySqvJB4sSKUrcUZi8Apef99Dlq",
};

type ViewType = "overview" | "theme" | "images" | "seo" | "reservations" | "users";

export default function Admin() {
  const [activeView, setActiveView] = useState<ViewType>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Theme State
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("site-theme");
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  });

  // SEO State
  const [seo, setSeo] = useState(() => {
    const saved = localStorage.getItem("site-seo");
    return saved ? JSON.parse(saved) : DEFAULT_SEO;
  });

  // Images State
  const [siteImages, setSiteImages] = useState(() => {
    const saved = localStorage.getItem("site-images");
    return saved ? JSON.parse(saved) : DEFAULT_IMAGES;
  });

  const [uploadingImages, setUploadingImages] = useState<Record<string, boolean>>({});
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadSettings() {
      const settings = await fetchSiteSettings();
      if (settings) {
        if (settings.theme && typeof settings.theme === 'object' && settings.theme.primary) {
          setTheme(settings.theme);
        }
        if (settings.seo && typeof settings.seo === 'object') {
          setSeo(settings.seo);
        }
        if (settings.images && typeof settings.images === 'object') {
          setSiteImages(settings.images);
        }
      }
    }

    void loadSettings();
  }, []);

  useEffect(() => {
    if (!theme) return;
    
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--secondary", theme.secondary);
    root.style.setProperty("--surface", theme.surface);
    root.style.setProperty("--on-surface", theme.onSurface);
    root.style.setProperty("--surface-variant", theme.surfaceVariant);
    root.style.setProperty("--on-surface-variant", theme.onSurfaceVariant);
    localStorage.setItem("site-theme", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    if (!seo) return;
    
    localStorage.setItem("site-seo", JSON.stringify(seo));
    document.title = seo.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", seo.description);
  }, [seo]);

  useEffect(() => {
    if (!siteImages) return;
    
    localStorage.setItem("site-images", JSON.stringify(siteImages));
  }, [siteImages]);

  const handleColorChange = (key: keyof typeof DEFAULT_THEME, value: string) => {
    setTheme((prev: typeof DEFAULT_THEME) => ({ ...prev, [key]: value }));
  };

  const handleSeoChange = (key: keyof typeof DEFAULT_SEO, value: string) => {
    setSeo((prev: typeof DEFAULT_SEO) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (key: keyof typeof DEFAULT_IMAGES, value: string) => {
    setSiteImages((prev: typeof DEFAULT_IMAGES) => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = async (key: keyof typeof DEFAULT_IMAGES, file: File) => {
    setUploadingImages(prev => ({ ...prev, [key]: true }));
    setUploadProgress(prev => ({ ...prev, [key]: 0 }));

    try {
      const result = await uploadSiteImage(file, key, (progress) => {
        setUploadProgress(prev => ({ ...prev, [key]: progress }));
      });

      if (result.success && result.url) {
        setSiteImages(prev => ({ ...prev, [key]: result.url! }));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert(`Erreur lors de l'upload: ${result.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      alert(`Erreur lors de l'upload: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setUploadingImages(prev => ({ ...prev, [key]: false }));
      setUploadProgress(prev => ({ ...prev, [key]: 0 }));
    }
  };

  const saveAll = async () => {
    try {
      const settings: SiteSettings = {
        theme,
        seo,
        images: siteImages,
      };

      await saveSiteSettings(settings);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Impossible d\u2019enregistrer les paramètres:', error);
      alert('Enregistrement impossible. Vérifiez la connexion au backend.');
    }
  };

  const resetAll = () => {
    if (window.confirm("Voulez-vous vraiment réinitialiser tous les paramètres ?")) {
      setTheme(DEFAULT_THEME);
      setSeo(DEFAULT_SEO);
      setSiteImages(DEFAULT_IMAGES);
    }
  };

  const menuItems = [
    { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: "theme", label: "Design & Thème", icon: Palette },
    { id: "images", label: "Médias & Images", icon: ImageIcon },
    { id: "seo", label: "Configuration SEO", icon: Globe },
    { id: "reservations", label: "Réservations", icon: CalendarCheck, badge: "Bientôt" },
    { id: "users", label: "Utilisateurs", icon: Users, badge: "Bientôt" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-on-surface font-body flex overflow-hidden">
      {/* Sidebar Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`fixed lg:relative z-50 h-full bg-surface border-r border-white/5 transition-all duration-300 ease-in-out ${isSidebarOpen ? "w-72 translate-x-0" : "w-0 lg:w-20 -translate-x-full lg:translate-x-0"} flex flex-col`}
      >
        <div className="p-6 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
            <img src={siteImages.logo} alt="Logo" className="w-6 h-6 object-contain" />
          </div>
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="overflow-hidden whitespace-nowrap">
              <h2 className="font-headline text-lg text-primary">Prestige Admin</h2>
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant">v2.4.0 • Enterprise</p>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as ViewType);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all group relative ${
                activeView === item.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
              }`}
            >
              <item.icon size={20} className={activeView === item.id ? "text-white" : "group-hover:text-primary transition-colors"} />
              {isSidebarOpen && (
                <span className="text-xs font-bold uppercase tracking-widest flex-1 text-left">{item.label}</span>
              )}
              {isSidebarOpen && item.badge && (
                <span className="text-[8px] px-2 py-0.5 bg-white/10 rounded-full text-on-surface-variant uppercase font-bold">
                  {item.badge}
                </span>
              )}
              {!isSidebarOpen && activeView === item.id && (
                <div className="absolute left-0 w-1 h-6 bg-primary rounded-r-full" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link to="/" className="flex items-center gap-4 p-3 rounded-xl text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-all">
            <ExternalLink size={20} />
            {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">Voir le site</span>}
          </Link>
          <button className="w-full flex items-center gap-4 p-3 rounded-xl text-secondary hover:bg-secondary/10 transition-all">
            <LogOut size={20} />
            {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
        {/* Top Header */}
        <header className="h-20 bg-surface/50 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors text-on-surface-variant"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs text-on-surface focus:border-primary outline-none w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors text-on-surface-variant">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-surface"></span>
            </button>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-on-surface">Admin MB</p>
                <p className="text-[9px] text-on-surface-variant uppercase tracking-widest">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-surface-variant border border-white/10 flex items-center justify-center text-primary font-bold">
                AD
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* View Switcher */}
            <AnimatePresence mode="wait">
              {activeView === "overview" && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-end">
                    <div>
                      <h2 className="text-3xl font-headline text-on-surface">Bienvenue, Admin</h2>
                      <p className="text-on-surface-variant mt-2">Voici l'état actuel de votre plateforme de prestige.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">Dernière mise à jour</p>
                      <p className="text-xs font-bold text-primary">Aujourd'hui, 10:30</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: "Réservations", value: "12", change: "+15%", icon: CalendarCheck, color: "text-primary" },
                      { label: "Visiteurs", value: "1,284", change: "+8%", icon: Users, color: "text-secondary" },
                      { label: "Revenus", value: "4.2M CFA", change: "+12%", icon: BarChart3, color: "text-green-500" },
                      { label: "Performance", value: "98%", change: "+2%", icon: Zap, color: "text-yellow-500" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-surface p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                          <div className={`p-3 rounded-xl bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                            <stat.icon size={24} />
                          </div>
                          <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">{stat.change}</span>
                        </div>
                        <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
                        <h3 className="text-2xl font-headline mt-1">{stat.value}</h3>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-surface p-8 rounded-2xl border border-white/5">
                      <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-headline">Activité Récente</h3>
                        <button className="text-[10px] uppercase tracking-widest text-primary font-bold">Voir tout</button>
                      </div>
                      <div className="space-y-6">
                        {[
                          { user: "Jean Dupont", action: "a réservé la Suite Prestige", time: "Il y a 2h", status: "Confirmé" },
                          { user: "Marie K.", action: "a laissé un nouvel avis", time: "Il y a 5h", status: "Nouveau" },
                          { user: "Système", action: "Mise à jour du thème effectuée", time: "Hier", status: "Système" },
                        ].map((activity, i) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center text-xs font-bold">
                                {activity.user[0]}
                              </div>
                              <div>
                                <p className="text-sm font-bold"><span className="text-primary">{activity.user}</span> {activity.action}</p>
                                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest mt-1">{activity.time}</p>
                              </div>
                            </div>
                            <span className="text-[9px] px-2 py-1 bg-primary/10 text-primary rounded-full font-bold uppercase">{activity.status}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-surface p-8 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-headline mb-6">Sécurité</h3>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4 p-4 bg-green-500/5 rounded-xl border border-green-500/10 text-green-500">
                            <ShieldCheck size={24} />
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest">SSL Actif</p>
                              <p className="text-[10px] opacity-80">Connexion sécurisée</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-xl border border-primary/10 text-primary">
                            <Settings size={24} />
                            <div>
                              <p className="text-xs font-bold uppercase tracking-widest">Backup</p>
                              <p className="text-[10px] opacity-80">Dernier: Aujourd'hui 04:00</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-br from-primary to-secondary p-8 rounded-2xl text-white relative overflow-hidden group">
                        <div className="relative z-10">
                          <h3 className="text-lg font-headline mb-2">Support VIP</h3>
                          <p className="text-xs opacity-90 leading-relaxed mb-6">Besoin d'aide pour une configuration complexe ? Nos experts sont là.</p>
                          <button className="px-6 py-2 bg-white text-primary text-[10px] font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform">
                            Contacter
                          </button>
                        </div>
                        <LayoutDashboard size={120} className="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-110 transition-transform duration-700" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === "theme" && (
                <motion.div 
                  key="theme"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-headline text-on-surface">Design & Thème</h2>
                      <p className="text-on-surface-variant mt-2">Personnalisez l'identité visuelle de votre plateforme.</p>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={resetAll} className="p-3 hover:bg-white/5 rounded-xl transition-colors text-on-surface-variant">
                        <RotateCcw size={20} />
                      </button>
                      <button onClick={saveAll} className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                        <Save size={16} /> Enregistrer
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-surface p-8 rounded-2xl border border-white/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Object.entries(theme).map(([key, value]) => (
                          <div key={key} className="space-y-3">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                              {key === "primary" ? "Couleur Primaire" : 
                               key === "secondary" ? "Couleur Secondaire" : 
                               key === "surface" ? "Arrière-plan" : 
                               key === "onSurface" ? "Texte Principal" : 
                               key === "surfaceVariant" ? "Surface Variante" : "Texte Variante"}
                            </label>
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                              <input 
                                type="color" 
                                value={value as string}
                                onChange={(e) => handleColorChange(key as keyof typeof DEFAULT_THEME, e.target.value)}
                                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-2 border-white/10"
                              />
                              <input 
                                type="text" 
                                value={value as string}
                                onChange={(e) => handleColorChange(key as keyof typeof DEFAULT_THEME, e.target.value)}
                                className="flex-1 bg-transparent text-sm font-mono outline-none uppercase"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-surface p-8 rounded-2xl border border-white/5 space-y-8">
                      <h3 className="text-lg font-headline">Aperçu Direct</h3>
                      <div className="p-8 rounded-2xl space-y-6 border border-white/5" style={{ backgroundColor: theme.surface, color: theme.onSurface }}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ backgroundColor: theme.primary }}>MB</div>
                          <h4 className="font-headline text-lg" style={{ color: theme.primary }}>Prestige</h4>
                        </div>
                        <p className="text-sm opacity-80 leading-relaxed">L'excellence redéfinie à travers chaque pixel.</p>
                        <div className="flex gap-4">
                          <div className="h-10 flex-1 rounded-lg" style={{ backgroundColor: theme.primary }}></div>
                          <div className="h-10 flex-1 rounded-lg" style={{ backgroundColor: theme.secondary }}></div>
                        </div>
                      </div>
                      <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                        <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2">Conseil Pro</p>
                        <p className="text-xs text-on-surface-variant leading-relaxed">Utilisez des teintes dorées et sombres pour maintenir l'aspect luxueux.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === "images" && (
                <motion.div 
                  key="images"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-headline text-on-surface">Médias & Images</h2>
                      <p className="text-on-surface-variant mt-2">Gérez les visuels qui définissent l'ambiance de votre site.</p>
                    </div>
                    <button onClick={saveAll} className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                      <Save size={16} /> Enregistrer
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                      <div className="bg-surface p-8 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-headline mb-8">Identité (Logo)</h3>
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                          <div className="w-32 h-32 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-4 overflow-hidden group relative">
                            <img src={siteImages.logo} alt="Logo" className="max-w-full max-h-full object-contain transition-transform group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <ImageIcon className="text-white" size={24} />
                            </div>
                          </div>
                          <div className="flex-1 space-y-4 w-full">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Upload du Logo</label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileUpload("logo", file);
                                }
                              }}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-on-surface focus:border-primary outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                              disabled={uploadingImages.logo}
                            />
                            {uploadingImages.logo && (
                              <p className="text-[10px] text-primary">Upload en cours...</p>
                            )}
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Ou URL du Logo</label>
                            <input
                              type="text"
                              value={siteImages.logo}
                              onChange={(e) => handleImageChange("logo", e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-on-surface focus:border-primary outline-none transition-all"
                            />
                            <p className="text-[10px] text-on-surface-variant italic">Format recommandé: PNG transparent, 512x512px.</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-surface p-8 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-headline mb-8">Images de Fond (Hero)</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {[
                            { key: "heroHome", label: "Accueil" },
                            { key: "heroGallery", label: "Galerie" },
                            { key: "heroBlog", label: "Blog" },
                            { key: "heroReviews", label: "Avis" },
                            { key: "testimonials", label: "Témoignages" },
                          ].map((item) => (
                            <div key={item.key} className="space-y-3">
                              <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{item.label}</label>

                              {/* File Upload */}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleFileUpload(item.key as keyof typeof DEFAULT_IMAGES, file);
                                  }
                                }}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-on-surface focus:border-primary outline-none transition-all file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80 mb-2"
                                disabled={uploadingImages[item.key]}
                              />

                              {uploadingImages[item.key] && (
                                <div className="mt-2">
                                  <div className="flex justify-between items-center mb-1">
                                    <p className="text-[10px] text-primary">Upload en cours...</p>
                                    <p className="text-[10px] text-primary">{uploadProgress[item.key] || 0}%</p>
                                  </div>
                                  <div className="w-full bg-white/10 rounded-full h-2">
                                    <div
                                      className="bg-primary h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${uploadProgress[item.key] || 0}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}

                              {/* URL Input */}
                              <div className="relative group">
                                <input
                                  type="text"
                                  value={siteImages[item.key as keyof typeof DEFAULT_IMAGES]}
                                  onChange={(e) => handleImageChange(item.key as keyof typeof DEFAULT_IMAGES, e.target.value)}
                                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pr-16 text-xs text-on-surface focus:border-primary outline-none transition-all"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                                  <img src={siteImages[item.key as keyof typeof DEFAULT_IMAGES]} className="w-full h-full object-cover" />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-surface p-8 rounded-2xl border border-white/5 h-fit">
                      <h3 className="text-lg font-headline mb-6">Optimisation Médias</h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-xs text-on-surface-variant">Compression Auto</span>
                          <div className="w-10 h-5 bg-primary rounded-full relative">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                          <span className="text-xs text-on-surface-variant">Lazy Loading</span>
                          <div className="w-10 h-5 bg-primary rounded-full relative">
                            <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/10">
                          <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mb-2">Attention</p>
                          <p className="text-xs text-on-surface-variant leading-relaxed">Les images trop lourdes peuvent ralentir l'expérience utilisateur.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === "seo" && (
                <motion.div 
                  key="seo"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-headline text-on-surface">Configuration SEO</h2>
                      <p className="text-on-surface-variant mt-2">Optimisez votre visibilité sur les moteurs de recherche.</p>
                    </div>
                    <button onClick={saveAll} className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20">
                      <Save size={16} /> Enregistrer
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-surface p-8 rounded-2xl border border-white/5 space-y-8">
                      <div className="space-y-4">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Titre de la page (Meta Title)</label>
                        <input 
                          type="text" 
                          value={seo.title}
                          onChange={(e) => handleSeoChange("title", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-on-surface focus:border-primary outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Description (Meta Description)</label>
                        <textarea 
                          value={seo.description}
                          onChange={(e) => handleSeoChange("description", e.target.value)}
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-on-surface focus:border-primary outline-none transition-all resize-none"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Mots-clés (Keywords)</label>
                        <input 
                          type="text" 
                          value={seo.keywords}
                          onChange={(e) => handleSeoChange("keywords", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-on-surface focus:border-primary outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="bg-surface p-8 rounded-2xl border border-white/5">
                        <h3 className="text-lg font-headline mb-6">Aperçu Google</h3>
                        <div className="space-y-2">
                          <p className="text-[#1a0dab] text-xl hover:underline cursor-pointer truncate">{seo.title}</p>
                          <p className="text-[#006621] text-sm truncate">https://mbprestigeliving.com</p>
                          <p className="text-[#4d5156] text-sm line-clamp-2">{seo.description}</p>
                        </div>
                      </div>
                      <div className="bg-primary/5 p-8 rounded-2xl border border-primary/10">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-4">Score SEO</h4>
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent flex items-center justify-center text-lg font-bold">
                            85
                          </div>
                          <p className="text-xs text-on-surface-variant">Votre configuration est excellente pour le référencement.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {(activeView === "reservations" || activeView === "users") && (
                <motion.div 
                  key="coming-soon"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6"
                >
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Settings size={48} className="animate-spin-slow" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-headline text-on-surface">Module en développement</h2>
                    <p className="text-on-surface-variant mt-2 max-w-md mx-auto">
                      Nous travaillons activement sur cette fonctionnalité pour vous offrir une gestion complète de vos {activeView === "reservations" ? "réservations" : "utilisateurs"}.
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveView("overview")}
                    className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                  >
                    Retour au tableau de bord
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Success Notification */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 right-8 bg-green-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-4 z-50"
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Check size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">Succès !</p>
                <p className="text-xs opacity-90">Vos modifications ont été enregistrées.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
