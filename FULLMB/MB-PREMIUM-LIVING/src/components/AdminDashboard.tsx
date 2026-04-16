import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, Save, RotateCcw, Palette, Globe, Image as ImageIcon, 
  Settings, Check, AlertCircle, LayoutDashboard, Users, 
  CalendarCheck, BarChart3, Bell, Search, Menu, X, 
  LogOut, ExternalLink, ShieldCheck, Zap, Home, BookOpen, Star, 
  DollarSign, Calendar
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchSiteSettings, saveSiteSettings, SiteSettings } from "../services/siteSettings";
import AppartementsAdmin from "./admin/AppartementsAdmin";
import ArticlesAdmin from "./admin/ArticlesAdmin";
import AvisAdmin from "./admin/AvisAdmin";
import ReservationsAdmin from "./admin/ReservationsAdmin";
import ClientsAdmin from "./admin/ClientsAdmin";
import TarifsAdmin from "./admin/TarifsAdmin";
import DisponibiliteAdmin from "./admin/DisponibiliteAdmin";
import PaiementsAdmin from "./admin/PaiementsAdmin";
import FeaturedGalleryAdmin from "./admin/FeaturedGalleryAdmin";
import { uploadSiteImage } from "../services/siteImages";


const DEFAULT_THEME = {
  primary: "#B8974A",
  secondary: "#C07055",
  surface: "#131313",
  onSurface: "#D4C9B4",
  surfaceVariant: "#353534",
  onSurfaceVariant: "#998f81",
  buttonText: "#ffffff",
};

const DEFAULT_SEO = {
  title: "MB Prestige Living | Luxe à Cotonou",
  description: "Découvrez l'excellence de l'hébergement haut de gamme à Cotonou.",
  keywords: "luxe, cotonou, appartement, prestige, bénin",
};

const DEFAULT_IMAGES = {
  logo: "/logo-mb.png",
  heroHome: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
  heroGallery: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80",
  heroBlog: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&q=80",
  heroReviews: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80",
  testimonials: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80",
  presentationImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCJb9yfTsdMbMfhsQ0Sqhwmrc6KXDKecobuEoE3uJufhAB7lOCJ6oGRmwRhxOyqZw0zcP-vY5ovOz5J7KkVploedzbVBvM4VYD0839tOJ_TO3NzHf7sjYm8mEbPrAMFCr6PVXeoR3T7FkSQNY2AGtKVqlwBOoA219ExafzeohzB7W7GmXAmrnJEwBdeWExs0JqAF4qcqdCL7I2xXxfFDb--XI4aFlywwyLSWIxXvVqyh31nQx83ZdNIX8n431hHZ_XhiL-PZn9GZY0R"
};

