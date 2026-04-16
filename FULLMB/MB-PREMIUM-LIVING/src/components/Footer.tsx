import { useSiteSettings } from "../hooks/useSiteSettings";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Youtube, Linkedin } from "lucide-react";
import { IMAGES } from "../constants";

export default function Footer() {
  const siteSettings = useSiteSettings();
  const siteImages = siteSettings?.images ?? { logo: IMAGES.logo };

  const navLinks = [
    
    { name: "Portfolio", href: "/portfolio" },
    { name: "Blog", href: "/blog" },
    { name: "Avis", href: "/avis" },
    { name: "Services", href: "/#services" },
    { name: "Concierge", href: "/#concierge" },
    { name: "Contact", href: "/#contact" },
  ];

  const socialLinks = [
    { icon: <Instagram size={18} />, href: "#" },
    { icon: <Facebook size={18} />, href: "#" },
    { icon: <Twitter size={18} />, href: "#" },
    { icon: <Youtube size={18} />, href: "#" },
    { icon: <Linkedin size={18} />, href: "#" },
  ];

  return (
    <footer className="bg-surface flex flex-col items-center gap-12 py-20 px-12 w-full border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl gap-12">
        <div className="flex flex-col items-center md:items-start gap-6">
          <Link to="/">
            <img 
              src={siteImages.logo || IMAGES.logo} 
              alt="MB Prestige Living" 
              className="h-16 md:h-20 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </Link>
          <p className="text-on-surface-variant text-[10px] tracking-[0.2em] uppercase max-w-xs text-center md:text-left leading-relaxed">
            L'excellence de l'hospitalité haut de gamme à Cotonou. Votre confort est notre priorité absolue.
          </p>
          <div className="flex gap-6">
            {socialLinks.map((social, i) => (
              <a
                key={i}
                href={social.href}
                className="text-on-surface-variant hover:text-secondary transition-all hover:scale-110"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-6 font-body text-[10px] tracking-widest uppercase">
          {navLinks.map((link) => (
            link.href.startsWith("/") && !link.href.includes("#") ? (
              <Link
                key={link.name}
                to={link.href}
                className="text-on-surface-variant hover:text-on-surface transition-colors duration-300"
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-on-surface-variant hover:text-on-surface transition-colors duration-300"
              >
                {link.name}
              </a>
            )
          ))}
          
        </div>
      </div>

      <div className="w-full max-w-7xl h-[1px] bg-white/5"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-7xl gap-6">
        <div className="flex gap-8 text-[9px] uppercase tracking-widest text-on-surface-variant/60">
          <a href="#" className="hover:text-on-surface transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-on-surface transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-on-surface transition-colors">Imprint</a>
        </div>
        <div className="text-on-surface-variant text-[10px] tracking-[0.3em] uppercase">
          © {new Date().getFullYear()} MB Prestige Living. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
