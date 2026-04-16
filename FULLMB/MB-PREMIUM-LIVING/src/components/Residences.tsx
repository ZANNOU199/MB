import { useState, useEffect, useRef, MouseEvent } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Grid, 
  Maximize2, 
  Share2, 
  Heart,
  Wifi,
  Wind,
  Tv,
  Coffee,
  UtensilsCrossed,
  Briefcase,
  ShowerHead,
  Bath,
  BedDouble,
  ShieldCheck,
  Car,
  Key,
  Baby,
  Thermometer,
  Zap,
  UserCheck,
  Sparkles,
  Calendar,
  Microwave,
  Refrigerator,
  WashingMachine,
  Circle
} from "lucide-react";
import { IMAGES } from "../constants";

const AMENITIES_CATEGORIES = [
  {
    title: "Salle de bain",
    items: ["Sèche-cheveux", "Shampoing", "Eau chaude", "Gel douche"]
  },
  {
    title: "Chambre et linge",
    items: ["Lave-linge", "Sèche-linge", "Produits de base", "Serviettes, draps, savon et papier toilette", "Cintres", "Linge de lit", "Stores occultants", "Fer à repasser"]
  },
  {
    title: "Divertissement",
    items: ["TV avec abonnement standard au câble"]
  },
  {
    title: "Famille",
    items: ["Berceau : disponible sur demande", "Chaise haute : disponible sur demande", "Grilles de fenêtre", "Recommandations de baby-sitters"]
  },
  {
    title: "Chauffage et climatisation",
    items: ["Climatisation", "Ventilateurs portables", "Chauffage"]
  },
  {
    title: "Sécurité à la maison",
    items: ["Détecteur de fumée", "Détecteur de monoxyde de carbone", "Extincteur", "Trousse de premiers secours"]
  },
  {
    title: "Internet et bureau",
    items: ["Wifi", "Espace de travail dédié"]
  },
  {
    title: "Cuisine et salle à manger",
    items: ["Cuisine", "Espace où les voyageurs peuvent cuisiner", "Réfrigérateur", "Four à micro-ondes", "Équipements de cuisine de base", "Casseroles et poêles, huile, sel et poivre", "Vaisselle et couverts", "Bols, baguettes, assiettes, tasses, etc.", "Lave-vaisselle", "Cuisinière", "Four", "Bouilloire électrique", "Machine à café", "Grille-pain"]
  },
  {
    title: "Caractéristiques de l'emplacement",
    items: ["Entrée privée", "Entrée par une rue différente ou un immeuble séparé"]
  },
  {
    title: "Parking et installations",
    items: ["Stationnement payant à l'extérieur de la propriété", "Logement de plain-pied", "Pas d'escaliers dans le logement"]
  },
  {
    title: "Services",
    items: ["Séjours longue durée autorisés", "Séjours de 28 jours ou plus autorisés", "Arrivée autonome", "Serrure numérique", "Accédez à la maison avec un code", "Ménage disponible pendant le séjour"]
  }
];

