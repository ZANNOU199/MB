import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Instagram, Facebook, Twitter, Youtube, Linkedin, ChevronsDown, Calendar, Users, Search, Plus, Minus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { IMAGES } from "../constants";
import { useSiteSettings } from "../hooks/useSiteSettings";

export default function Hero() {
  const siteSettings = useSiteSettings();
  const siteImages = siteSettings?.images ?? { heroHome: IMAGES.hero };

  const [isGuestsOpen, setIsGuestsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [babies, setBabies] = useState(0);
  const [hasPets, setHasPets] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
        setIsGuestsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const wasOpen = useRef(false);

  useEffect(() => {
    if (isCalendarOpen || isGuestsOpen) {
      wasOpen.current = true;
      // Small delay to allow the animation to start and layout to shift
      setTimeout(() => {
        const yOffset = -20; 
        const element = searchContainerRef.current;
        if (element) {
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 100);
    } else if (wasOpen.current) {
      // When closing, scroll back to the top of the hero with a slight delay
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
      wasOpen.current = false;
    }
  }, [isCalendarOpen, isGuestsOpen]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [viewDate, setViewDate] = useState(new Date());

  const handleDateClick = (date: Date) => {
    if (date < today) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(date);
      setEndDate(null);
    } else if (date > startDate) {
      setEndDate(date);
    } else {
      setStartDate(date);
      setEndDate(null);
    }
  };

  const nextMonth = () => {
    const next = new Date(viewDate);
    next.setMonth(next.getMonth() + 1);
    setViewDate(next);
  };

  const prevMonth = () => {
    const prev = new Date(viewDate);
    prev.setMonth(prev.getMonth() - 1);
    // Don't go before current month
    if (prev.getMonth() < new Date().getMonth() && prev.getFullYear() <= new Date().getFullYear()) return;
    setViewDate(prev);
  };

  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    // Get the first day of the week (0 = Sunday, 1 = Monday...)
    // Adjust to start with Monday (0 = Monday, 6 = Sunday)
    let firstDay = date.getDay() - 1;
    if (firstDay === -1) firstDay = 6;

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };

  const month1 = viewDate.getMonth();
  const year1 = viewDate.getFullYear();
  const month2 = (month1 + 1) % 12;
  const year2 = month1 === 11 ? year1 + 1 : year1;

  const days1 = useMemo(() => getDaysInMonth(year1, month1), [year1, month1]);
  const days2 = useMemo(() => getDaysInMonth(year2, month2), [year2, month2]);

  const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const formatDateRange = () => {
    if (!startDate) return "Sélectionnez vos dates";
    const startStr = `${startDate.getDate()} ${monthNames[startDate.getMonth()].substring(0, 3)}.`;
    if (!endDate) return `${startStr} - Départ`;
    const endStr = `${endDate.getDate()} ${monthNames[endDate.getMonth()].substring(0, 3)}.`;
    return `${startStr} - ${endStr}`;
  };

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-start pt-32 md:pt-40 lg:pt-48 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 z-0 lg:top-10 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: "easeOut" }}
          src={siteImages.heroHome || IMAGES.hero}
          alt="Hero background"
          className="w-full h-full object-cover opacity-60 scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/20 to-background/80"></div>
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]"></div>
      </div>

      <div className="relative z-10 text-center px-4 w-full max-w-6xl mx-auto">
        <motion.div
          ref={searchContainerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-5xl mx-auto mt-32 md:mt-12"
        >
          <div className="bg-transparent border border-white/20 p-0 rounded-none shadow-2xl flex flex-col md:flex-row items-stretch gap-0 backdrop-blur-sm">
            {/* Dates Filter */}
            <div 
              className="flex-[1.5] flex items-center gap-4 px-4 py-4 md:px-6 md:py-6 border-b md:border-b-0 md:border-r border-white/20 hover:bg-white/5 transition-colors cursor-pointer group relative"
              onClick={() => {
                setIsCalendarOpen(!isCalendarOpen);
                setIsGuestsOpen(false);
              }}
            >
              <Calendar className="text-secondary w-5 h-5 shrink-0" />
              <div className="text-left">
                <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Dates</span>
                <span className="text-sm font-medium text-on-surface">
                  {formatDateRange()}
                </span>
              </div>
            </div>

            {/* Guests Filter */}
            <div 
              className="flex-1 flex items-center gap-4 px-4 py-4 md:px-6 md:py-6 border-b md:border-b-0 md:border-r border-white/20 hover:bg-white/5 transition-colors cursor-pointer group relative"
              onClick={() => {
                setIsGuestsOpen(!isGuestsOpen);
                setIsCalendarOpen(false);
              }}
            >
              <Users className="text-secondary w-5 h-5 shrink-0" />
              <div className="text-left">
                <span className="block text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">Voyageurs</span>
                <span className="text-sm font-medium text-on-surface">
                  {adults + children + babies} personnes{hasPets ? ", Animaux" : ""}, 1 chambre
                </span>
              </div>
            </div>

            {/* Search Button */}
            <button className="bg-secondary text-white px-8 py-4 md:px-12 md:py-0 flex items-center justify-center gap-3 hover:opacity-90 transition-all group">
              <Search className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Rechercher</span>
            </button>
          </div>

          {/* Expanding Dropdowns Container */}
          <AnimatePresence mode="wait">
            {isCalendarOpen && (
              <motion.div
                key="calendar-dropdown"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div 
                  className="w-full bg-surface border border-white/10 shadow-2xl p-8 text-left mt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="font-headline text-lg text-on-surface">Sélectionnez vos dates</h4>
                    <div className="flex items-center gap-4">
                      <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-full text-on-surface transition-colors">
                        <ChevronLeft size={20} />
                      </button>
                      <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-full text-on-surface transition-colors">
                        <ChevronRight size={20} />
                      </button>
                      <button onClick={() => setIsCalendarOpen(false)} className="text-on-surface-variant hover:text-on-surface ml-2">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Month 1 */}
                    <div>
                      <div className="text-center mb-6 font-bold uppercase tracking-widest text-[10px] text-secondary">
                        {monthNames[month1]} {year1}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                        {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => <div key={d} className="text-on-surface-variant font-bold py-2">{d}</div>)}
                        {days1.map((date, i) => {
                          if (!date) return <div key={`empty1-${i}`} className="py-3"></div>;
                          
                          const isPast = date < today;
                          const isSelected = (startDate && date.getTime() === startDate.getTime()) || (endDate && date.getTime() === endDate.getTime());
                          const isInRange = startDate && endDate && date > startDate && date < endDate;

                          return (
                            <div 
                              key={date.getTime()} 
                              onClick={() => !isPast && handleDateClick(date)}
                              className={`py-3 cursor-pointer transition-all relative ${
                                isPast ? "opacity-20 cursor-not-allowed" : 
                                isSelected ? "bg-secondary text-white font-bold" : 
                                isInRange ? "bg-secondary/20 text-on-surface" :
                                "hover:bg-white/5 text-on-surface"
                              }`}
                            >
                              {date.getDate()}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    {/* Month 2 */}
                    <div className="hidden md:block">
                      <div className="text-center mb-6 font-bold uppercase tracking-widest text-[10px] text-secondary">
                        {monthNames[month2]} {year2}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-[10px]">
                        {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => <div key={d} className="text-on-surface-variant font-bold py-2">{d}</div>)}
                        {days2.map((date, i) => {
                          if (!date) return <div key={`empty2-${i}`} className="py-3"></div>;
                          
                          const isPast = date < today;
                          const isSelected = (startDate && date.getTime() === startDate.getTime()) || (endDate && date.getTime() === endDate.getTime());
                          const isInRange = startDate && endDate && date > startDate && date < endDate;

                          return (
                            <div 
                              key={date.getTime()} 
                              onClick={() => !isPast && handleDateClick(date)}
                              className={`py-3 cursor-pointer transition-all relative ${
                                isPast ? "opacity-20 cursor-not-allowed" : 
                                isSelected ? "bg-secondary text-white font-bold" : 
                                isInRange ? "bg-secondary/20 text-on-surface" :
                                "hover:bg-white/5 text-on-surface"
                              }`}
                            >
                              {date.getDate()}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex justify-between items-center border-t border-white/10 pt-6">
                    <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                      {startDate && !endDate ? "Sélectionnez la date de départ" : ""}
                    </div>
                    <button 
                      onClick={() => setIsCalendarOpen(false)}
                      className="bg-secondary text-white px-8 py-3 uppercase tracking-[0.2em] text-[10px] font-bold hover:opacity-90 transition-all"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {isGuestsOpen && (
              <motion.div
                key="guests-dropdown"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div 
                  className="w-full md:w-[400px] md:ml-auto bg-surface border border-white/10 shadow-2xl p-8 text-left mt-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-8">
                    <h4 className="font-headline text-lg text-on-surface">Chambre 1</h4>
                    <button onClick={() => setIsGuestsOpen(false)} className="text-on-surface-variant hover:text-on-surface">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-8">
                    {/* Adults */}
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block text-sm font-medium text-on-surface">Adultes</span>
                        <span className="block text-[10px] text-on-surface-variant uppercase tracking-wider">13 ans et plus</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-on-surface"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium w-12 text-center">{adults.toString().padStart(2, '0')} Adultes</span>
                        <button 
                          onClick={() => setAdults(adults + 1)}
                          className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-on-surface"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block text-sm font-medium text-on-surface">Enfants</span>
                        <span className="block text-[10px] text-on-surface-variant uppercase tracking-wider">De 2 à 12 ans</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-on-surface"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium w-12 text-center">{children.toString().padStart(2, '0')} Enfants</span>
                        <button 
                          onClick={() => setChildren(children + 1)}
                          className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-on-surface"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Babies */}
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="block text-sm font-medium text-on-surface">Bébés</span>
                        <span className="block text-[10px] text-on-surface-variant uppercase tracking-wider">- de 2 ans</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setBabies(Math.max(0, babies - 1))}
                          className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-on-surface"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-sm font-medium w-12 text-center">{babies.toString().padStart(2, '0')} Bébés</span>
                        <button 
                          onClick={() => setBabies(babies + 1)}
                          className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 text-on-surface"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Pets */}
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <div>
                        <span className="block text-sm font-medium text-on-surface">Animaux domestiques</span>
                        <button className="block text-[10px] text-secondary uppercase tracking-wider hover:underline text-left">
                          Vous voyagez avec un animal d'assistance ?
                        </button>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setHasPets(!hasPets)}
                          className={`w-12 h-6 rounded-full transition-colors relative ${hasPets ? "bg-secondary" : "bg-white/10"}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${hasPets ? "left-7" : "left-1"}`}></div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setIsGuestsOpen(false)}
                    className="w-full bg-secondary text-white py-4 mt-8 uppercase tracking-[0.2em] text-[10px] font-bold hover:opacity-90 transition-all"
                  >
                    Valider
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Social Media Icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col items-center gap-4 max-w-md mx-auto mt-24"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
            Suivez-nous :
          </span>
          <div className="flex gap-8">
            <a
              href="#"
              className="text-on-surface hover:text-secondary transition-all hover:scale-125"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-on-surface hover:text-secondary transition-all hover:scale-125"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-on-surface hover:text-secondary transition-all hover:scale-125"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-on-surface hover:text-secondary transition-all hover:scale-125"
            >
              <Youtube className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-on-surface hover:text-secondary transition-all hover:scale-125"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <ChevronsDown className="text-secondary w-8 h-8" />
      </motion.div>
    </section>
  );
}
