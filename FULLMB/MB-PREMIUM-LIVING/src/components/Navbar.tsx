import { useState, useEffect } from "react";
import { Menu, X, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { IMAGES } from "../constants";
import { useSiteSettings } from "../hooks/useSiteSettings";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const siteSettings = useSiteSettings();
  const siteImages = siteSettings?.images ?? { logo: IMAGES.logo };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    
    { name: "Portfolio", href: "/galerie" },
    { name: "Blog", href: "/blog" },
    { name: "Avis", href: "/avis" },
    { name: "Services", href: "/#services" },
    { name: "Concierge", href: "/#concierge" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "glass-nav py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="w-full px-2 md:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src={siteImages.logo || IMAGES.logo} 
              alt="MB Prestige Living" 
              className="h-12 md:h-16 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 items-center">
          {navLinks.map((link) => (
            link.href.startsWith("/") && !link.href.includes("#") ? (
              <Link
                key={link.name}
                to={link.href}
                className="text-on-surface hover:text-primary transition-colors duration-300 uppercase tracking-widest text-[10px] font-semibold"
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-on-surface hover:text-primary transition-colors duration-300 uppercase tracking-widest text-[10px] font-semibold"
              >
                {link.name}
              </a>
            )
          ))}
          <button
            className="bg-secondary px-6 py-2.5 uppercase tracking-widest text-[10px] font-bold hover:opacity-80 transition-all duration-300"
            style={{ color: 'var(--button-text)' }}
          >
            RÉSERVER
          </button>
          
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-secondary p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-surface border-b border-white/5 md:hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                link.href.startsWith("/") && !link.href.includes("#") ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-on-surface text-sm uppercase tracking-widest font-semibold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-on-surface text-sm uppercase tracking-widest font-semibold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                )
              ))}
              <button
                className="bg-secondary px-8 py-4 uppercase tracking-widest text-xs font-bold w-full"
                style={{ color: 'var(--button-text)' }}
              >
                RÉSERVER
              </button>
              <Link 
                to="/admin" 
                className="text-on-surface-variant text-center text-xs uppercase tracking-widest font-bold py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Administration
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