const APARTMENTS = [
  {
    id: "studio",
    name: "Studio Exécutif",
    size: "45 m²",
    price: "85,000 FCFA",
    desc: "L'équilibre parfait entre fonctionnalité et esthétique pour vos séjours d'affaires. Profitez d'un espace optimisé avec un coin bureau dédié, une kitchenette équipée et une literie de haute qualité.",
    amenities: AMENITIES_CATEGORIES,
    images: [
      IMAGES.studio,
      "https://picsum.photos/seed/studio1/1200/800",
      "https://picsum.photos/seed/studio2/1200/800",
      "https://picsum.photos/seed/studio3/1200/800",
      "https://picsum.photos/seed/studio4/1200/800",
      "https://picsum.photos/seed/studio5/1200/800",
      "https://picsum.photos/seed/studio6/1200/800",
      "https://picsum.photos/seed/studio7/1200/800",
      "https://picsum.photos/seed/studio8/1200/800",
      "https://picsum.photos/seed/studio9/1200/800",
    ],
  },
  {
    id: "suite",
    name: "Suite Prestige",
    size: "85 m²",
    price: "150,000 FCFA",
    desc: "Un espace généreux avec salon privé et finitions de haute facture. La Suite Prestige offre une séparation élégante entre l'espace de vie et la chambre, idéale pour recevoir ou se détendre en toute intimité.",
    amenities: AMENITIES_CATEGORIES,
    images: [
      IMAGES.suite,
      "https://picsum.photos/seed/suite1/1200/800",
      "https://picsum.photos/seed/suite2/1200/800",
      "https://picsum.photos/seed/suite3/1200/800",
      "https://picsum.photos/seed/suite4/1200/800",
      "https://picsum.photos/seed/suite5/1200/800",
      "https://picsum.photos/seed/suite6/1200/800",
      "https://picsum.photos/seed/suite7/1200/800",
      "https://picsum.photos/seed/suite8/1200/800",
      "https://picsum.photos/seed/suite9/1200/800",
    ],
    offset: true,
  },
  {
    id: "penthouse",
    name: "The Penthouse",
    size: "210 m²",
    price: "350,000 FCFA",
    desc: "Une résidence d'exception avec terrasse panoramique sur les toits de Cotonou. Le Penthouse redéfinit le luxe avec ses volumes spectaculaires, sa cuisine gastronomique et sa vue imprenable sur l'océan.",
    amenities: AMENITIES_CATEGORIES,
    images: [
      IMAGES.penthouse,
      "https://picsum.photos/seed/pent1/1200/800",
      "https://picsum.photos/seed/pent2/1200/800",
      "https://picsum.photos/seed/pent3/1200/800",
      "https://picsum.photos/seed/pent4/1200/800",
      "https://picsum.photos/seed/pent5/1200/800",
      "https://picsum.photos/seed/pent6/1200/800",
      "https://picsum.photos/seed/pent7/1200/800",
      "https://picsum.photos/seed/pent8/1200/800",
      "https://picsum.photos/seed/pent9/1200/800",
    ],
  },
];