type ViewType = "overview" | "theme" | "images" | "seo" | "appartements" | "articles" | "avis" | "reservations" | "clients" | "tarifs" | "disponibilites" | "paiements" | "gallerie";

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<ViewType>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [theme, setTheme ] = useState(() => {
    const saved = localStorage.getItem("site-theme");
    return saved ? JSON.parse(saved) : DEFAULT_THEME;
  });

  const [seo, setSeo] = useState(() => {
    const saved = localStorage.getItem("site-seo");
    return saved ? JSON.parse(saved) : DEFAULT_SEO;
  });

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
    // Set CSS variable for button text color
    root.style.setProperty("--button-text", theme.buttonText || "#ffffff");
  }, [theme]);

  useEffect(() => {
    if (!seo) return;
    
    localStorage.setItem("site-seo", JSON.stringify(seo));
    document.title = seo.title;
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
        setUploadProgress((prev: Record<string, number>) => ({ ...prev, [key]: progress }));
      });

      if (result.success && result.url) {
        setSiteImages((prev: typeof DEFAULT_IMAGES) => ({ ...prev, [key]: result.url! }));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        alert(`Erreur lors de l'upload: ${result.error || 'Erreur inconnue'}`);
      }
    } catch (error) {
      alert(`Erreur lors de l'upload: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setUploadingImages((prev: Record<string, boolean>) => ({ ...prev, [key]: false }));
      setUploadProgress((prev: Record<string, number>) => ({ ...prev, [key]: 0 }));
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
      console.error('Erreur:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const resetAll = () => {
    if (window.confirm("Réinitialiser tous les paramètres ?")) {
      setTheme(DEFAULT_THEME);
      setSeo(DEFAULT_SEO);
      setSiteImages(DEFAULT_IMAGES);
    }
  };

  const menuItems = [
    { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
    { id: "appartements", label: "Appartements", icon: Home },
    { id: "gallerie", label: "Galerie", icon: ImageIcon },
    { id: "articles", label: "Articles Blog", icon: BookOpen },
    { id: "avis", label: "Avis Clients", icon: Star },
    { id: "reservations", label: "Réservations", icon: CalendarCheck },
    { id: "clients", label: "Clients", icon: Users },
    { id: "tarifs", label: "Tarifs", icon: DollarSign },
    { id: "disponibilites", label: "Disponibilités", icon: Calendar },
    { id: "paiements", label: "Paiements", icon: BarChart3 },
    { id: "theme", label: "Design & Thème", icon: Palette },
    { id: "images", label: "Médias", icon: ImageIcon },
    { id: "seo", label: "Configuration", icon: Globe },
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
        className={`fixed lg:relative z-50 h-full bg-surface border-r border-white/5 transition-all duration-300 ${isSidebarOpen ? "w-72 translate-x-0" : "w-0 lg:w-20 -translate-x-full lg:translate-x-0"} flex flex-col`}
      >
        <div className="p-6 flex items-center gap-4 border-b border-white/5">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shrink-0">
            <span className="text-white font-headline">MB</span>
          </div>
          {isSidebarOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="font-headline text-lg text-primary">Admin</h2>
              <p className="text-[9px] uppercase tracking-widest text-on-surface-variant">Dashboard</p>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id as ViewType);
                if (window.innerWidth < 1024) setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeView === item.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
              }`}
            >
              <item.icon size={18} />
              {isSidebarOpen && (
                <span className="text-xs font-bold uppercase tracking-widest flex-1 text-left">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <Link to="/" className="flex items-center gap-3 p-3 rounded-lg text-on-surface-variant hover:bg-white/5 transition-all">
            <ExternalLink size={18} />
            {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">Voir le site</span>}
          </Link>
          <button className="w-full flex items-center gap-3 p-3 rounded-lg text-secondary hover:bg-secondary/10 transition-all">
            <LogOut size={18} />
            {isSidebarOpen && <span className="text-xs font-bold uppercase tracking-widest">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0a0a0a]">
        {/* Header */}
        <header className="h-20 bg-surface/50 backdrop-blur-xl border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-6 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg text-on-surface-variant"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative hidden md:block flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs text-on-surface focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-white/5 rounded-lg text-on-surface-variant">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full"></span>
            </button>
            <div className="h-8 w-[1px] bg-white/10"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold">Admin</p>
                <p className="text-[9px] text-on-surface-variant uppercase">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                AD
              </div>
            </div>
          </div>

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed top-4 right-4 bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg flex items-center gap-2"
            >
              <Check size={18} /> Enregistré avec succès!
            </motion.div>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {activeView === "overview" && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-3xl font-headline">Bienvenue, Admin MB</h2>
                    <p className="text-on-surface-variant mt-2">Gérez votre plateforme de prestige</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { label: "Appartements", value: "3", icon: Home, color: "text-primary" },
                      { label: "Articles", value: "12", icon: BookOpen, color: "text-secondary" },
                      { label: "Réservations", value: "24", icon: CalendarCheck, color: "text-green-500" },
                      { label: "Avis", value: "156", icon: Star, color: "text-yellow-500" },
                    ].map((stat, i) => (
                      <div key={i} className="bg-surface p-6 rounded-xl border border-white/5 hover:border-primary/30 transition-all">
                        <div className={`p-3 rounded-lg bg-white/5 ${stat.color} w-fit mb-4`}>
                          <stat.icon size={24} />
                        </div>
                        <p className="text-on-surface-variant text-[10px] uppercase tracking-widest font-bold">{stat.label}</p>
                        <h3 className="text-3xl font-headline mt-1">{stat.value}</h3>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeView === "appartements" && (
                <motion.div
                  key="appartements"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <AppartementsAdmin />
                </motion.div>
              )}

              {activeView === "articles" && (
                <motion.div
                  key="articles"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ArticlesAdmin />
                </motion.div>
              )}

              {activeView === "avis" && (
                <motion.div
                  key="avis"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <AvisAdmin />
                </motion.div>
              )}

              {activeView === "reservations" && (
                <motion.div
                  key="reservations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ReservationsAdmin />
                </motion.div>
              )}

              {activeView === "clients" && (
                <motion.div
                  key="clients"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <ClientsAdmin />
                </motion.div>
              )}

              {activeView === "tarifs" && (
                <motion.div
                  key="tarifs"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <TarifsAdmin />
                </motion.div>
              )}

              {activeView === "disponibilites" && (
                <motion.div
                  key="disponibilites"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <DisponibiliteAdmin />
                </motion.div>
              )}

              {activeView === "paiements" && (
                <motion.div
                  key="paiements"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <PaiementsAdmin />
                </motion.div>
              )}

              {activeView === "gallerie" && (
                <motion.div
                  key="gallerie"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <FeaturedGalleryAdmin />
                </motion.div>
              )}

              {activeView === "theme" && (
                <motion.div
                  key="theme"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-headline">Design & Thème</h2>
                      <p className="text-on-surface-variant mt-2">Personnalisez l'apparence de votre site</p>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={resetAll} className="p-3 hover:bg-white/5 rounded-lg transition-colors">
                        <RotateCcw size={20} />
                      </button>
                      <button onClick={saveAll} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold uppercase text-[10px]">
                        <Save size={16} /> Enregistrer
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-surface p-8 rounded-xl border border-white/5 space-y-6">
                      {Object.entries(theme).map(([key, value]) => (
                        <div key={key}>
                          <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                            {key === 'buttonText' ? 'Couleur texte bouton' : key}
                          </label>
                          <div className="flex items-center gap-3">
                            <input
                              type="color"
                              value={value as string}
                              onChange={(e) => handleColorChange(key as keyof typeof DEFAULT_THEME, e.target.value)}
                              className="h-10 w-16 rounded cursor-pointer border border-white/10"
                            />
                            <input
                              type="text"
                              value={value as string}
                              onChange={(e) => handleColorChange(key as keyof typeof DEFAULT_THEME, e.target.value)}
                              className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-sm font-mono"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-surface p-8 rounded-xl border border-white/5">
                      <h3 className="font-headline mb-6">Aperçu du Thème</h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg" style={{ backgroundColor: theme.surface }}>
                          <p style={{ color: theme.onSurface }}>Texte principal</p>
                        </div>
                        <button className="w-full py-3 rounded-lg font-bold" style={{ backgroundColor: theme.primary, color: theme.buttonText }}>
                          Bouton Primaire
                        </button>
                        <button className="w-full py-3 rounded-lg font-bold" style={{ backgroundColor: theme.secondary, color: theme.buttonText }}>
                          Bouton Secondaire
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === "images" && (
                <motion.div
                  key="images"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-headline">Médias & Images</h2>
                      <p className="text-on-surface-variant mt-2">Gérez les images de votre site</p>
                    </div>
                    <button onClick={saveAll} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold uppercase text-[10px]">
                      <Save size={16} /> Enregistrer
                    </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {Object.entries(DEFAULT_IMAGES).map(([key, defaultValue]) => {
                      const value = siteImages[key] || defaultValue;
                      return (
                      <div key={key} className="bg-surface p-8 rounded-xl border border-white/5">
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-4">
                          {key}
                        </label>

                        {/* File Upload Input */}
                        <div className="mb-4">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(key as keyof typeof DEFAULT_IMAGES, file);
                              }
                            }}
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/80"
                            disabled={uploadingImages[key]}
                          />
                          {uploadingImages[key] && (
                            <div className="mt-2">
                              <div className="flex justify-between items-center mb-1">
                                <p className="text-[10px] text-primary">Upload en cours...</p>
                                <p className="text-[10px] text-primary">{uploadProgress[key] || 0}%</p>
                              </div>
                              <div className="w-full bg-white/10 rounded-full h-2">
                                <div
                                  className="bg-primary h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress[key] || 0}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* URL Input (fallback) */}
                        <input
                          type="text"
                          value={value as string}
                          onChange={(e) => handleImageChange(key as keyof typeof DEFAULT_IMAGES, e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm mb-4"
                          placeholder="URL de l'image (optionnel)"
                        />

                        {/* Image Preview */}
                        {(value as string)?.startsWith('http') && (
                                 <img
                src={value as string}
                alt={key}
                className="w-full h-40 object-cover rounded-lg border border-white/5"
                referrerPolicy="no-referrer"
              />
            )}
          </div>
        );
      })}
    </div>
  </motion.div>
              )}

              {activeView === "seo" && (
                <motion.div
                  key="seo"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-headline">Configuration SEO</h2>
                      <p className="text-on-surface-variant mt-2">Optimisez votre référencement</p>
                    </div>
                    <button onClick={saveAll} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold uppercase text-[10px]">
                      <Save size={16} /> Enregistrer
                    </button>
                  </div>

                  <div className="bg-surface p-8 rounded-xl border border-white/5 space-y-6">
                    {Object.entries(seo).map(([key, value]) => (
                      <div key={key}>
                        <label className="block text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">
                          {key}
                        </label>
                        {key === 'keywords' ? (
                          <textarea
                            value={value as string}
                            onChange={(e) => handleSeoChange(key as keyof typeof DEFAULT_SEO, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm h-24"
                          />
                        ) : (
                          <input
                            type="text"
                            value={value as string}
                            onChange={(e) => handleSeoChange(key as keyof typeof DEFAULT_SEO, e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