function ApartmentSlider({ images, onImageClick }: { images: string[], onImageClick?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const isDragging = useRef(false);

  const slideNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const slidePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDragStart = () => {
    isDragging.current = true;
  };

  const handleDragEnd = (_: any, info: { offset: { x: number }, velocity: { x: number } }) => {
    setTimeout(() => {
      isDragging.current = false;
    }, 50);

    const swipe = Math.abs(info.offset.x) > 50 || Math.abs(info.velocity.x) > 500;
    if (swipe) {
      if (info.offset.x < 0) {
        slideNext();
      } else {
        slidePrev();
      }
    }
  };

  const handleClick = (e: MouseEvent) => {
    if (isDragging.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    // If clicking in the middle (center 40%), open details
    if (x > rect.width * 0.3 && x < rect.width * 0.7) {
      onImageClick?.();
    } else if (x < rect.width / 2) {
      slidePrev();
    } else {
      slideNext();
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0
    })
  };

  return (
    <div className="relative aspect-[4/5] overflow-hidden group/slider cursor-pointer bg-surface select-none">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleClick}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </AnimatePresence>

      {/* Counter */}
      <div className="absolute bottom-4 right-4 z-30 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest pointer-events-none">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}

function DetailsModal({ apt, isOpen, onClose }: { apt: any, isOpen: boolean, onClose: () => void }) {
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!isOpen || !apt) return null;

  const getAmenityIcon = (name: string) => {
    if (!name) return <Circle size={18} className="opacity-20" />;
    const lower = String(name).toLowerCase();
    if (lower.includes("wifi")) return <Wifi size={18} />;
    if (lower.includes("climatisation") || lower.includes("ventilateur")) return <Wind size={18} />;
    if (lower.includes("tv")) return <Tv size={18} />;
    if (lower.includes("cuisine") || lower.includes("casseroles") || lower.includes("vaisselle")) return <UtensilsCrossed size={18} />;
    if (lower.includes("café") || lower.includes("nespresso")) return <Coffee size={18} />;
    if (lower.includes("réfrigérateur")) return <Refrigerator size={18} />;
    if (lower.includes("micro-ondes")) return <Microwave size={18} />;
    if (lower.includes("lave-linge")) return <WashingMachine size={18} />;
    if (lower.includes("sèche-linge")) return <Wind size={18} />;
    if (lower.includes("bureau") || lower.includes("travail")) return <Briefcase size={18} />;
    if (lower.includes("douche") || lower.includes("shampoing") || lower.includes("gel")) return <ShowerHead size={18} />;
    if (lower.includes("baignoire")) return <Bath size={18} />;
    if (lower.includes("lit") || lower.includes("chambre") || lower.includes("serviettes") || lower.includes("linge")) return <BedDouble size={18} />;
    if (lower.includes("sécurité") || lower.includes("détecteur") || lower.includes("extincteur")) return <ShieldCheck size={18} />;
    if (lower.includes("parking") || lower.includes("stationnement")) return <Car size={18} />;
    if (lower.includes("entrée") || lower.includes("serrure") || lower.includes("code")) return <Key size={18} />;
    if (lower.includes("berceau") || lower.includes("chaise haute") || lower.includes("baby-sitter")) return <Baby size={18} />;
    if (lower.includes("chauffage")) return <Thermometer size={18} />;
    if (lower.includes("sèche-cheveux")) return <Zap size={18} />;
    if (lower.includes("arrivée autonome")) return <UserCheck size={18} />;
    if (lower.includes("ménage")) return <Sparkles size={18} />;
    if (lower.includes("longue durée")) return <Calendar size={18} />;
    return <Circle size={18} className="opacity-20" />;
  };

  const totalEquipements = Array.isArray(apt.equipements) ? apt.equipements.length : 0;
  const previewEquipements = Array.isArray(apt.equipements)
    ? apt.equipements.filter(eq => eq && typeof eq === 'object' && ('label' in eq || 'icon' in eq)).slice(0, 10)
    : [];

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
      >
        <div className="absolute inset-0 bg-surface/95 backdrop-blur-md" onClick={onClose} />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-6xl max-h-[90vh] bg-surface border border-white/10 overflow-hidden flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/5 bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={24} />
              </button>
              <h2 className="font-headline text-xl md:text-2xl">{apt.name || apt.titre_fr || 'Appartement'}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <Share2 size={20} />
              </button>
              <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <Heart size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
            {/* Image Grid Layout (Airbnb Style) */}
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[500px] mb-12 rounded-2xl overflow-hidden relative group">
              <div className="col-span-2 row-span-2 overflow-hidden">
                    {Array.isArray(apt.images) && apt.images[0] && (
                      <img src={apt.images[0]} className="w-full h-full object-cover hover:brightness-90 transition-all cursor-pointer" referrerPolicy="no-referrer" alt="Photo principale" />
                    )}
              </div>
              <div className="overflow-hidden">
                {Array.isArray(apt.images) && apt.images[1] && (
                  <img src={apt.images[1]} className="w-full h-full object-cover hover:brightness-90 transition-all cursor-pointer" referrerPolicy="no-referrer" />
                )}
              </div>
              <div className="overflow-hidden">
                {Array.isArray(apt.images) && apt.images[2] && (
                  <img src={apt.images[2]} className="w-full h-full object-cover hover:brightness-90 transition-all cursor-pointer" referrerPolicy="no-referrer" />
                )}
              </div>
              <div className="overflow-hidden">
                {Array.isArray(apt.images) && apt.images[3] && (
                  <img src={apt.images[3]} className="w-full h-full object-cover hover:brightness-90 transition-all cursor-pointer" referrerPolicy="no-referrer" />
                )}
              </div>
              <div className="overflow-hidden">
                {Array.isArray(apt.images) && apt.images[4] && (
                  <img src={apt.images[4]} className="w-full h-full object-cover hover:brightness-90 transition-all cursor-pointer" referrerPolicy="no-referrer" />
                )}
              </div>

              <button 
                onClick={() => setShowAllPhotos(true)}
                className="absolute bottom-6 right-6 bg-white text-surface px-4 py-2 rounded-lg flex items-center gap-2 text-xs font-bold shadow-xl hover:scale-105 transition-transform"
              >
                <Grid size={16} />
                Afficher toutes les photos
              </button>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              <div className="md:col-span-2 space-y-8">
                <div>
                  <h3 className="font-headline text-2xl mb-4">À propos de ce logement</h3>
                  <p className="text-on-surface-variant leading-relaxed font-light">
                    {apt.desc}
                  </p>
                </div>

                <div className="pt-8 border-t border-white/5">
                  <h3 className="font-headline text-xl mb-6">Ce que propose ce logement</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {previewEquipements.map((eq, idx) => (
                      <div key={idx + '-' + (eq.label || '') + '-' + (eq.icon || '')} className="flex items-center gap-4 text-on-surface-variant text-sm">
                        <div className="text-secondary shrink-0">
                          {getAmenityIcon(eq.icon || eq.label || '')}
                        </div>
                        {eq.label || '[Équipement]'}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setShowAllAmenities(true)}
                    className="px-6 py-3 border border-on-surface text-on-surface rounded-lg text-sm font-bold hover:bg-white/5 transition-colors"
                  >
                    Afficher les {totalEquipements} équipements
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-surface-container p-8 border border-white/10 rounded-2xl sticky top-0">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <span className="text-2xl font-bold">{(apt.prix_nuit ?? apt.price ?? '—')} / nuit</span>
                    </div>
                    <div className="text-xs text-secondary font-bold uppercase tracking-widest">{apt.size}</div>
                  </div>
                  
                  <button className="w-full bg-secondary text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-all mb-4">
                    Réserver maintenant
                  </button>
                  
                  <p className="text-[10px] text-center text-on-surface-variant uppercase tracking-wider">
                    Aucun débit ne sera effectué pour le moment
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Full Photo Gallery Overlay */}
        <AnimatePresence>
          {showAllPhotos && (
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed inset-0 z-[110] bg-surface overflow-y-auto p-6 md:p-20"
            >
              <div className="max-w-4xl mx-auto">
                <button 
                  onClick={() => setShowAllPhotos(false)}
                  className="fixed top-8 left-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
                >
                  <X size={24} />
                </button>
                
                <h2 className="font-headline text-3xl mb-12 text-center">Toutes les photos</h2>
                
                <div className="flex flex-col gap-4">
                  {/* Custom layout: 1 image, then 2 images, then 1, then 2... */}
                  {Array.from({ length: Math.ceil(apt.images.length / 3) * 2 }).map((_, rowIndex) => {
                    const isFullWidth = rowIndex % 2 === 0;
                    const startIndex = Math.floor(rowIndex / 2) * 3 + (isFullWidth ? 0 : 1);
                    
                    if (startIndex >= apt.images.length) return null;

                    if (isFullWidth) {
                      return (
                        <div key={rowIndex} className="w-full aspect-video overflow-hidden rounded-xl cursor-pointer" onClick={() => setSelectedImage(apt.images[startIndex])}>
                          <img src={apt.images[startIndex]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                        </div>
                      );
                    } else {
                      const secondIndex = startIndex + 1;
                      return (
                        <div key={rowIndex} className="grid grid-cols-2 gap-4 aspect-[16/10]">
                          <div className="overflow-hidden rounded-xl cursor-pointer" onClick={() => setSelectedImage(apt.images[startIndex])}>
                            <img src={apt.images[startIndex]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                          </div>
                          {secondIndex < apt.images.length && (
                            <div className="overflow-hidden rounded-xl cursor-pointer" onClick={() => setSelectedImage(apt.images[secondIndex])}>
                              <img src={apt.images[secondIndex]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                            </div>
                          )}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full Amenities Overlay */}
        <AnimatePresence>
          {showAllAmenities && (
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="fixed inset-0 z-[115] bg-surface overflow-y-auto p-6 md:p-20"
            >
              <div className="max-w-3xl mx-auto">
                <button 
                  onClick={() => setShowAllAmenities(false)}
                  className="fixed top-8 left-8 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-20"
                >
                  <X size={24} />
                </button>
                
                <h2 className="font-headline text-3xl mb-12">Ce que propose ce logement</h2>
                
                <div className="space-y-4">
                  {Array.isArray(apt.equipements) && apt.equipements.length > 0 ? (
                    apt.equipements.map((eq, idx) => (
                      <div key={idx + '-' + (eq.label || '') + '-' + (eq.icon || '')} className="flex items-center gap-4 text-on-surface-variant text-base">
                        <div className="text-secondary shrink-0">
                          {getAmenityIcon(eq.icon || eq.label || '')}
                        </div>
                        {eq.label || '[Équipement]'}
                      </div>
                    ))
                  ) : (
                    <div className="text-on-surface-variant">Aucun équipement disponible.</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Full Screen Image Viewer */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[120] bg-black/95 flex items-center justify-center p-4 md:p-12"
              onClick={() => setSelectedImage(null)}
            >
              <button 
                className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors"
                onClick={() => setSelectedImage(null)}
              >
                <X size={32} />
              </button>
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={selectedImage}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}


export default function Residences({ appartements }: { appartements?: any[] }) {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const [selectedApt, setSelectedApt] = useState<any | null>(null);

  // Si pas de prop, fallback sur la version statique
  const data = appartements && appartements.length > 0 ? appartements : APARTMENTS;

  // Adapter les données pour le modal
  const getAptForModal = (apt: any) => {
    let amenities = apt.equipements || apt.amenities || [];
    if (Array.isArray(amenities) && amenities.length > 0 && typeof amenities[0] === 'string') {
      amenities = [{ title: 'Équipements', items: amenities }];
    }
    return {
      ...apt,
      images: apt.photos || apt.images || [],
      desc: apt.description_fr || apt.desc || '',
      amenities,
    };
  };

  // Ouvre le modal si l'URL contient un slug
  useEffect(() => {
    const slug = location.pathname.split('/').filter(Boolean)[0];
    if (slug) {
      const found = data.find((apt) => apt.slug === slug || apt.id === slug);
      if (found) setSelectedApt(found);
    } else {
      setSelectedApt(null);
    }
    // eslint-disable-next-line
  }, [location.pathname, data]);

  // Ouvre le modal et change l'URL
  const openModal = (apt: any) => {
    navigate('/' + (apt.slug || apt.id), { replace: false, state: { background: location } });
    setSelectedApt(apt);
  };

  // Ferme le modal et revient à la racine
  const closeModal = () => {
    navigate('/', { replace: false });
    setSelectedApt(null);
  };

  return (
    <section id="portfolio" className="py-32 px-6 md:px-12 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <p className="text-secondary font-label text-[10px] tracking-[0.3em] uppercase mb-4">
              Résidences
            </p>
            <h2 className="font-headline text-4xl md:text-5xl text-on-surface">
              Nos Appartements
            </h2>
          </div>
          <p className="max-w-md text-on-surface-variant font-light">
            Découvrez une sélection de suites prestigieuses adaptées à vos besoins, du studio exécutif au penthouse panoramique.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {data.map((apt, i) => (
            <motion.div
              key={apt.id || apt.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              className={`group relative bg-surface overflow-hidden ${apt.offset ? "md:-mt-12" : ""}`}
            >
              <ApartmentSlider images={apt.photos || apt.images || []} onImageClick={() => openModal(apt)} />
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-headline text-2xl text-on-surface">
                    {apt.titre_fr || apt.name}
                  </h3>
                  <span className="text-secondary font-label text-[10px] uppercase tracking-widest">
                    {apt.size || (apt.capacite ? `${apt.capacite} pers.` : "")}
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm mb-8 font-light leading-relaxed line-clamp-2">
                  {apt.description_fr || apt.desc}
                </p>
                <button 
                  onClick={() => openModal(apt)}
                  className="w-full py-4 border-b border-outline-variant text-secondary text-[10px] uppercase tracking-[0.3em] font-bold text-left flex justify-between items-center group/btn"
                >
                  Voir détails
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover/btn:translate-x-2"
                  />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedApt && (
        <DetailsModal 
          apt={getAptForModal(selectedApt)} 
          isOpen={!!selectedApt} 
          onClose={closeModal} 
        />
      )}
    </section>
  );
}
